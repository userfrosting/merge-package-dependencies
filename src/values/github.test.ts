import test from "ava";
import { GitHub } from "./github.js";

test("Valid git repo references", t => {
    t.is(GitHub.is("userfrosting/UserFrosting"), true);
    t.is(GitHub.is("userfrosting/gulp-uf-bundle-assets"), true);
    t.is(GitHub.is("foo/foo.bar"), true);
    t.is(GitHub.is("userfrosting/UserFrosting-5"), true);
});

test("Invalid values", t => {
    t.is(GitHub.is("file:./foo/bar"), false);
});
