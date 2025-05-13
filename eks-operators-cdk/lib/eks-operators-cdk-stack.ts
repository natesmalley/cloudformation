import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as eks from 'aws-cdk-lib/aws-eks';
import { KubernetesManifest } from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import { KubectlV28Layer } from '@aws-cdk/lambda-layer-kubectl-v28';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

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

      // Pre-install ACK CRDs in manageable chunks, sequentially to avoid Lambda rate limits
      const crdsPath = path.join(__dirname, '..', 'ack-crds.yaml');
      const crdsYaml = fs.readFileSync(crdsPath, 'utf8');
      const allDocs = yaml.loadAll(crdsYaml) as any[];
      const chunkSize = 20; // larger chunk size to reduce number of manifests
      const crdManifests: eks.KubernetesManifest[] = [];
      for (let i = 0; i < allDocs.length; i += chunkSize) {
        const group = allDocs.slice(i, i + chunkSize);
        const manifest = cluster.addManifest(
          `AckControllersCRDsPart${Math.floor(i / chunkSize)}`,
          ...group
        );
        crdManifests.push(manifest);
      }
      // Chain dependencies so they apply one after another
      for (let i = 1; i < crdManifests.length; i++) {
        crdManifests[i].node.addDependency(crdManifests[i - 1]);
      }

      // 5) Install SageMaker ACK Controller via Helm
      const ackSageMaker = new eks.HelmChart(this, 'ACKSageMaker', {
        cluster,
        chart: 'sagemaker-chart',
        version: '1.2.17',
        repository: 'oci://public.ecr.aws/aws-controllers-k8s/sagemaker-chart',
        namespace: 'ack-sagemaker',
        createNamespace: true,
        skipCrds: false,
        wait: true,
        atomic: false,
        timeout: cdk.Duration.minutes(15),
      });

      // 6) Install S3 ACK Controller via Helm
      const ackS3 = new eks.HelmChart(this, 'ACKS3', {
        cluster,
        chart: 's3-chart',
        version: '1.4.4',
        repository: 'oci://public.ecr.aws/aws-controllers-k8s/s3-chart',
        namespace: 'ack-s3',
        createNamespace: true,
        skipCrds: false,
        wait: true,
        atomic: false,
        timeout: cdk.Duration.minutes(15),
      });

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
      exampleJobsManifest.node.addDependency(ackSageMaker);
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
      bedrockSampleManifest.node.addDependency(ackSageMaker);
      bedrockSampleManifest.node.addDependency(ackS3);

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
      dvwaAllManifest.node.addDependency(ackSageMaker);
      dvwaAllManifest.node.addDependency(ackS3);
    }
  }
}