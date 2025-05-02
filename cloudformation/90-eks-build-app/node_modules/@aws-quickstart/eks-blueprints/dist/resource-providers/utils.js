"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNamedResource = getNamedResource;
exports.getResource = getResource;
const proxy_utils_1 = require("../utils/proxy-utils");
const uuid_1 = require("uuid");
/**
 * Creates a proxy to the named resource provider. This proxy will resolve to the type of the
 * resource provider under the provided name.
 * It enables getting references to resources outside of the Stack construct and using them with the blueprint:
 * @example
 * const app = new cdk.App();
 * const adminRole: iam.IRole = blueprints.getNamedResource("my-admin-role""); // note, there is no stack class here
 *
 * const clusterProvider = new blueprints.GenericClusterProvider({
     mastersRole: adminRole,
     ... other props
 * });
 * @param resourceName
 * @returns
 */
function getNamedResource(resourceName) {
    return new Proxy({}, new proxy_utils_1.DummyProxy((resourceContext) => {
        return resourceContext.get(resourceName);
    }));
}
/**
 * Creates a proxy to an anonymous resource. This function allows passing the provider function as input.
 * It enables creating ad-hoc references outside of the Stack construct and using them with the blueprint.
 * Designed for cases when resource is defined once and needed in a single place.
 * @example
 * const app = new cdk.App();
 * const clusterProvider = new blueprints.GenericClusterProvider({
 *   mastersRole: blueprints.getResource(context => { // will generate a unique name for resource.
        return new iam.Role(context.scope, 'AdminRole', { assumedBy: new AccountRootPrincipal()});
    }),
    ... other props
});
 * @param resourceName
 * @returns
 */
function getResource(fn) {
    const uid = (0, uuid_1.v4)();
    return new Proxy({}, new proxy_utils_1.DummyProxy((resourceContext) => {
        let result = resourceContext.get(uid);
        if (result == null) {
            resourceContext.add(uid, {
                provide(context) {
                    return fn(context);
                }
            });
            result = resourceContext.get(uid);
        }
        return result;
    }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvcmVzb3VyY2UtcHJvdmlkZXJzL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBcUJBLDRDQUlDO0FBaUJELGtDQWNDO0FBdkRELHNEQUFrRDtBQUVsRCwrQkFBa0M7QUFHbEM7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxTQUFnQixnQkFBZ0IsQ0FBb0MsWUFBcUI7SUFDckYsT0FBTyxJQUFJLEtBQUssQ0FBQyxFQUFPLEVBQUUsSUFBSSx3QkFBVSxDQUFDLENBQUMsZUFBZ0MsRUFBRSxFQUFFO1FBQzFFLE9BQU8sZUFBZSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQU0sQ0FBQztJQUNsRCxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ1IsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0gsU0FBZ0IsV0FBVyxDQUFrQyxFQUFtQztJQUM1RixNQUFNLEdBQUcsR0FBRyxJQUFBLFNBQUksR0FBRSxDQUFDO0lBQ25CLE9BQU8sSUFBSSxLQUFLLENBQUMsRUFBTyxFQUFFLElBQUksd0JBQVUsQ0FBQyxDQUFDLGVBQWdDLEVBQUUsRUFBRTtRQUMxRSxJQUFJLE1BQU0sR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLElBQUcsTUFBTSxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ2hCLGVBQWUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO2dCQUNyQixPQUFPLENBQUMsT0FBd0I7b0JBQzVCLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN2QixDQUFDO2FBQ0osQ0FBQyxDQUFDO1lBQ0gsTUFBTSxHQUFHLGVBQWUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFNLENBQUM7UUFDM0MsQ0FBQztRQUNELE9BQU8sTUFBVyxDQUFDO0lBQ3ZCLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDUixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVJlc291cmNlIH0gZnJvbSAnYXdzLWNkay1saWIvY29yZSc7XG5pbXBvcnQgeyBEdW1teVByb3h5IH0gZnJvbSAnLi4vdXRpbHMvcHJveHktdXRpbHMnO1xuaW1wb3J0IHsgUmVzb3VyY2VDb250ZXh0IH0gZnJvbSAnLi4vc3BpJztcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgcHJveHkgdG8gdGhlIG5hbWVkIHJlc291cmNlIHByb3ZpZGVyLiBUaGlzIHByb3h5IHdpbGwgcmVzb2x2ZSB0byB0aGUgdHlwZSBvZiB0aGUgXG4gKiByZXNvdXJjZSBwcm92aWRlciB1bmRlciB0aGUgcHJvdmlkZWQgbmFtZS4gXG4gKiBJdCBlbmFibGVzIGdldHRpbmcgcmVmZXJlbmNlcyB0byByZXNvdXJjZXMgb3V0c2lkZSBvZiB0aGUgU3RhY2sgY29uc3RydWN0IGFuZCB1c2luZyB0aGVtIHdpdGggdGhlIGJsdWVwcmludDpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICogY29uc3QgYWRtaW5Sb2xlOiBpYW0uSVJvbGUgPSBibHVlcHJpbnRzLmdldE5hbWVkUmVzb3VyY2UoXCJteS1hZG1pbi1yb2xlXCJcIik7IC8vIG5vdGUsIHRoZXJlIGlzIG5vIHN0YWNrIGNsYXNzIGhlcmVcbiAqIFxuICogY29uc3QgY2x1c3RlclByb3ZpZGVyID0gbmV3IGJsdWVwcmludHMuR2VuZXJpY0NsdXN0ZXJQcm92aWRlcih7XG4gICAgIG1hc3RlcnNSb2xlOiBhZG1pblJvbGUsXG4gICAgIC4uLiBvdGhlciBwcm9wc1xuICogfSk7XG4gKiBAcGFyYW0gcmVzb3VyY2VOYW1lIFxuICogQHJldHVybnMgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lZFJlc291cmNlPFQgZXh0ZW5kcyBJQ29uc3RydWN0ID0gSUNvbnN0cnVjdD4ocmVzb3VyY2VOYW1lIDogc3RyaW5nKSA6IFQge1xuICAgIHJldHVybiBuZXcgUHJveHkoe30gYXMgVCwgbmV3IER1bW15UHJveHkoKHJlc291cmNlQ29udGV4dDogUmVzb3VyY2VDb250ZXh0KSA9PiB7XG4gICAgICAgIHJldHVybiByZXNvdXJjZUNvbnRleHQuZ2V0KHJlc291cmNlTmFtZSkgYXMgVDtcbiAgICB9KSk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHByb3h5IHRvIGFuIGFub255bW91cyByZXNvdXJjZS4gVGhpcyBmdW5jdGlvbiBhbGxvd3MgcGFzc2luZyB0aGUgcHJvdmlkZXIgZnVuY3Rpb24gYXMgaW5wdXQuICBcbiAqIEl0IGVuYWJsZXMgY3JlYXRpbmcgYWQtaG9jIHJlZmVyZW5jZXMgb3V0c2lkZSBvZiB0aGUgU3RhY2sgY29uc3RydWN0IGFuZCB1c2luZyB0aGVtIHdpdGggdGhlIGJsdWVwcmludC5cbiAqIERlc2lnbmVkIGZvciBjYXNlcyB3aGVuIHJlc291cmNlIGlzIGRlZmluZWQgb25jZSBhbmQgbmVlZGVkIGluIGEgc2luZ2xlIHBsYWNlLlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gKiBjb25zdCBjbHVzdGVyUHJvdmlkZXIgPSBuZXcgYmx1ZXByaW50cy5HZW5lcmljQ2x1c3RlclByb3ZpZGVyKHtcbiAqICAgbWFzdGVyc1JvbGU6IGJsdWVwcmludHMuZ2V0UmVzb3VyY2UoY29udGV4dCA9PiB7IC8vIHdpbGwgZ2VuZXJhdGUgYSB1bmlxdWUgbmFtZSBmb3IgcmVzb3VyY2UuIFxuICAgICAgICByZXR1cm4gbmV3IGlhbS5Sb2xlKGNvbnRleHQuc2NvcGUsICdBZG1pblJvbGUnLCB7IGFzc3VtZWRCeTogbmV3IEFjY291bnRSb290UHJpbmNpcGFsKCl9KTtcbiAgICB9KSxcbiAgICAuLi4gb3RoZXIgcHJvcHNcbn0pO1xuICogQHBhcmFtIHJlc291cmNlTmFtZSBcbiAqIEByZXR1cm5zIFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVzb3VyY2U8VCBleHRlbmRzIElSZXNvdXJjZSA9IElSZXNvdXJjZT4oZm46IChjb250ZXh0OiBSZXNvdXJjZUNvbnRleHQpID0+IFQpIDogVCB7XG4gICAgY29uc3QgdWlkID0gdXVpZCgpO1xuICAgIHJldHVybiBuZXcgUHJveHkoe30gYXMgVCwgbmV3IER1bW15UHJveHkoKHJlc291cmNlQ29udGV4dDogUmVzb3VyY2VDb250ZXh0KSA9PiB7XG4gICAgICAgIGxldCByZXN1bHQgPSByZXNvdXJjZUNvbnRleHQuZ2V0KHVpZCk7XG4gICAgICAgIGlmKHJlc3VsdCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXNvdXJjZUNvbnRleHQuYWRkKHVpZCwge1xuICAgICAgICAgICAgICAgIHByb3ZpZGUoY29udGV4dDogUmVzb3VyY2VDb250ZXh0KSA6IFQge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4oY29udGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXN1bHQgPSByZXNvdXJjZUNvbnRleHQuZ2V0KHVpZCkgYXMgVDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0IGFzIFQ7XG4gICAgfSkpO1xufVxuIl19