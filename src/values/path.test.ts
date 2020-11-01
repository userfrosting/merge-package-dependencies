import test from "ava";
import { Path } from "./path.js";

test("Valid git repo references", t => {
    t.is(Path.is("file:./foo/bar"), true);
});

test("Invalid values", t => {
    t.is(Path.is("anything else"), false);
});
