import test from "ava";
import url from "url";
import path from "path";
import { yarnIsFlat } from "./main.js";

/**
 * @todo Testing console output
 */

const templatesDir = path.join(path.dirname(url.fileURLToPath(import.meta.url)), "../test-resources/yarn/");

test("Return true when dependency tree is flat", t => {
    const expected = yarnIsFlat(path.join(templatesDir, "./lockfiles/flat/"));
    t.true(expected);
});

test("Return false when dependency tree is not flat", t => {
    const expected = yarnIsFlat(path.join(templatesDir, "./lockfiles/dups/"));
    t.false(expected);
});
