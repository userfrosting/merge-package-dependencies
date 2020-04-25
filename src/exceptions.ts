// Extends node-exceptions.
import { LogicalException } from "node-exceptions"
export * from "node-exceptions";
export {
    LogicalException,
    InvalidArgumentException,
} from "node-exceptions";

export class InvalidNodePackageException extends LogicalException {};
export class InvalidBowerPackageException extends LogicalException {};
