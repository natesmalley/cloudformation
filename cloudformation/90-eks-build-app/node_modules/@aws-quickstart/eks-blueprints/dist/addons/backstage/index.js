"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackstageAddOn = void 0;
const helm_addon_1 = require("../helm-addon");
const utils_1 = require("../../utils");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const HTTPS = "https://";
/**
 * Default props to be used when creating the Helm chart
 */
const defaultProps = {
    name: "blueprints-backstage-addon",
    namespace: "backstage",
    chart: "backstage",
    version: "0.17.0",
    release: "backstage",
    repository: "https://backstage.github.io/charts",
    imageTag: "latest",
    values: {}
};
/**
 * Main class to instantiate the Helm chart
 */
let BackstageAddOn = class BackstageAddOn extends helm_addon_1.HelmAddOn {
    constructor(props) {
        super({ ...defaultProps, ...props });
        this.options = this.props;
    }
    deploy(clusterInfo) {
        let values = this.populateValues(clusterInfo, this.options);
        const chart = this.addHelmChart(clusterInfo, values);
        new aws_cdk_lib_1.CfnOutput(clusterInfo.cluster.stack, 'Backstage base URL', {
            value: HTTPS + this.options.subdomain,
            description: "Backstage base URL",
            exportName: "BackstageBaseUrl",
        });
        return Promise.resolve(chart);
    }
    /**
    * populateValues populates the appropriate values used to customize the Helm chart
    * @param helmOptions User provided values to customize the chart
    */
    populateValues(clusterInfo, helmOptions) {
        var _a, _b;
        const values = (_a = helmOptions.values) !== null && _a !== void 0 ? _a : {};
        const annotations = {
            "alb.ingress.kubernetes.io/scheme": "internet-facing",
            "alb.ingress.kubernetes.io/target-type": "ip",
            "alb.ingress.kubernetes.io/certificate-arn": (_b = clusterInfo.getResource(helmOptions.certificateResourceName)) === null || _b === void 0 ? void 0 : _b.certificateArn
        };
        const databaseInstance = clusterInfo.getRequiredResource(helmOptions.databaseResourceName);
        if (databaseInstance === undefined) {
            throw new Error("Database instance not found");
        }
        const databaseChartValues = {
            "client": "pg",
            "connection": {
                "host": databaseInstance.dbInstanceEndpointAddress,
                "port": databaseInstance.dbInstanceEndpointPort,
                "user": "${POSTGRES_USER}",
                "password": "${POSTGRES_PASSWORD}"
            }
        };
        (0, utils_1.setPath)(values, "ingress.enabled", true);
        (0, utils_1.setPath)(values, "ingress.className", "alb");
        (0, utils_1.setPath)(values, "ingress.host", helmOptions.subdomain);
        (0, utils_1.setPath)(values, "ingress.annotations", annotations);
        (0, utils_1.setPath)(values, "backstage.image.registry", helmOptions.imageRegistry);
        (0, utils_1.setPath)(values, "backstage.image.repository", helmOptions.imageRepository);
        (0, utils_1.setPath)(values, "backstage.image.tag", helmOptions.imageTag);
        (0, utils_1.setPath)(values, "backstage.appConfig.app.baseUrl", HTTPS + helmOptions.subdomain);
        (0, utils_1.setPath)(values, "backstage.appConfig.backend.baseUrl", HTTPS + helmOptions.subdomain);
        (0, utils_1.setPath)(values, "backstage.appConfig.backend.database", databaseChartValues);
        (0, utils_1.setPath)(values, "backstage.extraEnvVarsSecrets", [helmOptions.databaseSecretTargetName]);
        (0, utils_1.setPath)(values, "backstage.command", ["node", "packages/backend", "--config", "app-config.yaml"]);
        return values;
    }
};
exports.BackstageAddOn = BackstageAddOn;
__decorate([
    (0, utils_1.dependable)('AwsLoadBalancerControllerAddOn', 'ExternalsSecretsAddOn')
], BackstageAddOn.prototype, "deploy", null);
exports.BackstageAddOn = BackstageAddOn = __decorate([
    utils_1.supportsX86
], BackstageAddOn);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL2JhY2tzdGFnZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQSw4Q0FBOEQ7QUFDOUQsdUNBQStEO0FBSS9ELDZDQUF3QztBQUV4QyxNQUFNLEtBQUssR0FBRyxVQUFVLENBQUM7QUE0Q3pCOztHQUVHO0FBQ0gsTUFBTSxZQUFZLEdBQUc7SUFDbkIsSUFBSSxFQUFFLDRCQUE0QjtJQUNsQyxTQUFTLEVBQUUsV0FBVztJQUN0QixLQUFLLEVBQUUsV0FBVztJQUNsQixPQUFPLEVBQUUsUUFBUTtJQUNqQixPQUFPLEVBQUUsV0FBVztJQUNwQixVQUFVLEVBQUcsb0NBQW9DO0lBQ2pELFFBQVEsRUFBRSxRQUFRO0lBQ2xCLE1BQU0sRUFBRSxFQUFFO0NBQ1gsQ0FBQztBQUVGOztHQUVHO0FBRUksSUFBTSxjQUFjLEdBQXBCLE1BQU0sY0FBZSxTQUFRLHNCQUFTO0lBSTNDLFlBQVksS0FBMkI7UUFDckMsS0FBSyxDQUFDLEVBQUMsR0FBRyxZQUFZLEVBQUUsR0FBRyxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQTRCLENBQUM7SUFDbkQsQ0FBQztJQUdELE1BQU0sQ0FBQyxXQUF3QjtRQUM3QixJQUFJLE1BQU0sR0FBVyxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFckQsSUFBSSx1QkFBUyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLG9CQUFvQixFQUFFO1lBQzdELEtBQUssRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTO1lBQ3JDLFdBQVcsRUFBRSxvQkFBb0I7WUFDakMsVUFBVSxFQUFFLGtCQUFrQjtTQUMvQixDQUFDLENBQUM7UUFFSCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVEOzs7TUFHRTtJQUNGLGNBQWMsQ0FBQyxXQUF3QixFQUFFLFdBQWdDOztRQUN2RSxNQUFNLE1BQU0sR0FBRyxNQUFBLFdBQVcsQ0FBQyxNQUFNLG1DQUFJLEVBQUUsQ0FBQztRQUV4QyxNQUFNLFdBQVcsR0FBRztZQUNsQixrQ0FBa0MsRUFBRSxpQkFBaUI7WUFDckQsdUNBQXVDLEVBQUUsSUFBSTtZQUM3QywyQ0FBMkMsRUFBRSxNQUFBLFdBQVcsQ0FBQyxXQUFXLENBQWUsV0FBVyxDQUFDLHVCQUF1QixDQUFDLDBDQUFFLGNBQWM7U0FDeEksQ0FBQztRQUVGLE1BQU0sZ0JBQWdCLEdBQTJCLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNuSCxJQUFJLGdCQUFnQixLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUNuRCxDQUFDO1FBRUQsTUFBTSxtQkFBbUIsR0FBRztZQUMxQixRQUFRLEVBQUUsSUFBSTtZQUNkLFlBQVksRUFBRTtnQkFDWixNQUFNLEVBQUUsZ0JBQWdCLENBQUMseUJBQXlCO2dCQUNsRCxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsc0JBQXNCO2dCQUMvQyxNQUFNLEVBQUUsa0JBQWtCO2dCQUMxQixVQUFVLEVBQUUsc0JBQXNCO2FBQ25DO1NBQ0YsQ0FBQztRQUVGLElBQUEsZUFBTyxFQUFDLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6QyxJQUFBLGVBQU8sRUFBQyxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUMsSUFBQSxlQUFPLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkQsSUFBQSxlQUFPLEVBQUMsTUFBTSxFQUFFLHFCQUFxQixFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXBELElBQUEsZUFBTyxFQUFDLE1BQU0sRUFBRSwwQkFBMEIsRUFBRSxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdkUsSUFBQSxlQUFPLEVBQUMsTUFBTSxFQUFFLDRCQUE0QixFQUFFLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMzRSxJQUFBLGVBQU8sRUFBQyxNQUFNLEVBQUUscUJBQXFCLEVBQUUsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTdELElBQUEsZUFBTyxFQUFDLE1BQU0sRUFBRSxpQ0FBaUMsRUFBRSxLQUFLLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xGLElBQUEsZUFBTyxFQUFDLE1BQU0sRUFBRSxxQ0FBcUMsRUFBRSxLQUFLLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RGLElBQUEsZUFBTyxFQUFDLE1BQU0sRUFBRSxzQ0FBc0MsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBRTdFLElBQUEsZUFBTyxFQUFDLE1BQU0sRUFBRSwrQkFBK0IsRUFBRSxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7UUFFekYsSUFBQSxlQUFPLEVBQUMsTUFBTSxFQUFFLG1CQUFtQixFQUFFLENBQUMsTUFBTSxFQUFFLGtCQUFrQixFQUFFLFVBQVUsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFFbEcsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztDQUNGLENBQUE7QUF0RVksd0NBQWM7QUFVekI7SUFEQyxJQUFBLGtCQUFVLEVBQUMsZ0NBQWdDLEVBQUMsdUJBQXVCLENBQUM7NENBWXBFO3lCQXJCVSxjQUFjO0lBRDFCLG1CQUFXO0dBQ0MsY0FBYyxDQXNFMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0IHsgSGVsbUFkZE9uLCBIZWxtQWRkT25Vc2VyUHJvcHMgfSBmcm9tIFwiLi4vaGVsbS1hZGRvblwiO1xuaW1wb3J0IHsgZGVwZW5kYWJsZSwgc2V0UGF0aCwgc3VwcG9ydHNYODYgfSBmcm9tIFwiLi4vLi4vdXRpbHNcIjtcbmltcG9ydCB7IENsdXN0ZXJJbmZvLCBWYWx1ZXMgfSBmcm9tIFwiLi4vLi4vc3BpXCI7XG5pbXBvcnQgeyBJQ2VydGlmaWNhdGUgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWNlcnRpZmljYXRlbWFuYWdlclwiO1xuaW1wb3J0ICogYXMgcmRzIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtcmRzXCI7XG5pbXBvcnQgeyBDZm5PdXRwdXQgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5cbmNvbnN0IEhUVFBTID0gXCJodHRwczovL1wiO1xuXG4vKipcbiAqIFVzZXIgcHJvdmlkZWQgb3B0aW9ucyBmb3IgdGhlIEhlbG0gQ2hhcnRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCYWNrc3RhZ2VBZGRPblByb3BzIGV4dGVuZHMgSGVsbUFkZE9uVXNlclByb3BzIHtcbiAgICAvKipcbiAgICAgKiBUaGUgc3ViZG9tYWluIHRoYXQgd2lsbCBiZSBhc3NpZ25lZCB0byB0aGUgQmFja3N0YWdlIGFwcGxpY2F0aW9uLlxuICAgICAqL1xuICAgIHN1YmRvbWFpbjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJlc291cmNlIG5hbWUgb2YgdGhlIGNlcnRpZmljYXRlIHRvIGJlIGFzc2lnbmVkIHRvIHRoZSBMb2FkIEJhbGFuY2VyLlxuICAgICAqL1xuICAgIGNlcnRpZmljYXRlUmVzb3VyY2VOYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcmVnaXN0cnkgVVJMIG9mIHRoZSBCYWNrc3RhZ2UgYXBwbGljYXRpb24ncyBEb2NrZXIgaW1hZ2UuXG4gICAgICovXG4gICAgaW1hZ2VSZWdpc3RyeTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJlcG9zaXRvcnkgbmFtZSBpbiB0aGUgXCJpbWFnZVJlZ2lzdHJ5XCIuXG4gICAgICovXG4gICAgaW1hZ2VSZXBvc2l0b3J5OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdGFnIG9mIHRoZSBCYWNrc3RhZ2UgYXBwbGljYXRpb24ncyBEb2NrZXIgaW1hZ2UuXG4gICAgICogQGRlZmF1bHQgJ2xhdGVzdCdcbiAgICAgKi9cbiAgICBpbWFnZVRhZz86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSByZXNvdXJjZSBuYW1lIG9mIHRoZSBkYXRhYmFzZS5cbiAgICAgKi9cbiAgICBkYXRhYmFzZVJlc291cmNlTmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIEt1YmVybmV0ZXMgU2VjcmV0IHdoaWNoIHdpbGwgYmUgY3JlYXRlZCBieSB0aGUgYWRkLW9uIGFuZFxuICAgICAqIGluamVjdGVkIHdpdGggdGhlIGRhdGFiYXNlIGNyZWRlbnRpYWxzLlxuICAgICAqL1xuICAgIGRhdGFiYXNlU2VjcmV0VGFyZ2V0TmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIERlZmF1bHQgcHJvcHMgdG8gYmUgdXNlZCB3aGVuIGNyZWF0aW5nIHRoZSBIZWxtIGNoYXJ0XG4gKi9cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgbmFtZTogXCJibHVlcHJpbnRzLWJhY2tzdGFnZS1hZGRvblwiLFxuICBuYW1lc3BhY2U6IFwiYmFja3N0YWdlXCIsXG4gIGNoYXJ0OiBcImJhY2tzdGFnZVwiLFxuICB2ZXJzaW9uOiBcIjAuMTcuMFwiLFxuICByZWxlYXNlOiBcImJhY2tzdGFnZVwiLFxuICByZXBvc2l0b3J5OiAgXCJodHRwczovL2JhY2tzdGFnZS5naXRodWIuaW8vY2hhcnRzXCIsXG4gIGltYWdlVGFnOiBcImxhdGVzdFwiLFxuICB2YWx1ZXM6IHt9XG59O1xuXG4vKipcbiAqIE1haW4gY2xhc3MgdG8gaW5zdGFudGlhdGUgdGhlIEhlbG0gY2hhcnRcbiAqL1xuQHN1cHBvcnRzWDg2XG5leHBvcnQgY2xhc3MgQmFja3N0YWdlQWRkT24gZXh0ZW5kcyBIZWxtQWRkT24ge1xuXG4gIHJlYWRvbmx5IG9wdGlvbnM6IEJhY2tzdGFnZUFkZE9uUHJvcHM7XG5cbiAgY29uc3RydWN0b3IocHJvcHM/OiBCYWNrc3RhZ2VBZGRPblByb3BzKSB7XG4gICAgc3VwZXIoey4uLmRlZmF1bHRQcm9wcywgLi4ucHJvcHN9KTtcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLnByb3BzIGFzIEJhY2tzdGFnZUFkZE9uUHJvcHM7XG4gIH1cbiAgXG4gIEBkZXBlbmRhYmxlKCdBd3NMb2FkQmFsYW5jZXJDb250cm9sbGVyQWRkT24nLCdFeHRlcm5hbHNTZWNyZXRzQWRkT24nKVxuICBkZXBsb3koY2x1c3RlckluZm86IENsdXN0ZXJJbmZvKTogUHJvbWlzZTxDb25zdHJ1Y3Q+IHtcbiAgICBsZXQgdmFsdWVzOiBWYWx1ZXMgPSB0aGlzLnBvcHVsYXRlVmFsdWVzKGNsdXN0ZXJJbmZvLCB0aGlzLm9wdGlvbnMpO1xuICAgIGNvbnN0IGNoYXJ0ID0gdGhpcy5hZGRIZWxtQ2hhcnQoY2x1c3RlckluZm8sIHZhbHVlcyk7XG5cbiAgICBuZXcgQ2ZuT3V0cHV0KGNsdXN0ZXJJbmZvLmNsdXN0ZXIuc3RhY2ssICdCYWNrc3RhZ2UgYmFzZSBVUkwnLCB7XG4gICAgICB2YWx1ZTogSFRUUFMgKyB0aGlzLm9wdGlvbnMuc3ViZG9tYWluLFxuICAgICAgZGVzY3JpcHRpb246IFwiQmFja3N0YWdlIGJhc2UgVVJMXCIsXG4gICAgICBleHBvcnROYW1lOiBcIkJhY2tzdGFnZUJhc2VVcmxcIixcbiAgICB9KTtcblxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoY2hhcnQpO1xuICB9XG5cbiAgLyoqXG4gICogcG9wdWxhdGVWYWx1ZXMgcG9wdWxhdGVzIHRoZSBhcHByb3ByaWF0ZSB2YWx1ZXMgdXNlZCB0byBjdXN0b21pemUgdGhlIEhlbG0gY2hhcnRcbiAgKiBAcGFyYW0gaGVsbU9wdGlvbnMgVXNlciBwcm92aWRlZCB2YWx1ZXMgdG8gY3VzdG9taXplIHRoZSBjaGFydFxuICAqL1xuICBwb3B1bGF0ZVZhbHVlcyhjbHVzdGVySW5mbzogQ2x1c3RlckluZm8sIGhlbG1PcHRpb25zOiBCYWNrc3RhZ2VBZGRPblByb3BzKTogVmFsdWVzIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBoZWxtT3B0aW9ucy52YWx1ZXMgPz8ge307XG4gICAgXG4gICAgY29uc3QgYW5ub3RhdGlvbnMgPSB7XG4gICAgICBcImFsYi5pbmdyZXNzLmt1YmVybmV0ZXMuaW8vc2NoZW1lXCI6IFwiaW50ZXJuZXQtZmFjaW5nXCIsXG4gICAgICBcImFsYi5pbmdyZXNzLmt1YmVybmV0ZXMuaW8vdGFyZ2V0LXR5cGVcIjogXCJpcFwiLFxuICAgICAgXCJhbGIuaW5ncmVzcy5rdWJlcm5ldGVzLmlvL2NlcnRpZmljYXRlLWFyblwiOiBjbHVzdGVySW5mby5nZXRSZXNvdXJjZTxJQ2VydGlmaWNhdGU+KGhlbG1PcHRpb25zLmNlcnRpZmljYXRlUmVzb3VyY2VOYW1lKT8uY2VydGlmaWNhdGVBcm5cbiAgICB9O1xuICBcbiAgICBjb25zdCBkYXRhYmFzZUluc3RhbmNlOiByZHMuSURhdGFiYXNlSW5zdGFuY2UgID0gY2x1c3RlckluZm8uZ2V0UmVxdWlyZWRSZXNvdXJjZShoZWxtT3B0aW9ucy5kYXRhYmFzZVJlc291cmNlTmFtZSk7XG4gICAgaWYgKGRhdGFiYXNlSW5zdGFuY2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhYmFzZSBpbnN0YW5jZSBub3QgZm91bmRcIik7XG4gICAgfVxuICBcbiAgICBjb25zdCBkYXRhYmFzZUNoYXJ0VmFsdWVzID0ge1xuICAgICAgXCJjbGllbnRcIjogXCJwZ1wiLFxuICAgICAgXCJjb25uZWN0aW9uXCI6IHtcbiAgICAgICAgXCJob3N0XCI6IGRhdGFiYXNlSW5zdGFuY2UuZGJJbnN0YW5jZUVuZHBvaW50QWRkcmVzcyxcbiAgICAgICAgXCJwb3J0XCI6IGRhdGFiYXNlSW5zdGFuY2UuZGJJbnN0YW5jZUVuZHBvaW50UG9ydCxcbiAgICAgICAgXCJ1c2VyXCI6IFwiJHtQT1NUR1JFU19VU0VSfVwiLFxuICAgICAgICBcInBhc3N3b3JkXCI6IFwiJHtQT1NUR1JFU19QQVNTV09SRH1cIlxuICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgc2V0UGF0aCh2YWx1ZXMsIFwiaW5ncmVzcy5lbmFibGVkXCIsIHRydWUpO1xuICAgIHNldFBhdGgodmFsdWVzLCBcImluZ3Jlc3MuY2xhc3NOYW1lXCIsIFwiYWxiXCIpO1xuICAgIHNldFBhdGgodmFsdWVzLCBcImluZ3Jlc3MuaG9zdFwiLCBoZWxtT3B0aW9ucy5zdWJkb21haW4pO1xuICAgIHNldFBhdGgodmFsdWVzLCBcImluZ3Jlc3MuYW5ub3RhdGlvbnNcIiwgYW5ub3RhdGlvbnMpO1xuICBcbiAgICBzZXRQYXRoKHZhbHVlcywgXCJiYWNrc3RhZ2UuaW1hZ2UucmVnaXN0cnlcIiwgaGVsbU9wdGlvbnMuaW1hZ2VSZWdpc3RyeSk7XG4gICAgc2V0UGF0aCh2YWx1ZXMsIFwiYmFja3N0YWdlLmltYWdlLnJlcG9zaXRvcnlcIiwgaGVsbU9wdGlvbnMuaW1hZ2VSZXBvc2l0b3J5KTtcbiAgICBzZXRQYXRoKHZhbHVlcywgXCJiYWNrc3RhZ2UuaW1hZ2UudGFnXCIsIGhlbG1PcHRpb25zLmltYWdlVGFnKTtcbiAgXG4gICAgc2V0UGF0aCh2YWx1ZXMsIFwiYmFja3N0YWdlLmFwcENvbmZpZy5hcHAuYmFzZVVybFwiLCBIVFRQUyArIGhlbG1PcHRpb25zLnN1YmRvbWFpbik7XG4gICAgc2V0UGF0aCh2YWx1ZXMsIFwiYmFja3N0YWdlLmFwcENvbmZpZy5iYWNrZW5kLmJhc2VVcmxcIiwgSFRUUFMgKyBoZWxtT3B0aW9ucy5zdWJkb21haW4pO1xuICAgIHNldFBhdGgodmFsdWVzLCBcImJhY2tzdGFnZS5hcHBDb25maWcuYmFja2VuZC5kYXRhYmFzZVwiLCBkYXRhYmFzZUNoYXJ0VmFsdWVzKTtcblxuICAgIHNldFBhdGgodmFsdWVzLCBcImJhY2tzdGFnZS5leHRyYUVudlZhcnNTZWNyZXRzXCIsIFtoZWxtT3B0aW9ucy5kYXRhYmFzZVNlY3JldFRhcmdldE5hbWVdKTtcbiAgXG4gICAgc2V0UGF0aCh2YWx1ZXMsIFwiYmFja3N0YWdlLmNvbW1hbmRcIiwgW1wibm9kZVwiLCBcInBhY2thZ2VzL2JhY2tlbmRcIiwgXCItLWNvbmZpZ1wiLCBcImFwcC1jb25maWcueWFtbFwiXSk7XG4gICAgXG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxufVxuIl19