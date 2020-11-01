import test from "ava";
import { PackageAlias } from "./package-alias.js";

test("Valid git repo references", t => {
    t.is(PackageAlias.is("npm:jquery@latest"), true);
});

test("Invalid values", t => {
    t.is(PackageAlias.is("anything else"), false);
});
