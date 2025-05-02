import { Construct } from 'constructs';
import { ClusterInfo } from "../../spi";
import { HelmAddOn, HelmAddOnUserProps } from "../helm-addon";
/**
 * User provided option for the Helm Chart
 */
export interface IstioIngressGatewayAddonProps extends HelmAddOnUserProps {
    /**
     * To Create Namespace using CDK
     */
    createNamespace?: boolean;
}
export declare class IstioIngressGatewayAddon extends HelmAddOn {
    constructor(props?: IstioIngressGatewayAddonProps);
    deploy(clusterInfo: ClusterInfo): void | Promise<Construct>;
}
