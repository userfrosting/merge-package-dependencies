import test from "ava";
import fs from "fs";
import url from "url";
import path from "path";
import { bower, InvalidBowerPackageException, LogicalException } from "./main.js";

/**
 * @todo Testing console output
 */

const templatesDir = path.join(path.dirname(url.fileURLToPath(import.meta.url)), "../test-resources/bower/");

test("Throw exception when provided with invalid package template", t => {
    const template = JSON.parse(
        fs.readFileSync(path.join(templatesDir, './templates/templateInvalid.json')).toString()
    );
    const packagePaths = [
        path.join(templatesDir, './packages/'),
        path.join(templatesDir, './packages/bower2'),
        path.join(templatesDir, './packages/bower3.json'),
    ];
    t.throws(
        () => bower(template, packagePaths),
        { instanceOf: InvalidBowerPackageException }
    );
});

test("Throw exception when provided with a path to an invalid package", t => {
    const template = JSON.parse(
        fs.readFileSync(path.join(templatesDir, './templates/template.json')).toString()
    );
    const packagePaths = [
        path.join(templatesDir, './packages/'),
        path.join(templatesDir, './packages/bower2'),
        path.join(templatesDir, './packages/bower3.json'),
        path.join(templatesDir, './packages/packageInvalid'),
    ];
    t.throws(
        () => bower(template, packagePaths),
        { instanceOf: InvalidBowerPackageException }
    );
});

test("Return expected data when merging 3 packages", t => {
    const template = JSON.parse(
        fs.readFileSync(path.join(templatesDir, './templates/template.json')).toString()
    );
    const packagePaths = [
        path.join(templatesDir, './packages/'),
        path.join(templatesDir, './packages/bower2'),
        path.join(templatesDir, './packages/bower3.json'),
    ];
    const expected = JSON.parse(
        fs.readFileSync(path.join(templatesDir, "expectedResults/pkg1.json")).toString()
    );
    const actual = bower(template, packagePaths);
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
    const actual = bower(template, packagePaths);
    t.deepEqual(actual, expected);
});

test("Save generated package to specified destination", t => {
    const template = JSON.parse(
        fs.readFileSync(path.join(templatesDir, './templates/template.json')).toString()
    );
    const packagePaths = [
        path.join(templatesDir, './packages/'),
        path.join(templatesDir, './packages/bower2'),
        path.join(templatesDir, './packages/bower3.json'),
    ];
    const expectedReturn = JSON.parse(
        fs.readFileSync(path.join(templatesDir, "expectedResults/pkg1.json")).toString()
    );
    const expectedDest = path.join(templatesDir, "./working/bower.json");
    // compare from file
    const actualReturn = bower(template, packagePaths, path.join(templatesDir, "./working/"));
    t.deepEqual(actualReturn, expectedReturn);
    t.true(fs.existsSync(expectedDest));

    // Cleanup
    fs.unlinkSync(path.join(templatesDir, "./working/bower.json"));
});

/**
 * @todo Conflict across dependencies
 */
test("Throw an exception when dependency conflicts cannot be resolved", t => {
    const template = JSON.parse(
        fs.readFileSync(path.join(templatesDir, './templates/template.json')).toString()
    );
    const packagePaths = [
        path.join(templatesDir, './packages/bower4.json'),
        path.join(templatesDir, './packages/bower6.json'),
    ];
    t.throws(
        () => bower(template, packagePaths),
        { instanceOf: LogicalException }
    );
});

test("Return expected data when dependency conflicts can be resolved", t => {
    const template = JSON.parse(
        fs.readFileSync(path.join(templatesDir, './templates/template.json')).toString()
    );
    const packagePaths = [
        path.join(templatesDir, './packages/bower4.json'),
        path.join(templatesDir, './packages/bower5.json'),
    ];
    const expected = JSON.parse(
        fs.readFileSync(path.join(templatesDir, "expectedResults/pkg3.json")).toString()
    );
    const actual = bower(template, packagePaths);
    t.deepEqual(actual, expected);
});

test("Override when non-semver value is detected for an incoming dependency", t => {
    const template = JSON.parse(
        fs.readFileSync(path.join(templatesDir, './templates/template.json')).toString()
    );
    const packagePaths = [
        path.join(templatesDir, './packages/bower6.json'),
        path.join(templatesDir, './packages/bower7.json'),
    ];
    const expected = JSON.parse(
        fs.readFileSync(path.join(templatesDir, "expectedResults/pkg4.json")).toString()
    );
    const actual = bower(template, packagePaths);
    t.deepEqual(actual, expected);
});
