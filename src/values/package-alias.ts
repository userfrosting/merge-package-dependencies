import { Value } from "./value.js";

export class PackageAlias extends Value {

    /**
     * Determine if a value refers to a package alias.
     * @param value Value to check.
     */
    static is(value: string) : boolean {
        return value.trim().startsWith("npm:");
    }
}
