"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsBatchAddOn = void 0;
const assert = require("assert");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_eks_1 = require("aws-cdk-lib/aws-eks");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const utils_1 = require("../../utils");
const BATCH = 'aws-batch';
let AwsBatchAddOn = class AwsBatchAddOn {
    deploy(clusterInfo) {
        assert(clusterInfo.cluster instanceof aws_eks_1.Cluster, "AwsBatchAddOn cannot be used with imported clusters");
        const cluster = clusterInfo.cluster;
        const roleNameforBatch = 'AWSServiceRoleForBatch';
        const slrCheck = aws_iam_1.Role.fromRoleName(cluster.stack, 'BatchServiceLinkedRole', roleNameforBatch);
        // Create the service role used by AWS Batch on EKS if one doesn't exist
        if (slrCheck.roleName != roleNameforBatch) {
            new aws_iam_1.CfnServiceLinkedRole(cluster.stack, 'BatchServiceRole', {
                awsServiceName: 'batch.amazonaws.com',
            });
        }
        //Init the service role as IRole because `addRoleMapping` method does not
        //support the CfnServiceLinkedRole type
        const batchEksServiceRole = aws_iam_1.Role.fromRoleArn(cluster.stack, 'ServiceRoleForBatch', `arn:aws:iam::${aws_cdk_lib_1.Stack.of(cluster.stack).account}:role/AWSServiceRoleForBatch`);
        //Add the service role to the AwsAuth
        cluster.awsAuth.addRoleMapping(batchEksServiceRole, {
            username: BATCH,
            groups: ['']
        });
        return Promise.resolve(batchEksServiceRole);
    }
};
exports.AwsBatchAddOn = AwsBatchAddOn;
exports.AwsBatchAddOn = AwsBatchAddOn = __decorate([
    utils_1.supportsALL
], AwsBatchAddOn);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL2F3cy1iYXRjaC1vbi1la3MvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsaUNBQWtDO0FBRWxDLDZDQUFvQztBQUNwQyxpREFBOEM7QUFDOUMsaURBQXdFO0FBRXhFLHVDQUEwQztBQUUxQyxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUM7QUFHbkIsSUFBTSxhQUFhLEdBQW5CLE1BQU0sYUFBYTtJQUN4QixNQUFNLENBQUMsV0FBd0I7UUFDN0IsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLFlBQVksaUJBQU8sRUFBRSxxREFBcUQsQ0FBQyxDQUFDO1FBQ3RHLE1BQU0sT0FBTyxHQUFZLFdBQVcsQ0FBQyxPQUFPLENBQUM7UUFDN0MsTUFBTSxnQkFBZ0IsR0FBRyx3QkFBd0IsQ0FBQztRQUNsRCxNQUFNLFFBQVEsR0FBRyxjQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsd0JBQXdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUU5Rix3RUFBd0U7UUFDeEUsSUFBSSxRQUFRLENBQUMsUUFBUSxJQUFJLGdCQUFnQixFQUFDLENBQUM7WUFDekMsSUFBSSw4QkFBb0IsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFFO2dCQUMxRCxjQUFjLEVBQUUscUJBQXFCO2FBQ3RDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCx5RUFBeUU7UUFDekUsdUNBQXVDO1FBQ3ZDLE1BQU0sbUJBQW1CLEdBQVUsY0FBSSxDQUFDLFdBQVcsQ0FDakQsT0FBTyxDQUFDLEtBQUssRUFDYixxQkFBcUIsRUFDckIsZ0JBQWdCLG1CQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLDhCQUE4QixDQUM5RSxDQUFDO1FBRUYscUNBQXFDO1FBQ3JDLE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUM1QixtQkFBbUIsRUFDbkI7WUFDRSxRQUFRLEVBQUUsS0FBSztZQUNmLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQztTQUNiLENBQ0YsQ0FBQztRQUVGLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBRTlDLENBQUM7Q0FDRixDQUFBO0FBbENZLHNDQUFhO3dCQUFiLGFBQWE7SUFEekIsbUJBQVc7R0FDQyxhQUFhLENBa0N6QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhc3NlcnQgPSByZXF1aXJlKFwiYXNzZXJ0XCIpO1xuaW1wb3J0IHsgQ2x1c3RlckFkZE9uLCBDbHVzdGVySW5mbyB9IGZyb20gXCIuLi8uLi9zcGlcIjtcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgeyBDbHVzdGVyIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1la3NcIjtcbmltcG9ydCB7IENmblNlcnZpY2VMaW5rZWRSb2xlLCBJUm9sZSwgUm9sZSB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtaWFtXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0IHsgc3VwcG9ydHNBTEwgfSBmcm9tIFwiLi4vLi4vdXRpbHNcIjtcblxuY29uc3QgQkFUQ0ggPSAnYXdzLWJhdGNoJztcblxuQHN1cHBvcnRzQUxMXG5leHBvcnQgY2xhc3MgQXdzQmF0Y2hBZGRPbiBpbXBsZW1lbnRzIENsdXN0ZXJBZGRPbiB7XG4gIGRlcGxveShjbHVzdGVySW5mbzogQ2x1c3RlckluZm8pOiBQcm9taXNlPENvbnN0cnVjdD4ge1xuICAgIGFzc2VydChjbHVzdGVySW5mby5jbHVzdGVyIGluc3RhbmNlb2YgQ2x1c3RlciwgXCJBd3NCYXRjaEFkZE9uIGNhbm5vdCBiZSB1c2VkIHdpdGggaW1wb3J0ZWQgY2x1c3RlcnNcIik7XG4gICAgY29uc3QgY2x1c3RlcjogQ2x1c3RlciA9IGNsdXN0ZXJJbmZvLmNsdXN0ZXI7XG4gICAgY29uc3Qgcm9sZU5hbWVmb3JCYXRjaCA9ICdBV1NTZXJ2aWNlUm9sZUZvckJhdGNoJztcbiAgICBjb25zdCBzbHJDaGVjayA9IFJvbGUuZnJvbVJvbGVOYW1lKGNsdXN0ZXIuc3RhY2ssICdCYXRjaFNlcnZpY2VMaW5rZWRSb2xlJywgcm9sZU5hbWVmb3JCYXRjaCk7XG5cbiAgICAvLyBDcmVhdGUgdGhlIHNlcnZpY2Ugcm9sZSB1c2VkIGJ5IEFXUyBCYXRjaCBvbiBFS1MgaWYgb25lIGRvZXNuJ3QgZXhpc3RcbiAgICBpZiAoc2xyQ2hlY2sucm9sZU5hbWUgIT0gcm9sZU5hbWVmb3JCYXRjaCl7XG4gICAgICBuZXcgQ2ZuU2VydmljZUxpbmtlZFJvbGUoY2x1c3Rlci5zdGFjaywgJ0JhdGNoU2VydmljZVJvbGUnLCB7XG4gICAgICAgIGF3c1NlcnZpY2VOYW1lOiAnYmF0Y2guYW1hem9uYXdzLmNvbScsXG4gICAgICB9KTtcbiAgICB9ICAgIFxuXG4gICAgLy9Jbml0IHRoZSBzZXJ2aWNlIHJvbGUgYXMgSVJvbGUgYmVjYXVzZSBgYWRkUm9sZU1hcHBpbmdgIG1ldGhvZCBkb2VzIG5vdFxuICAgIC8vc3VwcG9ydCB0aGUgQ2ZuU2VydmljZUxpbmtlZFJvbGUgdHlwZVxuICAgIGNvbnN0IGJhdGNoRWtzU2VydmljZVJvbGU6IElSb2xlID0gUm9sZS5mcm9tUm9sZUFybihcbiAgICAgIGNsdXN0ZXIuc3RhY2ssXG4gICAgICAnU2VydmljZVJvbGVGb3JCYXRjaCcsXG4gICAgICBgYXJuOmF3czppYW06OiR7U3RhY2sub2YoY2x1c3Rlci5zdGFjaykuYWNjb3VudH06cm9sZS9BV1NTZXJ2aWNlUm9sZUZvckJhdGNoYCxcbiAgICApO1xuICAgIFxuICAgIC8vQWRkIHRoZSBzZXJ2aWNlIHJvbGUgdG8gdGhlIEF3c0F1dGhcbiAgICBjbHVzdGVyLmF3c0F1dGguYWRkUm9sZU1hcHBpbmcoXG4gICAgICBiYXRjaEVrc1NlcnZpY2VSb2xlLFxuICAgICAge1xuICAgICAgICB1c2VybmFtZTogQkFUQ0gsXG4gICAgICAgIGdyb3VwczogWycnXVxuICAgICAgfVxuICAgICk7XG4gIFxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoYmF0Y2hFa3NTZXJ2aWNlUm9sZSk7XG5cbiAgfVxufSJdfQ==