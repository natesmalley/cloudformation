import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { KubectlV28Layer } from '@aws-cdk/lambda-layer-kubectl-v28';

export interface EksOperatorsCdkStackProps extends cdk.StackProps {
  readonly createCluster: boolean;
  readonly eksClusterName?: string;
}

export class EksOperatorsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EksOperatorsCdkStackProps) {
    super(scope, id, props);

    // 1) Auto-create a VPC in two AZs, with public & private subnets
    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        { name: 'Public',  subnetType: ec2.SubnetType.PUBLIC,      cidrMask: 24 },
        { name: 'Private', subnetType: ec2.SubnetType.PRIVATE_WITH_NAT, cidrMask: 24 },
      ],
    });

    if (props.createCluster) {
      // 2) Kubectl Layer (for custom-resources & Helm provider lambdas)
      const kubectlLayer = new KubectlV28Layer(this, 'KubectlLayer');

      // 3) EKS cluster itself (no default compute)
      const cluster = new eks.Cluster(this, 'EksCluster', {
        clusterName: props.eksClusterName,
        vpc,
        version: eks.KubernetesVersion.V1_28,
        defaultCapacity: 0,
        kubectlLayer,
      });

      // Allow the Testing_acct IAM role to assume and administer the cluster via kubectl
      const testingRole = iam.Role.fromRoleArn(this, 'TestingRole', 'arn:aws:iam::307946665489:role/YourTestingRole');
      cluster.awsAuth.addMastersRole(testingRole);

      // 4) Managed NodeGroup of 2 t3.medium
      cluster.addNodegroupCapacity('DefaultNodes', {
        desiredSize: 2,
        maxSize:     2,
        minSize:     2,
        instanceTypes: [ new ec2.InstanceType('t3.medium') ],
      });

      // ---------------------------------------------------------------------------
      // 4a) Ensure the ack-system namespace exists before anything needs it
      // ---------------------------------------------------------------------------
      const ackSystemNs = cluster.addManifest('AckSystemNamespace', {
        apiVersion: 'v1',
        kind: 'Namespace',
        metadata: { name: 'ack-system' },
      });

      // ---------------------------------------------------------------------------
      // 5) IRSA ServiceAccount for SageMaker ACK controller
      // ---------------------------------------------------------------------------
      const sageMakerSa = cluster.addServiceAccount('SageMakerSA', {
        name:      'ack-sagemaker-controller',
        namespace: 'ack-system',
      });
      sageMakerSa.role.addManagedPolicy(
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess'),
      );
      sageMakerSa.node.addDependency(ackSystemNs);

      // ---------------------------------------------------------------------------
      // 6) In-cluster Job to remove any stuck Helm release or secret
      // ---------------------------------------------------------------------------
      const cleanupJob = cluster.addManifest('CleanupAckJob', {
        apiVersion: 'batch/v1',
        kind:       'Job',
        metadata:   { name: 'cleanup-ack-sagemaker', namespace: 'ack-system' },
        spec: {
          backoffLimit: 1,
          template: {
            spec: {
              serviceAccountName: sageMakerSa.serviceAccountName,
              restartPolicy: 'Never',
              containers: [{
                name: 'cleanup',
                image: 'bitnami/kubectl:latest',
                command: ['sh','-c', `
                  helm uninstall ack-sagemaker -n ack-system --wait --timeout 120s || true
                  kubectl delete secret -n ack-system -l "owner=helm,name=ack-sagemaker" --ignore-not-found
                `],
              }],
            },
          },
        },
      });
      cleanupJob.node.addDependency(sageMakerSa);
      cleanupJob.node.addDependency(ackSystemNs);

// ---------------------------------------------------------------------------
// 7) SageMaker ACK controller Helm chart (atomic, wait)
// ---------------------------------------------------------------------------
const ackSageMaker = new eks.HelmChart(this, 'AckSageMaker', {
  cluster,
  release: 'ack-sagemaker',
  chart:   'sagemaker-chart',
  repository: 'oci://public.ecr.aws/aws-controllers-k8s/sagemaker-chart',
  version: '1.2.16',
  namespace: 'ack-system',
  createNamespace: true,
  atomic:  true,
  wait:    true,
  timeout: cdk.Duration.minutes(15),
  values: {
    aws: { region: this.region },
    serviceAccount: {
      create: false,
      name:   sageMakerSa.serviceAccountName,
      annotations: {
        'eks.amazonaws.com/role-arn': sageMakerSa.role.roleArn,
      },
    },
  },
});
ackSageMaker.node.addDependency(cleanupJob);

// ---------------------------------------------------------------------------
// 8) Example SageMaker TrainingJob CR (depends on controller)
// ---------------------------------------------------------------------------
// trainingJobManifest.node.addDependency(ackSageMaker);

// ---------------------------------------------------------------------------
// 9) Example Bedrock or DVWA manifests (if kept) also depend on controller
// ---------------------------------------------------------------------------
// inferenceJobManifest.node.addDependency(ackSageMaker);
// dvwaAppDeployment?.node.addDependency(ackSageMaker); 
    }
  }
}