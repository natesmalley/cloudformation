"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FluxGitRepository = void 0;
const utils_1 = require("../../utils");
/**
 * Flux GitRepository API defines a Source to produce an Artifact for a Git repository revision.
 */
class FluxGitRepository {
    constructor(repository) {
        this.repository = repository;
    }
    generate(name, namespace, fluxSyncInterval, fluxSecretRefName) {
        const repository = this.repository;
        const gitManifest = {
            apiVersion: "source.toolkit.fluxcd.io/v1beta2",
            kind: "GitRepository",
            metadata: {
                name: name,
                namespace: namespace
            },
            spec: {
                interval: fluxSyncInterval,
                url: repository.repoUrl,
                ref: {
                    branch: repository.targetRevision,
                },
            }
        };
        if (fluxSecretRefName) {
            (0, utils_1.setPath)(gitManifest, "spec.secretRef.name", fluxSecretRefName);
        }
        return gitManifest;
    }
}
exports.FluxGitRepository = FluxGitRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0cmVwb3NpdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9hZGRvbnMvZmx1eGNkL2dpdHJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsdUNBQXNDO0FBRXRDOztHQUVHO0FBQ0gsTUFBYSxpQkFBaUI7SUFFMUIsWUFBNkIsVUFBcUM7UUFBckMsZUFBVSxHQUFWLFVBQVUsQ0FBMkI7SUFBRyxDQUFDO0lBRS9ELFFBQVEsQ0FBQyxJQUFZLEVBQUUsU0FBaUIsRUFBRSxnQkFBd0IsRUFBRSxpQkFBeUI7UUFFaEcsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNuQyxNQUFNLFdBQVcsR0FBSTtZQUNqQixVQUFVLEVBQUUsa0NBQWtDO1lBQzlDLElBQUksRUFBRSxlQUFlO1lBQ3JCLFFBQVEsRUFBRTtnQkFDTixJQUFJLEVBQUUsSUFBSTtnQkFDVixTQUFTLEVBQUUsU0FBUzthQUN2QjtZQUNELElBQUksRUFBRTtnQkFDRixRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQixHQUFHLEVBQUUsVUFBVSxDQUFDLE9BQU87Z0JBQ3ZCLEdBQUcsRUFBRTtvQkFDRCxNQUFNLEVBQUUsVUFBVSxDQUFDLGNBQWM7aUJBQ3BDO2FBQ0o7U0FDSixDQUFDO1FBQ0YsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO1lBQ3BCLElBQUEsZUFBTyxFQUFDLFdBQVcsRUFBRSxxQkFBcUIsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQ25FLENBQUM7UUFDRCxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0NBQ0o7QUEzQkQsOENBMkJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgc3BpIGZyb20gXCIuLi8uLi9zcGlcIjtcbmltcG9ydCB7IHNldFBhdGggfSBmcm9tIFwiLi4vLi4vdXRpbHNcIjtcblxuLyoqXG4gKiBGbHV4IEdpdFJlcG9zaXRvcnkgQVBJIGRlZmluZXMgYSBTb3VyY2UgdG8gcHJvZHVjZSBhbiBBcnRpZmFjdCBmb3IgYSBHaXQgcmVwb3NpdG9yeSByZXZpc2lvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIEZsdXhHaXRSZXBvc2l0b3J5IHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcmVwb3NpdG9yeTogc3BpLkFwcGxpY2F0aW9uUmVwb3NpdG9yeSkge31cblxuICAgIHB1YmxpYyBnZW5lcmF0ZShuYW1lOiBzdHJpbmcsIG5hbWVzcGFjZTogc3RyaW5nLCBmbHV4U3luY0ludGVydmFsOiBzdHJpbmcsIGZsdXhTZWNyZXRSZWZOYW1lOiBzdHJpbmcpIHtcblxuICAgICAgICBjb25zdCByZXBvc2l0b3J5ID0gdGhpcy5yZXBvc2l0b3J5O1xuICAgICAgICBjb25zdCBnaXRNYW5pZmVzdCA9ICB7XG4gICAgICAgICAgICBhcGlWZXJzaW9uOiBcInNvdXJjZS50b29sa2l0LmZsdXhjZC5pby92MWJldGEyXCIsXG4gICAgICAgICAgICBraW5kOiBcIkdpdFJlcG9zaXRvcnlcIixcbiAgICAgICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IG5hbWVzcGFjZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNwZWM6IHtcbiAgICAgICAgICAgICAgICBpbnRlcnZhbDogZmx1eFN5bmNJbnRlcnZhbCxcbiAgICAgICAgICAgICAgICB1cmw6IHJlcG9zaXRvcnkucmVwb1VybCxcbiAgICAgICAgICAgICAgICByZWY6IHtcbiAgICAgICAgICAgICAgICAgICAgYnJhbmNoOiByZXBvc2l0b3J5LnRhcmdldFJldmlzaW9uLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGlmIChmbHV4U2VjcmV0UmVmTmFtZSkge1xuICAgICAgICAgICAgc2V0UGF0aChnaXRNYW5pZmVzdCwgXCJzcGVjLnNlY3JldFJlZi5uYW1lXCIsIGZsdXhTZWNyZXRSZWZOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ2l0TWFuaWZlc3Q7XG4gICAgfVxufVxuIl19