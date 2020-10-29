import test from "ava";
import { Git } from "./git.js";

test("Valid git repo references", t => {
    t.is(Git.is("git@"), true);
    t.is(Git.is(" git@"), true);
    t.is(Git.is(" git@ "), true);

    t.is(Git.is("git://"), true);
    t.is(Git.is(" git://"), true);
    t.is(Git.is("git:// "), true);
});

test("Invalid values", t => {
    t.is(Git.is("file:./git@"), false);
    t.is(Git.is("file:./git@1.0.2"), false);
    t.is(Git.is(" file:./git@"), false);

    t.is(Git.is("ssh://"), false);
});
