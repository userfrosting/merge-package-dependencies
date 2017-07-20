let packageMerge = require('../');
let assert = require("assert");
let fs = require("fs");

describe("#npmMerge", function() {

    it('should throw exception when provided with an invalid package template.', function() {
        let template = JSON.parse(fs.readFileSync('./test/resources/npm/templates/templateInvalid.json'));
        let packagePaths = [
            './test/resources/npm/packages/',
            './test/resources/npm/packages/package2',
            './test/resources/npm/packages/package3.json'
        ];
        assert.throws(() => { packageMerge.npm(template, packagePaths) }, packageMerge.exceptions.InvalidNpmPackageException);
    });

    it('should throw exception when provided with a path to an invalid package', function() {
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
        let template = JSON.parse(fs.readFileSync('./test/resources/npm/templates/template.json'));
        let packagePaths = [
            './test/resources/npm/packages/',
            './test/resources/npm/packages/package2',
            './test/resources/npm/packages/package3.json'
        ];
        let expectedResult = require("./resources/npm/expectedResults/pkg1.json");
        let result = packageMerge.npm(template, packagePaths);
        assert.deepEqual(result, expectedResult);
    });

    it('should return expected data when merging 1 package', function() {
        let template = JSON.parse(fs.readFileSync('./test/resources/npm/templates/template.json'));
        let packagePaths = [
            './test/resources/npm/packages/'
        ];
        let expectedResult = JSON.parse(fs.readFileSync("./test/resources/npm/expectedResults/pkg2"));
        let result = packageMerge.npm(template, packagePaths);
        assert.deepEqual(result, expectedResult);
    });

    it('should save generated package to specified destination', function() {
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

    /** @todo Somehow figure out a way to test console output */

    /** @todo Conflict in dependencies */
});

describe("#bowerMerge", function() {

    it('should throw exception when provided with an invalid package template.', function() {
        let template = JSON.parse(fs.readFileSync('./test/resources/bower/templates/templateInvalid.json'));
        let packagePaths = [
            './test/resources/bower/packages/',
            './test/resources/bower/packages/bower2',
            './test/resources/bower/packages/bower3.json'
        ];
        assert.throws(() => { packageMerge.bower(template, packagePaths) }, packageMerge.exceptions.InvalidBowerPackageException);
    });

    it('should throw exception when provided with a path to an invalid package', function() {
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
        let template = JSON.parse(fs.readFileSync('./test/resources/bower/templates/template.json'));
        let packagePaths = [
            './test/resources/bower/packages/',
            './test/resources/bower/packages/bower2',
            './test/resources/bower/packages/bower3.json'
        ];
        let expectedResult = require("./resources/bower/expectedResults/pkg1.json");
        let result = packageMerge.bower(template, packagePaths);
        assert.deepEqual(result, expectedResult);
    });

    it('should return expected data when merging 1 package', function() {
        let template = JSON.parse(fs.readFileSync('./test/resources/bower/templates/template.json'));
        let packagePaths = [
            './test/resources/bower/packages/'
        ];
        let expectedResult = JSON.parse(fs.readFileSync("./test/resources/bower/expectedResults/pkg2"));
        let result = packageMerge.bower(template, packagePaths);
        assert.deepEqual(result, expectedResult);
    });

    it('should save generated package to specified destination', function() {
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

    /** @todo Somehow figure out a way to test console output */

    /** @todo Conflict in dependencies */
});