const semver = require("semver");
const semverIntersect = require("semver-intersect").intersect;
const npmValidate = require("package-json-validator").PJV.validate;
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const exceptions = require("./exceptions.js");

// Known dependency keys
const npmDependencyTypes = [
    "dependencies",
    "devDependencies"
];
const yarnDependencyTypes = [
    "dependencies",
    "devDependencies",
    "resolutions"
];
const bowerDependencyTypes = [
    "dependencies",
    "devDependencies",
    "resolutions"
];


/**
 * Merge specified npm packages together.
 * 
 * @param {object} template Template that packages will be merged into. Is validated with {@link https://www.npmjs.com/package/package-json-validator package-json-validator}.
 * @param {string} template.name Template MUST have a name.
 * @param {string} template.version Template MUST have a version.
 * @param {string[]} paths Paths to package.json files. EG: "path/to/" (package.json is prepended) or "path/to/package.json" or "path/to/different.json".
 * @param {string} [saveTo=null] If string, saves the generated package.json to the specified path. Like 'paths', has 'package.json' prepended if required.
 * @param {boolean} [log=false] If true, progress and errors will be logged. Has no affect on exceptions thrown.
 * 
 * @return {object}
 * 
 * @throws {InvalidArgumentException} if a provided argument cannot be used.
 * @throws {InvalidNpmPackageException} if any package is invalid.
 * @throws {LogicalException} if a inputs provided cannot be logically processed according to defined behaviour.
 */
exports.npm = function(template, paths, saveTo = null, log = false) {
    return packageJsonMerge(template, paths, saveTo, log, "npm");
};

/**
 * Merge specified yarn packages together.
 * 
 * @param {object} template Template that packages will be merged into. Is validated with {@link https://www.npmjs.com/package/package-json-validator package-json-validator}.
 * @param {string} template.name Template MUST have a name.
 * @param {string} template.version Template MUST have a version.
 * @param {string[]} paths Paths to package.json files. EG: "path/to/" (package.json is prepended) or "path/to/package.json" or "path/to/different.json".
 * @param {string} [saveTo=null] If string, saves the generated package.json to the specified path. Like 'paths', has 'package.json' prepended if required.
 * @param {boolean} [log=false] If true, progress and errors will be logged. Has no affect on exceptions thrown.
 * 
 * @return {object}
 * 
 * @throws {InvalidArgumentException} if a provided argument cannot be used.
 * @throws {InvalidNpmPackageException} if any package is invalid.
 * @throws {LogicalException} if a inputs provided cannot be logically processed according to defined behaviour.
 */
exports.yarn = function(template, paths, saveTo = null, log = false) {
    return packageJsonMerge(template, paths, saveTo, log, "yarn");
}

/**
 * Merge specified bower packages together.
 * 
 * @param {object} template Template that packages will be merged into. Is validated with {@link https://www.npmjs.com/package/bower-json bower-json}.
 * @param {string} template.name Template MUST have a name.
 * @param {string[]} paths Paths to bower.json files. EG: "path/to/" (bower.json is prepended) or "path/to/bower.json" or "path/to/different.json".
 * @param {string} [saveTo=null] If string, saves the generated bower.json to the specified path. Like 'paths', has 'bower.json' prepended if required.
 * @param {boolean} [log=false] If true, progress and errors will be logged. Has no affect on exceptions thrown.
 * 
 * @return {object}
 * 
 * @throws {InvalidArgumentException} if a provided argument cannot be used.
 * @throws {InvalidBowerPackageException} if any package is invalid.
 * @throws {LogicalException} if a inputs provided cannot be logically processed according to defined behaviour.
 */
exports.bower = function(template, paths, saveTo = null, log = false) {
    return bowerMerge(template, paths, saveTo, log);
};

/**
 * Exceptions usable within package, exposed for convience during error handling.
 * - LogicalException
 * - DomainException
 * - InvalidArgumentExcepetion
 * - RangeException
 * - RuntimeException
 * - HttpException
 * - InvalidNpmPackageException
 * - InvalidBowerPackageException
 * @namespace
 */
exports.exceptions = exceptions;

/**
 * Merge specified packages together. (supports npm and yarn)
 * 
 * @param {object} template Template that packages will be merged into. Is validated with {@link https://www.npmjs.com/package/package-json-validator package-json-validator}.
 * @param {string} template.name Template MUST have a name.
 * @param {string} template.version Template MUST have a version.
 * @param {string[]} paths Paths to package.json files. EG: "path/to/" (package.json is prepended) or "path/to/package.json" or "path/to/different.json".
 * @param {string|null} saveTo If string, saves the generated package.json to the specified path. Like 'paths', has 'package.json' prepended if required.
 * @param {boolean} log If true, progress and errors will be logged. Has no affect on exceptions thrown.
 * @param {string} packageSpec Used to determine what dependency keys should be merged.
 * 
 * @return {object}
 * 
 * @throws {InvalidArgumentException} if a provided argument cannot be used.
 * @throws {InvalidNpmPackageException} if any package is invalid.
 * @throws {LogicalException} if a inputs provided cannot be logically processed according to defined behaviour.
 * 
 * @private
 */
function packageJsonMerge(template, paths, saveTo, log, packageSpec) {
    // Inspect input.
    // template (and log)
    if (log) {
        log = console.log;
        log("Inspecting template package...")
    }
    npmErrors(npmValidate(JSON.stringify(template)), log);
    // paths
    if (!_.isArray(paths)) {
        throw new exceptions.InvalidArgumentException("'paths' must be an array.");
    }
    paths.forEach(function(p, index, array) {// Resolve to complete path now.
        if (p.match(/\\$|\/$/)) {
            p += "package.json";
            array[index] = p;
        }
    });
    //saveTo
    if (_.isString(saveTo)) {// Resolve to complete path now.
        saveTo = path.normalize(saveTo);
        if (saveTo.match(/\\$|\/$/)) {
            saveTo += "package.json";
        }
    }

    // Load and validate packages.
    let packages = [];
    for (let filePath of paths) {
        if (log) {
            log("Inspecting package at " + filePath);
        }
        let pkg = JSON.parse(fs.readFileSync(filePath));// We don't use require, as the extension could be different. Plus require aggressive caches.
        npmErrors(npmValidate(JSON.stringify(pkg)), log);
        packages.push(pkg);
    }

    // Grab required dependency types, and add if not yet existing on the template.
    let dependencyTypes = [];
    if (packageSpec == "npm") {
        depTypes = _.cloneDeep(npmDependencyTypes);
    }
    else if (packageSpec == "yarn") {
        depTypes = _.cloneDeep(yarnDependencyTypes);
    }
    for (let depType of depTypes) {
        if (_.isUndefined(template[depType])) {
            template[depType] = {};
        }
    }

    // Perform merge.
    template = mergePackageDependencies(template, packages, depTypes, log);

    // Save if requested.
    if (saveTo) {
        if (log) {
            log(`Saving generated package to '${saveTo}'`);
        }
        // Make directories if needed.
        if (fs.exists(path.dirname(saveTo))) {
            fs.mkdirSync(path.dirname(saveTo));
        }
        console.log(saveTo);//tmp
        fs.writeFileSync(saveTo, JSON.stringify(template, null, '    '));
    }

    if (log) {
        log("All done!");
    }

    // Return package.
    return template;
}

/**
 * Handles errors from npm package validation. When log = true, logs critical errors, errors, warnings, and recommendations from npm package validation to the console.
 * 
 * @param {object} results 
 * @param {console.log|boolean} [log=false]
 * 
 * @throws {InvalidArgumentException} if a provided argument cannot be used.
 * @throws {InvalidNpmPackageException} if results indicate package is invalid.
 * 
 * @private
 */
function npmErrors(results, log) {
    // Inspect input.
    if (typeof results !== "object") {
        throw new exceptions.InvalidArgumentException("'results' must be of type 'object'.");
    }

    // Log if requested.
    if (log) {
        // Grab some chalk!
        let chalk = require("chalk");

        // Announce critical errors.
        if (results.critical) {
            log(chalk.bgRed("Critical Error: ") + chalk.red(results.critical));
        }

        // Announce errors.
        if (results.errors) {
            log(chalk.underline.red("Errors:"));
            for (let error of results.errors) {
                log("  " + chalk.red(error));
            }
        }

        // Announce warnings.
        if (results.warnings) {
            log(chalk.underline.yellow("Warnings:"));
            for (let warning of results.warnings) {
                log("  " + chalk.yellow(warning));
            }
        }

        // Announnce recommendations.
        if (results.recommendations) {
            log(chalk.underline("Recommandations:"));
            for (let recommendation of results.recommendations) {
                log("  " + recommendation);
            }
        }

        // Announce validity.
        if (results.valid) {
            log(chalk.green("Package is VALID."));
        }
        else {
            log(chalk.red("Package is INVALID."));
        }
    }

    if (!results.valid) {
        throw new exceptions.InvalidNpmPackageException("Package is invalid. Inspection results:\n" + JSON.stringify(results, null, '    '));
    }
}

/**
 * Merge specified bower packages together.
 * 
 * @param {object} template Template that packages will be merged into. Is validated with {@link https://www.npmjs.com/package/bower-json bower-json}.
 * @param {string} template.name Template MUST have a name.
 * @param {string[]} paths Paths to bower.json files. EG: "path/to/" (bower.json is prepended) or "path/to/bower.json" or "path/to/different.json".
 * @param {string} [saveTo=null] If string, saves the generated bower.json to the specified path. Like 'paths', has 'bower.json' prepended if required.
 * @param {boolean} [log=false] If true, progress and errors will be logged. Has no affect on exceptions thrown.
 * 
 * @return {object}
 * 
 * @throws {InvalidArgumentException} if a provided argument cannot be used.
 * @throws {InvalidBowerPackageException} if any package is invalid.
 * @throws {LogicalException} if a inputs provided cannot be logically processed according to defined behaviour.
 * 
 * @private
 */
function bowerMerge(template, paths, saveTo = null, log = false) {
    // Inspect input.
    // template (and log)
    if (log) {
        log = console.log;
        log("Inspecting template package...")
    }
    bowerValidate(JSON.stringify(template));// Throws an exception on failure, so no need for error reporting.
    // paths
    if (!_.isArray(paths)) {
        throw new exceptions.InvalidArgumentException("'paths' must be an array.");
    }
    paths.forEach(function(p, index, array) {// Resolve to complete path now.
        if (p.match(/\\$|\/$/)) {
            p += "bower.json";
            array[index] = p;
        }
    });
    //saveTo
    if (_.isString(saveTo)) {// Resolve to complete path now.
        saveTo = path.normalize(saveTo);
        if (saveTo.match(/\\$|\/$/)) {
            saveTo += "bower.json";
        }
    }

    // Load and validate packages.
    let packages = [];
    for (let filePath of paths) {
        if (log) {
            log("Inspecting package at " + filePath);
        }
        let pkg = JSON.parse(fs.readFileSync(filePath));// We don't use require, as the extension could be different.
        bowerValidate(JSON.stringify(pkg));// As before, no need to log.
        packages.push(pkg);
    }

    // Add dependency keys if not yet existing.
    let depTypes = _.cloneDeep(bowerDependencyTypes);
    for (let dependencyType of depTypes) {
        if (_.isUndefined(template[dependencyType])) {
            template[dependencyType] = {};
        }
    }

    // Perform merge.
    template = mergePackageDependencies(template, packages, depTypes, log);

    // Save if requested.
    if (saveTo) {
        if (log) {
            log(`Saving generated package to '${saveTo}'`);
        }
        if (fs.exists(path.dirname(saveTo))) {
            fs.mkdirSync(path.dirname(saveTo));
        }
        console.log(saveTo);//tmp
        fs.writeFileSync(saveTo, JSON.stringify(template, null, '    '));
    }

    if (log) {
        log("All done!");
    }

    // Return package.
    return template;
}

/**
 * Performs very basic bower.json spec validation.
 * 
 * @param {string} pkgJson JSON representation of a bower.json package.
 * 
 * @throws {InvalidBowerPackageException} if provided package is invalid.
 * 
 * @private
 */
function bowerValidate(pkgJson) {
    pkg = JSON.parse(pkgJson);
    if (!_.isObject(pkg)) {
        throw new exceptions.InvalidBowerPackageException("Root of package MUST be an object.");
    }
    if (!_.isString(pkg.name)) {
        throw new exceptions.InvalidBowerPackageException("Package name MUST be a string.");
    }
    // Now we'll give the used dependency properties a check.
    for (let dependencyType of bowerDependencyTypes) {
        if (pkg.hasOwnProperty(dependencyType)) {
            if (!_.isObject(pkg[dependencyType])) {
                throw new exceptions.InvalidBowerPackageException(`Package's '${dependencyType}' property MUST be an object.`)
            }
            else {
                for (let pkgDep in pkg[dependencyType]) {
                    if (!_.isString(pkg[dependencyType][pkgDep])) {
                        throw new exceptions.InvalidBowerPackageException(`Invalid value for ${dependencyType}->${pkgDep} in package.`);
                    }
                }
            }
        }
    }
    // And make sure resolutions match the expected form.
    if (pkg.hasOwnProperty('reolutions')) {
        if (!_.isObject(pkg.resolutions)) {
            throw new exceptions.InvalidBowerPackageException(`Package's 'resolutions' property MUST be an object.`)
        }
        else {
            for (let pkgRes in pkg.resolutions) {
                if (!_.isString(pkg.resolutions[pkgRes])) {
                    throw new exceptions.InvalidBowerPackageException(`Invalid value for resolutions->${pkgDep} in package.`);
                }
            }
        }
    }
}

/**
 * Merges typical dependency pacakges (npm, bower, yarn) into a provided template.
 * 
 * @param {object} tml Template to merge packages into.
 * @param {object[]} pkgs Parsed dependency packages to merge.
 * @param {string[]} depTypes Dependency types to merge.
 * @param {console.log|boolean} log 
 * 
 * @throws {LogicalException} if a inputs provided cannot be logically processed according to defined behaviour.
 * 
 * @private
 */
function mergePackageDependencies(tml, pkgs, depTypes, log) {
    let chalk = require("chalk");

    // Add resolutions first in case they resolve a dependency collision that cannot be merged.
    if (_.indexOf(depTypes, 'resolutions') !== -1) {
        if (log) {
            log("Starting dependency resolution merge.");
        }
        // Merge resolutions for each package.
        for (let pkg of pkgs) {
            if (!_.isUndefined(pkg.resolutions)) {
                if (log) {
                    log(`Starting merge of dependency resolutions from package '${pkg.name}'`);
                }
                for (let dependency in pkg.resolutions) {
                     // Handle dependency resolution
                    if (tml.resolutions.hasOwnProperty(dependency)) {
                        if (log) {
                            log(`Merging dependency resolution '${chalk.cyan(dependency)}' with '${chalk.magenta(tml.resolutions[dependency])}' and '${chalk.magenta(pkg.resolutions[dependency])}'.`);
                        }
                        tml.resolutions[dependency] = handleDependencyCollision(tml.resolutions[dependency], pkg.resolutions[dependency]);
                    }
                    else {
                        if (log) {
                            log(`Adding dependency resolution '${chalk.cyan(dependency)}' with '${chalk.magenta(pkg.resolutions[dependency])}'.`);
                        }
                        tml.resolutions[dependency] = pkg.resolutions[dependency];
                    }
                }
                if (log) {
                    log(`Finished merge of dependency resolutions from package '${pkg.name}'`);
                }
            }
        }

        // Remove 'resolutions' from depTypes.
        _.pull(depTypes, 'resolutions');

        if (log) {
            log("Finished dependency resolution merge.");
        }
    }

    if (log) {
        log("Starting dependency merge.");
    }
    // Iterate over pkgs
    for (let pkg of pkgs) {
        if (log) {
            log(`Starting merge of dependencies from package '${pkg.name}'`);
        }
        // And dependency types...
        for (let dependencyType of depTypes) {
            if (dependencyType in pkg) {
                if (log) {
                    log(`Merging dependency type '${dependencyType}'`);
                }
                // ...for each package
                for (let dependency in pkg[dependencyType]) {
                    // Handle dependency
                    if (tml[dependencyType].hasOwnProperty(dependency)) {
                        if (log) {
                            log(`Merging dependency '${chalk.cyan(dependency)}' with '${chalk.magenta(tml[dependencyType][dependency])}' and '${chalk.magenta(pkg[dependencyType][dependency])}'.`);
                        }
                        try {
                            // Try to resolve dependency collision.
                            tml[dependencyType][dependency] = handleDependencyCollision(tml[dependencyType][dependency], pkg[dependencyType][dependency]);
                        }
                        catch (e) {
                            // Dependency collision failed, do we have resolutions and if so, is this collision resolved by it?
                            if (!_.isUndefined(tml.resolutions) && !_.isUndefined(tml.resolutions[dependency])) {
                                // It is!
                                if (log) {
                                    log(chalk.bgGreen("Dependency conflict detected, resolved by resolution."));
                                }
                                tml[dependencyType][dependency] = tml.resolutions[dependency];
                            }
                            else {
                                // Nope!
                                if (log) {
                                    log(chalk.bgRed("Dependency conflict detected!"));
                                }
                                throw e;
                            }
                        }
                    }
                    else {
                        if (log) {
                            log(`Adding dependency '${chalk.cyan(dependency)}' with '${chalk.magenta(pkg[dependencyType][dependency])}'.`);
                        }
                        tml[dependencyType][dependency] = pkg[dependencyType][dependency];
                    }
                }
            }
        }
        if (log) {
            log(`Finished merge of dependencies from package '${pkg.name}'`);
        }
    }
    if (log) {
        log("Finished dependency merge.");
    }

    return tml;
}

/**
 * Returns the intersection of both semver ranges if both valid semver ranges. If incoming version isn't a valid semver range, it acts as a override and is returned instead.
 * 
 * @param {string} currentVersion The existing package version value.
 * @param {string} incomingVersion The incoming package version value to handle.
 * 
 * @return {string}
 * 
 * @throws {LogicalException} if a inputs provided cannot be logically processed according to defined behaviour.
 * 
 * @private
 */
function handleDependencyCollision(currentVersion, incomingVersion) {
    // If packageVersion is a valid semver range, currentVersion must also be valid.
    if (semver.valid(incomingVersion) || semver.validRange(incomingVersion)) {
        if (!semver.valid(currentVersion) && !semver.validRange(currentVersion)) {
            throw new exceptions.LogicalException("An incoming package semver version range requires the current version to also be valid semver range.\nIncoming: " + incomingVersion + "\nCurrent: " + currentVersion);
        }
        else {
            // Intersect semver ranges. 
            try {
                if (currentVersion == incomingVersion) {
                    return currentVersion;
                }
                else {
                    // First try to make a clean merge with semverIntersect.
                    try {
                        return semverIntersect(currentVersion, incomingVersion);
                    }
                    catch (e) {
                        // If that fails, look for logical-or. If found, perform elaborate merge.
                        try {
                            let elaborateMerge = (semverRangeWithOr, semverRange) => {
                                let ranges = _.split(semverRangeWithOr, "||");
                                let output = "";
                                for (let i = 0; i < ranges.length; i++) {
                                    // Create new range (hopefully with semverIntersect)
                                    let compoundRange;
                                    try {
                                        compoundRange = semverIntersect(ranges[i], semverRange);
                                    }
                                    catch (e) {
                                        compoundRange = `${ranges[i]} ${semverRange}`;
                                    }
                                    // Middle and beginning.
                                    if (i - 1 != ranges.length) {
                                        output += `${compoundRange} || `
                                    }
                                    // End
                                    else {
                                        output += compoundRange;
                                    }
                                }
                                // Make sure generated output is a valid semver range.
                                if (!semver.validRange(output)) throw new exceptions.LogicalException("Cannot produced valid semver range. Range generated: " + output);
                                return output;
                            };
                            if (currentVersion.includes("||")) {
                                // Just in case both have a logical-or. (but who would be THAT cruel to a package manager)
                                if (incomingVersion.includes("||")) {
                                    let ranges = _.split(currentVersion, "||");
                                    let result = "";
                                    for (let range of ranges) {
                                        result += elaborateMerge(incomingVersion, range);
                                    }
                                    return result;
                                }
                                else {
                                    return elaborateMerge(currentVersion, incomingVersion);
                                }
                            }
                            else if (incomingVersion.includes("||")) {
                                return elaborateMerge(incomingVersion, currentVersion);
                            } else {
                                // If we get here, there looks to be a semver range contradiction.
                                throw new exceptions.LogicalException('Semver ranges could not be intersected. Ranges may contradict each other.')
                            }
                        }
                        catch (e) {
                            throw new exceptions.LogicalException(`Cannot merge semver ranges "${currentVersion}" and "${incomingVersion}".`)
                        }
                        // Otherwise just join, and inspect.
                        let intersection = currentVersion + " " + incomingVersion;
                        if (!semver.validRange(intersection)) {
                            throw new exceptions.LogicalException(`'${currentVersion}' and '${incomingVersion}' cannot be combined to make a valid semver range.`);
                        }
                        return intersection;
                    }
                }
            }
            catch (e) {// We wrap the thrown exception in a LogicalException, so that its easier to handle.
                throw new exceptions.LogicalException(e);
            }
        }
    } else {
        let chalk = require("chalk");
        console.log(chalk.bgRed("Non-semver dependency version value detected. Override triggered. Value: ") + chalk.bgMagenta(incomingVersion));
        return incomingVersion;
    }
}