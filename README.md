merge-package-dependencies
=================

A simple tool that can merge the `dependency` and `devDependency` dependency types for npm `package.json`s or bower `bower.json`s into a single `package.json` or `bower.json` object (and optionally file). Perfect for projects like UserFrosting were plugins (*Sprinkles*) provide virtually all functionality.

> NOTE: While non-semver values are supported, they will act as an override and emit a warning. Note that this behaviour does not match npm or bower. Also note that path values will not be adjusted.

Example
-------

To merge multiple `package.json`'s into a single object, and save to a specified location...
```js
let mergePackages = require("merge-package-dependencies");

function mergeNPM() {
    let template = {
        name: "pkg",
        version: "1.7.2"
    };
    let pkgPaths = [
        "../app/sprinkles/core/",
        "../app/sprinkles/account/",
        "../app/sprinkles/admin/"
    ];
    let result = mergePackages.npm(template, pkgPaths, "../app/assets/");
}
```

API
---
See [`docs/API.md`](docs/API.md).