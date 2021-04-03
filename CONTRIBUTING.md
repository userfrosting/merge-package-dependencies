# Contributing

## Getting Started

To start, you'll need NodeJS 14 or [Lando](https://lando.dev/) installed (prefix commands with `lando`).

The development and release process heavily lean into common NPM scripts, the only commands you need to care about are;

- `npm i` to install dependencies.
- `npm test` to run tests.
- `npm version ...` to create a new version.
- `npm publish` to publish.

The sole exception is the release readiness check. This is run automatically by the CI, and can be run locally with;

- `npm run release-readiness`

## API Documentation

API documentation is derived from source using [API Extractor](https://www.npmjs.com/package/@microsoft/api-extractor) and [API Documenter](https://www.npmjs.com/package/@microsoft/api-documenter). Entities tagged with `@public` will be included in API generated documentation.

Generation occurs automatically when `pnpm version` is run.

## Release process

Generally speaking, all releases should first traverse through `alpha`, `beta`, and `rc` (release candidate) to catch missed bugs and gather feedback as appropriate. Aside from this however, there are a few steps that **MUST** always be done.

1. Make sure [`CHANGELOG.md`](./CHANGELOG.md) is up to date.
2. Update version via `npm` like `npm version 3.0.0` or `npm version patch`.
3. `npm publish`.
4. Create release on GitHub from tag made by `npm version`.

## Lando

A [Lando](https://lando.dev/) configuration is included in this repo.
