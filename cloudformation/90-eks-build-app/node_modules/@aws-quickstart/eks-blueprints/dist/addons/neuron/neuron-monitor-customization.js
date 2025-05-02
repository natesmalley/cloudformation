"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeuronMonitorManifest = void 0;
class NeuronMonitorManifest {
    constructor() { }
    generate(namespace, imageTag, port) {
        const deamonSetManifest = {
            apiVersion: "apps/v1",
            kind: "DaemonSet",
            metadata: {
                name: "neuron-monitor",
                namespace: namespace,
                labels: {
                    app: "neuron-monitor",
                    role: "master"
                }
            },
            spec: {
                selector: {
                    matchLabels: {
                        app: "neuron-monitor",
                        role: "master"
                    }
                },
                template: {
                    metadata: {
                        labels: {
                            app: "neuron-monitor",
                            role: "master"
                        }
                    },
                    spec: {
                        containers: [{
                                name: "app",
                                image: `public.ecr.aws/g4h4h0b5/neuron-monitor:${imageTag}`,
                                command: ["/bin/sh"],
                                args: ["-c", `neuron-monitor | neuron-monitor-prometheus.py --port ${port}`],
                                ports: [{
                                        name: "prom-node-exp",
                                        containerPort: port,
                                        hostPort: port
                                    }],
                                volumeMounts: [{
                                        name: "dev",
                                        mountPath: "/dev"
                                    }],
                                securityContext: {
                                    privileged: true
                                }
                            }],
                        tolerations: [{
                                key: "aws.amazon.com/neuron",
                                operator: "Exists",
                                effect: "NoSchedule"
                            }],
                        affinity: {
                            nodeAffinity: {
                                requiredDuringSchedulingIgnoredDuringExecution: {
                                    nodeSelectorTerms: [{
                                            matchExpressions: [{
                                                    key: "node.kubernetes.io/instance-type",
                                                    operator: "In",
                                                    values: [
                                                        "inf1.xlarge", "inf1.2xlarge", "inf1.6xlarge", "inf1.24xlarge",
                                                        "inf2.xlarge", "inf2.4xlarge", "inf2.8xlarge", "inf2.24xlarge", "inf2.48xlarge",
                                                        "trn1.2xlarge", "trn1.32xlarge", "trn1n.32xlarge"
                                                    ]
                                                }]
                                        }]
                                }
                            }
                        },
                        volumes: [{
                                name: "dev",
                                hostPath: {
                                    path: "/dev"
                                }
                            }],
                        restartPolicy: "Always"
                    }
                }
            }
        };
        const serviceManifest = {
            apiVersion: "v1",
            kind: "Service",
            metadata: {
                annotations: {
                    "prometheus.io/scrape": "true",
                    "prometheus.io/app-metrics": "true",
                    "prometheus.io/port": port.toString()
                },
                name: "neuron-monitor",
                namespace: namespace,
                labels: {
                    app: "neuron-monitor"
                }
            },
            spec: {
                clusterIP: "None",
                ports: [{
                        name: "neuron-monitor",
                        port: port,
                        protocol: "TCP"
                    }],
                selector: {
                    app: "neuron-monitor"
                },
                type: "ClusterIP"
            }
        };
        const manifest = [deamonSetManifest, serviceManifest];
        return manifest;
    }
}
exports.NeuronMonitorManifest = NeuronMonitorManifest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cm9uLW1vbml0b3ItY3VzdG9taXphdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9hZGRvbnMvbmV1cm9uL25ldXJvbi1tb25pdG9yLWN1c3RvbWl6YXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsTUFBYSxxQkFBcUI7SUFFOUIsZ0JBQWUsQ0FBQztJQUVULFFBQVEsQ0FBQyxTQUFpQixFQUFFLFFBQWdCLEVBQUUsSUFBWTtRQUU3RCxNQUFNLGlCQUFpQixHQUFHO1lBQ3RCLFVBQVUsRUFBRSxTQUFTO1lBQ3JCLElBQUksRUFBRSxXQUFXO1lBQ2pCLFFBQVEsRUFBRTtnQkFDTixJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixTQUFTLEVBQUUsU0FBUztnQkFDcEIsTUFBTSxFQUFFO29CQUNKLEdBQUcsRUFBRSxnQkFBZ0I7b0JBQ3JCLElBQUksRUFBRSxRQUFRO2lCQUNqQjthQUNKO1lBQ0QsSUFBSSxFQUFFO2dCQUNGLFFBQVEsRUFBRTtvQkFDTixXQUFXLEVBQUU7d0JBQ1QsR0FBRyxFQUFFLGdCQUFnQjt3QkFDckIsSUFBSSxFQUFFLFFBQVE7cUJBQ2pCO2lCQUNKO2dCQUNELFFBQVEsRUFBRTtvQkFDTixRQUFRLEVBQUU7d0JBQ04sTUFBTSxFQUFFOzRCQUNKLEdBQUcsRUFBRSxnQkFBZ0I7NEJBQ3JCLElBQUksRUFBRSxRQUFRO3lCQUNqQjtxQkFDSjtvQkFDRCxJQUFJLEVBQUU7d0JBQ0YsVUFBVSxFQUFFLENBQUM7Z0NBQ1QsSUFBSSxFQUFFLEtBQUs7Z0NBQ1gsS0FBSyxFQUFFLDBDQUEwQyxRQUFRLEVBQUU7Z0NBQzNELE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQztnQ0FDcEIsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLHdEQUF3RCxJQUFJLEVBQUUsQ0FBQztnQ0FDNUUsS0FBSyxFQUFFLENBQUM7d0NBQ0osSUFBSSxFQUFFLGVBQWU7d0NBQ3JCLGFBQWEsRUFBRSxJQUFJO3dDQUNuQixRQUFRLEVBQUUsSUFBSTtxQ0FDakIsQ0FBQztnQ0FDRixZQUFZLEVBQUUsQ0FBQzt3Q0FDWCxJQUFJLEVBQUUsS0FBSzt3Q0FDWCxTQUFTLEVBQUUsTUFBTTtxQ0FDcEIsQ0FBQztnQ0FDRixlQUFlLEVBQUU7b0NBQ2IsVUFBVSxFQUFFLElBQUk7aUNBQ25COzZCQUNKLENBQUM7d0JBQ0YsV0FBVyxFQUFFLENBQUM7Z0NBQ1YsR0FBRyxFQUFFLHVCQUF1QjtnQ0FDNUIsUUFBUSxFQUFFLFFBQVE7Z0NBQ2xCLE1BQU0sRUFBRSxZQUFZOzZCQUN2QixDQUFDO3dCQUNGLFFBQVEsRUFBRTs0QkFDTixZQUFZLEVBQUU7Z0NBQ1YsOENBQThDLEVBQUU7b0NBQzVDLGlCQUFpQixFQUFFLENBQUM7NENBQ2hCLGdCQUFnQixFQUFFLENBQUM7b0RBQ2YsR0FBRyxFQUFFLGtDQUFrQztvREFDdkMsUUFBUSxFQUFFLElBQUk7b0RBQ2QsTUFBTSxFQUFFO3dEQUNKLGFBQWEsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGVBQWU7d0RBQzlELGFBQWEsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBRSxlQUFlO3dEQUMvRSxjQUFjLEVBQUUsZUFBZSxFQUFFLGdCQUFnQjtxREFDcEQ7aURBQ0osQ0FBQzt5Q0FDTCxDQUFDO2lDQUNMOzZCQUNKO3lCQUNKO3dCQUNELE9BQU8sRUFBRSxDQUFDO2dDQUNOLElBQUksRUFBRSxLQUFLO2dDQUNYLFFBQVEsRUFBRTtvQ0FDTixJQUFJLEVBQUUsTUFBTTtpQ0FDZjs2QkFDSixDQUFDO3dCQUNGLGFBQWEsRUFBRSxRQUFRO3FCQUMxQjtpQkFDSjthQUNKO1NBQ0osQ0FBQztRQUVGLE1BQU0sZUFBZSxHQUFHO1lBQ3BCLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLElBQUksRUFBRSxTQUFTO1lBQ2YsUUFBUSxFQUFFO2dCQUNOLFdBQVcsRUFBRTtvQkFDVCxzQkFBc0IsRUFBRSxNQUFNO29CQUM5QiwyQkFBMkIsRUFBRSxNQUFNO29CQUNuQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFO2lCQUN4QztnQkFDRCxJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixTQUFTLEVBQUUsU0FBUztnQkFDcEIsTUFBTSxFQUFFO29CQUNKLEdBQUcsRUFBRSxnQkFBZ0I7aUJBQ3hCO2FBQ0o7WUFDRCxJQUFJLEVBQUU7Z0JBQ0YsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLEtBQUssRUFBRSxDQUFDO3dCQUNKLElBQUksRUFBRSxnQkFBZ0I7d0JBQ3RCLElBQUksRUFBRSxJQUFJO3dCQUNWLFFBQVEsRUFBRSxLQUFLO3FCQUNsQixDQUFDO2dCQUNGLFFBQVEsRUFBRTtvQkFDTixHQUFHLEVBQUUsZ0JBQWdCO2lCQUN4QjtnQkFDRCxJQUFJLEVBQUUsV0FBVzthQUNwQjtTQUNKLENBQUM7UUFFRixNQUFNLFFBQVEsR0FBRyxDQUFDLGlCQUFpQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3RELE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7Q0FDSjtBQXBIRCxzREFvSEMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmV4cG9ydCBjbGFzcyBOZXVyb25Nb25pdG9yTWFuaWZlc3Qge1xuXG4gICAgY29uc3RydWN0b3IoKSB7fVxuXG4gICAgcHVibGljIGdlbmVyYXRlKG5hbWVzcGFjZTogc3RyaW5nLCBpbWFnZVRhZzogc3RyaW5nLCBwb3J0OiBudW1iZXIpIHtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGRlYW1vblNldE1hbmlmZXN0ID0ge1xuICAgICAgICAgICAgYXBpVmVyc2lvbjogXCJhcHBzL3YxXCIsXG4gICAgICAgICAgICBraW5kOiBcIkRhZW1vblNldFwiLFxuICAgICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcIm5ldXJvbi1tb25pdG9yXCIsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiBuYW1lc3BhY2UsXG4gICAgICAgICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICAgICAgICAgIGFwcDogXCJuZXVyb24tbW9uaXRvclwiLFxuICAgICAgICAgICAgICAgICAgICByb2xlOiBcIm1hc3RlclwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNwZWM6IHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvcjoge1xuICAgICAgICAgICAgICAgICAgICBtYXRjaExhYmVsczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwOiBcIm5ldXJvbi1tb25pdG9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlOiBcIm1hc3RlclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHA6IFwibmV1cm9uLW1vbml0b3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb2xlOiBcIm1hc3RlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHNwZWM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcnM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJhcHBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZTogYHB1YmxpYy5lY3IuYXdzL2c0aDRoMGI1L25ldXJvbi1tb25pdG9yOiR7aW1hZ2VUYWd9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiBbXCIvYmluL3NoXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtcIi1jXCIsIGBuZXVyb24tbW9uaXRvciB8IG5ldXJvbi1tb25pdG9yLXByb21ldGhldXMucHkgLS1wb3J0ICR7cG9ydH1gXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3J0czogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJwcm9tLW5vZGUtZXhwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IHBvcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvc3RQb3J0OiBwb3J0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lTW91bnRzOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImRldlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3VudFBhdGg6IFwiL2RldlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VjdXJpdHlDb250ZXh0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaXZpbGVnZWQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvbGVyYXRpb25zOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJhd3MuYW1hem9uLmNvbS9uZXVyb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRvcjogXCJFeGlzdHNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZmZlY3Q6IFwiTm9TY2hlZHVsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFmZmluaXR5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZUFmZmluaXR5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkRHVyaW5nU2NoZWR1bGluZ0lnbm9yZWREdXJpbmdFeGVjdXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVTZWxlY3RvclRlcm1zOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoRXhwcmVzc2lvbnM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogXCJub2RlLmt1YmVybmV0ZXMuaW8vaW5zdGFuY2UtdHlwZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRvcjogXCJJblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaW5mMS54bGFyZ2VcIiwgXCJpbmYxLjJ4bGFyZ2VcIiwgXCJpbmYxLjZ4bGFyZ2VcIiwgXCJpbmYxLjI0eGxhcmdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImluZjIueGxhcmdlXCIsIFwiaW5mMi40eGxhcmdlXCIsIFwiaW5mMi44eGxhcmdlXCIsIFwiaW5mMi4yNHhsYXJnZVwiLCBcImluZjIuNDh4bGFyZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHJuMS4yeGxhcmdlXCIsIFwidHJuMS4zMnhsYXJnZVwiLCBcInRybjFuLjMyeGxhcmdlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZvbHVtZXM6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJkZXZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob3N0UGF0aDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBcIi9kZXZcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdGFydFBvbGljeTogXCJBbHdheXNcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgY29uc3Qgc2VydmljZU1hbmlmZXN0ID0ge1xuICAgICAgICAgICAgYXBpVmVyc2lvbjogXCJ2MVwiLFxuICAgICAgICAgICAga2luZDogXCJTZXJ2aWNlXCIsXG4gICAgICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgICAgICAgIGFubm90YXRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgIFwicHJvbWV0aGV1cy5pby9zY3JhcGVcIjogXCJ0cnVlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicHJvbWV0aGV1cy5pby9hcHAtbWV0cmljc1wiOiBcInRydWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwcm9tZXRoZXVzLmlvL3BvcnRcIjogcG9ydC50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBuYW1lOiBcIm5ldXJvbi1tb25pdG9yXCIsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiBuYW1lc3BhY2UsXG4gICAgICAgICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICAgICAgICAgIGFwcDogXCJuZXVyb24tbW9uaXRvclwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNwZWM6IHtcbiAgICAgICAgICAgICAgICBjbHVzdGVySVA6IFwiTm9uZVwiLFxuICAgICAgICAgICAgICAgIHBvcnRzOiBbe1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIm5ldXJvbi1tb25pdG9yXCIsXG4gICAgICAgICAgICAgICAgICAgIHBvcnQ6IHBvcnQsXG4gICAgICAgICAgICAgICAgICAgIHByb3RvY29sOiBcIlRDUFwiXG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IHtcbiAgICAgICAgICAgICAgICAgICAgYXBwOiBcIm5ldXJvbi1tb25pdG9yXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiQ2x1c3RlcklQXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IG1hbmlmZXN0ID0gW2RlYW1vblNldE1hbmlmZXN0LCBzZXJ2aWNlTWFuaWZlc3RdO1xuICAgICAgICByZXR1cm4gbWFuaWZlc3Q7XG4gICAgfVxufVxuIl19