import { BlueprintBuilder } from '../stacks';
import * as spi from '../spi';
import { MngClusterProviderProps } from '../cluster-providers';
import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
/**
 * This builder class helps you prepare a blueprint for setting up
 * Graviton nodes with EKS cluster. The `GravitonBuilder` creates the following:
 * 1. An EKS Cluster` with passed k8s version.
 * 2. A managed graviton nodegroup for ARM64 software.
 * 3. Validates each addon is supported for the given architecture.
 *
 * @example
 * ```typescript
 * import { GravitonBuilder }
 */
export declare class GravitonBuilder extends BlueprintBuilder {
    addOns(...addOns: spi.ClusterAddOn[]): this;
    static builder(options: Partial<MngClusterProviderProps>): GravitonBuilder;
}
/**
 * Nested stack that is used as tracker for Graviton Accelerator
 */
export declare class UsageTrackingAddOn extends NestedStack {
    static readonly USAGE_ID = "qs-1ub15dn1f";
    static builder(): spi.NestedStackBuilder;
    constructor(scope: Construct, id: string, props: NestedStackProps);
}
