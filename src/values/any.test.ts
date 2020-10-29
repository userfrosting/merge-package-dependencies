import test from "ava";
import { Any } from "./any.js";

test("Valid 'any' values", t => {
    t.is(Any.is("*"), true);
    t.is(Any.is("* "), true);
    t.is(Any.is(" * "), true);
    t.is(Any.is(" *"), true);

    t.is(Any.is(""), true);
    t.is(Any.is("  "), true);
});

test("Invalid values", t => {
    t.is(Any.is("-"), false);
    t.is(Any.is("1.0.0"), false);
    t.is(Any.is("^1.0.0"), false);
    t.is(Any.is("foo/bar"), false);
    t.is(Any.is("git://"), false);
});
