import test from "ava";
import { Tag } from "./tag.js";

test("Valid git repo references", t => {
    t.is(Tag.is("ALPHA"), true);
    t.is(Tag.is("AlPhA"), true);
    t.is(Tag.is("beta"), true);
    t.is(Tag.is("beta.1"), true);
    t.is(Tag.is("beta-1"), true);
    t.is(Tag.is("beta.1-2"), true);
});

test("Invalid values", t => {
    t.is(Tag.is("thing with spaces"), false);
    t.is(Tag.is("https://imaurl.com"), false);
    t.is(Tag.is("latest"), false);
    t.is(Tag.is("1.2.3"), false);
    t.is(Tag.is("v1.2.3"), false);
    t.is(Tag.is("v1.2.3-rc.0"), false);
    t.is(Tag.is("v1.2.3-rc.A"), false);
    t.is(Tag.is("~~~~~~~"), false);
});
