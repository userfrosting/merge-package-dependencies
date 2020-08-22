/**
 * Interface holding all attributes that impact dependency resolution via NPM or Yarn.
 */
export default interface Package {
    /**
     * Dependencies that are required for package/project functionality.
     */
    dependencies?: Dependency;

    /**
     * Dependencies that are only needed for development of the package, e.g., test framework or building documentation.
     */
    devDependencies?: Dependency;

    /**
     * Dependencies that a package can without.
     */
    optionalDependencies?: Dependency;

    /**
     * Dependencies that are treated as direct dependencies if this package is a direct dependency itself.
     * If indirect and a peer dependency is not met, a warning will be generated.
     */
    peerDependencies?: Dependency;

    /**
     * Dependency versions to automatically ersovle if conflicts occur between pacakges.
     * Yarn specific, applies regardless of state of `flat`.
     */
    resolutions?: Dependency;
    
    /**
     * Forces all dependencies to be installed at the same level by preventing the installation of duplicates.
     * Yarn specific.
     */
    flat?: boolean;
}
/**
 * Dependencies are specified with a simple hash of package name to version range.
 * The version range is a string which has one or more space-separated descriptors.
 * Dependencies can also be identified with a tarball or git URL.
 */
interface Dependency {
    [k: string]: string;
}
