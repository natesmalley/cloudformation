# Purple Demo — CloudFormation Edition 🚀
Deploy a deliberately vulnerable DVWA environment on AWS using one
CloudFormation parent stack plus a Helm chart.

---

## Repository layout

├─ cloudformation/                 # IaC (00‑05 legacy + 90 Blueprint)
│   ├─ 00-purple-infra.yml         # parent orchestration (legacy path)
│   ├─ 01-vpc.yml                  # VPC + flow logs
│   ├─ 02-shared-services.yml      # vulnerable S3 bucket
│   ├─ 03-eks.yml                  # (legacy) direct‑CFN EKS template
│   ├─ 04-ec2.yml                  # optional DVWA EC2 host
│   ├─ 05-cloudtrail.yml           # encrypted CloudTrail trail
│   └─ 90-eks-blueprints.yml       # **new** Lambda wrapper that runs CDK Blueprints
│
├─ 90-eks-build-app/               # CDK v2 project using EKS Blueprints v1.17
│   ├─ bin/main.ts                 # defines the cluster, add‑ons, Helm charts
│   ├─ lib/…                       # compiled JS after `npm run build`
│   ├─ node_modules/…              # locked dependencies (`npm ci`)
│   └─ package*.json, tsconfig.json
│
├─ helm/
│   └─ purple/                     # DVWA + in‑cluster MySQL chart
│       ├─ Chart.yaml
│       ├─ values.yaml
│       └─ templates/
│           ├─ deployment.yaml
│           ├─ service.yaml
│           ├─ mysql.yaml
│           └─ _helpers.tpl
│
└─ scripts/
    ├─ build.sh    # package + upload Helm chart
    ├─ deploy.sh   # deploy / update legacy stacks
    └─ delete.sh   # tear everything down

### Build & ship the Blueprint ZIP

1. **Compile CDK app**

   ```bash
   cd cloudformation/90-eks-build-app
   npm ci          # install locked deps
   npm run build   # emits lib/ directory
   ```

2. **Create artefact**

   ```bash
   cd ..
   zip -r eks-blueprints-app.zip \
       90-eks-build-app/lib \
       90-eks-build-app/node_modules \
       90-eks-build-app/package*.json \
       90-eks-build-app/tsconfig.json \
       90-eks-build-app/cdk.json
   ```

3. **Upload to S3**

   ```bash
   BUCKET="purple-cdk-assets-$(aws sts get-caller-identity --query Account --output text)"
   aws s3api create-bucket --bucket "$BUCKET" || true
   aws s3 cp eks-blueprints-app.zip s3://$BUCKET/
   ```

### Deploy the Blueprint stack

```bash
aws cloudformation deploy \
  --template-file cloudformation/90-eks-blueprints.yml \
  --stack-name purple-eks \
  --parameter-overrides \
      CodeBucket=$BUCKET \
      CodeKey=eks-blueprints-app.zip \
  --capabilities CAPABILITY_NAMED_IAM
```

The custom Lambda in **90‑eks-blueprints.yml** downloads the ZIP, runs
`npm ci && cdk deploy`, and creates a nested *purple‑eks‑Blueprint* stack
containing the EKS control plane, managed node group, Argo CD, DVWA, and
Bedrock + SageMaker Helm releases.

### Retrieve cluster details

```bash
aws eks update-kubeconfig --region us-east-1 --name purple-eks
kubectl get nodes -o wide
kubectl get pods -A
```

Delete everything later with:

```bash
aws cloudformation delete-stack --stack-name purple-eks
```
