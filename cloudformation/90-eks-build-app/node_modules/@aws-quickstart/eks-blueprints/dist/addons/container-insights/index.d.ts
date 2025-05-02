import { Construct } from "constructs";
import { ClusterInfo } from "../../spi";
import { HelmAddOn, HelmAddOnUserProps } from "../helm-addon";
import { ValuesSchema } from "./values";
/**
 * @deprecated use CloudWatch Insights add-on instead
 */
export interface ContainerInsightAddonProps extends Omit<HelmAddOnUserProps, "namespace"> {
    values?: ValuesSchema;
}
/**
 * @deprecated use CloudWatch Insights add-on instead
 */
export declare class ContainerInsightsAddOn extends HelmAddOn {
    constructor(props?: ContainerInsightAddonProps);
    /**
     * @override
     */
    deploy(clusterInfo: ClusterInfo): Promise<Construct>;
}
