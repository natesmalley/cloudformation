"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyProxy = exports.sourceFunction = exports.isDynamicProxy = void 0;
exports.resolveTarget = resolveTarget;
const nutil = require("node:util/types");
/**
 * Symbol that uniquely designates that a particular proxy is instance of our DummyProxy
 */
exports.isDynamicProxy = Symbol("isDynamicProxy");
/**
 * Symbol that retrieves the source function from the proxy. This function is expected to create the required target (e.g. resource).
 */
exports.sourceFunction = Symbol("sourceFunction");
/**
 * Simple proxy implementation that will require resolution at runtime (enables lazy loading).
 * Unlike dynamic proxy that can create target on the fly, this proxy
 * just a place-holder that supplies the function that can be used to resolve the target.
 * Since most CDK constructs are not idempotent (meaning you can not call a create function twice, the second will fail)
 * this design choice was the simplest to support declarative resources.
 * Customers can clone the supplied JSON structure with cloneDeep and replace proxies with the actual targets as part of that process.
 */
class DummyProxy {
    constructor(source) {
        this.source = source;
    }
    get(_, key) {
        if (key === exports.isDynamicProxy) {
            return true;
        }
        if (key === exports.sourceFunction) {
            return this.source;
        }
        return new Proxy({}, new DummyProxy((arg) => {
            return this.source(arg)[key];
        }));
    }
}
exports.DummyProxy = DummyProxy;
/**
 * Function resolves the proxy with the target, that enables lazy loading use cases.
 * @param value potential proxy to resolve
 * @param arg represents the argument that should be passed to the resolution function (sourceFunction).
 * @returns
 */
function resolveTarget(value, arg) {
    if (nutil.isProxy(value)) {
        const object = value;
        if (object[exports.isDynamicProxy]) {
            const fn = object[exports.sourceFunction];
            return fn(arg);
        }
    }
    return value;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHktdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvdXRpbHMvcHJveHktdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBK0NBLHNDQVNDO0FBeERELHlDQUF5QztBQUl6Qzs7R0FFRztBQUNVLFFBQUEsY0FBYyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBRXZEOztHQUVHO0FBQ1UsUUFBQSxjQUFjLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFFdkQ7Ozs7Ozs7R0FPRztBQUNILE1BQWEsVUFBVTtJQUVuQixZQUFvQixNQUFvQjtRQUFwQixXQUFNLEdBQU4sTUFBTSxDQUFjO0lBQUcsQ0FBQztJQUVyQyxHQUFHLENBQUMsQ0FBSSxFQUFFLEdBQWdCO1FBQzdCLElBQUcsR0FBRyxLQUFLLHNCQUFjLEVBQUUsQ0FBQztZQUN4QixPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRUQsSUFBRyxHQUFHLEtBQUssc0JBQWMsRUFBRSxDQUFDO1lBQ3hCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN2QixDQUFDO1FBRUQsT0FBTyxJQUFJLEtBQUssQ0FBQyxFQUFTLEVBQUUsSUFBSSxVQUFVLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUMvQyxPQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7Q0FDSjtBQWpCRCxnQ0FpQkM7QUFFRDs7Ozs7R0FLRztBQUNILFNBQWdCLGFBQWEsQ0FBQyxLQUFVLEVBQUUsR0FBUTtJQUM5QyxJQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUN0QixNQUFNLE1BQU0sR0FBUyxLQUFLLENBQUM7UUFDM0IsSUFBRyxNQUFNLENBQUMsc0JBQWMsQ0FBQyxFQUFFLENBQUM7WUFDeEIsTUFBTSxFQUFFLEdBQW1CLE1BQU0sQ0FBQyxzQkFBYyxDQUFDLENBQUM7WUFDbEQsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkIsQ0FBQztJQUNMLENBQUM7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbnV0aWwgZnJvbSAnbm9kZTp1dGlsL3R5cGVzJztcblxuZXhwb3J0IHR5cGUgT25lQXJnRm48VD4gPSAoYXJnOiBhbnkpID0+IFQ7XG5cbi8qKlxuICogU3ltYm9sIHRoYXQgdW5pcXVlbHkgZGVzaWduYXRlcyB0aGF0IGEgcGFydGljdWxhciBwcm94eSBpcyBpbnN0YW5jZSBvZiBvdXIgRHVtbXlQcm94eVxuICovXG5leHBvcnQgY29uc3QgaXNEeW5hbWljUHJveHkgPSBTeW1ib2woXCJpc0R5bmFtaWNQcm94eVwiKTtcblxuLyoqXG4gKiBTeW1ib2wgdGhhdCByZXRyaWV2ZXMgdGhlIHNvdXJjZSBmdW5jdGlvbiBmcm9tIHRoZSBwcm94eS4gVGhpcyBmdW5jdGlvbiBpcyBleHBlY3RlZCB0byBjcmVhdGUgdGhlIHJlcXVpcmVkIHRhcmdldCAoZS5nLiByZXNvdXJjZSkuXG4gKi9cbmV4cG9ydCBjb25zdCBzb3VyY2VGdW5jdGlvbiA9IFN5bWJvbChcInNvdXJjZUZ1bmN0aW9uXCIpO1xuXG4vKipcbiAqIFNpbXBsZSBwcm94eSBpbXBsZW1lbnRhdGlvbiB0aGF0IHdpbGwgcmVxdWlyZSByZXNvbHV0aW9uIGF0IHJ1bnRpbWUgKGVuYWJsZXMgbGF6eSBsb2FkaW5nKS5cbiAqIFVubGlrZSBkeW5hbWljIHByb3h5IHRoYXQgY2FuIGNyZWF0ZSB0YXJnZXQgb24gdGhlIGZseSwgdGhpcyBwcm94eVxuICoganVzdCBhIHBsYWNlLWhvbGRlciB0aGF0IHN1cHBsaWVzIHRoZSBmdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlc29sdmUgdGhlIHRhcmdldC4gXG4gKiBTaW5jZSBtb3N0IENESyBjb25zdHJ1Y3RzIGFyZSBub3QgaWRlbXBvdGVudCAobWVhbmluZyB5b3UgY2FuIG5vdCBjYWxsIGEgY3JlYXRlIGZ1bmN0aW9uIHR3aWNlLCB0aGUgc2Vjb25kIHdpbGwgZmFpbClcbiAqIHRoaXMgZGVzaWduIGNob2ljZSB3YXMgdGhlIHNpbXBsZXN0IHRvIHN1cHBvcnQgZGVjbGFyYXRpdmUgcmVzb3VyY2VzLiBcbiAqIEN1c3RvbWVycyBjYW4gY2xvbmUgdGhlIHN1cHBsaWVkIEpTT04gc3RydWN0dXJlIHdpdGggY2xvbmVEZWVwIGFuZCByZXBsYWNlIHByb3hpZXMgd2l0aCB0aGUgYWN0dWFsIHRhcmdldHMgYXMgcGFydCBvZiB0aGF0IHByb2Nlc3MuXG4gKi9cbmV4cG9ydCBjbGFzcyBEdW1teVByb3h5PFQgZXh0ZW5kcyBvYmplY3Q+IGltcGxlbWVudHMgUHJveHlIYW5kbGVyPFQ+IHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgc291cmNlIDogT25lQXJnRm48VD4pIHt9XG5cbiAgICBwdWJsaWMgZ2V0KF86IFQsIGtleTogUHJvcGVydHlLZXkpOiBhbnkge1xuICAgICAgICBpZihrZXkgPT09IGlzRHluYW1pY1Byb3h5KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYoa2V5ID09PSBzb3VyY2VGdW5jdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh7fSBhcyBhbnksIG5ldyBEdW1teVByb3h5KChhcmcpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5zb3VyY2UoYXJnKSBhcyBhbnkpW2tleV07XG4gICAgICAgIH0pKTtcbiAgICB9XG59XG5cbi8qKlxuICogRnVuY3Rpb24gcmVzb2x2ZXMgdGhlIHByb3h5IHdpdGggdGhlIHRhcmdldCwgdGhhdCBlbmFibGVzIGxhenkgbG9hZGluZyB1c2UgY2FzZXMuXG4gKiBAcGFyYW0gdmFsdWUgcG90ZW50aWFsIHByb3h5IHRvIHJlc29sdmVcbiAqIEBwYXJhbSBhcmcgcmVwcmVzZW50cyB0aGUgYXJndW1lbnQgdGhhdCBzaG91bGQgYmUgcGFzc2VkIHRvIHRoZSByZXNvbHV0aW9uIGZ1bmN0aW9uIChzb3VyY2VGdW5jdGlvbikuXG4gKiBAcmV0dXJucyBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVUYXJnZXQodmFsdWU6IGFueSwgYXJnOiBhbnkpIHtcbiAgICBpZihudXRpbC5pc1Byb3h5KHZhbHVlKSkge1xuICAgICAgICBjb25zdCBvYmplY3QgOiBhbnkgPSB2YWx1ZTtcbiAgICAgICAgaWYob2JqZWN0W2lzRHluYW1pY1Byb3h5XSkge1xuICAgICAgICAgICAgY29uc3QgZm46IE9uZUFyZ0ZuPGFueT4gID0gb2JqZWN0W3NvdXJjZUZ1bmN0aW9uXTtcbiAgICAgICAgICAgIHJldHVybiBmbihhcmcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbn1cblxuIl19