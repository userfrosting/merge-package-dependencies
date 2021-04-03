import { Constraint } from "./constraint.js";
import { Pin } from "./pin.js";
import { SemverRange } from "./semver-range.js";

export class Between extends SemverRange {

    /**
     * Determine if a value is a valid bounded semver range.
     * @param value Value to check.
     */
    static is(value: string) : boolean {
        // 1.0.0 - 3.0.0
        // 1.x - 2
        // 1.x - 2.x.x
        // Trim
        value = value.trim();
        // Trim internally (collapse white spaces to 1)
        value = value.replace(/\s+/g, " ");
        // Split by spaces
        const parts = value.split(" ");
        // Must be array of 3
        if (parts.length !== 3) {
            return false;
        }
        // Index 1 (of 2) must be '-'
        if (parts[1] !== "-") {
            return false;
        }
        // Indexes 0 and 2 must be a semver constraint or pin
        return (Pin.is(parts[0]) || Constraint.is(parts[0]))
            && (Pin.is(parts[2]) || Constraint.is(parts[2]));
    }
}
