# merge-package-dependencies

| Branch | Status |
| ------ | ------ |
| master | [![Continuous Integration](https://github.com/userfrosting/merge-package-dependencies/workflows/Continuous%20Integration/badge.svg?branch=master)](https://github.com/userfrosting/merge-package-dependencies/actions?query=branch:master+workflow:"Continuous+Integration") [![codecov](https://codecov.io/gh/userfrosting/merge-package-dependencies/branch/master/graph/badge.svg)](https://codecov.io/gh/userfrosting/merge-package-dependencies/branch/master) |

> This is an ES Module package which includes a CommonJS entrypoint for convenience. NodeJS 12.17 or greater is required.

> This branch is under active development.

A tool for merging dependencies from one `package.json` or `bower.json` definition into another, while respecting semver constraints.

## Install

```bash
npm i -D  @userfrosting/merge-package-dependencies
yarn -D  @userfrosting/merge-package-dependencies
pnpm i -D  @userfrosting/merge-package-dependencies
```

## Usage

To merge multiple NPM `package.json`'s into a single object, and save to a specified location...

```js
import { NpmPackage } from "@userfrosting/merge-package-dependencies";
import url from "url";
import path from "path";

const targetPkg = new NpmPackage({
    name: "foo-bar",
    dependencies: {
        "@userfrosting/browserify-dependencies": "^3.1.0",
    },
});

targetPkg.merge(new NpmPackage({
    dependencies: {
        "@userfrosting/browserify-dependencies": "2 || 3",
        preact: "^10.5.5",
    },
}));

targetPkg.toJson();
/// {
///     "name": "foo-bar",
///     "dependencies": {
///         "@userfrosting/browserify-dependencies": "^3.1.0",
///         "preact": "^10.5.5"
///     }
/// }
```

## API

API documentation is regenerated for every release using [API Extractor](https://www.npmjs.com/package/@microsoft/api-extractor) and [API Documenter](https://www.npmjs.com/package/@microsoft/api-documenter).
The results reside in [docs/api](./docs/api/index.md).

## Release process

Generally speaking, all releases should first traverse through `alpha`, `beta`, and `rc` (release candidate) to catch missed bugs and gather feedback as appropriate. Aside from this however, there are a few steps that **MUST** always be done.

1. Make sure [`CHANGELOG.md`](./CHANGELOG.md) is up to date.
2. Update version via `npm` like `npm version 3.0.0` or `npm version patch`.
3. `npm publish`.
4. Create release on GitHub from tag made by `npm version`.

## License

[MIT](LICENSE)

