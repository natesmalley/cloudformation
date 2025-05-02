import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { ClusterInfo } from "../../spi";
import "reflect-metadata";
import { HelmAddOn, HelmAddOnUserProps } from "../helm-addon";
import { AckServiceName } from './serviceMappings';
export * from "./serviceMappings";
/**
 * User provided option for the Helm Chart
 */
export interface AckAddOnProps extends HelmAddOnUserProps {
    /**
     * Required identified, must be unique within the parent stack scope.
     */
    id?: string;
    /**
     * Default Service Name
     * @default iam
     */
    serviceName: AckServiceName;
    /**
     * Managed IAM Policy of the ack controller
     * @default IAMFullAccess
     */
    managedPolicyName?: string;
    /**
    * Inline IAM Policy for the ack controller
    * @default undefined
    */
    inlinePolicyStatements?: PolicyStatement[];
    /**
     * To Create Namespace using CDK. This should be done only for the first time.
     */
    createNamespace?: boolean;
    /**
     * To create Service Account
     */
    saName?: string;
}
/**
 * Main class to instantiate the Helm chart
 */
export declare class AckAddOn extends HelmAddOn {
    readonly options: AckAddOnProps;
    readonly id?: string;
    constructor(props?: AckAddOnProps);
    deploy(clusterInfo: ClusterInfo): Promise<Construct>;
}
