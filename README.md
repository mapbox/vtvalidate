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
 
- If the tile is valid, `vtvalidate` will return an empty string. 
- If the tile is invalid, `vtvalidate` will return the string output from vtzero. 
- `vtvalidate` will throw an error if there is unexpected behaviour, for example an invalid argument value passed into `vtvalidate.isValid()` or a corrupt compressed buffer.

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

#### Type of validation
`vtvalidate` validates tile data against [vtzero](https://github.com/mapbox/vtzero):
- Tile data consistent with the [Mapbox vector tile spec - Version 2](https://www.mapbox.com/vector-tiles/specification/). Tiles created via Mapbox vector tile spec Version 1 will be flagged invalid.
- Read tile layer(s) and feature(s)
- Decode properties
- Decode geometries

Currently, vtvalidate does not check geometries for self-intersections, but planned in [the future](https://github.com/mapbox/core-tech/issues/253). If you'd like to add more extensive tile validation, check out [this example](https://github.com/mapbox/vtzero/blob/master/examples/vtzero-check.cpp).


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
