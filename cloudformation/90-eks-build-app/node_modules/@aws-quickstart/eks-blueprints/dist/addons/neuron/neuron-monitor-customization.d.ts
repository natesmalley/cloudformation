export declare class NeuronMonitorManifest {
    constructor();
    generate(namespace: string, imageTag: string, port: number): ({
        apiVersion: string;
        kind: string;
        metadata: {
            name: string;
            namespace: string;
            labels: {
                app: string;
                role: string;
            };
        };
        spec: {
            selector: {
                matchLabels: {
                    app: string;
                    role: string;
                };
            };
            template: {
                metadata: {
                    labels: {
                        app: string;
                        role: string;
                    };
                };
                spec: {
                    containers: {
                        name: string;
                        image: string;
                        command: string[];
                        args: string[];
                        ports: {
                            name: string;
                            containerPort: number;
                            hostPort: number;
                        }[];
                        volumeMounts: {
                            name: string;
                            mountPath: string;
                        }[];
                        securityContext: {
                            privileged: boolean;
                        };
                    }[];
                    tolerations: {
                        key: string;
                        operator: string;
                        effect: string;
                    }[];
                    affinity: {
                        nodeAffinity: {
                            requiredDuringSchedulingIgnoredDuringExecution: {
                                nodeSelectorTerms: {
                                    matchExpressions: {
                                        key: string;
                                        operator: string;
                                        values: string[];
                                    }[];
                                }[];
                            };
                        };
                    };
                    volumes: {
                        name: string;
                        hostPath: {
                            path: string;
                        };
                    }[];
                    restartPolicy: string;
                };
            };
        };
    } | {
        apiVersion: string;
        kind: string;
        metadata: {
            annotations: {
                "prometheus.io/scrape": string;
                "prometheus.io/app-metrics": string;
                "prometheus.io/port": string;
            };
            name: string;
            namespace: string;
            labels: {
                app: string;
            };
        };
        spec: {
            clusterIP: string;
            ports: {
                name: string;
                port: number;
                protocol: string;
            }[];
            selector: {
                app: string;
            };
            type: string;
        };
    })[];
}
