import { IDependencies } from "./common.js";
import { NodePackage, INodePackageLiteral } from "./node.js";

export class YarnPackage extends NodePackage {
    merge(pkg: YarnPackage): void {
        // todo
    }
}

export interface IYarnPackageLiteral extends INodePackageLiteral {
    /**
     * Dependency constraints that resolve transitive dependency conflicts when Yarn install is
     * performed in flat mode.
     */
    resolutions?: IDependencies;
}
