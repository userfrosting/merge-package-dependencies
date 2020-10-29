import * as SemVer from "semver";
import { Value } from "../value.js";

export class SemverRange extends Value {

    /**
     * Determine if a value is a valid semver range or version.
     * @param value Value to check.
     */
    static is(value: string) : boolean {
        return SemVer.validRange(value) !== null;
    }
}
