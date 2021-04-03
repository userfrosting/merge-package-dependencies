import { SemverRange } from "./semver-range.js";

export class LogicalAnd extends SemverRange {

    /**
     * Determine if a value is a valid semver range whose first conjunction is a logical-and.
     * @param value Value to check.
     */
    static is(value: string) : boolean {
        // ^1.2 1.3.2
        // trim
        // trim internally
        // split by white space
        // join constraint parts (e.g. >= 1.2.3)
        // determine if first 2 items are constraints or pins
        return false;
    }
}
