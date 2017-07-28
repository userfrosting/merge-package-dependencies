"use strict";
let packageMerge = require('../');
let assert = require("assert");
let fs = require("fs");

describe("#npmMerge", function() {

    it('should throw exception when provided with an invalid package template.', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/npm/templates/templateInvalid.json'));
        let packagePaths = [
            './test/resources/npm/packages/',
            './test/resources/npm/packages/package2',
            './test/resources/npm/packages/package3.json'
        ];
        assert.throws(() => { packageMerge.npm(template, packagePaths) }, packageMerge.exceptions.InvalidNpmPackageException);
    });

    it('should throw exception when provided with a path to an invalid package', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/npm/templates/template.json'));
        let packagePaths = [
            './test/resources/npm/packages/',
            './test/resources/npm/packages/package2',
            './test/resources/npm/packages/package3.json',
            './test/resources/npm/packages/packageInvalid'
        ];
        assert.throws(() => { packageMerge.npm(template, packagePaths) }, packageMerge.exceptions.InvalidNpmPackageException);
    });

    it('should return expected data when merging 3 packages', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/npm/templates/template.json'));
        let packagePaths = [
            './test/resources/npm/packages/',
            './test/resources/npm/packages/package2',
            './test/resources/npm/packages/package3.json'
        ];
        let expectedResult = JSON.parse(fs.readFileSync("./test/resources/npm/expectedResults/pkg1.json"));
        let result = packageMerge.npm(template, packagePaths);
        assert.deepEqual(result, expectedResult);
    });

    it('should return expected data when merging 1 package', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/npm/templates/template.json'));
        let packagePaths = [
            './test/resources/npm/packages/'
        ];
        let expectedResult = JSON.parse(fs.readFileSync("./test/resources/npm/expectedResults/pkg2"));
        let result = packageMerge.npm(template, packagePaths);
        assert.deepEqual(result, expectedResult);
    });

    it('should save generated package to specified destination', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/npm/templates/template.json'));
        let packagePaths = [
            './test/resources/npm/packages/',
            './test/resources/npm/packages/package2',
            './test/resources/npm/packages/package3.json'
        ];
        let expectedResult = JSON.parse(fs.readFileSync("./test/resources/npm/expectedResults/pkg1.json"));
        packageMerge.npm(template, packagePaths, "./test/working/npm/");
        let result = JSON.parse(fs.readFileSync("./test/working/npm/package.json"));
        assert.deepEqual(result, expectedResult);

        // Cleaning time!
        fs.unlinkSync("./test/working/npm/package.json");
    });

    /** @todo Conflict in dependencies */
    it('should throw an exception when dependency conflicts cannot be resolved', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/npm/templates/template.json'));
        let packagePaths = [
            './test/resources/npm/packages/package4.json',
            './test/resources/npm/packages/package6.json'
        ];
        assert.throws(() => { packageMerge.npm(template, packagePaths) }, packageMerge.exceptions.LogicalException);
    });

    it('should throw an exception when dependency conflicts occur, even if packages provide resolutions', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/npm/templates/template.json'));
        let packagePaths = [
            './test/resources/npm/packages/package4.json',
            './test/resources/npm/packages/package5.json'
        ];
        assert.throws(() => { packageMerge.npm(template, packagePaths) }, packageMerge.exceptions.LogicalException);
    });

    it('should override when non-semver value is detected for an incoming dependency', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/npm/templates/template.json'));
        let packagePaths = [
            './test/resources/npm/packages/package6.json',
            './test/resources/npm/packages/package7.json'
        ];
        let expectedResult = JSON.parse(fs.readFileSync("./test/resources/npm/expectedResults/pkg3.json"));
        let result = packageMerge.npm(template, packagePaths);

        assert.deepEqual(result, expectedResult);
    });

    /** @todo Somehow figure out a way to test console output */
});

describe("#yarnMerge", function() {

    it('should throw exception when provided with an invalid package template.', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/yarn/templates/templateInvalid.json'));
        let packagePaths = [
            './test/resources/yarn/packages/',
            './test/resources/yarn/packages/package2',
            './test/resources/yarn/packages/package3.json'
        ];
        assert.throws(() => { packageMerge.yarn(template, packagePaths) }, packageMerge.exceptions.InvalidNpmPackageException);
    });

    it('should throw exception when provided with a path to an invalid package', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/yarn/templates/template.json'));
        let packagePaths = [
            './test/resources/yarn/packages/',
            './test/resources/yarn/packages/package2',
            './test/resources/yarn/packages/package3.json',
            './test/resources/yarn/packages/packageInvalid'
        ];
        assert.throws(() => { packageMerge.yarn(template, packagePaths) }, packageMerge.exceptions.InvalidNpmPackageException);
    });

    it('should return expected data when merging 3 packages', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/yarn/templates/template.json'));
        let packagePaths = [
            './test/resources/yarn/packages/',
            './test/resources/yarn/packages/package2',
            './test/resources/yarn/packages/package3.json'
        ];
        let expectedResult = JSON.parse(fs.readFileSync("./test/resources/yarn/expectedResults/pkg1.json"));
        let result = packageMerge.yarn(template, packagePaths);
        assert.deepEqual(result, expectedResult);
    });

    it('should return expected data when merging 1 package', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/yarn/templates/template.json'));
        let packagePaths = [
            './test/resources/yarn/packages/'
        ];
        let expectedResult = JSON.parse(fs.readFileSync("./test/resources/yarn/expectedResults/pkg2"));
        let result = packageMerge.yarn(template, packagePaths);
        assert.deepEqual(result, expectedResult);
    });

    it('should save generated package to specified destination', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/yarn/templates/template.json'));
        let packagePaths = [
            './test/resources/yarn/packages/',
            './test/resources/yarn/packages/package2',
            './test/resources/yarn/packages/package3.json'
        ];
        let expectedResult = JSON.parse(fs.readFileSync("./test/resources/yarn/expectedResults/pkg1.json"));
        packageMerge.yarn(template, packagePaths, "./test/working/yarn/");
        let result = JSON.parse(fs.readFileSync("./test/working/yarn/package.json"));
        assert.deepEqual(result, expectedResult);

        // Cleaning time!
        fs.unlinkSync("./test/working/yarn/package.json");
    });

    it('should throw an exception when dependency conflicts cannot be resolved', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/yarn/templates/template.json'));
        let packagePaths = [
            './test/resources/yarn/packages/package4.json',
            './test/resources/yarn/packages/package6.json'
        ];
        assert.throws(() => { packageMerge.yarn(template, packagePaths) }, packageMerge.exceptions.LogicalException);
    });

    it('should return expected data when dependency conflicts can be resolved', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/yarn/templates/template.json'));
        let packagePaths = [
            './test/resources/yarn/packages/package4.json',
            './test/resources/yarn/packages/package5.json'
        ];
        let expectedResult = JSON.parse(fs.readFileSync("./test/resources/yarn/expectedResults/pkg3.json"));
        let result = packageMerge.yarn(template, packagePaths);
        assert.deepEqual(result, expectedResult);
    });

    it('should override when non-semver value is detected for an incoming dependency', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/yarn/templates/template.json'));
        let packagePaths = [
            './test/resources/yarn/packages/package6.json',
            './test/resources/yarn/packages/package7.json'
        ];
        let expectedResult = JSON.parse(fs.readFileSync("./test/resources/yarn/expectedResults/pkg4.json"));
        let result = packageMerge.yarn(template, packagePaths);

        assert.deepEqual(result, expectedResult);
    });

    /** @todo Somehow figure out a way to test console output */
});

describe("#bowerMerge", function() {

    it('should throw exception when provided with an invalid package template.', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/bower/templates/templateInvalid.json'));
        let packagePaths = [
            './test/resources/bower/packages/',
            './test/resources/bower/packages/bower2',
            './test/resources/bower/packages/bower3.json'
        ];
        assert.throws(() => { packageMerge.bower(template, packagePaths) }, packageMerge.exceptions.InvalidBowerPackageException);
    });

    it('should throw exception when provided with a path to an invalid package', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/bower/templates/template.json'));
        let packagePaths = [
            './test/resources/bower/packages/',
            './test/resources/bower/packages/bower2',
            './test/resources/bower/packages/bower3.json',
            './test/resources/bower/packages/packageInvalid'
        ];
        assert.throws(() => { packageMerge.bower(template, packagePaths) }, packageMerge.exceptions.InvalidBowerPackageException);
    });

    it('should return expected data when merging 3 packages', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/bower/templates/template.json'));
        let packagePaths = [
            './test/resources/bower/packages/',
            './test/resources/bower/packages/bower2',
            './test/resources/bower/packages/bower3.json'
        ];
        let expectedResult = JSON.parse(fs.readFileSync("./test/resources/bower/expectedResults/pkg1.json"));
        let result = packageMerge.bower(template, packagePaths);
        assert.deepEqual(result, expectedResult);
    });

    it('should return expected data when merging 1 package', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/bower/templates/template.json'));
        let packagePaths = [
            './test/resources/bower/packages/'
        ];
        let expectedResult = JSON.parse(fs.readFileSync("./test/resources/bower/expectedResults/pkg2"));
        let result = packageMerge.bower(template, packagePaths);
        assert.deepEqual(result, expectedResult);
    });

    it('should save generated package to specified destination', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/bower/templates/template.json'));
        let packagePaths = [
            './test/resources/bower/packages/',
            './test/resources/bower/packages/bower2',
            './test/resources/bower/packages/bower3.json'
        ];
        let expectedResult = JSON.parse(fs.readFileSync("./test/resources/bower/expectedResults/pkg1.json"));
        packageMerge.bower(template, packagePaths, "./test/working/bower/");
        let result = JSON.parse(fs.readFileSync("./test/working/bower/bower.json"));
        assert.deepEqual(result, expectedResult);

        // Cleaning time!
        fs.unlinkSync("./test/working/bower/bower.json");
    });

    it('should throw an exception when dependency conflicts cannot be resolved', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/bower/templates/template.json'));
        let packagePaths = [
            './test/resources/bower/packages/bower4.json',
            './test/resources/bower/packages/bower6.json'
        ];
        assert.throws(() => { packageMerge.bower(template, packagePaths) }, packageMerge.exceptions.LogicalException);
    });

    it('should return expected data when dependency conflicts can be resolved', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/bower/templates/template.json'));
        let packagePaths = [
            './test/resources/bower/packages/bower4.json',
            './test/resources/bower/packages/bower5.json'
        ];
        let expectedResult = JSON.parse(fs.readFileSync("./test/resources/bower/expectedResults/pkg3.json"));
        let result = packageMerge.bower(template, packagePaths);
        assert.deepEqual(result, expectedResult);
    });

    it('should override when non-semver value is detected for an incoming dependency', function() {
        "use strict";
        let template = JSON.parse(fs.readFileSync('./test/resources/bower/templates/template.json'));
        let packagePaths = [
            './test/resources/bower/packages/bower6.json',
            './test/resources/bower/packages/bower7.json'
        ];
        let expectedResult = JSON.parse(fs.readFileSync("./test/resources/bower/expectedResults/pkg4.json"));
        let result = packageMerge.bower(template, packagePaths);

        assert.deepEqual(result, expectedResult);
    });

    /** @todo Somehow figure out a way to test console output */
});