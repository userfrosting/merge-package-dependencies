import { Value } from "./value.js";

export class Tag extends Value {

    /**
     * Determine if a value is a tag.
     * @param value Value to check.
     */
    static is(value: string) : boolean {
        const cleanValue = value.trim();
        if (cleanValue.match(/^\d/) !== null) {
            return false;
        }
        if (cleanValue.startsWith("v")) {
            return false
        }

        // Ensure valid characters
        return cleanValue.match(/[a-zA-Z][a-zA-Z\.\-0-1]*/g)?.[0] === cleanValue;
    }
}
