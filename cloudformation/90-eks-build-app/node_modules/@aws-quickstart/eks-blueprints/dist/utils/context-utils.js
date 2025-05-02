"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valueFromContext = valueFromContext;
/**
 * Looks up default value from context (cdk.json, cdk.context.json and ~/.cdk.json)
 * @param construct
 * @param key
 * @param defaultValue
 * @returns
 */
function valueFromContext(construct, key, defaultValue) {
    var _a;
    return (_a = construct.node.tryGetContext(key)) !== null && _a !== void 0 ? _a : defaultValue;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi91dGlscy9jb250ZXh0LXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBU0EsNENBRUM7QUFURDs7Ozs7O0dBTUc7QUFDSCxTQUFnQixnQkFBZ0IsQ0FBQyxTQUFvQixFQUFFLEdBQVcsRUFBRSxZQUFpQjs7SUFDakYsT0FBTyxNQUFBLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxtQ0FBSSxZQUFZLENBQUM7QUFDN0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5cbi8qKlxuICogTG9va3MgdXAgZGVmYXVsdCB2YWx1ZSBmcm9tIGNvbnRleHQgKGNkay5qc29uLCBjZGsuY29udGV4dC5qc29uIGFuZCB+Ly5jZGsuanNvbilcbiAqIEBwYXJhbSBjb25zdHJ1Y3QgXG4gKiBAcGFyYW0ga2V5IFxuICogQHBhcmFtIGRlZmF1bHRWYWx1ZSBcbiAqIEByZXR1cm5zIFxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVGcm9tQ29udGV4dChjb25zdHJ1Y3Q6IENvbnN0cnVjdCwga2V5OiBzdHJpbmcsIGRlZmF1bHRWYWx1ZTogYW55KSB7XG4gICAgcmV0dXJuIGNvbnN0cnVjdC5ub2RlLnRyeUdldENvbnRleHQoa2V5KSA/PyBkZWZhdWx0VmFsdWU7XG59Il19