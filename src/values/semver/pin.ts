import SemVer from "semver";
import { Constraint } from "./constraint.js";

export class Pin extends Constraint {

    /**
     * Determine if a value is a valid pinned semver version.
     * @param value Value to check.
     */
    static is(value: string) : boolean {
        return SemVer.valid(value) !== null;
    }
}
