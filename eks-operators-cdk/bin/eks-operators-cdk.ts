import * as cdk from 'aws-cdk-lib';
import * as eks from 'aws-cdk-lib/aws-eks';
import { Construct } from 'constructs';
import { KubectlV28Layer } from '@aws-cdk/lambda-layer-kubectl-v28';
import * as iam from 'aws-cdk-lib/aws-iam';

export class EksOperatorsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // before creating the cluster
    const kubectlLayer = new KubectlV28Layer(this, 'KubectlLayer');

    const cluster = new eks.Cluster(this, 'EksCluster', {
      version: eks.KubernetesVersion.V1_21,
      kubectlLayer,  // add this line
    });

    // Create Bedrock IRSA ServiceAccount
    const bedrockSa = cluster.addServiceAccount('BedrockServiceAccount', {
      name: 'bedrock-sa',
      namespace: 'default',
    });
    bedrockSa.role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonBedrockFullAccess')
    );

    // 5) Install ACK Helm Chart
    const ack = new eks.HelmChart(this, 'ACKHelmChart', {
      cluster,
      chart: 'ack-chart',
      version: '46.24.0',
      repository: 'oci://public.ecr.aws/aws-controllers-k8s/ack-chart',
      namespace: 'ack-system',
      createNamespace: true,
      wait: true,
      atomic: true,
      timeout: cdk.Duration.minutes(10),
      skipCrds: false,
    });

    // 6) Deploy Bedrock sample application
    cluster.addManifest('BedrockApp', {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: { name: 'bedrock-sample', namespace: 'default' },
      spec: {
        replicas: 2,
        selector: { matchLabels: { app: 'bedrock-sample' } },
        template: {
          metadata: { labels: { app: 'bedrock-sample' } },
          spec: {
            serviceAccountName: bedrockSa.serviceAccountName,
            containers: [{
              name: 'bedrock-sample',
              image: `${cdk.Aws.ACCOUNT_ID}.dkr.ecr.${cdk.Aws.REGION}.amazonaws.com/bedrock-sample:latest`,
              ports: [{ containerPort: 8080 }],
              env: [{ name: 'BEDROCK_MODEL_ID', value: 'anthropic.claude-v1' }]
            }]
          }
        }
      }
    });
    cluster.addManifest('BedrockService', {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: { name: 'bedrock-sample', namespace: 'default' },
      spec: {
        type: 'LoadBalancer',
        selector: { app: 'bedrock-sample' },
        ports: [{ port: 80, targetPort: 8080 }]
      }
    });
  }
}