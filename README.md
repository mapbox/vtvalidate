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
