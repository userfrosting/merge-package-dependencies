import { Tag } from "./tag.js";

export class LatestTag extends Tag {

    /**
     * Determine if a value is a "latest" URL.
     * @param value Value to check.
     */
    static is(value: string) : boolean {
        return value.trim() === "latest";
    }
}
