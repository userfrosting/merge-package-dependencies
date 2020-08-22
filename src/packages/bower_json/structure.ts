/**
 * Interface holding all attributes that impact dependency resolution via Bower.
 */
export default interface Bower {
    /**
     * Dependencies that are required for package/project functionality.
     */
    dependencies?: Dependency;

    /**
     * Dependencies that are only needed for development of the package, e.g., test framework or building documentation.
     */
    devDependencies?: Dependency;
    
    /**
     * Dependency versions to automatically resolve with if conflicts occur between packages.
     */
    resolutions?: Dependency;
}

/**
 * Dependencies are specified with a simple hash of package name to a semver compatible identifier or URL.
 */
interface Dependency {
    [k: string]: string;
}
