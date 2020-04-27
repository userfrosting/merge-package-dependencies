import semver from "semver";
import { intersect as semverIntersect } from "semver-intersect";
import { PJV, INpmValidateResult } from "package-json-validator";
import fs from "fs-extra";
import path from "path";
import _ from "lodash";
import chalk from "chalk";
import * as yarnLockParser from "@yarnpkg/lockfile";
import * as Exceptions from "./exceptions.js";

export {
    LogicalException,
    InvalidArgumentException,
    InvalidNodePackageException,
    InvalidBowerPackageException,
} from "./exceptions.js";

const packageJsonValidator = PJV.validate;

// Known dependency keys
const npmDependencyTypes = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
];
const yarnDependencyTypes = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "resolutions"
];
const bowerDependencyTypes = [
    "dependencies",
    "devDependencies",
    "resolutions"
];

/**
 * @public
 */
export interface INodeTemplate {
    name?: string;
    private?: boolean;
    version?: string;
    dependencies?: { [x: string]: string };
    devDependencies?: { [x: string]: string };
    peerDependencies?: { [x: string]: string };
    resolutions?: { [x: string]: string };
}

/**
 * @public
 */
export interface IBowerTemplate {
    name: string;
    dependencies?: { [x: string]: string };
    devDependencies?: { [x: string]: string };
    resolutions?: { [x: string]: string };
}

interface ITemplatePath {
    path: string;
}

/**
 * @public
 */
export type LogOption = boolean | ((message?: any, ...optionalParams: any[]) => void);


/**
 * Merge specified npm packages together.
 *
 * @param template - Template that packages will be merged into. Is validated with [package-json-validator](https://www.npmjs.com/package/package-json-validator) with template.private == true overriding this.
 * @param paths - Paths to package.json files. EG: "path/to/" (package.json is prepended) or "path/to/package.json" or "path/to/different.json".
 * @param saveTo - If string, saves the generated package.json to the specified path. Like 'paths', has 'package.json' prepended if required.
 * @param log - If true, progress and errors will be logged. Has no affect on exceptions thrown.
 *
 * @public
 */
export function npm(template: INodeTemplate, paths: string[], saveTo: string|null = null, log: LogOption = false): {} {
    return packageJsonMerge(template, paths, saveTo, log, "npm");
};

/**
 * Merge specified yarn packages together.
 *
 * @param template - Template that packages will be merged into. Is validated with [package-json-validator](https://www.npmjs.com/package/package-json-validator) with template.private == true overriding this.
 * @param paths - Paths to package.json files. EG: "path/to/" (package.json is prepended) or "path/to/package.json" or "path/to/different.json".
 * @param saveTo - If string, saves the generated package.json to the specified path. Like 'paths', has 'package.json' prepended if required.
 * @param log - If true, progress and errors will be logged. Has no affect on exceptions thrown.
 *
 * @public
 */
export function yarn(template: INodeTemplate, paths: string[], saveTo: string|null = null, log: LogOption = false): {} {
    return packageJsonMerge(template, paths, saveTo, log, "yarn");
}

/**
 * Merge specified bower packages together.
 *
 * @param template - Template that packages will be merged into. Is validated with [bower-json](https://www.npmjs.com/package/bower-json).
 * @param paths - Paths to bower.json files. EG: "path/to/" (bower.json is prepended) or "path/to/bower.json" or "path/to/different.json".
 * @param saveTo - If string, saves the generated bower.json to the specified path. Like 'paths', has 'bower.json' prepended if required.
 * @param log - If true, progress and errors will be logged. Has no affect on exceptions thrown.
 *
 * @public
 */
export function bower(template: IBowerTemplate, paths: string[], saveTo: string|null = null, log: LogOption = false): {} {
    return bowerMerge(template, paths, saveTo, log);
};

/**
 * Uses `yarn.lock` to detect if multiple versions of a dependency have been installed.
 *
 * @param p - Directory of `yarn.lock`.
 * @param log - If true, progress and errors will be logged. Has no affect on exceptions thrown.
 *
 * @public
 */
export function yarnIsFlat(p: string = process.cwd(), log: LogOption = false): boolean {
    if (log === true) {
        log = console.log;
    } else if (!log) {
        log = () => {};
    }

    // Normalize provided directory
    p = path.normalize(p + '/');

    log(`Checking for duplicate dependencies with '${p + 'yarn.lock'}'`);

    // Parse lockfile
    let yarnLock = yarnLockParser.parse(fs.readFileSync(p + 'yarn.lock', 'utf8')).object;

    // Collect dependencies, versions and ranges. Flip switch if duplicates identified.
    let deps = {};
    let dups = false;
    for (let dep in yarnLock) {
        // Extract dependency name and resolver
        let name = dep.slice(0, dep.indexOf('@', 1));
        let resolver = dep.slice(dep.indexOf('@', 1) + 1);
        let entry = yarnLock[dep];

        // Remember details
        if (!(name in deps)) {
            // Not in the list, just add it.
            deps[name] = {
                versions: [entry.version],
                resolvers: [resolver]
            }
        } else {
            // We might have duplicates...
            if (deps[name].versions.indexOf(entry.version)) {
                // Definitely dups
                dups = true;
                deps[name].versions.push(entry.version);
            }

            if (deps[name].resolvers.indexOf(resolver))
                deps[name].resolvers.push(resolver);
        }
    }

    // Quit now if there aren't duplicates
    if (!dups) {
        log(chalk.green('No duplicates found.'));
        return true;
    }


    // Announce duplicates if logging enabled
    /**
     * X versions of (name) are currently installed.
     *     Versions: ...
     *     Resolvers: ...
     */
    if (log) {
        log(chalk.red('Duplicate dependencies detected!'))
        for (let name in deps) {
            if (deps[name].versions.length > 1) {
                log(`${chalk.bold(deps[name].versions.length)} versions of ${chalk.cyan(name)} installed.`);
                log(`    Versions: ${deps[name].versions.join(', ')}`);
                log(`    Resolvers: ${deps[name].resolvers.join(', ')}`);
            }
        }
    }

    return false;
}

/**
 * Merge specified packages together. (supports npm and yarn)
 *
 * @param template - Template that packages will be merged into. Is validated with [package-json-validator](https://www.npmjs.com/package/package-json-validator).
 * @param paths - Paths to package.json files. EG: "path/to/" (package.json is prepended) or "path/to/package.json" or "path/to/different.json".
 * @param saveTo - If string, saves the generated package.json to the specified path. Like 'paths', has 'package.json' prepended if required.
 * @param log - If true, progress and errors will be logged. Has no affect on exceptions thrown.
 * @param packageSpec - Used to determine what dependency keys should be merged.
 */
function packageJsonMerge(template: INodeTemplate, paths: string[], saveTo: string|null, log: LogOption, packageSpec: string): {} {
    if (log === true) {
        log = console.log;
    } else if (!log) {
        log = () => {};
    }

    // Inspect input template
    log("Inspecting template package...")

    // If template.private == true, we only inspect touched fields.
    npmValidate(template, packageSpec, log);
    // paths
    if (!_.isArray(paths)) {
        throw new Exceptions.InvalidArgumentException("'paths' must be an array.");
    }
    paths.forEach(function(p, index, array) {// Resolve to complete path now.
        if (p.match(/\\$|\/$/)) {
            p += "package.json";
            array[index] = p;
        }
    });
    //saveTo
    if (_.isString(saveTo)) {// Resolve to complete path now.
        if (saveTo.match(/\\$|\/$/)) {
            saveTo += "package.json";
        }
        saveTo = path.resolve(saveTo);
    }

    // Load and validate packages.
    let packages: (INodeTemplate & ITemplatePath)[] = [];
    for (let filePath of paths) {
        log("Inspecting package at " + filePath);
        let pkg = JSON.parse(fs.readFileSync(filePath).toString());// We don't use require, as the extension could be different. Plus require aggressively caches.
        npmValidate(pkg, packageSpec, log);
        pkg.path = filePath;
        packages.push(pkg);
    }

    // Grab required dependency types, and add if not yet existing on the template.
    let depTypes = [];
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
        log(`Saving generated package to '${saveTo}'`);

        // Make directories if needed.
        if (!fs.existsSync(path.dirname(saveTo))) {
            fs.mkdirSync(path.dirname(saveTo));
        }
        fs.writeFileSync(saveTo, JSON.stringify(template, null, '    '));
    }

    log("All done!");

    // Return package.
    return template;
}

/**
 * Validates npm package. When private == true, validation goes into minimal mode (name, license, etc are not required).
 *
 * @param pkg - Package object to validate
 * @param pkgSpec - Used to determine what dependency keys should be merged.
 * @param log
 */
function npmValidate(pkg: INodeTemplate, pkgSpec: string, log: LogOption): void {
    let results: INpmValidateResult = {
        valid: true
    };
    // If package.private == true, we only inspect touched fields.
    if (pkg.private == true) {
        // Ensure existing dependency fields are valid.
        let depTypes = [];
        if (pkgSpec == "npm") {
            depTypes = npmDependencyTypes;
        }
        else if (pkgSpec == "yarn") {
            depTypes = yarnDependencyTypes;
        }
        for (let depType of depTypes) {
            if (!_.isUndefined(pkg[depType])) {
                if (!_.isObject(pkg[depType])) {
                    if (!_.isUndefined(results.errors)) results.errors = [];
                    results.valid = false;
                    results.errors.push(`"${depType}" must be an object.`);
                }
            }
        }
    }
    else results = packageJsonValidator(JSON.stringify(pkg));

    // Handle errors
    npmErrors(results, log);
}

/**
 * Handles errors from npm package validation. When log = true, logs critical errors, errors, warnings, and recommendations from npm package validation to the console.
 *
 * @param results
 * @param log
 */
function npmErrors(results: INpmValidateResult, log: LogOption): void {
    // Inspect input.
    if (typeof results !== "object") {
        throw new Exceptions.InvalidArgumentException("'results' must be of type 'object'.");
    }

    if (log === true) {
        log = console.log;
    } else if (!log) {
        log = () => {};
    }

    // Log if requested.
    if (log) {
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

        // Announce recommendations.
        if (results.recommendations) {
            log(chalk.underline("Recommendations:"));
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
        throw new Exceptions.InvalidNodePackageException("Package is invalid. Inspection results:\n" + JSON.stringify(results, null, '    '));
    }
}

/**
 * Merge specified bower packages together.
 *
 * @param template - Template that packages will be merged into. Is validated with [bower-json](https://www.npmjs.com/package/bower-json).
 * @param paths - Paths to bower.json files. EG: "path/to/" (bower.json is prepended) or "path/to/bower.json" or "path/to/different.json".
 * @param saveTo - If string, saves the generated bower.json to the specified path. Like 'paths', has 'bower.json' prepended if required.
 * @param log - If true, progress and errors will be logged. Has no affect on exceptions thrown.
 */
function bowerMerge(template: IBowerTemplate, paths: string[], saveTo: string|null = null, log: LogOption = false): {} {
    if (log === true) {
        log = console.log;
    } else if (!log) {
        log = () => {};
    }

    // Inspect input template
    log("Inspecting template package...")
    bowerValidate(JSON.stringify(template));// Throws an exception on failure, so no need for error reporting.
    // paths
    if (!_.isArray(paths)) {
        throw new Exceptions.InvalidArgumentException("'paths' must be an array.");
    }
    paths.forEach(function(p, index, array) {// Resolve to complete path now.
        if (p.match(/\\$|\/$/)) {
            p += "bower.json";
            array[index] = p;
        }
    });
    //saveTo
    if (_.isString(saveTo)) {// Resolve to complete path now.
        if (saveTo.match(/\\$|\/$/)) {
            saveTo += "bower.json";
        }
        saveTo = path.resolve(saveTo);
    }

    // Load and validate packages.
    let packages: (IBowerTemplate & ITemplatePath)[] = [];
    for (let filePath of paths) {
        log("Inspecting package at " + filePath);
        let pkg = JSON.parse(fs.readFileSync(filePath).toString());// We don't use require, as the extension could be different.
        bowerValidate(JSON.stringify(pkg));// As before, no need to log.
        pkg.path = filePath;
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
        log(`Saving generated package to '${saveTo}'`);
        if (!fs.existsSync(path.dirname(saveTo))) {
            fs.mkdirSync(path.dirname(saveTo));
        }
        fs.writeFileSync(saveTo, JSON.stringify(template, null, '    '));
    }

    log("All done!");

    // Return package.
    return template;
}

/**
 * Performs very basic bower.json spec validation.
 *
 * @param pkgJson - JSON representation of a bower.json package.
 */
function bowerValidate(pkgJson: string): void {
    const pkg = JSON.parse(pkgJson);
    if (!_.isObject(pkg)) {
        throw new Exceptions.InvalidBowerPackageException("Root of package MUST be an object.");
    }
    // @ts-ignore
    if (!_.isString(pkg.name)) {
        throw new Exceptions.InvalidBowerPackageException("Package name MUST be a string.");
    }
    // Now we'll give the used dependency properties a check.
    for (let dependencyType of bowerDependencyTypes) {
        if (pkg.hasOwnProperty(dependencyType)) {
            if (!_.isObject(pkg[dependencyType])) {
                throw new Exceptions.InvalidBowerPackageException(`Package's '${dependencyType}' property MUST be an object.`)
            }
            else {
                for (let pkgDep in pkg[dependencyType]) {
                    if (!_.isString(pkg[dependencyType][pkgDep])) {
                        throw new Exceptions.InvalidBowerPackageException(`Invalid value for ${dependencyType}->${pkgDep} in package.`);
                    }
                }
            }
        }
    }
    // And make sure resolutions match the expected form.
    if ("resolutions" in pkg) {
        // @ts-ignore
        if (!_.isObject(pkg.resolutions)) {
            throw new Exceptions.InvalidBowerPackageException(`Package's 'resolutions' property MUST be an object.`)
        }
        else {
            // @ts-ignore
            for (let pkgRes in pkg.resolutions) {
                // @ts-ignore
                if (!_.isString(pkg.resolutions[pkgRes])) {
                    throw new Exceptions.InvalidBowerPackageException(`Invalid value for resolutions->${pkgRes} in package.`);
                }
            }
        }
    }
}

/**
 * Merges typical dependency packages (npm, bower, yarn) into a provided template.
 *
 * @param tml - Template to merge packages into.
 * @param pkgs - Parsed dependency packages to merge.
 * @param depTypes - Dependency types to merge.
 * @param log
 */
function mergePackageDependencies<TTemplate extends INodeTemplate|IBowerTemplate>(tml: TTemplate, pkgs: (TTemplate & ITemplatePath)[], depTypes: string[], log: LogOption): TTemplate {
    if (log === true) {
        log = console.log;
    } else if (!log) {
        log = () => {};
    }

    // Add resolutions first in case they resolve a dependency collision that cannot be merged.
    if (_.indexOf(depTypes, 'resolutions') !== -1) {
        log("Starting dependency resolution merge.");
        // Merge resolutions for each package.
        for (let pkg of pkgs) {
            if (!_.isUndefined(pkg.resolutions)) {
                log(`Starting merge of dependency resolutions from package '${pkg.name}'`);
                for (let dependency in pkg.resolutions) {
                     // Handle dependency resolution
                    if (tml.resolutions.hasOwnProperty(dependency)) {
                        log(`Merging dependency resolution '${chalk.cyan(dependency)}' with '${chalk.magenta(tml.resolutions[dependency])}' and '${chalk.magenta(pkg.resolutions[dependency])}'.`);
                        tml.resolutions[dependency] = handleDependencyCollision(tml.resolutions[dependency], pkg.resolutions[dependency]);
                    }
                    else {
                        log(`Adding dependency resolution '${chalk.cyan(dependency)}' with '${chalk.magenta(pkg.resolutions[dependency])}'.`);
                        tml.resolutions[dependency] = pkg.resolutions[dependency];
                    }
                }
                log(`Finished merge of dependency resolutions from package '${pkg.name}'`);
            }
        }

        // Remove 'resolutions' from depTypes.
        _.pull(depTypes, 'resolutions');

        log("Finished dependency resolution merge.");
    }

    log("Starting dependency merge.");
    // Iterate over pkgs
    for (let pkg of pkgs) {
        log(`Starting merge of dependencies from package '${pkg.name}'`);
        // And dependency types...
        for (let dependencyType of depTypes) {
            if (dependencyType in pkg) {
                log(`Merging dependency type '${dependencyType}'`);
                // ...for each package
                for (let dependency in pkg[dependencyType]) {
                    // Handle dependency
                    if (tml[dependencyType].hasOwnProperty(dependency)) {
                        log(`Merging dependency '${chalk.cyan(dependency)}' with '${chalk.magenta(tml[dependencyType][dependency])}' and '${chalk.magenta(pkg[dependencyType][dependency])}'.`);
                        try {
                            // Try to resolve dependency collision.
                            tml[dependencyType][dependency] = handleDependencyCollision(tml[dependencyType][dependency], pkg[dependencyType][dependency]);
                        }
                        catch (e) {
                            // Dependency collision failed, do we have resolutions and if so, is this collision resolved by it?
                            if (!_.isUndefined(tml.resolutions) && !_.isUndefined(tml.resolutions[dependency])) {
                                // It is!
                                log(chalk.bgGreen("Dependency conflict detected, resolved by resolution."));
                                tml[dependencyType][dependency] = tml.resolutions[dependency];
                            }
                            else {
                                // Nope!
                                log(chalk.bgRed("Dependency conflict detected!"));
                                throw e;
                            }
                        }
                    }
                    else {
                        log(`Adding dependency '${chalk.cyan(dependency)}' with '${chalk.magenta(pkg[dependencyType][dependency])}'.`);
                        tml[dependencyType][dependency] = pkg[dependencyType][dependency];
                    }
                }
            }
        }
        log(`Finished merge of dependencies from package '${pkg.name ?? pkg.path}'`);
    }
    log("Finished dependency merge.");

    return tml;
}

/**
 * Returns the intersection of both semver ranges if both valid semver ranges. If incoming version isn't a valid semver range, it acts as a override and is returned instead.
 *
 * @param currentVersion - The existing package version value.
 * @param incomingVersion - The incoming package version value to handle.
 */
function handleDependencyCollision(currentVersion: string, incomingVersion: string): string {
    // If packageVersion is a valid semver range, currentVersion must also be valid.
    if (semver.valid(incomingVersion) || semver.validRange(incomingVersion)) {
        if (!semver.valid(currentVersion) && !semver.validRange(currentVersion)) {
            throw new Exceptions.LogicalException("An incoming package semver version range requires the current version to also be valid semver range.\nIncoming: " + incomingVersion + "\nCurrent: " + currentVersion);
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
                                if (!semver.validRange(output)) throw new Exceptions.LogicalException("Cannot produced valid semver range. Range generated: " + output);
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
                                throw new Exceptions.LogicalException('Semver ranges could not be intersected. Ranges may contradict each other.')
                            }
                        }
                        catch (e) {
                            throw new Exceptions.LogicalException(`Cannot merge semver ranges "${currentVersion}" and "${incomingVersion}".`)
                        }
                        // Otherwise just join, and inspect.
                        let intersection = currentVersion + " " + incomingVersion;
                        if (!semver.validRange(intersection)) {
                            throw new Exceptions.LogicalException(`'${currentVersion}' and '${incomingVersion}' cannot be combined to make a valid semver range.`);
                        }
                        return intersection;
                    }
                }
            }
            catch (e) {// We wrap the thrown exception in a LogicalException, so that its easier to handle.
                throw new Exceptions.LogicalException(e);
            }
        }
    } else {
        console.log(chalk.bgRed("Non-semver dependency version value detected. Override triggered. Value: ") + chalk.bgMagenta(incomingVersion));
        return incomingVersion;
    }
}
