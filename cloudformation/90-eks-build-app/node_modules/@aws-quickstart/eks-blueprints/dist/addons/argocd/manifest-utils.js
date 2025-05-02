"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSecretRef = createSecretRef;
exports.createSshSecretRef = createSshSecretRef;
exports.createUserNameSecretRef = createUserNameSecretRef;
const __1 = require("..");
/**
 * Creates CsiSecretProps that contains secret template for ssh/username/pwd credentials.
 * In each case, the secret is expected to be a JSON structure containing url and either sshPrivateKey
 * or username and password attributes.
 * @param credentialsType SSH | USERNAME | TOKEN
 * @param secretName
 * @returns
 */
function createSecretRef(credentialsType, secretName) {
    switch (credentialsType) {
        case "SSH":
            return createSshSecretRef(secretName);
        case "USERNAME":
        case "TOKEN":
            return createUserNameSecretRef(secretName);
        default:
            throw new Error(`credentials type ${credentialsType} is not supported by ArgoCD add-on.`);
    }
}
/**
 * Local function to create a secret reference for SSH key.
 * @param url
 * @param secretName
 * @returns
 */
function createSshSecretRef(secretName) {
    return {
        secretProvider: new __1.LookupSecretsManagerSecretByName(secretName),
        jmesPath: [{ path: "url", objectAlias: "url" }, { path: "sshPrivateKey", objectAlias: "sshPrivateKey" }],
        kubernetesSecret: {
            secretName: secretName,
            labels: { "argocd.argoproj.io/secret-type": "repo-creds" },
            data: [
                { key: "url", objectName: "url" },
                { key: "sshPrivateKey", objectName: "sshPrivateKey" }
            ]
        }
    };
}
/**
 * Local function to a secret reference for username/pwd or username/token key.
 * @param url
 * @param secretName
 * @returns
 */
function createUserNameSecretRef(secretName) {
    return {
        secretProvider: new __1.LookupSecretsManagerSecretByName(secretName),
        jmesPath: [{ path: "url", objectAlias: "url" }, { path: "username", objectAlias: "username" }, { path: "password", objectAlias: "password" }],
        kubernetesSecret: {
            secretName: secretName,
            labels: { "argocd.argoproj.io/secret-type": "repo-creds" },
            data: [
                { key: "url", objectName: "url" },
                { key: "username", objectName: "username" },
                { key: "password", objectName: "password" }
            ]
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuaWZlc3QtdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL2FyZ29jZC9tYW5pZmVzdC11dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVVBLDBDQVVDO0FBUUQsZ0RBYUM7QUFRRCwwREFjQztBQS9ERCwwQkFBc0U7QUFFdEU7Ozs7Ozs7R0FPRztBQUNILFNBQWdCLGVBQWUsQ0FBQyxlQUF1QixFQUFFLFVBQWtCO0lBQ3ZFLFFBQVEsZUFBZSxFQUFFLENBQUM7UUFDdEIsS0FBSyxLQUFLO1lBQ04sT0FBTyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMxQyxLQUFLLFVBQVUsQ0FBQztRQUNoQixLQUFLLE9BQU87WUFDUixPQUFPLHVCQUF1QixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQy9DO1lBQ0ksTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsZUFBZSxxQ0FBcUMsQ0FBQyxDQUFDO0lBQ2xHLENBQUM7QUFDTCxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixrQkFBa0IsQ0FBQyxVQUFrQjtJQUNqRCxPQUFPO1FBQ0gsY0FBYyxFQUFFLElBQUksb0NBQWdDLENBQUMsVUFBVSxDQUFDO1FBQ2hFLFFBQVEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsQ0FBQztRQUN4RyxnQkFBZ0IsRUFBRTtZQUNkLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLE1BQU0sRUFBRSxFQUFFLGdDQUFnQyxFQUFFLFlBQVksRUFBRTtZQUMxRCxJQUFJLEVBQUU7Z0JBQ0YsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUU7Z0JBQ2pDLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsZUFBZSxFQUFFO2FBQ3hEO1NBQ0o7S0FDSixDQUFDO0FBQ04sQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBZ0IsdUJBQXVCLENBQUMsVUFBa0I7SUFDdEQsT0FBTztRQUNILGNBQWMsRUFBRSxJQUFJLG9DQUFnQyxDQUFDLFVBQVUsQ0FBQztRQUNoRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsQ0FBQztRQUM3SSxnQkFBZ0IsRUFBRTtZQUNkLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLE1BQU0sRUFBRSxFQUFDLGdDQUFnQyxFQUFFLFlBQVksRUFBQztZQUN4RCxJQUFJLEVBQUU7Z0JBQ0YsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUU7Z0JBQ2pDLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFO2dCQUMzQyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRTthQUM5QztTQUNKO0tBQ0osQ0FBQztBQUNOLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDc2lTZWNyZXRQcm9wcywgTG9va3VwU2VjcmV0c01hbmFnZXJTZWNyZXRCeU5hbWUgfSBmcm9tIFwiLi5cIjtcblxuLyoqXG4gKiBDcmVhdGVzIENzaVNlY3JldFByb3BzIHRoYXQgY29udGFpbnMgc2VjcmV0IHRlbXBsYXRlIGZvciBzc2gvdXNlcm5hbWUvcHdkIGNyZWRlbnRpYWxzLlxuICogSW4gZWFjaCBjYXNlLCB0aGUgc2VjcmV0IGlzIGV4cGVjdGVkIHRvIGJlIGEgSlNPTiBzdHJ1Y3R1cmUgY29udGFpbmluZyB1cmwgYW5kIGVpdGhlciBzc2hQcml2YXRlS2V5XG4gKiBvciB1c2VybmFtZSBhbmQgcGFzc3dvcmQgYXR0cmlidXRlcy5cbiAqIEBwYXJhbSBjcmVkZW50aWFsc1R5cGUgU1NIIHwgVVNFUk5BTUUgfCBUT0tFTlxuICogQHBhcmFtIHNlY3JldE5hbWUgXG4gKiBAcmV0dXJucyBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNlY3JldFJlZihjcmVkZW50aWFsc1R5cGU6IHN0cmluZywgc2VjcmV0TmFtZTogc3RyaW5nKTogQ3NpU2VjcmV0UHJvcHMge1xuICAgIHN3aXRjaCAoY3JlZGVudGlhbHNUeXBlKSB7XG4gICAgICAgIGNhc2UgXCJTU0hcIjpcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVTc2hTZWNyZXRSZWYoc2VjcmV0TmFtZSk7XG4gICAgICAgIGNhc2UgXCJVU0VSTkFNRVwiOlxuICAgICAgICBjYXNlIFwiVE9LRU5cIjpcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVVc2VyTmFtZVNlY3JldFJlZihzZWNyZXROYW1lKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgY3JlZGVudGlhbHMgdHlwZSAke2NyZWRlbnRpYWxzVHlwZX0gaXMgbm90IHN1cHBvcnRlZCBieSBBcmdvQ0QgYWRkLW9uLmApO1xuICAgIH1cbn1cblxuLyoqXG4gKiBMb2NhbCBmdW5jdGlvbiB0byBjcmVhdGUgYSBzZWNyZXQgcmVmZXJlbmNlIGZvciBTU0gga2V5LlxuICogQHBhcmFtIHVybCBcbiAqIEBwYXJhbSBzZWNyZXROYW1lIFxuICogQHJldHVybnMgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTc2hTZWNyZXRSZWYoc2VjcmV0TmFtZTogc3RyaW5nKTogQ3NpU2VjcmV0UHJvcHMge1xuICAgIHJldHVybiB7XG4gICAgICAgIHNlY3JldFByb3ZpZGVyOiBuZXcgTG9va3VwU2VjcmV0c01hbmFnZXJTZWNyZXRCeU5hbWUoc2VjcmV0TmFtZSksXG4gICAgICAgIGptZXNQYXRoOiBbeyBwYXRoOiBcInVybFwiLCBvYmplY3RBbGlhczogXCJ1cmxcIiB9LCB7IHBhdGg6IFwic3NoUHJpdmF0ZUtleVwiLCBvYmplY3RBbGlhczogXCJzc2hQcml2YXRlS2V5XCIgfV0sXG4gICAgICAgIGt1YmVybmV0ZXNTZWNyZXQ6IHtcbiAgICAgICAgICAgIHNlY3JldE5hbWU6IHNlY3JldE5hbWUsXG4gICAgICAgICAgICBsYWJlbHM6IHsgXCJhcmdvY2QuYXJnb3Byb2ouaW8vc2VjcmV0LXR5cGVcIjogXCJyZXBvLWNyZWRzXCIgfSxcbiAgICAgICAgICAgIGRhdGE6IFtcbiAgICAgICAgICAgICAgICB7IGtleTogXCJ1cmxcIiwgb2JqZWN0TmFtZTogXCJ1cmxcIiB9LFxuICAgICAgICAgICAgICAgIHsga2V5OiBcInNzaFByaXZhdGVLZXlcIiwgb2JqZWN0TmFtZTogXCJzc2hQcml2YXRlS2V5XCIgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfTtcbn1cblxuLyoqXG4gKiBMb2NhbCBmdW5jdGlvbiB0byBhIHNlY3JldCByZWZlcmVuY2UgZm9yIHVzZXJuYW1lL3B3ZCBvciB1c2VybmFtZS90b2tlbiBrZXkuXG4gKiBAcGFyYW0gdXJsIFxuICogQHBhcmFtIHNlY3JldE5hbWUgXG4gKiBAcmV0dXJucyBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVVzZXJOYW1lU2VjcmV0UmVmKHNlY3JldE5hbWU6IHN0cmluZyk6IENzaVNlY3JldFByb3BzIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBzZWNyZXRQcm92aWRlcjogbmV3IExvb2t1cFNlY3JldHNNYW5hZ2VyU2VjcmV0QnlOYW1lKHNlY3JldE5hbWUpLFxuICAgICAgICBqbWVzUGF0aDogW3sgcGF0aDogXCJ1cmxcIiwgb2JqZWN0QWxpYXM6IFwidXJsXCIgfSwgeyBwYXRoOiBcInVzZXJuYW1lXCIsIG9iamVjdEFsaWFzOiBcInVzZXJuYW1lXCIgfSwgeyBwYXRoOiBcInBhc3N3b3JkXCIsIG9iamVjdEFsaWFzOiBcInBhc3N3b3JkXCIgfV0sXG4gICAgICAgIGt1YmVybmV0ZXNTZWNyZXQ6IHtcbiAgICAgICAgICAgIHNlY3JldE5hbWU6IHNlY3JldE5hbWUsXG4gICAgICAgICAgICBsYWJlbHM6IHtcImFyZ29jZC5hcmdvcHJvai5pby9zZWNyZXQtdHlwZVwiOiBcInJlcG8tY3JlZHNcIn0sXG4gICAgICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgICAgICAgeyBrZXk6IFwidXJsXCIsIG9iamVjdE5hbWU6IFwidXJsXCIgfSxcbiAgICAgICAgICAgICAgICB7IGtleTogXCJ1c2VybmFtZVwiLCBvYmplY3ROYW1lOiBcInVzZXJuYW1lXCIgfSxcbiAgICAgICAgICAgICAgICB7IGtleTogXCJwYXNzd29yZFwiLCBvYmplY3ROYW1lOiBcInBhc3N3b3JkXCIgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfTtcbn1cbiJdfQ==