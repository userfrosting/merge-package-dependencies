import { Package, IPackageLiteral, IDependencies } from "./common.js";

export abstract class BowerPackage extends Package {
    merge(pkg: BowerPackage): void {
        // todo
    }
}

export interface IBowerPackageLiteral extends IPackageLiteral {
    /**
     * Dependency constraints that resolve transitive dependency conflicts when Yarn install is
     * performed in flat mode.
     */
    resolutions?: IDependencies;
}
