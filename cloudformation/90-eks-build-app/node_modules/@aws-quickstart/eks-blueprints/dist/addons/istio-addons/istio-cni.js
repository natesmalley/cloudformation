"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IstioCniAddon = void 0;
const helm_addon_1 = require("../helm-addon");
const utils_1 = require("../../utils");
const istio_base_1 = require("./istio-base");
const defaultProps = {
    name: 'istio-cni',
    release: 'cni',
    namespace: 'istio-system',
    chart: 'cni',
    version: istio_base_1.ISTIO_VERSION,
    repository: 'https://istio-release.storage.googleapis.com/charts',
    values: {},
    createNamespace: false
};
let IstioCniAddon = class IstioCniAddon extends helm_addon_1.HelmAddOn {
    constructor(props) {
        super({ ...defaultProps, ...props });
    }
    deploy(clusterInfo) {
        const chart = this.addHelmChart(clusterInfo, this.props.values);
        return Promise.resolve(chart);
    }
};
exports.IstioCniAddon = IstioCniAddon;
__decorate([
    (0, utils_1.dependable)('IstioBaseAddOn', 'IstioControlPlaneAddOn')
], IstioCniAddon.prototype, "deploy", null);
exports.IstioCniAddon = IstioCniAddon = __decorate([
    utils_1.supportsALL
], IstioCniAddon);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXN0aW8tY25pLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL2FkZG9ucy9pc3Rpby1hZGRvbnMvaXN0aW8tY25pLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUVBLDhDQUE4RTtBQUM5RSx1Q0FBc0Q7QUFDdEQsNkNBQTZDO0FBWTdDLE1BQU0sWUFBWSxHQUF3QztJQUN0RCxJQUFJLEVBQUUsV0FBVztJQUNqQixPQUFPLEVBQUUsS0FBSztJQUNkLFNBQVMsRUFBRSxjQUFjO0lBQ3pCLEtBQUssRUFBRSxLQUFLO0lBQ1osT0FBTyxFQUFFLDBCQUFhO0lBQ3RCLFVBQVUsRUFBRSxxREFBcUQ7SUFDakUsTUFBTSxFQUFFLEVBQUU7SUFDVixlQUFlLEVBQUUsS0FBSztDQUN6QixDQUFDO0FBR0ssSUFBTSxhQUFhLEdBQW5CLE1BQU0sYUFBYyxTQUFRLHNCQUFTO0lBRXhDLFlBQVksS0FBMEI7UUFDbEMsS0FBSyxDQUFDLEVBQUUsR0FBRyxZQUFZLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFHRCxNQUFNLENBQUMsV0FBd0I7UUFFM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoRSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQztDQUNKLENBQUE7QUFaWSxzQ0FBYTtBQU90QjtJQURDLElBQUEsa0JBQVUsRUFBQyxnQkFBZ0IsRUFBQyx3QkFBd0IsQ0FBQzsyQ0FLckQ7d0JBWFEsYUFBYTtJQUR6QixtQkFBVztHQUNDLGFBQWEsQ0FZekIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENsdXN0ZXJJbmZvIH0gZnJvbSBcIi4uLy4uL3NwaVwiO1xuaW1wb3J0IHsgSGVsbUFkZE9uLCBIZWxtQWRkT25Qcm9wcywgSGVsbUFkZE9uVXNlclByb3BzIH0gZnJvbSBcIi4uL2hlbG0tYWRkb25cIjtcbmltcG9ydCB7IGRlcGVuZGFibGUsIHN1cHBvcnRzQUxMIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHsgSVNUSU9fVkVSU0lPTiB9IGZyb20gJy4vaXN0aW8tYmFzZSc7XG5cbi8qKlxuICogVXNlciBwcm92aWRlZCBvcHRpb24gZm9yIHRoZSBIZWxtIENoYXJ0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSXN0aW9DbmlBZGRvblByb3BzIGV4dGVuZHMgSGVsbUFkZE9uVXNlclByb3BzIHtcbiAgICAvKipcbiAgICAgKiBUbyBDcmVhdGUgTmFtZXNwYWNlIHVzaW5nIENES1xuICAgICAqLyAgICBcbiAgICBjcmVhdGVOYW1lc3BhY2U/OiBib29sZWFuO1xufVxuXG5jb25zdCBkZWZhdWx0UHJvcHM6IEhlbG1BZGRPblByb3BzICYgSXN0aW9DbmlBZGRvblByb3BzID0ge1xuICAgIG5hbWU6ICdpc3Rpby1jbmknLFxuICAgIHJlbGVhc2U6ICdjbmknLFxuICAgIG5hbWVzcGFjZTogJ2lzdGlvLXN5c3RlbScsXG4gICAgY2hhcnQ6ICdjbmknLFxuICAgIHZlcnNpb246IElTVElPX1ZFUlNJT04sXG4gICAgcmVwb3NpdG9yeTogJ2h0dHBzOi8vaXN0aW8tcmVsZWFzZS5zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2NoYXJ0cycsXG4gICAgdmFsdWVzOiB7fSwgXG4gICAgY3JlYXRlTmFtZXNwYWNlOiBmYWxzZVxufTtcblxuQHN1cHBvcnRzQUxMXG5leHBvcnQgY2xhc3MgSXN0aW9DbmlBZGRvbiBleHRlbmRzIEhlbG1BZGRPbiB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcz86IElzdGlvQ25pQWRkb25Qcm9wcykge1xuICAgICAgICBzdXBlcih7IC4uLmRlZmF1bHRQcm9wcywgLi4ucHJvcHMgfSk7XG4gICAgfVxuXG4gICAgQGRlcGVuZGFibGUoJ0lzdGlvQmFzZUFkZE9uJywnSXN0aW9Db250cm9sUGxhbmVBZGRPbicpXG4gICAgZGVwbG95KGNsdXN0ZXJJbmZvOiBDbHVzdGVySW5mbyk6IHZvaWQgfCBQcm9taXNlPENvbnN0cnVjdD4ge1xuICAgICAgICBcbiAgICAgICAgY29uc3QgY2hhcnQgPSB0aGlzLmFkZEhlbG1DaGFydChjbHVzdGVySW5mbywgdGhpcy5wcm9wcy52YWx1ZXMpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGNoYXJ0KTtcbiAgICB9XG59Il19