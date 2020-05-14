import test from "ava";
import fs from "fs";
import url from "url";
import path from "path";
import { npm, LogicalException, InvalidNodePackageException } from "./main.js";

/**
 * @todo Testing console output
 */

const templatesDir = path.join(path.dirname(url.fileURLToPath(import.meta.url)), "../test-resources/npm/");

test("Throw exception when provided with invalid package template", t => {
    const template = JSON.parse(
        fs.readFileSync(path.join(templatesDir, './templates/templateInvalid.json')).toString()
    );
    const packagePaths = [
        path.join(templatesDir, './packages/'),
        path.join(templatesDir, './packages/package2'),
        path.join(templatesDir, './packages/package3.json'),
    ];
    t.throws(
        () => npm(template, packagePaths),
        { instanceOf: InvalidNodePackageException }
    );
});

test("Throw exception when provided with a path to an invalid package", t => {
    const template = JSON.parse(
        fs.readFileSync(path.join(templatesDir, './templates/template.json')).toString()
    );
    const packagePaths = [
        path.join(templatesDir, './packages/'),
        path.join(templatesDir, './packages/package2'),
        path.join(templatesDir, './packages/package3.json'),
        path.join(templatesDir, './packages/packageInvalid'),
    ];
    t.throws(
        () => npm(template, packagePaths),
        { instanceOf: InvalidNodePackageException }
    );
});

test("Return expected data when merging 3 packages", t => {
    const template = JSON.parse(
        fs.readFileSync(path.join(templatesDir, './templates/template.json')).toString()
    );
    const packagePaths = [
        path.join(templatesDir, './packages/'),
        path.join(templatesDir, './packages/package2'),
        path.join(templatesDir, './packages/package3.json'),
    ];
    const expected = JSON.parse(
        fs.readFileSync(path.join(templatesDir, "expectedResults/pkg1.json")).toString()
    );
    const actual = npm(template, packagePaths);
    t.deepEqual(actual, expected);
});

test("Return expected data when merging 1 package", t => {
    const template = JSON.parse(
        fs.readFileSync(path.join(templatesDir, './templates/template.json')).toString()
    );
    const packagePaths = [
        path.join(templatesDir, './packages/'),
    ];
    const expected = JSON.parse(
        fs.readFileSync(path.join(templatesDir, "expectedResults/pkg2")).toString()
    );
    const actual = npm(template, packagePaths);
    t.deepEqual(actual, expected);
});

test("Save generated package to specified destination", t => {
    const template = JSON.parse(
        fs.readFileSync(path.join(templatesDir, './templates/template.json')).toString()
    );
    const packagePaths = [
        path.join(templatesDir, './packages/'),
        path.join(templatesDir, './packages/package2'),
        path.join(templatesDir, './packages/package3.json'),
    ];
    const expectedReturn = JSON.parse(
        fs.readFileSync(path.join(templatesDir, "expectedResults/pkg1.json")).toString()
    );
    const expectedDest = path.join(templatesDir, "./working/package.json");
    const actualReturn = npm(template, packagePaths, path.join(templatesDir, "./working/"));
    t.deepEqual(actualReturn, expectedReturn);
    t.true(fs.existsSync(expectedDest));

    // Cleanup
    fs.unlinkSync(path.join(templatesDir, "./working/package.json"));
});

/**
 * @todo Conflict across dependencies
 */
test("Throw an exception when dependency conflicts cannot be resolved", t => {
    const template = JSON.parse(
        fs.readFileSync(path.join(templatesDir, './templates/template.json')).toString()
    );
    const packagePaths = [
        path.join(templatesDir, './packages/package4.json'),
        path.join(templatesDir, './packages/package6.json'),
    ];
    t.throws(
        () => npm(template, packagePaths),
        { instanceOf: LogicalException }
    );
});

test("Throw an exception when dependency conflicts occur, even if packages provide resolutions", t => {
    const template = JSON.parse(
        fs.readFileSync(path.join(templatesDir, './templates/template.json')).toString()
    );
    const packagePaths = [
        path.join(templatesDir, './packages/package4.json'),
        path.join(templatesDir, './packages/package5.json'),
    ];
    t.throws(
        () => npm(template, packagePaths),
        { instanceOf: LogicalException }
    );
});

test("Override when non-semver value is detected for an incoming dependency", t => {
    const template = JSON.parse(
        fs.readFileSync(path.join(templatesDir, './templates/template.json')).toString()
    );
    const packagePaths = [
        path.join(templatesDir, './packages/package6.json'),
        path.join(templatesDir, './packages/package7.json'),
    ];
    const expected = JSON.parse(
        fs.readFileSync(path.join(templatesDir, "expectedResults/pkg3.json")).toString()
    );
    const actual = npm(template, packagePaths);
    t.deepEqual(actual, expected);
});

test("Accept missing recommended fields when package is private", t => {
    const template = JSON.parse(
        fs.readFileSync(path.join(templatesDir, './templates/templatePrivate.json')).toString()
    );
    const packagePaths = [
        path.join(templatesDir, './packages/package7.json'),
    ];
    const expected = JSON.parse(
        fs.readFileSync(path.join(templatesDir, "expectedResults/pkg4.json")).toString()
    );
    const actual = npm(template, packagePaths);
    t.deepEqual(actual, expected);
});
