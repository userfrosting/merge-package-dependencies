import { Value } from "./value.js";

export class GitHub extends Value {

    /**
     * Determine if a value is a GitHub repo identifier.
     * @param value Value to check.
     */
    static is(value: string) : boolean {
        const cleanValue = value.trim();
        return cleanValue.match(/[a-zA-Z\.\-0-9]*\/[a-zA-Z\.\-0-9]*/g)?.[0] === cleanValue;
    }
}
