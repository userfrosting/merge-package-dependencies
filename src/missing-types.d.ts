declare module "semver-intersect" {
    export function intersect(...versions: string[]): string;
}

declare module "package-json-validator" {
    export interface INpmValidateResult {
        valid: boolean;
        errors?: string[];
        critical?: string;
        warnings?: string[];
        recommendations?: string[]
    }
    type PackageSpecs = "npm" | "commonjs_1.0" | "commonjs_1.1";
    type PJV = {
        packageFormat: string,
        versionFormat: string,
        urlFormat: string,
        emailFormat: string,
        getSpecMap(specName: PackageSpecs): false | {},
        parse(data: string): string;
        validate(
            data: string,
            specName?: PackageSpecs,
            options?: {}
        ): INpmValidateResult,
        validateType(name: string, field: {}, value: any): string[],
        validateDependencies(name: string, deps: {}): string[],
        isValidVersionRange(v: string): boolean,
        validateUrlOrMailto(name: string, obj: {}): string[],
        validatePeople(name: string, obj: {}): string[],
        validateUrlTypes(name: string, obj: {}): string[],
    }
    export const PJV: PJV;
}
