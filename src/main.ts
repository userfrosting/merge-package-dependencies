import Bower from "./packages/bower_json/structure.js";
import Package from "./packages/package_json/structure.js";
import { validPackage } from "./validate.js";

function Merge<TPackage extends object>(pkgs: Map<string, TPackage>, depKeys: Set<string>): TPackage {
    const thing = 'test' as unknown as Package;
    if (pkgs.has('first')) {
        pkgs.get('test');
    }
    return pkgs[0];
}

export function MergeNpm(pkgs: Map<string, unknown>, extraDepKeys: Set<string>): Package {
    pkgs.forEach(pkg => validPackage(pkg));
    const packages = pkgs as Map<string, Package>;
    return Merge(packages, new Set(extraDepKeys));
}

export function MergeYarn(pkgs: Map<string, unknown>, extraDepKeys: Set<string>): Package {
    pkgs.forEach(pkg => validPackage(pkg));
    const packages = pkgs as Map<string, Package>;
    return Merge(packages, new Set(extraDepKeys));
}

export function MergeBower(pkgs: Map<string, unknown>, extraDepKeys: Set<string>): Bower {
    pkgs.forEach(pkg => validPackage(pkg));
    const packages = pkgs as Map<string, Bower>;
    return Merge(packages, new Set(extraDepKeys));
}

function JoinSemver(name: string, range1: string, range2: string): string {
    return range1;
}
