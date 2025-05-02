"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FluxBucket = void 0;
const utils_1 = require("../../utils");
/**
 * Flux Bucket API defines a Source to produce an Artifact for objects from storage solutions like Amazon S3.
 * @see https://fluxcd.io/flux/components/source/buckets/
 */
class FluxBucket {
    constructor(bucketName, region, prefixPath) {
        this.bucketName = bucketName;
        this.region = region;
        this.prefixPath = prefixPath;
    }
    generate(name, namespace, fluxSyncInterval, provider, endpoint, fluxSecretRefName) {
        const bucketManifest = {
            apiVersion: "source.toolkit.fluxcd.io/v1beta2",
            kind: "Bucket",
            metadata: {
                name: name,
                namespace: namespace
            },
            spec: {
                interval: fluxSyncInterval,
                bucketName: this.bucketName,
                provider: provider,
                endpoint: endpoint,
                region: this.region,
            }
        };
        if (fluxSecretRefName) {
            (0, utils_1.setPath)(bucketManifest, "spec.secretRef.name", fluxSecretRefName);
        }
        if (this.prefixPath) {
            (0, utils_1.setPath)(bucketManifest, "spec.prefix", this.prefixPath);
        }
        return bucketManifest;
    }
}
exports.FluxBucket = FluxBucket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL2FkZG9ucy9mbHV4Y2QvYnVja2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFzQztBQUV0Qzs7O0dBR0c7QUFDSCxNQUFhLFVBQVU7SUFFbkIsWUFBNkIsVUFBa0IsRUFBbUIsTUFBYyxFQUFtQixVQUFtQjtRQUF6RixlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQW1CLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBbUIsZUFBVSxHQUFWLFVBQVUsQ0FBUztJQUFHLENBQUM7SUFFbkgsUUFBUSxDQUFDLElBQVksRUFBRSxTQUFpQixFQUFFLGdCQUF3QixFQUFFLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxpQkFBMEI7UUFFckksTUFBTSxjQUFjLEdBQUk7WUFDcEIsVUFBVSxFQUFFLGtDQUFrQztZQUM5QyxJQUFJLEVBQUUsUUFBUTtZQUNkLFFBQVEsRUFBRTtnQkFDTixJQUFJLEVBQUUsSUFBSTtnQkFDVixTQUFTLEVBQUUsU0FBUzthQUN2QjtZQUNELElBQUksRUFBRTtnQkFDRixRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7Z0JBQzNCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2FBQ3RCO1NBQ0osQ0FBQztRQUVGLElBQUksaUJBQWlCLEVBQUUsQ0FBQztZQUNwQixJQUFBLGVBQU8sRUFBQyxjQUFjLEVBQUUscUJBQXFCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbEIsSUFBQSxlQUFPLEVBQUMsY0FBYyxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUQsQ0FBQztRQUVELE9BQU8sY0FBYyxDQUFDO0lBQzFCLENBQUM7Q0FDSjtBQWhDRCxnQ0FnQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzZXRQYXRoIH0gZnJvbSBcIi4uLy4uL3V0aWxzXCI7XG5cbi8qKlxuICogRmx1eCBCdWNrZXQgQVBJIGRlZmluZXMgYSBTb3VyY2UgdG8gcHJvZHVjZSBhbiBBcnRpZmFjdCBmb3Igb2JqZWN0cyBmcm9tIHN0b3JhZ2Ugc29sdXRpb25zIGxpa2UgQW1hem9uIFMzLlxuICogQHNlZSBodHRwczovL2ZsdXhjZC5pby9mbHV4L2NvbXBvbmVudHMvc291cmNlL2J1Y2tldHMvXG4gKi9cbmV4cG9ydCBjbGFzcyBGbHV4QnVja2V0IHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgYnVja2V0TmFtZTogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IHJlZ2lvbjogc3RyaW5nLCBwcml2YXRlIHJlYWRvbmx5IHByZWZpeFBhdGg/OiBzdHJpbmcpIHt9XG5cbiAgICBwdWJsaWMgZ2VuZXJhdGUobmFtZTogc3RyaW5nLCBuYW1lc3BhY2U6IHN0cmluZywgZmx1eFN5bmNJbnRlcnZhbDogc3RyaW5nLCBwcm92aWRlcjogc3RyaW5nLCBlbmRwb2ludDogc3RyaW5nLCBmbHV4U2VjcmV0UmVmTmFtZT86IHN0cmluZykge1xuXG4gICAgICAgIGNvbnN0IGJ1Y2tldE1hbmlmZXN0ID0gIHtcbiAgICAgICAgICAgIGFwaVZlcnNpb246IFwic291cmNlLnRvb2xraXQuZmx1eGNkLmlvL3YxYmV0YTJcIixcbiAgICAgICAgICAgIGtpbmQ6IFwiQnVja2V0XCIsXG4gICAgICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiBuYW1lc3BhY2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6IGZsdXhTeW5jSW50ZXJ2YWwsXG4gICAgICAgICAgICAgICAgYnVja2V0TmFtZTogdGhpcy5idWNrZXROYW1lLFxuICAgICAgICAgICAgICAgIHByb3ZpZGVyOiBwcm92aWRlcixcbiAgICAgICAgICAgICAgICBlbmRwb2ludDogZW5kcG9pbnQsXG4gICAgICAgICAgICAgICAgcmVnaW9uOiB0aGlzLnJlZ2lvbixcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZmx1eFNlY3JldFJlZk5hbWUpIHtcbiAgICAgICAgICAgIHNldFBhdGgoYnVja2V0TWFuaWZlc3QsIFwic3BlYy5zZWNyZXRSZWYubmFtZVwiLCBmbHV4U2VjcmV0UmVmTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wcmVmaXhQYXRoKSB7XG4gICAgICAgICAgICBzZXRQYXRoKGJ1Y2tldE1hbmlmZXN0LCBcInNwZWMucHJlZml4XCIsIHRoaXMucHJlZml4UGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYnVja2V0TWFuaWZlc3Q7XG4gICAgfVxufVxuIl19