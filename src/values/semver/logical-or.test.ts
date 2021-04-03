import test from "ava";
import { LogicalOr } from "./logical-or.js";

test("Valid values", t => {
    t.is(LogicalOr.is("1 || 2"), true);
});

test("Invalid values", t => {
    t.is(LogicalOr.is("1"), false);
});
