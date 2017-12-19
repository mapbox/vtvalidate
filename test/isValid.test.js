var test = require('tape');
var module = require('../lib/index.js');
var mvtf = require('@mapbox/mvt-fixtures');
var fs = require('fs');

test('success: valid tile', function(t) {
  var buffer = mvtf.get('043').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, 'true');
    t.end();
  });
});

test('success: invalid tile', function(t) {
  var buffer = mvtf.get('003').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, 'unknown geometry type');
    t.end();
  });
});
