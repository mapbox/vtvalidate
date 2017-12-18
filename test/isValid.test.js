var test = require('tape');
var module = require('../lib/index.js');
var mvtf = require('@mapbox/mvt-fixtures');

test('success: prints loud busy world', function(t) {
  var buffer = mvtf.get('043').buffer;
  module.isValid(buffer, function(err, result) {
    if (err) throw err;
    t.equal(result, 'true');
    t.end();
  });
});
