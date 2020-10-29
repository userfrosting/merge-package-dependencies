import { SemverRange } from "./semver-range.js";

export class LogicalAnd extends SemverRange {

    /**
     * Determine if a value is a valid semver range whose first conjunction is a logical-and.
     * @param value Value to check.
     */
    static is(value: string) : boolean {
        // ^1.2 1.3.2
    }
}
