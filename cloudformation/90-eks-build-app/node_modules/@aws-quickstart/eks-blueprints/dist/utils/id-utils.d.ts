/**
 * Generates a globally unique identifier.
 * @returns string representation of a GUID
 */
export declare function uniqueId(): string;
/**
 * Tests the input to see if it is a token (unresolved token representation of a reference in CDK, e.g. ${TOKEN[Bucket.Name.1234]})
 * @param input string containing the string identifier
 * @returns true if the passed input is a token
 */
export declare function isToken(input: string): boolean;
