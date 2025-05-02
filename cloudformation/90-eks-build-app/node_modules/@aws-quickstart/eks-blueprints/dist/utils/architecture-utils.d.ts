export declare enum ArchType {
    ARM = "arm",
    X86 = "x86"
}
export declare const addonArchitectureMap: Map<string, ArchType[]>;
/**
 * Returns true of false depending on if the passed addon is
 * supported by the passed architecture
 * @param addOn, arch
 * @returns boolean
 */
export declare function isSupportedArchitecture(addOnName: string, arch: ArchType): boolean | undefined;
export declare function validateSupportedArchitecture(addOnName: string, arch: ArchType, strictValidation?: boolean): void;
/**
 * Decorator function that adds this metatdata to globalmap.
 * @param arch
 * @returns
 */
export declare function supportsX86(constructor: Function): void;
export declare function supportsARM(constructor: Function): void;
export declare function supportsALL(constructor: Function): void;
