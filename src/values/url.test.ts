import test from "ava";
import { Url } from "./url.js";

test("Valid git repo references", t => {
    t.is(Url.is("https://google.com"), true);
    t.is(Url.is("https://djmm.me"), true);
    t.is(Url.is("http://disappointing.com"), true);
});

test("Invalid values", t => {
    t.is(Url.is("anything else"), false);
});
