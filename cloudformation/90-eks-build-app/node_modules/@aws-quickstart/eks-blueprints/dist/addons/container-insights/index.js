"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerInsightsAddOn = void 0;
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const ts_deepmerge_1 = require("ts-deepmerge");
const helm_addon_1 = require("../helm-addon");
const utils_1 = require("../../utils");
const defaultProps = {
    name: "adot-exporter-for-eks-on-ec2",
    namespace: undefined, // the chart will choke if this value is set
    chart: "adot-exporter-for-eks-on-ec2",
    version: "0.15.0",
    release: "adot-eks-addon",
    repository: "https://aws-observability.github.io/aws-otel-helm-charts"
};
/**
 * @deprecated use CloudWatch Insights add-on instead
 */
let ContainerInsightsAddOn = class ContainerInsightsAddOn extends helm_addon_1.HelmAddOn {
    constructor(props) {
        super({ ...defaultProps, ...props });
    }
    /**
     * @override
     */
    deploy(clusterInfo) {
        var _a;
        const cluster = clusterInfo.cluster;
        const policy = aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchAgentServerPolicy');
        // Create an adot-collector service account.
        const serviceAccountName = "adot-collector-sa";
        let serviceAccountNamespace;
        if (this.props.namespace) {
            serviceAccountNamespace = this.props.namespace;
        }
        else {
            serviceAccountNamespace = "amazon-metrics";
        }
        const ns = (0, utils_1.createNamespace)(serviceAccountNamespace, cluster, true);
        const sa = cluster.addServiceAccount(serviceAccountName, {
            name: serviceAccountName,
            namespace: serviceAccountNamespace,
        });
        // Apply Managed IAM policy to the service account.
        sa.role.addManagedPolicy(policy);
        sa.node.addDependency(ns);
        let values = {
            awsRegion: cluster.stack.region,
            clusterName: cluster.clusterName,
            serviceAccount: {
                create: false,
            },
            adotCollector: {
                daemonSet: {
                    createNamespace: false,
                    service: {
                        metrics: {
                            receivers: ["awscontainerinsightreceiver"],
                            exporters: ["awsemf"],
                        }
                    },
                    serviceAccount: {
                        create: false,
                    },
                    cwexporters: {
                        logStreamName: "EKSNode",
                    }
                }
            }
        };
        values = (0, ts_deepmerge_1.merge)(values, (_a = this.props.values) !== null && _a !== void 0 ? _a : {});
        const chart = this.addHelmChart(clusterInfo, values, true, false);
        chart.node.addDependency(sa);
        return Promise.resolve(chart);
    }
};
exports.ContainerInsightsAddOn = ContainerInsightsAddOn;
__decorate([
    (0, utils_1.conflictsWith)("AdotCollectorAddOn")
], ContainerInsightsAddOn.prototype, "deploy", null);
exports.ContainerInsightsAddOn = ContainerInsightsAddOn = __decorate([
    utils_1.supportsALL
], ContainerInsightsAddOn);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL2NvbnRhaW5lci1pbnNpZ2h0cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxpREFBb0Q7QUFFcEQsK0NBQXFDO0FBRXJDLDhDQUE4RDtBQUU5RCx1Q0FBMEU7QUFTMUUsTUFBTSxZQUFZLEdBQUc7SUFDakIsSUFBSSxFQUFFLDhCQUE4QjtJQUNwQyxTQUFTLEVBQUUsU0FBUyxFQUFFLDRDQUE0QztJQUNsRSxLQUFLLEVBQUUsOEJBQThCO0lBQ3JDLE9BQU8sRUFBRSxRQUFRO0lBQ2pCLE9BQU8sRUFBRSxnQkFBZ0I7SUFDekIsVUFBVSxFQUFFLDBEQUEwRDtDQUN6RSxDQUFDO0FBRUY7O0dBRUc7QUFFSSxJQUFNLHNCQUFzQixHQUE1QixNQUFNLHNCQUF1QixTQUFRLHNCQUFTO0lBRWpELFlBQVksS0FBa0M7UUFDMUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxZQUFZLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRDs7T0FFRztJQUVILE1BQU0sQ0FBQyxXQUF3Qjs7UUFDM0IsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQztRQUNwQyxNQUFNLE1BQU0sR0FBRyx1QkFBYSxDQUFDLHdCQUF3QixDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFFckYsNENBQTRDO1FBQzVDLE1BQU0sa0JBQWtCLEdBQUcsbUJBQW1CLENBQUM7UUFDL0MsSUFBSSx1QkFBdUIsQ0FBQztRQUU1QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDdkIsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDbkQsQ0FBQzthQUNJLENBQUM7WUFDRix1QkFBdUIsR0FBRyxnQkFBZ0IsQ0FBQztRQUMvQyxDQUFDO1FBRUQsTUFBTSxFQUFFLEdBQUcsSUFBQSx1QkFBZSxFQUFDLHVCQUF1QixFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuRSxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLEVBQUU7WUFDckQsSUFBSSxFQUFFLGtCQUFrQjtZQUN4QixTQUFTLEVBQUUsdUJBQXVCO1NBQ3JDLENBQUMsQ0FBQztRQUVILG1EQUFtRDtRQUNuRCxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pDLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTFCLElBQUksTUFBTSxHQUFpQjtZQUN2QixTQUFTLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNO1lBQy9CLFdBQVcsRUFBRSxPQUFPLENBQUMsV0FBVztZQUNoQyxjQUFjLEVBQUU7Z0JBQ1osTUFBTSxFQUFFLEtBQUs7YUFDaEI7WUFDRCxhQUFhLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFO29CQUNQLGVBQWUsRUFBRSxLQUFLO29CQUN0QixPQUFPLEVBQUU7d0JBQ0wsT0FBTyxFQUFFOzRCQUNMLFNBQVMsRUFBRSxDQUFDLDZCQUE2QixDQUFDOzRCQUMxQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7eUJBQ3hCO3FCQUNKO29CQUNELGNBQWMsRUFBRTt3QkFDWixNQUFNLEVBQUUsS0FBSztxQkFDaEI7b0JBQ0QsV0FBVyxFQUFFO3dCQUNULGFBQWEsRUFBRSxTQUFTO3FCQUMzQjtpQkFDSjthQUNKO1NBQ0osQ0FBQztRQUVGLE1BQU0sR0FBRyxJQUFBLG9CQUFLLEVBQUMsTUFBTSxFQUFFLE1BQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLG1DQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRWhELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbEUsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0IsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLENBQUM7Q0FDSixDQUFBO0FBbEVZLHdEQUFzQjtBQVUvQjtJQURDLElBQUEscUJBQWEsRUFBQyxvQkFBb0IsQ0FBQztvREF3RG5DO2lDQWpFUSxzQkFBc0I7SUFEbEMsbUJBQVc7R0FDQyxzQkFBc0IsQ0FrRWxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWFuYWdlZFBvbGljeSB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtaWFtXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tIFwidHMtZGVlcG1lcmdlXCI7XG5pbXBvcnQgeyBDbHVzdGVySW5mbyB9IGZyb20gXCIuLi8uLi9zcGlcIjtcbmltcG9ydCB7IEhlbG1BZGRPbiwgSGVsbUFkZE9uVXNlclByb3BzIH0gZnJvbSBcIi4uL2hlbG0tYWRkb25cIjtcbmltcG9ydCB7IFZhbHVlc1NjaGVtYSB9IGZyb20gXCIuL3ZhbHVlc1wiO1xuaW1wb3J0IHsgY29uZmxpY3RzV2l0aCwgY3JlYXRlTmFtZXNwYWNlLCBzdXBwb3J0c0FMTCB9IGZyb20gXCIuLi8uLi91dGlsc1wiO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIHVzZSBDbG91ZFdhdGNoIEluc2lnaHRzIGFkZC1vbiBpbnN0ZWFkXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29udGFpbmVySW5zaWdodEFkZG9uUHJvcHMgZXh0ZW5kcyBPbWl0PEhlbG1BZGRPblVzZXJQcm9wcywgXCJuYW1lc3BhY2VcIj4ge1xuICAgIHZhbHVlcz86IFZhbHVlc1NjaGVtYVxufVxuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgbmFtZTogXCJhZG90LWV4cG9ydGVyLWZvci1la3Mtb24tZWMyXCIsXG4gICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsIC8vIHRoZSBjaGFydCB3aWxsIGNob2tlIGlmIHRoaXMgdmFsdWUgaXMgc2V0XG4gICAgY2hhcnQ6IFwiYWRvdC1leHBvcnRlci1mb3ItZWtzLW9uLWVjMlwiLFxuICAgIHZlcnNpb246IFwiMC4xNS4wXCIsXG4gICAgcmVsZWFzZTogXCJhZG90LWVrcy1hZGRvblwiLFxuICAgIHJlcG9zaXRvcnk6IFwiaHR0cHM6Ly9hd3Mtb2JzZXJ2YWJpbGl0eS5naXRodWIuaW8vYXdzLW90ZWwtaGVsbS1jaGFydHNcIlxufTtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCB1c2UgQ2xvdWRXYXRjaCBJbnNpZ2h0cyBhZGQtb24gaW5zdGVhZFxuICovXG5Ac3VwcG9ydHNBTExcbmV4cG9ydCBjbGFzcyBDb250YWluZXJJbnNpZ2h0c0FkZE9uIGV4dGVuZHMgSGVsbUFkZE9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzPzogQ29udGFpbmVySW5zaWdodEFkZG9uUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoeyAuLi5kZWZhdWx0UHJvcHMsIC4uLnByb3BzIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBvdmVycmlkZVxuICAgICAqL1xuICAgIEBjb25mbGljdHNXaXRoKFwiQWRvdENvbGxlY3RvckFkZE9uXCIpXG4gICAgZGVwbG95KGNsdXN0ZXJJbmZvOiBDbHVzdGVySW5mbyk6IFByb21pc2U8Q29uc3RydWN0PiB7XG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBjbHVzdGVySW5mby5jbHVzdGVyOyAgICAgICAgXG4gICAgICAgIGNvbnN0IHBvbGljeSA9IE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdDbG91ZFdhdGNoQWdlbnRTZXJ2ZXJQb2xpY3knKTtcbiAgICAgICAgXG4gICAgICAgIC8vIENyZWF0ZSBhbiBhZG90LWNvbGxlY3RvciBzZXJ2aWNlIGFjY291bnQuXG4gICAgICAgIGNvbnN0IHNlcnZpY2VBY2NvdW50TmFtZSA9IFwiYWRvdC1jb2xsZWN0b3Itc2FcIjtcbiAgICAgICAgbGV0IHNlcnZpY2VBY2NvdW50TmFtZXNwYWNlO1xuXG4gICAgICAgIGlmICh0aGlzLnByb3BzLm5hbWVzcGFjZSkge1xuICAgICAgICAgICAgc2VydmljZUFjY291bnROYW1lc3BhY2UgPSB0aGlzLnByb3BzLm5hbWVzcGFjZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNlcnZpY2VBY2NvdW50TmFtZXNwYWNlID0gXCJhbWF6b24tbWV0cmljc1wiO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbnMgPSBjcmVhdGVOYW1lc3BhY2Uoc2VydmljZUFjY291bnROYW1lc3BhY2UsIGNsdXN0ZXIsIHRydWUpO1xuICAgICAgICBjb25zdCBzYSA9IGNsdXN0ZXIuYWRkU2VydmljZUFjY291bnQoc2VydmljZUFjY291bnROYW1lLCB7XG4gICAgICAgICAgICBuYW1lOiBzZXJ2aWNlQWNjb3VudE5hbWUsXG4gICAgICAgICAgICBuYW1lc3BhY2U6IHNlcnZpY2VBY2NvdW50TmFtZXNwYWNlLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBcHBseSBNYW5hZ2VkIElBTSBwb2xpY3kgdG8gdGhlIHNlcnZpY2UgYWNjb3VudC5cbiAgICAgICAgc2Eucm9sZS5hZGRNYW5hZ2VkUG9saWN5KHBvbGljeSk7XG4gICAgICAgIHNhLm5vZGUuYWRkRGVwZW5kZW5jeShucyk7XG5cbiAgICAgICAgbGV0IHZhbHVlczogVmFsdWVzU2NoZW1hID0ge1xuICAgICAgICAgICAgYXdzUmVnaW9uOiBjbHVzdGVyLnN0YWNrLnJlZ2lvbixcbiAgICAgICAgICAgIGNsdXN0ZXJOYW1lOiBjbHVzdGVyLmNsdXN0ZXJOYW1lLFxuICAgICAgICAgICAgc2VydmljZUFjY291bnQ6IHtcbiAgICAgICAgICAgICAgICBjcmVhdGU6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkb3RDb2xsZWN0b3I6IHtcbiAgICAgICAgICAgICAgICBkYWVtb25TZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlTmFtZXNwYWNlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0cmljczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY2VpdmVyczogW1wiYXdzY29udGFpbmVyaW5zaWdodHJlY2VpdmVyXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cG9ydGVyczogW1wiYXdzZW1mXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlQWNjb3VudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY3dleHBvcnRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ1N0cmVhbU5hbWU6IFwiRUtTTm9kZVwiLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhbHVlcyA9IG1lcmdlKHZhbHVlcywgdGhpcy5wcm9wcy52YWx1ZXMgPz8ge30pO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgY2hhcnQgPSB0aGlzLmFkZEhlbG1DaGFydChjbHVzdGVySW5mbywgdmFsdWVzLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIGNoYXJ0Lm5vZGUuYWRkRGVwZW5kZW5jeShzYSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoY2hhcnQpO1xuICAgIH1cbn0iXX0=