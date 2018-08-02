var test = require('tape');
var fs = require('fs');
var path = require('path');
var module = require('../lib/index.js');
var mvtf = require('@mapbox/mvt-fixtures');
var mvtfixtures = path.resolve(__dirname, '..', 'node_modules', '@mapbox', 'mvt-fixtures');

test('success: valid tile', function(t) {
  var buffer = mvtf.get('043').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, '');
    t.end();
  });
});

test('success: all property types', function(t) {
  var buffer = mvtf.get('038').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, '');
    t.end();
  });
});

test('success: valid linestring', function(t) {
  var buffer = mvtf.get('018').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, '');
    t.end();
  });
});

test('success: valid ring', function(t) {
  var buffer = mvtf.get('022').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, '');
    t.end();
  });
});

test('success: valid zlib compressed', function(t) {
  var buffer = fs.readFileSync(__dirname + '/fixtures/zlib-compressed');
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, '');
    t.end();
  });
});

test('success: valid gzip compressed', function(t) {
  var buffer = fs.readFileSync(mvtfixtures + '/real-world/compressed/14-9384-9577.mvt.gz');
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, '');
    t.end();
  });
});

test('failure: invalid arg type', function(t) {
  module.isValid('woops', function(err, result) {
    t.ok(err)
    t.equal(err.message, 'first arg \"buffer\" must be a Protobuf object');
    t.end();
  });
});

test('failure: invalid arg type', function(t) {
  module.isValid(null, function(err, result) {
    t.ok(err)
    t.equal(err.message, 'first arg is empty');
    t.end();
  });
});

test('failure: invalid arg type', function(t) {
  module.isValid(undefined, function(err, result) {
    t.ok(err)
    t.equal(err.message, 'first arg is empty');
    t.end();
  });
});

test('failure: missing callback', function(t) {
  var buffer = mvtf.get('043').buffer;
  try {
    module.isValid(buffer);
  } catch(err) {
    t.ok(err)
    t.equal(err.message, 'second arg \"callback\" must be a function');
    t.end();
  }
});

test('success: invalid tile', function(t) {
  var buffer = mvtf.get('003').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, 'unknown geometry type');
    t.end();
  });
});

test('success: invalid tile', function(t) {
  var buffer = mvtf.get('004').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, 'Missing geometry field in feature (spec 4.2)');
    t.end();
  });
});

test('success: valid v1 tile, but invalid v2', function(t) {
  var buffer = mvtf.get('061').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, 'expected command 1 but got 7');
    t.end();
  });
});

test('success: invalid tile', function(t) {
  var buffer = mvtf.get('005').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, 'unpaired property key/value indexes (spec 4.4)');
    t.end();
  });
});

test('success: invalid tile', function(t) {
  var buffer = mvtf.get('006').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, 'Unknown geometry type (spec 4.3.4)');
    t.end();
  });
});

test('success: invalid tile', function(t) {
  var buffer = mvtf.get('007').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, 'unknown field in layer (tag=15, type=2)');
    t.end();
  });
});

test('success: invalid tile', function(t) {
  var buffer = mvtf.get('008').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, 'unknown field in layer (tag=5, type=2)');
    t.end();
  });
});

test('success: invalid tile', function(t) {
  var buffer = mvtf.get('011').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, 'illegal property value type');
    t.end();
  });
});

test('success: invalid tile', function(t) {
  var buffer = mvtf.get('012').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, 'unknown vector tile version: 99');
    t.end();
  });
});

test('success: invalid tile', function(t) {
  var buffer = mvtf.get('013').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, 'unknown field in layer (tag=3, type=0)');
    t.end();
  });
});

test('success: invalid tile', function(t) {
  var buffer = mvtf.get('014').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, 'missing name field in layer (spec 4.1)');
    t.end();
  });
});

test('success: invalid tile', function(t) {
  var buffer = mvtf.get('023').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, 'missing name field in layer (spec 4.1)');
    t.end();
  });
});

test('success: invalid tile', function(t) {
  var buffer = mvtf.get('030').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, 'Feature has more than one geometry field');
    t.end();
  });
});

test('success: invalid tile', function(t) {
  var buffer = mvtf.get('040').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, 'index out of range: 2');
    t.end();
  });
});

test('success: invalid tile', function(t) {
  var buffer = mvtf.get('041').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, 'index out of range: 106');
    t.end();
  });
});

test('success: invalid tile', function(t) {
  var buffer = mvtf.get('042').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, 'index out of range: 2');
    t.end();
  });
});

test('success: invalid tile', function(t) {
  var buffer = mvtf.get('044').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, 'expected command 1 but got 7');
    t.end();
  });
});