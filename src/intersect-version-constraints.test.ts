import test from "ava";
import { intersectVersionConstraints } from "./intersect-version-constraints.js";

test("Identical versions", t => {
    t.is(
        intersectVersionConstraints("1.0.0", "1.0.0"),
        "1.0.0"
    );

    t.is(
        intersectVersionConstraints("1.0.0 ", "1.0.0"),
        "1.0.0"
    );

    t.is(
        intersectVersionConstraints("v1.0.0", "1.0.0"),
        "1.0.0"
    );

    t.is(
        intersectVersionConstraints("=v1.0.0", "1.0.0"),
        // =v1.0.0 === 1.0.0
        // TODO This should be collapse to a single version, should be 1.0.0
        "=v1.0.0 1.0.0"
    );

    t.is(
        intersectVersionConstraints("=1.0.0", "1.0.0"),
        // =1.0.0 === 1.0.0
        // TODO This should be collapse to a single version, should be 1.0.0
        "=1.0.0 1.0.0"
    );
});

test("Version pin and a range", t => {
    t.is(
        intersectVersionConstraints("1", "1.0.0"),
        // 1 === ^1
        // TODO Cover scenario where a version constraint is a version pin, should be 1.0.0
        "1 1.0.0"
    );
});

test("Identical ranges", t => {
    t.is(
        intersectVersionConstraints("1.0", "1.0"),
        // TODO Prefer a normalized outcome of ^1.0.0
        "1.0"
    );

    t.is(
        intersectVersionConstraints("1", "1"),
        // TODO Prefer a normalized outcome of ^1.0.0
        "1"
    );

    t.is(
        intersectVersionConstraints("2.2", "2.2"),
        // TODO Prefer a normalized outcome of ^2.2.0
        "2.2"
    );

    t.is(
        intersectVersionConstraints("1", "^1"),
        // 1 === ^1
        // These are functionality identical, and should collapse to ^1.0.0
        "1 ^1"
    );

    t.is(
        intersectVersionConstraints("^1", ">=1 <2"),
        // ^1 === >=1 <2
        // TODO These are functionality identical, and should collapse to ^1.0.0
        "^1 >=1 <2"
    );
});

test("Subset ranges", t => {
    t.is(
        intersectVersionConstraints("1", "1.0"),
        // TODO Should collapse to ~1.0.0
        "1 1.0"
    );

    t.is(
        intersectVersionConstraints(">=1", "^1.0.0"),
        // TODO Should collapse to ^1.0.0
        ">=1 ^1.0.0"
    );

    t.is(
        intersectVersionConstraints("^1.0.0 || ^2.0.0", "^1.0.0"),
        // TODO Should collapse to ^1.0.0
        "^1.0.0 ^1.0.0 || ^2.0.0 ^1.0.0"
    );

    t.is(
        intersectVersionConstraints("^1.0.0 || ^2.0.0", "^1.0.0 || ^2.0.0"),
        "^1.0.0 || ^2.0.0"
    );

    t.is(
        intersectVersionConstraints("^1.0.0 || ^2.0.0", "^2.0.0 || ^3.0.0"),
        // TODO Should collapse to ^2.0.0
        "^1.0.0 ^2.0.0 || ^1.0.0 ^3.0.0 || ^2.0.0 ^2.0.0 || ^2.0.0 ^3.0.0"
    );
});

/*
test("Identical versions", t => {
    t.is(
        intersectVersionConstraints("1.0.0", "1.0.0"),
        "1.0.0"
    );
});

test("Identical versions", t => {
    t.is(
        intersectVersionConstraints("1.0.0", "1.0.0"),
        "1.0.0"
    );
});*/
