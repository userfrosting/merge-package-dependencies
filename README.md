# merge-package-dependencies

| Branch | Status |
| ------ | ------ |
| master | [![Continuous Integration](https://github.com/userfrosting/merge-package-dependencies/workflows/Continuous%20Integration/badge.svg?branch=master)](https://github.com/userfrosting/merge-package-dependencies/actions?query=branch:master+workflow:"Continuous+Integration") [![codecov](https://codecov.io/gh/userfrosting/merge-package-dependencies/branch/master/graph/badge.svg)](https://codecov.io/gh/userfrosting/merge-package-dependencies/branch/master) |
| develop | [![Continuous Integration](https://github.com/userfrosting/merge-package-dependencies/workflows/Continuous%20Integration/badge.svg?branch=develop)](https://github.com/userfrosting/merge-package-dependencies/actions?query=branch:develop+workflow:"Continuous+Integration") [![codecov](https://codecov.io/gh/userfrosting/merge-package-dependencies/branch/develop/graph/badge.svg)](https://codecov.io/gh/userfrosting/merge-package-dependencies/branch/develop) |

A simple tool that can merge the `dependency` and `devDependency` dependency types for npm/yarn `package.json`s or bower `bower.json`s into a single `package.json` or `bower.json` object (and optionally file). To properly support frontend scenarios, this tool also merges `resolutions`, and ignores unnecessary field recommendations for private npm/yarn packages. Perfect for projects like UserFrosting where plugins (*Sprinkles*) provide virtually all functionality.

> NOTE: While non-semver values are supported, they will act as an override and emit a warning (even if logging is disabled). This override behavior only applies to 'incoming' values. This behavior does not match npm, yarn or bower.
>
> NOTE: This is currently an offline tool, and as such conflicts further down the dependency chain are not evaluated. There is however a duplicate dependency detection tool for yarn to allow the creation of workarounds in the meantime (see [docs/api](./docs/api/index.md)
>
> NOTE: Any dependencies with a path specified as the version will not be adjusted, even if an output location is specified.

## Install

```bash
npm i -D  @userfrosting/merge-package-dependencies
```

## Usage

To merge multiple NPM `package.json`'s into a single object, and save to a specified location...

```js
import { NpmPackage } from "@userfrosting/merge-package-dependencies";
import url from "url";
import path from "path";

const scriptDir = path.dirname(url.fileURLToPath(import.meta.url));

// Create a template
const target = NpmPackage.fromObject({
    name: "pkg",
    version: "1.7.2",
});

// Merge existing package dependencies
target.merge(NpmPackage.fromFile(path.join(scriptDir, "./packages/a/package.json")));
target.merge(NpmPackage.fromFile(path.join(scriptDir, "./packages/b/package.json")));
target.merge(NpmPackage.fromFile(path.join(scriptDir, "./packages/c/package.json")));

// Write built-up target package to file system
target.toFile(path.join(scriptsDir, "./package.json");
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

