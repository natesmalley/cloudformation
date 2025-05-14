import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as eks from 'aws-cdk-lib/aws-eks';
import { KubernetesManifest } from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import { KubectlV28Layer } from '@aws-cdk/lambda-layer-kubectl-v28';

export interface EksOperatorsCdkStackProps extends cdk.StackProps {
  readonly createCluster: boolean;
  readonly eksClusterName?: string;
}

export class EksOperatorsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EksOperatorsCdkStackProps) {
    super(scope, id, props);

    // 1) Auto-create a VPC in two AZs, with public & private subnets
    const vpc = new cdk.aws_ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        { name: 'Public',  subnetType: cdk.aws_ec2.SubnetType.PUBLIC,      cidrMask: 24 },
        { name: 'Private', subnetType: cdk.aws_ec2.SubnetType.PRIVATE_WITH_NAT, cidrMask: 24 },
      ],
    });

    if (props.createCluster) {
      const kubectlLayer = new KubectlV28Layer(this, 'KubectlLayer');

      // 3) EKS cluster itself (no default compute)
      const cluster = new eks.Cluster(this, 'EksCluster', {
        clusterName: props.eksClusterName,
        vpc,
        placeClusterHandlerInVpc: false,
        kubectlLayer,
        version: eks.KubernetesVersion.V1_28,
        defaultCapacity: 0,
      });

      // Attach additional IAM policies to the Helm provider role
      if (cluster.kubectlRole) {
        cluster.kubectlRole.addManagedPolicy(
          iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonElasticContainerRegistryPublicReadOnly')
        );
        cluster.kubectlRole.addManagedPolicy(
          iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSClusterPolicy')
        );
      }

      const bedrockSa = cluster.addServiceAccount('BedrockServiceAccount', {
        name: 'bedrock-sa',
        namespace: 'default',
      });
      bedrockSa.role.addManagedPolicy(
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonBedrockFullAccess')
      );

      // Allow the Testing_acct IAM role to assume and administer the cluster via kubectl
      const testingRole = iam.Role.fromRoleArn(this, 'TestingRole', 'arn:aws:iam::307946665489:role/YourTestingRole');
      cluster.awsAuth.addMastersRole(testingRole);

      // 4) Managed NodeGroup of 2 t3.medium
      cluster.addNodegroupCapacity('DefaultNodes', {
        desiredSize: 2,
        maxSize:     2,
        minSize:     2,
        instanceTypes: [ new cdk.aws_ec2.InstanceType('t3.medium') ],
      });

      // Ensure Helm charts apply after CRDs
      // Create ack-sagemaker namespace
      const ackSageMakerNs = cluster.addManifest('AckSageMakerNamespace', {
        apiVersion: 'v1',
        kind: 'Namespace',
        metadata: { name: 'ack-sagemaker' }
      });

      // Lambda to clean up stuck Helm releases and release secrets for ACK controllers
      // (This is a sample; in production, use a proper Lambda construct and permissions)
      const cleanupAckSageMakerFn = new cdk.aws_lambda.Function(this, 'CleanupAckSageMakerFn', {
        runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        code: cdk.aws_lambda.Code.fromInline(`
          const { execSync } = require('child_process');
          exports.handler = async () => {
            // Uninstall any stuck Helm releases to clear pending-install locks
            try {
              execSync('helm uninstall ack-sagemaker -n ack-sagemaker --wait --timeout 60s || true');
            } catch (err) {
              console.warn('Helm uninstall ack-sagemaker failed or no release:', err.message);
            }
            try {
              execSync('helm uninstall ack-s3 -n ack-s3 --wait --timeout 60s || true');
            } catch (err) {
              console.warn('Helm uninstall ack-s3 failed or no release:', err.message);
            }
            // Remove any leftover Helm release secrets
            execSync('kubectl delete secret sh.helm.release.v1.ack-sagemaker.* -n ack-sagemaker --ignore-not-found');
            return { PhysicalResourceId: 'cleanup-ack-sagemaker' };
          };
        `),
        timeout: cdk.Duration.minutes(2),
        layers: [kubectlLayer],
        environment: {},
      });

      // 5) Install SageMaker ACK Controller via Helm
      const ackSageMaker = new eks.HelmChart(this, 'ACKSageMaker', {
        cluster,
        release: 'ack-sagemaker',
        chart: 'sagemaker-chart',
        version: '1.2.16',
        repository: 'oci://public.ecr.aws/aws-controllers-k8s/sagemaker-chart',
        namespace: 'ack-sagemaker',
        createNamespace: true,
        skipCrds: false,
        wait: true,
        atomic: true,
        timeout: cdk.Duration.minutes(15),
      });
      ackSageMaker.node.addDependency(ackSageMakerNs);

      // 5a) Verify SageMaker controller deployment readiness
      const checkSageMakerFn = new cdk.aws_lambda.Function(this, 'CheckAckSageMakerFn', {
        runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        code: cdk.aws_lambda.Code.fromInline(`
          const { execSync } = require('child_process');
          exports.handler = async () => {
            // Wait for SageMaker ACK controller deployment to be ready
            execSync('kubectl rollout status deployment ack-sagemaker-controller -n ack-sagemaker --timeout=300s');
            return { PhysicalResourceId: 'check-ack-sagemaker' };
          };
        `),
        layers: [kubectlLayer],
        timeout: cdk.Duration.minutes(6),
      });
      const checkSageMakerProvider = new cdk.custom_resources.Provider(this, 'CheckAckSageMakerProvider', {
        onEventHandler: checkSageMakerFn,
      });
      const checkAckSageMaker = new cdk.CustomResource(this, 'CheckAckSageMaker', {
        serviceToken: checkSageMakerProvider.serviceToken,
      });
      checkAckSageMaker.node.addDependency(ackSageMaker);

      // 6) Install S3 ACK Controller via Helm
      const ackS3 = new eks.HelmChart(this, 'ACKS3', {
        cluster,
        release: 'ack-s3',
        chart: 's3-chart',
        version: '1.0.28',
        repository: 'oci://public.ecr.aws/aws-controllers-k8s/s3-chart',
        namespace: 'ack-s3',
        createNamespace: true,
        skipCrds: false,
        wait: true,
        atomic: true,
        timeout: cdk.Duration.minutes(15),
      });
      ackS3.node.addDependency(ackSageMaker);

      // 5) Example SageMaker TrainingJob CR and 6) Example Bedrock InferenceJob CR combined
      const trainingJobObject = {
        apiVersion: 'sagemaker.services.k8s.aws/v1alpha1',
        kind:       'TrainingJob',
        metadata:   { name: 'example-training-job', namespace: 'default' },
        spec: {
          trainingJobName: 'example-job',
          algorithmSpecification: {
            trainingImage: '382416733822.dkr.ecr.us-east-2.amazonaws.com/linear-learner:latest',
            trainingInputMode: 'File'
          },
          roleArn: cluster.kubectlRole!.roleArn,
          inputDataConfig: [{
            channelName: 'train',
            dataSource: {
              s3DataSource: {
                s3Uri: 's3://bucket/path/train/',
                s3DataType: 'S3Prefix'
              }
            }
          }],
          outputDataConfig: {
            s3OutputPath: 's3://bucket/path/output/'
          },
          resourceConfig: {
            instanceCount: 1,
            instanceType: 'ml.t2.medium',
            volumeSizeInGB: 10
          },
          stoppingCondition: {
            maxRuntimeInSeconds: 3600
          }
        }
      };
      const inferenceJobObject = {
        apiVersion: 'bedrock.services.k8s.aws/v1alpha1',
        kind:       'InferenceJob',
        metadata:   { name: 'example-inference-job', namespace: 'default' },
        spec: {
          jobName: 'example-inference',
          roleArn: cluster.kubectlRole!.roleArn,
          model: {
            modelId: 'anthropic.claude-v1'
          },
          inferenceUnits: 1,
          input: {
            inputText: 'Hello, world!'
          }
        }
      };
      const exampleJobsManifest = cluster.addManifest('ExampleJobs', [
        trainingJobObject,
        inferenceJobObject
      ]);
      exampleJobsManifest.node.addDependency(ackS3);

      // 7) Combine Bedrock Deployment and Service manifests
      const bedrockSampleManifest = cluster.addManifest('BedrockSample', [
        {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          metadata: { name: 'bedrock-sample', namespace: 'default' },
          spec: {
            replicas: 1,
            selector: { matchLabels: { app: 'bedrock-sample' } },
            template: {
              metadata: { labels: { app: 'bedrock-sample' } },
              spec: {
                containers: [{
                  name: 'bedrock-sample',
                  image: 'public.ecr.aws/aws-containers/bedrock-sample:latest',
                  ports: [{ containerPort: 8080 }]
                }]
              }
            }
          }
        },
        {
          apiVersion: 'v1',
          kind: 'Service',
          metadata: { name: 'bedrock-sample', namespace: 'default' },
          spec: {
            type: 'LoadBalancer',
            ports: [{ port: 80, targetPort: 8080, protocol: 'TCP', name: 'http' }],
            selector: { app: 'bedrock-sample' }
          }
        }
      ]);
      bedrockSampleManifest.node.addDependency(exampleJobsManifest);

      // 8) Combine DVWA StatefulSet, Service, Deployment, and Service manifests
      const dvwaAllManifest = cluster.addManifest('DvwaAll', [
        {
          apiVersion: 'apps/v1',
          kind: 'StatefulSet',
          metadata: { name: 'dvwa-db', labels: { app: 'dvwa', component: 'mysql' }, namespace: 'default' },
          spec: {
            serviceName: 'dvwa-db',
            replicas: 1,
            selector: { matchLabels: { app: 'dvwa', component: 'mysql' } },
            template: {
              metadata: { labels: { app: 'dvwa', component: 'mysql' } },
              spec: {
                containers: [{
                  name: 'mysql',
                  image: 'mysql:5.7',
                  ports: [{ name: 'mysql', containerPort: 3306 }],
                  env: [
                    { name: 'MYSQL_ROOT_PASSWORD', value: 'p@ssw0rd' },
                    { name: 'MYSQL_DATABASE', value: 'dvwa' },
                    { name: 'MYSQL_USER', value: 'dvwa' },
                    { name: 'MYSQL_PASSWORD', value: 'p@ssw0rd' }
                  ],
                  readinessProbe: {
                    exec: { command: ['sh','-c','mysqladmin ping -h 127.0.0.1 -u dvwa -pp@ssw0rd'] },
                    initialDelaySeconds: 20,
                    periodSeconds: 10
                  },
                  livenessProbe: {
                    exec: { command: ['sh','-c','mysqladmin ping -h 127.0.0.1 -u dvwa -pp@ssw0rd'] },
                    initialDelaySeconds: 30,
                    periodSeconds: 10
                  },
                  volumeMounts: [{ name: 'db-data', mountPath: '/var/lib/mysql' }]
                }]
              }
            },
            volumeClaimTemplates: [{
              metadata: { name: 'db-data' },
              spec: {
                accessModes: ['ReadWriteOnce'],
                resources: { requests: { storage: '5Gi' } }
              }
            }]
          }
        },
        {
          apiVersion: 'v1',
          kind: 'Service',
          metadata: { name: 'dvwa-db', labels: { app: 'dvwa', component: 'mysql' }, namespace: 'default' },
          spec: {
            type: 'ClusterIP',
            ports: [{ port: 3306, targetPort: 'mysql', name: 'mysql' }],
            selector: { app: 'dvwa', component: 'mysql' }
          }
        },
        {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          metadata: { name: 'dvwa', namespace: 'default' },
          spec: {
            replicas: 2,
            selector: { matchLabels: { app: 'dvwa' } },
            template: {
              metadata: { labels: { app: 'dvwa' } },
              spec: {
                containers: [{
                  name: 'dvwa',
                  image: 'vulnerables/web-dvwa:latest',
                  ports: [{ containerPort: 80 }],
                  env: [
                    { name: 'MYSQL_HOST', value: 'dvwa-db' },
                    { name: 'MYSQL_USER', value: 'dvwa' },
                    { name: 'MYSQL_PASSWORD', value: 'p@ssw0rd' },
                    { name: 'MYSQL_DBNAME', value: 'dvwa' }
                  ],
                  readinessProbe: {
                    httpGet: { path: '/login.php', port: 80 },
                    initialDelaySeconds: 10,
                    periodSeconds: 5
                  },
                  livenessProbe: {
                    httpGet: { path: '/login.php', port: 80 },
                    initialDelaySeconds: 20,
                    periodSeconds: 10
                  }
                }]
              }
            }
          }
        },
        {
          apiVersion: 'v1',
          kind: 'Service',
          metadata: { name: 'dvwa', namespace: 'default' },
          spec: {
            type: 'LoadBalancer',
            ports: [{ port: 80, targetPort: 80, protocol: 'TCP', name: 'http' }],
            selector: { app: 'dvwa' }
          }
        }
      ]);
      dvwaAllManifest.node.addDependency(bedrockSampleManifest);
    }
  }
}