import { PolicyDocument } from "aws-cdk-lib/aws-iam";
import * as kms from "aws-cdk-lib/aws-kms";
import { ClusterInfo } from "../../spi";
import { CoreAddOn, CoreAddOnProps } from "../core-addon";
import { Construct } from "constructs";
/**
 * Interface for EBS CSI Driver EKS add-on options
 */
export type EbsCsiDriverAddOnProps = Omit<CoreAddOnProps, "policyDocumentProvider" | "saName" | "addOnName" | "controlPlaneAddOn" | "namespace" | "versionMap" | "version"> & {
    /**
     * List of KMS keys to be used for encryption
     */
    kmsKeys?: kms.Key[];
    /**
     * StorageClass to be used for the addon
     */
    storageClass?: string;
    /**
     * Version of the EBS CSI driver to be used
     */
    version?: string;
};
/**
 * Implementation of EBS CSI Driver EKS add-on
 */
export declare class EbsCsiDriverAddOn extends CoreAddOn {
    readonly options?: EbsCsiDriverAddOnProps | undefined;
    readonly ebsProps: EbsCsiDriverAddOnProps;
    constructor(options?: EbsCsiDriverAddOnProps | undefined);
    providePolicyDocument(clusterInfo: ClusterInfo): PolicyDocument;
    deploy(clusterInfo: ClusterInfo): Promise<Construct>;
}
