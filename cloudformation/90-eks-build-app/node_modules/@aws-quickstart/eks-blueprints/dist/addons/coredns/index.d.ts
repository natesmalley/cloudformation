import { Construct } from "constructs";
import { ClusterInfo } from "../../spi";
import { CoreAddOn, CoreAddOnProps } from "../core-addon";
/**
 * Configuration options for the coredns add-on.
 */
export type CoreDnsAddOnProps = Omit<CoreAddOnProps, "saName" | "addOnName" | "version">;
/**
 * Implementation of CoreDns EKS add-on.
 */
export declare class CoreDnsAddOn extends CoreAddOn {
    constructor(version?: string, props?: CoreDnsAddOnProps);
    deploy(clusterInfo: ClusterInfo): Promise<Construct>;
    /**
     *  Retain the addon otherwise cluster destroy will fail due to CoreDnsComputeTypePatch
     *  https://github.com/aws/aws-cdk/issues/28621
     */
    handleFargatePatch(addonPromise: Promise<Construct>): void;
}
