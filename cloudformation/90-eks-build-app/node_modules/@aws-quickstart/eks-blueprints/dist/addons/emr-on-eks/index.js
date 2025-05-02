"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmrEksAddOn = void 0;
const assert = require("assert");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_eks_1 = require("aws-cdk-lib/aws-eks");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const utils_1 = require("../../utils");
let EmrEksAddOn = class EmrEksAddOn {
    deploy(clusterInfo) {
        assert(clusterInfo.cluster instanceof aws_eks_1.Cluster, "EmrEksAddOn cannot be used with imported clusters as it requires changes to the cluster authentication.");
        const cluster = clusterInfo.cluster;
        /*
        * Create the service role used by EMR on EKS
        */
        const emrOnEksSlr = new aws_iam_1.CfnServiceLinkedRole(cluster.stack, 'EmrServiceRole', {
            awsServiceName: 'emr-containers.amazonaws.com',
        });
        //Init the service role as IRole because `addRoleMapping` method does not
        //support the CfnServiceLinkedRole type
        const emrEksServiceRole = aws_iam_1.Role.fromRoleArn(cluster.stack, 'ServiceRoleForAmazonEMRContainers', `arn:aws:iam::${aws_cdk_lib_1.Stack.of(cluster.stack).account}:role/AWSServiceRoleForAmazonEMRContainers`);
        //Add the service role to the AwsAuth
        cluster.awsAuth.addRoleMapping(emrEksServiceRole, {
            username: 'emr-containers',
            groups: ['']
        });
        return Promise.resolve(emrOnEksSlr);
    }
};
exports.EmrEksAddOn = EmrEksAddOn;
exports.EmrEksAddOn = EmrEksAddOn = __decorate([
    utils_1.supportsALL
], EmrEksAddOn);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL2Vtci1vbi1la3MvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsaUNBQWtDO0FBRWxDLDZDQUFvQztBQUNwQyxpREFBOEM7QUFDOUMsaURBQXdFO0FBRXhFLHVDQUEwQztBQUduQyxJQUFNLFdBQVcsR0FBakIsTUFBTSxXQUFXO0lBQ3RCLE1BQU0sQ0FBQyxXQUF3QjtRQUM3QixNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sWUFBWSxpQkFBTyxFQUFFLHlHQUF5RyxDQUFDLENBQUM7UUFDMUosTUFBTSxPQUFPLEdBQVksV0FBVyxDQUFDLE9BQU8sQ0FBQztRQUU3Qzs7VUFFRTtRQUNGLE1BQU0sV0FBVyxHQUFHLElBQUksOEJBQW9CLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtZQUM1RSxjQUFjLEVBQUUsOEJBQThCO1NBQy9DLENBQUMsQ0FBQztRQUdILHlFQUF5RTtRQUN6RSx1Q0FBdUM7UUFDdkMsTUFBTSxpQkFBaUIsR0FBVSxjQUFJLENBQUMsV0FBVyxDQUMvQyxPQUFPLENBQUMsS0FBSyxFQUNiLG1DQUFtQyxFQUNuQyxnQkFBZ0IsbUJBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQ3hDLDRDQUE0QyxDQUM3QyxDQUFDO1FBRUYscUNBQXFDO1FBQ3JDLE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUM1QixpQkFBaUIsRUFDakI7WUFDRSxRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQztTQUNiLENBQ0YsQ0FBQztRQUVGLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN0QyxDQUFDO0NBQ0YsQ0FBQTtBQWpDWSxrQ0FBVztzQkFBWCxXQUFXO0lBRHZCLG1CQUFXO0dBQ0MsV0FBVyxDQWlDdkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXNzZXJ0ID0gcmVxdWlyZShcImFzc2VydFwiKTtcbmltcG9ydCB7IENsdXN0ZXJBZGRPbiwgQ2x1c3RlckluZm8gfSBmcm9tIFwiLi4vLi4vc3BpXCI7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHsgQ2x1c3RlciB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZWtzXCI7XG5pbXBvcnQgeyBDZm5TZXJ2aWNlTGlua2VkUm9sZSwgSVJvbGUsIFJvbGUgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWlhbVwiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCB7IHN1cHBvcnRzQUxMIH0gZnJvbSBcIi4uLy4uL3V0aWxzXCI7XG5cbkBzdXBwb3J0c0FMTFxuZXhwb3J0IGNsYXNzIEVtckVrc0FkZE9uIGltcGxlbWVudHMgQ2x1c3RlckFkZE9uIHtcbiAgZGVwbG95KGNsdXN0ZXJJbmZvOiBDbHVzdGVySW5mbyk6IFByb21pc2U8Q29uc3RydWN0PiB7XG4gICAgYXNzZXJ0KGNsdXN0ZXJJbmZvLmNsdXN0ZXIgaW5zdGFuY2VvZiBDbHVzdGVyLCBcIkVtckVrc0FkZE9uIGNhbm5vdCBiZSB1c2VkIHdpdGggaW1wb3J0ZWQgY2x1c3RlcnMgYXMgaXQgcmVxdWlyZXMgY2hhbmdlcyB0byB0aGUgY2x1c3RlciBhdXRoZW50aWNhdGlvbi5cIik7XG4gICAgY29uc3QgY2x1c3RlcjogQ2x1c3RlciA9IGNsdXN0ZXJJbmZvLmNsdXN0ZXI7XG5cbiAgICAvKlxuICAgICogQ3JlYXRlIHRoZSBzZXJ2aWNlIHJvbGUgdXNlZCBieSBFTVIgb24gRUtTIFxuICAgICovXG4gICAgY29uc3QgZW1yT25Fa3NTbHIgPSBuZXcgQ2ZuU2VydmljZUxpbmtlZFJvbGUoY2x1c3Rlci5zdGFjaywgJ0VtclNlcnZpY2VSb2xlJywge1xuICAgICAgYXdzU2VydmljZU5hbWU6ICdlbXItY29udGFpbmVycy5hbWF6b25hd3MuY29tJyxcbiAgICB9KTtcblxuXG4gICAgLy9Jbml0IHRoZSBzZXJ2aWNlIHJvbGUgYXMgSVJvbGUgYmVjYXVzZSBgYWRkUm9sZU1hcHBpbmdgIG1ldGhvZCBkb2VzIG5vdFxuICAgIC8vc3VwcG9ydCB0aGUgQ2ZuU2VydmljZUxpbmtlZFJvbGUgdHlwZVxuICAgIGNvbnN0IGVtckVrc1NlcnZpY2VSb2xlOiBJUm9sZSA9IFJvbGUuZnJvbVJvbGVBcm4oXG4gICAgICBjbHVzdGVyLnN0YWNrLFxuICAgICAgJ1NlcnZpY2VSb2xlRm9yQW1hem9uRU1SQ29udGFpbmVycycsXG4gICAgICBgYXJuOmF3czppYW06OiR7U3RhY2sub2YoY2x1c3Rlci5zdGFjaykuYWNjb3VudFxuICAgICAgfTpyb2xlL0FXU1NlcnZpY2VSb2xlRm9yQW1hem9uRU1SQ29udGFpbmVyc2AsXG4gICAgKTtcbiAgICBcbiAgICAvL0FkZCB0aGUgc2VydmljZSByb2xlIHRvIHRoZSBBd3NBdXRoXG4gICAgY2x1c3Rlci5hd3NBdXRoLmFkZFJvbGVNYXBwaW5nKFxuICAgICAgZW1yRWtzU2VydmljZVJvbGUsXG4gICAgICB7XG4gICAgICAgIHVzZXJuYW1lOiAnZW1yLWNvbnRhaW5lcnMnLFxuICAgICAgICBncm91cHM6IFsnJ11cbiAgICAgIH1cbiAgICApO1xuICBcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGVtck9uRWtzU2xyKTtcbiAgfVxufSJdfQ==