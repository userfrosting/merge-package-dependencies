import { SemverRange } from "./semver-range.js";

export class LogicalOr extends SemverRange {

    /**
     * Determine if a value is a valid semver range whose first conjunction is a logical-or.
     * @param value Value to check.
     */
    static is(value: string) : boolean {
        // 1.2 || 1.3
        return false;
    }
}
