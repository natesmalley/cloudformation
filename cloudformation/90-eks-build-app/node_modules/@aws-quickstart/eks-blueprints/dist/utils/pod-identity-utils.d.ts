import { CfnPodIdentityAssociation, ICluster } from "aws-cdk-lib/aws-eks";
import * as iam from "aws-cdk-lib/aws-iam";
/**
 * Creates IAM role and EKS Pod Identity association
 * @param clusterInfo
 * @param name
 * @param namespace
 * @param policyDocument
 *
 * @returns podIdentityAssociation
 */
export declare function podIdentityAssociation(cluster: ICluster, name: string, namespace: string, policyDocument: iam.PolicyDocument): CfnPodIdentityAssociation;
