# vtvalidate

Validate vector tiles based on the [Mapbox Vector Tile Specification 2.x](https://www.mapbox.com/vector-tiles/specification/) via [vtzero](https://github.com/mapbox/vtzero).

[![badge](https://mapbox.s3.amazonaws.com/cpp-assets/node-cpp-skel-badge_blue.svg)](https://github.com/mapbox/node-cpp-skel)  [![Build Status](https://travis-ci.org/mapbox/vtvalidate.svg?branch=master)](https://travis-ci.org/mapbox/vtvalidate) [![codecov](https://codecov.io/gh/mapbox/vtvalidate/branch/master/graph/badge.svg)](https://codecov.io/gh/mapbox/vtvalidate)

## Build & Test
```shell
git clone git@github.com:mapbox/vtvalidate.git
cd vtvalidate

# Build binaries. This looks to see if there were changes in the C++ code. This does not reinstall deps.
make

# Run tests
make test

# Cleans your current builds and removes potential cache
make clean

# Cleans everything, including the things you download from the network in order to compile (ex: npm packages).
# This is useful if you want to nuke everything and start from scratch.
# For example, it's super useful for making sure everything works for Travis, production, someone else's machine, etc
make distclean
```

## Usage

`vtvalidate` validates tile data against [vtzero](https://github.com/mapbox/vtzero). If the tile is valid, the result will be an empty string. If vtzero is unable to decode a tile and [its geometries](https://github.com/mapbox/vtzero/blob/a42889ddd507c38a3b5f49a0ea8468a8f4a394a4/doc/reading.md#geometries) or if the tile data is not consistent with the [Mapbox vector tile spec](https://www.mapbox.com/vector-tiles/specification/), `vtvalidate` will return the string output from vtzero.

`vtvalidate` will only throw an error if there is unexpected behaviour (ex: invalid parameter values or a corrupt compressed buffer).

#### Valid tile
```js
var vtvalidate = require('@mapbox/vtvalidate');

...

// Pass in protocol buffer (uncompressed)
vtvalidate.isValid(buffer, function(err, result) {
  if (err) throw err;

  // returns empty string if it's a valid tile
  console.log(result); // ''
});
```

#### Invalid tile
```js
var vtvalidate = require('@mapbox/vtvalidate');

...

// Pass in protocol buffer (uncompressed)
vtvalidate.isValid(buffer, function(err, result) {
  if (err) throw err;

  // returns string that specifies why the tile is invalid
  console.log(result); // 'Missing geometry field in feature (spec 4.2)'
});
```

## CLI

Accepts either uncompressed or gzip/zlib compressed tiles

```
node bin/vtvalidate.js <path-to-vector-tile>
```
Will output:
- empty string if it's a valid tile
- string that specifies why the tile is invalid


## Bench
Provide desired iterations and concurrency
```
node bench/isValid.bench.js --iterations 50 --concurrency 10
```
