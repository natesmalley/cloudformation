"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrafanaOperatorAddon = void 0;
const ts_deepmerge_1 = require("ts-deepmerge");
const utils_1 = require("../../utils");
const helm_addon_1 = require("../helm-addon");
/**
 * Default props to be used when creating the Helm chart
 */
const defaultProps = {
    name: 'grafana-operator',
    chart: 'oci://ghcr.io/grafana/helm-charts/grafana-operator',
    namespace: 'grafana-operator',
    release: 'grafana-operator',
    version: 'v5.6.0',
    values: {},
    createNamespace: true
};
/**
 * Main class to instantiate the Helm chart
 */
let GrafanaOperatorAddon = class GrafanaOperatorAddon extends helm_addon_1.HelmAddOn {
    constructor(props) {
        super({ ...defaultProps, ...props });
        this.options = this.props;
    }
    deploy(clusterInfo) {
        var _a, _b;
        const cluster = clusterInfo.cluster;
        let values = (_a = this.options.values) !== null && _a !== void 0 ? _a : {};
        values = (0, ts_deepmerge_1.merge)(values, (_b = this.props.values) !== null && _b !== void 0 ? _b : {});
        const chart = this.addHelmChart(clusterInfo, values);
        if (this.options.createNamespace == true) {
            // Let CDK Create the Namespace
            const namespace = (0, utils_1.createNamespace)(this.options.namespace, cluster);
            chart.node.addDependency(namespace);
        }
        return Promise.resolve(chart);
    }
};
exports.GrafanaOperatorAddon = GrafanaOperatorAddon;
exports.GrafanaOperatorAddon = GrafanaOperatorAddon = __decorate([
    utils_1.supportsALL
], GrafanaOperatorAddon);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL2dyYWZhbmEtb3BlcmF0b3IvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0EsK0NBQXFDO0FBRXJDLHVDQUEyRDtBQUMzRCw4Q0FBOEU7QUFXOUU7O0dBRUc7QUFDSCxNQUFNLFlBQVksR0FBK0M7SUFDL0QsSUFBSSxFQUFFLGtCQUFrQjtJQUN4QixLQUFLLEVBQUUsb0RBQW9EO0lBQzNELFNBQVMsRUFBRSxrQkFBa0I7SUFDN0IsT0FBTyxFQUFFLGtCQUFrQjtJQUMzQixPQUFPLEVBQUUsUUFBUTtJQUNqQixNQUFNLEVBQUUsRUFBRTtJQUNWLGVBQWUsRUFBRSxJQUFJO0NBQ3RCLENBQUM7QUFFRjs7R0FFRztBQUVJLElBQU0sb0JBQW9CLEdBQTFCLE1BQU0sb0JBQXFCLFNBQVEsc0JBQVM7SUFJakQsWUFBWSxLQUFpQztRQUMzQyxLQUFLLENBQUMsRUFBQyxHQUFHLFlBQVksRUFBRSxHQUFHLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBa0MsQ0FBQztJQUN6RCxDQUFDO0lBRUQsTUFBTSxDQUFDLFdBQXdCOztRQUM3QixNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDO1FBQ3BDLElBQUksTUFBTSxHQUFXLE1BQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLG1DQUFJLEVBQUUsQ0FBQztRQUMvQyxNQUFNLEdBQUcsSUFBQSxvQkFBSyxFQUFDLE1BQU0sRUFBRSxNQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxtQ0FBSSxFQUFFLENBQUMsQ0FBQztRQUNoRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVyRCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxJQUFJLElBQUksRUFBQyxDQUFDO1lBQ3hDLCtCQUErQjtZQUMvQixNQUFNLFNBQVMsR0FBRyxJQUFBLHVCQUFlLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFVLEVBQUcsT0FBTyxDQUFDLENBQUM7WUFDckUsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUNELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDO0NBQ0YsQ0FBQTtBQXRCWSxvREFBb0I7K0JBQXBCLG9CQUFvQjtJQURoQyxtQkFBVztHQUNDLG9CQUFvQixDQXNCaEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tIFwidHMtZGVlcG1lcmdlXCI7XHJcbmltcG9ydCB7IENsdXN0ZXJJbmZvLCBWYWx1ZXMgfSBmcm9tIFwiLi4vLi4vc3BpXCI7XHJcbmltcG9ydCB7IGNyZWF0ZU5hbWVzcGFjZSwgc3VwcG9ydHNBTEwgfSBmcm9tIFwiLi4vLi4vdXRpbHNcIjtcclxuaW1wb3J0IHsgSGVsbUFkZE9uLCBIZWxtQWRkT25Qcm9wcywgSGVsbUFkZE9uVXNlclByb3BzIH0gZnJvbSBcIi4uL2hlbG0tYWRkb25cIjtcclxuLyoqXHJcbiAqIFVzZXIgcHJvdmlkZWQgb3B0aW9ucyBmb3IgdGhlIEhlbG0gQ2hhcnRcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgR3JhZmFuYU9wZXJhdG9yQWRkb25Qcm9wcyBleHRlbmRzIEhlbG1BZGRPblVzZXJQcm9wcyB7XHJcbiAgLyoqXHJcbiAgICogVG8gQ3JlYXRlIE5hbWVzcGFjZSB1c2luZyBDREtcclxuICAgKi8gICAgXHJcbiAgY3JlYXRlTmFtZXNwYWNlPzogYm9vbGVhbjtcclxufVxyXG5cclxuLyoqXHJcbiAqIERlZmF1bHQgcHJvcHMgdG8gYmUgdXNlZCB3aGVuIGNyZWF0aW5nIHRoZSBIZWxtIGNoYXJ0XHJcbiAqL1xyXG5jb25zdCBkZWZhdWx0UHJvcHM6IEhlbG1BZGRPblByb3BzICYgR3JhZmFuYU9wZXJhdG9yQWRkb25Qcm9wcyA9IHtcclxuICBuYW1lOiAnZ3JhZmFuYS1vcGVyYXRvcicsXHJcbiAgY2hhcnQ6ICdvY2k6Ly9naGNyLmlvL2dyYWZhbmEvaGVsbS1jaGFydHMvZ3JhZmFuYS1vcGVyYXRvcicsXHJcbiAgbmFtZXNwYWNlOiAnZ3JhZmFuYS1vcGVyYXRvcicsXHJcbiAgcmVsZWFzZTogJ2dyYWZhbmEtb3BlcmF0b3InLFxyXG4gIHZlcnNpb246ICd2NS42LjAnLFxyXG4gIHZhbHVlczoge30sIFxyXG4gIGNyZWF0ZU5hbWVzcGFjZTogdHJ1ZVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIE1haW4gY2xhc3MgdG8gaW5zdGFudGlhdGUgdGhlIEhlbG0gY2hhcnRcclxuICovXHJcbkBzdXBwb3J0c0FMTFxyXG5leHBvcnQgY2xhc3MgR3JhZmFuYU9wZXJhdG9yQWRkb24gZXh0ZW5kcyBIZWxtQWRkT24ge1xyXG5cclxuICByZWFkb25seSBvcHRpb25zOiBHcmFmYW5hT3BlcmF0b3JBZGRvblByb3BzO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcz86IEdyYWZhbmFPcGVyYXRvckFkZG9uUHJvcHMpIHtcclxuICAgIHN1cGVyKHsuLi5kZWZhdWx0UHJvcHMsIC4uLnByb3BzfSk7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLnByb3BzIGFzIEdyYWZhbmFPcGVyYXRvckFkZG9uUHJvcHM7XHJcbiAgfVxyXG5cclxuICBkZXBsb3koY2x1c3RlckluZm86IENsdXN0ZXJJbmZvKTogUHJvbWlzZTxDb25zdHJ1Y3Q+IHtcclxuICAgIGNvbnN0IGNsdXN0ZXIgPSBjbHVzdGVySW5mby5jbHVzdGVyO1xyXG4gICAgbGV0IHZhbHVlczogVmFsdWVzID0gdGhpcy5vcHRpb25zLnZhbHVlcyA/PyB7fTtcclxuICAgIHZhbHVlcyA9IG1lcmdlKHZhbHVlcywgdGhpcy5wcm9wcy52YWx1ZXMgPz8ge30pO1xyXG4gICAgY29uc3QgY2hhcnQgPSB0aGlzLmFkZEhlbG1DaGFydChjbHVzdGVySW5mbywgdmFsdWVzKTtcclxuXHJcbiAgICBpZiggdGhpcy5vcHRpb25zLmNyZWF0ZU5hbWVzcGFjZSA9PSB0cnVlKXtcclxuICAgICAgLy8gTGV0IENESyBDcmVhdGUgdGhlIE5hbWVzcGFjZVxyXG4gICAgICBjb25zdCBuYW1lc3BhY2UgPSBjcmVhdGVOYW1lc3BhY2UodGhpcy5vcHRpb25zLm5hbWVzcGFjZSEgLCBjbHVzdGVyKTtcclxuICAgICAgY2hhcnQubm9kZS5hZGREZXBlbmRlbmN5KG5hbWVzcGFjZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGNoYXJ0KTtcclxuICB9XHJcbn0iXX0=