import { Construct } from "constructs";
import { ClusterAddOn, ClusterInfo } from "../../spi";
export declare class NeuronDevicePluginAddOn implements ClusterAddOn {
    deploy(clusterInfo: ClusterInfo): Promise<Construct>;
}
export interface NeuronMonitorAddOnProps {
    /**
     * The tag of the Neuron Monitor application's Docker image.
     * @default 'latest'
     */
    imageTag?: string;
    /**
     * Neuron Application's namespace
     * @default 'kube-system'
     */
    namespace?: string;
    /**
    * Application's port
    * @default 9010
    */
    port?: number;
    /**
    * To Create Namespace using CDK. This should be done only for the first time.
    */
    createNamespace?: boolean;
}
export declare class NeuronMonitorAddOn implements ClusterAddOn {
    readonly options: NeuronMonitorAddOnProps;
    constructor(props?: NeuronMonitorAddOnProps);
    deploy(clusterInfo: ClusterInfo): Promise<Construct>;
}
