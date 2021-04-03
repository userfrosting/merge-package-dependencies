import test from "ava";
import { Between } from "./between.js";

test("Valid values", t => {
    t.is(Between.is("1.0.0 - 2.0.0"), true);
});

test("Invalid values", t => {
    t.is(Between.is("1"), false);
});
