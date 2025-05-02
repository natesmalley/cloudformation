"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IstioIngressGatewayAddon = void 0;
const helm_addon_1 = require("../helm-addon");
const utils_1 = require("../../utils");
const istio_base_1 = require("./istio-base");
const defaultProps = {
    name: 'istio-ingressgateway',
    release: 'ingressgateway',
    namespace: 'istio-system',
    chart: 'gateway',
    version: istio_base_1.ISTIO_VERSION,
    repository: 'https://istio-release.storage.googleapis.com/charts',
    values: {},
    createNamespace: false
};
let IstioIngressGatewayAddon = class IstioIngressGatewayAddon extends helm_addon_1.HelmAddOn {
    constructor(props) {
        super({ ...defaultProps, ...props });
    }
    deploy(clusterInfo) {
        const chart = this.addHelmChart(clusterInfo, this.props.values);
        return Promise.resolve(chart);
    }
};
exports.IstioIngressGatewayAddon = IstioIngressGatewayAddon;
__decorate([
    (0, utils_1.dependable)('IstioBaseAddOn', 'IstioControlPlaneAddOn')
], IstioIngressGatewayAddon.prototype, "deploy", null);
exports.IstioIngressGatewayAddon = IstioIngressGatewayAddon = __decorate([
    utils_1.supportsALL
], IstioIngressGatewayAddon);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXN0aW8taW5ncmVzcy1nYXRld2F5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL2FkZG9ucy9pc3Rpby1hZGRvbnMvaXN0aW8taW5ncmVzcy1nYXRld2F5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUVBLDhDQUE4RTtBQUM5RSx1Q0FBc0Q7QUFDdEQsNkNBQTZDO0FBWTdDLE1BQU0sWUFBWSxHQUFtRDtJQUNqRSxJQUFJLEVBQUUsc0JBQXNCO0lBQzVCLE9BQU8sRUFBRSxnQkFBZ0I7SUFDekIsU0FBUyxFQUFFLGNBQWM7SUFDekIsS0FBSyxFQUFFLFNBQVM7SUFDaEIsT0FBTyxFQUFFLDBCQUFhO0lBQ3RCLFVBQVUsRUFBRSxxREFBcUQ7SUFDakUsTUFBTSxFQUFFLEVBQUU7SUFDVixlQUFlLEVBQUUsS0FBSztDQUN6QixDQUFDO0FBR0ssSUFBTSx3QkFBd0IsR0FBOUIsTUFBTSx3QkFBeUIsU0FBUSxzQkFBUztJQUVuRCxZQUFZLEtBQXFDO1FBQzdDLEtBQUssQ0FBQyxFQUFFLEdBQUcsWUFBWSxFQUFFLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBR0QsTUFBTSxDQUFDLFdBQXdCO1FBRTNCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLENBQUM7Q0FDSixDQUFBO0FBWlksNERBQXdCO0FBT2pDO0lBREMsSUFBQSxrQkFBVSxFQUFDLGdCQUFnQixFQUFDLHdCQUF3QixDQUFDO3NEQUtyRDttQ0FYUSx3QkFBd0I7SUFEcEMsbUJBQVc7R0FDQyx3QkFBd0IsQ0FZcEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENsdXN0ZXJJbmZvIH0gZnJvbSBcIi4uLy4uL3NwaVwiO1xuaW1wb3J0IHsgSGVsbUFkZE9uLCBIZWxtQWRkT25Qcm9wcywgSGVsbUFkZE9uVXNlclByb3BzIH0gZnJvbSBcIi4uL2hlbG0tYWRkb25cIjtcbmltcG9ydCB7IGRlcGVuZGFibGUsIHN1cHBvcnRzQUxMIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHsgSVNUSU9fVkVSU0lPTiB9IGZyb20gJy4vaXN0aW8tYmFzZSc7XG5cbi8qKlxuICogVXNlciBwcm92aWRlZCBvcHRpb24gZm9yIHRoZSBIZWxtIENoYXJ0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSXN0aW9JbmdyZXNzR2F0ZXdheUFkZG9uUHJvcHMgZXh0ZW5kcyBIZWxtQWRkT25Vc2VyUHJvcHMge1xuICAgIC8qKlxuICAgICAqIFRvIENyZWF0ZSBOYW1lc3BhY2UgdXNpbmcgQ0RLXG4gICAgICovICAgIFxuICAgIGNyZWF0ZU5hbWVzcGFjZT86IGJvb2xlYW47XG59XG5cbmNvbnN0IGRlZmF1bHRQcm9wczogSGVsbUFkZE9uUHJvcHMgJiBJc3Rpb0luZ3Jlc3NHYXRld2F5QWRkb25Qcm9wcyA9IHtcbiAgICBuYW1lOiAnaXN0aW8taW5ncmVzc2dhdGV3YXknLFxuICAgIHJlbGVhc2U6ICdpbmdyZXNzZ2F0ZXdheScsXG4gICAgbmFtZXNwYWNlOiAnaXN0aW8tc3lzdGVtJyxcbiAgICBjaGFydDogJ2dhdGV3YXknLFxuICAgIHZlcnNpb246IElTVElPX1ZFUlNJT04sXG4gICAgcmVwb3NpdG9yeTogJ2h0dHBzOi8vaXN0aW8tcmVsZWFzZS5zdG9yYWdlLmdvb2dsZWFwaXMuY29tL2NoYXJ0cycsXG4gICAgdmFsdWVzOiB7fSxcbiAgICBjcmVhdGVOYW1lc3BhY2U6IGZhbHNlXG59O1xuXG5Ac3VwcG9ydHNBTExcbmV4cG9ydCBjbGFzcyBJc3Rpb0luZ3Jlc3NHYXRld2F5QWRkb24gZXh0ZW5kcyBIZWxtQWRkT24ge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHM/OiBJc3Rpb0luZ3Jlc3NHYXRld2F5QWRkb25Qcm9wcykgeyBcbiAgICAgICAgc3VwZXIoeyAuLi5kZWZhdWx0UHJvcHMsIC4uLnByb3BzIH0pO1xuICAgIH1cbiAgICBcbiAgICBAZGVwZW5kYWJsZSgnSXN0aW9CYXNlQWRkT24nLCdJc3Rpb0NvbnRyb2xQbGFuZUFkZE9uJylcbiAgICBkZXBsb3koY2x1c3RlckluZm86IENsdXN0ZXJJbmZvKTogdm9pZCB8IFByb21pc2U8Q29uc3RydWN0PiB7XG5cbiAgICAgICAgY29uc3QgY2hhcnQgPSB0aGlzLmFkZEhlbG1DaGFydChjbHVzdGVySW5mbywgdGhpcy5wcm9wcy52YWx1ZXMpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGNoYXJ0KTtcbiAgICB9XG59Il19