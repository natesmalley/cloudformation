import * as cdk from 'aws-cdk-lib';
import { EksOperatorsCdkStack } from '../lib/eks-operators-cdk-stack';

const app = new cdk.App();

// Read context flags
const createCluster = app.node.tryGetContext('createCluster') === 'true';
const eksClusterName = app.node.tryGetContext('eksClusterName');

if (createCluster && !eksClusterName) {
  throw new Error('Missing required context "eksClusterName".');
}

new EksOperatorsCdkStack(app, 'EksOperatorsCdkStack', {
  createCluster,
  eksClusterName,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});