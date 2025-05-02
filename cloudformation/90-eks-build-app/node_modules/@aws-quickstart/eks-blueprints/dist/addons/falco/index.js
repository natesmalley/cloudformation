"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FalcoAddOn = void 0;
const index_1 = require("../helm-addon/index");
const utils_1 = require("../../utils");
/**
 * Default props to be used when creating the Helm chart
 */
const defaultProps = {
    name: "blueprints-falco-addon",
    namespace: "falco",
    chart: "falco",
    version: "2.0.15",
    release: "falco",
    repository: "https://falcosecurity.github.io/charts",
    createNamespace: true,
    values: {}
};
/**
 * This add-on is currently not supported. It will apply the latest falco helm chart but the latest AMI does not have stock driver supported and
 * driver build in the init fails atm.
 */
let FalcoAddOn = class FalcoAddOn extends index_1.HelmAddOn {
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
exports.FalcoAddOn = FalcoAddOn;
exports.FalcoAddOn = FalcoAddOn = __decorate([
    utils_1.supportsX86
], FalcoAddOn);
/**
 * populateValues populates the appropriate values used to customize the Helm chart
 * @param helmOptions User provided values to customize the chart
 */
function populateValues(helmOptions) {
    var _a, _b, _c, _d, _e;
    const values = (_a = helmOptions.values) !== null && _a !== void 0 ? _a : {};
    (0, utils_1.setPath)(values, "kubernetes.support.enabled", (_b = helmOptions.kubernetesSupportEnabled) !== null && _b !== void 0 ? _b : true);
    (0, utils_1.setPath)(values, "falco.sidekick.enabled", (_c = helmOptions.falcoSidekickEnabled) !== null && _c !== void 0 ? _c : true);
    (0, utils_1.setPath)(values, "falco.sidekick.webui.enabled", (_d = helmOptions.falcoSidekickWebuiEnabled) !== null && _d !== void 0 ? _d : true);
    (0, utils_1.setPath)(values, "audit.logs.enabled", (_e = helmOptions.auditLogsEnabled) !== null && _e !== void 0 ? _e : true);
    return values;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL2ZhbGNvL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUVBLCtDQUFnRDtBQUVoRCx1Q0FBbUQ7QUFrQ25EOztHQUVHO0FBQ0YsTUFBTSxZQUFZLEdBQXFDO0lBQ3BELElBQUksRUFBRSx3QkFBd0I7SUFDOUIsU0FBUyxFQUFFLE9BQU87SUFDbEIsS0FBSyxFQUFFLE9BQU87SUFDZCxPQUFPLEVBQUUsUUFBUTtJQUNqQixPQUFPLEVBQUUsT0FBTztJQUNoQixVQUFVLEVBQUcsd0NBQXdDO0lBQ3JELGVBQWUsRUFBRSxJQUFJO0lBQ3JCLE1BQU0sRUFBRSxFQUFFO0NBQ2IsQ0FBQztBQUVGOzs7R0FHRztBQUVJLElBQU0sVUFBVSxHQUFoQixNQUFNLFVBQVcsU0FBUSxpQkFBUztJQUlyQyxZQUFZLEtBQXVCO1FBQy9CLEtBQUssQ0FBQyxFQUFDLEdBQUcsWUFBWSxFQUFFLEdBQUcsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUF3QixDQUFDO0lBQ2pELENBQUM7SUFFRCxNQUFNLENBQUMsV0FBd0I7UUFDM0IsSUFBSSxNQUFNLEdBQVcsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVyRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQztDQUNKLENBQUE7QUFmWSxnQ0FBVTtxQkFBVixVQUFVO0lBRHRCLG1CQUFXO0dBQ0MsVUFBVSxDQWV0QjtBQUVEOzs7R0FHRztBQUNILFNBQVMsY0FBYyxDQUFDLFdBQTRCOztJQUNoRCxNQUFNLE1BQU0sR0FBRyxNQUFBLFdBQVcsQ0FBQyxNQUFNLG1DQUFJLEVBQUUsQ0FBQztJQUV4QyxJQUFBLGVBQU8sRUFBQyxNQUFNLEVBQUUsNEJBQTRCLEVBQUcsTUFBQSxXQUFXLENBQUMsd0JBQXdCLG1DQUFJLElBQUksQ0FBQyxDQUFDO0lBQzdGLElBQUEsZUFBTyxFQUFDLE1BQU0sRUFBRSx3QkFBd0IsRUFBRyxNQUFBLFdBQVcsQ0FBQyxvQkFBb0IsbUNBQUksSUFBSSxDQUFDLENBQUM7SUFDckYsSUFBQSxlQUFPLEVBQUMsTUFBTSxFQUFFLDhCQUE4QixFQUFHLE1BQUEsV0FBVyxDQUFDLHlCQUF5QixtQ0FBSSxJQUFJLENBQUMsQ0FBQztJQUNoRyxJQUFBLGVBQU8sRUFBQyxNQUFNLEVBQUUsb0JBQW9CLEVBQUcsTUFBQSxXQUFXLENBQUMsZ0JBQWdCLG1DQUFJLElBQUksQ0FBQyxDQUFDO0lBRTdFLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIZWxtQWRkT25Qcm9wcywgSGVsbUFkZE9uVXNlclByb3BzIH0gZnJvbSBcIi4uL2hlbG0tYWRkb25cIjtcbmltcG9ydCB7IENsdXN0ZXJJbmZvIH0gZnJvbSAnLi4vLi4vc3BpL3R5cGVzJztcbmltcG9ydCB7IEhlbG1BZGRPbiB9IGZyb20gJy4uL2hlbG0tYWRkb24vaW5kZXgnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCB7IHNldFBhdGgsIHN1cHBvcnRzWDg2IH0gZnJvbSBcIi4uLy4uL3V0aWxzXCI7XG5pbXBvcnQgeyBWYWx1ZXMgfSBmcm9tIFwiLi4vLi4vc3BpXCI7XG5cbi8qKlxuICogVXNlciBwcm92aWRlZCBvcHRpb25zIGZvciB0aGUgSGVsbSBDaGFydFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZhbGNvQWRkT25Qcm9wcyBleHRlbmRzIEhlbG1BZGRPblVzZXJQcm9wcyB7XG4gICAgLyoqXG4gICAgICogVmVyc2lvbiBvZiB0aGUgaGVsbSBjaGFydCB0byBkZXBsb3lcbiAgICAgKi9cbiAgICB2ZXJzaW9uPzogc3RyaW5nLFxuICAgIC8qKlxuICAgICAqIEVuYWJsZSBLdWJlcm5ldGVzIG1ldGEgZGF0YSBjb2xsZWN0aW9uIHZpYSBhIGNvbm5lY3Rpb24gdG8gdGhlIEt1YmVybmV0ZXMgQVBJIHNlcnZlclxuICAgICAqL1xuICAgIGt1YmVybmV0ZXNTdXBwb3J0RW5hYmxlZD86IGJvb2xlYW4sXG4gICAgLyoqXG4gICAgICogRW5hYmxlIGZhbGNvc2lkZWtpY2sgZGVwbG95bWVudFxuICAgICAqL1xuICAgIGZhbGNvU2lkZWtpY2tFbmFibGVkPzogc3RyaW5nLFxuICAgIC8qKlxuICAgICAqIEVuYWJsZSBmYWxjb3NpZGVraWNrIHdlYnVpIHdoaWNoIHByb3ZpZGVzIGEgc2ltcGxlIFdlYlVJIGZvciBkaXNwbGF5aW5nIGxhdGVzdCBldmVudHMgZnJvbSBGYWxjby4gSXQgd29ya3MgYXMgb3V0cHV0IGZvciBGYWxjb3NpZGVraWNrLlxuICAgICAqL1xuICAgIGZhbGNvU2lkZWtpY2tXZWJ1aUVuYWJsZWQ/OiBzdHJpbmcsXG4gICAgLyoqXG4gICAgICogRW5hYmxlIGF1ZGl0IGxvZ3MgZm9yIEZhbGNvIFxuICAgICAqL1xuICAgIGF1ZGl0TG9nc0VuYWJsZWQ/OiBzdHJpbmcsXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIG5hbWVzcGFjZSBmb3IgRmFsY29cbiAgICAgKiBAZGVmYXVsdCBmYWxjb1xuICAgICAqL1xuICAgIGNyZWF0ZU5hbWVzcGFjZT86IGJvb2xlYW4sXG59XG5cbi8qKlxuICogRGVmYXVsdCBwcm9wcyB0byBiZSB1c2VkIHdoZW4gY3JlYXRpbmcgdGhlIEhlbG0gY2hhcnRcbiAqL1xuIGNvbnN0IGRlZmF1bHRQcm9wczogSGVsbUFkZE9uUHJvcHMgJiBGYWxjb0FkZE9uUHJvcHMgPSB7XG4gICAgbmFtZTogXCJibHVlcHJpbnRzLWZhbGNvLWFkZG9uXCIsXG4gICAgbmFtZXNwYWNlOiBcImZhbGNvXCIsXG4gICAgY2hhcnQ6IFwiZmFsY29cIixcbiAgICB2ZXJzaW9uOiBcIjIuMC4xNVwiLFxuICAgIHJlbGVhc2U6IFwiZmFsY29cIixcbiAgICByZXBvc2l0b3J5OiAgXCJodHRwczovL2ZhbGNvc2VjdXJpdHkuZ2l0aHViLmlvL2NoYXJ0c1wiLFxuICAgIGNyZWF0ZU5hbWVzcGFjZTogdHJ1ZSxcbiAgICB2YWx1ZXM6IHt9XG59O1xuXG4vKipcbiAqIFRoaXMgYWRkLW9uIGlzIGN1cnJlbnRseSBub3Qgc3VwcG9ydGVkLiBJdCB3aWxsIGFwcGx5IHRoZSBsYXRlc3QgZmFsY28gaGVsbSBjaGFydCBidXQgdGhlIGxhdGVzdCBBTUkgZG9lcyBub3QgaGF2ZSBzdG9jayBkcml2ZXIgc3VwcG9ydGVkIGFuZFxuICogZHJpdmVyIGJ1aWxkIGluIHRoZSBpbml0IGZhaWxzIGF0bS4gXG4gKi9cbkBzdXBwb3J0c1g4NlxuZXhwb3J0IGNsYXNzIEZhbGNvQWRkT24gZXh0ZW5kcyBIZWxtQWRkT24ge1xuXG4gICAgcmVhZG9ubHkgb3B0aW9uczogRmFsY29BZGRPblByb3BzO1xuXG4gICAgY29uc3RydWN0b3IocHJvcHM/OiBGYWxjb0FkZE9uUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoey4uLmRlZmF1bHRQcm9wcywgLi4ucHJvcHN9KTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gdGhpcy5wcm9wcyBhcyBGYWxjb0FkZE9uUHJvcHM7XG4gICAgfVxuXG4gICAgZGVwbG95KGNsdXN0ZXJJbmZvOiBDbHVzdGVySW5mbyk6IFByb21pc2U8Q29uc3RydWN0PiB7XG4gICAgICAgIGxldCB2YWx1ZXM6IFZhbHVlcyA9IHBvcHVsYXRlVmFsdWVzKHRoaXMub3B0aW9ucyk7XG4gICAgICAgIGNvbnN0IGNoYXJ0ID0gdGhpcy5hZGRIZWxtQ2hhcnQoY2x1c3RlckluZm8sIHZhbHVlcyk7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShjaGFydCk7XG4gICAgfVxufVxuXG4vKipcbiAqIHBvcHVsYXRlVmFsdWVzIHBvcHVsYXRlcyB0aGUgYXBwcm9wcmlhdGUgdmFsdWVzIHVzZWQgdG8gY3VzdG9taXplIHRoZSBIZWxtIGNoYXJ0XG4gKiBAcGFyYW0gaGVsbU9wdGlvbnMgVXNlciBwcm92aWRlZCB2YWx1ZXMgdG8gY3VzdG9taXplIHRoZSBjaGFydFxuICovXG5mdW5jdGlvbiBwb3B1bGF0ZVZhbHVlcyhoZWxtT3B0aW9uczogRmFsY29BZGRPblByb3BzKTogVmFsdWVzIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBoZWxtT3B0aW9ucy52YWx1ZXMgPz8ge307XG5cbiAgICBzZXRQYXRoKHZhbHVlcywgXCJrdWJlcm5ldGVzLnN1cHBvcnQuZW5hYmxlZFwiLCAgaGVsbU9wdGlvbnMua3ViZXJuZXRlc1N1cHBvcnRFbmFibGVkID8/IHRydWUpO1xuICAgIHNldFBhdGgodmFsdWVzLCBcImZhbGNvLnNpZGVraWNrLmVuYWJsZWRcIiwgIGhlbG1PcHRpb25zLmZhbGNvU2lkZWtpY2tFbmFibGVkID8/IHRydWUpO1xuICAgIHNldFBhdGgodmFsdWVzLCBcImZhbGNvLnNpZGVraWNrLndlYnVpLmVuYWJsZWRcIiwgIGhlbG1PcHRpb25zLmZhbGNvU2lkZWtpY2tXZWJ1aUVuYWJsZWQgPz8gdHJ1ZSk7XG4gICAgc2V0UGF0aCh2YWx1ZXMsIFwiYXVkaXQubG9ncy5lbmFibGVkXCIsICBoZWxtT3B0aW9ucy5hdWRpdExvZ3NFbmFibGVkID8/IHRydWUpO1xuXG4gICAgcmV0dXJuIHZhbHVlcztcbn1cbiJdfQ==