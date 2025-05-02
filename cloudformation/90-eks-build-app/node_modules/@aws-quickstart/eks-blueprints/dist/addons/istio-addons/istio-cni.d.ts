import { Construct } from 'constructs';
import { ClusterInfo } from "../../spi";
import { HelmAddOn, HelmAddOnUserProps } from "../helm-addon";
/**
 * User provided option for the Helm Chart
 */
export interface IstioCniAddonProps extends HelmAddOnUserProps {
    /**
     * To Create Namespace using CDK
     */
    createNamespace?: boolean;
}
export declare class IstioCniAddon extends HelmAddOn {
    constructor(props?: IstioCniAddonProps);
    deploy(clusterInfo: ClusterInfo): void | Promise<Construct>;
}
