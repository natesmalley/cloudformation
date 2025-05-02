"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KNativeOperator = void 0;
const utils_1 = require("../../utils");
const kubectl_provider_1 = require("../helm-addon/kubectl-provider");
const defaultProps = {
    name: 'knative-operator',
    namespace: 'default',
    version: 'v1.8.1',
};
/**
 * Implementation of KNative add-on for EKS Blueprints. Installs KNative to the Cluster.
 */
let KNativeOperator = class KNativeOperator {
    constructor(props) {
        this.knativeAddOnProps = { ...defaultProps, ...props };
    }
    deploy(clusterInfo) {
        const BASE_URL = `https://github.com/knative/operator/releases/download/knative`;
        // Load External YAML: https://github.com/knative/operator/releases/download/knative-v1.8.1/operator.yaml
        const doc = (0, utils_1.loadExternalYaml)(BASE_URL + `-${this.knativeAddOnProps.version}/operator.yaml`).slice(0, 26); // the last element is null
        const kubectlProvider = new kubectl_provider_1.KubectlProvider(clusterInfo);
        const statement = kubectlProvider.addManifest({ manifest: doc, values: {}, name: 'knative-operator', namespace: this.knativeAddOnProps.namespace });
        return Promise.resolve(statement);
    }
};
exports.KNativeOperator = KNativeOperator;
__decorate([
    (0, utils_1.dependable)('IstioControlPlaneAddOn')
], KNativeOperator.prototype, "deploy", null);
exports.KNativeOperator = KNativeOperator = __decorate([
    utils_1.supportsALL
], KNativeOperator);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL2tuYXRpdmUtb3BlcmF0b3IvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRUEsdUNBQXVFO0FBRXZFLHFFQUFpRTtBQXlCakUsTUFBTSxZQUFZLEdBQUc7SUFDakIsSUFBSSxFQUFFLGtCQUFrQjtJQUN4QixTQUFTLEVBQUUsU0FBUztJQUNwQixPQUFPLEVBQUUsUUFBUTtDQUNwQixDQUFDO0FBRUY7O0dBRUc7QUFFSSxJQUFNLGVBQWUsR0FBckIsTUFBTSxlQUFlO0lBSXhCLFlBQVksS0FBNEI7UUFDcEMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsR0FBRyxZQUFZLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQztJQUMzRCxDQUFDO0lBR0QsTUFBTSxDQUFDLFdBQXdCO1FBQzNCLE1BQU0sUUFBUSxHQUFHLCtEQUErRCxDQUFDO1FBRWpGLHlHQUF5RztRQUN6RyxNQUFNLEdBQUcsR0FBRyxJQUFBLHdCQUFnQixFQUN4QixRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxnQkFBZ0IsQ0FDaEUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsMkJBQTJCO1FBRTNDLE1BQU0sZUFBZSxHQUFHLElBQUksa0NBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV6RCxNQUFNLFNBQVMsR0FBRyxlQUFlLENBQUMsV0FBVyxDQUN6QyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFVLEVBQUUsQ0FDeEcsQ0FBQztRQUVGLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN0QyxDQUFDO0NBQ0osQ0FBQTtBQXpCWSwwQ0FBZTtBQVN4QjtJQURDLElBQUEsa0JBQVUsRUFBQyx3QkFBd0IsQ0FBQzs2Q0FnQnBDOzBCQXhCUSxlQUFlO0lBRDNCLG1CQUFXO0dBQ0MsZUFBZSxDQXlCM0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENsdXN0ZXJBZGRPbiwgQ2x1c3RlckluZm8gfSBmcm9tIFwiLi4vLi4vc3BpXCI7XG5pbXBvcnQgeyBkZXBlbmRhYmxlLCBsb2FkRXh0ZXJuYWxZYW1sLCBzdXBwb3J0c0FMTH0gZnJvbSBcIi4uLy4uL3V0aWxzXCI7XG5pbXBvcnQgeyBIZWxtQWRkT25Vc2VyUHJvcHMgfSBmcm9tICcuLi9oZWxtLWFkZG9uJztcbmltcG9ydCB7IEt1YmVjdGxQcm92aWRlciB9IGZyb20gXCIuLi9oZWxtLWFkZG9uL2t1YmVjdGwtcHJvdmlkZXJcIjtcblxuLyoqXG4gKiBLbmF0aXZlIE9wZXJhdG9yIFByb3BlcnRpZXMgZXh0ZW5kZWQgXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgS25hdGl2ZU9wZXJhdG9yUHJvcHMgZXh0ZW5kcyBIZWxtQWRkT25Vc2VyUHJvcHMge1xuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lc3BhY2UgdG8gaW5zdGFsbCBLbmF0aXZlIGluXG4gICAgICogQGRlZmF1bHQgZGVmYXVsdFxuICAgICAqL1xuICAgIG5hbWVzcGFjZT86IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIHRvIGJlIGFzc2lnbmVkIHRvIGdpdmVuIHRvIHRoZSBLbmF0aXZlIG9wZXJhdG9yXG4gICAgICogQGRlZmF1bHQga25hdGl2ZS1vcGVyYXRvclxuICAgICAqL1xuICAgIG5hbWU/OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdmVyc2lvbiBvZiB0aGUgS05hdGl2ZSBPcGVyYXRvciB0byB1c2VcbiAgICAgKiBAZGVmYXVsdCB2MS44LjFcbiAgICAgKi9cbiAgICB2ZXJzaW9uPzogc3RyaW5nO1xufVxuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgbmFtZTogJ2tuYXRpdmUtb3BlcmF0b3InLFxuICAgIG5hbWVzcGFjZTogJ2RlZmF1bHQnLFxuICAgIHZlcnNpb246ICd2MS44LjEnLFxufTtcblxuLyoqXG4gKiBJbXBsZW1lbnRhdGlvbiBvZiBLTmF0aXZlIGFkZC1vbiBmb3IgRUtTIEJsdWVwcmludHMuIEluc3RhbGxzIEtOYXRpdmUgdG8gdGhlIENsdXN0ZXIuXG4gKi9cbkBzdXBwb3J0c0FMTFxuZXhwb3J0IGNsYXNzIEtOYXRpdmVPcGVyYXRvciBpbXBsZW1lbnRzIENsdXN0ZXJBZGRPbiB7XG5cbiAgICByZWFkb25seSBrbmF0aXZlQWRkT25Qcm9wczogS25hdGl2ZU9wZXJhdG9yUHJvcHM7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcz86IEtuYXRpdmVPcGVyYXRvclByb3BzKSB7XG4gICAgICAgIHRoaXMua25hdGl2ZUFkZE9uUHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcywgLi4ucHJvcHMgfTtcbiAgICB9XG5cbiAgICBAZGVwZW5kYWJsZSgnSXN0aW9Db250cm9sUGxhbmVBZGRPbicpXG4gICAgZGVwbG95KGNsdXN0ZXJJbmZvOiBDbHVzdGVySW5mbyk6IFByb21pc2U8Q29uc3RydWN0PiB7XG4gICAgICAgIGNvbnN0IEJBU0VfVVJMID0gYGh0dHBzOi8vZ2l0aHViLmNvbS9rbmF0aXZlL29wZXJhdG9yL3JlbGVhc2VzL2Rvd25sb2FkL2tuYXRpdmVgO1xuXG4gICAgICAgIC8vIExvYWQgRXh0ZXJuYWwgWUFNTDogaHR0cHM6Ly9naXRodWIuY29tL2tuYXRpdmUvb3BlcmF0b3IvcmVsZWFzZXMvZG93bmxvYWQva25hdGl2ZS12MS44LjEvb3BlcmF0b3IueWFtbFxuICAgICAgICBjb25zdCBkb2MgPSBsb2FkRXh0ZXJuYWxZYW1sKFxuICAgICAgICAgICAgQkFTRV9VUkwgKyBgLSR7dGhpcy5rbmF0aXZlQWRkT25Qcm9wcy52ZXJzaW9ufS9vcGVyYXRvci55YW1sYFxuICAgICAgICApLnNsaWNlKDAsIDI2KTsgLy8gdGhlIGxhc3QgZWxlbWVudCBpcyBudWxsXG5cbiAgICAgICAgY29uc3Qga3ViZWN0bFByb3ZpZGVyID0gbmV3IEt1YmVjdGxQcm92aWRlcihjbHVzdGVySW5mbyk7XG5cbiAgICAgICAgY29uc3Qgc3RhdGVtZW50ID0ga3ViZWN0bFByb3ZpZGVyLmFkZE1hbmlmZXN0KFxuICAgICAgICAgICAgeyBtYW5pZmVzdDogZG9jLCB2YWx1ZXM6IHt9LCBuYW1lOiAna25hdGl2ZS1vcGVyYXRvcicsIG5hbWVzcGFjZTogdGhpcy5rbmF0aXZlQWRkT25Qcm9wcy5uYW1lc3BhY2UhIH1cbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHN0YXRlbWVudCk7XG4gICAgfVxufVxuIl19