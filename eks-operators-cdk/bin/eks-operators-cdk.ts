#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EksOperatorsCdkStack } from '../lib/eks-operators-cdk-stack';

const app = new cdk.App();
new EksOperatorsCdkStack(app, 'EksOperatorsCdkStack', {
  createCluster: app.node.tryGetContext('createCluster') === 'true',
  eksClusterName: app.node.tryGetContext('eksClusterName'),
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});