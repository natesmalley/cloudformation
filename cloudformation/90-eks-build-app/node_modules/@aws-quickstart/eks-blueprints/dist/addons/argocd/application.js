"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgoApplication = void 0;
const dot = require("dot-object");
const utils_1 = require("../../utils");
/**
 * Argo Application is a utility class that can generate an ArgoCD application
 * from generic GitOps application properties.
 */
class ArgoApplication {
    constructor(bootstrapRepo) {
        this.bootstrapRepo = bootstrapRepo;
    }
    generate(deployment, syncOrder) {
        var _a, _b;
        const normalizedValues = this.normalizeValues(deployment.values);
        const flatValues = dot.dot(normalizedValues);
        const nameValues = [];
        for (let key in flatValues) {
            // Avoid passing the undefined values
            if (flatValues[key] !== undefined) {
                // Avoid passing the empty objects, e.g. {}
                if (Object.getPrototypeOf(flatValues[key]) !== Object.prototype) {
                    nameValues.push({ name: key, value: `${flatValues[key]}` });
                }
                else if (Object.getPrototypeOf(flatValues[key]) === Object.prototype && Object.keys(flatValues[key]).length != 0) {
                    nameValues.push({ name: key, value: `${flatValues[key]}` });
                }
            }
        }
        const repository = (_a = deployment.repository) !== null && _a !== void 0 ? _a : this.generateDefaultRepo(deployment.name);
        return {
            apiVersion: "argoproj.io/v1alpha1",
            kind: "Application",
            metadata: {
                name: deployment.name,
                namespace: 'argocd',
                annotations: {
                    "argocd.argoproj.io/sync-wave": syncOrder == undefined ? "-1" : `${syncOrder}`
                }
            },
            spec: {
                destination: {
                    namespace: deployment.namespace,
                    server: "https://kubernetes.default.svc"
                },
                project: "default", //TODO: make project configurable
                source: {
                    helm: {
                        valueFiles: ["values.yaml"],
                        parameters: nameValues,
                    },
                    path: repository.path,
                    repoURL: repository.repoUrl,
                    targetRevision: (_b = repository.targetRevision) !== null && _b !== void 0 ? _b : 'HEAD'
                },
                syncPolicy: {
                    automated: {
                        prune: true,
                        selfHeal: true,
                        allowEmpty: true,
                    }
                }
            }
        };
    }
    /**
     * Creates an opinionated path.
     * @param name
     * @returns
     */
    generateDefaultRepo(name) {
        if (this.bootstrapRepo) {
            return {
                name: this.bootstrapRepo.name,
                repoUrl: this.bootstrapRepo.repoUrl,
                path: this.bootstrapRepo.path + `/${name}`,
                targetRevision: this.bootstrapRepo.targetRevision
            };
        }
        throw new Error("With GitOps configuration management enabled either specify GitOps repository for each add-on or provide a bootstrap application to the ArgoCD add-on.");
    }
    /**
     * Iterate an argo Values object to normalize the string format before sending to argocd.
     * For example, escaping the dot from certain keys: "ingress.annotations.kubernetes\\.io/tls-acme"
     * @param values
     * @returns
     */
    normalizeValues(obj) {
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                obj[key] = this.normalizeValues(obj[key]);
            }
            const escapedKey = (0, utils_1.escapeDots)(key);
            if (escapedKey != key) {
                obj[escapedKey] = obj[key];
                delete obj[key];
            }
        });
        return obj;
    }
}
exports.ArgoApplication = ArgoApplication;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL2FyZ29jZC9hcHBsaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxrQ0FBa0M7QUFFbEMsdUNBQXlDO0FBRXpDOzs7R0FHRztBQUNILE1BQWEsZUFBZTtJQUV4QixZQUE2QixhQUFpRDtRQUFqRCxrQkFBYSxHQUFiLGFBQWEsQ0FBb0M7SUFBSSxDQUFDO0lBRTVFLFFBQVEsQ0FBQyxVQUF1QyxFQUFFLFNBQWtCOztRQUV2RSxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWpFLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUU3QyxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFFdEIsS0FBSyxJQUFJLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztZQUN6QixxQ0FBcUM7WUFDckMsSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxFQUFFLENBQUM7Z0JBQ2hDLDJDQUEyQztnQkFDM0MsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDOUQsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNoRSxDQUFDO3FCQUFNLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxNQUFNLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJ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TyxHQUFHLENBQUM7SUFDZixDQUFDO0NBQ0o7QUFsR0QsMENBa0dDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZG90IGZyb20gJ2RvdC1vYmplY3QnO1xuaW1wb3J0IHsgR2l0T3BzQXBwbGljYXRpb25EZXBsb3ltZW50LCBHaXRSZXBvc2l0b3J5UmVmZXJlbmNlLCBWYWx1ZXMgfSBmcm9tICcuLi8uLi9zcGknO1xuaW1wb3J0IHsgZXNjYXBlRG90cyB9IGZyb20gJy4uLy4uL3V0aWxzJztcblxuLyoqXG4gKiBBcmdvIEFwcGxpY2F0aW9uIGlzIGEgdXRpbGl0eSBjbGFzcyB0aGF0IGNhbiBnZW5lcmF0ZSBhbiBBcmdvQ0QgYXBwbGljYXRpb25cbiAqIGZyb20gZ2VuZXJpYyBHaXRPcHMgYXBwbGljYXRpb24gcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEFyZ29BcHBsaWNhdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGJvb3RzdHJhcFJlcG86IEdpdFJlcG9zaXRvcnlSZWZlcmVuY2UgfCB1bmRlZmluZWQpIHsgfVxuXG4gICAgcHVibGljIGdlbmVyYXRlKGRlcGxveW1lbnQ6IEdpdE9wc0FwcGxpY2F0aW9uRGVwbG95bWVudCwgc3luY09yZGVyPzogbnVtYmVyKSB7XG5cbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZFZhbHVlcyA9IHRoaXMubm9ybWFsaXplVmFsdWVzKGRlcGxveW1lbnQudmFsdWVzKTtcblxuICAgICAgICBjb25zdCBmbGF0VmFsdWVzID0gZG90LmRvdChub3JtYWxpemVkVmFsdWVzKTtcblxuICAgICAgICBjb25zdCBuYW1lVmFsdWVzID0gW107XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIGZsYXRWYWx1ZXMpIHtcbiAgICAgICAgICAgIC8vIEF2b2lkIHBhc3NpbmcgdGhlIHVuZGVmaW5lZCB2YWx1ZXNcbiAgICAgICAgICAgIGlmIChmbGF0VmFsdWVzW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIC8vIEF2b2lkIHBhc3NpbmcgdGhlIGVtcHR5IG9iamVjdHMsIGUuZy4ge31cbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmdldFByb3RvdHlwZU9mKGZsYXRWYWx1ZXNba2V5XSkgIT09IE9iamVjdC5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZVZhbHVlcy5wdXNoKHsgbmFtZToga2V5LCB2YWx1ZTogYCR7ZmxhdFZhbHVlc1trZXldfWAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChPYmplY3QuZ2V0UHJvdG90eXBlT2YoZmxhdFZhbHVlc1trZXldKSA9PT0gT2JqZWN0LnByb3RvdHlwZSAmJiBPYmplY3Qua2V5cyhmbGF0VmFsdWVzW2tleV0pLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWVWYWx1ZXMucHVzaCh7IG5hbWU6IGtleSwgdmFsdWU6IGAke2ZsYXRWYWx1ZXNba2V5XX1gIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXBvc2l0b3J5ID0gZGVwbG95bWVudC5yZXBvc2l0b3J5ID8/IHRoaXMuZ2VuZXJhdGVEZWZhdWx0UmVwbyhkZXBsb3ltZW50Lm5hbWUpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYXBpVmVyc2lvbjogXCJhcmdvcHJvai5pby92MWFscGhhMVwiLFxuICAgICAgICAgICAga2luZDogXCJBcHBsaWNhdGlvblwiLFxuICAgICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBkZXBsb3ltZW50Lm5hbWUsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiAnYXJnb2NkJyxcbiAgICAgICAgICAgICAgICBhbm5vdGF0aW9uczoge1xuICAgICAgICAgICAgICAgICAgICBcImFyZ29jZC5hcmdvcHJvai5pby9zeW5jLXdhdmVcIjogc3luY09yZGVyID09IHVuZGVmaW5lZCA/IFwiLTFcIiA6IGAke3N5bmNPcmRlcn1gXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNwZWM6IHtcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IGRlcGxveW1lbnQubmFtZXNwYWNlLFxuICAgICAgICAgICAgICAgICAgICBzZXJ2ZXI6IFwiaHR0cHM6Ly9rdWJlcm5ldGVzLmRlZmF1bHQuc3ZjXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHByb2plY3Q6IFwiZGVmYXVsdFwiLCAvL1RPRE86IG1ha2UgcHJvamVjdCBjb25maWd1cmFibGVcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAgICAgaGVsbToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVGaWxlczogW1widmFsdWVzLnlhbWxcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiBuYW1lVmFsdWVzLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBwYXRoOiByZXBvc2l0b3J5LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHJlcG9VUkw6IHJlcG9zaXRvcnkucmVwb1VybCxcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0UmV2aXNpb246IHJlcG9zaXRvcnkudGFyZ2V0UmV2aXNpb24gPz8gJ0hFQUQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzeW5jUG9saWN5OiB7XG4gICAgICAgICAgICAgICAgICAgIGF1dG9tYXRlZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJ1bmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmSGVhbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbG93RW1wdHk6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBvcGluaW9uYXRlZCBwYXRoLlxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICogQHJldHVybnNcbiAgICAgKi9cbiAgICBnZW5lcmF0ZURlZmF1bHRSZXBvKG5hbWU6IHN0cmluZyk6IEdpdFJlcG9zaXRvcnlSZWZlcmVuY2Uge1xuICAgICAgICBpZiAodGhpcy5ib290c3RyYXBSZXBvKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMuYm9vdHN0cmFwUmVwby5uYW1lLFxuICAgICAgICAgICAgICAgIHJlcG9Vcmw6IHRoaXMuYm9vdHN0cmFwUmVwby5yZXBvVXJsLFxuICAgICAgICAgICAgICAgIHBhdGg6IHRoaXMuYm9vdHN0cmFwUmVwby5wYXRoICsgYC8ke25hbWV9YCxcbiAgICAgICAgICAgICAgICB0YXJnZXRSZXZpc2lvbjogdGhpcy5ib290c3RyYXBSZXBvLnRhcmdldFJldmlzaW9uXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIldpdGggR2l0T3BzIGNvbmZpZ3VyYXRpb24gbWFuYWdlbWVudCBlbmFibGVkIGVpdGhlciBzcGVjaWZ5IEdpdE9wcyByZXBvc2l0b3J5IGZvciBlYWNoIGFkZC1vbiBvciBwcm92aWRlIGEgYm9vdHN0cmFwIGFwcGxpY2F0aW9uIHRvIHRoZSBBcmdvQ0QgYWRkLW9uLlwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlIGFuIGFyZ28gVmFsdWVzIG9iamVjdCB0byBub3JtYWxpemUgdGhlIHN0cmluZyBmb3JtYXQgYmVmb3JlIHNlbmRpbmcgdG8gYXJnb2NkLlxuICAgICAqIEZvciBleGFtcGxlLCBlc2NhcGluZyB0aGUgZG90IGZyb20gY2VydGFpbiBrZXlzOiBcImluZ3Jlc3MuYW5ub3RhdGlvbnMua3ViZXJuZXRlc1xcXFwuaW8vdGxzLWFjbWVcIlxuICAgICAqIEBwYXJhbSB2YWx1ZXNcbiAgICAgKiBAcmV0dXJuc1xuICAgICAqL1xuICAgIG5vcm1hbGl6ZVZhbHVlcyhvYmo6IFZhbHVlcyk6IFZhbHVlcyB7XG4gICAgICAgIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmpba2V5XSA9PT0gJ29iamVjdCcgJiYgb2JqW2tleV0gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBvYmpba2V5XSA9IHRoaXMubm9ybWFsaXplVmFsdWVzKG9ialtrZXldKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZXNjYXBlZEtleSA9IGVzY2FwZURvdHMoa2V5KTtcbiAgICAgICAgICAgIGlmIChlc2NhcGVkS2V5ICE9IGtleSkge1xuICAgICAgICAgICAgICAgIG9ialtlc2NhcGVkS2V5XSA9IG9ialtrZXldO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmpba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG59XG4iXX0=