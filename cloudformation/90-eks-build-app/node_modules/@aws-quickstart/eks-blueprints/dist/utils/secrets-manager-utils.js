"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecretValue = getSecretValue;
exports.validateSecret = validateSecret;
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
/**
 * Gets secret value from AWS Secret Manager. Requires access rights to the secret, specified by the secretName parameter.
 * @param secretName name of the secret to retrieve
 * @param region
 * @returns
*/
async function getSecretValue(secretName, region) {
    const secretManager = new client_secrets_manager_1.SecretsManager({ region });
    let secretString = "";
    try {
        let response = await secretManager.getSecretValue({ SecretId: secretName });
        if (response) {
            if (response.SecretString) {
                secretString = response.SecretString;
            }
            else if (response.SecretBinary) {
                throw new Error(`Invalid secret format for ${secretName}. Expected string value, received binary.`);
            }
        }
        return secretString;
    }
    catch (error) {
        console.log(`error getting secret ${secretName}: ` + error);
        throw error;
    }
}
/**
 * Throws an error if secret is undefined in the target region.
 * @returns ARN of the secret if exists.
 */
async function validateSecret(secretName, region) {
    const secretManager = new client_secrets_manager_1.SecretsManager({ region });
    try {
        const response = await secretManager.describeSecret({ SecretId: secretName });
        return response.ARN;
    }
    catch (error) {
        console.log(`Secret ${secretName} is not defined: ` + error);
        throw error;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjcmV0cy1tYW5hZ2VyLXV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL3V0aWxzL3NlY3JldHMtbWFuYWdlci11dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU9DLHdDQWtCQTtBQU1ELHdDQVVDO0FBekNELDRFQUFpRTtBQUNqRTs7Ozs7RUFLRTtBQUNNLEtBQUssVUFBVSxjQUFjLENBQUMsVUFBa0IsRUFBRSxNQUFjO0lBQ3BFLE1BQU0sYUFBYSxHQUFHLElBQUksdUNBQWMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDckQsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLElBQUksQ0FBQztRQUNELElBQUksUUFBUSxHQUFHLE1BQU0sYUFBYSxDQUFDLGNBQWMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQzVFLElBQUksUUFBUSxFQUFFLENBQUM7WUFDWCxJQUFJLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDeEIsWUFBWSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7WUFDekMsQ0FBQztpQkFBTSxJQUFJLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsVUFBVSwyQ0FBMkMsQ0FBQyxDQUFDO1lBQ3hHLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxZQUFZLENBQUM7SUFDeEIsQ0FBQztJQUNELE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixVQUFVLElBQUksR0FBSSxLQUFLLENBQUMsQ0FBQztRQUM3RCxNQUFNLEtBQUssQ0FBQztJQUNoQixDQUFDO0FBQ0wsQ0FBQztBQUVEOzs7R0FHRztBQUNJLEtBQUssVUFBVSxjQUFjLENBQUMsVUFBa0IsRUFBRSxNQUFjO0lBQ25FLE1BQU0sYUFBYSxHQUFHLElBQUksdUNBQWMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDckQsSUFBSSxDQUFDO1FBQ0QsTUFBTSxRQUFRLEdBQUcsTUFBTSxhQUFhLENBQUMsY0FBYyxDQUFDLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDOUUsT0FBTyxRQUFRLENBQUMsR0FBSSxDQUFDO0lBQ3pCLENBQUM7SUFDRCxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLFVBQVUsbUJBQW1CLEdBQUksS0FBSyxDQUFDLENBQUM7UUFDOUQsTUFBTSxLQUFLLENBQUM7SUFDaEIsQ0FBQztBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTZWNyZXRzTWFuYWdlciB9IGZyb20gXCJAYXdzLXNkay9jbGllbnQtc2VjcmV0cy1tYW5hZ2VyXCI7XG4vKipcbiAqIEdldHMgc2VjcmV0IHZhbHVlIGZyb20gQVdTIFNlY3JldCBNYW5hZ2VyLiBSZXF1aXJlcyBhY2Nlc3MgcmlnaHRzIHRvIHRoZSBzZWNyZXQsIHNwZWNpZmllZCBieSB0aGUgc2VjcmV0TmFtZSBwYXJhbWV0ZXIuXG4gKiBAcGFyYW0gc2VjcmV0TmFtZSBuYW1lIG9mIHRoZSBzZWNyZXQgdG8gcmV0cmlldmVcbiAqIEBwYXJhbSByZWdpb24gXG4gKiBAcmV0dXJucyBcbiovXG4gZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNlY3JldFZhbHVlKHNlY3JldE5hbWU6IHN0cmluZywgcmVnaW9uOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IHNlY3JldE1hbmFnZXIgPSBuZXcgU2VjcmV0c01hbmFnZXIoeyByZWdpb24gfSk7XG4gICAgbGV0IHNlY3JldFN0cmluZyA9IFwiXCI7XG4gICAgdHJ5IHtcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgc2VjcmV0TWFuYWdlci5nZXRTZWNyZXRWYWx1ZSh7IFNlY3JldElkOiBzZWNyZXROYW1lIH0pO1xuICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5TZWNyZXRTdHJpbmcpIHtcbiAgICAgICAgICAgICAgICBzZWNyZXRTdHJpbmcgPSByZXNwb25zZS5TZWNyZXRTdHJpbmc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLlNlY3JldEJpbmFyeSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzZWNyZXQgZm9ybWF0IGZvciAke3NlY3JldE5hbWV9LiBFeHBlY3RlZCBzdHJpbmcgdmFsdWUsIHJlY2VpdmVkIGJpbmFyeS5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2VjcmV0U3RyaW5nO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coYGVycm9yIGdldHRpbmcgc2VjcmV0ICR7c2VjcmV0TmFtZX06IGAgICsgZXJyb3IpO1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG59XG5cbi8qKlxuICogVGhyb3dzIGFuIGVycm9yIGlmIHNlY3JldCBpcyB1bmRlZmluZWQgaW4gdGhlIHRhcmdldCByZWdpb24uXG4gKiBAcmV0dXJucyBBUk4gb2YgdGhlIHNlY3JldCBpZiBleGlzdHMuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB2YWxpZGF0ZVNlY3JldChzZWNyZXROYW1lOiBzdHJpbmcsIHJlZ2lvbjogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBzZWNyZXRNYW5hZ2VyID0gbmV3IFNlY3JldHNNYW5hZ2VyKHsgcmVnaW9uIH0pO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VjcmV0TWFuYWdlci5kZXNjcmliZVNlY3JldCh7IFNlY3JldElkOiBzZWNyZXROYW1lIH0pO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuQVJOITtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBTZWNyZXQgJHtzZWNyZXROYW1lfSBpcyBub3QgZGVmaW5lZDogYCAgKyBlcnJvcik7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbn0iXX0=