"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JupyterHubAddOn = exports.JupyterHubServiceType = void 0;
const assert = require("assert");
const utils_1 = require("../../utils");
const aws_loadbalancer_controller_1 = require("../aws-loadbalancer-controller");
const helm_addon_1 = require("../helm-addon");
const efs = require("aws-cdk-lib/aws-efs");
const ec2 = require("aws-cdk-lib/aws-ec2");
const semver = require("semver");
const ebs_csi_driver_1 = require("../ebs-csi-driver");
const efs_csi_driver_1 = require("../efs-csi-driver");
/**
 * Configuration options for exposing the JupyterHub proxy
 */
var JupyterHubServiceType;
(function (JupyterHubServiceType) {
    /**
     * Expose the service using AWS Application Load Balancer + Ingress controller
     */
    JupyterHubServiceType[JupyterHubServiceType["ALB"] = 0] = "ALB";
    /**
     * Expose the service using AWS Network Load Balancer + LoadBalancer service
     */
    JupyterHubServiceType[JupyterHubServiceType["NLB"] = 1] = "NLB";
    /**
     * Use ClusterIP service type and allow customers to port-forward for localhost access
     */
    JupyterHubServiceType[JupyterHubServiceType["CLUSTERIP"] = 2] = "CLUSTERIP";
})(JupyterHubServiceType || (exports.JupyterHubServiceType = JupyterHubServiceType = {}));
const JUPYTERHUB = 'jupyterhub';
const RELEASE = 'blueprints-addon-jupyterhub';
/**
 * Defaults options for the add-on
 */
const defaultProps = {
    name: JUPYTERHUB,
    namespace: JUPYTERHUB,
    version: '2.0.0',
    chart: JUPYTERHUB,
    release: RELEASE,
    repository: 'https://hub.jupyter.org/helm-chart/',
    values: {}
};
/**
 * Implementation of the JupyterHub add-on
 */
let JupyterHubAddOn = class JupyterHubAddOn extends helm_addon_1.HelmAddOn {
    constructor(props) {
        super({ ...defaultProps, ...props });
        this.options = this.props;
    }
    deploy(clusterInfo) {
        var _a;
        const cluster = clusterInfo.cluster;
        let values = (_a = this.options.values) !== null && _a !== void 0 ? _a : {};
        // The addon requires a persistent storage option
        assert(this.options.ebsConfig || this.options.efsConfig, "You need to provide a persistent storage option.");
        // But you can only provide one option for persistent storage
        assert(!(this.options.ebsConfig && this.options.efsConfig), "You cannot provide more than one persistent storage option.");
        // Create Namespace
        const ns = (0, utils_1.createNamespace)(this.options.namespace, cluster, true, true);
        // User Environment setup
        let cmd;
        if (semver.lt(this.options.version, '2.0.0')) {
            cmd = ["start-singleuser.sh"];
        }
        else {
            cmd = ["jupyterhub-singleuser", "--allow-root"];
        }
        const notebook = this.options.notebookStack || 'jupyter/base-notebook';
        (0, utils_1.setPath)(values, "singleuser", {
            "image": {
                "name": `${notebook}`,
                "tag": "latest"
            },
            "extraEnv": { "CHOWN_HOME": "yes" },
            "uid": 0,
            "fsGid": 0,
            "cmd": cmd
        });
        // Persistent Storage Setup for EBS
        if (this.options.ebsConfig) {
            this.addEbsStorage(clusterInfo, values, this.options.ebsConfig);
        }
        // Persistent Storage Setup for EFS
        if (this.options.efsConfig) {
            this.addEfsStorage(clusterInfo, values, this.options.efsConfig);
        }
        // OpenID Connect authentication setup
        if (this.options.oidcConfig) {
            (0, utils_1.setPath)(values, "hub.config", {
                "JupyterHub": { "authenticator_class": "generic-oauth" },
                "GenericOAuthenticator": {
                    "client_id": this.options.oidcConfig.clientId,
                    "client_secret": this.options.oidcConfig.clientSecret,
                    "oauth_callback_url": this.options.oidcConfig.callbackUrl,
                    "authorize_url": this.options.oidcConfig.authUrl,
                    "token_url": this.options.oidcConfig.tokenUrl,
                    "userdata_url": this.options.oidcConfig.userDataUrl,
                    "scope": this.options.oidcConfig.scope,
                    "username_key": this.options.oidcConfig.usernameKey,
                }
            });
        }
        // Proxy information - set either ALB, NLB (default) or ClusterIP service based on 
        // provided configuration
        const serviceType = this.options.serviceType;
        const ingressHosts = this.options.ingressHosts || [];
        const ingressAnnotations = this.options.ingressAnnotations;
        const cert = this.options.certificateResourceName;
        const albAddOnCheck = clusterInfo.getScheduledAddOn(aws_loadbalancer_controller_1.AwsLoadBalancerControllerAddOn.name);
        // Use Ingress and AWS ALB
        if (serviceType == JupyterHubServiceType.ALB) {
            assert(albAddOnCheck, `Missing a dependency: ${aws_loadbalancer_controller_1.AwsLoadBalancerControllerAddOn.name}. Please add it to your list of addons.`);
            const presetAnnotations = {
                'alb.ingress.kubernetes.io/scheme': 'internet-facing',
                'alb.ingress.kubernetes.io/target-type': 'ip',
                'kubernetes.io/ingress.class': 'alb',
            };
            if (cert) {
                presetAnnotations['alb.ingress.kubernetes.io/ssl-redirect'] = '443';
                presetAnnotations['alb.ingress.kubernetes.io/listen-ports'] = '[{"HTTP": 80},{"HTTPS":443}]';
                const certificate = clusterInfo.getResource(cert);
                presetAnnotations['alb.ingress.kubernetes.io/certificate-arn'] = certificate === null || certificate === void 0 ? void 0 : certificate.certificateArn;
            }
            const annotations = { ...ingressAnnotations, ...presetAnnotations };
            (0, utils_1.setPath)(values, "ingress.annotations", annotations);
            (0, utils_1.setPath)(values, "ingress.hosts", ingressHosts);
            (0, utils_1.setPath)(values, "ingress.enabled", true);
            (0, utils_1.setPath)(values, "proxy.service", { "type": "ClusterIP" });
        }
        else {
            assert(!ingressHosts || ingressHosts.length == 0, 'Ingress Hosts CANNOT be assigned when ingress is disabled');
            assert(!ingressAnnotations, 'Ingress annotations CANNOT be assigned when ingress is disabled');
            assert(!cert, 'Cert option is only supported if ingress is enabled.');
            // If we set SVC, set the proxy service type to ClusterIP and allow users to port-forward to localhost
            if (serviceType == JupyterHubServiceType.CLUSTERIP) {
                (0, utils_1.setPath)(values, "proxy.service", { "type": "ClusterIP" });
                // We will use NLB 
            }
            else {
                assert(albAddOnCheck, `Missing a dependency: ${aws_loadbalancer_controller_1.AwsLoadBalancerControllerAddOn.name}. Please add it to your list of addons.`);
                (0, utils_1.setPath)(values, "proxy.service", {
                    "annotations": {
                        "service.beta.kubernetes.io/aws-load-balancer-type": "nlb",
                        "service.beta.kubernetes.io/aws-load-balancer-scheme": "internet-facing",
                        "service.beta.kubernetes.io/aws-load-balancer-nlb-target-type": "ip",
                    }
                });
            }
        }
        // Create Helm Chart
        const jupyterHubChart = this.addHelmChart(clusterInfo, values, false, false);
        // Add dependency
        jupyterHubChart.node.addDependency(ns);
        if (albAddOnCheck) {
            albAddOnCheck.then(construct => jupyterHubChart.node.addDependency(construct));
        }
        return Promise.resolve(jupyterHubChart);
    }
    /**
     * This is a helper function to create EBS persistent storage
     * @param {ClusterInfo} clusterInfo - Cluster Info
     * @param {string} values - Helm Chart Values
     * @param {string} ebsConfig - EBS Configurations supplied by user
     * @returns
     */
    addEbsStorage(clusterInfo, values, ebsConfig) {
        const dep = clusterInfo.getScheduledAddOn(ebs_csi_driver_1.EbsCsiDriverAddOn.name);
        assert(dep, `Missing a dependency: ${ebs_csi_driver_1.EbsCsiDriverAddOn.name}. Please add it to your list of addons.`);
        // Create persistent storage with EBS
        const storageClass = ebsConfig.storageClass;
        const ebsCapacity = ebsConfig.capacity;
        (0, utils_1.setPath)(values, "singleuser.storage", {
            "dynamic": { "storageClass": storageClass },
            "capacity": ebsCapacity
        });
    }
    /**
     * This is a helper function to create EFS persistent storage
     * @param {ClusterInfo} clusterInfo - Cluster Info
     * @param {string} values - Helm Chart Values
     * @param {string} efsConfig - EFS Configurations supplied by user
     * @returns
     */
    addEfsStorage(clusterInfo, values, efsConfig) {
        const dep = clusterInfo.getScheduledAddOn(efs_csi_driver_1.EfsCsiDriverAddOn.name);
        assert(dep, `Missing a dependency: ${efs_csi_driver_1.EfsCsiDriverAddOn.name}. Please add it to your list of addons.`);
        const pvcName = efsConfig.pvcName;
        const removalPolicy = efsConfig.removalPolicy;
        const efsCapacity = efsConfig.capacity;
        this.setupEFS(clusterInfo, this.options.namespace, pvcName, efsCapacity, removalPolicy);
        (0, utils_1.setPath)(values, "singleuser.storage", {
            "type": "static",
            "static": {
                "pvcName": `${pvcName}`,
                "subPath": "home/{username}"
            }
        });
    }
    /**
     * This is a helper function to use EFS as persistent storage
     * including necessary security group with ingress rule,
     * EFS File System, Kubernetes PV and PVC
     * @param {ClusterInfo} clusterInfo - Cluster Info
     * @param {string} namespace - Namespace
     * @param {string} pvcName - Name of the PV and PVC
     * @param {RemovalPolicy}removalPolicy - Removal Policy for EFS File System (RETAIN, DESTROY or SNAPSHOT)
     * @returns
     * */
    setupEFS(clusterInfo, namespace, pvcName, capacity, removalPolicy) {
        const cluster = clusterInfo.cluster;
        const clusterVpcCidr = clusterInfo.cluster.vpc.vpcCidrBlock;
        // Security Group required for access to the File System
        // With the right ingress rule
        const jupyterHubSG = new ec2.SecurityGroup(cluster.stack, 'MyEfsSecurityGroup', {
            vpc: clusterInfo.cluster.vpc,
            securityGroupName: "EksBlueprintsJHubEFSSG",
        });
        jupyterHubSG.addIngressRule(ec2.Peer.ipv4(clusterVpcCidr), new ec2.Port({
            protocol: ec2.Protocol.TCP,
            stringRepresentation: "EFSconnection",
            toPort: 2049,
            fromPort: 2049,
        }));
        // Create the EFS File System
        const jupyterHubFileSystem = new efs.FileSystem(cluster.stack, 'MyEfsFileSystem', {
            vpc: clusterInfo.cluster.vpc,
            securityGroup: jupyterHubSG,
            removalPolicy: removalPolicy,
        });
        const efsId = jupyterHubFileSystem.fileSystemId;
        // Create StorageClass
        const efsSC = cluster.addManifest('efs-storage-class', {
            apiVersion: 'storage.k8s.io/v1',
            kind: 'StorageClass',
            metadata: {
                name: 'efs-sc',
            },
            provisioner: 'efs.csi.aws.com',
        });
        // Setup PersistentVolume and PersistentVolumeClaim
        const efsPV = cluster.addManifest('efs-pv', {
            apiVersion: 'v1',
            kind: 'PersistentVolume',
            metadata: {
                name: `${pvcName}`,
                namespace: namespace
            },
            spec: {
                capacity: { storage: `${capacity}` },
                volumeMode: 'Filesystem',
                accessModes: ['ReadWriteMany'],
                storageClassName: 'efs-sc',
                csi: {
                    driver: 'efs.csi.aws.com',
                    volumeHandle: `${efsId}`,
                }
            },
        });
        efsPV.node.addDependency(efsSC);
        efsPV.node.addDependency(jupyterHubFileSystem);
        const efsPVC = cluster.addManifest('efs-pvc', {
            apiVersion: 'v1',
            kind: 'PersistentVolumeClaim',
            metadata: {
                name: `${pvcName}`,
                namespace: namespace
            },
            spec: {
                storageClassName: 'efs-sc',
                accessModes: ['ReadWriteMany'],
                resources: { requests: { storage: `${capacity}` } },
            },
        });
        efsPVC.node.addDependency(efsPV);
    }
};
exports.JupyterHubAddOn = JupyterHubAddOn;
exports.JupyterHubAddOn = JupyterHubAddOn = __decorate([
    utils_1.supportsALL
], JupyterHubAddOn);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL2p1cHl0ZXJodWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsaUNBQWlDO0FBR2pDLHVDQUFvRTtBQUNwRSxnRkFBZ0Y7QUFDaEYsOENBQThFO0FBRzlFLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFHM0MsaUNBQWlDO0FBQ2pDLHNEQUFzRDtBQUN0RCxzREFBc0Q7QUFFdEQ7O0dBRUc7QUFDSCxJQUFZLHFCQWVYO0FBZkQsV0FBWSxxQkFBcUI7SUFDN0I7O09BRUc7SUFDSCwrREFBRyxDQUFBO0lBRUg7O09BRUc7SUFDSCwrREFBRyxDQUFBO0lBRUg7O09BRUc7SUFDSCwyRUFBUyxDQUFBO0FBQ2IsQ0FBQyxFQWZXLHFCQUFxQixxQ0FBckIscUJBQXFCLFFBZWhDO0FBMkVELE1BQU0sVUFBVSxHQUFHLFlBQVksQ0FBQztBQUNoQyxNQUFNLE9BQU8sR0FBRyw2QkFBNkIsQ0FBQztBQUU5Qzs7R0FFRztBQUNILE1BQU0sWUFBWSxHQUFtQjtJQUNqQyxJQUFJLEVBQUUsVUFBVTtJQUNoQixTQUFTLEVBQUUsVUFBVTtJQUNyQixPQUFPLEVBQUUsT0FBTztJQUNoQixLQUFLLEVBQUUsVUFBVTtJQUNqQixPQUFPLEVBQUUsT0FBTztJQUNoQixVQUFVLEVBQUUscUNBQXFDO0lBQ2pELE1BQU0sRUFBRSxFQUFFO0NBQ2IsQ0FBQztBQUVGOztHQUVHO0FBRUksSUFBTSxlQUFlLEdBQXJCLE1BQU0sZUFBZ0IsU0FBUSxzQkFBUztJQUkxQyxZQUFZLEtBQTRCO1FBQ3BDLEtBQUssQ0FBQyxFQUFDLEdBQUcsWUFBWSxFQUFFLEdBQUcsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUE2QixDQUFDO0lBQ3RELENBQUM7SUFFRCxNQUFNLENBQUMsV0FBd0I7O1FBQzNCLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUM7UUFDcEMsSUFBSSxNQUFNLEdBQUcsTUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sbUNBQUksRUFBRSxDQUFDO1FBRXZDLGlEQUFpRDtRQUNqRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsa0RBQWtELENBQUMsQ0FBQztRQUU3Ryw2REFBNkQ7UUFDN0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLDZEQUE2RCxDQUFDLENBQUM7UUFFM0gsbUJBQW1CO1FBQ25CLE1BQU0sRUFBRSxHQUFHLElBQUEsdUJBQWUsRUFBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXpFLHlCQUF5QjtRQUN6QixJQUFJLEdBQUcsQ0FBQztRQUNSLElBQUksTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQVEsRUFBRSxPQUFPLENBQUMsRUFBQyxDQUFDO1lBQzNDLEdBQUcsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDbEMsQ0FBQzthQUFNLENBQUM7WUFDSixHQUFHLEdBQUcsQ0FBQyx1QkFBdUIsRUFBQyxjQUFjLENBQUMsQ0FBQztRQUNuRCxDQUFDO1FBQ0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLElBQUksdUJBQXVCLENBQUM7UUFDdkUsSUFBQSxlQUFPLEVBQUMsTUFBTSxFQUFFLFlBQVksRUFBRTtZQUMxQixPQUFPLEVBQUM7Z0JBQ0osTUFBTSxFQUFFLEdBQUcsUUFBUSxFQUFFO2dCQUNyQixLQUFLLEVBQUUsUUFBUTthQUNsQjtZQUNELFVBQVUsRUFBRSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUU7WUFDbkMsS0FBSyxFQUFFLENBQUM7WUFDUixPQUFPLEVBQUUsQ0FBQztZQUNWLEtBQUssRUFBRSxHQUFHO1NBQ2IsQ0FBQyxDQUFDO1FBRUgsbUNBQW1DO1FBQ25DLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNwRSxDQUFDO1FBRUQsbUNBQW1DO1FBQ25DLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN6QixJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNwRSxDQUFDO1FBRUQsc0NBQXNDO1FBQ3RDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUMsQ0FBQztZQUN6QixJQUFBLGVBQU8sRUFBQyxNQUFNLEVBQUUsWUFBWSxFQUFFO2dCQUMxQixZQUFZLEVBQUUsRUFBRSxxQkFBcUIsRUFBRSxlQUFlLEVBQUU7Z0JBQ3hELHVCQUF1QixFQUFFO29CQUNyQixXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUTtvQkFDN0MsZUFBZSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFlBQVk7b0JBQ3JELG9CQUFvQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFdBQVc7b0JBQ3pELGVBQWUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPO29CQUNoRCxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUTtvQkFDN0MsY0FBYyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFdBQVc7b0JBQ25ELE9BQU8sRUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLO29CQUN2QyxjQUFjLEVBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsV0FBVztpQkFDdkQ7YUFDSixDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsbUZBQW1GO1FBQ25GLHlCQUF5QjtRQUN6QixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztRQUM3QyxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUM7UUFDckQsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDO1FBQzNELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUM7UUFFbEQsTUFBTSxhQUFhLEdBQUcsV0FBVyxDQUFDLGlCQUFpQixDQUFDLDREQUE4QixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pGLDBCQUEwQjtRQUMxQixJQUFJLFdBQVcsSUFBSSxxQkFBcUIsQ0FBQyxHQUFHLEVBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsYUFBYSxFQUFFLHlCQUF5Qiw0REFBOEIsQ0FBQyxJQUFJLHlDQUF5QyxDQUFDLENBQUM7WUFDN0gsTUFBTSxpQkFBaUIsR0FBUTtnQkFDM0Isa0NBQWtDLEVBQUUsaUJBQWlCO2dCQUNyRCx1Q0FBdUMsRUFBRSxJQUFJO2dCQUM3Qyw2QkFBNkIsRUFBRSxLQUFLO2FBQ3ZDLENBQUM7WUFDRixJQUFJLElBQUksRUFBQyxDQUFDO2dCQUNOLGlCQUFpQixDQUFDLHdDQUF3QyxDQUFDLEdBQUcsS0FBSyxDQUFDO2dCQUNwRSxpQkFBaUIsQ0FBQyx3Q0FBd0MsQ0FBQyxHQUFHLDhCQUE4QixDQUFDO2dCQUM3RixNQUFNLFdBQVcsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFlLElBQUksQ0FBQyxDQUFDO2dCQUNoRSxpQkFBaUIsQ0FBQywyQ0FBMkMsQ0FBQyxHQUFHLFdBQVcsYUFBWCxXQUFXLHVCQUFYLFdBQVcsQ0FBRSxjQUFjLENBQUM7WUFDakcsQ0FBQztZQUNELE1BQU0sV0FBVyxHQUFHLEVBQUUsR0FBRyxrQkFBa0IsRUFBRSxHQUFHLGlCQUFpQixFQUFDLENBQUM7WUFDbkUsSUFBQSxlQUFPLEVBQUMsTUFBTSxFQUFFLHFCQUFxQixFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3BELElBQUEsZUFBTyxFQUFDLE1BQU0sRUFBRSxlQUFlLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDL0MsSUFBQSxlQUFPLEVBQUMsTUFBTSxFQUFFLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3pDLElBQUEsZUFBTyxFQUFDLE1BQU0sRUFBRSxlQUFlLEVBQUUsRUFBQyxNQUFNLEVBQUcsV0FBVyxFQUFDLENBQUMsQ0FBQztRQUM3RCxDQUFDO2FBQU0sQ0FBQztZQUNKLE1BQU0sQ0FBQyxDQUFDLFlBQVksSUFBSSxZQUFZLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRSwyREFBMkQsQ0FBQyxDQUFDO1lBQy9HLE1BQU0sQ0FBQyxDQUFDLGtCQUFrQixFQUFFLGlFQUFpRSxDQUFDLENBQUM7WUFDL0YsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLHNEQUFzRCxDQUFDLENBQUM7WUFDdEUsc0dBQXNHO1lBQ3RHLElBQUksV0FBVyxJQUFJLHFCQUFxQixDQUFDLFNBQVMsRUFBQyxDQUFDO2dCQUNoRCxJQUFBLGVBQU8sRUFBQyxNQUFNLEVBQUUsZUFBZSxFQUFFLEVBQUMsTUFBTSxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7Z0JBQzVELG1CQUFtQjtZQUNuQixDQUFDO2lCQUFNLENBQUM7Z0JBQ0osTUFBTSxDQUFDLGFBQWEsRUFBRSx5QkFBeUIsNERBQThCLENBQUMsSUFBSSx5Q0FBeUMsQ0FBQyxDQUFDO2dCQUM3SCxJQUFBLGVBQU8sRUFBQyxNQUFNLEVBQUUsZUFBZSxFQUFFO29CQUM3QixhQUFhLEVBQUU7d0JBQ1gsbURBQW1ELEVBQUUsS0FBSzt3QkFDMUQscURBQXFELEVBQUUsaUJBQWlCO3dCQUN4RSw4REFBOEQsRUFBRSxJQUFJO3FCQUN2RTtpQkFDSixDQUFDLENBQUM7WUFDUCxDQUFDO1FBQ0wsQ0FBQztRQUVELG9CQUFvQjtRQUNwQixNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTdFLGlCQUFpQjtRQUNqQixlQUFlLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV2QyxJQUFHLGFBQWEsRUFBRSxDQUFDO1lBQ2YsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDbkYsQ0FBQztRQUNELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBQ0Q7Ozs7OztPQU1HO0lBQ08sYUFBYSxDQUFDLFdBQXdCLEVBQUUsTUFBVyxFQUFFLFNBQWM7UUFDekUsTUFBTSxHQUFHLEdBQUcsV0FBVyxDQUFDLGlCQUFpQixDQUFDLGtDQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xFLE1BQU0sQ0FBQyxHQUFHLEVBQUUseUJBQXlCLGtDQUFpQixDQUFDLElBQUkseUNBQXlDLENBQUMsQ0FBQztRQUN0RyxxQ0FBcUM7UUFDckMsTUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQztRQUM1QyxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDO1FBQ3ZDLElBQUEsZUFBTyxFQUFDLE1BQU0sRUFBRSxvQkFBb0IsRUFBRTtZQUNsQyxTQUFTLEVBQUUsRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFO1lBQzNDLFVBQVUsRUFBRSxXQUFXO1NBQzFCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDTyxhQUFhLENBQUMsV0FBd0IsRUFBRSxNQUFXLEVBQUUsU0FBYztRQUN6RSxNQUFNLEdBQUcsR0FBRyxXQUFXLENBQUMsaUJBQWlCLENBQUMsa0NBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEUsTUFBTSxDQUFDLEdBQUcsRUFBRSx5QkFBeUIsa0NBQWlCLENBQUMsSUFBSSx5Q0FBeUMsQ0FBQyxDQUFDO1FBRXRHLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDbEMsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQztRQUM5QyxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDO1FBRXZDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBVSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDekYsSUFBQSxlQUFPLEVBQUMsTUFBTSxFQUFFLG9CQUFvQixFQUFFO1lBQ2xDLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLFFBQVEsRUFBRTtnQkFDTixTQUFTLEVBQUUsR0FBRyxPQUFPLEVBQUU7Z0JBQ3ZCLFNBQVMsRUFBRSxpQkFBaUI7YUFDL0I7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0Q7Ozs7Ozs7OztTQVNLO0lBQ0ssUUFBUSxDQUFDLFdBQXdCLEVBQUUsU0FBaUIsRUFBRSxPQUFlLEVBQUUsUUFBZ0IsRUFBRSxhQUFnQztRQUMvSCxNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDO1FBQ3BDLE1BQU0sY0FBYyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztRQUU1RCx3REFBd0Q7UUFDeEQsOEJBQThCO1FBQzlCLE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FDdEMsT0FBTyxDQUFDLEtBQUssRUFBRSxvQkFBb0IsRUFDbkM7WUFDSSxHQUFHLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHO1lBQzVCLGlCQUFpQixFQUFFLHdCQUF3QjtTQUM5QyxDQUNKLENBQUM7UUFDRixZQUFZLENBQUMsY0FBYyxDQUN2QixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFDN0IsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ1QsUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRztZQUMxQixvQkFBb0IsRUFBRSxlQUFlO1lBQ3JDLE1BQU0sRUFBRSxJQUFJO1lBQ1osUUFBUSxFQUFFLElBQUk7U0FDakIsQ0FBQyxDQUNMLENBQUM7UUFFRiw2QkFBNkI7UUFDN0IsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQzNDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLEVBQ2hDO1lBQ0ksR0FBRyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRztZQUM1QixhQUFhLEVBQUUsWUFBWTtZQUMzQixhQUFhLEVBQUUsYUFBYTtTQUMvQixDQUNKLENBQUM7UUFDRixNQUFNLEtBQUssR0FBRyxvQkFBb0IsQ0FBQyxZQUFZLENBQUM7UUFFaEQsc0JBQXNCO1FBQ3RCLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsbUJBQW1CLEVBQUU7WUFDbkQsVUFBVSxFQUFFLG1CQUFtQjtZQUMvQixJQUFJLEVBQUUsY0FBYztZQUNwQixRQUFRLEVBQUU7Z0JBQ04sSUFBSSxFQUFFLFFBQVE7YUFDakI7WUFDRCxXQUFXLEVBQUUsaUJBQWlCO1NBQ2pDLENBQUMsQ0FBQztRQUVILG1EQUFtRDtRQUNuRCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRTtZQUN4QyxVQUFVLEVBQUUsSUFBSTtZQUNoQixJQUFJLEVBQUUsa0JBQWtCO1lBQ3hCLFFBQVEsRUFBRTtnQkFDTixJQUFJLEVBQUUsR0FBRyxPQUFPLEVBQUU7Z0JBQ2xCLFNBQVMsRUFBRSxTQUFTO2FBQ3ZCO1lBQ0QsSUFBSSxFQUFFO2dCQUNGLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLFFBQVEsRUFBRSxFQUFFO2dCQUNwQyxVQUFVLEVBQUUsWUFBWTtnQkFDeEIsV0FBVyxFQUFFLENBQUUsZUFBZSxDQUFFO2dCQUNoQyxnQkFBZ0IsRUFBRSxRQUFRO2dCQUMxQixHQUFHLEVBQUU7b0JBQ0QsTUFBTSxFQUFFLGlCQUFpQjtvQkFDekIsWUFBWSxFQUFFLEdBQUcsS0FBSyxFQUFFO2lCQUMzQjthQUNKO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUUvQyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRTtZQUMxQyxVQUFVLEVBQUUsSUFBSTtZQUNoQixJQUFJLEVBQUUsdUJBQXVCO1lBQzdCLFFBQVEsRUFBRTtnQkFDTixJQUFJLEVBQUUsR0FBRyxPQUFPLEVBQUU7Z0JBQ2xCLFNBQVMsRUFBRSxTQUFTO2FBQ3ZCO1lBQ0QsSUFBSSxFQUFFO2dCQUNGLGdCQUFnQixFQUFFLFFBQVE7Z0JBQzFCLFdBQVcsRUFBRSxDQUFFLGVBQWUsQ0FBRTtnQkFDaEMsU0FBUyxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsUUFBUSxFQUFFLEVBQUUsRUFBRTthQUN0RDtTQUNKLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JDLENBQUM7Q0FDSixDQUFBO0FBcFFZLDBDQUFlOzBCQUFmLGVBQWU7SUFEM0IsbUJBQVc7R0FDQyxlQUFlLENBb1EzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFzc2VydCBmcm9tIFwiYXNzZXJ0XCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0IHsgQ2x1c3RlckluZm8gfSBmcm9tICcuLi8uLi9zcGknO1xuaW1wb3J0IHsgY3JlYXRlTmFtZXNwYWNlLCBzZXRQYXRoLCBzdXBwb3J0c0FMTCB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IEF3c0xvYWRCYWxhbmNlckNvbnRyb2xsZXJBZGRPbiB9IGZyb20gXCIuLi9hd3MtbG9hZGJhbGFuY2VyLWNvbnRyb2xsZXJcIjtcbmltcG9ydCB7IEhlbG1BZGRPbiwgSGVsbUFkZE9uUHJvcHMsIEhlbG1BZGRPblVzZXJQcm9wcyB9IGZyb20gJy4uL2hlbG0tYWRkb24nO1xuXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgZWZzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lZnMnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0IHsgSUNlcnRpZmljYXRlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWNlcnRpZmljYXRlbWFuYWdlcic7XG5cbmltcG9ydCAqIGFzIHNlbXZlciBmcm9tICdzZW12ZXInO1xuaW1wb3J0IHsgRWJzQ3NpRHJpdmVyQWRkT24gfSBmcm9tIFwiLi4vZWJzLWNzaS1kcml2ZXJcIjtcbmltcG9ydCB7IEVmc0NzaURyaXZlckFkZE9uIH0gZnJvbSBcIi4uL2Vmcy1jc2ktZHJpdmVyXCI7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBvcHRpb25zIGZvciBleHBvc2luZyB0aGUgSnVweXRlckh1YiBwcm94eVxuICovXG5leHBvcnQgZW51bSBKdXB5dGVySHViU2VydmljZVR5cGUge1xuICAgIC8qKlxuICAgICAqIEV4cG9zZSB0aGUgc2VydmljZSB1c2luZyBBV1MgQXBwbGljYXRpb24gTG9hZCBCYWxhbmNlciArIEluZ3Jlc3MgY29udHJvbGxlclxuICAgICAqL1xuICAgIEFMQixcblxuICAgIC8qKlxuICAgICAqIEV4cG9zZSB0aGUgc2VydmljZSB1c2luZyBBV1MgTmV0d29yayBMb2FkIEJhbGFuY2VyICsgTG9hZEJhbGFuY2VyIHNlcnZpY2VcbiAgICAgKi9cbiAgICBOTEIsXG4gICAgXG4gICAgLyoqXG4gICAgICogVXNlIENsdXN0ZXJJUCBzZXJ2aWNlIHR5cGUgYW5kIGFsbG93IGN1c3RvbWVycyB0byBwb3J0LWZvcndhcmQgZm9yIGxvY2FsaG9zdCBhY2Nlc3NcbiAgICAgKi9cbiAgICBDTFVTVEVSSVAsXG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBvcHRpb25zIGZvciB0aGUgYWRkLW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEp1cHl0ZXJIdWJBZGRPblByb3BzIGV4dGVuZHMgSGVsbUFkZE9uVXNlclByb3BzIHtcblxuICAgIC8qKlxuICAgICAqIENvbmZpZ3VyYXRpb25zIG5lY2Vzc2FyeSB0byB1c2UgRUJTIGFzIFBlcnNpc3RlbnQgVm9sdW1lXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHN0b3JhZ2VDbGFzcyAtIHN0b3JhZ2UgY2xhc3MgZm9yIHRoZSB2b2x1bWVcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gY2FwYWNpdHkgLSBzdG9yYWdlIGNhcGFjaXR5IChpbiBNaSBvciBHaSlcbiAgICAgKi9cbiAgICBlYnNDb25maWc/OiB7XG4gICAgICAgIHN0b3JhZ2VDbGFzczogc3RyaW5nLFxuICAgICAgICBjYXBhY2l0eTogc3RyaW5nLFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbmZpZ3VyYXRpb24gbmVjZXNzYXJ5IHRvIHVzZSBFRlMgYXMgUGVyc2lzdGVudCBWb2x1bWVcbiAgICAgKiBAcHJvcGVydHkge2Nkay5SZW1vdmFsUG9saWN5fSByZW1vdmFsUG9saWN5IC0gUmVtb3ZhbCBQb2xpY3kgZm9yIEVGUyAoREVTVFJPWSwgUkVUQUlOIG9yIFNOQVBTSE9UKVxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBwdmNOYW1lIC0gTmFtZSBvZiB0aGUgVm9sdW1lIHRvIGJlIHVzZWQgZm9yIFBWIGFuZCBQVkNcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gY2FwYWNpdHkgLSBTdG9yYWdlIENhcGFjaXR5IChpbiBNaSBvciBHaSlcbiAgICAgKi9cbiAgICBlZnNDb25maWc/OiB7XG4gICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LFxuICAgICAgICBwdmNOYW1lOiBzdHJpbmcsXG4gICAgICAgIGNhcGFjaXR5OiBzdHJpbmcsXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29uZmlndXJhdGlvbiBzZXR0aW5ncyBmb3IgT3BlbklEIENvbm5lY3QgYXV0aGVudGljYXRpb24gcHJvdG9jb2xcbiAgICAgKi9cbiAgICBvaWRjQ29uZmlnPzoge1xuICAgICAgICBjYWxsYmFja1VybDogc3RyaW5nLFxuICAgICAgICBhdXRoVXJsOiBzdHJpbmcsXG4gICAgICAgIHRva2VuVXJsOiBzdHJpbmcsXG4gICAgICAgIHVzZXJEYXRhVXJsOiBzdHJpbmcsXG4gICAgICAgIGNsaWVudElkOiBzdHJpbmcsXG4gICAgICAgIGNsaWVudFNlY3JldDogc3RyaW5nLFxuICAgICAgICBzY29wZT86IHN0cmluZ1tdLFxuICAgICAgICB1c2VybmFtZUtleT86IHN0cmluZyxcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb25maWd1cmF0aW9uIHRvIHNldCBob3cgdGhlIGh1YiBzZXJ2aWNlIHdpbGwgYmUgZXhwb3NlZFxuICAgICAqIFNlZSBlbnVtIGp1cHl0ZXJIdWJTZXJ2aWNlIGZvciBjaG9pY2VzXG4gICAgICovXG4gICAgc2VydmljZVR5cGU6IEp1cHl0ZXJIdWJTZXJ2aWNlVHlwZSxcblxuICAgIC8qKlxuICAgICAqIEluZ3Jlc3MgaG9zdCAtIG9ubHkgaWYgSW5ncmVzcyBpcyBlbmFibGVkXG4gICAgICogSXQgaXMgYSBsaXN0IG9mIGF2YWlsYWJsZSBob3N0cyB0byBiZSByb3V0ZWQgdXBvbiByZXF1ZXN0XG4gICAgICovXG4gICAgaW5ncmVzc0hvc3RzPzogc3RyaW5nW10sXG5cbiAgICAvKipcbiAgICAgKiBJbmdyZXNzIGFubm90YXRpb25zIC0gb25seSBhcHBseSBpZiBJbmdyZXNzIGlzIGVuYWJsZWQsIG90aGVyd2lzZSB0aHJvd3MgYW4gZXJyb3JcbiAgICAgKi9cbiAgICBpbmdyZXNzQW5ub3RhdGlvbnM/OiB7XG4gICAgICAgIFtrZXk6IHN0cmluZ106IHN0cmluZ1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE5vdGVib29rIHN0YWNrIGFzIGRlZmluZWQgdXNpbmcgRG9ja2VyIFN0YWNrcyBmb3IgSnVweXRlciBoZXJlOlxuICAgICAqIGh0dHBzOi8vanVweXRlci1kb2NrZXItc3RhY2tzLnJlYWR0aGVkb2NzLmlvL2VuL2xhdGVzdC91c2luZy9zZWxlY3RpbmcuaHRtbCNjb3JlLXN0YWNrc1xuICAgICAqL1xuICAgIG5vdGVib29rU3RhY2s/OiBzdHJpbmcsXG5cbiAgICAvKipcbiAgICAgKiBOYW1lIG9mIHRoZSBjZXJ0aWZpY2F0ZSB7QGxpbmsgTmFtZWRSZXNvdXJjZVByb3ZpZGVyfSB0byBiZSB1c2VkIGZvciBjZXJ0aWZpY2F0ZSBsb29rIHVwLiBcbiAgICAgKiBAc2VlIHtAbGluayBJbXBvcnRDZXJ0aWZpY2F0ZVByb3ZpZGVyfSBhbmQge0BsaW5rIENyZWF0ZUNlcnRpZmljYXRlUHJvdmlkZXJ9IGZvciBleGFtcGxlcyBvZiBjZXJ0aWZpY2F0ZSBwcm92aWRlcnMuXG4gICAgICovXG4gICAgY2VydGlmaWNhdGVSZXNvdXJjZU5hbWU/OiBzdHJpbmcsXG59XG5cbmNvbnN0IEpVUFlURVJIVUIgPSAnanVweXRlcmh1Yic7XG5jb25zdCBSRUxFQVNFID0gJ2JsdWVwcmludHMtYWRkb24tanVweXRlcmh1Yic7XG5cbi8qKlxuICogRGVmYXVsdHMgb3B0aW9ucyBmb3IgdGhlIGFkZC1vblxuICovXG5jb25zdCBkZWZhdWx0UHJvcHM6IEhlbG1BZGRPblByb3BzID0ge1xuICAgIG5hbWU6IEpVUFlURVJIVUIsXG4gICAgbmFtZXNwYWNlOiBKVVBZVEVSSFVCLFxuICAgIHZlcnNpb246ICcyLjAuMCcsXG4gICAgY2hhcnQ6IEpVUFlURVJIVUIsXG4gICAgcmVsZWFzZTogUkVMRUFTRSxcbiAgICByZXBvc2l0b3J5OiAnaHR0cHM6Ly9odWIuanVweXRlci5vcmcvaGVsbS1jaGFydC8nLFxuICAgIHZhbHVlczoge31cbn07XG5cbi8qKlxuICogSW1wbGVtZW50YXRpb24gb2YgdGhlIEp1cHl0ZXJIdWIgYWRkLW9uXG4gKi9cbkBzdXBwb3J0c0FMTFxuZXhwb3J0IGNsYXNzIEp1cHl0ZXJIdWJBZGRPbiBleHRlbmRzIEhlbG1BZGRPbiB7XG5cbiAgICByZWFkb25seSBvcHRpb25zOiBKdXB5dGVySHViQWRkT25Qcm9wcztcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzPzogSnVweXRlckh1YkFkZE9uUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoey4uLmRlZmF1bHRQcm9wcywgLi4ucHJvcHN9KTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gdGhpcy5wcm9wcyBhcyBKdXB5dGVySHViQWRkT25Qcm9wcztcbiAgICB9XG4gICAgXG4gICAgZGVwbG95KGNsdXN0ZXJJbmZvOiBDbHVzdGVySW5mbyk6IFByb21pc2U8Q29uc3RydWN0PiB7XG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBjbHVzdGVySW5mby5jbHVzdGVyO1xuICAgICAgICBsZXQgdmFsdWVzID0gdGhpcy5vcHRpb25zLnZhbHVlcyA/PyB7fTtcblxuICAgICAgICAvLyBUaGUgYWRkb24gcmVxdWlyZXMgYSBwZXJzaXN0ZW50IHN0b3JhZ2Ugb3B0aW9uXG4gICAgICAgIGFzc2VydCh0aGlzLm9wdGlvbnMuZWJzQ29uZmlnIHx8IHRoaXMub3B0aW9ucy5lZnNDb25maWcsIFwiWW91IG5lZWQgdG8gcHJvdmlkZSBhIHBlcnNpc3RlbnQgc3RvcmFnZSBvcHRpb24uXCIpO1xuICAgICAgICBcbiAgICAgICAgLy8gQnV0IHlvdSBjYW4gb25seSBwcm92aWRlIG9uZSBvcHRpb24gZm9yIHBlcnNpc3RlbnQgc3RvcmFnZVxuICAgICAgICBhc3NlcnQoISh0aGlzLm9wdGlvbnMuZWJzQ29uZmlnICYmIHRoaXMub3B0aW9ucy5lZnNDb25maWcpLCBcIllvdSBjYW5ub3QgcHJvdmlkZSBtb3JlIHRoYW4gb25lIHBlcnNpc3RlbnQgc3RvcmFnZSBvcHRpb24uXCIpO1xuXG4gICAgICAgIC8vIENyZWF0ZSBOYW1lc3BhY2VcbiAgICAgICAgY29uc3QgbnMgPSBjcmVhdGVOYW1lc3BhY2UodGhpcy5vcHRpb25zLm5hbWVzcGFjZSEsIGNsdXN0ZXIsIHRydWUsIHRydWUpO1xuICAgICAgICBcbiAgICAgICAgLy8gVXNlciBFbnZpcm9ubWVudCBzZXR1cFxuICAgICAgICBsZXQgY21kO1xuICAgICAgICBpZiAoc2VtdmVyLmx0KHRoaXMub3B0aW9ucy52ZXJzaW9uISwgJzIuMC4wJykpe1xuICAgICAgICAgICAgY21kID0gW1wic3RhcnQtc2luZ2xldXNlci5zaFwiXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNtZCA9IFtcImp1cHl0ZXJodWItc2luZ2xldXNlclwiLFwiLS1hbGxvdy1yb290XCJdO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5vdGVib29rID0gdGhpcy5vcHRpb25zLm5vdGVib29rU3RhY2sgfHwgJ2p1cHl0ZXIvYmFzZS1ub3RlYm9vayc7XG4gICAgICAgIHNldFBhdGgodmFsdWVzLCBcInNpbmdsZXVzZXJcIiwge1xuICAgICAgICAgICAgXCJpbWFnZVwiOntcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogYCR7bm90ZWJvb2t9YCxcbiAgICAgICAgICAgICAgICBcInRhZ1wiOiBcImxhdGVzdFwiIFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZXh0cmFFbnZcIjogeyBcIkNIT1dOX0hPTUVcIjogXCJ5ZXNcIiB9LFxuICAgICAgICAgICAgXCJ1aWRcIjogMCxcbiAgICAgICAgICAgIFwiZnNHaWRcIjogMCxcbiAgICAgICAgICAgIFwiY21kXCI6IGNtZFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBQZXJzaXN0ZW50IFN0b3JhZ2UgU2V0dXAgZm9yIEVCU1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmVic0NvbmZpZyl7XG4gICAgICAgICAgICB0aGlzLmFkZEVic1N0b3JhZ2UoY2x1c3RlckluZm8sIHZhbHVlcywgdGhpcy5vcHRpb25zLmVic0NvbmZpZyk7XG4gICAgICAgIH0gXG4gICAgICAgIFxuICAgICAgICAvLyBQZXJzaXN0ZW50IFN0b3JhZ2UgU2V0dXAgZm9yIEVGU1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmVmc0NvbmZpZykge1xuICAgICAgICAgICAgdGhpcy5hZGRFZnNTdG9yYWdlKGNsdXN0ZXJJbmZvLCB2YWx1ZXMsIHRoaXMub3B0aW9ucy5lZnNDb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT3BlbklEIENvbm5lY3QgYXV0aGVudGljYXRpb24gc2V0dXBcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5vaWRjQ29uZmlnKXtcbiAgICAgICAgICAgIHNldFBhdGgodmFsdWVzLCBcImh1Yi5jb25maWdcIiwge1xuICAgICAgICAgICAgICAgIFwiSnVweXRlckh1YlwiOiB7IFwiYXV0aGVudGljYXRvcl9jbGFzc1wiOiBcImdlbmVyaWMtb2F1dGhcIiB9LCBcbiAgICAgICAgICAgICAgICBcIkdlbmVyaWNPQXV0aGVudGljYXRvclwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2xpZW50X2lkXCI6IHRoaXMub3B0aW9ucy5vaWRjQ29uZmlnLmNsaWVudElkLFxuICAgICAgICAgICAgICAgICAgICBcImNsaWVudF9zZWNyZXRcIjogdGhpcy5vcHRpb25zLm9pZGNDb25maWcuY2xpZW50U2VjcmV0LFxuICAgICAgICAgICAgICAgICAgICBcIm9hdXRoX2NhbGxiYWNrX3VybFwiOiB0aGlzLm9wdGlvbnMub2lkY0NvbmZpZy5jYWxsYmFja1VybCxcbiAgICAgICAgICAgICAgICAgICAgXCJhdXRob3JpemVfdXJsXCI6IHRoaXMub3B0aW9ucy5vaWRjQ29uZmlnLmF1dGhVcmwsXG4gICAgICAgICAgICAgICAgICAgIFwidG9rZW5fdXJsXCI6IHRoaXMub3B0aW9ucy5vaWRjQ29uZmlnLnRva2VuVXJsLFxuICAgICAgICAgICAgICAgICAgICBcInVzZXJkYXRhX3VybFwiOiB0aGlzLm9wdGlvbnMub2lkY0NvbmZpZy51c2VyRGF0YVVybCxcbiAgICAgICAgICAgICAgICAgICAgXCJzY29wZVwiOiAgdGhpcy5vcHRpb25zLm9pZGNDb25maWcuc2NvcGUsXG4gICAgICAgICAgICAgICAgICAgIFwidXNlcm5hbWVfa2V5XCI6ICB0aGlzLm9wdGlvbnMub2lkY0NvbmZpZy51c2VybmFtZUtleSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFByb3h5IGluZm9ybWF0aW9uIC0gc2V0IGVpdGhlciBBTEIsIE5MQiAoZGVmYXVsdCkgb3IgQ2x1c3RlcklQIHNlcnZpY2UgYmFzZWQgb24gXG4gICAgICAgIC8vIHByb3ZpZGVkIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgY29uc3Qgc2VydmljZVR5cGUgPSB0aGlzLm9wdGlvbnMuc2VydmljZVR5cGU7XG4gICAgICAgIGNvbnN0IGluZ3Jlc3NIb3N0cyA9IHRoaXMub3B0aW9ucy5pbmdyZXNzSG9zdHMgfHwgW107XG4gICAgICAgIGNvbnN0IGluZ3Jlc3NBbm5vdGF0aW9ucyA9IHRoaXMub3B0aW9ucy5pbmdyZXNzQW5ub3RhdGlvbnM7XG4gICAgICAgIGNvbnN0IGNlcnQgPSB0aGlzLm9wdGlvbnMuY2VydGlmaWNhdGVSZXNvdXJjZU5hbWU7XG5cbiAgICAgICAgY29uc3QgYWxiQWRkT25DaGVjayA9IGNsdXN0ZXJJbmZvLmdldFNjaGVkdWxlZEFkZE9uKEF3c0xvYWRCYWxhbmNlckNvbnRyb2xsZXJBZGRPbi5uYW1lKTtcbiAgICAgICAgLy8gVXNlIEluZ3Jlc3MgYW5kIEFXUyBBTEJcbiAgICAgICAgaWYgKHNlcnZpY2VUeXBlID09IEp1cHl0ZXJIdWJTZXJ2aWNlVHlwZS5BTEIpe1xuICAgICAgICAgICAgYXNzZXJ0KGFsYkFkZE9uQ2hlY2ssIGBNaXNzaW5nIGEgZGVwZW5kZW5jeTogJHtBd3NMb2FkQmFsYW5jZXJDb250cm9sbGVyQWRkT24ubmFtZX0uIFBsZWFzZSBhZGQgaXQgdG8geW91ciBsaXN0IG9mIGFkZG9ucy5gKTsgXG4gICAgICAgICAgICBjb25zdCBwcmVzZXRBbm5vdGF0aW9uczogYW55ID0ge1xuICAgICAgICAgICAgICAgICdhbGIuaW5ncmVzcy5rdWJlcm5ldGVzLmlvL3NjaGVtZSc6ICdpbnRlcm5ldC1mYWNpbmcnLFxuICAgICAgICAgICAgICAgICdhbGIuaW5ncmVzcy5rdWJlcm5ldGVzLmlvL3RhcmdldC10eXBlJzogJ2lwJyxcbiAgICAgICAgICAgICAgICAna3ViZXJuZXRlcy5pby9pbmdyZXNzLmNsYXNzJzogJ2FsYicsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGNlcnQpe1xuICAgICAgICAgICAgICAgIHByZXNldEFubm90YXRpb25zWydhbGIuaW5ncmVzcy5rdWJlcm5ldGVzLmlvL3NzbC1yZWRpcmVjdCddID0gJzQ0Myc7XG4gICAgICAgICAgICAgICAgcHJlc2V0QW5ub3RhdGlvbnNbJ2FsYi5pbmdyZXNzLmt1YmVybmV0ZXMuaW8vbGlzdGVuLXBvcnRzJ10gPSAnW3tcIkhUVFBcIjogODB9LHtcIkhUVFBTXCI6NDQzfV0nO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNlcnRpZmljYXRlID0gY2x1c3RlckluZm8uZ2V0UmVzb3VyY2U8SUNlcnRpZmljYXRlPihjZXJ0KTtcbiAgICAgICAgICAgICAgICBwcmVzZXRBbm5vdGF0aW9uc1snYWxiLmluZ3Jlc3Mua3ViZXJuZXRlcy5pby9jZXJ0aWZpY2F0ZS1hcm4nXSA9IGNlcnRpZmljYXRlPy5jZXJ0aWZpY2F0ZUFybjtcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICBjb25zdCBhbm5vdGF0aW9ucyA9IHsgLi4uaW5ncmVzc0Fubm90YXRpb25zLCAuLi5wcmVzZXRBbm5vdGF0aW9uc307XG4gICAgICAgICAgICBzZXRQYXRoKHZhbHVlcywgXCJpbmdyZXNzLmFubm90YXRpb25zXCIsIGFubm90YXRpb25zKTtcbiAgICAgICAgICAgIHNldFBhdGgodmFsdWVzLCBcImluZ3Jlc3MuaG9zdHNcIiwgaW5ncmVzc0hvc3RzKTtcbiAgICAgICAgICAgIHNldFBhdGgodmFsdWVzLCBcImluZ3Jlc3MuZW5hYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgICAgIHNldFBhdGgodmFsdWVzLCBcInByb3h5LnNlcnZpY2VcIiwge1widHlwZVwiIDogXCJDbHVzdGVySVBcIn0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXNzZXJ0KCFpbmdyZXNzSG9zdHMgfHwgaW5ncmVzc0hvc3RzLmxlbmd0aCA9PSAwLCAnSW5ncmVzcyBIb3N0cyBDQU5OT1QgYmUgYXNzaWduZWQgd2hlbiBpbmdyZXNzIGlzIGRpc2FibGVkJyk7XG4gICAgICAgICAgICBhc3NlcnQoIWluZ3Jlc3NBbm5vdGF0aW9ucywgJ0luZ3Jlc3MgYW5ub3RhdGlvbnMgQ0FOTk9UIGJlIGFzc2lnbmVkIHdoZW4gaW5ncmVzcyBpcyBkaXNhYmxlZCcpO1xuICAgICAgICAgICAgYXNzZXJ0KCFjZXJ0LCAnQ2VydCBvcHRpb24gaXMgb25seSBzdXBwb3J0ZWQgaWYgaW5ncmVzcyBpcyBlbmFibGVkLicpO1xuICAgICAgICAgICAgLy8gSWYgd2Ugc2V0IFNWQywgc2V0IHRoZSBwcm94eSBzZXJ2aWNlIHR5cGUgdG8gQ2x1c3RlcklQIGFuZCBhbGxvdyB1c2VycyB0byBwb3J0LWZvcndhcmQgdG8gbG9jYWxob3N0XG4gICAgICAgICAgICBpZiAoc2VydmljZVR5cGUgPT0gSnVweXRlckh1YlNlcnZpY2VUeXBlLkNMVVNURVJJUCl7XG4gICAgICAgICAgICAgICAgc2V0UGF0aCh2YWx1ZXMsIFwicHJveHkuc2VydmljZVwiLCB7XCJ0eXBlXCI6IFwiQ2x1c3RlcklQXCJ9KTtcbiAgICAgICAgICAgIC8vIFdlIHdpbGwgdXNlIE5MQiBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KGFsYkFkZE9uQ2hlY2ssIGBNaXNzaW5nIGEgZGVwZW5kZW5jeTogJHtBd3NMb2FkQmFsYW5jZXJDb250cm9sbGVyQWRkT24ubmFtZX0uIFBsZWFzZSBhZGQgaXQgdG8geW91ciBsaXN0IG9mIGFkZG9ucy5gKTsgXG4gICAgICAgICAgICAgICAgc2V0UGF0aCh2YWx1ZXMsIFwicHJveHkuc2VydmljZVwiLCB7IFxuICAgICAgICAgICAgICAgICAgICBcImFubm90YXRpb25zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VydmljZS5iZXRhLmt1YmVybmV0ZXMuaW8vYXdzLWxvYWQtYmFsYW5jZXItdHlwZVwiOiBcIm5sYlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXJ2aWNlLmJldGEua3ViZXJuZXRlcy5pby9hd3MtbG9hZC1iYWxhbmNlci1zY2hlbWVcIjogXCJpbnRlcm5ldC1mYWNpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VydmljZS5iZXRhLmt1YmVybmV0ZXMuaW8vYXdzLWxvYWQtYmFsYW5jZXItbmxiLXRhcmdldC10eXBlXCI6IFwiaXBcIixcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ3JlYXRlIEhlbG0gQ2hhcnRcbiAgICAgICAgY29uc3QganVweXRlckh1YkNoYXJ0ID0gdGhpcy5hZGRIZWxtQ2hhcnQoY2x1c3RlckluZm8sIHZhbHVlcywgZmFsc2UsIGZhbHNlKTtcblxuICAgICAgICAvLyBBZGQgZGVwZW5kZW5jeVxuICAgICAgICBqdXB5dGVySHViQ2hhcnQubm9kZS5hZGREZXBlbmRlbmN5KG5zKTtcblxuICAgICAgICBpZihhbGJBZGRPbkNoZWNrKSB7XG4gICAgICAgICAgICBhbGJBZGRPbkNoZWNrLnRoZW4oY29uc3RydWN0ID0+IGp1cHl0ZXJIdWJDaGFydC5ub2RlLmFkZERlcGVuZGVuY3koY29uc3RydWN0KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShqdXB5dGVySHViQ2hhcnQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIGEgaGVscGVyIGZ1bmN0aW9uIHRvIGNyZWF0ZSBFQlMgcGVyc2lzdGVudCBzdG9yYWdlXG4gICAgICogQHBhcmFtIHtDbHVzdGVySW5mb30gY2x1c3RlckluZm8gLSBDbHVzdGVyIEluZm9cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVzIC0gSGVsbSBDaGFydCBWYWx1ZXNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZWJzQ29uZmlnIC0gRUJTIENvbmZpZ3VyYXRpb25zIHN1cHBsaWVkIGJ5IHVzZXJcbiAgICAgKiBAcmV0dXJuc1xuICAgICAqL1xuICAgIHByb3RlY3RlZCBhZGRFYnNTdG9yYWdlKGNsdXN0ZXJJbmZvOiBDbHVzdGVySW5mbywgdmFsdWVzOiBhbnksIGVic0NvbmZpZzogYW55KXtcbiAgICAgICAgY29uc3QgZGVwID0gY2x1c3RlckluZm8uZ2V0U2NoZWR1bGVkQWRkT24oRWJzQ3NpRHJpdmVyQWRkT24ubmFtZSk7XG4gICAgICAgIGFzc2VydChkZXAsIGBNaXNzaW5nIGEgZGVwZW5kZW5jeTogJHtFYnNDc2lEcml2ZXJBZGRPbi5uYW1lfS4gUGxlYXNlIGFkZCBpdCB0byB5b3VyIGxpc3Qgb2YgYWRkb25zLmApOyBcbiAgICAgICAgLy8gQ3JlYXRlIHBlcnNpc3RlbnQgc3RvcmFnZSB3aXRoIEVCU1xuICAgICAgICBjb25zdCBzdG9yYWdlQ2xhc3MgPSBlYnNDb25maWcuc3RvcmFnZUNsYXNzO1xuICAgICAgICBjb25zdCBlYnNDYXBhY2l0eSA9IGVic0NvbmZpZy5jYXBhY2l0eTtcbiAgICAgICAgc2V0UGF0aCh2YWx1ZXMsIFwic2luZ2xldXNlci5zdG9yYWdlXCIsIHtcbiAgICAgICAgICAgIFwiZHluYW1pY1wiOiB7IFwic3RvcmFnZUNsYXNzXCI6IHN0b3JhZ2VDbGFzcyB9LFxuICAgICAgICAgICAgXCJjYXBhY2l0eVwiOiBlYnNDYXBhY2l0eVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIGEgaGVscGVyIGZ1bmN0aW9uIHRvIGNyZWF0ZSBFRlMgcGVyc2lzdGVudCBzdG9yYWdlXG4gICAgICogQHBhcmFtIHtDbHVzdGVySW5mb30gY2x1c3RlckluZm8gLSBDbHVzdGVyIEluZm9cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVzIC0gSGVsbSBDaGFydCBWYWx1ZXNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZWZzQ29uZmlnIC0gRUZTIENvbmZpZ3VyYXRpb25zIHN1cHBsaWVkIGJ5IHVzZXJcbiAgICAgKiBAcmV0dXJuc1xuICAgICAqL1xuICAgIHByb3RlY3RlZCBhZGRFZnNTdG9yYWdlKGNsdXN0ZXJJbmZvOiBDbHVzdGVySW5mbywgdmFsdWVzOiBhbnksIGVmc0NvbmZpZzogYW55KXtcbiAgICAgICAgY29uc3QgZGVwID0gY2x1c3RlckluZm8uZ2V0U2NoZWR1bGVkQWRkT24oRWZzQ3NpRHJpdmVyQWRkT24ubmFtZSk7XG4gICAgICAgIGFzc2VydChkZXAsIGBNaXNzaW5nIGEgZGVwZW5kZW5jeTogJHtFZnNDc2lEcml2ZXJBZGRPbi5uYW1lfS4gUGxlYXNlIGFkZCBpdCB0byB5b3VyIGxpc3Qgb2YgYWRkb25zLmApOyBcblxuICAgICAgICBjb25zdCBwdmNOYW1lID0gZWZzQ29uZmlnLnB2Y05hbWU7XG4gICAgICAgIGNvbnN0IHJlbW92YWxQb2xpY3kgPSBlZnNDb25maWcucmVtb3ZhbFBvbGljeTtcbiAgICAgICAgY29uc3QgZWZzQ2FwYWNpdHkgPSBlZnNDb25maWcuY2FwYWNpdHk7XG5cbiAgICAgICAgdGhpcy5zZXR1cEVGUyhjbHVzdGVySW5mbywgdGhpcy5vcHRpb25zLm5hbWVzcGFjZSEsIHB2Y05hbWUsIGVmc0NhcGFjaXR5LCByZW1vdmFsUG9saWN5KTtcbiAgICAgICAgc2V0UGF0aCh2YWx1ZXMsIFwic2luZ2xldXNlci5zdG9yYWdlXCIsIHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInN0YXRpY1wiLFxuICAgICAgICAgICAgXCJzdGF0aWNcIjoge1xuICAgICAgICAgICAgICAgIFwicHZjTmFtZVwiOiBgJHtwdmNOYW1lfWAsXG4gICAgICAgICAgICAgICAgXCJzdWJQYXRoXCI6IFwiaG9tZS97dXNlcm5hbWV9XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgYSBoZWxwZXIgZnVuY3Rpb24gdG8gdXNlIEVGUyBhcyBwZXJzaXN0ZW50IHN0b3JhZ2VcbiAgICAgKiBpbmNsdWRpbmcgbmVjZXNzYXJ5IHNlY3VyaXR5IGdyb3VwIHdpdGggaW5ncmVzcyBydWxlLFxuICAgICAqIEVGUyBGaWxlIFN5c3RlbSwgS3ViZXJuZXRlcyBQViBhbmQgUFZDXG4gICAgICogQHBhcmFtIHtDbHVzdGVySW5mb30gY2x1c3RlckluZm8gLSBDbHVzdGVyIEluZm9cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZXNwYWNlIC0gTmFtZXNwYWNlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHB2Y05hbWUgLSBOYW1lIG9mIHRoZSBQViBhbmQgUFZDXG4gICAgICogQHBhcmFtIHtSZW1vdmFsUG9saWN5fXJlbW92YWxQb2xpY3kgLSBSZW1vdmFsIFBvbGljeSBmb3IgRUZTIEZpbGUgU3lzdGVtIChSRVRBSU4sIERFU1RST1kgb3IgU05BUFNIT1QpXG4gICAgICogQHJldHVybnNcbiAgICAgKiAqL1xuICAgIHByb3RlY3RlZCBzZXR1cEVGUyhjbHVzdGVySW5mbzogQ2x1c3RlckluZm8sIG5hbWVzcGFjZTogc3RyaW5nLCBwdmNOYW1lOiBzdHJpbmcsIGNhcGFjaXR5OiBzdHJpbmcsIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5KXtcbiAgICAgICAgY29uc3QgY2x1c3RlciA9IGNsdXN0ZXJJbmZvLmNsdXN0ZXI7XG4gICAgICAgIGNvbnN0IGNsdXN0ZXJWcGNDaWRyID0gY2x1c3RlckluZm8uY2x1c3Rlci52cGMudnBjQ2lkckJsb2NrO1xuXG4gICAgICAgIC8vIFNlY3VyaXR5IEdyb3VwIHJlcXVpcmVkIGZvciBhY2Nlc3MgdG8gdGhlIEZpbGUgU3lzdGVtXG4gICAgICAgIC8vIFdpdGggdGhlIHJpZ2h0IGluZ3Jlc3MgcnVsZVxuICAgICAgICBjb25zdCBqdXB5dGVySHViU0cgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoXG4gICAgICAgICAgICBjbHVzdGVyLnN0YWNrLCAnTXlFZnNTZWN1cml0eUdyb3VwJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2cGM6IGNsdXN0ZXJJbmZvLmNsdXN0ZXIudnBjLFxuICAgICAgICAgICAgICAgIHNlY3VyaXR5R3JvdXBOYW1lOiBcIkVrc0JsdWVwcmludHNKSHViRUZTU0dcIixcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAganVweXRlckh1YlNHLmFkZEluZ3Jlc3NSdWxlKFxuICAgICAgICAgICAgZWMyLlBlZXIuaXB2NChjbHVzdGVyVnBjQ2lkciksXG4gICAgICAgICAgICBuZXcgZWMyLlBvcnQoe1xuICAgICAgICAgICAgICAgIHByb3RvY29sOiBlYzIuUHJvdG9jb2wuVENQLFxuICAgICAgICAgICAgICAgIHN0cmluZ1JlcHJlc2VudGF0aW9uOiBcIkVGU2Nvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICB0b1BvcnQ6IDIwNDksXG4gICAgICAgICAgICAgICAgZnJvbVBvcnQ6IDIwNDksXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBDcmVhdGUgdGhlIEVGUyBGaWxlIFN5c3RlbVxuICAgICAgICBjb25zdCBqdXB5dGVySHViRmlsZVN5c3RlbSA9IG5ldyBlZnMuRmlsZVN5c3RlbShcbiAgICAgICAgICAgIGNsdXN0ZXIuc3RhY2ssICdNeUVmc0ZpbGVTeXN0ZW0nLCBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2cGM6IGNsdXN0ZXJJbmZvLmNsdXN0ZXIudnBjLFxuICAgICAgICAgICAgICAgIHNlY3VyaXR5R3JvdXA6IGp1cHl0ZXJIdWJTRyxcbiAgICAgICAgICAgICAgICByZW1vdmFsUG9saWN5OiByZW1vdmFsUG9saWN5LFxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBlZnNJZCA9IGp1cHl0ZXJIdWJGaWxlU3lzdGVtLmZpbGVTeXN0ZW1JZDtcbiAgICAgICAgXG4gICAgICAgIC8vIENyZWF0ZSBTdG9yYWdlQ2xhc3NcbiAgICAgICAgY29uc3QgZWZzU0MgPSBjbHVzdGVyLmFkZE1hbmlmZXN0KCdlZnMtc3RvcmFnZS1jbGFzcycsIHtcbiAgICAgICAgICAgIGFwaVZlcnNpb246ICdzdG9yYWdlLms4cy5pby92MScsXG4gICAgICAgICAgICBraW5kOiAnU3RvcmFnZUNsYXNzJyxcbiAgICAgICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2Vmcy1zYycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHJvdmlzaW9uZXI6ICdlZnMuY3NpLmF3cy5jb20nLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBTZXR1cCBQZXJzaXN0ZW50Vm9sdW1lIGFuZCBQZXJzaXN0ZW50Vm9sdW1lQ2xhaW1cbiAgICAgICAgY29uc3QgZWZzUFYgPSBjbHVzdGVyLmFkZE1hbmlmZXN0KCdlZnMtcHYnLCB7XG4gICAgICAgICAgICBhcGlWZXJzaW9uOiAndjEnLFxuICAgICAgICAgICAga2luZDogJ1BlcnNpc3RlbnRWb2x1bWUnLFxuICAgICAgICAgICAgbWV0YWRhdGE6IHsgXG4gICAgICAgICAgICAgICAgbmFtZTogYCR7cHZjTmFtZX1gLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogbmFtZXNwYWNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3BlYzoge1xuICAgICAgICAgICAgICAgIGNhcGFjaXR5OiB7IHN0b3JhZ2U6IGAke2NhcGFjaXR5fWAgfSxcbiAgICAgICAgICAgICAgICB2b2x1bWVNb2RlOiAnRmlsZXN5c3RlbScsXG4gICAgICAgICAgICAgICAgYWNjZXNzTW9kZXM6IFsgJ1JlYWRXcml0ZU1hbnknIF0sXG4gICAgICAgICAgICAgICAgc3RvcmFnZUNsYXNzTmFtZTogJ2Vmcy1zYycsXG4gICAgICAgICAgICAgICAgY3NpOiB7XG4gICAgICAgICAgICAgICAgICAgIGRyaXZlcjogJ2Vmcy5jc2kuYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgICAgIHZvbHVtZUhhbmRsZTogYCR7ZWZzSWR9YCxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgZWZzUFYubm9kZS5hZGREZXBlbmRlbmN5KGVmc1NDKTtcbiAgICAgICAgZWZzUFYubm9kZS5hZGREZXBlbmRlbmN5KGp1cHl0ZXJIdWJGaWxlU3lzdGVtKTtcblxuICAgICAgICBjb25zdCBlZnNQVkMgPSBjbHVzdGVyLmFkZE1hbmlmZXN0KCdlZnMtcHZjJywge1xuICAgICAgICAgICAgYXBpVmVyc2lvbjogJ3YxJyxcbiAgICAgICAgICAgIGtpbmQ6ICdQZXJzaXN0ZW50Vm9sdW1lQ2xhaW0nLFxuICAgICAgICAgICAgbWV0YWRhdGE6IHsgXG4gICAgICAgICAgICAgICAgbmFtZTogYCR7cHZjTmFtZX1gLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogbmFtZXNwYWNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3BlYzoge1xuICAgICAgICAgICAgICAgIHN0b3JhZ2VDbGFzc05hbWU6ICdlZnMtc2MnLFxuICAgICAgICAgICAgICAgIGFjY2Vzc01vZGVzOiBbICdSZWFkV3JpdGVNYW55JyBdLFxuICAgICAgICAgICAgICAgIHJlc291cmNlczogeyByZXF1ZXN0czogeyBzdG9yYWdlOiBgJHtjYXBhY2l0eX1gIH0gfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICBlZnNQVkMubm9kZS5hZGREZXBlbmRlbmN5KGVmc1BWKTtcbiAgICB9XG59XG5cbiJdfQ==