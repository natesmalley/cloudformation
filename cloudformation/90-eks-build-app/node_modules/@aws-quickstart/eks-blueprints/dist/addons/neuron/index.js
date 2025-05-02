"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeuronMonitorAddOn = exports.NeuronDevicePluginAddOn = void 0;
const kubectl_provider_1 = require("../helm-addon/kubectl-provider");
const yaml_utils_1 = require("../../utils/yaml-utils");
const utils_1 = require("../../utils");
const aws_eks_1 = require("aws-cdk-lib/aws-eks");
const neuron_monitor_customization_1 = require("./neuron-monitor-customization");
const PLUGIN_URL = "https://raw.githubusercontent.com/aws-neuron/aws-neuron-sdk/master/src/k8/k8s-neuron-device-plugin.yml";
const RBAC_URL = "https://raw.githubusercontent.com/aws-neuron/aws-neuron-sdk/master/src/k8/k8s-neuron-device-plugin-rbac.yml";
class NeuronDevicePluginAddOn {
    deploy(clusterInfo) {
        const kubectlProvider = new kubectl_provider_1.KubectlProvider(clusterInfo);
        // Read in YAML docs
        const rbac = (0, yaml_utils_1.loadExternalYaml)(RBAC_URL);
        const rbacManifest = {
            name: "neuron-rbac-manifest",
            namespace: "",
            manifest: rbac,
            values: {}
        };
        const plugin = (0, yaml_utils_1.loadExternalYaml)(PLUGIN_URL);
        const pluginManifest = {
            name: "neuron-plugin-manifest",
            namespace: "kube-system",
            manifest: plugin,
            values: {}
        };
        const rbacStatement = kubectlProvider.addManifest(rbacManifest);
        const pluginStatement = kubectlProvider.addManifest(pluginManifest);
        // Plugin dependency on the RBAC manifest
        pluginStatement.node.addDependency(rbacStatement);
        return Promise.resolve(pluginStatement);
    }
}
exports.NeuronDevicePluginAddOn = NeuronDevicePluginAddOn;
const defaultProps = {
    namespace: "kube-system",
    imageTag: "1.0.0",
    port: 9010
};
class NeuronMonitorAddOn {
    constructor(props) {
        this.options = { ...defaultProps, ...props };
    }
    deploy(clusterInfo) {
        const cluster = clusterInfo.cluster;
        const manifest = new neuron_monitor_customization_1.NeuronMonitorManifest().generate(this.options.namespace, this.options.imageTag, this.options.port);
        const neuronMonitorManifest = new aws_eks_1.KubernetesManifest(cluster.stack, "neuron-monitor-manifest", {
            cluster,
            manifest: manifest,
            overwrite: true
        });
        if (this.options.createNamespace === true) {
            // Let CDK Create the Namespace
            const namespace = (0, utils_1.createNamespace)(this.options.namespace, cluster);
            neuronMonitorManifest.node.addDependency(namespace);
        }
        return Promise.resolve(neuronMonitorManifest);
    }
}
exports.NeuronMonitorAddOn = NeuronMonitorAddOn;
__decorate([
    (0, utils_1.dependable)(NeuronDevicePluginAddOn.name)
], NeuronMonitorAddOn.prototype, "deploy", null);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL25ldXJvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFFQSxxRUFBcUY7QUFDckYsdURBQTBEO0FBQzFELHVDQUEwRDtBQUMxRCxpREFBeUQ7QUFDekQsaUZBQXVFO0FBRXZFLE1BQU0sVUFBVSxHQUFHLHdHQUF3RyxDQUFDO0FBQzVILE1BQU0sUUFBUSxHQUFHLDZHQUE2RyxDQUFDO0FBRS9ILE1BQWEsdUJBQXVCO0lBQ2hDLE1BQU0sQ0FBQyxXQUF3QjtRQUMzQixNQUFNLGVBQWUsR0FBRyxJQUFJLGtDQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFekQsb0JBQW9CO1FBQ3BCLE1BQU0sSUFBSSxHQUFHLElBQUEsNkJBQWdCLEVBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEMsTUFBTSxZQUFZLEdBQXVCO1lBQ3JDLElBQUksRUFBRSxzQkFBc0I7WUFDNUIsU0FBUyxFQUFFLEVBQUU7WUFDYixRQUFRLEVBQUUsSUFBSTtZQUNkLE1BQU0sRUFBRSxFQUFFO1NBQ2IsQ0FBQztRQUVGLE1BQU0sTUFBTSxHQUFHLElBQUEsNkJBQWdCLEVBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUMsTUFBTSxjQUFjLEdBQXVCO1lBQ3ZDLElBQUksRUFBRSx3QkFBd0I7WUFDOUIsU0FBUyxFQUFFLGFBQWE7WUFDeEIsUUFBUSxFQUFFLE1BQU07WUFDaEIsTUFBTSxFQUFFLEVBQUU7U0FDYixDQUFDO1FBRUYsTUFBTSxhQUFhLEdBQUcsZUFBZSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNoRSxNQUFNLGVBQWUsR0FBRyxlQUFlLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRXBFLHlDQUF5QztRQUN6QyxlQUFlLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVsRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDNUMsQ0FBQztDQUNKO0FBN0JELDBEQTZCQztBQXdCRCxNQUFNLFlBQVksR0FBNEI7SUFDMUMsU0FBUyxFQUFFLGFBQWE7SUFDeEIsUUFBUSxFQUFFLE9BQU87SUFDakIsSUFBSSxFQUFFLElBQUk7Q0FDYixDQUFDO0FBR0YsTUFBYSxrQkFBa0I7SUFJM0IsWUFBWSxLQUErQjtRQUN2QyxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUMsR0FBRyxZQUFZLEVBQUUsR0FBRyxLQUFLLEVBQUMsQ0FBQztJQUMvQyxDQUFDO0lBR0QsTUFBTSxDQUFDLFdBQXdCO1FBRTNCLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUM7UUFFcEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxvREFBcUIsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUssQ0FBQyxDQUFDO1FBRTNILE1BQU0scUJBQXFCLEdBQUcsSUFBSSw0QkFBa0IsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLHlCQUF5QixFQUFFO1lBQzNGLE9BQU87WUFDUCxRQUFRLEVBQUUsUUFBUTtZQUNsQixTQUFTLEVBQUUsSUFBSTtTQUNsQixDQUFDLENBQUM7UUFFSCxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxLQUFLLElBQUksRUFBQyxDQUFDO1lBQ3RDLCtCQUErQjtZQUMvQixNQUFNLFNBQVMsR0FBRyxJQUFBLHVCQUFlLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFVLEVBQUcsT0FBTyxDQUFDLENBQUM7WUFDckUscUJBQXFCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0RCxDQUFDO1FBRUgsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFFbEQsQ0FBQztDQUNKO0FBOUJELGdEQThCQztBQXJCRztJQURDLElBQUEsa0JBQVUsRUFBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUM7Z0RBcUJ4QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgeyBDbHVzdGVyQWRkT24sIENsdXN0ZXJJbmZvIH0gZnJvbSBcIi4uLy4uL3NwaVwiO1xuaW1wb3J0IHsgS3ViZWN0bFByb3ZpZGVyLCBNYW5pZmVzdERlcGxveW1lbnQgfSBmcm9tIFwiLi4vaGVsbS1hZGRvbi9rdWJlY3RsLXByb3ZpZGVyXCI7XG5pbXBvcnQgeyBsb2FkRXh0ZXJuYWxZYW1sIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3lhbWwtdXRpbHNcIjtcbmltcG9ydCB7IGNyZWF0ZU5hbWVzcGFjZSwgZGVwZW5kYWJsZSB9IGZyb20gXCIuLi8uLi91dGlsc1wiO1xuaW1wb3J0IHsgS3ViZXJuZXRlc01hbmlmZXN0IH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1la3NcIjtcbmltcG9ydCB7IE5ldXJvbk1vbml0b3JNYW5pZmVzdCB9IGZyb20gXCIuL25ldXJvbi1tb25pdG9yLWN1c3RvbWl6YXRpb25cIjtcblxuY29uc3QgUExVR0lOX1VSTCA9IFwiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2F3cy1uZXVyb24vYXdzLW5ldXJvbi1zZGsvbWFzdGVyL3NyYy9rOC9rOHMtbmV1cm9uLWRldmljZS1wbHVnaW4ueW1sXCI7XG5jb25zdCBSQkFDX1VSTCA9IFwiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2F3cy1uZXVyb24vYXdzLW5ldXJvbi1zZGsvbWFzdGVyL3NyYy9rOC9rOHMtbmV1cm9uLWRldmljZS1wbHVnaW4tcmJhYy55bWxcIjtcblxuZXhwb3J0IGNsYXNzIE5ldXJvbkRldmljZVBsdWdpbkFkZE9uIGltcGxlbWVudHMgQ2x1c3RlckFkZE9uIHtcbiAgICBkZXBsb3koY2x1c3RlckluZm86IENsdXN0ZXJJbmZvKTogUHJvbWlzZTxDb25zdHJ1Y3Q+IHtcbiAgICAgICAgY29uc3Qga3ViZWN0bFByb3ZpZGVyID0gbmV3IEt1YmVjdGxQcm92aWRlcihjbHVzdGVySW5mbyk7XG5cbiAgICAgICAgLy8gUmVhZCBpbiBZQU1MIGRvY3NcbiAgICAgICAgY29uc3QgcmJhYyA9IGxvYWRFeHRlcm5hbFlhbWwoUkJBQ19VUkwpO1xuICAgICAgICBjb25zdCByYmFjTWFuaWZlc3Q6IE1hbmlmZXN0RGVwbG95bWVudCA9IHtcbiAgICAgICAgICAgIG5hbWU6IFwibmV1cm9uLXJiYWMtbWFuaWZlc3RcIixcbiAgICAgICAgICAgIG5hbWVzcGFjZTogXCJcIixcbiAgICAgICAgICAgIG1hbmlmZXN0OiByYmFjLFxuICAgICAgICAgICAgdmFsdWVzOiB7fVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHBsdWdpbiA9IGxvYWRFeHRlcm5hbFlhbWwoUExVR0lOX1VSTCk7XG4gICAgICAgIGNvbnN0IHBsdWdpbk1hbmlmZXN0OiBNYW5pZmVzdERlcGxveW1lbnQgPSB7XG4gICAgICAgICAgICBuYW1lOiBcIm5ldXJvbi1wbHVnaW4tbWFuaWZlc3RcIixcbiAgICAgICAgICAgIG5hbWVzcGFjZTogXCJrdWJlLXN5c3RlbVwiLFxuICAgICAgICAgICAgbWFuaWZlc3Q6IHBsdWdpbixcbiAgICAgICAgICAgIHZhbHVlczoge31cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCByYmFjU3RhdGVtZW50ID0ga3ViZWN0bFByb3ZpZGVyLmFkZE1hbmlmZXN0KHJiYWNNYW5pZmVzdCk7XG4gICAgICAgIGNvbnN0IHBsdWdpblN0YXRlbWVudCA9IGt1YmVjdGxQcm92aWRlci5hZGRNYW5pZmVzdChwbHVnaW5NYW5pZmVzdCk7XG5cbiAgICAgICAgLy8gUGx1Z2luIGRlcGVuZGVuY3kgb24gdGhlIFJCQUMgbWFuaWZlc3RcbiAgICAgICAgcGx1Z2luU3RhdGVtZW50Lm5vZGUuYWRkRGVwZW5kZW5jeShyYmFjU3RhdGVtZW50KTtcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHBsdWdpblN0YXRlbWVudCk7XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIE5ldXJvbk1vbml0b3JBZGRPblByb3BzIHtcbiAgICAvKipcbiAgICAgKiBUaGUgdGFnIG9mIHRoZSBOZXVyb24gTW9uaXRvciBhcHBsaWNhdGlvbidzIERvY2tlciBpbWFnZS5cbiAgICAgKiBAZGVmYXVsdCAnbGF0ZXN0J1xuICAgICAqL1xuICAgIGltYWdlVGFnPzogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIE5ldXJvbiBBcHBsaWNhdGlvbidzIG5hbWVzcGFjZVxuICAgICAqIEBkZWZhdWx0ICdrdWJlLXN5c3RlbSdcbiAgICAgKi9cbiAgICBuYW1lc3BhY2U/OiBzdHJpbmc7XG4gICAgIC8qKlxuICAgICAqIEFwcGxpY2F0aW9uJ3MgcG9ydFxuICAgICAqIEBkZWZhdWx0IDkwMTBcbiAgICAgKi9cbiAgICAgcG9ydD86IG51bWJlcjtcbiAgICAgLyoqXG4gICAgICogVG8gQ3JlYXRlIE5hbWVzcGFjZSB1c2luZyBDREsuIFRoaXMgc2hvdWxkIGJlIGRvbmUgb25seSBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gICAgICovICAgIFxuICAgIGNyZWF0ZU5hbWVzcGFjZT86IGJvb2xlYW47XG59XG5cbmNvbnN0IGRlZmF1bHRQcm9wczogTmV1cm9uTW9uaXRvckFkZE9uUHJvcHMgPSB7XG4gICAgbmFtZXNwYWNlOiBcImt1YmUtc3lzdGVtXCIsXG4gICAgaW1hZ2VUYWc6IFwiMS4wLjBcIixcbiAgICBwb3J0OiA5MDEwXG59O1xuXG5cbmV4cG9ydCBjbGFzcyBOZXVyb25Nb25pdG9yQWRkT24gaW1wbGVtZW50cyBDbHVzdGVyQWRkT24ge1xuXG4gICAgcmVhZG9ubHkgb3B0aW9uczogTmV1cm9uTW9uaXRvckFkZE9uUHJvcHM7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcz86IE5ldXJvbk1vbml0b3JBZGRPblByb3BzKXtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gey4uLmRlZmF1bHRQcm9wcywgLi4ucHJvcHN9O1xuICAgIH1cblxuICAgIEBkZXBlbmRhYmxlKE5ldXJvbkRldmljZVBsdWdpbkFkZE9uLm5hbWUpXG4gICAgZGVwbG95KGNsdXN0ZXJJbmZvOiBDbHVzdGVySW5mbyk6IFByb21pc2U8Q29uc3RydWN0PntcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBjbHVzdGVySW5mby5jbHVzdGVyO1xuXG4gICAgICAgIGNvbnN0IG1hbmlmZXN0ID0gbmV3IE5ldXJvbk1vbml0b3JNYW5pZmVzdCgpLmdlbmVyYXRlKHRoaXMub3B0aW9ucy5uYW1lc3BhY2UhLCB0aGlzLm9wdGlvbnMuaW1hZ2VUYWchLCB0aGlzLm9wdGlvbnMucG9ydCEpO1xuXG4gICAgICAgIGNvbnN0IG5ldXJvbk1vbml0b3JNYW5pZmVzdCA9IG5ldyBLdWJlcm5ldGVzTWFuaWZlc3QoY2x1c3Rlci5zdGFjaywgXCJuZXVyb24tbW9uaXRvci1tYW5pZmVzdFwiLCB7XG4gICAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICAgICAgbWFuaWZlc3Q6IG1hbmlmZXN0LFxuICAgICAgICAgICAgb3ZlcndyaXRlOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmKHRoaXMub3B0aW9ucy5jcmVhdGVOYW1lc3BhY2UgPT09IHRydWUpe1xuICAgICAgICAgICAgLy8gTGV0IENESyBDcmVhdGUgdGhlIE5hbWVzcGFjZVxuICAgICAgICAgICAgY29uc3QgbmFtZXNwYWNlID0gY3JlYXRlTmFtZXNwYWNlKHRoaXMub3B0aW9ucy5uYW1lc3BhY2UhICwgY2x1c3Rlcik7XG4gICAgICAgICAgICBuZXVyb25Nb25pdG9yTWFuaWZlc3Qubm9kZS5hZGREZXBlbmRlbmN5KG5hbWVzcGFjZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV1cm9uTW9uaXRvck1hbmlmZXN0KTtcblxuICAgIH1cbn1cbiJdfQ==