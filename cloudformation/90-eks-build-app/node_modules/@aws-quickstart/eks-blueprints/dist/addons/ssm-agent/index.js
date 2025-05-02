"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SSMAgentAddOn_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSMAgentAddOn = void 0;
const aws_eks_1 = require("aws-cdk-lib/aws-eks");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const cluster_providers_1 = require("../../cluster-providers");
const utils_1 = require("../../utils");
let SSMAgentAddOn = SSMAgentAddOn_1 = class SSMAgentAddOn {
    deploy(clusterInfo) {
        const cluster = clusterInfo.cluster;
        const nodeGroups = (0, cluster_providers_1.assertEC2NodeGroup)(clusterInfo, SSMAgentAddOn_1.name);
        // Add AWS Managed Policy for SSM
        nodeGroups.forEach(nodeGroup => nodeGroup.role.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore')));
        // Apply manifest.
        // See APG Pattern https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/install-ssm-agent-on-amazon-eks-worker-nodes-by-using-kubernetes-daemonset.html
        const appLabel = { app: "ssm-installer" };
        const daemonSet = {
            apiVersion: "apps/v1",
            kind: "DaemonSet",
            metadata: {
                name: "ssm-installer",
                namespace: "kube-system"
            },
            spec: {
                selector: { matchLabels: appLabel },
                updateStrategy: { type: "RollingUpdate" },
                template: {
                    metadata: { labels: appLabel },
                    spec: {
                        containers: [
                            {
                                name: "pause",
                                image: "gcr.io/google_containers/pause",
                                resources: {
                                    limits: {
                                        cpu: "100m",
                                        memory: "128Mi",
                                    },
                                    requests: {
                                        cpu: "100m",
                                        memory: "128Mi",
                                    },
                                }
                            }
                        ],
                        initContainers: [
                            {
                                image: "public.ecr.aws/amazon-ssm-agent/amazon-ssm-agent:3.2.2222.0",
                                imagePullPolicy: "Always",
                                name: "ssm-install",
                                securityContext: {
                                    allowPrivilegeEscalation: true
                                },
                                volumeMounts: [
                                    {
                                        mountPath: "/etc/cron.d",
                                        name: "cronfile"
                                    }
                                ],
                                resources: {
                                    limits: {
                                        cpu: "100m",
                                        memory: "256Mi",
                                    },
                                    requests: {
                                        cpu: "100m",
                                        memory: "256Mi",
                                    },
                                },
                                terminationMessagePath: "/dev/termination.log",
                                terminationMessagePolicy: "File",
                            }
                        ],
                        volumes: [
                            {
                                name: "cronfile",
                                hostPath: {
                                    path: "/etc/cron.d",
                                    type: "Directory"
                                }
                            }
                        ],
                        dnsPolicy: "ClusterFirst",
                        restartPolicy: "Always",
                        schedulerName: "default-scheduler",
                        terminationGracePeriodSeconds: 30
                    }
                }
            }
        };
        new aws_eks_1.KubernetesManifest(cluster.stack, "ssm-agent", {
            cluster,
            manifest: [daemonSet]
        });
    }
};
exports.SSMAgentAddOn = SSMAgentAddOn;
exports.SSMAgentAddOn = SSMAgentAddOn = SSMAgentAddOn_1 = __decorate([
    utils_1.supportsX86
], SSMAgentAddOn);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL3NzbS1hZ2VudC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsaURBQXlEO0FBQ3pELGlEQUFvRDtBQUNwRCwrREFBNkQ7QUFFN0QsdUNBQTBDO0FBR25DLElBQU0sYUFBYSxxQkFBbkIsTUFBTSxhQUFhO0lBQ3RCLE1BQU0sQ0FBQyxXQUF3QjtRQUMzQixNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDO1FBQ3BDLE1BQU0sVUFBVSxHQUFHLElBQUEsc0NBQWtCLEVBQUMsV0FBVyxFQUFFLGVBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV2RSxpQ0FBaUM7UUFDakMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUMzQixTQUFTLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHVCQUFhLENBQUMsd0JBQXdCLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFN0csa0JBQWtCO1FBQ2xCLG9LQUFvSztRQUNwSyxNQUFNLFFBQVEsR0FBRyxFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUUsQ0FBQztRQUUxQyxNQUFNLFNBQVMsR0FBRztZQUNkLFVBQVUsRUFBRSxTQUFTO1lBQ3JCLElBQUksRUFBRSxXQUFXO1lBQ2pCLFFBQVEsRUFBRTtnQkFDTixJQUFJLEVBQUUsZUFBZTtnQkFDckIsU0FBUyxFQUFFLGFBQWE7YUFDM0I7WUFDRCxJQUFJLEVBQUU7Z0JBQ0YsUUFBUSxFQUFFLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRTtnQkFDbkMsY0FBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRTtnQkFDekMsUUFBUSxFQUFFO29CQUNOLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7b0JBQzlCLElBQUksRUFBRTt3QkFDRixVQUFVLEVBQUU7NEJBQ1I7Z0NBQ0ksSUFBSSxFQUFFLE9BQU87Z0NBQ2IsS0FBSyxFQUFFLGdDQUFnQztnQ0FDdkMsU0FBUyxFQUFFO29DQUNQLE1BQU0sRUFBRTt3Q0FDSixHQUFHLEVBQUUsTUFBTTt3Q0FDWCxNQUFNLEVBQUUsT0FBTztxQ0FDbEI7b0NBQ0QsUUFBUSxFQUFFO3dDQUNOLEdBQUcsRUFBRSxNQUFNO3dDQUNYLE1BQU0sRUFBRSxPQUFPO3FDQUNsQjtpQ0FDSjs2QkFDSjt5QkFDSjt3QkFDRCxjQUFjLEVBQUU7NEJBQ1o7Z0NBQ0ksS0FBSyxFQUFFLDZEQUE2RDtnQ0FDcEUsZUFBZSxFQUFFLFFBQVE7Z0NBQ3pCLElBQUksRUFBRSxhQUFhO2dDQUNuQixlQUFlLEVBQUU7b0NBQ2Isd0JBQXdCLEVBQUUsSUFBSTtpQ0FDakM7Z0NBQ0QsWUFBWSxFQUFFO29DQUNWO3dDQUNJLFNBQVMsRUFBRSxhQUFhO3dDQUN4QixJQUFJLEVBQUUsVUFBVTtxQ0FDbkI7aUNBQ0o7Z0NBQ0QsU0FBUyxFQUFFO29DQUNQLE1BQU0sRUFBRTt3Q0FDSixHQUFHLEVBQUUsTUFBTTt3Q0FDWCxNQUFNLEVBQUUsT0FBTztxQ0FDbEI7b0NBQ0QsUUFBUSxFQUFFO3dDQUNOLEdBQUcsRUFBRSxNQUFNO3dDQUNYLE1BQU0sRUFBRSxPQUFPO3FDQUNsQjtpQ0FDSjtnQ0FDRCxzQkFBc0IsRUFBRSxzQkFBc0I7Z0NBQzlDLHdCQUF3QixFQUFFLE1BQU07NkJBQ25DO3lCQUNKO3dCQUNELE9BQU8sRUFBRTs0QkFDTDtnQ0FDSSxJQUFJLEVBQUUsVUFBVTtnQ0FDaEIsUUFBUSxFQUFFO29DQUNOLElBQUksRUFBRSxhQUFhO29DQUNuQixJQUFJLEVBQUUsV0FBVztpQ0FDcEI7NkJBQ0o7eUJBQ0o7d0JBQ0QsU0FBUyxFQUFFLGNBQWM7d0JBQ3pCLGFBQWEsRUFBRSxRQUFRO3dCQUN2QixhQUFhLEVBQUUsbUJBQW1CO3dCQUNsQyw2QkFBNkIsRUFBRSxFQUFFO3FCQUNwQztpQkFDSjthQUNKO1NBQ0osQ0FBQztRQUVGLElBQUksNEJBQWtCLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7WUFDL0MsT0FBTztZQUNQLFFBQVEsRUFBRSxDQUFDLFNBQVMsQ0FBQztTQUN4QixDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0osQ0FBQTtBQTdGWSxzQ0FBYTt3QkFBYixhQUFhO0lBRHpCLG1CQUFXO0dBQ0MsYUFBYSxDQTZGekIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBLdWJlcm5ldGVzTWFuaWZlc3QgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWVrc1wiO1xuaW1wb3J0IHsgTWFuYWdlZFBvbGljeSB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtaWFtXCI7XG5pbXBvcnQgeyBhc3NlcnRFQzJOb2RlR3JvdXAgfSBmcm9tIFwiLi4vLi4vY2x1c3Rlci1wcm92aWRlcnNcIjtcbmltcG9ydCB7IENsdXN0ZXJBZGRPbiwgQ2x1c3RlckluZm8gfSBmcm9tIFwiLi4vLi4vc3BpXCI7XG5pbXBvcnQgeyBzdXBwb3J0c1g4NiB9IGZyb20gXCIuLi8uLi91dGlsc1wiO1xuXG5Ac3VwcG9ydHNYODZcbmV4cG9ydCBjbGFzcyBTU01BZ2VudEFkZE9uIGltcGxlbWVudHMgQ2x1c3RlckFkZE9uIHtcbiAgICBkZXBsb3koY2x1c3RlckluZm86IENsdXN0ZXJJbmZvKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBjbHVzdGVySW5mby5jbHVzdGVyO1xuICAgICAgICBjb25zdCBub2RlR3JvdXBzID0gYXNzZXJ0RUMyTm9kZUdyb3VwKGNsdXN0ZXJJbmZvLCBTU01BZ2VudEFkZE9uLm5hbWUpO1xuXG4gICAgICAgIC8vIEFkZCBBV1MgTWFuYWdlZCBQb2xpY3kgZm9yIFNTTVxuICAgICAgICBub2RlR3JvdXBzLmZvckVhY2gobm9kZUdyb3VwID0+IFxuICAgICAgICAgICAgbm9kZUdyb3VwLnJvbGUuYWRkTWFuYWdlZFBvbGljeShNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQW1hem9uU1NNTWFuYWdlZEluc3RhbmNlQ29yZScpKSk7XG5cbiAgICAgICAgLy8gQXBwbHkgbWFuaWZlc3QuXG4gICAgICAgIC8vIFNlZSBBUEcgUGF0dGVybiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vcHJlc2NyaXB0aXZlLWd1aWRhbmNlL2xhdGVzdC9wYXR0ZXJucy9pbnN0YWxsLXNzbS1hZ2VudC1vbi1hbWF6b24tZWtzLXdvcmtlci1ub2Rlcy1ieS11c2luZy1rdWJlcm5ldGVzLWRhZW1vbnNldC5odG1sXG4gICAgICAgIGNvbnN0IGFwcExhYmVsID0geyBhcHA6IFwic3NtLWluc3RhbGxlclwiIH07XG5cbiAgICAgICAgY29uc3QgZGFlbW9uU2V0ID0ge1xuICAgICAgICAgICAgYXBpVmVyc2lvbjogXCJhcHBzL3YxXCIsXG4gICAgICAgICAgICBraW5kOiBcIkRhZW1vblNldFwiLFxuICAgICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNzbS1pbnN0YWxsZXJcIixcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IFwia3ViZS1zeXN0ZW1cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNwZWM6IHtcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogeyBtYXRjaExhYmVsczogYXBwTGFiZWwgfSxcbiAgICAgICAgICAgICAgICB1cGRhdGVTdHJhdGVneTogeyB0eXBlOiBcIlJvbGxpbmdVcGRhdGVcIiB9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhOiB7IGxhYmVsczogYXBwTGFiZWwgfSxcbiAgICAgICAgICAgICAgICAgICAgc3BlYzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwYXVzZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZTogXCJnY3IuaW8vZ29vZ2xlX2NvbnRhaW5lcnMvcGF1c2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW1pdHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcHU6IFwiMTAwbVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeTogXCIxMjhNaVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3B1OiBcIjEwMG1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnk6IFwiMTI4TWlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdENvbnRhaW5lcnM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlOiBcInB1YmxpYy5lY3IuYXdzL2FtYXpvbi1zc20tYWdlbnQvYW1hem9uLXNzbS1hZ2VudDozLjIuMjIyMi4wXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlUHVsbFBvbGljeTogXCJBbHdheXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJzc20taW5zdGFsbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWN1cml0eUNvbnRleHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbG93UHJpdmlsZWdlRXNjYWxhdGlvbjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2b2x1bWVNb3VudHM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3VudFBhdGg6IFwiL2V0Yy9jcm9uLmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImNyb25maWxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW1pdHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcHU6IFwiMTAwbVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeTogXCIyNTZNaVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3B1OiBcIjEwMG1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnk6IFwiMjU2TWlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlcm1pbmF0aW9uTWVzc2FnZVBhdGg6IFwiL2Rldi90ZXJtaW5hdGlvbi5sb2dcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVybWluYXRpb25NZXNzYWdlUG9saWN5OiBcIkZpbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJjcm9uZmlsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBob3N0UGF0aDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogXCIvZXRjL2Nyb24uZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJEaXJlY3RvcnlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRuc1BvbGljeTogXCJDbHVzdGVyRmlyc3RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3RhcnRQb2xpY3k6IFwiQWx3YXlzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZXJOYW1lOiBcImRlZmF1bHQtc2NoZWR1bGVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXJtaW5hdGlvbkdyYWNlUGVyaW9kU2Vjb25kczogMzBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBuZXcgS3ViZXJuZXRlc01hbmlmZXN0KGNsdXN0ZXIuc3RhY2ssIFwic3NtLWFnZW50XCIsIHtcbiAgICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgICBtYW5pZmVzdDogW2RhZW1vblNldF1cbiAgICAgICAgfSk7XG4gICAgfVxufSJdfQ==