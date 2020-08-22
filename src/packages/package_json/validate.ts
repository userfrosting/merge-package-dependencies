import packageSchema from "./schema.js";
import { validate, ValidationResult } from "../../validate.js";

/**
 * Validates a `pacakge.json` file according to schema available at http://json.schemastore.org/package.
 * Does not validate dependency version ranges.
 * @param pkg Package to validate.
 */
export function validPackage(pkg: unknown): ValidationResult {
    return validate(pkg, packageSchema);
}