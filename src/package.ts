abstract class Package {}

class NodePackage extends Package {
    static fromFile(path: string): this {

    }
}

class NpmPackage extends NodePackage {

}

class YarnPackage extends NodePackage {

}

class BowerPackage extends Package {

}
