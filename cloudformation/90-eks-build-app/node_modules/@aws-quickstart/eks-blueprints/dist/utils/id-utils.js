"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueId = uniqueId;
exports.isToken = isToken;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const uuid_1 = require("uuid");
/**
 * Generates a globally unique identifier.
 * @returns string representation of a GUID
 */
function uniqueId() {
    return (0, uuid_1.v4)();
}
/**
 * Tests the input to see if it is a token (unresolved token representation of a reference in CDK, e.g. ${TOKEN[Bucket.Name.1234]})
 * @param input string containing the string identifier
 * @returns true if the passed input is a token
 */
function isToken(input) {
    return aws_cdk_lib_1.Token.isUnresolved(input);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWQtdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvdXRpbHMvaWQtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFPQSw0QkFFQztBQU9ELDBCQUVDO0FBbEJELDZDQUFvQztBQUNwQywrQkFBa0M7QUFFbEM7OztHQUdHO0FBQ0gsU0FBZ0IsUUFBUTtJQUNwQixPQUFPLElBQUEsU0FBSSxHQUFFLENBQUM7QUFDbEIsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixPQUFPLENBQUMsS0FBYTtJQUNqQyxPQUFPLG1CQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUb2tlbiB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBnbG9iYWxseSB1bmlxdWUgaWRlbnRpZmllci5cbiAqIEByZXR1cm5zIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIEdVSURcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuaXF1ZUlkKCkgOiBzdHJpbmcge1xuICAgIHJldHVybiB1dWlkKCk7XG59XG5cbi8qKlxuICogVGVzdHMgdGhlIGlucHV0IHRvIHNlZSBpZiBpdCBpcyBhIHRva2VuICh1bnJlc29sdmVkIHRva2VuIHJlcHJlc2VudGF0aW9uIG9mIGEgcmVmZXJlbmNlIGluIENESywgZS5nLiAke1RPS0VOW0J1Y2tldC5OYW1lLjEyMzRdfSlcbiAqIEBwYXJhbSBpbnB1dCBzdHJpbmcgY29udGFpbmluZyB0aGUgc3RyaW5nIGlkZW50aWZpZXJcbiAqIEByZXR1cm5zIHRydWUgaWYgdGhlIHBhc3NlZCBpbnB1dCBpcyBhIHRva2VuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1Rva2VuKGlucHV0OiBzdHJpbmcpIDogYm9vbGVhbiB7XG4gICAgcmV0dXJuIFRva2VuLmlzVW5yZXNvbHZlZChpbnB1dCk7XG59ICJdfQ==