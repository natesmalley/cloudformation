# Purple Demo — CloudFormation Edition 🚀
Deploy a deliberately vulnerable DVWA environment on AWS using one
CloudFormation parent stack plus a Helm chart.

---

## Repository layout

```text
.
├─ cloudformation/            # 00-05 nested-stack templates
│   ├─ 00-purple-infra.yml    # parent orchestration stack
│   ├─ 01-vpc.yml             # VPC + flow logs
│   ├─ 02-shared-services.yml # vulnerable S3 bucket
│   ├─ 03-eks.yml             # EKS (installs Helm chart)
│   ├─ 04-ec2.yml             # optional DVWA EC2 host
│   └─ 05-cloudtrail.yml      # encrypted CloudTrail trail
│
├─ helm/
│   └─ purple/                # DVWA + in-cluster MySQL chart
│       ├─ Chart.yaml
│       ├─ values.yaml
│       └─ templates/
│           ├─ deployment.yaml
│           ├─ service.yaml
│           ├─ mysql.yaml
│           └─ _helpers.tpl
│
└─ scripts/                   # helper bash scripts
    ├─ build.sh   # package + upload Helm chart
    ├─ deploy.sh  # deploy / update stacks
    └─ delete.sh  # tear everything down

1 – Package the Helm chart
./scripts/build.sh          # helm lint → helm package → aws s3 cp

2 – Deploy all stacks
export STACK_NAME=purple-all
export AWS_DEFAULT_REGION=us-east-1
./scripts/deploy.sh

3 – Retrieve outputs
aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --query "Stacks[0].Outputs[].[OutputKey,OutputValue]" \
  --output table

  Clean up
  ./scripts/delete.sh
  
