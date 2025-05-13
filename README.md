# Purple - Purposefully Vulnerable CNAPP Demo Environment

![SentinelOne Logo](assets/SentinelOne_Logo_RGB_3c_PURP_BLK.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ⚠️ SECURITY WARNING ⚠️

This infrastructure is **INTENTIONALLY VULNERABLE** and contains **DELIBERATE MISCONFIGURATIONS**. It is designed for security demonstrations, education, and testing purposes only. 

**DO NOT** deploy this in any production environment or connect it to sensitive systems or networks.

## Overview

Purple is a deliberately vulnerable cloud environment created to demonstrate the SentinelOne Cloud Native Security capabilities. It includes intentionally misconfigured resources that demonstrate common cloud security pitfalls and anti-patterns.

## Architecture

The environment consists of multiple deliberately vulnerable components:

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS Account                          │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                         VPC                           │  │
│  │                                                       │  │
│  │  ┌─────────────┐    ┌─────────────┐    ┌───────────┐  │  │
│  │  │ Public      │    │ EC2 Instances│    │  EKS      │  │  │
│  │  │ Subnets     │───▶│ with DVWA    │    │  Cluster  │  │  │
│  │  └─────────────┘    └─────────────┘    └───────────┘  │  │
│  │         │                                    ▲        │  │
│  │         │                                    │        │  │
│  │         ▼                                    │        │  │
│  │  ┌─────────────┐                             │        │  │
│  │  │ Internet    │─────────────────────────────┘        │  │
│  │  │ Gateway     │                                      │  │
│  │  └─────────────┘                                      │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                             │                               │
│                             ▼                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               CloudTrail                              │  │
│  │  ┌─────────────┐    ┌─────────────┐    ┌───────────┐  │  │
│  │  │ CloudWatch  │    │    S3       │    │   SNS     │  │  │
│  │  │  Logs       │    │  Logs       │    │ Notifications│  │
│  │  └─────────────┘    └─────────────┘    └───────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                             │                               │
│                             ▼                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               Optional Vulnerable S3                  │  │
│  │  ┌─────────────┐    ┌─────────────┐                   │  │
│  │  │ Public      │    │ Fake        │                   │  │
│  │  │ Access      │    │ Sensitive   │                   │  │
│  │  │ Enabled     │    │ Data        │                   │  │
│  │  └─────────────┘    └─────────────┘                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Components

Purple consists of the following major components:

| Component | Description | Vulnerabilities |
|-----------|-------------|-----------------|
| **VPC** | Network infrastructure with public and private subnets | Public subnets with auto-assigned IPs, minimal isolation |
| **EC2 Instances** | Virtual machines running DVWA | Security groups with excessive permissions, SSH access |
| **EKS Cluster** | Kubernetes cluster for containerized workloads | Public endpoint, disabled secrets encryption, permissive roles |
| **CloudTrail** | Optional logging with short retention | Limited coverage, short retention periods |
| **S3 Bucket** | Optional vulnerable storage for demonstration | Versioning enabled, encryption disabled, public access |

## Directory Structure

```
purple/
├── README.md                 # This file
├── aws/                      # AWS infrastructure code
│   ├── environments/         # Environment-specific configurations
│   │   └── demo/            # Demo environment
│   └── modules/             # Reusable Terraform modules
│       ├── cloudtrail/      # CloudTrail logging configuration
│       ├── ec2/             # EC2 instances with DVWA
│       ├── eks/             # EKS Kubernetes cluster
│       ├── s3/              # Optional vulnerable S3 bucket
│       └── vpc/             # Network infrastructure
├── helm/                    # Helm charts for Kubernetes resources
└── assets/                  # Project assets and images
```

## Installation

### Prerequisites

1. **AWS Account**: You need an AWS account where you have sufficient permissions to create resources like VPCs, EC2 instances, EKS clusters, etc.

2. **Required Tools**:
   - Terraform (>= 1.0)
   - AWS CLI (>= 2.0)
   - kubectl (for EKS interaction)
   - Helm (for Kubernetes deployments)

### Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/purple.git
   cd purple
   ```

2. **Configure AWS Credentials**:
   - Windows: Use [AWS CLI configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
   - Mac/Linux: Set [environment variables](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html) or use AWS CLI configuration
   - Required variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION

3. **Configure Deployment**:
   - Navigate to the demo environment directory: `cd aws/environments/demo`
   - Copy terraform.tfvars.example to terraform.tfvars
   - Edit terraform.tfvars to include required inputs:
     ```hcl
     allowed_inbound_cidr_blocks = ["YOUR_IP_ADDRESS/32"]
     s1_repository_username = "YOUR_S1_REPO_USERNAME"
     s1_repository_password = "YOUR_S1_REPO_PASSWORD"
     s1_site_token = "YOUR_S1_SITE_TOKEN"
     ```

4. **Deploy the Infrastructure**:
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

5. **Access Resources**:
   - Use the outputs from Terraform to access the deployed resources
   - Follow the specific connection commands provided in the outputs

## Security Misconfigurations

The following sections detail the intentional security misconfigurations present in this environment:

### Network Security Misconfigurations

1. **Public Subnet Configuration**
   - Public subnets with auto-assigned public IPs
   - Direct internet access to resources
   - Impact: Exposes resources to potential external attacks

### Kubernetes Security Misconfigurations

1. **EKS Cluster Configuration**
   - Public API endpoint enabled
   - No secrets encryption
   - No pod security standards
   - Impact: Vulnerable to unauthorized access and data exposure

2. **RBAC Misconfigurations**
   - Admin-everywhere cluster role binding
   - Service accounts with admin privileges
   - No role-based access control
   - Impact: Complete cluster access for all users

3. **Pod Security**
   - Privileged containers enabled
   - No resource limits
   - No security context constraints
   - Impact: Increased attack surface and resource abuse potential

### Identity & Access Management Misconfigurations

1. **IAM Roles**
   - Overly permissive IAM roles
   - Missing permission boundaries
   - No enforced MFA
   - Impact: Unauthorized access to AWS resources

2. **Service Accounts**
   - Admin privileges for service accounts
   - No principle of least privilege
   - Impact: Elevated access for container workloads

### Secrets Management Misconfigurations

1. **Credential Storage**
   - Database credentials in Helm values
   - SSH keys in AWS Secrets Manager
   - S1 agent credentials in variables
   - Impact: Credential exposure and unauthorized access

2. **Encryption**
   - No encryption at rest for EKS secrets
   - No key rotation
   - Impact: Data exposure if compromised

### Logging & Monitoring Misconfigurations

1. **CloudTrail**
   - Optional logging (disabled by default)
   - Short retention periods
   - Incomplete coverage
   - Impact: Limited audit trail and incident response capability

2. **EKS Logging**
   - No audit logging for API server
   - No pod security policy violations logging
   - Impact: Limited visibility into cluster activities

### Container Security Misconfigurations

1. **Container Configuration**
   - No container scanning
   - No runtime security monitoring
   - Privileged containers
   - Impact: Vulnerable container workloads

2. **Resource Management**
   - No resource limits on pods
   - No image pull policy enforcement
   - Impact: Resource exhaustion and unauthorized image usage

### Infrastructure as Code Misconfigurations

1. **Terraform State**
   - Hardcoded credentials
   - No state file encryption
   - No backend encryption
   - Impact: Credential exposure in state files

2. **Variables**
   - Sensitive values in variables
   - No state file locking
   - Impact: Unauthorized access to infrastructure

### Application Security Misconfigurations

1. **DVWA Configuration**
   - Exposed to internet
   - No WAF protection
   - No input validation
   - Impact: Vulnerable web application

2. **Service Protection**
   - No DDoS protection
   - No rate limiting
   - No output encoding
   - Impact: Service disruption and data exposure

### Storage Security Misconfigurations

1. **S3 Bucket Configuration**
   - Versioning enabled (for demonstration)
   - Server-side encryption disabled
   - Public access enabled
   - No lifecycle policies
   - No access logging
   - Impact: Data loss, unauthorized access, and potential data exposure

2. **S3 Access Controls**
   - No bucket policy restrictions
   - No object-level encryption
   - No access control lists
   - Impact: Unauthorized data access and modification

3. **S3 Monitoring**
   - No access logging
   - No event notifications
   - No inventory reports
   - Impact: Limited visibility into bucket access and changes

## Troubleshooting

### Deployment Issues

### EKS Authentication Issues

**Problem**: Unable to connect to the EKS cluster after deployment.
**Solution**: Run the kubeconfig command output by Terraform:
```bash
aws eks update-kubeconfig --name purple-demo-eks --region us-east-2
```

**Problem**: Worker nodes not joining the cluster.
**Solution**: Check the AWS Auth ConfigMap:
```bash
kubectl describe configmap aws-auth -n kube-system
```

### Resource Cleanup

**Problem**: `terraform destroy` fails to remove all resources.
**Solution**: Some resources have deletion protection or may require manual cleanup:
1. Delete any load balancers created by Kubernetes services
2. Delete CloudWatch log groups manually
3. Empty S3 buckets before deletion (especially if versioning is enabled)
4. Delete any stuck kubernetes jobs with a command like `kubectl delete job <job-name> -n <namespace> --force --grace-period=0`
5. Remove all objects and versions from S3 buckets before deletion

## Contributing

We welcome contributions to Purple! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-new-feature`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin feature/my-new-feature`)
6. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This project is provided for educational and testing purposes only. The maintainers assume no liability for misuse or damages resulting from the use of this software. Users must comply with all applicable laws and AWS terms of service when using this software. 
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

## Contributing

See root-level README.

## License

MIT. See [LICENSE](../LICENSE).