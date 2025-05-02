import { Construct, IConstruct } from 'constructs';
import { ClusterInfo } from "../../spi";
import { CoreAddOn, CoreAddOnProps } from "../core-addon";
/**
 * Configuration options for the Adot add-on.
 */
export type AdotCollectorAddOnProps = Partial<Omit<CoreAddOnProps, "addOnName" | "saName">> & {
    namespace?: string;
};
/**
 * Implementation of Adot Collector EKS add-on.
 */
export declare class AdotCollectorAddOn extends CoreAddOn {
    constructor(props?: AdotCollectorAddOnProps);
    deploy(clusterInfo: ClusterInfo): Promise<Construct>;
    /**
     * Overriding base class method to create namespace and register permissions.
     * @param clusterInfo
     * @param name
     * @returns
     */
    createNamespace(clusterInfo: ClusterInfo, namespaceName: string): IConstruct | undefined;
}
