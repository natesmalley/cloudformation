import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import * as blueprints from '@aws-quickstart/eks-blueprints';

/* ── 1. Environment variables ──────────────────────────── */
const {
  VPC_ID,
  PRIV_SUBNETS,
  HELM_CHART_URL,
  CDK_DEFAULT_ACCOUNT,
  CDK_DEFAULT_REGION,
} = process.env;

if (!VPC_ID || !PRIV_SUBNETS || !HELM_CHART_URL) {
  throw new Error('Missing VPC_ID, PRIV_SUBNETS, or HELM_CHART_URL');
}

const app = new cdk.App();

/* ── 2. Import existing VPC (v 1.17 API) ───────────────── */
const importedVpc = ec2.Vpc.fromVpcAttributes(app, 'ImportedVpc', {
  vpcId: VPC_ID,
  availabilityZones: [],                  // can stay empty for import
  privateSubnetIds: PRIV_SUBNETS.split(','),
});

const vpcProvider = new blueprints.DirectVpcProvider(importedVpc);

/* ── 3. Concrete Helm wrapper (HelmAddOn is abstract) ──── */
class SimpleHelm extends blueprints.HelmAddOn {
  constructor(cfg: blueprints.HelmAddOnUserProps & {
    name: string;
    namespace: string;
    chart: string;
  }) {
    super(cfg as any);                     // satisfy constructor at compile‑time
  }
  deploy() {}                              // no special runtime logic
}

/* DVWA chart */
const dvwaHelm = new SimpleHelm({
  name: 'dvwa',
  release: 'dvwa',
  namespace: 'default',
  chart: HELM_CHART_URL,
});

/* Bedrock + SageMaker demo */
const bedrockHelm = new SimpleHelm({
  name: 'bedrock',
  release: 'bedrock',
  namespace: 'bedrock',
  chart:
    'oci://111122223333.dkr.ecr.us-east-1.amazonaws.com/bedrock-sagemaker',
});

/* ── 4. Managed node‑group provider ────────────────────── */
const mngProvider = new blueprints.MngClusterProvider({
  instanceTypes: [new ec2.InstanceType('t3.medium')],
  desiredSize: 2,
  maxSize: 4,
  diskSize: 50,
});

/* ── 5. Build and synth the blueprint ─────────────────── */
blueprints.EksBlueprint.builder()
  .account(CDK_DEFAULT_ACCOUNT!)
  .region(CDK_DEFAULT_REGION!)
  .clusterProvider(mngProvider)
  .resourceProvider(blueprints.GlobalResources.Vpc, vpcProvider)
  .addOns(
    new blueprints.ArgoCDAddOn(),
    dvwaHelm,
    bedrockHelm,
  )
  /* Fargate flag is not in 1.17; omit or add a FargateProfile add‑on */
  .build(app, 'purple-eks');