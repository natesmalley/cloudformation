"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XrayAdotAddOn = void 0;
const utils_1 = require("../../utils");
const adot_1 = require("../adot");
const kubectl_provider_1 = require("../helm-addon/kubectl-provider");
/**
 * Defaults options for the add-on
 */
const defaultProps = {
    deploymentMode: "deployment" /* xrayDeploymentMode.DEPLOYMENT */,
    name: 'adot-collector-xray',
    namespace: 'default'
};
/**
 * Implementation of XRAY ADOT add-on for EKS Blueprints. Installs ADOT Collector.
 */
let XrayAdotAddOn = class XrayAdotAddOn {
    constructor(props) {
        this.xrayAddOnProps = { ...defaultProps, ...props };
    }
    deploy(clusterInfo) {
        const cluster = clusterInfo.cluster;
        let doc;
        // Applying manifest for configuring ADOT Collector for Xray.
        doc = (0, utils_1.readYamlDocument)(__dirname + '/collector-config-xray.ytpl');
        const manifest = doc.split("---").map(e => (0, utils_1.loadYaml)(e));
        const values = {
            awsRegion: cluster.stack.region,
            deploymentMode: this.xrayAddOnProps.deploymentMode,
            namespace: this.xrayAddOnProps.namespace
        };
        const manifestDeployment = {
            name: this.xrayAddOnProps.name,
            namespace: this.xrayAddOnProps.namespace,
            manifest,
            values
        };
        const kubectlProvider = new kubectl_provider_1.KubectlProvider(clusterInfo);
        const statement = kubectlProvider.addManifest(manifestDeployment);
        return Promise.resolve(statement);
    }
};
exports.XrayAdotAddOn = XrayAdotAddOn;
__decorate([
    (0, utils_1.dependable)(adot_1.AdotCollectorAddOn.name)
], XrayAdotAddOn.prototype, "deploy", null);
exports.XrayAdotAddOn = XrayAdotAddOn = __decorate([
    utils_1.supportsALL
], XrayAdotAddOn);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL3hyYXktYWRvdC1hZGRvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQSx1Q0FBa0Y7QUFDbEYsa0NBQTZDO0FBRTdDLHFFQUFxRjtBQW9DckY7O0dBRUc7QUFDSCxNQUFNLFlBQVksR0FBRztJQUNqQixjQUFjLGtEQUErQjtJQUM3QyxJQUFJLEVBQUUscUJBQXFCO0lBQzNCLFNBQVMsRUFBRSxTQUFTO0NBQ3ZCLENBQUM7QUFFRjs7R0FFRztBQUVJLElBQU0sYUFBYSxHQUFuQixNQUFNLGFBQWE7SUFHdEIsWUFBWSxLQUEwQjtRQUNsQyxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsR0FBRyxZQUFZLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQztJQUN4RCxDQUFDO0lBR0QsTUFBTSxDQUFDLFdBQXdCO1FBQzNCLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUM7UUFDcEMsSUFBSSxHQUFXLENBQUM7UUFFaEIsNkRBQTZEO1FBQzdELEdBQUcsR0FBRyxJQUFBLHdCQUFnQixFQUFDLFNBQVMsR0FBRSw2QkFBNkIsQ0FBQyxDQUFDO1FBRWpFLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBQSxnQkFBUSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEQsTUFBTSxNQUFNLEdBQVc7WUFDbkIsU0FBUyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTTtZQUMvQixjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjO1lBQ2xELFNBQVMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVM7U0FDMUMsQ0FBQztRQUVGLE1BQU0sa0JBQWtCLEdBQXVCO1lBQzVDLElBQUksRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUs7WUFDL0IsU0FBUyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBVTtZQUN6QyxRQUFRO1lBQ1IsTUFBTTtTQUNULENBQUM7UUFFRixNQUFNLGVBQWUsR0FBRyxJQUFJLGtDQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDekQsTUFBTSxTQUFTLEdBQUcsZUFBZSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2xFLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN0QyxDQUFDO0NBQ0osQ0FBQTtBQWpDWSxzQ0FBYTtBQVF0QjtJQURDLElBQUEsa0JBQVUsRUFBQyx5QkFBa0IsQ0FBQyxJQUFJLENBQUM7MkNBeUJuQzt3QkFoQ1EsYUFBYTtJQUR6QixtQkFBVztHQUNDLGFBQWEsQ0FpQ3pCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2x1c3RlckFkZE9uLCBDbHVzdGVySW5mbywgVmFsdWVzIH0gZnJvbSBcIi4uLy4uL3NwaVwiO1xuaW1wb3J0IHsgZGVwZW5kYWJsZSwgbG9hZFlhbWwsIHJlYWRZYW1sRG9jdW1lbnQsIHN1cHBvcnRzQUxMIH0gZnJvbSBcIi4uLy4uL3V0aWxzXCI7XG5pbXBvcnQgeyBBZG90Q29sbGVjdG9yQWRkT24gfSBmcm9tIFwiLi4vYWRvdFwiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBLdWJlY3RsUHJvdmlkZXIsIE1hbmlmZXN0RGVwbG95bWVudCB9IGZyb20gXCIuLi9oZWxtLWFkZG9uL2t1YmVjdGwtcHJvdmlkZXJcIjtcblxuLyoqXG4gKiBUaGlzIFhSQVkgQURPVCBhZGQtb24gZGVwbG95cyBhbiBBV1MgRGlzdHJvIGZvciBPcGVuVGVsZW1ldHJ5IChBRE9UKSBDb2xsZWN0b3IgZm9yIFgtUmF5IHdoaWNoIHJlY2VpdmVzIHRyYWNlcyBmcm9tIHRoZSBcbiAqIGFwcGxpY2F0aW9uIGFuZCBzZW5kcyB0aGUgc2FtZSB0byBYLVJheSBjb25zb2xlLiBZb3UgY2FuIGNoYW5nZSB0aGUgbW9kZSB0byBEYWVtb25zZXQsIFN0YXRlZnVsU2V0LCBcbiAqIGFuZCBTaWRlY2FyIGRlcGVuZGluZyBvbiB5b3VyIGRlcGxveW1lbnQgc3RyYXRlZ3kuXG4gKi9cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIG9wdGlvbnMgZm9yIGFkZC1vbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBYcmF5QWRvdEFkZE9uUHJvcHMge1xuICAgIC8qKlxuICAgICAqIE1vZGVzIHN1cHBvcnRlZCA6IGBkZXBsb3ltZW50YCwgYGRhZW1vbnNldGAsIGBzdGF0ZWZ1bFNldGAsIGFuZCBgc2lkZWNhcmBcbiAgICAgKiBAZGVmYXVsdCBkZXBsb3ltZW50XG4gICAgICovXG4gICAgZGVwbG95bWVudE1vZGU/OiB4cmF5RGVwbG95bWVudE1vZGU7XG4gICAgLyoqXG4gICAgICogTmFtZXNwYWNlIHRvIGRlcGxveSB0aGUgQURPVCBDb2xsZWN0b3IgZm9yIFhSYXkuXG4gICAgICogQGRlZmF1bHQgZGVmYXVsdFxuICAgICAqL1xuICAgIG5hbWVzcGFjZT86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBOYW1lIGZvciBkZXBsb3ltZW50IG9mIHRoZSBBRE9UIENvbGxlY3RvciBmb3IgWFJheS5cbiAgICAgKiBAZGVmYXVsdCAnYWRvdC1jb2xsZWN0b3IteHJheSdcbiAgICAgKi9cbiAgICBuYW1lPzogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgZW51bSB4cmF5RGVwbG95bWVudE1vZGUge1xuICAgIERFUExPWU1FTlQgPSAnZGVwbG95bWVudCcsXG4gICAgREFFTU9OU0VUID0gJ2RhZW1vbnNldCcsXG4gICAgU1RBVEVGVUxTRVQgPSAnc3RhdGVmdWxzZXQnLFxuICAgIFNJREVDQVIgPSAnc2lkZWNhcidcbn1cblxuLyoqXG4gKiBEZWZhdWx0cyBvcHRpb25zIGZvciB0aGUgYWRkLW9uXG4gKi9cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICBkZXBsb3ltZW50TW9kZTogeHJheURlcGxveW1lbnRNb2RlLkRFUExPWU1FTlQsXG4gICAgbmFtZTogJ2Fkb3QtY29sbGVjdG9yLXhyYXknLFxuICAgIG5hbWVzcGFjZTogJ2RlZmF1bHQnXG59O1xuXG4vKipcbiAqIEltcGxlbWVudGF0aW9uIG9mIFhSQVkgQURPVCBhZGQtb24gZm9yIEVLUyBCbHVlcHJpbnRzLiBJbnN0YWxscyBBRE9UIENvbGxlY3Rvci5cbiAqL1xuQHN1cHBvcnRzQUxMXG5leHBvcnQgY2xhc3MgWHJheUFkb3RBZGRPbiBpbXBsZW1lbnRzIENsdXN0ZXJBZGRPbiB7XG5cbiAgICByZWFkb25seSB4cmF5QWRkT25Qcm9wczogWHJheUFkb3RBZGRPblByb3BzO1xuICAgIGNvbnN0cnVjdG9yKHByb3BzPzogWHJheUFkb3RBZGRPblByb3BzKSB7XG4gICAgICAgIHRoaXMueHJheUFkZE9uUHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcywgLi4ucHJvcHMgfTtcbiAgICB9XG5cbiAgICBAZGVwZW5kYWJsZShBZG90Q29sbGVjdG9yQWRkT24ubmFtZSlcbiAgICBkZXBsb3koY2x1c3RlckluZm86IENsdXN0ZXJJbmZvKTogUHJvbWlzZTxDb25zdHJ1Y3Q+IHtcbiAgICAgICAgY29uc3QgY2x1c3RlciA9IGNsdXN0ZXJJbmZvLmNsdXN0ZXI7XG4gICAgICAgIGxldCBkb2M6IHN0cmluZztcblxuICAgICAgICAvLyBBcHBseWluZyBtYW5pZmVzdCBmb3IgY29uZmlndXJpbmcgQURPVCBDb2xsZWN0b3IgZm9yIFhyYXkuXG4gICAgICAgIGRvYyA9IHJlYWRZYW1sRG9jdW1lbnQoX19kaXJuYW1lICsnL2NvbGxlY3Rvci1jb25maWcteHJheS55dHBsJyk7XG5cbiAgICAgICAgY29uc3QgbWFuaWZlc3QgPSBkb2Muc3BsaXQoXCItLS1cIikubWFwKGUgPT4gbG9hZFlhbWwoZSkpO1xuICAgICAgICBjb25zdCB2YWx1ZXM6IFZhbHVlcyA9IHtcbiAgICAgICAgICAgIGF3c1JlZ2lvbjogY2x1c3Rlci5zdGFjay5yZWdpb24sXG4gICAgICAgICAgICBkZXBsb3ltZW50TW9kZTogdGhpcy54cmF5QWRkT25Qcm9wcy5kZXBsb3ltZW50TW9kZSxcbiAgICAgICAgICAgIG5hbWVzcGFjZTogdGhpcy54cmF5QWRkT25Qcm9wcy5uYW1lc3BhY2VcbiAgICAgICAgIH07XG4gICAgICAgICBcbiAgICAgICAgIGNvbnN0IG1hbmlmZXN0RGVwbG95bWVudDogTWFuaWZlc3REZXBsb3ltZW50ID0ge1xuICAgICAgICAgICAgbmFtZTogdGhpcy54cmF5QWRkT25Qcm9wcy5uYW1lISxcbiAgICAgICAgICAgIG5hbWVzcGFjZTogdGhpcy54cmF5QWRkT25Qcm9wcy5uYW1lc3BhY2UhLFxuICAgICAgICAgICAgbWFuaWZlc3QsXG4gICAgICAgICAgICB2YWx1ZXNcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBrdWJlY3RsUHJvdmlkZXIgPSBuZXcgS3ViZWN0bFByb3ZpZGVyKGNsdXN0ZXJJbmZvKTtcbiAgICAgICAgY29uc3Qgc3RhdGVtZW50ID0ga3ViZWN0bFByb3ZpZGVyLmFkZE1hbmlmZXN0KG1hbmlmZXN0RGVwbG95bWVudCk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoc3RhdGVtZW50KTtcbiAgICB9XG59Il19