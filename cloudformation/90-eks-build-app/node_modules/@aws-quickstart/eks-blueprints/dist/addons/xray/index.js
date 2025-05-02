"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var XrayAddOn_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.XrayAddOn = void 0;
const aws_eks_1 = require("aws-cdk-lib/aws-eks");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const cluster_providers_1 = require("../../cluster-providers");
const utils_1 = require("../../utils");
/**
 * Implementation of AWS X-Ray add-on for EKS Blueprints. Installs xray daemonset and exposes
 * an internal ClusterIP service for tracing on port 2000 (UDP).
 */
let XrayAddOn = XrayAddOn_1 = class XrayAddOn {
    deploy(clusterInfo) {
        const cluster = clusterInfo.cluster;
        const nodeGroups = (0, cluster_providers_1.assertEC2NodeGroup)(clusterInfo, XrayAddOn_1.name);
        nodeGroups.forEach(nodeGroup => {
            nodeGroup.role.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('AWSXRayDaemonWriteAccess'));
        });
        // Apply manifest
        const doc = (0, utils_1.readYamlDocument)(__dirname + '/xray-ds.yaml');
        const manifest = doc.split("---").map(e => (0, utils_1.loadYaml)(e));
        new aws_eks_1.KubernetesManifest(cluster.stack, "xray-daemon", {
            cluster,
            manifest,
            overwrite: true
        });
    }
};
exports.XrayAddOn = XrayAddOn;
exports.XrayAddOn = XrayAddOn = XrayAddOn_1 = __decorate([
    utils_1.supportsX86
], XrayAddOn);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL3hyYXkvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLGlEQUF5RDtBQUN6RCxpREFBb0Q7QUFDcEQsK0RBQTZEO0FBRTdELHVDQUFzRTtBQUV0RTs7O0dBR0c7QUFFSSxJQUFNLFNBQVMsaUJBQWYsTUFBTSxTQUFTO0lBRWxCLE1BQU0sQ0FBQyxXQUF3QjtRQUMzQixNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDO1FBQ3BDLE1BQU0sVUFBVSxHQUFHLElBQUEsc0NBQWtCLEVBQUMsV0FBVyxFQUFFLFdBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVuRSxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzNCLFNBQVMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsdUJBQWEsQ0FBQyx3QkFBd0IsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUM7UUFDeEcsQ0FBQyxDQUFDLENBQUM7UUFFSCxpQkFBaUI7UUFDakIsTUFBTSxHQUFHLEdBQUcsSUFBQSx3QkFBZ0IsRUFBQyxTQUFTLEdBQUcsZUFBZSxDQUFDLENBQUM7UUFDMUQsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFBLGdCQUFRLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RCxJQUFJLDRCQUFrQixDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQ2pELE9BQU87WUFDUCxRQUFRO1lBQ1IsU0FBUyxFQUFFLElBQUk7U0FDbEIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKLENBQUE7QUFuQlksOEJBQVM7b0JBQVQsU0FBUztJQURyQixtQkFBVztHQUNDLFNBQVMsQ0FtQnJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgS3ViZXJuZXRlc01hbmlmZXN0IH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1la3NcIjtcbmltcG9ydCB7IE1hbmFnZWRQb2xpY3kgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWlhbVwiO1xuaW1wb3J0IHsgYXNzZXJ0RUMyTm9kZUdyb3VwIH0gZnJvbSBcIi4uLy4uL2NsdXN0ZXItcHJvdmlkZXJzXCI7XG5pbXBvcnQgeyBDbHVzdGVyQWRkT24sIENsdXN0ZXJJbmZvIH0gZnJvbSBcIi4uLy4uL3NwaVwiO1xuaW1wb3J0IHsgbG9hZFlhbWwsIHJlYWRZYW1sRG9jdW1lbnQsIHN1cHBvcnRzWDg2IH0gZnJvbSBcIi4uLy4uL3V0aWxzXCI7XG5cbi8qKlxuICogSW1wbGVtZW50YXRpb24gb2YgQVdTIFgtUmF5IGFkZC1vbiBmb3IgRUtTIEJsdWVwcmludHMuIEluc3RhbGxzIHhyYXkgZGFlbW9uc2V0IGFuZCBleHBvc2VzIFxuICogYW4gaW50ZXJuYWwgQ2x1c3RlcklQIHNlcnZpY2UgZm9yIHRyYWNpbmcgb24gcG9ydCAyMDAwIChVRFApLlxuICovXG5Ac3VwcG9ydHNYODZcbmV4cG9ydCBjbGFzcyBYcmF5QWRkT24gaW1wbGVtZW50cyBDbHVzdGVyQWRkT24ge1xuXG4gICAgZGVwbG95KGNsdXN0ZXJJbmZvOiBDbHVzdGVySW5mbyk6IHZvaWQge1xuICAgICAgICBjb25zdCBjbHVzdGVyID0gY2x1c3RlckluZm8uY2x1c3RlcjtcbiAgICAgICAgY29uc3Qgbm9kZUdyb3VwcyA9IGFzc2VydEVDMk5vZGVHcm91cChjbHVzdGVySW5mbywgWHJheUFkZE9uLm5hbWUpO1xuXG4gICAgICAgIG5vZGVHcm91cHMuZm9yRWFjaChub2RlR3JvdXAgPT4ge1xuICAgICAgICAgICAgbm9kZUdyb3VwLnJvbGUuYWRkTWFuYWdlZFBvbGljeShNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQVdTWFJheURhZW1vbldyaXRlQWNjZXNzJykpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBcHBseSBtYW5pZmVzdFxuICAgICAgICBjb25zdCBkb2MgPSByZWFkWWFtbERvY3VtZW50KF9fZGlybmFtZSArICcveHJheS1kcy55YW1sJyk7XG4gICAgICAgIGNvbnN0IG1hbmlmZXN0ID0gZG9jLnNwbGl0KFwiLS0tXCIpLm1hcChlID0+IGxvYWRZYW1sKGUpKTtcbiAgICAgICAgbmV3IEt1YmVybmV0ZXNNYW5pZmVzdChjbHVzdGVyLnN0YWNrLCBcInhyYXktZGFlbW9uXCIsIHtcbiAgICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgICBtYW5pZmVzdCxcbiAgICAgICAgICAgIG92ZXJ3cml0ZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9XG59Il19