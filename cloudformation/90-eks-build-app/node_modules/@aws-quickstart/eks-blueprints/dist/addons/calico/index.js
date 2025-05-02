"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalicoAddOn = void 0;
const dot = require("dot-object");
const ts_deepmerge_1 = require("ts-deepmerge");
const helm_addon_1 = require("../helm-addon");
const utils_1 = require("../../utils");
/**
 * Defaults options for the add-on
 */
const defaultProps = {
    name: 'calico-addon',
    namespace: 'kube-system',
    version: '0.3.10',
    chart: "aws-calico",
    release: "blueprints-addon-calico",
    repository: "https://aws.github.io/eks-charts"
};
/**
 * @deprecated use CalicoOperator add-on instead
 */
let CalicoAddOn = class CalicoAddOn extends helm_addon_1.HelmAddOn {
    constructor(props) {
        super({ ...defaultProps, ...props });
        this.options = this.props;
    }
    deploy(clusterInfo) {
        var _a;
        const values = (_a = this.options.values) !== null && _a !== void 0 ? _a : {};
        const defaultValues = {};
        dot.set("calico.node.resources.requests.memory", "64Mi", defaultValues, true);
        dot.set("calico.node.resources.limits.memory", "100Mi", defaultValues, true);
        const merged = (0, ts_deepmerge_1.merge)(defaultValues, values);
        this.addHelmChart(clusterInfo, merged);
    }
};
exports.CalicoAddOn = CalicoAddOn;
exports.CalicoAddOn = CalicoAddOn = __decorate([
    utils_1.supportsX86
], CalicoAddOn);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL2NhbGljby9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxrQ0FBa0M7QUFDbEMsK0NBQXFDO0FBRXJDLDhDQUE4RDtBQUM5RCx1Q0FBMEM7QUEwQjFDOztHQUVHO0FBQ0gsTUFBTSxZQUFZLEdBQUc7SUFDakIsSUFBSSxFQUFFLGNBQWM7SUFDcEIsU0FBUyxFQUFFLGFBQWE7SUFDeEIsT0FBTyxFQUFFLFFBQVE7SUFDakIsS0FBSyxFQUFFLFlBQVk7SUFDbkIsT0FBTyxFQUFFLHlCQUF5QjtJQUNsQyxVQUFVLEVBQUUsa0NBQWtDO0NBQ2pELENBQUM7QUFFRjs7R0FFRztBQUVJLElBQU0sV0FBVyxHQUFqQixNQUFNLFdBQVksU0FBUSxzQkFBUztJQUl0QyxZQUFZLEtBQXdCO1FBQ2hDLEtBQUssQ0FBQyxFQUFDLEdBQUcsWUFBWSxFQUFFLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDOUIsQ0FBQztJQUVELE1BQU0sQ0FBQyxXQUF3Qjs7UUFDM0IsTUFBTSxNQUFNLEdBQUcsTUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sbUNBQUksRUFBRSxDQUFDO1FBQ3pDLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUV6QixHQUFHLENBQUMsR0FBRyxDQUFDLHVDQUF1QyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDOUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTdFLE1BQU0sTUFBTSxHQUFHLElBQUEsb0JBQUssRUFBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFNUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0MsQ0FBQztDQUNKLENBQUE7QUFwQlksa0NBQVc7c0JBQVgsV0FBVztJQUR2QixtQkFBVztHQUNDLFdBQVcsQ0FvQnZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZG90IGZyb20gJ2RvdC1vYmplY3QnO1xuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tIFwidHMtZGVlcG1lcmdlXCI7XG5pbXBvcnQgeyBDbHVzdGVySW5mbyB9IGZyb20gXCIuLi8uLi9zcGlcIjtcbmltcG9ydCB7IEhlbG1BZGRPbiwgSGVsbUFkZE9uVXNlclByb3BzIH0gZnJvbSBcIi4uL2hlbG0tYWRkb25cIjtcbmltcG9ydCB7IHN1cHBvcnRzWDg2IH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3IgdGhlIGFkZC1vbi5cbiAqIEBkZXByZWNhdGVkXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2FsaWNvQWRkT25Qcm9wcyBleHRlbmRzIEhlbG1BZGRPblVzZXJQcm9wcyB7XG5cbiAgICAvKipcbiAgICAgKiBOYW1lc3BhY2Ugd2hlcmUgQ2FsaWNvIHdpbGwgYmUgaW5zdGFsbGVkXG4gICAgICogQGRlZmF1bHQga3ViZS1zeXN0ZW1cbiAgICAgKi9cbiAgICBuYW1lc3BhY2U/OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBIZWxtIGNoYXJ0IHZlcnNpb24gdG8gdXNlIHRvIGluc3RhbGwuXG4gICAgICogQGRlZmF1bHQgMC4zLjEwXG4gICAgICovXG4gICAgdmVyc2lvbj86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFZhbHVlcyBmb3IgdGhlIEhlbG0gY2hhcnQuXG4gICAgICovXG4gICAgdmFsdWVzPzogYW55O1xufVxuXG4vKipcbiAqIERlZmF1bHRzIG9wdGlvbnMgZm9yIHRoZSBhZGQtb25cbiAqL1xuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgIG5hbWU6ICdjYWxpY28tYWRkb24nLFxuICAgIG5hbWVzcGFjZTogJ2t1YmUtc3lzdGVtJyxcbiAgICB2ZXJzaW9uOiAnMC4zLjEwJyxcbiAgICBjaGFydDogXCJhd3MtY2FsaWNvXCIsXG4gICAgcmVsZWFzZTogXCJibHVlcHJpbnRzLWFkZG9uLWNhbGljb1wiLFxuICAgIHJlcG9zaXRvcnk6IFwiaHR0cHM6Ly9hd3MuZ2l0aHViLmlvL2Vrcy1jaGFydHNcIlxufTtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCB1c2UgQ2FsaWNvT3BlcmF0b3IgYWRkLW9uIGluc3RlYWRcbiAqL1xuQHN1cHBvcnRzWDg2XG5leHBvcnQgY2xhc3MgQ2FsaWNvQWRkT24gZXh0ZW5kcyBIZWxtQWRkT24ge1xuXG4gICAgcHJpdmF0ZSBvcHRpb25zOiBDYWxpY29BZGRPblByb3BzO1xuXG4gICAgY29uc3RydWN0b3IocHJvcHM/OiBDYWxpY29BZGRPblByb3BzKSB7XG4gICAgICAgIHN1cGVyKHsuLi5kZWZhdWx0UHJvcHMsIC4uLnByb3BzIH0pO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLnByb3BzO1xuICAgIH1cblxuICAgIGRlcGxveShjbHVzdGVySW5mbzogQ2x1c3RlckluZm8pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gdGhpcy5vcHRpb25zLnZhbHVlcyA/PyB7fTtcbiAgICAgICAgY29uc3QgZGVmYXVsdFZhbHVlcyA9IHt9O1xuXG4gICAgICAgIGRvdC5zZXQoXCJjYWxpY28ubm9kZS5yZXNvdXJjZXMucmVxdWVzdHMubWVtb3J5XCIsIFwiNjRNaVwiLCBkZWZhdWx0VmFsdWVzLCB0cnVlKTtcbiAgICAgICAgZG90LnNldChcImNhbGljby5ub2RlLnJlc291cmNlcy5saW1pdHMubWVtb3J5XCIsIFwiMTAwTWlcIiwgZGVmYXVsdFZhbHVlcywgdHJ1ZSk7XG5cbiAgICAgICAgY29uc3QgbWVyZ2VkID0gbWVyZ2UoZGVmYXVsdFZhbHVlcywgdmFsdWVzKTtcblxuICAgICAgICB0aGlzLmFkZEhlbG1DaGFydChjbHVzdGVySW5mbywgbWVyZ2VkKTtcbiAgICB9XG59XG4iXX0=