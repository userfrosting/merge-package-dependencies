import test from "ava";
import { LatestTag } from "./latest-tag.js";

test("Valid git repo references", t => {
    t.is(LatestTag.is("latest"), true);
    t.is(LatestTag.is(" latest "), true);
});

test("Invalid values", t => {
    t.is(LatestTag.is("anything else"), false);
});
