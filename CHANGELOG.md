## v0.3.0

- N-API (`node-addon-api`)
- Binaries are now compiled with clang 10.x
- Updated mason and node_modules

## v0.2.3

- Add `-Wno-error=deprecated-declarations` flags to binding.gyp to turn NAN errors into warnings [#27](https://github.com/mapbox/vtvalidate/issues/27)
- Add package-lock.json

## v0.2.2

- Added node v8 and node v10 support

## v0.2.1

- Update bench test to handle errors properly per https://github.com/mapbox/vtvalidate/pull/19
- Changes: https://github.com/mapbox/vtvalidate/compare/v0.2.0...v0.2.1

## v0.2.0

- Add gzip-hpp compression support per https://github.com/mapbox/vtvalidate/pull/18
- Add CLI
- Changes: https://github.com/mapbox/vtvalidate/compare/v0.1.0-alpha1...v0.2.0

## v0.1.0-alpha1
- Initial release based on node-cpp-skel
- Add memory stats option to bench tests
