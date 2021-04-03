import test from "ava";
import { Pin } from "./pin.js";

test("Valid values", t => {
    t.is(Pin.is("1.0.0"), true);
    t.is(Pin.is("1.2.3-alpha.0"), true);
});

test("Invalid values", t => {
    t.is(Pin.is("1"), false);
    t.is(Pin.is("1.x"), false);
});
