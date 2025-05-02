"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.podIdentityAssociation = podIdentityAssociation;
const aws_eks_1 = require("aws-cdk-lib/aws-eks");
const iam = require("aws-cdk-lib/aws-iam");
/**
 * Creates IAM role and EKS Pod Identity association
 * @param clusterInfo
 * @param name
 * @param namespace
 * @param policyDocument
 *
 * @returns podIdentityAssociation
 */
function podIdentityAssociation(cluster, name, namespace, policyDocument) {
    var _a;
    const policy = new iam.ManagedPolicy(cluster, `${name}-managed-policy`, {
        document: policyDocument,
    });
    const role = new iam.Role(cluster, `${name}-role`, {
        assumedBy: new iam.ServicePrincipal("pods.eks.amazonaws.com"),
    });
    (_a = role.assumeRolePolicy) === null || _a === void 0 ? void 0 : _a.addStatements(new iam.PolicyStatement({
        sid: "AllowEksAuthToAssumeRoleForPodIdentity",
        actions: [
            "sts:AssumeRole",
            "sts:TagSession"
        ],
        principals: [new iam.ServicePrincipal("pods.eks.amazonaws.com")],
    }));
    role.addManagedPolicy(policy);
    const podIdentityAssociation = new aws_eks_1.CfnPodIdentityAssociation(cluster, `${name}-pod-identity-association`, {
        clusterName: cluster.clusterName,
        namespace,
        roleArn: role.roleArn,
        serviceAccount: name,
    });
    return podIdentityAssociation;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9kLWlkZW50aXR5LXV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL3V0aWxzL3BvZC1pZGVudGl0eS11dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVlBLHdEQWdDQztBQTVDRCxpREFBMEU7QUFDMUUsMkNBQTJDO0FBRTNDOzs7Ozs7OztHQVFHO0FBQ0gsU0FBZ0Isc0JBQXNCLENBQ3BDLE9BQWlCLEVBQ2pCLElBQVksRUFDWixTQUFpQixFQUNqQixjQUFrQzs7SUFFbEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksaUJBQWlCLEVBQUU7UUFDdEUsUUFBUSxFQUFFLGNBQWM7S0FDekIsQ0FBQyxDQUFDO0lBRUgsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksT0FBTyxFQUFFO1FBQ2pELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyx3QkFBd0IsQ0FBQztLQUM5RCxDQUFDLENBQUM7SUFDSCxNQUFBLElBQUksQ0FBQyxnQkFBZ0IsMENBQUUsYUFBYSxDQUNsQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7UUFDdEIsR0FBRyxFQUFFLHdDQUF3QztRQUM3QyxPQUFPLEVBQUU7WUFDUCxnQkFBZ0I7WUFDaEIsZ0JBQWdCO1NBQ2pCO1FBQ0QsVUFBVSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsd0JBQXdCLENBQUMsQ0FBQztLQUNqRSxDQUFDLENBQ0gsQ0FBQztJQUNGLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUU5QixNQUFNLHNCQUFzQixHQUFHLElBQUksbUNBQXlCLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSwyQkFBMkIsRUFBRTtRQUN4RyxXQUFXLEVBQUUsT0FBTyxDQUFDLFdBQVc7UUFDaEMsU0FBUztRQUNULE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztRQUNyQixjQUFjLEVBQUUsSUFBSTtLQUNyQixDQUFDLENBQUM7SUFDSCxPQUFPLHNCQUFzQixDQUFDO0FBQ2hDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDZm5Qb2RJZGVudGl0eUFzc29jaWF0aW9uLCBJQ2x1c3RlciB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZWtzXCI7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1pYW1cIjtcblxuLyoqXG4gKiBDcmVhdGVzIElBTSByb2xlIGFuZCBFS1MgUG9kIElkZW50aXR5IGFzc29jaWF0aW9uXG4gKiBAcGFyYW0gY2x1c3RlckluZm9cbiAqIEBwYXJhbSBuYW1lXG4gKiBAcGFyYW0gbmFtZXNwYWNlXG4gKiBAcGFyYW0gcG9saWN5RG9jdW1lbnRcbiAqXG4gKiBAcmV0dXJucyBwb2RJZGVudGl0eUFzc29jaWF0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwb2RJZGVudGl0eUFzc29jaWF0aW9uKFxuICBjbHVzdGVyOiBJQ2x1c3RlcixcbiAgbmFtZTogc3RyaW5nLFxuICBuYW1lc3BhY2U6IHN0cmluZyxcbiAgcG9saWN5RG9jdW1lbnQ6IGlhbS5Qb2xpY3lEb2N1bWVudFxuKTogQ2ZuUG9kSWRlbnRpdHlBc3NvY2lhdGlvbiB7XG4gIGNvbnN0IHBvbGljeSA9IG5ldyBpYW0uTWFuYWdlZFBvbGljeShjbHVzdGVyLCBgJHtuYW1lfS1tYW5hZ2VkLXBvbGljeWAsIHtcbiAgICBkb2N1bWVudDogcG9saWN5RG9jdW1lbnQsXG4gIH0pO1xuXG4gIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoY2x1c3RlciwgYCR7bmFtZX0tcm9sZWAsIHtcbiAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbChcInBvZHMuZWtzLmFtYXpvbmF3cy5jb21cIiksXG4gIH0pO1xuICByb2xlLmFzc3VtZVJvbGVQb2xpY3k/LmFkZFN0YXRlbWVudHMoXG4gICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgc2lkOiBcIkFsbG93RWtzQXV0aFRvQXNzdW1lUm9sZUZvclBvZElkZW50aXR5XCIsXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIFwic3RzOkFzc3VtZVJvbGVcIixcbiAgICAgICAgXCJzdHM6VGFnU2Vzc2lvblwiXG4gICAgICBdLFxuICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uU2VydmljZVByaW5jaXBhbChcInBvZHMuZWtzLmFtYXpvbmF3cy5jb21cIildLFxuICAgIH0pXG4gICk7XG4gIHJvbGUuYWRkTWFuYWdlZFBvbGljeShwb2xpY3kpO1xuXG4gIGNvbnN0IHBvZElkZW50aXR5QXNzb2NpYXRpb24gPSBuZXcgQ2ZuUG9kSWRlbnRpdHlBc3NvY2lhdGlvbihjbHVzdGVyLCBgJHtuYW1lfS1wb2QtaWRlbnRpdHktYXNzb2NpYXRpb25gLCB7XG4gICAgY2x1c3Rlck5hbWU6IGNsdXN0ZXIuY2x1c3Rlck5hbWUsXG4gICAgbmFtZXNwYWNlLFxuICAgIHJvbGVBcm46IHJvbGUucm9sZUFybixcbiAgICBzZXJ2aWNlQWNjb3VudDogbmFtZSxcbiAgfSk7XG4gIHJldHVybiBwb2RJZGVudGl0eUFzc29jaWF0aW9uO1xufSJdfQ==