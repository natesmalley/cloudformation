# Purple Demo — CloudFormation Edition 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **⚠️ SECURITY WARNING**  
> This infrastructure is intentionally vulnerable and contains deliberate misconfigurations. Use for demos and testing only. Do not deploy to production.

## Overview

The **Purple Demo — CloudFormation Edition** deploys a deliberately vulnerable DVWA environment on AWS using a CloudFormation parent stack and CDK EKS Blueprints. This subproject provides:

- Legacy CloudFormation templates (`00-purple-infra.yml`, `01-vpc.yml`, ..., `05-cloudtrail.yml`)
- A Lambda-backed stack (`90-eks-blueprints.yml`) that runs a CDK app for EKS Blueprints.

## Prerequisites

- AWS CLI v2 with configured credentials
- Node.js v16+ and npm
- AWS CDK v2 (`npm install -g aws-cdk`)
- Python 3.8+ (if using SAM)
- AWS SAM CLI (optional)
- AWS permissions to create IAM, VPC, EC2, EKS, CloudTrail, etc.

## Repository Layout

```
cloudformation/
├── 00-purple-infra.yml          Legacy parent orchestration
├── 01-vpc.yml                   VPC + flow logs
├── 02-shared-services.yml       Vulnerable S3 bucket
├── 03-eks.yml                   Legacy direct EKS CFN template
├── 04-ec2.yml                   Optional DVWA EC2 host
├── 05-cloudtrail.yml            CloudTrail trail configuration
├── 90-eks-blueprints.yml        Lambda wrapper for CDK EKS Blueprints
├── 90-eks-build-app/            CDK v2 project using EKS Blueprints
│   ├── bin/main.ts
│   ├── lib/
│   ├── package.json
│   └── tsconfig.json
├── template.yaml                (if using SAM)
├── trust-policy.json
├── tsconfig.json
└── vpc.yaml                     Additional CFN module example
```

## Build & Deployment

### 1. Build CDK App

```bash
cd cloudformation/90-eks-build-app
npm ci
npm run build
```

### 2. Package Blueprint Artifact

```bash
cd ../
zip -r eks-blueprints-app.zip \
  90-eks-build-app/lib \
  90-eks-build-app/node_modules \
  90-eks-build-app/package.json \
  90-eks-build-app/tsconfig.json \
  90-eks-build-app/cdk.json
```

### 3. Upload to S3

```bash
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
BUCKET="purple-cdk-assets-$ACCOUNT"
aws s3api create-bucket --bucket "$BUCKET" || true
aws s3 cp eks-blueprints-app.zip s3://$BUCKET/
```

### 4. Deploy Stacks

#### Legacy Stacks

```bash
aws cloudformation deploy \
  --template-file 00-purple-infra.yml \
  --stack-name purple-infra \
  --capabilities CAPABILITY_NAMED_IAM
# Repeat for 01-05 as needed
```

#### Blueprint Stack

```bash
aws cloudformation deploy \
  --template-file 90-eks-blueprints.yml \
  --stack-name purple-eks \
  --parameter-overrides CodeBucket=$BUCKET CodeKey=eks-blueprints-app.zip \
  --capabilities CAPABILITY_NAMED_IAM
```

## Retrieving Cluster Details

```bash
aws eks update-kubeconfig --region us-east-1 --name purple-eks
kubectl get nodes -o wide
kubectl get pods -A
```

## Cleanup

```bash
aws cloudformation delete-stack --stack-name purple-eks
# And delete legacy stacks:
aws cloudformation delete-stack --stack-name purple-infra
```

## Troubleshooting

**EKS Auth**  
```bash
kubectl describe configmap aws-auth -n kube-system
```

**CloudFormation Errors**  
- Check `aws cloudformation describe-stack-events`.
