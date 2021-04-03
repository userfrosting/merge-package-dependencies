import * as SemVer from "semver";
import { Value } from "../value.js";

export class SemverRange extends Value {

    /**
     * Determine if a value is a valid semver range or version.
     * @param value Value to check.
     */
    static is(value: string) : boolean {
        // todo Not sure this is correct...
        return SemVer.validRange(value) !== null;
    }

    // todo normalise semver string
    // trim
    // trim internally
    // collapse meaningless white space
}
