import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as spi from '../spi';
import { BlueprintConstructBuilder, EksBlueprintProps } from "./eks-blueprint-construct";
/**
 * Blueprint builder implements a builder pattern that improves readability (no bloated constructors)
 * and allows creating a blueprint in an abstract state that can be applied to various instantiations
 * in accounts and regions.
 */
export declare class BlueprintBuilder extends BlueprintConstructBuilder implements spi.AsyncStackBuilder {
    constructor();
    clone(region?: string, account?: string): BlueprintBuilder;
    build(scope: Construct, id: string, stackProps?: cdk.StackProps): EksBlueprint;
    /**
     * Sets compatibility mode
     * @param compatibilityMode if true will attach blueprints resources directly to the stack.
     * @returns
     */
    compatibilityMode(compatibilityMode: boolean): BlueprintBuilder;
    buildAsync(scope: Construct, id: string, stackProps?: cdk.StackProps): Promise<EksBlueprint>;
}
/**
 * Entry point to the platform provisioning. Creates a CFN stack based on the provided configuration
 * and orchestrates provisioning of add-ons, teams and post deployment hooks.
 */
export declare class EksBlueprint extends cdk.Stack {
    static readonly USAGE_ID = "qs-1s1r465hk";
    private asyncTasks;
    private clusterInfo;
    static builder(): BlueprintBuilder;
    constructor(scope: Construct, blueprintProps: EksBlueprintProps, props?: cdk.StackProps);
    /**
     * Since constructor cannot be marked as async, adding a separate method to wait
     * for async code to finish.
     * @returns Promise that resolves to the blueprint
     */
    waitForAsyncTasks(): Promise<EksBlueprint>;
    /**
     * This method returns all the constructs produced by during the cluster creation (e.g. add-ons).
     * May be used in testing for verification.
     * @returns cluster info object
     */
    getClusterInfo(): spi.ClusterInfo;
}
