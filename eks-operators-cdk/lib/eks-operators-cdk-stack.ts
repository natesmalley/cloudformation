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

      // 5) Install ACK controllers via Helm
      const ack = new eks.HelmChart(this, 'ACKControllers', {
        cluster,
        chart:      'ack-chart',
        version:    '46.24.0',
        release:    'ack-controllers',
        repository: 'oci://public.ecr.aws/aws-controllers-k8s/ack-chart',
        namespace:  'ack-system',
        createNamespace: true,
        wait: true,
        timeout: cdk.Duration.minutes(5),
        values: {
          sagemaker: {
            enabled: true,
            aws: {
              region: this.region,
              accountId: this.account,
            },
            serviceAccount: {
              create: false,
              name: 'sagemaker-k8s-operator',
              annotations: {
                'eks.amazonaws.com/role-arn': cluster.kubectlRole!.roleArn
              }
            }
          },
          bedrock: {
            enabled: true,
            aws: {
              region: this.region,
              accountId: this.account,
            },
            serviceAccount: {
              create: false,
              name: 'bedrock-k8s-operator',
              annotations: {
                'eks.amazonaws.com/role-arn': cluster.kubectlRole!.roleArn
              }
            }
          }
        }
      });

      // 6) Example SageMaker TrainingJob CR
      const trainingJobManifest = new eks.KubernetesManifest(this, 'ExampleTrainingJob', {
        cluster,
        manifest: [
          {
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
          }
        ]
      });
      trainingJobManifest.node.addDependency(ack);

      // 7) Example Bedrock InferenceJob CR
      const inferenceJobManifest = new eks.KubernetesManifest(this, 'ExampleInferenceJob', {
        cluster,
        manifest: [
          {
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
          }
        ]
      });
      inferenceJobManifest.node.addDependency(ack);
    }
  }
}