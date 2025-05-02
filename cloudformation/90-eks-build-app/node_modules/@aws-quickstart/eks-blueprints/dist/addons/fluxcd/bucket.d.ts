/**
 * Flux Bucket API defines a Source to produce an Artifact for objects from storage solutions like Amazon S3.
 * @see https://fluxcd.io/flux/components/source/buckets/
 */
export declare class FluxBucket {
    private readonly bucketName;
    private readonly region;
    private readonly prefixPath?;
    constructor(bucketName: string, region: string, prefixPath?: string | undefined);
    generate(name: string, namespace: string, fluxSyncInterval: string, provider: string, endpoint: string, fluxSecretRefName?: string): {
        apiVersion: string;
        kind: string;
        metadata: {
            name: string;
            namespace: string;
        };
        spec: {
            interval: string;
            bucketName: string;
            provider: string;
            endpoint: string;
            region: string;
        };
    };
}
