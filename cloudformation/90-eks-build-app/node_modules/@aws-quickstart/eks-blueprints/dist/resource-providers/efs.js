"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LookupEfsFileSystemProvider = exports.CreateEfsFileSystemProvider = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const efs = require("aws-cdk-lib/aws-efs");
const spi_1 = require("../spi");
/**
 * EFS resource provider.
 *
 * @param name The name of the EFS file system to create.
 * @param efsProps The props used for the file system.
 */
class CreateEfsFileSystemProvider {
    constructor(options) {
        this.options = options;
    }
    provide(context) {
        var _a;
        const id = context.scope.node.id;
        const securityGroupId = `${id}-${(_a = this.options.name) !== null && _a !== void 0 ? _a : "default"}-EfsSecurityGroup`;
        let efsFileSystem;
        const vpc = context.get(spi_1.GlobalResources.Vpc);
        if (vpc === undefined) {
            throw new Error("VPC not found in context");
        }
        const clusterVpcCidr = vpc.vpcCidrBlock;
        let kmsKey;
        if (this.options.kmsKeyResourceName) {
            kmsKey = context.get(this.options.kmsKeyResourceName);
        }
        const efsSG = new ec2.SecurityGroup(context.scope, securityGroupId, {
            vpc,
            securityGroupName: securityGroupId,
        });
        efsSG.addIngressRule(ec2.Peer.ipv4(clusterVpcCidr), new ec2.Port({
            protocol: ec2.Protocol.TCP,
            stringRepresentation: "EFSconnection",
            toPort: 2049,
            fromPort: 2049,
        }));
        efsFileSystem = new efs.FileSystem(context.scope, this.options.name || `${id}-EfsFileSystem`, {
            vpc,
            securityGroup: efsSG,
            kmsKey,
            ...this.options.efsProps,
        });
        new aws_cdk_lib_1.CfnOutput(context.scope, "EfsFileSystemId", {
            value: efsFileSystem.fileSystemId,
        });
        return efsFileSystem;
    }
}
exports.CreateEfsFileSystemProvider = CreateEfsFileSystemProvider;
/**
 * Pass an EFS file system name and id to lookup an existing EFS file system.
 * @param name The name of the EFS file system to lookup an existing EFS file system.
 * @param fileSystemId The id of the EFS file system to lookup an existing EFS file system.
 */
class LookupEfsFileSystemProvider {
    constructor(options) {
        this.options = options;
    }
    provide(context) {
        var _a;
        const id = context.scope.node.id;
        const securityGroupId = `${id}-${(_a = this.options.name) !== null && _a !== void 0 ? _a : "default"}-EfsSecurityGroup`;
        let efsFileSystem;
        const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(context.scope, securityGroupId, securityGroupId);
        efsFileSystem = efs.FileSystem.fromFileSystemAttributes(context.scope, this.options.name, {
            securityGroup: securityGroup,
            fileSystemId: this.options.fileSystemId,
        });
        new aws_cdk_lib_1.CfnOutput(context.scope, "EfsFileSystemId", {
            value: efsFileSystem.fileSystemId,
        });
        return efsFileSystem;
    }
}
exports.LookupEfsFileSystemProvider = LookupEfsFileSystemProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWZzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL3Jlc291cmNlLXByb3ZpZGVycy9lZnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQXdDO0FBQ3hDLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFFM0MsZ0NBQTRFO0FBYTVFOzs7OztHQUtHO0FBQ0gsTUFBYSwyQkFBMkI7SUFLdEMsWUFBWSxPQUFpQztRQUMzQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUN6QixDQUFDO0lBRUQsT0FBTyxDQUFDLE9BQXdCOztRQUM5QixNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDakMsTUFBTSxlQUFlLEdBQUcsR0FBRyxFQUFFLElBQzNCLE1BQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLG1DQUFJLFNBQ3ZCLG1CQUFtQixDQUFDO1FBQ3BCLElBQUksYUFBMEMsQ0FBQztRQUMvQyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFlLENBQUMsR0FBRyxDQUFhLENBQUM7UUFDekQsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFDRCxNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDO1FBQ3hDLElBQUksTUFBNEIsQ0FBQztRQUNqQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUNwQyxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFhLENBQUM7UUFDcEUsQ0FBQztRQUVELE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRTtZQUNsRSxHQUFHO1lBQ0gsaUJBQWlCLEVBQUUsZUFBZTtTQUNuQyxDQUFDLENBQUM7UUFDSCxLQUFLLENBQUMsY0FBYyxDQUNsQixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFDN0IsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ1gsUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRztZQUMxQixvQkFBb0IsRUFBRSxlQUFlO1lBQ3JDLE1BQU0sRUFBRSxJQUFJO1lBQ1osUUFBUSxFQUFFLElBQUk7U0FDZixDQUFDLENBQ0gsQ0FBQztRQUVGLGFBQWEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQ2hDLE9BQU8sQ0FBQyxLQUFLLEVBQ2IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFLGdCQUFnQixFQUMxQztZQUNFLEdBQUc7WUFDSCxhQUFhLEVBQUUsS0FBSztZQUNwQixNQUFNO1lBQ04sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVE7U0FDekIsQ0FDRixDQUFDO1FBQ0YsSUFBSSx1QkFBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLEVBQUU7WUFDOUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxZQUFZO1NBQ2xDLENBQUMsQ0FBQztRQUNILE9BQU8sYUFBYSxDQUFDO0lBQ3ZCLENBQUM7Q0FDRjtBQXRERCxrRUFzREM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBYSwyQkFBMkI7SUFLdEMsWUFBWSxPQUFpQztRQUMzQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUN6QixDQUFDO0lBRUQsT0FBTyxDQUFDLE9BQXdCOztRQUM5QixNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDakMsTUFBTSxlQUFlLEdBQUcsR0FBRyxFQUFFLElBQzNCLE1BQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLG1DQUFJLFNBQ3ZCLG1CQUFtQixDQUFDO1FBQ3BCLElBQUksYUFBMEMsQ0FBQztRQUUvQyxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUN6RCxPQUFPLENBQUMsS0FBSyxFQUNiLGVBQWUsRUFDZixlQUFlLENBQ2hCLENBQUM7UUFDRixhQUFhLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FDckQsT0FBTyxDQUFDLEtBQUssRUFDYixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFDakI7WUFDRSxhQUFhLEVBQUUsYUFBYTtZQUM1QixZQUFZLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZO1NBQ3hDLENBQ0YsQ0FBQztRQUVGLElBQUksdUJBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFO1lBQzlDLEtBQUssRUFBRSxhQUFhLENBQUMsWUFBWTtTQUNsQyxDQUFDLENBQUM7UUFDSCxPQUFPLGFBQWEsQ0FBQztJQUN2QixDQUFDO0NBQ0Y7QUFuQ0Qsa0VBbUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2ZuT3V0cHV0IH0gZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSBcImF3cy1jZGstbGliL2F3cy1lYzJcIjtcbmltcG9ydCAqIGFzIGVmcyBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWVmc1wiO1xuaW1wb3J0ICogYXMga21zIGZyb20gXCJhd3MtY2RrLWxpYi9hd3Mta21zXCI7XG5pbXBvcnQgeyBHbG9iYWxSZXNvdXJjZXMsIFJlc291cmNlQ29udGV4dCwgUmVzb3VyY2VQcm92aWRlciB9IGZyb20gXCIuLi9zcGlcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDcmVhdGVFZnNGaWxlU3lzdGVtUHJvcHMge1xuICByZWFkb25seSBuYW1lPzogc3RyaW5nO1xuICByZWFkb25seSBlZnNQcm9wcz86IE9taXQ8ZWZzLkZpbGVTeXN0ZW1Qcm9wcywgXCJ2cGNcIiB8IFwia21zS2V5XCI+O1xuICByZWFkb25seSBrbXNLZXlSZXNvdXJjZU5hbWU/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTG9va3VwRWZzRmlsZVN5c3RlbVByb3BzIHtcbiAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuICByZWFkb25seSBmaWxlU3lzdGVtSWQ6IHN0cmluZztcbn1cblxuLyoqXG4gKiBFRlMgcmVzb3VyY2UgcHJvdmlkZXIuXG4gKlxuICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgb2YgdGhlIEVGUyBmaWxlIHN5c3RlbSB0byBjcmVhdGUuXG4gKiBAcGFyYW0gZWZzUHJvcHMgVGhlIHByb3BzIHVzZWQgZm9yIHRoZSBmaWxlIHN5c3RlbS5cbiAqL1xuZXhwb3J0IGNsYXNzIENyZWF0ZUVmc0ZpbGVTeXN0ZW1Qcm92aWRlclxuICBpbXBsZW1lbnRzIFJlc291cmNlUHJvdmlkZXI8ZWZzLklGaWxlU3lzdGVtPlxue1xuICByZWFkb25seSBvcHRpb25zOiBDcmVhdGVFZnNGaWxlU3lzdGVtUHJvcHM7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogQ3JlYXRlRWZzRmlsZVN5c3RlbVByb3BzKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIHByb3ZpZGUoY29udGV4dDogUmVzb3VyY2VDb250ZXh0KTogZWZzLklGaWxlU3lzdGVtIHtcbiAgICBjb25zdCBpZCA9IGNvbnRleHQuc2NvcGUubm9kZS5pZDtcbiAgICBjb25zdCBzZWN1cml0eUdyb3VwSWQgPSBgJHtpZH0tJHtcbiAgICAgIHRoaXMub3B0aW9ucy5uYW1lID8/IFwiZGVmYXVsdFwiXG4gICAgfS1FZnNTZWN1cml0eUdyb3VwYDtcbiAgICBsZXQgZWZzRmlsZVN5c3RlbTogZWZzLklGaWxlU3lzdGVtIHwgdW5kZWZpbmVkO1xuICAgIGNvbnN0IHZwYyA9IGNvbnRleHQuZ2V0KEdsb2JhbFJlc291cmNlcy5WcGMpIGFzIGVjMi5JVnBjO1xuICAgIGlmICh2cGMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVlBDIG5vdCBmb3VuZCBpbiBjb250ZXh0XCIpO1xuICAgIH1cbiAgICBjb25zdCBjbHVzdGVyVnBjQ2lkciA9IHZwYy52cGNDaWRyQmxvY2s7XG4gICAgbGV0IGttc0tleToga21zLklLZXkgfCB1bmRlZmluZWQ7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5rbXNLZXlSZXNvdXJjZU5hbWUpIHtcbiAgICAgIGttc0tleSA9IGNvbnRleHQuZ2V0KHRoaXMub3B0aW9ucy5rbXNLZXlSZXNvdXJjZU5hbWUpIGFzIGttcy5JS2V5O1xuICAgIH1cblxuICAgIGNvbnN0IGVmc1NHID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKGNvbnRleHQuc2NvcGUsIHNlY3VyaXR5R3JvdXBJZCwge1xuICAgICAgdnBjLFxuICAgICAgc2VjdXJpdHlHcm91cE5hbWU6IHNlY3VyaXR5R3JvdXBJZCxcbiAgICB9KTtcbiAgICBlZnNTRy5hZGRJbmdyZXNzUnVsZShcbiAgICAgIGVjMi5QZWVyLmlwdjQoY2x1c3RlclZwY0NpZHIpLFxuICAgICAgbmV3IGVjMi5Qb3J0KHtcbiAgICAgICAgcHJvdG9jb2w6IGVjMi5Qcm90b2NvbC5UQ1AsXG4gICAgICAgIHN0cmluZ1JlcHJlc2VudGF0aW9uOiBcIkVGU2Nvbm5lY3Rpb25cIixcbiAgICAgICAgdG9Qb3J0OiAyMDQ5LFxuICAgICAgICBmcm9tUG9ydDogMjA0OSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGVmc0ZpbGVTeXN0ZW0gPSBuZXcgZWZzLkZpbGVTeXN0ZW0oXG4gICAgICBjb250ZXh0LnNjb3BlLFxuICAgICAgdGhpcy5vcHRpb25zLm5hbWUgfHwgYCR7aWR9LUVmc0ZpbGVTeXN0ZW1gLFxuICAgICAge1xuICAgICAgICB2cGMsXG4gICAgICAgIHNlY3VyaXR5R3JvdXA6IGVmc1NHLFxuICAgICAgICBrbXNLZXksXG4gICAgICAgIC4uLnRoaXMub3B0aW9ucy5lZnNQcm9wcyxcbiAgICAgIH1cbiAgICApO1xuICAgIG5ldyBDZm5PdXRwdXQoY29udGV4dC5zY29wZSwgXCJFZnNGaWxlU3lzdGVtSWRcIiwge1xuICAgICAgdmFsdWU6IGVmc0ZpbGVTeXN0ZW0uZmlsZVN5c3RlbUlkLFxuICAgIH0pO1xuICAgIHJldHVybiBlZnNGaWxlU3lzdGVtO1xuICB9XG59XG5cbi8qKlxuICogUGFzcyBhbiBFRlMgZmlsZSBzeXN0ZW0gbmFtZSBhbmQgaWQgdG8gbG9va3VwIGFuIGV4aXN0aW5nIEVGUyBmaWxlIHN5c3RlbS5cbiAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBFRlMgZmlsZSBzeXN0ZW0gdG8gbG9va3VwIGFuIGV4aXN0aW5nIEVGUyBmaWxlIHN5c3RlbS5cbiAqIEBwYXJhbSBmaWxlU3lzdGVtSWQgVGhlIGlkIG9mIHRoZSBFRlMgZmlsZSBzeXN0ZW0gdG8gbG9va3VwIGFuIGV4aXN0aW5nIEVGUyBmaWxlIHN5c3RlbS5cbiAqL1xuZXhwb3J0IGNsYXNzIExvb2t1cEVmc0ZpbGVTeXN0ZW1Qcm92aWRlclxuICBpbXBsZW1lbnRzIFJlc291cmNlUHJvdmlkZXI8ZWZzLklGaWxlU3lzdGVtPlxue1xuICByZWFkb25seSBvcHRpb25zOiBMb29rdXBFZnNGaWxlU3lzdGVtUHJvcHM7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogTG9va3VwRWZzRmlsZVN5c3RlbVByb3BzKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIHByb3ZpZGUoY29udGV4dDogUmVzb3VyY2VDb250ZXh0KTogZWZzLklGaWxlU3lzdGVtIHtcbiAgICBjb25zdCBpZCA9IGNvbnRleHQuc2NvcGUubm9kZS5pZDtcbiAgICBjb25zdCBzZWN1cml0eUdyb3VwSWQgPSBgJHtpZH0tJHtcbiAgICAgIHRoaXMub3B0aW9ucy5uYW1lID8/IFwiZGVmYXVsdFwiXG4gICAgfS1FZnNTZWN1cml0eUdyb3VwYDtcbiAgICBsZXQgZWZzRmlsZVN5c3RlbTogZWZzLklGaWxlU3lzdGVtIHwgdW5kZWZpbmVkO1xuXG4gICAgY29uc3Qgc2VjdXJpdHlHcm91cCA9IGVjMi5TZWN1cml0eUdyb3VwLmZyb21TZWN1cml0eUdyb3VwSWQoXG4gICAgICBjb250ZXh0LnNjb3BlLFxuICAgICAgc2VjdXJpdHlHcm91cElkLFxuICAgICAgc2VjdXJpdHlHcm91cElkXG4gICAgKTtcbiAgICBlZnNGaWxlU3lzdGVtID0gZWZzLkZpbGVTeXN0ZW0uZnJvbUZpbGVTeXN0ZW1BdHRyaWJ1dGVzKFxuICAgICAgY29udGV4dC5zY29wZSxcbiAgICAgIHRoaXMub3B0aW9ucy5uYW1lLFxuICAgICAge1xuICAgICAgICBzZWN1cml0eUdyb3VwOiBzZWN1cml0eUdyb3VwLFxuICAgICAgICBmaWxlU3lzdGVtSWQ6IHRoaXMub3B0aW9ucy5maWxlU3lzdGVtSWQsXG4gICAgICB9XG4gICAgKTtcblxuICAgIG5ldyBDZm5PdXRwdXQoY29udGV4dC5zY29wZSwgXCJFZnNGaWxlU3lzdGVtSWRcIiwge1xuICAgICAgdmFsdWU6IGVmc0ZpbGVTeXN0ZW0uZmlsZVN5c3RlbUlkLFxuICAgIH0pO1xuICAgIHJldHVybiBlZnNGaWxlU3lzdGVtO1xuICB9XG59XG4iXX0=