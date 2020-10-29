import { Value } from "./value.js";

export class Path extends Value {

    /**
     * Determine if a value refers to a file path.
     * @param value Value to check.
     */
    static is(value: string) : boolean {
        return value.trim().startsWith("file:");
    }
}
