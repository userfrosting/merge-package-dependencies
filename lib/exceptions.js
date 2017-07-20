// Extends node-exceptions.
let exceptions = require("node-exceptions");

exceptions.InvalidNpmPackageException = class InvalidNpmPackageException extends exceptions.LogicalException {};
exceptions.InvalidBowerPackageException = class InvalidBowerPackageException extends exceptions.LogicalException {};

module.exports = exceptions;