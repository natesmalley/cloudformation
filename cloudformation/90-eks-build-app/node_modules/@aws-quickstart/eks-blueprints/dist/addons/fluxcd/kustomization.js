"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FluxKustomization = void 0;
const utils_1 = require("../../utils");
/**
 * Flux Kustomization API defines a pipeline for fetching, decrypting, building, validating and applying Kustomize overlays or plain Kubernetes manifests.
 */
class FluxKustomization {
    constructor() { }
    generate(name, repoName, namespace, fluxSyncInterval, fluxPrune, fluxTimeout, values, fluxKustomizationPath, fluxTargetNamespace, fluxSourceKind) {
        const kustomizationManifest = {
            apiVersion: "kustomize.toolkit.fluxcd.io/v1beta2",
            kind: "Kustomization",
            metadata: {
                name,
                namespace
            },
            spec: {
                interval: fluxSyncInterval,
                sourceRef: {
                    kind: fluxSourceKind || "GitRepository",
                    name: repoName
                },
                path: fluxKustomizationPath,
                prune: fluxPrune,
                timeout: fluxTimeout
            }
        };
        if (values) {
            (0, utils_1.setPath)(kustomizationManifest, "spec.postBuild.substitute", values);
        }
        if (fluxTargetNamespace) {
            (0, utils_1.setPath)(kustomizationManifest, "spec.targetNamespace", fluxTargetNamespace);
        }
        return kustomizationManifest;
    }
}
exports.FluxKustomization = FluxKustomization;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3VzdG9taXphdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9hZGRvbnMvZmx1eGNkL2t1c3RvbWl6YXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQXNDO0FBR3RDOztHQUVHO0FBQ0gsTUFBYSxpQkFBaUI7SUFFMUIsZ0JBQWUsQ0FBQztJQUVULFFBQVEsQ0FBQyxJQUFZLEVBQUUsUUFBZ0IsRUFBRSxTQUFpQixFQUFFLGdCQUF3QixFQUFFLFNBQWtCLEVBQUUsV0FBbUIsRUFBRSxNQUFrQixFQUFFLHFCQUE2QixFQUFFLG1CQUE0QixFQUFFLGNBQXVCO1FBRTFPLE1BQU0scUJBQXFCLEdBQUc7WUFDMUIsVUFBVSxFQUFFLHFDQUFxQztZQUNqRCxJQUFJLEVBQUUsZUFBZTtZQUNyQixRQUFRLEVBQUU7Z0JBQ04sSUFBSTtnQkFDSixTQUFTO2FBQ1o7WUFDRCxJQUFJLEVBQUU7Z0JBQ0YsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsU0FBUyxFQUFFO29CQUNQLElBQUksRUFBRSxjQUFjLElBQUksZUFBZTtvQkFDdkMsSUFBSSxFQUFFLFFBQVE7aUJBQ2pCO2dCQUNELElBQUksRUFBRSxxQkFBcUI7Z0JBQzNCLEtBQUssRUFBRSxTQUFTO2dCQUNoQixPQUFPLEVBQUUsV0FBVzthQUN2QjtTQUNKLENBQUM7UUFDRixJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1QsSUFBQSxlQUFPLEVBQUMscUJBQXFCLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEUsQ0FBQztRQUNELElBQUksbUJBQW1CLEVBQUUsQ0FBQztZQUN0QixJQUFBLGVBQU8sRUFBQyxxQkFBcUIsRUFBRSxzQkFBc0IsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2hGLENBQUM7UUFDRCxPQUFPLHFCQUFxQixDQUFDO0lBQ2pDLENBQUM7Q0FDSjtBQWhDRCw4Q0FnQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzZXRQYXRoIH0gZnJvbSBcIi4uLy4uL3V0aWxzXCI7XG5pbXBvcnQgKiBhcyBzcGkgZnJvbSBcIi4uLy4uL3NwaVwiO1xuXG4vKipcbiAqIEZsdXggS3VzdG9taXphdGlvbiBBUEkgZGVmaW5lcyBhIHBpcGVsaW5lIGZvciBmZXRjaGluZywgZGVjcnlwdGluZywgYnVpbGRpbmcsIHZhbGlkYXRpbmcgYW5kIGFwcGx5aW5nIEt1c3RvbWl6ZSBvdmVybGF5cyBvciBwbGFpbiBLdWJlcm5ldGVzIG1hbmlmZXN0cy5cbiAqL1xuZXhwb3J0IGNsYXNzIEZsdXhLdXN0b21pemF0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge31cblxuICAgIHB1YmxpYyBnZW5lcmF0ZShuYW1lOiBzdHJpbmcsIHJlcG9OYW1lOiBzdHJpbmcsIG5hbWVzcGFjZTogc3RyaW5nLCBmbHV4U3luY0ludGVydmFsOiBzdHJpbmcsIGZsdXhQcnVuZTogYm9vbGVhbiwgZmx1eFRpbWVvdXQ6IHN0cmluZywgdmFsdWVzOiBzcGkuVmFsdWVzLCBmbHV4S3VzdG9taXphdGlvblBhdGg6IHN0cmluZywgZmx1eFRhcmdldE5hbWVzcGFjZT86IHN0cmluZywgZmx1eFNvdXJjZUtpbmQ/OiBzdHJpbmcpIHtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGt1c3RvbWl6YXRpb25NYW5pZmVzdCA9IHtcbiAgICAgICAgICAgIGFwaVZlcnNpb246IFwia3VzdG9taXplLnRvb2xraXQuZmx1eGNkLmlvL3YxYmV0YTJcIixcbiAgICAgICAgICAgIGtpbmQ6IFwiS3VzdG9taXphdGlvblwiLFxuICAgICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNwZWM6IHtcbiAgICAgICAgICAgICAgICBpbnRlcnZhbDogZmx1eFN5bmNJbnRlcnZhbCxcbiAgICAgICAgICAgICAgICBzb3VyY2VSZWY6IHtcbiAgICAgICAgICAgICAgICAgICAga2luZDogZmx1eFNvdXJjZUtpbmQgfHwgXCJHaXRSZXBvc2l0b3J5XCIsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHJlcG9OYW1lXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwYXRoOiBmbHV4S3VzdG9taXphdGlvblBhdGgsXG4gICAgICAgICAgICAgICAgcHJ1bmU6IGZsdXhQcnVuZSxcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiBmbHV4VGltZW91dFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgICAgICBzZXRQYXRoKGt1c3RvbWl6YXRpb25NYW5pZmVzdCwgXCJzcGVjLnBvc3RCdWlsZC5zdWJzdGl0dXRlXCIsIHZhbHVlcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZsdXhUYXJnZXROYW1lc3BhY2UpIHtcbiAgICAgICAgICAgIHNldFBhdGgoa3VzdG9taXphdGlvbk1hbmlmZXN0LCBcInNwZWMudGFyZ2V0TmFtZXNwYWNlXCIsIGZsdXhUYXJnZXROYW1lc3BhY2UpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBrdXN0b21pemF0aW9uTWFuaWZlc3Q7XG4gICAgfVxufVxuIl19