"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = __importStar(require("aws-cdk-lib"));
const aws_cdk_lib_1 = require("aws-cdk-lib");
const blueprints = __importStar(require("@aws-quickstart/eks-blueprints"));
/* ── 1. Environment variables ──────────────────────────── */
const { VPC_ID, PRIV_SUBNETS, HELM_CHART_URL, CDK_DEFAULT_ACCOUNT, CDK_DEFAULT_REGION, } = process.env;
if (!VPC_ID || !PRIV_SUBNETS || !HELM_CHART_URL) {
    throw new Error('Missing VPC_ID, PRIV_SUBNETS, or HELM_CHART_URL');
}
const app = new cdk.App();
/* ── 2. Import existing VPC (v 1.17 API) ───────────────── */
const importedVpc = aws_cdk_lib_1.aws_ec2.Vpc.fromVpcAttributes(app, 'ImportedVpc', {
    vpcId: VPC_ID,
    availabilityZones: [], // can stay empty for import
    privateSubnetIds: PRIV_SUBNETS.split(','),
});
const vpcProvider = new blueprints.DirectVpcProvider(importedVpc);
/* ── 3. Concrete Helm wrapper (HelmAddOn is abstract) ──── */
class SimpleHelm extends blueprints.HelmAddOn {
    constructor(cfg) {
        super(cfg); // satisfy constructor at compile‑time
    }
    deploy() { } // no special runtime logic
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
    chart: 'oci://111122223333.dkr.ecr.us-east-1.amazonaws.com/bedrock-sagemaker',
});
/* ── 4. Managed node‑group provider ────────────────────── */
const mngProvider = new blueprints.MngClusterProvider({
    instanceTypes: [new aws_cdk_lib_1.aws_ec2.InstanceType('t3.medium')],
    desiredSize: 2,
    maxSize: 4,
    diskSize: 50,
});
/* ── 5. Build and synth the blueprint ─────────────────── */
blueprints.EksBlueprint.builder()
    .account(CDK_DEFAULT_ACCOUNT)
    .region(CDK_DEFAULT_REGION)
    .clusterProvider(mngProvider)
    .resourceProvider(blueprints.GlobalResources.Vpc, vpcProvider)
    .addOns(new blueprints.ArgoCDAddOn(), dvwaHelm, bedrockHelm)
    /* Fargate flag is not in 1.17; omit or add a FargateProfile add‑on */
    .build(app, 'purple-eks');
