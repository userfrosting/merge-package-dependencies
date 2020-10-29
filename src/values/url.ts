import { Value } from "./value.js";

export class Url extends Value {

    /**
     * Determine if a value is a Git URL.
     * @param value Value to check.
     */
    static is(value: string) : boolean {
        const cleanValue = value.trim();
        return cleanValue.startsWith("http://") || cleanValue.startsWith("https://");
    }
}
