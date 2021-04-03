import test from "ava";
import { Constraint } from "./constraint.js";

test("Valid values", t => {
    t.is(Constraint.is(">=1.2.3"), true);
});

test("Invalid values", t => {
    t.is(Constraint.is("1 - 2"), false);
});
