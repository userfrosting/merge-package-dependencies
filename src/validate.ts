import AJV, { ValidateFunction } from "ajv";
import betterErrors, { IOutputError } from "better-ajv-errors";
import draft04Schema from "./schema-draft-04";

export interface ValidationResult {
    /**
     * Indicates if validated package is valid.
     */
    valid: boolean;

    /**
     * Validation errors.
     */
    error?: {
        /**
         * CLI friendly output.
         */
        cli: string;

        /**
         * API consumable output. Expresses same information as CLI output.
         */
        api: IOutputError[];
    }
}

interface CacheableSchema {
    title: string;
}

// Stores valdiate functions for reuse
const Cache = new Map<string, ValidateFunction>();

/**
 * Returns a validator for the specified schema, caching on its title.
 * @param schema Schema to make validator for.
 * @param schema.title Schema title used for caching.
 */
function getValidator<TSchema extends CacheableSchema>(schema: TSchema) {
    if (Cache.has(schema.title)) {
        // Use cached validator
        return Cache.get(schema.title);
    }
    else {
        // Build validator
        const ajv = new AJV()
            .addMetaSchema(draft04Schema);
        const validator = ajv.compile(schema);

        // Cache
        Cache.set(schema.title, validator);

        // Return
        return validator;
    }
}

/**
 * Validates object against a schema.
 * @param pkg Package to validate.
 * @param schema Schema to validate package with.
 */
export function validate(pkg: unknown, schema: CacheableSchema): ValidationResult {
    const validator = getValidator(schema);
    const valid = validator(pkg);

    if (valid) return { valid: true };

    return {
        valid: false,
        error: {
            get cli() {
                return betterErrors(schema, pkg, validator.errors) as unknown as string || "Unknown error";
            },
            get api() {
                return betterErrors(schema, pkg, validator.errors, { format: "js" }) || [];
            }
        }
    }
}
