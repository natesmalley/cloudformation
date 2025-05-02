"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withUsageTracking = withUsageTracking;
/**
 * Adds usage tracking info to the stack props
 * @param usageIdentifier
 * @param stackProps
 * @returns
 */
function withUsageTracking(usageIdentifier, stackProps) {
    var _a;
    const result = stackProps !== null && stackProps !== void 0 ? stackProps : {};
    const trackableDescription = `${(_a = result.description) !== null && _a !== void 0 ? _a : ""} Blueprints tracking (${usageIdentifier})`.trimLeft();
    return { ...stackProps, ...{ description: trackableDescription } };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNhZ2UtdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvdXRpbHMvdXNhZ2UtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQyw4Q0FJQTtBQVZEOzs7OztHQUtHO0FBQ0YsU0FBZ0IsaUJBQWlCLENBQUMsZUFBdUIsRUFBRSxVQUF1Qjs7SUFDL0UsTUFBTSxNQUFNLEdBQUksVUFBVSxhQUFWLFVBQVUsY0FBVixVQUFVLEdBQUksRUFBRSxDQUFDO0lBQ2pDLE1BQU0sb0JBQW9CLEdBQUcsR0FBRyxNQUFBLE1BQU0sQ0FBQyxXQUFXLG1DQUFHLEVBQUUseUJBQXlCLGVBQWUsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzlHLE9BQU8sRUFBRSxHQUFHLFVBQVUsRUFBRSxHQUFHLEVBQUMsV0FBVyxFQUFFLG9CQUFvQixFQUFDLEVBQUMsQ0FBQztBQUNwRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2tQcm9wcyB9IGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuXG4vKipcbiAqIEFkZHMgdXNhZ2UgdHJhY2tpbmcgaW5mbyB0byB0aGUgc3RhY2sgcHJvcHNcbiAqIEBwYXJhbSB1c2FnZUlkZW50aWZpZXIgXG4gKiBAcGFyYW0gc3RhY2tQcm9wcyBcbiAqIEByZXR1cm5zIFxuICovXG4gZXhwb3J0IGZ1bmN0aW9uIHdpdGhVc2FnZVRyYWNraW5nKHVzYWdlSWRlbnRpZmllcjogc3RyaW5nLCBzdGFja1Byb3BzPzogU3RhY2tQcm9wcyk6IFN0YWNrUHJvcHMge1xuICAgIGNvbnN0IHJlc3VsdCA9ICBzdGFja1Byb3BzID8/IHt9O1xuICAgIGNvbnN0IHRyYWNrYWJsZURlc2NyaXB0aW9uID0gYCR7cmVzdWx0LmRlc2NyaXB0aW9uPz8gXCJcIn0gQmx1ZXByaW50cyB0cmFja2luZyAoJHt1c2FnZUlkZW50aWZpZXJ9KWAudHJpbUxlZnQoKTtcbiAgICByZXR1cm4geyAuLi5zdGFja1Byb3BzLCAuLi57ZGVzY3JpcHRpb246IHRyYWNrYWJsZURlc2NyaXB0aW9ufX07XG59Il19