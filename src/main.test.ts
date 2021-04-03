
import {
    InvalidArgumentException,
    InvalidBowerPackageException,
    InvalidNodePackageException,
    LogicalException,
    bower,
    npm,
    yarn,
    yarnIsFlat,
} from "@userfrosting/merge-package-dependencies";
import test from "ava";

test("Validate exports", t => {
    t.assert(InvalidArgumentException.prototype instanceof Error, "InvalidArgumentException named export is wrong type");
    t.assert(InvalidBowerPackageException.prototype instanceof Error, "InvalidBowerPackageException export is wrong type");
    t.assert(InvalidNodePackageException.prototype instanceof Error, "InvalidNodePackageException export is wrong type");
    t.assert(LogicalException.prototype instanceof Error, "LogicalException export is wrong type");
    t.assert(typeof bower === "function", "bower named export is wrong type");
    t.assert(typeof npm === "function", "npm named export is wrong type");
    t.assert(typeof yarn === "function", "yarn named export is wrong type");
    t.assert(typeof yarnIsFlat === "function", "yarnIsFlat named export is wrong type");
});
