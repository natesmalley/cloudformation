"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterAutoScalerAddOn = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_eks_1 = require("aws-cdk-lib/aws-eks");
const iam = require("aws-cdk-lib/aws-iam");
const cluster_providers_1 = require("../../cluster-providers");
const utils_1 = require("../../utils");
const helm_addon_1 = require("../helm-addon");
const RELEASE = 'blueprints-addon-cluster-autoscaler';
const NAME = 'cluster-autoscaler';
/**
 * Defaults options for the add-on
 */
const defaultProps = {
    chart: NAME,
    name: NAME,
    namespace: 'kube-system',
    release: RELEASE,
    repository: 'https://kubernetes.github.io/autoscaler',
    version: 'auto'
};
/**
 * Version of the autoscaler, controls the image tag
 */
const versionMap = new Map([
    [aws_eks_1.KubernetesVersion.V1_28.version, "9.34.0"],
    [aws_eks_1.KubernetesVersion.V1_27.version, "9.33.0"],
    [aws_eks_1.KubernetesVersion.V1_26.version, "9.29.0"],
    [aws_eks_1.KubernetesVersion.V1_25.version, "9.29.0"],
    [aws_eks_1.KubernetesVersion.V1_24.version, "9.25.0"],
    [aws_eks_1.KubernetesVersion.V1_23.version, "9.21.0"],
    [aws_eks_1.KubernetesVersion.V1_22.version, "9.13.1"],
    [aws_eks_1.KubernetesVersion.V1_21.version, "9.13.1"],
    [aws_eks_1.KubernetesVersion.V1_20.version, "9.9.2"],
    [aws_eks_1.KubernetesVersion.V1_19.version, "9.4.0"],
    [aws_eks_1.KubernetesVersion.V1_18.version, "9.4.0"],
]);
let ClusterAutoScalerAddOn = class ClusterAutoScalerAddOn extends helm_addon_1.HelmAddOn {
    constructor(props) {
        super({ ...defaultProps, ...props });
        this.options = this.props;
    }
    deploy(clusterInfo) {
        var _a;
        if (((_a = this.options.version) === null || _a === void 0 ? void 0 : _a.trim()) === 'auto') {
            this.options.version = versionMap.get(clusterInfo.version.version);
            if (!this.options.version) {
                this.options.version = versionMap.values().next().value;
                utils_1.logger.warn(`Unable to auto-detect cluster autoscaler version. Applying latest: ${this.options.version}`);
            }
        }
        const cluster = clusterInfo.cluster;
        const nodeGroups = (0, cluster_providers_1.assertEC2NodeGroup)(clusterInfo, "Cluster Autoscaler");
        const values = this.options.values || {};
        const namespace = this.options.namespace;
        // Create IAM Policy
        const autoscalerStmt = new iam.PolicyStatement();
        autoscalerStmt.addResources("*");
        autoscalerStmt.addActions("autoscaling:DescribeAutoScalingGroups", "autoscaling:DescribeAutoScalingInstances", "autoscaling:DescribeLaunchConfigurations", "autoscaling:DescribeTags", "autoscaling:SetDesiredCapacity", "autoscaling:TerminateInstanceInAutoScalingGroup", "ec2:DescribeLaunchTemplateVersions", "ec2:DescribeInstanceTypes", "eks:DescribeNodegroup");
        const autoscalerPolicyDocument = new iam.PolicyDocument({
            statements: [autoscalerStmt]
        });
        // Tag node groups
        const clusterName = new aws_cdk_lib_1.CfnJson(cluster.stack, "clusterName", {
            value: cluster.clusterName,
        });
        for (let ng of nodeGroups) {
            aws_cdk_lib_1.Tags.of(ng).add(`k8s.io/cluster-autoscaler/${clusterName}`, "owned", { applyToLaunchedInstances: true });
            aws_cdk_lib_1.Tags.of(ng).add("k8s.io/cluster-autoscaler/enabled", "true", { applyToLaunchedInstances: true });
        }
        // Create IRSA
        const sa = (0, utils_1.createServiceAccount)(cluster, RELEASE, namespace, autoscalerPolicyDocument);
        // Create namespace
        if (this.options.createNamespace) {
            const ns = (0, utils_1.createNamespace)(namespace, cluster, true);
            sa.node.addDependency(ns);
        }
        // Create Helm Chart
        (0, utils_1.setPath)(values, "cloudProvider", "aws");
        (0, utils_1.setPath)(values, "autoDiscovery.clusterName", cluster.clusterName);
        (0, utils_1.setPath)(values, "awsRegion", cluster.stack.region);
        (0, utils_1.setPath)(values, "rbac.serviceAccount.create", false);
        (0, utils_1.setPath)(values, "rbac.serviceAccount.name", RELEASE);
        const clusterAutoscalerChart = this.addHelmChart(clusterInfo, values, false);
        clusterAutoscalerChart.node.addDependency(sa);
        return Promise.resolve(clusterAutoscalerChart);
    }
};
exports.ClusterAutoScalerAddOn = ClusterAutoScalerAddOn;
__decorate([
    (0, utils_1.conflictsWith)('KarpenterAddOn')
], ClusterAutoScalerAddOn.prototype, "deploy", null);
exports.ClusterAutoScalerAddOn = ClusterAutoScalerAddOn = __decorate([
    utils_1.supportsALL
], ClusterAutoScalerAddOn);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL2NsdXN0ZXItYXV0b3NjYWxlci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSw2Q0FBNEM7QUFDNUMsaURBQXdEO0FBQ3hELDJDQUEyQztBQUUzQywrREFBNkQ7QUFFN0QsdUNBQWlIO0FBQ2pILDhDQUE4RDtBQWtCOUQsTUFBTSxPQUFPLEdBQUcscUNBQXFDLENBQUM7QUFDdEQsTUFBTSxJQUFJLEdBQUcsb0JBQW9CLENBQUM7QUFDbEM7O0dBRUc7QUFDSCxNQUFNLFlBQVksR0FBZ0M7SUFDOUMsS0FBSyxFQUFFLElBQUk7SUFDWCxJQUFJLEVBQUUsSUFBSTtJQUNWLFNBQVMsRUFBRSxhQUFhO0lBQ3hCLE9BQU8sRUFBRSxPQUFPO0lBQ2hCLFVBQVUsRUFBRSx5Q0FBeUM7SUFDckQsT0FBTyxFQUFFLE1BQU07Q0FDbEIsQ0FBQztBQUVGOztHQUVHO0FBQ0gsTUFBTSxVQUFVLEdBQXdCLElBQUksR0FBRyxDQUFDO0lBQzVDLENBQUMsMkJBQWlCLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUM7SUFDM0MsQ0FBQywyQkFBaUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQztJQUMzQyxDQUFDLDJCQUFpQixDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDO0lBQzNDLENBQUMsMkJBQWlCLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUM7SUFDM0MsQ0FBQywyQkFBaUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQztJQUMzQyxDQUFDLDJCQUFpQixDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDO0lBQzNDLENBQUMsMkJBQWlCLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUM7SUFDM0MsQ0FBQywyQkFBaUIsQ0FBQyxLQUFL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MEVsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENmbkpzb24sIFRhZ3MgfSBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCB7IEt1YmVybmV0ZXNWZXJzaW9uIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1la3NcIjtcbmltcG9ydCAqIGFzIGlhbSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWlhbVwiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCB7IGFzc2VydEVDMk5vZGVHcm91cCB9IGZyb20gXCIuLi8uLi9jbHVzdGVyLXByb3ZpZGVyc1wiO1xuaW1wb3J0IHsgQ2x1c3RlckluZm8gfSBmcm9tIFwiLi4vLi4vc3BpXCI7XG5pbXBvcnQgeyBjb25mbGljdHNXaXRoLCBjcmVhdGVOYW1lc3BhY2UsIGNyZWF0ZVNlcnZpY2VBY2NvdW50LCBsb2dnZXIsIHNldFBhdGgsIHN1cHBvcnRzQUxMIH0gZnJvbSBcIi4uLy4uL3V0aWxzXCI7XG5pbXBvcnQgeyBIZWxtQWRkT24sIEhlbG1BZGRPblVzZXJQcm9wcyB9IGZyb20gXCIuLi9oZWxtLWFkZG9uXCI7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBvcHRpb25zIGZvciB0aGUgYWRkLW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENsdXN0ZXJBdXRvU2NhbGVyQWRkT25Qcm9wcyBleHRlbmRzIEhlbG1BZGRPblVzZXJQcm9wcyB7XG4gICAgLyoqXG4gICAgICogVmVyc2lvbiBvZiB0aGUgQ2x1c3RlciBBdXRvc2NhbGVyXG4gICAgICogQGRlZmF1bHQgYXV0byBkaXNjb3ZlcmVkIGJhc2VkIG9uIEVLUyB2ZXJzaW9uLlxuICAgICAqL1xuICAgIHZlcnNpb24/OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgbmFtZXNwYWNlXG4gICAgICovXG4gICAgY3JlYXRlTmFtZXNwYWNlPzogYm9vbGVhbjtcbn1cblxuY29uc3QgUkVMRUFTRSA9ICdibHVlcHJpbnRzLWFkZG9uLWNsdXN0ZXItYXV0b3NjYWxlcic7XG5jb25zdCBOQU1FID0gJ2NsdXN0ZXItYXV0b3NjYWxlcic7XG4vKipcbiAqIERlZmF1bHRzIG9wdGlvbnMgZm9yIHRoZSBhZGQtb25cbiAqL1xuY29uc3QgZGVmYXVsdFByb3BzOiBDbHVzdGVyQXV0b1NjYWxlckFkZE9uUHJvcHMgPSB7XG4gICAgY2hhcnQ6IE5BTUUsXG4gICAgbmFtZTogTkFNRSxcbiAgICBuYW1lc3BhY2U6ICdrdWJlLXN5c3RlbScsXG4gICAgcmVsZWFzZTogUkVMRUFTRSxcbiAgICByZXBvc2l0b3J5OiAnaHR0cHM6Ly9rdWJlcm5ldGVzLmdpdGh1Yi5pby9hdXRvc2NhbGVyJyxcbiAgICB2ZXJzaW9uOiAnYXV0bydcbn07XG5cbi8qKlxuICogVmVyc2lvbiBvZiB0aGUgYXV0b3NjYWxlciwgY29udHJvbHMgdGhlIGltYWdlIHRhZ1xuICovXG5jb25zdCB2ZXJzaW9uTWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcChbXG4gICAgW0t1YmVybmV0ZXNWZXJzaW9uLlYxXzI4LnZlcnNpb24sIFwiOS4zNC4wXCJdLFxuICAgIFtLdWJlcm5ldGVzVmVyc2lvbi5WMV8yNy52ZXJzaW9uLCBcIjkuMzMuMFwiXSxcbiAgICBbS3ViZXJuZXRlc1ZlcnNpb24uVjFfMjYudmVyc2lvbiwgXCI5LjI5LjBcIl0sXG4gICAgW0t1YmVybmV0ZXNWZXJzaW9uLlYxXzI1LnZlcnNpb24sIFwiOS4yOS4wXCJdLFxuICAgIFtLdWJlcm5ldGVzVmVyc2lvbi5WMV8yNC52ZXJzaW9uLCBcIjkuMjUuMFwiXSxcbiAgICBbS3ViZXJuZXRlc1ZlcnNpb24uVjFfMjMudmVyc2lvbiwgXCI5LjIxLjBcIl0sXG4gICAgW0t1YmVybmV0ZXNWZXJzaW9uLlYxXzIyLnZlcnNpb24sIFwiOS4xMy4xXCJdLFxuICAgIFtLdWJlcm5ldGVzVmVyc2lvbi5WMV8yMS52ZXJzaW9uLCBcIjkuMTMuMVwiXSxcbiAgICBbS3ViZXJuZXRlc1ZlcnNpb24uVjFfMjAudmVyc2lvbiwgXCI5LjkuMlwiXSxcbiAgICBbS3ViZXJuZXRlc1ZlcnNpb24uVjFfMTkudmVyc2lvbiwgXCI5LjQuMFwiXSxcbiAgICBbS3ViZXJuZXRlc1ZlcnNpb24uVjFfMTgudmVyc2lvbiwgXCI5LjQuMFwiXSxcbl0pO1xuXG5Ac3VwcG9ydHNBTExcbmV4cG9ydCBjbGFzcyBDbHVzdGVyQXV0b1NjYWxlckFkZE9uIGV4dGVuZHMgSGVsbUFkZE9uIHtcblxuICAgIHByaXZhdGUgb3B0aW9uczogQ2x1c3RlckF1dG9TY2FsZXJBZGRPblByb3BzO1xuXG4gICAgY29uc3RydWN0b3IocHJvcHM/OiBDbHVzdGVyQXV0b1NjYWxlckFkZE9uUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoeyAuLi5kZWZhdWx0UHJvcHMgYXMgYW55LCAuLi5wcm9wcyB9KTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gdGhpcy5wcm9wcztcbiAgICB9XG4gICAgXG4gICAgQGNvbmZsaWN0c1dpdGgoJ0thcnBlbnRlckFkZE9uJylcbiAgICBkZXBsb3koY2x1c3RlckluZm86IENsdXN0ZXJJbmZvKTogUHJvbWlzZTxDb25zdHJ1Y3Q+IHtcblxuICAgICAgICBpZih0aGlzLm9wdGlvbnMudmVyc2lvbj8udHJpbSgpID09PSAnYXV0bycpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy52ZXJzaW9uID0gdmVyc2lvbk1hcC5nZXQoY2x1c3RlckluZm8udmVyc2lvbi52ZXJzaW9uKTtcbiAgICAgICAgICAgIGlmKCF0aGlzLm9wdGlvbnMudmVyc2lvbikge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy52ZXJzaW9uID0gdmVyc2lvbk1hcC52YWx1ZXMoKS5uZXh0KCkudmFsdWU7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4oYFVuYWJsZSB0byBhdXRvLWRldGVjdCBjbHVzdGVyIGF1dG9zY2FsZXIgdmVyc2lvbi4gQXBwbHlpbmcgbGF0ZXN0OiAke3RoaXMub3B0aW9ucy52ZXJzaW9ufWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IFxuXG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBjbHVzdGVySW5mby5jbHVzdGVyO1xuICAgICAgICBjb25zdCBub2RlR3JvdXBzID0gYXNzZXJ0RUMyTm9kZUdyb3VwKGNsdXN0ZXJJbmZvLCBcIkNsdXN0ZXIgQXV0b3NjYWxlclwiKTtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gdGhpcy5vcHRpb25zLnZhbHVlcyB8fCB7fTtcbiAgICAgICAgY29uc3QgbmFtZXNwYWNlID0gdGhpcy5vcHRpb25zLm5hbWVzcGFjZSE7XG4gICAgICAgIFxuICAgICAgICAvLyBDcmVhdGUgSUFNIFBvbGljeVxuICAgICAgICBjb25zdCBhdXRvc2NhbGVyU3RtdCA9IG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KCk7XG4gICAgICAgIGF1dG9zY2FsZXJTdG10LmFkZFJlc291cmNlcyhcIipcIik7XG4gICAgICAgIGF1dG9zY2FsZXJTdG10LmFkZEFjdGlvbnMoXG4gICAgICAgICAgICBcImF1dG9zY2FsaW5nOkRlc2NyaWJlQXV0b1NjYWxpbmdHcm91cHNcIixcbiAgICAgICAgICAgIFwiYXV0b3NjYWxpbmc6RGVzY3JpYmVBdXRvU2NhbGluZ0luc3RhbmNlc1wiLFxuICAgICAgICAgICAgXCJhdXRvc2NhbGluZzpEZXNjcmliZUxhdW5jaENvbmZpZ3VyYXRpb25zXCIsXG4gICAgICAgICAgICBcImF1dG9zY2FsaW5nOkRlc2NyaWJlVGFnc1wiLFxuICAgICAgICAgICAgXCJhdXRvc2NhbGluZzpTZXREZXNpcmVkQ2FwYWNpdHlcIixcbiAgICAgICAgICAgIFwiYXV0b3NjYWxpbmc6VGVybWluYXRlSW5zdGFuY2VJbkF1dG9TY2FsaW5nR3JvdXBcIixcbiAgICAgICAgICAgIFwiZWMyOkRlc2NyaWJlTGF1bmNoVGVtcGxhdGVWZXJzaW9uc1wiLFxuICAgICAgICAgICAgXCJlYzI6RGVzY3JpYmVJbnN0YW5jZVR5cGVzXCIsXG4gICAgICAgICAgICBcImVrczpEZXNjcmliZU5vZGVncm91cFwiXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgYXV0b3NjYWxlclBvbGljeURvY3VtZW50ID0gbmV3IGlhbS5Qb2xpY3lEb2N1bWVudCh7XG4gICAgICAgICAgICBzdGF0ZW1lbnRzOiBbYXV0b3NjYWxlclN0bXRdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRhZyBub2RlIGdyb3Vwc1xuICAgICAgICBjb25zdCBjbHVzdGVyTmFtZSA9IG5ldyBDZm5Kc29uKGNsdXN0ZXIuc3RhY2ssIFwiY2x1c3Rlck5hbWVcIiwge1xuICAgICAgICAgICAgdmFsdWU6IGNsdXN0ZXIuY2x1c3Rlck5hbWUsXG4gICAgICAgIH0pO1xuICAgICAgICBmb3IobGV0IG5nIG9mIG5vZGVHcm91cHMpIHtcbiAgICAgICAgICAgIFRhZ3Mub2YobmcpLmFkZChgazhzLmlvL2NsdXN0ZXItYXV0b3NjYWxlci8ke2NsdXN0ZXJOYW1lfWAsIFwib3duZWRcIiwgeyBhcHBseVRvTGF1bmNoZWRJbnN0YW5jZXM6IHRydWUgfSk7XG4gICAgICAgICAgICBUYWdzLm9mKG5nKS5hZGQoXCJrOHMuaW8vY2x1c3Rlci1hdXRvc2NhbGVyL2VuYWJsZWRcIiwgXCJ0cnVlXCIsIHsgYXBwbHlUb0xhdW5jaGVkSW5zdGFuY2VzOiB0cnVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ3JlYXRlIElSU0FcbiAgICAgICAgY29uc3Qgc2EgPSBjcmVhdGVTZXJ2aWNlQWNjb3VudChjbHVzdGVyLCBSRUxFQVNFLCBuYW1lc3BhY2UsIGF1dG9zY2FsZXJQb2xpY3lEb2N1bWVudCk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIG5hbWVzcGFjZVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNyZWF0ZU5hbWVzcGFjZSkge1xuICAgICAgICAgICAgY29uc3QgbnMgPSBjcmVhdGVOYW1lc3BhY2UobmFtZXNwYWNlLCBjbHVzdGVyLCB0cnVlKTtcbiAgICAgICAgICAgIHNhLm5vZGUuYWRkRGVwZW5kZW5jeShucyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDcmVhdGUgSGVsbSBDaGFydFxuICAgICAgICBzZXRQYXRoKHZhbHVlcywgXCJjbG91ZFByb3ZpZGVyXCIsIFwiYXdzXCIpO1xuICAgICAgICBzZXRQYXRoKHZhbHVlcywgXCJhdXRvRGlzY292ZXJ5LmNsdXN0ZXJOYW1lXCIsIGNsdXN0ZXIuY2x1c3Rlck5hbWUpO1xuICAgICAgICBzZXRQYXRoKHZhbHVlcywgXCJhd3NSZWdpb25cIiwgY2x1c3Rlci5zdGFjay5yZWdpb24pO1xuICAgICAgICBzZXRQYXRoKHZhbHVlcywgXCJyYmFjLnNlcnZpY2VBY2NvdW50LmNyZWF0ZVwiLCBmYWxzZSk7XG4gICAgICAgIHNldFBhdGgodmFsdWVzLCBcInJiYWMuc2VydmljZUFjY291bnQubmFtZVwiLCBSRUxFQVNFKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGNsdXN0ZXJBdXRvc2NhbGVyQ2hhcnQgPSB0aGlzLmFkZEhlbG1DaGFydChjbHVzdGVySW5mbywgdmFsdWVzLCBmYWxzZSk7XG4gICAgICAgIGNsdXN0ZXJBdXRvc2NhbGVyQ2hhcnQubm9kZS5hZGREZXBlbmRlbmN5KHNhKTtcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGNsdXN0ZXJBdXRvc2NhbGVyQ2hhcnQpO1xuICAgIH1cbn1cbiJdfQ==