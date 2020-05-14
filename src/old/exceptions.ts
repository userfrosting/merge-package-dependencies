// Extends node-exceptions.
import { LogicalException } from "node-exceptions"
export * from "node-exceptions";
export {
    LogicalException,
    InvalidArgumentException,
} from "node-exceptions";

/**
 * @public
 */
export class InvalidNodePackageException extends LogicalException {};

/**
 * @public
 */
export class InvalidBowerPackageException extends LogicalException {};
