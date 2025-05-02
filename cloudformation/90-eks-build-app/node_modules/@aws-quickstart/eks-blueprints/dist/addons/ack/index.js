"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AckAddOn = void 0;
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const ts_deepmerge_1 = require("ts-deepmerge");
require("reflect-metadata");
const utils_1 = require("../../utils");
const helm_addon_1 = require("../helm-addon");
const serviceMappings_1 = require("./serviceMappings");
__exportStar(require("./serviceMappings"), exports);
/**
 * Default props to be used when creating the Helm chart
 */
const defaultProps = {
    namespace: "ack-system",
    values: {},
    createNamespace: true,
    serviceName: serviceMappings_1.AckServiceName.IAM,
    id: "iam-ack"
};
/**
 * Main class to instantiate the Helm chart
 */
let AckAddOn = class AckAddOn extends helm_addon_1.HelmAddOn {
    constructor(props) {
        super(populateDefaults(defaultProps, props));
        this.options = this.props;
        this.id = this.options.id;
    }
    deploy(clusterInfo) {
        var _a;
        const cluster = clusterInfo.cluster;
        const sa = cluster.addServiceAccount(`${this.options.chart}-sa`, {
            namespace: this.options.namespace,
            name: this.options.saName,
        });
        let values = populateValues(this.options, cluster.stack.region);
        values = (0, ts_deepmerge_1.merge)(values, (_a = this.props.values) !== null && _a !== void 0 ? _a : {});
        if (this.options.createNamespace == true) {
            // Let CDK Create the Namespace
            const namespace = (0, utils_1.createNamespace)(this.options.namespace, cluster);
            sa.node.addDependency(namespace);
        }
        if (this.options.managedPolicyName) {
            sa.role.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName(this.options.managedPolicyName));
        }
        if (this.options.inlinePolicyStatements && this.options.inlinePolicyStatements.length > 0) {
            sa.role.attachInlinePolicy(new aws_iam_1.Policy(cluster.stack, `${this.options.chart}-inline-policy`, {
                statements: this.options.inlinePolicyStatements
            }));
        }
        const chart = this.addHelmChart(clusterInfo, values);
        chart.node.addDependency(sa);
        return Promise.resolve(chart);
    }
};
exports.AckAddOn = AckAddOn;
exports.AckAddOn = AckAddOn = __decorate([
    Reflect.metadata("ordered", true),
    utils_1.supportsX86
], AckAddOn);
/**
 * populateValues populates the appropriate values used to customize the Helm chart
 * @param helmOptions User provided values to customize the chart
 */
function populateValues(helmOptions, awsRegion) {
    var _a;
    const values = (_a = helmOptions.values) !== null && _a !== void 0 ? _a : {};
    (0, utils_1.setPath)(values, "aws.region", awsRegion);
    (0, utils_1.setPath)(values, "serviceAccount.create", false);
    (0, utils_1.setPath)(values, "serviceAccount.name", helmOptions.saName);
    return values;
}
/**
 * populate parameters passed or the default values from service Mappings.
 */
function populateDefaults(defaultProps, props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    let tempProps = { ...props !== null && props !== void 0 ? props : {} }; // since props may be empty
    tempProps.id = (_a = tempProps.id) !== null && _a !== void 0 ? _a : defaultProps.id;
    tempProps.serviceName = (_b = tempProps.serviceName) !== null && _b !== void 0 ? _b : defaultProps.serviceName;
    tempProps.name = (_c = tempProps.name) !== null && _c !== void 0 ? _c : serviceMappings_1.serviceMappings[tempProps.serviceName].chart;
    tempProps.namespace = (_d = tempProps.namespace) !== null && _d !== void 0 ? _d : defaultProps.namespace;
    tempProps.chart = (_e = tempProps.chart) !== null && _e !== void 0 ? _e : (_f = serviceMappings_1.serviceMappings[tempProps.serviceName]) === null || _f === void 0 ? void 0 : _f.chart;
    tempProps.version = (_g = tempProps.version) !== null && _g !== void 0 ? _g : (_h = serviceMappings_1.serviceMappings[tempProps.serviceName]) === null || _h === void 0 ? void 0 : _h.version;
    const repositoryUrl = "oci://public.ecr.aws/aws-controllers-k8s";
    tempProps.release = (_j = tempProps.release) !== null && _j !== void 0 ? _j : tempProps.chart;
    tempProps.repository = (_k = tempProps.repository) !== null && _k !== void 0 ? _k : `${repositoryUrl}/${tempProps.name}`;
    tempProps.managedPolicyName = (_l = tempProps.managedPolicyName) !== null && _l !== void 0 ? _l : (_m = serviceMappings_1.serviceMappings[tempProps.serviceName]) === null || _m === void 0 ? void 0 : _m.managedPolicyName;
    tempProps.inlinePolicyStatements = (_o = tempProps.inlinePolicyStatements) !== null && _o !== void 0 ? _o : (_p = serviceMappings_1.serviceMappings[tempProps.serviceName]) === null || _p === void 0 ? void 0 : _p.inlinePolicyStatements;
    tempProps.createNamespace = (_q = tempProps.createNamespace) !== null && _q !== void 0 ? _q : defaultProps.createNamespace;
    tempProps.saName = (_r = tempProps.saName) !== null && _r !== void 0 ? _r : `${tempProps.chart}-sa`;
    return tempProps;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL2Fjay9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlEQUE2RTtBQUU3RSwrQ0FBcUM7QUFFckMsNEJBQTBCO0FBQzFCLHVDQUFvRTtBQUNwRSw4Q0FBOEU7QUFDOUUsdURBQW9FO0FBRXBFLG9EQUFrQztBQW1DbEM7O0dBRUc7QUFDSCxNQUFNLFlBQVksR0FBa0I7SUFDbEMsU0FBUyxFQUFFLFlBQVk7SUFDdkIsTUFBTSxFQUFFLEVBQUU7SUFDVixlQUFlLEVBQUUsSUFBSTtJQUNyQixXQUFXLEVBQUUsZ0NBQWMsQ0FBQyxHQUFHO0lBQy9CLEVBQUUsRUFBRSxTQUFTO0NBQ2QsQ0FBQztBQUVGOztHQUVHO0FBR0ksSUFBTSxRQUFRLEdBQWQsTUFBTSxRQUFTLFNBQVEsc0JBQVM7SUFLckMsWUFBWSxLQUFxQjtRQUMvQixLQUFLLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBbUIsQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQXNCLENBQUM7UUFDM0MsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBR0QsTUFBTSxDQUFDLFdBQXdCOztRQUM3QixNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDO1FBRXBDLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxLQUFLLEVBQUU7WUFDL0QsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUztZQUNqQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNO1NBQzFCLENBQUMsQ0FBQztRQUVILElBQUksTUFBTSxHQUFXLGNBQWMs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dCI6WyJpbXBvcnQgeyBNYW5hZ2VkUG9saWN5LCBQb2xpY3ksIFBvbGljeVN0YXRlbWVudCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gXCJ0cy1kZWVwbWVyZ2VcIjtcbmltcG9ydCB7IENsdXN0ZXJJbmZvLCBWYWx1ZXMgfSBmcm9tIFwiLi4vLi4vc3BpXCI7XG5pbXBvcnQgXCJyZWZsZWN0LW1ldGFkYXRhXCI7XG5pbXBvcnQgeyBjcmVhdGVOYW1lc3BhY2UsIHNldFBhdGgsIHN1cHBvcnRzWDg2IH0gZnJvbSBcIi4uLy4uL3V0aWxzXCI7XG5pbXBvcnQgeyBIZWxtQWRkT24sIEhlbG1BZGRPblByb3BzLCBIZWxtQWRkT25Vc2VyUHJvcHMgfSBmcm9tIFwiLi4vaGVsbS1hZGRvblwiO1xuaW1wb3J0IHsgQWNrU2VydmljZU5hbWUsIHNlcnZpY2VNYXBwaW5ncyB9IGZyb20gJy4vc2VydmljZU1hcHBpbmdzJztcblxuZXhwb3J0ICogZnJvbSBcIi4vc2VydmljZU1hcHBpbmdzXCI7XG5cbi8qKlxuICogVXNlciBwcm92aWRlZCBvcHRpb24gZm9yIHRoZSBIZWxtIENoYXJ0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWNrQWRkT25Qcm9wcyBleHRlbmRzIEhlbG1BZGRPblVzZXJQcm9wcyB7XG4gICAgLyoqXG4gICAgICogUmVxdWlyZWQgaWRlbnRpZmllZCwgbXVzdCBiZSB1bmlxdWUgd2l0aGluIHRoZSBwYXJlbnQgc3RhY2sgc2NvcGUuXG4gICAgICovXG4gICAgaWQ/OiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogRGVmYXVsdCBTZXJ2aWNlIE5hbWVcbiAgICAgKiBAZGVmYXVsdCBpYW1cbiAgICAgKi9cbiAgICBzZXJ2aWNlTmFtZTogQWNrU2VydmljZU5hbWU7XG4gICAgLyoqXG4gICAgICogTWFuYWdlZCBJQU0gUG9saWN5IG9mIHRoZSBhY2sgY29udHJvbGxlclxuICAgICAqIEBkZWZhdWx0IElBTUZ1bGxBY2Nlc3NcbiAgICAgKi9cbiAgICBtYW5hZ2VkUG9saWN5TmFtZT86IHN0cmluZztcbiAgICAvKipcbiAgICAqIElubGluZSBJQU0gUG9saWN5IGZvciB0aGUgYWNrIGNvbnRyb2xsZXJcbiAgICAqIEBkZWZhdWx0IHVuZGVmaW5lZFxuICAgICovXG4gICAgaW5saW5lUG9saWN5U3RhdGVtZW50cz86IFBvbGljeVN0YXRlbWVudFtdO1xuICAgIC8qKlxuICAgICAqIFRvIENyZWF0ZSBOYW1lc3BhY2UgdXNpbmcgQ0RLLiBUaGlzIHNob3VsZCBiZSBkb25lIG9ubHkgZm9yIHRoZSBmaXJzdCB0aW1lLlxuICAgICAqLyAgICBcbiAgICBjcmVhdGVOYW1lc3BhY2U/OiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIFRvIGNyZWF0ZSBTZXJ2aWNlIEFjY291bnRcbiAgICAgKi8gICAgXG4gICAgc2FOYW1lPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIERlZmF1bHQgcHJvcHMgdG8gYmUgdXNlZCB3aGVuIGNyZWF0aW5nIHRoZSBIZWxtIGNoYXJ0XG4gKi9cbmNvbnN0IGRlZmF1bHRQcm9wczogQWNrQWRkT25Qcm9wcyA9IHtcbiAgbmFtZXNwYWNlOiBcImFjay1zeXN0ZW1cIixcbiAgdmFsdWVzOiB7fSxcbiAgY3JlYXRlTmFtZXNwYWNlOiB0cnVlLFxuICBzZXJ2aWNlTmFtZTogQWNrU2VydmljZU5hbWUuSUFNLCBcbiAgaWQ6IFwiaWFtLWFja1wiXG59O1xuXG4vKipcbiAqIE1haW4gY2xhc3MgdG8gaW5zdGFudGlhdGUgdGhlIEhlbG0gY2hhcnRcbiAqL1xuQFJlZmxlY3QubWV0YWRhdGEoXCJvcmRlcmVkXCIsIHRydWUpXG5Ac3VwcG9ydHNYODZcbmV4cG9ydCBjbGFzcyBBY2tBZGRPbiBleHRlbmRzIEhlbG1BZGRPbiB7XG5cbiAgcmVhZG9ubHkgb3B0aW9uczogQWNrQWRkT25Qcm9wcztcbiAgcmVhZG9ubHkgaWQ/IDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzPzogQWNrQWRkT25Qcm9wcykge1xuICAgIHN1cGVyKHBvcHVsYXRlRGVmYXVsdHMoZGVmYXVsdFByb3BzLCBwcm9wcykgYXMgSGVsbUFkZE9uUHJvcHMpO1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMucHJvcHMgYXMgQWNrQWRkT25Qcm9wcztcbiAgICB0aGlzLmlkID0gdGhpcy5vcHRpb25zLmlkO1xuICB9XG5cblxuICBkZXBsb3koY2x1c3RlckluZm86IENsdXN0ZXJJbmZvKTogUHJvbWlzZTxDb25zdHJ1Y3Q+IHtcbiAgICBjb25zdCBjbHVzdGVyID0gY2x1c3RlckluZm8uY2x1c3RlcjtcblxuICAgIGNvbnN0IHNhID0gY2x1c3Rlci5hZGRTZXJ2aWNlQWNjb3VudChgJHt0aGlzLm9wdGlvbnMuY2hhcnR9LXNhYCwge1xuICAgICAgbmFtZXNwYWNlOiB0aGlzLm9wdGlvbnMubmFtZXNwYWNlLFxuICAgICAgbmFtZTogdGhpcy5vcHRpb25zLnNhTmFtZSxcbiAgICB9KTtcblxuICAgIGxldCB2YWx1ZXM6IFZhbHVlcyA9IHBvcHVsYXRlVmFsdWVzKHRoaXMub3B0aW9ucyxjbHVzdGVyLnN0YWNrLnJlZ2lvbik7XG4gICAgdmFsdWVzID0gbWVyZ2UodmFsdWVzLCB0aGlzLnByb3BzLnZhbHVlcyA/PyB7fSk7XG5cbiAgICBpZih0aGlzLm9wdGlvbnMuY3JlYXRlTmFtZXNwYWNlID09IHRydWUpe1xuICAgICAgLy8gTGV0IENESyBDcmVhdGUgdGhlIE5hbWVzcGFjZVxuICAgICAgY29uc3QgbmFtZXNwYWNlID0gY3JlYXRlTmFtZXNwYWNlKHRoaXMub3B0aW9ucy5uYW1lc3BhY2UhICwgY2x1c3Rlcik7XG4gICAgICBzYS5ub2RlLmFkZERlcGVuZGVuY3kobmFtZXNwYWNlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLm1hbmFnZWRQb2xpY3lOYW1lKSB7XG4gICAgICBzYS5yb2xlLmFkZE1hbmFnZWRQb2xpY3koTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUodGhpcy5vcHRpb25zLm1hbmFnZWRQb2xpY3lOYW1lISkpO1xuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zLmlubGluZVBvbGljeVN0YXRlbWVudHMgJiYgdGhpcy5vcHRpb25zLmlubGluZVBvbGljeVN0YXRlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgc2Eucm9sZS5hdHRhY2hJbmxpbmVQb2xpY3kobmV3IFBvbGljeShjbHVzdGVyLnN0YWNrLCBgJHt0aGlzLm9wdGlvbnMuY2hhcnR9LWlubGluZS1wb2xpY3lgLCB7XG4gICAgICAgIHN0YXRlbWVudHM6IHRoaXMub3B0aW9ucy5pbmxpbmVQb2xpY3lTdGF0ZW1lbnRzXG4gICAgICB9KSk7XG4gICAgfVxuICAgIGNvbnN0IGNoYXJ0ID0gdGhpcy5hZGRIZWxtQ2hhcnQoY2x1c3RlckluZm8sIHZhbHVlcyk7XG4gICAgY2hhcnQubm9kZS5hZGREZXBlbmRlbmN5KHNhKTtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGNoYXJ0KTtcbiAgfVxufVxuXG4vKipcbiAqIHBvcHVsYXRlVmFsdWVzIHBvcHVsYXRlcyB0aGUgYXBwcm9wcmlhdGUgdmFsdWVzIHVzZWQgdG8gY3VzdG9taXplIHRoZSBIZWxtIGNoYXJ0XG4gKiBAcGFyYW0gaGVsbU9wdGlvbnMgVXNlciBwcm92aWRlZCB2YWx1ZXMgdG8gY3VzdG9taXplIHRoZSBjaGFydFxuICovXG5mdW5jdGlvbiBwb3B1bGF0ZVZhbHVlcyhoZWxtT3B0aW9uczogQWNrQWRkT25Qcm9wcywgYXdzUmVnaW9uOiBzdHJpbmcpOiBWYWx1ZXMge1xuICBjb25zdCB2YWx1ZXMgPSBoZWxtT3B0aW9ucy52YWx1ZXMgPz8ge307XG4gIHNldFBhdGgodmFsdWVzLCBcImF3cy5yZWdpb25cIiwgYXdzUmVnaW9uKTtcbiAgc2V0UGF0aCh2YWx1ZXMsXCJzZXJ2aWNlQWNjb3VudC5jcmVhdGVcIiwgZmFsc2UpO1xuICBzZXRQYXRoKHZhbHVlcyxcInNlcnZpY2VBY2NvdW50Lm5hbWVcIiwgaGVsbU9wdGlvbnMuc2FOYW1lKTtcbiAgcmV0dXJuIHZhbHVlcztcbn1cblxuLyoqXG4gKiBwb3B1bGF0ZSBwYXJhbWV0ZXJzIHBhc3NlZCBvciB0aGUgZGVmYXVsdCB2YWx1ZXMgZnJvbSBzZXJ2aWNlIE1hcHBpbmdzLlxuICovXG5mdW5jdGlvbiBwb3B1bGF0ZURlZmF1bHRzKGRlZmF1bHRQcm9wczogQWNrQWRkT25Qcm9wcywgcHJvcHM/OiBBY2tBZGRPblByb3BzKTogQWNrQWRkT25Qcm9wcyB7XG4gIGxldCB0ZW1wUHJvcHMgOiBQYXJ0aWFsPEFja0FkZE9uUHJvcHM+ID0gey4uLnByb3BzID8/IHt9fTsgLy8gc2luY2UgcHJvcHMgbWF5IGJlIGVtcHR5XG4gIHRlbXBQcm9wcy5pZCA9IHRlbXBQcm9wcy5pZCA/PyBkZWZhdWx0UHJvcHMuaWQ7XG4gIHRlbXBQcm9wcy5zZXJ2aWNlTmFtZSA9IHRlbXBQcm9wcy5zZXJ2aWNlTmFtZSA/PyBkZWZhdWx0UHJvcHMuc2VydmljZU5hbWU7XG4gIHRlbXBQcm9wcy5uYW1lID0gdGVtcFByb3BzLm5hbWUgPz8gc2VydmljZU1hcHBpbmdzW3RlbXBQcm9wcy5zZXJ2aWNlTmFtZSFdIS5jaGFydDtcbiAgdGVtcFByb3BzLm5hbWVzcGFjZSA9IHRlbXBQcm9wcy5uYW1lc3BhY2UgPz8gZGVmYXVsdFByb3BzLm5hbWVzcGFjZTtcbiAgdGVtcFByb3BzLmNoYXJ0ID0gdGVtcFByb3BzLmNoYXJ0ID8/IHNlcnZpY2VNYXBwaW5nc1t0ZW1wUHJvcHMuc2VydmljZU5hbWUhXT8uY2hhcnQ7XG4gIHRlbXBQcm9wcy52ZXJzaW9uID0gdGVtcFByb3BzLnZlcnNpb24gPz8gc2VydmljZU1hcHBpbmdzW3RlbXBQcm9wcy5zZXJ2aWNlTmFtZSFdPy52ZXJzaW9uO1xuICBjb25zdCByZXBvc2l0b3J5VXJsID0gXCJvY2k6Ly9wdWJsaWMuZWNyLmF3cy9hd3MtY29udHJvbGxlcnMtazhzXCI7XG4gIHRlbXBQcm9wcy5yZWxlYXNlID0gdGVtcFByb3BzLnJlbGVhc2UgPz8gdGVtcFByb3BzLmNoYXJ0O1xuICB0ZW1wUHJvcHMucmVwb3NpdG9yeSA9IHRlbXBQcm9wcy5yZXBvc2l0b3J5ID8/IGAke3JlcG9zaXRvcnlVcmx9LyR7dGVtcFByb3BzLm5hbWV9YDtcbiAgdGVtcFByb3BzLm1hbmFnZWRQb2xpY3lOYW1lID0gdGVtcFByb3BzLm1hbmFnZWRQb2xpY3lOYW1lID8/IHNlcnZpY2VNYXBwaW5nc1t0ZW1wUHJvcHMuc2VydmljZU5hbWUhXT8ubWFuYWdlZFBvbGljeU5hbWU7XG4gIHRlbXBQcm9wcy5pbmxpbmVQb2xpY3lTdGF0ZW1lbnRzID0gdGVtcFByb3BzLmlubGluZVBvbGljeVN0YXRlbWVudHMgPz8gc2VydmljZU1hcHBpbmdzW3RlbXBQcm9wcy5zZXJ2aWNlTmFtZSFdPy5pbmxpbmVQb2xpY3lTdGF0ZW1lbnRzO1xuICB0ZW1wUHJvcHMuY3JlYXRlTmFtZXNwYWNlID0gdGVtcFByb3BzLmNyZWF0ZU5hbWVzcGFjZSA/PyBkZWZhdWx0UHJvcHMuY3JlYXRlTmFtZXNwYWNlO1xuICB0ZW1wUHJvcHMuc2FOYW1lID0gdGVtcFByb3BzLnNhTmFtZSA/PyBgJHt0ZW1wUHJvcHMuY2hhcnR9LXNhYDtcbiAgcmV0dXJuIHRlbXBQcm9wcyBhcyBBY2tBZGRPblByb3BzO1xufVxuIl19