"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegatingHostedZoneProvider = exports.ImportHostedZoneProvider = exports.LookupHostedZoneProvider = void 0;
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const r53 = require("aws-cdk-lib/aws-route53");
const aws_cdk_lib_1 = require("aws-cdk-lib");
/**
 * Simple lookup host zone provider
 */
class LookupHostedZoneProvider {
    /**
     * @param hostedZoneName name of the host zone to lookup
     * @param id  optional id for the structure (for tracking). set to hostzonename by default
     */
    constructor(hostedZoneName, id) {
        this.hostedZoneName = hostedZoneName;
        this.id = id;
    }
    provide(context) {
        var _a;
        return r53.HostedZone.fromLookup(context.scope, (_a = this.id) !== null && _a !== void 0 ? _a : `${this.hostedZoneName}-Lookup`, { domainName: this.hostedZoneName });
    }
}
exports.LookupHostedZoneProvider = LookupHostedZoneProvider;
/**
 * Direct import hosted zone provider, based on a known hosted zone ID.
 * Recommended method if hosted zone id is known, as it avoids extra look-ups.
 */
class ImportHostedZoneProvider {
    constructor(hostedZoneId, id) {
        this.hostedZoneId = hostedZoneId;
        this.id = id;
    }
    provide(context) {
        var _a;
        return r53.HostedZone.fromHostedZoneId(context.scope, (_a = this.id) !== null && _a !== void 0 ? _a : `${this.hostedZoneId}-Import`, this.hostedZoneId);
    }
}
exports.ImportHostedZoneProvider = ImportHostedZoneProvider;
/**
 * Delegating provider is a convenience approach to have a global hosted zone record in a centralized
 * account and subdomain records in respective workload accounts.
 *
 * The delegation part allows routing subdomain entries to the child hosted zone in the workload account.
 */
class DelegatingHostedZoneProvider {
    constructor(options) {
        this.options = options;
    }
    provide(context) {
        const stack = aws_cdk_lib_1.Stack.of(context.scope);
        const subZone = new r53.PublicHostedZone(stack, `${this.options.subdomain}-SubZone`, {
            zoneName: this.options.subdomain
        });
        if (this.options.wildcardSubdomain) {
            new r53.CnameRecord(stack, `${this.options.subdomain}-cname`, {
                zone: subZone,
                domainName: `${this.options.subdomain}`,
                recordName: `*.${this.options.subdomain}`
            });
        }
        // 
        // import the delegation role by constructing the roleArn.
        // Assuming the parent account has the delegating role with 
        // trust relationship setup to the child account.
        //
        const delegationRoleArn = stack.formatArn({
            region: '', // IAM is global in each partition
            service: 'iam',
            account: this.options.parentDnsAccountId,
            resource: 'role',
            resourceName: this.options.delegatingRoleName
        });
        const delegationRole = aws_iam_1.Role.fromRoleArn(stack, `${this.options.subdomain}-DelegationRole`, delegationRoleArn);
        // create the record
        new r53.CrossAccountZoneDelegationRecord(stack, `${this.options.subdomain}-delegate`, {
            delegatedZone: subZone,
            parentHostedZoneName: this.options.parentDomain, // or you can use parentHostedZoneId
            delegationRole
        });
        return subZone;
    }
}
exports.DelegatingHostedZoneProvider = DelegatingHostedZoneProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdGVkLXpvbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvcmVzb3VyY2UtcHJvdmlkZXJzL2hvc3RlZC16b25lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlEQUEyQztBQUMzQywrQ0FBK0M7QUFFL0MsNkNBQWtDO0FBRWxDOztHQUVHO0FBQ0gsTUFBYSx3QkFBd0I7SUFFakM7OztPQUdHO0lBQ0gsWUFBb0IsY0FBc0IsRUFBVSxFQUFXO1FBQTNDLG1CQUFjLEdBQWQsY0FBYyxDQUFRO1FBQVUsT0FBRSxHQUFGLEVBQUUsQ0FBUztJQUFJLENBQUM7SUFFcEUsT0FBTyxDQUFDLE9BQXdCOztRQUM1QixPQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBQSxJQUFJLENBQUMsRUFBRSxtQ0FBSSxHQUFHLElBQUksQ0FBQyxjQUFjLFNBQVMsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztJQUNySSxDQUFDO0NBQ0o7QUFYRCw0REFXQztBQUNEOzs7R0FHRztBQUNILE1BQWEsd0JBQXdCO0lBRWpDLFlBQW9CLFlBQW9CLEVBQVUsRUFBVztRQUF6QyxpQkFBWSxHQUFaLFlBQVksQ0FBUTtRQUFVLE9BQUUsR0FBRixFQUFFLENBQVM7SUFBSSxDQUFDO0lBRWxFLE9BQU8sQ0FBQyxPQUF3Qjs7UUFDNUIsT0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBQSxJQUFJLENBQUMsRUFBRSxtQ0FBSSxHQUFHLElBQUksQ0FBQyxZQUFZLFNBQVMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdkgsQ0FBQztDQUVKO0FBUkQsNERBUUM7QUErQkQ7Ozs7O0dBS0c7QUFDSCxNQUFhLDRCQUE0QjtJQUNyQyxZQUFvQixPQUEwQztRQUExQyxZQUFPLEdBQVAsT0FBTyxDQUFtQztJQUFJLENBQUM7SUFFbkUsT0FBTyxDQUFDLE9BQXdCO1FBQzVCLE1BQU0sS0FBSyxHQUFHLG1CQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0QyxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsVUFBVSxFQUFFO1lBQ2pGLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVM7U0FDbkMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDakMsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxRQUFRLEVBQUU7Z0JBQzFELElBQUksRUFBRSxPQUFPO2dCQUNiLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFO2dCQUN2QyxVQUFVLEVBQUUsS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTthQUM1QyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsR0FBRztRQUNILDBEQUEwRDtRQUMxRCw0REFBNEQ7UUFDNUQsaURBQWlEO1FBQ2pELEVBQUU7UUFDRixNQUFNLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDdEMsTUFBTSxFQUFFLEVBQUUsRUFBRSxrQ0FBa0M7WUFDOUMsT0FBTyxFQUFFLEtBQUs7WUFDZCxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0I7WUFDeEMsUUFBUSxFQUFFLE1BQU07WUFDaEIsWUFBWSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCO1NBQ2hELENBQUMsQ0FBQztRQUVILE1BQU0sY0FBYyxHQUFHLGNBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFFOUcsb0JBQW9CO1FBQ3BCLElBQUksR0FBRyxDQUFDLGdDQUFnQyxDQUFDLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxXQUFXLEVBQUU7WUFDbEYsYUFBYSxFQUFFLE9BQU87WUFDdEIsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsb0NBQW9DO1lBQ3JGLGNBQWM7U0FDakIsQ0FBQyxDQUFDO1FBRUgsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztDQUNKO0FBMUNELG9FQTBDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJvbGUgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWlhbVwiO1xuaW1wb3J0ICogYXMgcjUzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1yb3V0ZTUzJztcbmltcG9ydCB7IFJlc291cmNlQ29udGV4dCwgUmVzb3VyY2VQcm92aWRlciB9IGZyb20gXCIuLi9zcGlcIjtcbmltcG9ydCB7U3RhY2t9IGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuXG4vKipcbiAqIFNpbXBsZSBsb29rdXAgaG9zdCB6b25lIHByb3ZpZGVyXG4gKi9cbmV4cG9ydCBjbGFzcyBMb29rdXBIb3N0ZWRab25lUHJvdmlkZXIgaW1wbGVtZW50cyBSZXNvdXJjZVByb3ZpZGVyPHI1My5JSG9zdGVkWm9uZT4ge1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGhvc3RlZFpvbmVOYW1lIG5hbWUgb2YgdGhlIGhvc3Qgem9uZSB0byBsb29rdXBcbiAgICAgKiBAcGFyYW0gaWQgIG9wdGlvbmFsIGlkIGZvciB0aGUgc3RydWN0dXJlIChmb3IgdHJhY2tpbmcpLiBzZXQgdG8gaG9zdHpvbmVuYW1lIGJ5IGRlZmF1bHRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGhvc3RlZFpvbmVOYW1lOiBzdHJpbmcsIHByaXZhdGUgaWQ/OiBzdHJpbmcpIHsgfVxuXG4gICAgcHJvdmlkZShjb250ZXh0OiBSZXNvdXJjZUNvbnRleHQpOiByNTMuSUhvc3RlZFpvbmUge1xuICAgICAgICByZXR1cm4gcjUzLkhvc3RlZFpvbmUuZnJvbUxvb2t1cChjb250ZXh0LnNjb3BlLCB0aGlzLmlkID8/IGAke3RoaXMuaG9zdGVkWm9uZU5hbWV9LUxvb2t1cGAsIHsgZG9tYWluTmFtZTogdGhpcy5ob3N0ZWRab25lTmFtZSB9KTtcbiAgICB9XG59XG4vKipcbiAqIERpcmVjdCBpbXBvcnQgaG9zdGVkIHpvbmUgcHJvdmlkZXIsIGJhc2VkIG9uIGEga25vd24gaG9zdGVkIHpvbmUgSUQuIFxuICogUmVjb21tZW5kZWQgbWV0aG9kIGlmIGhvc3RlZCB6b25lIGlkIGlzIGtub3duLCBhcyBpdCBhdm9pZHMgZXh0cmEgbG9vay11cHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBJbXBvcnRIb3N0ZWRab25lUHJvdmlkZXIgaW1wbGVtZW50cyBSZXNvdXJjZVByb3ZpZGVyPHI1My5JSG9zdGVkWm9uZT4ge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBob3N0ZWRab25lSWQ6IHN0cmluZywgcHJpdmF0ZSBpZD86IHN0cmluZykgeyB9XG5cbiAgICBwcm92aWRlKGNvbnRleHQ6IFJlc291cmNlQ29udGV4dCk6IHI1My5JSG9zdGVkWm9uZSB7XG4gICAgICAgIHJldHVybiByNTMuSG9zdGVkWm9uZS5mcm9tSG9zdGVkWm9uZUlkKGNvbnRleHQuc2NvcGUsIHRoaXMuaWQgPz8gYCR7dGhpcy5ob3N0ZWRab25lSWR9LUltcG9ydGAsIHRoaXMuaG9zdGVkWm9uZUlkKTtcbiAgICB9XG5cbn1cblxuXG5leHBvcnQgaW50ZXJmYWNlIERlbGVnYXRpbmdIb3N0ZWRab25lUHJvdmlkZXJQcm9wcyB7XG5cbiAgICAvKipcbiAgICAgKiBQYXJlbnQgZG9tYWluIG5hbWUuXG4gICAgICovXG4gICAgcGFyZW50RG9tYWluOiBzdHJpbmcsXG4gICAgLyoqXG4gICAgICogTmFtZSBmb3IgdGhlIGNoaWxkIHpvbmUgKGV4cGVjdGVkIHRvIGJlIGEgc3ViZG9tYWluIG9mIHRoZSBwYXJlbnQgaG9zdGVkIHpvbmUpLlxuICAgICAqL1xuICAgIHN1YmRvbWFpbjogc3RyaW5nLFxuXG4gICAgLyoqXG4gICAgICogQWNjb3VudCBJZCBmb3IgdGhlIHBhcmVudCBob3N0ZWQgem9uZS5cbiAgICAgKi9cbiAgICBwYXJlbnREbnNBY2NvdW50SWQ6IHN0cmluZyxcblxuICAgIC8qKlxuICAgICAqIFJvbGUgbmFtZSBpbiB0aGUgcGFyZW50IGFjY291bnQgZm9yIGRlbGVnYXRpb24uIE11c3QgaGF2ZSB0cnVzdCByZWxhdGlvbnNoaXAgc2V0IHVwIHdpdGggdGhlIHdvcmtsb2FkIGFjY291bnQgd2hlcmVcbiAgICAgKiB0aGUgRUtTIENsdXN0ZXIgQmx1ZXByaW50IGlzIHByb3Zpc2lvbmVkIChhY2NvdW50IGxldmVsIHRydXN0KS5cbiAgICAgKi9cbiAgICBkZWxlZ2F0aW5nUm9sZU5hbWU6IHN0cmluZyxcblxuICAgIC8qKlxuICAgICAqIFdoZXJlIGEgd2lsZC1jYXJkIGVudHJ5IHNob3VsZCBiZSBjcmVhdGVkIGZvciB0aGUgc3ViZG9tYWluLiBJbiB0aGlzIGNhc2UgYSB3aWxkY2FyZCBDTkFNRSByZWNvcmQgaXMgY3JlYXRlZCBhbG9uZyB3aXRoIHRoZSBzdWJkb21haW4uXG4gICAgICovXG4gICAgd2lsZGNhcmRTdWJkb21haW4/OiBib29sZWFuXG59XG5cbi8qKlxuICogRGVsZWdhdGluZyBwcm92aWRlciBpcyBhIGNvbnZlbmllbmNlIGFwcHJvYWNoIHRvIGhhdmUgYSBnbG9iYWwgaG9zdGVkIHpvbmUgcmVjb3JkIGluIGEgY2VudHJhbGl6ZWQgXG4gKiBhY2NvdW50IGFuZCBzdWJkb21haW4gcmVjb3JkcyBpbiByZXNwZWN0aXZlIHdvcmtsb2FkIGFjY291bnRzLiBcbiAqIFxuICogVGhlIGRlbGVnYXRpb24gcGFydCBhbGxvd3Mgcm91dGluZyBzdWJkb21haW4gZW50cmllcyB0byB0aGUgY2hpbGQgaG9zdGVkIHpvbmUgaW4gdGhlIHdvcmtsb2FkIGFjY291bnQuXG4gKi9cbmV4cG9ydCBjbGFzcyBEZWxlZ2F0aW5nSG9zdGVkWm9uZVByb3ZpZGVyIGltcGxlbWVudHMgUmVzb3VyY2VQcm92aWRlcjxyNTMuSUhvc3RlZFpvbmU+IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG9wdGlvbnM6IERlbGVnYXRpbmdIb3N0ZWRab25lUHJvdmlkZXJQcm9wcykgeyB9XG5cbiAgICBwcm92aWRlKGNvbnRleHQ6IFJlc291cmNlQ29udGV4dCk6IHI1My5JSG9zdGVkWm9uZSB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2YoY29udGV4dC5zY29wZSk7XG5cbiAgICAgICAgY29uc3Qgc3ViWm9uZSA9IG5ldyByNTMuUHVibGljSG9zdGVkWm9uZShzdGFjaywgYCR7dGhpcy5vcHRpb25zLnN1YmRvbWFpbn0tU3ViWm9uZWAsIHtcbiAgICAgICAgICAgIHpvbmVOYW1lOiB0aGlzLm9wdGlvbnMuc3ViZG9tYWluXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMud2lsZGNhcmRTdWJkb21haW4pIHtcbiAgICAgICAgICAgIG5ldyByNTMuQ25hbWVSZWNvcmQoc3RhY2ssIGAke3RoaXMub3B0aW9ucy5zdWJkb21haW59LWNuYW1lYCwge1xuICAgICAgICAgICAgICAgIHpvbmU6IHN1YlpvbmUsXG4gICAgICAgICAgICAgICAgZG9tYWluTmFtZTogYCR7dGhpcy5vcHRpb25zLnN1YmRvbWFpbn1gLFxuICAgICAgICAgICAgICAgIHJlY29yZE5hbWU6IGAqLiR7dGhpcy5vcHRpb25zLnN1YmRvbWFpbn1gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFxuICAgICAgICAvLyBpbXBvcnQgdGhlIGRlbGVnYXRpb24gcm9sZSBieSBjb25zdHJ1Y3RpbmcgdGhlIHJvbGVBcm4uXG4gICAgICAgIC8vIEFzc3VtaW5nIHRoZSBwYXJlbnQgYWNjb3VudCBoYXMgdGhlIGRlbGVnYXRpbmcgcm9sZSB3aXRoIFxuICAgICAgICAvLyB0cnVzdCByZWxhdGlvbnNoaXAgc2V0dXAgdG8gdGhlIGNoaWxkIGFjY291bnQuXG4gICAgICAgIC8vXG4gICAgICAgIGNvbnN0IGRlbGVnYXRpb25Sb2xlQXJuID0gc3RhY2suZm9ybWF0QXJuKHtcbiAgICAgICAgICAgIHJlZ2lvbjogJycsIC8vIElBTSBpcyBnbG9iYWwgaW4gZWFjaCBwYXJ0aXRpb25cbiAgICAgICAgICAgIHNlcnZpY2U6ICdpYW0nLFxuICAgICAgICAgICAgYWNjb3VudDogdGhpcy5vcHRpb25zLnBhcmVudERuc0FjY291bnRJZCxcbiAgICAgICAgICAgIHJlc291cmNlOiAncm9sZScsXG4gICAgICAgICAgICByZXNvdXJjZU5hbWU6IHRoaXMub3B0aW9ucy5kZWxlZ2F0aW5nUm9sZU5hbWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZGVsZWdhdGlvblJvbGUgPSBSb2xlLmZyb21Sb2xlQXJuKHN0YWNrLCBgJHt0aGlzLm9wdGlvbnMuc3ViZG9tYWlufS1EZWxlZ2F0aW9uUm9sZWAsIGRlbGVnYXRpb25Sb2xlQXJuKTtcblxuICAgICAgICAvLyBjcmVhdGUgdGhlIHJlY29yZFxuICAgICAgICBuZXcgcjUzLkNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUmVjb3JkKHN0YWNrLCBgJHt0aGlzLm9wdGlvbnMuc3ViZG9tYWlufS1kZWxlZ2F0ZWAsIHtcbiAgICAgICAgICAgIGRlbGVnYXRlZFpvbmU6IHN1YlpvbmUsXG4gICAgICAgICAgICBwYXJlbnRIb3N0ZWRab25lTmFtZTogdGhpcy5vcHRpb25zLnBhcmVudERvbWFpbiwgLy8gb3IgeW91IGNhbiB1c2UgcGFyZW50SG9zdGVkWm9uZUlkXG4gICAgICAgICAgICBkZWxlZ2F0aW9uUm9sZVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc3ViWm9uZTtcbiAgICB9XG59XG4iXX0=