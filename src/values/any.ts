import { Value } from "./value.js";

export class Any extends Value {

    /**
     * Determine if a value is an "any" version matcher.
     * @param value Value to check.
     */
    static is(value: string) : boolean {
        const cleanValue = value.trim();
        return cleanValue === "*" || cleanValue === "";
    }
}
