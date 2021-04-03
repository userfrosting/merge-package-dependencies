import SemVer from "semver";
import { LogicalAnd } from "./logical-and.js";
import { LogicalOr } from "./logical-or.js";
import { SemverRange } from "./semver-range.js";

export class Constraint extends SemverRange {

    /**
     * Determine if a value is a valid semver constraint (primitive range).
     * @param value Value to check.
     */
    static is(value: string) : boolean {
        // ^1.2 or ~1.2 or 5.x or 1.2
        // Check that value semver range
        if (!SemVer.validRange(value)) {
            return false;
        }
        // Contains no logical-and
        if (LogicalOr.is(value)) {
            return false;
        }
        // Contains no logical-or
        // TODO, this is hard as not all white space is a logical-and
        if (LogicalAnd.is(value)) {
            return false;
        }
        return false;
    }
}
