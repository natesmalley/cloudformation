"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagAsg = tagAsg;
exports.deployBeforeCapacity = deployBeforeCapacity;
const customResource = require("aws-cdk-lib/custom-resources");
/**
 * Creates the node termination tag for the ASG
 * @param scope
 * @param autoScalingGroup
 */
function tagAsg(scope, autoScalingGroup, tags) {
    let tagList = [];
    tags.forEach((tag) => {
        tagList.push({
            Key: tag.Key,
            Value: tag.Value,
            PropagateAtLaunch: true,
            ResourceId: autoScalingGroup,
            ResourceType: 'auto-scaling-group'
        });
    });
    const callProps = {
        service: 'AutoScaling',
        action: 'createOrUpdateTags',
        parameters: {
            Tags: tagList
        },
        physicalResourceId: customResource.PhysicalResourceId.of(`${autoScalingGroup}-asg-tag`)
    };
    new customResource.AwsCustomResource(scope, 'asg-tag', {
        onCreate: callProps,
        onUpdate: callProps,
        policy: customResource.AwsCustomResourcePolicy.fromSdkCalls({
            resources: customResource.AwsCustomResourcePolicy.ANY_RESOURCE
        })
    });
}
/**
 * Makes the provided construct run before any capacity (worker nodes) is provisioned on the cluster.
 * Useful for control plane add-ons, such as VPC-CNI that must be provisioned before EC2 (or Fargate) capacity is added.
 * @param construct identifies construct (such as core add-on) that should be provisioned before capacity
 * @param clusterInfo cluster provisioning context
 */
function deployBeforeCapacity(construct, clusterInfo) {
    var _a, _b, _c;
    let allCapacity = [];
    allCapacity = allCapacity.concat((_a = clusterInfo.nodeGroups) !== null && _a !== void 0 ? _a : [])
        .concat((_b = clusterInfo.autoscalingGroups) !== null && _b !== void 0 ? _b : [])
        .concat((_c = clusterInfo.fargateProfiles) !== null && _c !== void 0 ? _c : []);
    allCapacity.forEach(v => v.node.addDependency(construct));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi91dGlscy9jbHVzdGVyLXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBZUMsd0JBcUNBO0FBUUQsb0RBTUM7QUFqRUQsK0RBQStEO0FBUy9EOzs7O0dBSUc7QUFDRixTQUFnQixNQUFNLENBQUMsS0FBZ0IsRUFBRSxnQkFBd0IsRUFBRSxJQUFXO0lBQzdFLElBQUksT0FBTyxHQU1MLEVBQUUsQ0FBQztJQUVULElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ1gsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHO1lBQ1osS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLO1lBQ2hCLGlCQUFpQixFQUFHLElBQUk7WUFDeEIsVUFBVSxFQUFFLGdCQUFnQjtZQUM1QixZQUFZLEVBQUUsb0JBQW9CO1NBQ25DLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxTQUFTLEdBQThCO1FBQzNDLE9BQU8sRUFBRSxhQUFhO1FBQ3RCLE1BQU0sRUFBRSxvQkFBb0I7UUFDNUIsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLE9BQU87U0FDZDtRQUNELGtCQUFrQixFQUFFLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQ3RELEdBQUcsZ0JBQWdCLFVBQVUsQ0FDOUI7S0FDRixDQUFDO0lBRUYsSUFBSSxjQUFjLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUNyRCxRQUFRLEVBQUUsU0FBUztRQUNuQixRQUFRLEVBQUUsU0FBUztRQUNuQixNQUFNLEVBQUUsY0FBYyxDQUFDLHVCQUF1QixDQUFDLFlBQVksQ0FBQztZQUMxRCxTQUFTLEVBQUUsY0FBYyxDQUFDLHVCQUF1QixDQUFDLFlBQVk7U0FDL0QsQ0FBQztLQUNILENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILFNBQWdCLG9CQUFvQixDQUFDLFNBQW9CLEVBQUUsV0FBd0I7O0lBQy9FLElBQUksV0FBVyxHQUFrQixFQUFFLENBQUM7SUFDcEMsV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBQSxXQUFXLENBQUMsVUFBVSxtQ0FBSSxFQUFFLENBQUM7U0FDekQsTUFBTSxDQUFDLE1BQUEsV0FBVyxDQUFDLGlCQUFpQixtQ0FBSSxFQUFFLENBQUM7U0FDM0MsTUFBTSxDQUFDLE1BQUEsV0FBVyxDQUFDLGVBQWUsbUNBQUksRUFBRSxDQUFDLENBQUM7SUFDL0MsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFDOUQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgKiBhcyBjdXN0b21SZXNvdXJjZSBmcm9tICdhd3MtY2RrLWxpYi9jdXN0b20tcmVzb3VyY2VzJztcbmltcG9ydCB7IENsdXN0ZXJJbmZvIH0gZnJvbSBcIi4uL3NwaVwiO1xuXG5cbmludGVyZmFjZSBUYWcge1xuICBLZXk6IHN0cmluZztcbiAgVmFsdWU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBDcmVhdGVzIHRoZSBub2RlIHRlcm1pbmF0aW9uIHRhZyBmb3IgdGhlIEFTR1xuICogQHBhcmFtIHNjb3BlXG4gKiBAcGFyYW0gYXV0b1NjYWxpbmdHcm91cCBcbiAqL1xuIGV4cG9ydCBmdW5jdGlvbiB0YWdBc2coc2NvcGU6IENvbnN0cnVjdCwgYXV0b1NjYWxpbmdHcm91cDogc3RyaW5nLCB0YWdzOiBUYWdbXSk6IHZvaWQge1xuICBsZXQgdGFnTGlzdDoge1xuICAgIEtleTogc3RyaW5nO1xuICAgIFZhbHVlOiBzdHJpbmc7XG4gICAgUHJvcGFnYXRlQXRMYXVuY2g6IGJvb2xlYW47XG4gICAgUmVzb3VyY2VJZDogc3RyaW5nO1xuICAgIFJlc291cmNlVHlwZTogc3RyaW5nO1xuICB9W10gPSBbXTtcblxuICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xuICAgIHRhZ0xpc3QucHVzaCh7XG4gICAgICBLZXk6IHRhZy5LZXksXG4gICAgICBWYWx1ZTogdGFnLlZhbHVlLFxuICAgICAgUHJvcGFnYXRlQXRMYXVuY2ggOiB0cnVlLFxuICAgICAgUmVzb3VyY2VJZDogYXV0b1NjYWxpbmdHcm91cCxcbiAgICAgIFJlc291cmNlVHlwZTogJ2F1dG8tc2NhbGluZy1ncm91cCdcbiAgICB9KTtcbiAgfSk7XG5cbiAgY29uc3QgY2FsbFByb3BzOiBjdXN0b21SZXNvdXJjZS5Bd3NTZGtDYWxsID0ge1xuICAgIHNlcnZpY2U6ICdBdXRvU2NhbGluZycsXG4gICAgYWN0aW9uOiAnY3JlYXRlT3JVcGRhdGVUYWdzJyxcbiAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICBUYWdzOiB0YWdMaXN0XG4gICAgfSxcbiAgICBwaHlzaWNhbFJlc291cmNlSWQ6IGN1c3RvbVJlc291cmNlLlBoeXNpY2FsUmVzb3VyY2VJZC5vZihcbiAgICAgIGAke2F1dG9TY2FsaW5nR3JvdXB9LWFzZy10YWdgXG4gICAgKVxuICB9O1xuXG4gIG5ldyBjdXN0b21SZXNvdXJjZS5Bd3NDdXN0b21SZXNvdXJjZShzY29wZSwgJ2FzZy10YWcnLCB7XG4gICAgb25DcmVhdGU6IGNhbGxQcm9wcyxcbiAgICBvblVwZGF0ZTogY2FsbFByb3BzLFxuICAgIHBvbGljeTogY3VzdG9tUmVzb3VyY2UuQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHtcbiAgICAgIHJlc291cmNlczogY3VzdG9tUmVzb3VyY2UuQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFXG4gICAgfSlcbiAgfSk7XG59XG5cbi8qKlxuICogTWFrZXMgdGhlIHByb3ZpZGVkIGNvbnN0cnVjdCBydW4gYmVmb3JlIGFueSBjYXBhY2l0eSAod29ya2VyIG5vZGVzKSBpcyBwcm92aXNpb25lZCBvbiB0aGUgY2x1c3Rlci5cbiAqIFVzZWZ1bCBmb3IgY29udHJvbCBwbGFuZSBhZGQtb25zLCBzdWNoIGFzIFZQQy1DTkkgdGhhdCBtdXN0IGJlIHByb3Zpc2lvbmVkIGJlZm9yZSBFQzIgKG9yIEZhcmdhdGUpIGNhcGFjaXR5IGlzIGFkZGVkLlxuICogQHBhcmFtIGNvbnN0cnVjdCBpZGVudGlmaWVzIGNvbnN0cnVjdCAoc3VjaCBhcyBjb3JlIGFkZC1vbikgdGhhdCBzaG91bGQgYmUgcHJvdmlzaW9uZWQgYmVmb3JlIGNhcGFjaXR5XG4gKiBAcGFyYW0gY2x1c3RlckluZm8gY2x1c3RlciBwcm92aXNpb25pbmcgY29udGV4dFxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVwbG95QmVmb3JlQ2FwYWNpdHkoY29uc3RydWN0OiBDb25zdHJ1Y3QsIGNsdXN0ZXJJbmZvOiBDbHVzdGVySW5mbykge1xuICAgIGxldCBhbGxDYXBhY2l0eSA6IENvbnN0cnVjdFtdICA9IFtdO1xuICAgIGFsbENhcGFjaXR5ID0gYWxsQ2FwYWNpdHkuY29uY2F0KGNsdXN0ZXJJbmZvLm5vZGVHcm91cHMgPz8gW10pXG4gICAgICAgIC5jb25jYXQoY2x1c3RlckluZm8uYXV0b3NjYWxpbmdHcm91cHMgPz8gW10pXG4gICAgICAgIC5jb25jYXQoY2x1c3RlckluZm8uZmFyZ2F0ZVByb2ZpbGVzID8/IFtdKTtcbiAgICBhbGxDYXBhY2l0eS5mb3JFYWNoKHYgPT4gdi5ub2RlLmFkZERlcGVuZGVuY3koY29uc3RydWN0KSk7XG59Il19