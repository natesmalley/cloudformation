import { Construct } from 'constructs';
import { ClusterInfo } from "../../spi";
import { HelmAddOn, HelmAddOnUserProps } from "../helm-addon";
/**
 * User provided options for the Helm Chart
 */
export interface KubeRayAddOnProps extends HelmAddOnUserProps {
    /**
     * To Create Namespace using CDK
     */
    createNamespace?: boolean;
}
/**
 * Main class to instantiate the Helm chart
 */
export declare class KubeRayAddOn extends HelmAddOn {
    readonly options: KubeRayAddOnProps;
    constructor(props?: KubeRayAddOnProps);
    deploy(clusterInfo: ClusterInfo): Promise<Construct>;
}
