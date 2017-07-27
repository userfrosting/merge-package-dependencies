merge-package-dependencies
=================

A simple tool that can merge the `dependency` and `devDependency` dependency types for npm/yarn `package.json`s or bower `bower.json`s into a single `package.json` or `bower.json` object (and optionally file). To properly support frontend scenarios, this tool also merges `resolutions`.  Perfect for projects like UserFrosting where plugins (*Sprinkles*) provide virtually all functionality.

> NOTE: While non-semver values are supported, they will act as an override and emit a warning (even if logging is disabled). This override behaviour only applies to 'incoming' values. This behaviour does not match npm, yarn or bower.

> NOTE: This is currently an offline tool, and as such conflicts further down the dependency chain are not evaluated.

> NOTE: Any dependencies with a path specified as the version will not be adjusted, even if an output location is specified.

Installation
------------
```bash
npm install @userfrosting/merge-package-dependencies --save-dev
```
```bash
yarn add @userfrosting/merge-pacakge-dependencies --dev
```

Example
-------

To merge multiple `package.json`'s into a single object, and save to a specified location...
```js
let mergePackages = require("@userfrosting/merge-package-dependencies");

function mergeYarn() {
    let template = {
        name: "pkg",
        version: "1.7.2"
    };
    let pkgPaths = [
        "../app/sprinkles/core/",
        "../app/sprinkles/account/",
        "../app/sprinkles/admin/"
    ];
    let result = mergePackages.yarn(template, pkgPaths, "../app/assets/");
}
```

API
---
See [`docs/API.md`](docs/API.md).