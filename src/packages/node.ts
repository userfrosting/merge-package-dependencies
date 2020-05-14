import { Package, IPackageLiteral, IDependencies } from "./common.js";

export abstract class NodePackage extends Package {
    merge(pkg: NodePackage): void {
        // todo
    }
}

export interface INodePackageLiteral extends IPackageLiteral {
    /**
     * Dependencies the package is compatible with and may use if available.
     */
    peerDependencies?: IDependencies;

    /**
     * Dependencies install in all compatible environments and by packages including this package.
     */
    optionalDependencies?: IDependencies;
}
