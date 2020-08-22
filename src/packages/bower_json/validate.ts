import bowerSchema from "./schema.js";
import { validate, ValidationResult } from "../../validate.js";

/**
 * Validates a `bower.json` file according to schema available at http://json.schemastore.org/bower.
 * Does not validate dependency version ranges.
 * @param pkg Package to validate.
 */
export default function validateBower(pkg: unknown): ValidationResult {
    return validate(pkg, bowerSchema);
}