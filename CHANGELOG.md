# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.1.0] - 2020-04-28

### Fixed
- Issue with TypeScript types where return type was `{}` instead of input template.

## [2.0.2] - 2020-04-27

### Fixed
- More cases of `undefined` in logging that was overlooked.

## [2.0.1] - 2020-04-27

### Fixed
- Unnamed packages being identified as `undefined` in logging. File path will now be used as a fallback.
- Optional template fields mistakenly marked as required.

## [2.0.0] - 2020-04-25

This release is mainly focused on bringing project tooling up to date.

### Added
- Used exception types are now exported.
- TypeScript types.

### Changed
- Major tooling refactor, API remains unchanged however exports may behave differently.
- Major version updates for dependencies (`chalk` from 2.4.1 to 4, `fs-extra` from 7.0.1 to 9, `semver` from 5.6 to 7).

## [1.2.1] 2018-11-22
### Changed
- Updated dependencies.

## [1.2.0] - 2018-06-19
### Added
- Merge `peerDependencies` in Yarn and NPM packages. (thanks @FabianMeul)

## [1.2.0-rc.2] - 2018-02-03
### Fixed
- Issue with internal yarnpkg/lockfile dependency that slipped testing.

## [1.2.0-rc.1] - 2018-02-02
### Added
- Duplicate dependency checker that uses `yarn.lock`. This is a stop-gap solution for Yarn's inability to report flat mode dependency conflicts when running in a non-interactive context.
- This changelog.

## [1.1.0] - 2017-11-11
### Changed
- Dropped requirement of `name` and `description` for private `package.json` (NPM and Yarn).

## [1.0.1] - 2017-07-28
### Added
- AppVeyor integration for automated unit testing.

### Changed
- Raised required node version to 6.
- Directories are automatically created when saving merged package.

## [1.0.0] - 2017-07-27
Initial release.
