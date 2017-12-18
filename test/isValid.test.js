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

// test('success: catch invalid tile when parsing in vtzero', function(t) {
//   var buffer = fs.readFileSync(__dirname + '/funky1.mvt');
//   module.isValid(buffer, function(err, result) {
//     if (err) throw err;
//     t.equal(result, 'false');
//     t.end();
//   });
// });

// test('success: catch invalid tile when parsing in vtzero', function(t) {
//   var buffer = fs.readFileSync(__dirname + '/funky2.mvt');
//   module.isValid(buffer, function(err, result) {
//     if (err) throw err;
//     t.equal(result, 'false');
//     t.end();
//   });
// });
