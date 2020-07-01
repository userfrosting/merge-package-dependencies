import semver, { SemVer } from "semver";
import semverIntersect from "semver-intersect";

function isSemverString(versionConstraint: string): boolean {
    return !!semver.valid(versionConstraint) || !!semver.validRange(versionConstraint);
}

function tryCleanSemver(versionConstraint: string): string {
    const versionConstraintClean = semver.clean(versionConstraint);
    if (versionConstraintClean !== null) {
        return versionConstraintClean;
    }

    return versionConstraint;
}

function tryCompareSemver(semverA: string, semverB: string): boolean {
    try {
        return semver.eq(semverA, semverB);
    } catch {
        return semverA === semverB;
    }
}

/**
 * Lazily combines semver ranges containing a logical or.
 * @param semverA
 * @param semverB
 */
function imperfectSemverIntersect(semverA: string, semverB: string): string {
    let semverPairs = [];

    for (const semverAPart of semverA.split("||")) {
        for (const semverBPart of semverB.split("||")) {
            // TODO Handle version collapsing (e.g. identical pairs, pairs with no overlap)
            semverPairs.push(`${semverAPart.trim()} ${semverBPart.trim()}`);
        }
    }

    return semverPairs.join(" || ");
}

/**
 * Will throw if cannot be intersected.
 * @todo Handle dependency aliases, etc
 */
export function intersectVersionConstraints(versionConstraintA: string, versionConstraintB: string): string {
    let type: "semver" | "package-alias" | "other" = "semver";

    if (!isSemverString(versionConstraintA)) {
        // TODO Need special handling, throw for now
        throw new Error('ahhhhhhh!');
    }

    if (!isSemverString(versionConstraintB)) {
        // TODO Need special handling, throw for now
        throw new Error('ahhhhhhh!');
    }

    // Both are semver, but do they overlap?
    if (!semver.intersects(versionConstraintA, versionConstraintB)) {
        throw new Error('NOPE!');
    }

    // Identical, or logically the same
    // this can fail on '1'
    if (tryCompareSemver(versionConstraintA, versionConstraintB)) {
        return tryCleanSemver(versionConstraintA);
    }

    // Try a concise merge with semver-intersect package
    try {
        return tryCleanSemver(semverIntersect(versionConstraintA, versionConstraintB));
    } catch {}

    // semver-intersect cannot handle a logical-or, if present then help it out
    // This also covers logical-and
    const intersection = imperfectSemverIntersect(versionConstraintA, versionConstraintB);
    if (!semver.validRange(intersection)) {
        // Well we tried
        throw new Error("😭");
    }

    return tryCleanSemver(intersection);
}
