import { SemverRange } from "./semver-range.js";

export class Between extends SemverRange {

    /**
     * Determine if a value is a valid bounded semver range.
     * @param value Value to check.
     */
    static is(value: string) : boolean {
        // 1.0.0 - 3.0.0
    }
}
