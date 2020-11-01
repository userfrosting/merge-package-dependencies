import { SemverRange } from "./semver-range.js";

export class Constraint extends SemverRange {

    /**
     * Determine if a value is a valid semver constraint (primitive range).
     * @param value Value to check.
     */
    static is(value: string) : boolean {
        // ^1.2 or ~1.2 or 5.x or 1.2
        return false;
    }
}
