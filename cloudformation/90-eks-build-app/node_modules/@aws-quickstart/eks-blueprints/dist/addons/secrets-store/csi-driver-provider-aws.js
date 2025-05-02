"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsiDriverProviderAws = void 0;
const cdk = require("aws-cdk-lib");
const yaml_utils_1 = require("../../utils/yaml-utils");
const ts_deepmerge_1 = require("ts-deepmerge");
const helm_addon_1 = require("../helm-addon");
class CsiDriverProviderAws {
    constructor(props) {
        this.props = props;
    }
    deploy(clusterInfo) {
        var _a;
        const cluster = clusterInfo.cluster;
        let values = {
            grpcSupportedProviders: 'aws'
        };
        if (typeof (this.props.rotationPollInterval) === 'string') {
            values.enableSecretRotation = 'true';
            values.rotationPollInterval = this.props.rotationPollInterval;
        }
        if (this.props.syncSecrets === true) {
            values.syncSecret = {
                enabled: 'true'
            };
        }
        values = (0, ts_deepmerge_1.merge)(values, (_a = this.props.values) !== null && _a !== void 0 ? _a : {});
        const helmChartOptions = {
            chart: this.props.chart,
            repository: this.props.repository,
            namespace: this.props.namespace,
            release: this.props.release,
            version: this.props.version,
            wait: true,
            timeout: cdk.Duration.minutes(15),
            values,
        };
        helm_addon_1.HelmAddOn.validateVersion({
            chart: helmChartOptions.chart,
            repository: helmChartOptions.repository,
            version: helmChartOptions.version
        });
        const secretStoreCSIDriverHelmChart = cluster.addHelmChart('SecretsStoreCSIDriver', helmChartOptions);
        const manifestUrl = this.props.ascpUrl;
        const manifest = (0, yaml_utils_1.loadExternalYaml)(manifestUrl);
        const secretProviderManifest = clusterInfo.cluster.addManifest('SecretsStoreCsiDriverProviderAws', ...manifest);
        secretProviderManifest.node.addDependency(secretStoreCSIDriverHelmChart);
        return secretProviderManifest;
    }
}
exports.CsiDriverProviderAws = CsiDriverProviderAws;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NpLWRyaXZlci1wcm92aWRlci1hd3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL3NlY3JldHMtc3RvcmUvY3NpLWRyaXZlci1wcm92aWRlci1hd3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBRW5DLHVEQUEwRDtBQUcxRCwrQ0FBcUM7QUFDckMsOENBQTBDO0FBRzFDLE1BQWEsb0JBQW9CO0lBRS9CLFlBQW9CLEtBQTZCO1FBQTdCLFVBQUssR0FBTCxLQUFLLENBQXdCO0lBQUcsQ0FBQztJQUVyRCxNQUFNLENBQUMsV0FBd0I7O1FBQzdCLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUM7UUFFcEMsSUFBSSxNQUFNLEdBQVc7WUFDbkIsc0JBQXNCLEVBQUUsS0FBSztTQUM5QixDQUFDO1FBRUYsSUFBSSxPQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQ3pELE1BQU0sQ0FBQyxvQkFBb0IsR0FBRyxNQUFNLENBQUM7WUFDckMsTUFBTSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUM7UUFDaEUsQ0FBQztRQUVELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDcEMsTUFBTSxDQUFDLFVBQVUsR0FBRztnQkFDbEIsT0FBTyxFQUFFLE1BQU07YUFDaEIsQ0FBQztRQUNKLENBQUM7UUFFRCxNQUFNLEdBQUcsSUFBQSxvQkFBSyxFQUFDLE1BQU0sRUFBRSxNQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxtQ0FBSSxFQUFFLENBQUMsQ0FBQztRQUVoRCxNQUFNLGdCQUFnQixHQUFHO1lBQ3JCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQU07WUFDeEIsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVztZQUNsQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFVO1lBQ2hDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU87WUFDM0IsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTztZQUMzQixJQUFJLEVBQUUsSUFBSTtZQUNWLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDakMsTUFBTTtTQUNQLENBQUM7UUFFSixzQkFBUyxDQUFDLGVBQWUsQ0FBQztZQUN0QixLQUFLLEVBQUUsZ0JBQWdCLENBQUMsS0FBSztZQUM3QixVQUFVLEVBQUUsZ0JBQWdCLENBQUMsVUFBVTtZQUN2QyxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsT0FBUTtTQUNyQyxDQUFDLENBQUM7UUFFSCxNQUFNLDZCQUE2QixHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsdUJBQXVCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUV0RyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVEsQ0FBQztRQUN4QyxNQUFNLFFBQVEsR0FBMEIsSUFBQSw2QkFBZ0IsRUFBQyxXQUFXLENBQUMsQ0FBQztRQUN0RSxNQUFNLHNCQUFzQixHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUM7UUFDaEgsc0JBQXNCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQ3pFLE9BQU8sc0JBQXNCLENBQUM7SUFDaEMsQ0FBQztDQUNGO0FBakRELG9EQWlEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCB7IENsdXN0ZXJJbmZvLCBWYWx1ZXMgfSBmcm9tIFwiLi4vLi4vc3BpXCI7XG5pbXBvcnQgeyBsb2FkRXh0ZXJuYWxZYW1sIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3lhbWwtdXRpbHNcIjtcbmltcG9ydCB7IEt1YmVybmV0ZXNNYW5pZmVzdCB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZWtzXCI7XG5pbXBvcnQgeyBTZWNyZXRzU3RvcmVBZGRPblByb3BzIH0gZnJvbSBcIi5cIjtcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSBcInRzLWRlZXBtZXJnZVwiO1xuaW1wb3J0IHsgSGVsbUFkZE9uIH0gZnJvbSBcIi4uL2hlbG0tYWRkb25cIjtcblxuXG5leHBvcnQgY2xhc3MgQ3NpRHJpdmVyUHJvdmlkZXJBd3Mge1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJvcHM6IFNlY3JldHNTdG9yZUFkZE9uUHJvcHMpIHt9XG5cbiAgZGVwbG95KGNsdXN0ZXJJbmZvOiBDbHVzdGVySW5mbyk6IEt1YmVybmV0ZXNNYW5pZmVzdCB7XG4gICAgY29uc3QgY2x1c3RlciA9IGNsdXN0ZXJJbmZvLmNsdXN0ZXI7XG5cbiAgICBsZXQgdmFsdWVzOiBWYWx1ZXMgPSB7XG4gICAgICBncnBjU3VwcG9ydGVkUHJvdmlkZXJzOiAnYXdzJ1xuICAgIH07XG5cbiAgICBpZiAodHlwZW9mKHRoaXMucHJvcHMucm90YXRpb25Qb2xsSW50ZXJ2YWwpID09PSAnc3RyaW5nJykge1xuICAgICAgdmFsdWVzLmVuYWJsZVNlY3JldFJvdGF0aW9uID0gJ3RydWUnO1xuICAgICAgdmFsdWVzLnJvdGF0aW9uUG9sbEludGVydmFsID0gdGhpcy5wcm9wcy5yb3RhdGlvblBvbGxJbnRlcnZhbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5zeW5jU2VjcmV0cyA9PT0gdHJ1ZSkge1xuICAgICAgdmFsdWVzLnN5bmNTZWNyZXQgPSB7XG4gICAgICAgIGVuYWJsZWQ6ICd0cnVlJ1xuICAgICAgfTtcbiAgICB9XG5cbiAgICB2YWx1ZXMgPSBtZXJnZSh2YWx1ZXMsIHRoaXMucHJvcHMudmFsdWVzID8/IHt9KTtcbiAgICBcbiAgICBjb25zdCBoZWxtQ2hhcnRPcHRpb25zID0ge1xuICAgICAgICBjaGFydDogdGhpcy5wcm9wcy5jaGFydCEsXG4gICAgICAgIHJlcG9zaXRvcnk6IHRoaXMucHJvcHMucmVwb3NpdG9yeSEsXG4gICAgICAgIG5hbWVzcGFjZTogdGhpcy5wcm9wcy5uYW1lc3BhY2UhLFxuICAgICAgICByZWxlYXNlOiB0aGlzLnByb3BzLnJlbGVhc2UsXG4gICAgICAgIHZlcnNpb246IHRoaXMucHJvcHMudmVyc2lvbixcbiAgICAgICAgd2FpdDogdHJ1ZSxcbiAgICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMTUpLFxuICAgICAgICB2YWx1ZXMsXG4gICAgICB9O1xuXG4gICAgSGVsbUFkZE9uLnZhbGlkYXRlVmVyc2lvbih7XG4gICAgICAgIGNoYXJ0OiBoZWxtQ2hhcnRPcHRpb25zLmNoYXJ0LFxuICAgICAgICByZXBvc2l0b3J5OiBoZWxtQ2hhcnRPcHRpb25zLnJlcG9zaXRvcnksXG4gICAgICAgIHZlcnNpb246IGhlbG1DaGFydE9wdGlvbnMudmVyc2lvbiFcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlY3JldFN0b3JlQ1NJRHJpdmVySGVsbUNoYXJ0ID0gY2x1c3Rlci5hZGRIZWxtQ2hhcnQoJ1NlY3JldHNTdG9yZUNTSURyaXZlcicsIGhlbG1DaGFydE9wdGlvbnMpO1xuXG4gICAgY29uc3QgbWFuaWZlc3RVcmwgPSB0aGlzLnByb3BzLmFzY3BVcmwhO1xuICAgIGNvbnN0IG1hbmlmZXN0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10gPSBsb2FkRXh0ZXJuYWxZYW1sKG1hbmlmZXN0VXJsKTtcbiAgICBjb25zdCBzZWNyZXRQcm92aWRlck1hbmlmZXN0ID0gY2x1c3RlckluZm8uY2x1c3Rlci5hZGRNYW5pZmVzdCgnU2VjcmV0c1N0b3JlQ3NpRHJpdmVyUHJvdmlkZXJBd3MnLCAuLi5tYW5pZmVzdCk7XG4gICAgc2VjcmV0UHJvdmlkZXJNYW5pZmVzdC5ub2RlLmFkZERlcGVuZGVuY3koc2VjcmV0U3RvcmVDU0lEcml2ZXJIZWxtQ2hhcnQpO1xuICAgIHJldHVybiBzZWNyZXRQcm92aWRlck1hbmlmZXN0O1xuICB9XG59Il19