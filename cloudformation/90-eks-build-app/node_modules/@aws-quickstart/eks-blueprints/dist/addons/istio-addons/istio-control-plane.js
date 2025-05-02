"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IstioControlPlaneAddOn = void 0;
const ts_deepmerge_1 = require("ts-deepmerge");
const helm_addon_1 = require("../helm-addon");
const utils_1 = require("../../utils");
const istio_base_1 = require("./istio-base");
const defaultProps = {
    name: "istiod",
    release: "istiod",
    namespace: "istio-system",
    chart: "istiod",
    version: istio_base_1.ISTIO_VERSION,
    repository: "https://istio-release.storage.googleapis.com/charts"
};
let IstioControlPlaneAddOn = class IstioControlPlaneAddOn extends helm_addon_1.HelmAddOn {
    constructor(props) {
        super({ ...defaultProps, ...props });
    }
    deploy(clusterInfo) {
        var _a;
        const cluster = clusterInfo.cluster;
        let values = {
            awsRegion: cluster.stack.region,
        };
        values = (0, ts_deepmerge_1.merge)(values, (_a = this.props.values) !== null && _a !== void 0 ? _a : {});
        const chart = this.addHelmChart(clusterInfo, values);
        return Promise.resolve(chart);
    }
};
exports.IstioControlPlaneAddOn = IstioControlPlaneAddOn;
__decorate([
    (0, utils_1.dependable)('IstioBaseAddOn')
], IstioControlPlaneAddOn.prototype, "deploy", null);
exports.IstioControlPlaneAddOn = IstioControlPlaneAddOn = __decorate([
    utils_1.supportsALL
], IstioControlPlaneAddOn);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXN0aW8tY29udHJvbC1wbGFuZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9hZGRvbnMvaXN0aW8tYWRkb25zL2lzdGlvLWNvbnRyb2wtcGxhbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0EsK0NBQXFDO0FBRXJDLDhDQUE4RDtBQUM5RCx1Q0FBc0Q7QUFFdEQsNkNBQTZDO0FBTTdDLE1BQU0sWUFBWSxHQUFHO0lBQ2pCLElBQUksRUFBRSxRQUFRO0lBQ2QsT0FBTyxFQUFFLFFBQVE7SUFDakIsU0FBUyxFQUFFLGNBQWM7SUFDekIsS0FBSyxFQUFFLFFBQVE7SUFDZixPQUFPLEVBQUUsMEJBQWE7SUFDdEIsVUFBVSxFQUFFLHFEQUFxRDtDQUNwRSxDQUFDO0FBR0ssSUFBTSxzQkFBc0IsR0FBNUIsTUFBTSxzQkFBdUIsU0FBUSxzQkFBUztJQUVqRCxZQUFZLEtBQW1DO1FBQzNDLEtBQUssQ0FBQyxFQUFFLEdBQUcsWUFBWSxFQUFFLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBR0QsTUFBTSxDQUFDLFdBQXdCOztRQUUzQixNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDO1FBRXBDLElBQUksTUFBTSxHQUFpQjtZQUN2QixTQUFTLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNO1NBQ2xDLENBQUM7UUFFRixNQUFNLEdBQUcsSUFBQSxvQkFBSyxFQUFDLE1BQU0sRUFBRSxNQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxtQ0FBSSxFQUFFLENBQUMsQ0FBQztRQUVoRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNyRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQztDQUNKLENBQUE7QUFwQlksd0RBQXNCO0FBTy9CO0lBREMsSUFBQSxrQkFBVSxFQUFDLGdCQUFnQixDQUFDO29EQWE1QjtpQ0FuQlEsc0JBQXNCO0lBRGxDLG1CQUFXO0dBQ0Msc0JBQXNCLENBb0JsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gXCJ0cy1kZWVwbWVyZ2VcIjtcbmltcG9ydCB7IENsdXN0ZXJJbmZvIH0gZnJvbSBcIi4uLy4uL3NwaVwiO1xuaW1wb3J0IHsgSGVsbUFkZE9uLCBIZWxtQWRkT25Vc2VyUHJvcHMgfSBmcm9tIFwiLi4vaGVsbS1hZGRvblwiO1xuaW1wb3J0IHsgZGVwZW5kYWJsZSwgc3VwcG9ydHNBTEwgfSBmcm9tICcuLi8uLi91dGlscyc7XG5pbXBvcnQgeyBWYWx1ZXNTY2hlbWEgfSBmcm9tIFwiLi9pc3Rpby1jb250cm9sLXBsYW5lLXZhbHVlc1wiO1xuaW1wb3J0IHsgSVNUSU9fVkVSU0lPTiB9IGZyb20gXCIuL2lzdGlvLWJhc2VcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJc3Rpb0NvbnRyb2xQbGFuZUFkZE9uUHJvcHMgZXh0ZW5kcyBIZWxtQWRkT25Vc2VyUHJvcHMge1xuICAgIHZhbHVlcz86IFZhbHVlc1NjaGVtYVxufVxuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgbmFtZTogXCJpc3Rpb2RcIixcbiAgICByZWxlYXNlOiBcImlzdGlvZFwiLFxuICAgIG5hbWVzcGFjZTogXCJpc3Rpby1zeXN0ZW1cIixcbiAgICBjaGFydDogXCJpc3Rpb2RcIixcbiAgICB2ZXJzaW9uOiBJU1RJT19WRVJTSU9OLFxuICAgIHJlcG9zaXRvcnk6IFwiaHR0cHM6Ly9pc3Rpby1yZWxlYXNlLnN0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vY2hhcnRzXCJcbn07XG5cbkBzdXBwb3J0c0FMTFxuZXhwb3J0IGNsYXNzIElzdGlvQ29udHJvbFBsYW5lQWRkT24gZXh0ZW5kcyBIZWxtQWRkT24ge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHM/OiBJc3Rpb0NvbnRyb2xQbGFuZUFkZE9uUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoeyAuLi5kZWZhdWx0UHJvcHMsIC4uLnByb3BzIH0pO1xuICAgIH1cblxuICAgIEBkZXBlbmRhYmxlKCdJc3Rpb0Jhc2VBZGRPbicpXG4gICAgZGVwbG95KGNsdXN0ZXJJbmZvOiBDbHVzdGVySW5mbyk6IFByb21pc2U8Q29uc3RydWN0PiB7XG5cbiAgICAgICAgY29uc3QgY2x1c3RlciA9IGNsdXN0ZXJJbmZvLmNsdXN0ZXI7XG5cbiAgICAgICAgbGV0IHZhbHVlczogVmFsdWVzU2NoZW1hID0ge1xuICAgICAgICAgICAgYXdzUmVnaW9uOiBjbHVzdGVyLnN0YWNrLnJlZ2lvbixcbiAgICAgICAgfTtcblxuICAgICAgICB2YWx1ZXMgPSBtZXJnZSh2YWx1ZXMsIHRoaXMucHJvcHMudmFsdWVzID8/IHt9KTtcblxuICAgICAgICBjb25zdCBjaGFydCA9IHRoaXMuYWRkSGVsbUNoYXJ0KGNsdXN0ZXJJbmZvLCB2YWx1ZXMpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGNoYXJ0KTtcbiAgICB9XG59XG5cbiJdfQ==