import { readFileSync } from "fs";

let nextId = 0;

export abstract class Package {
    #id?: string;

    /**
     * Returns a unique id for this package instance, assigned at first access time.
     * This is intended as a fallback for logging when no other identifier exists.
     */
    get id(): string {
        if (!this.#id) {
            this.#id = "FALLBACK_PKG_ID_" + nextId++;
        }

        return this.#id;
    }

    protected readFile(path: string): Buffer {
        return readFileSync(path);
    }

    /**
     * Merges common package dependency matrixes (`dependencies`, `devDependencies`) from the
     * provided package into this package.
     * @param pkg Package to take dependencies from.
     */
    merge(pkg: Package): void {

    }
}

export interface IDependencies {
    [x: string]: string;
}

/**
 * Core generic interface for all supported package types.
 * This models the
 */
export interface IPackageLiteral {
    /**
     * Package name.
     */
    name?: string;

    /**
     * Dependencies installed in all environments and by packages including this package.
     */
    dependencies?: IDependencies;

    /**
     * Dependencies intended to be used for development purposes such as build tools.
     */
    devDependencies?: IDependencies;
}
