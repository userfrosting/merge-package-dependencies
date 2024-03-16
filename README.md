# merge-package-dependencies

| Branch | Status |
| ------ | ------ |
| master | [![Continuous Integration](https://github.com/userfrosting/merge-package-dependencies/workflows/Continuous%20Integration/badge.svg?branch=master)](https://github.com/userfrosting/merge-package-dependencies/actions?query=branch:master+workflow:"Continuous+Integration") [![codecov](https://codecov.io/gh/userfrosting/merge-package-dependencies/branch/master/graph/badge.svg)](https://codecov.io/gh/userfrosting/merge-package-dependencies/branch/master) |

A simple tool that can merge the `dependency` and `devDependency` dependency types for npm/yarn `package.json`s or bower `bower.json`s into a single `package.json` or `bower.json` object (and optionally file). To properly support frontend scenarios, this tool also merges `resolutions`, and ignores unnecessary field recommendations for private npm/yarn packages. Perfect for projects like UserFrosting where plugins (*Sprinkles*) provide virtually all functionality.

> NOTE: While non-semver values are supported, they will act as an override and emit a warning (even if logging is disabled). This override behavior only applies to 'incoming' values. This behavior does not match npm, yarn or bower.
>
> NOTE: This is currently an offline tool, and as such conflicts further down the dependency chain are not evaluated. There is however a duplicate dependency detection tool for yarn to allow the creation of workarounds in the meantime (see [docs/api](./docs/api/index.md))
>
> NOTE: Any dependencies with a path specified as the version will not be adjusted, even if an output location is specified.

## Install

```bash
npm i -D  @userfrosting/merge-package-dependencies
```

## Usage

To merge multiple `package.json`'s into a single object, and save to a specified location...

```js
import * as mergePackages from "@userfrosting/merge-package-dependencies";

let result = mergePackages.yarn(
    {
        name: "pkg",
        version: "1.7.2",
    },
    [
        "../app/sprinkles/core/",
        "../app/sprinkles/account/",
        "../app/sprinkles/admin/"
    ],
    "../app/assets/"
);
```

## API

See [docs/api](./docs/api/index.md).

## License

[MIT](LICENSE)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).
