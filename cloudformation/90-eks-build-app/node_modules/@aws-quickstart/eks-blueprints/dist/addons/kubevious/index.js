"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubeviousAddOn = void 0;
const helm_addon_1 = require("../helm-addon");
const utils_1 = require("../../utils");
/**
 * Default props to be used when creating the Helm chart
 */
const defaultProps = {
    name: "kubevious",
    namespace: "kubevious",
    chart: "kubevious",
    version: "1.2.2",
    release: "kubevious",
    repository: "https://helm.kubevious.io",
    values: {},
    ingressEnabled: false,
    kubeviousServiceType: "ClusterIP",
};
/**
 * Main class to instantiate the Helm chart
 */
let KubeviousAddOn = class KubeviousAddOn extends helm_addon_1.HelmAddOn {
    constructor(props) {
        super({ ...defaultProps, ...props });
        this.options = this.props;
    }
    deploy(clusterInfo) {
        let values = populateValues(this.options);
        const chart = this.addHelmChart(clusterInfo, values);
        return Promise.resolve(chart);
    }
};
exports.KubeviousAddOn = KubeviousAddOn;
exports.KubeviousAddOn = KubeviousAddOn = __decorate([
    utils_1.supportsX86
], KubeviousAddOn);
/**
 * populateValues populates the appropriate values used to customize the Helm chart
 * @param helmOptions User provided values to customize the chart
 */
function populateValues(helmOptions) {
    var _a;
    const values = (_a = helmOptions.values) !== null && _a !== void 0 ? _a : {};
    (0, utils_1.setPath)(values, "ingress.enabled", helmOptions.ingressEnabled);
    (0, utils_1.setPath)(values, "ui.service.type", helmOptions.kubeviousServiceType);
    // Generate a random password for MySQL DB root user
    (0, utils_1.setPath)(values, "mysql.generate_passwords", true);
    return values;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL2t1YmV2aW91cy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQSw4Q0FBOEU7QUFFOUUsdUNBQW1EO0FBcUJuRDs7R0FFRztBQUNILE1BQU0sWUFBWSxHQUF5QztJQUN2RCxJQUFJLEVBQUUsV0FBVztJQUNqQixTQUFTLEVBQUUsV0FBVztJQUN0QixLQUFLLEVBQUUsV0FBVztJQUNsQixPQUFPLEVBQUUsT0FBTztJQUNoQixPQUFPLEVBQUUsV0FBVztJQUNwQixVQUFVLEVBQUcsMkJBQTJCO0lBQ3hDLE1BQU0sRUFBRSxFQUFFO0lBRVYsY0FBYyxFQUFFLEtBQUs7SUFDckIsb0JBQW9CLEVBQUUsV0FBVztDQUNwQyxDQUFDO0FBRUY7O0dBRUc7QUFFSSxJQUFNLGNBQWMsR0FBcEIsTUFBTSxjQUFlLFNBQVEsc0JBQVM7SUFJekMsWUFBWSxLQUEyQjtRQUNuQyxLQUFLLENBQUMsRUFBQyxHQUFHLFlBQVksRUFBRSxHQUFHLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBNEIsQ0FBQztJQUNyRCxDQUFDO0lBRUQsTUFBTSxDQUFDLFdBQXdCO1FBQzNCLElBQUksTUFBTSxHQUFXLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFckQsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLENBQUM7Q0FDSixDQUFBO0FBZlksd0NBQWM7eUJBQWQsY0FBYztJQUQxQixtQkFBVztHQUNDLGNBQWMsQ0FlMUI7QUFFRDs7O0dBR0c7QUFDSCxTQUFTLGNBQWMsQ0FBQyxXQUFnQzs7SUFDcEQsTUFBTSxNQUFNLEdBQUcsTUFBQSxXQUFXLENBQUMsTUFBTSxtQ0FBSSxFQUFFLENBQUM7SUFFeEMsSUFBQSxlQUFPLEVBQUMsTUFBTSxFQUFFLGlCQUFpQixFQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNoRSxJQUFBLGVBQU8sRUFBQyxNQUFNLEVBQUUsaUJBQWlCLEVBQUcsV0FBVyxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDdEUsb0RBQW9EO0lBQ3BELElBQUEsZUFBTyxFQUFDLE1BQU0sRUFBRSwwQkFBMEIsRUFBRyxJQUFJLENBQUMsQ0FBQztJQUVuRCxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCB7IEhlbG1BZGRPbiwgSGVsbUFkZE9uVXNlclByb3BzLCBIZWxtQWRkT25Qcm9wcyB9IGZyb20gXCIuLi9oZWxtLWFkZG9uXCI7XG5pbXBvcnQgeyBDbHVzdGVySW5mbywgVmFsdWVzIH0gZnJvbSBcIi4uLy4uL3NwaVwiO1xuaW1wb3J0IHsgc2V0UGF0aCwgc3VwcG9ydHNYODYgfSBmcm9tIFwiLi4vLi4vdXRpbHNcIjtcblxuXG4vKipcbiAqIFVzZXIgcHJvdmlkZWQgb3B0aW9ucyBmb3IgdGhlIEhlbG0gQ2hhcnRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBLdWJldmlvdXNBZGRPblByb3BzIGV4dGVuZHMgSGVsbUFkZE9uVXNlclByb3BzIHtcbiAgICAvKipcbiAgICAgKiBWZXJzaW9uIG9mIHRoZSBoZWxtIGNoYXJ0IHRvIGRlcGxveVxuICAgICAqL1xuICAgIHZlcnNpb24/OiBzdHJpbmcsXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuIGluZ3Jlc3MgZm9yIGFjY2VzcyB0byBLdWJldmlvdXNcbiAgICAgKi9cbiAgICBpbmdyZXNzRW5hYmxlZD86IGJvb2xlYW4sXG4gICAgLyoqXG4gICAgICogVHlwZSBvZiBzZXJ2aWNlIHRvIGV4cG9zZSBLdWJldmlvdXMgVUlcbiAgICAgKi9cbiAgICBrdWJldmlvdXNTZXJ2aWNlVHlwZT86IHN0cmluZyxcbn1cblxuLyoqXG4gKiBEZWZhdWx0IHByb3BzIHRvIGJlIHVzZWQgd2hlbiBjcmVhdGluZyB0aGUgSGVsbSBjaGFydFxuICovXG5jb25zdCBkZWZhdWx0UHJvcHM6IEhlbG1BZGRPblByb3BzICYgS3ViZXZpb3VzQWRkT25Qcm9wcyA9IHtcbiAgICBuYW1lOiBcImt1YmV2aW91c1wiLFxuICAgIG5hbWVzcGFjZTogXCJrdWJldmlvdXNcIixcbiAgICBjaGFydDogXCJrdWJldmlvdXNcIixcbiAgICB2ZXJzaW9uOiBcIjEuMi4yXCIsXG4gICAgcmVsZWFzZTogXCJrdWJldmlvdXNcIixcbiAgICByZXBvc2l0b3J5OiAgXCJodHRwczovL2hlbG0ua3ViZXZpb3VzLmlvXCIsXG4gICAgdmFsdWVzOiB7fSxcblxuICAgIGluZ3Jlc3NFbmFibGVkOiBmYWxzZSxcbiAgICBrdWJldmlvdXNTZXJ2aWNlVHlwZTogXCJDbHVzdGVySVBcIixcbn07XG5cbi8qKlxuICogTWFpbiBjbGFzcyB0byBpbnN0YW50aWF0ZSB0aGUgSGVsbSBjaGFydFxuICovXG5Ac3VwcG9ydHNYODZcbmV4cG9ydCBjbGFzcyBLdWJldmlvdXNBZGRPbiBleHRlbmRzIEhlbG1BZGRPbiB7XG5cbiAgICByZWFkb25seSBvcHRpb25zOiBLdWJldmlvdXNBZGRPblByb3BzO1xuXG4gICAgY29uc3RydWN0b3IocHJvcHM/OiBLdWJldmlvdXNBZGRPblByb3BzKSB7XG4gICAgICAgIHN1cGVyKHsuLi5kZWZhdWx0UHJvcHMsIC4uLnByb3BzfSk7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHRoaXMucHJvcHMgYXMgS3ViZXZpb3VzQWRkT25Qcm9wcztcbiAgICB9XG5cbiAgICBkZXBsb3koY2x1c3RlckluZm86IENsdXN0ZXJJbmZvKTogUHJvbWlzZTxDb25zdHJ1Y3Q+IHtcbiAgICAgICAgbGV0IHZhbHVlczogVmFsdWVzID0gcG9wdWxhdGVWYWx1ZXModGhpcy5vcHRpb25zKTtcbiAgICAgICAgY29uc3QgY2hhcnQgPSB0aGlzLmFkZEhlbG1DaGFydChjbHVzdGVySW5mbywgdmFsdWVzKTtcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGNoYXJ0KTtcbiAgICB9XG59XG5cbi8qKlxuICogcG9wdWxhdGVWYWx1ZXMgcG9wdWxhdGVzIHRoZSBhcHByb3ByaWF0ZSB2YWx1ZXMgdXNlZCB0byBjdXN0b21pemUgdGhlIEhlbG0gY2hhcnRcbiAqIEBwYXJhbSBoZWxtT3B0aW9ucyBVc2VyIHByb3ZpZGVkIHZhbHVlcyB0byBjdXN0b21pemUgdGhlIGNoYXJ0XG4gKi9cbmZ1bmN0aW9uIHBvcHVsYXRlVmFsdWVzKGhlbG1PcHRpb25zOiBLdWJldmlvdXNBZGRPblByb3BzKTogVmFsdWVzIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBoZWxtT3B0aW9ucy52YWx1ZXMgPz8ge307XG5cbiAgICBzZXRQYXRoKHZhbHVlcywgXCJpbmdyZXNzLmVuYWJsZWRcIiwgIGhlbG1PcHRpb25zLmluZ3Jlc3NFbmFibGVkKTtcbiAgICBzZXRQYXRoKHZhbHVlcywgXCJ1aS5zZXJ2aWNlLnR5cGVcIiwgIGhlbG1PcHRpb25zLmt1YmV2aW91c1NlcnZpY2VUeXBlKTtcbiAgICAvLyBHZW5lcmF0ZSBhIHJhbmRvbSBwYXNzd29yZCBmb3IgTXlTUUwgREIgcm9vdCB1c2VyXG4gICAgc2V0UGF0aCh2YWx1ZXMsIFwibXlzcWwuZ2VuZXJhdGVfcGFzc3dvcmRzXCIsICB0cnVlKTtcblxuICAgIHJldHVybiB2YWx1ZXM7XG59XG4iXX0=