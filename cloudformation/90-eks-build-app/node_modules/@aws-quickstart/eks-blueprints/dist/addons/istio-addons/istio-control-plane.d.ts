import { Construct } from "constructs";
import { ClusterInfo } from "../../spi";
import { HelmAddOn, HelmAddOnUserProps } from "../helm-addon";
import { ValuesSchema } from "./istio-control-plane-values";
export interface IstioControlPlaneAddOnProps extends HelmAddOnUserProps {
    values?: ValuesSchema;
}
export declare class IstioControlPlaneAddOn extends HelmAddOn {
    constructor(props?: IstioControlPlaneAddOnProps);
    deploy(clusterInfo: ClusterInfo): Promise<Construct>;
}
