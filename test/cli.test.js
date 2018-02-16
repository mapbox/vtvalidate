var test = require('tape');
var path = require('path');
var exec = require('child_process').exec;
var mvtf = require('@mapbox/mvt-fixtures');

var validate = path.resolve(__dirname, '..', 'bin', 'vtvalidate.js');
var mvtfixtures = path.resolve(__dirname, '..', 'node_modules', '@mapbox', 'mvt-fixtures');

test('success: valid uncompressed tile', function(t) {
  var tile = mvtfixtures + '/fixtures/043/tile.mvt';
  var cmd = [ validate, tile ].join(' ');

  exec(cmd, function(err, stdout, stderr) {
    t.ifError(err, 'no error');
    t.equal(stdout, '');
    t.end();
  });
});

test('success: valid gzip compressed tile', function(t) {
  var tile = mvtfixtures + '/real-world/compressed/14-9384-9577.mvt.gz';
  var cmd = [ validate, tile ].join(' ');

  exec(cmd, function(err, stdout, stderr) {
    t.ifError(err, 'no error');
    t.equal(stdout, '');
    t.end();
  });
});

test('success: valid zlib compressed tile', function(t) {
  var tile = path.resolve(__dirname, 'fixtures', 'zlib-compressed');
  var cmd = [ validate, tile ].join(' ');

  exec(cmd, function(err, stdout, stderr) {
    t.ifError(err, 'no error');
    t.equal(stdout, '');
    t.end();
  });
});

test('failure: missing tile arg', function(t) {
  exec(validate, function(err, stdout, stderr) {
    t.ok(err);
    t.ok(stdout.indexOf('usage') == 0);
    t.end();
  });
});

test('invalid filetype', function(t) {
  var tile = mvtfixtures + '/fixtures/043/info.json';
  var cmd = [ validate, tile ].join(' ');

  exec(cmd, function(err, stdout, stderr) {
    t.ifError(err, 'no error');
    t.equal(stdout, 'unknown pbf field type exception');
    t.end();
  });
});

test('invalid tile arg, not a filepath', function(t) {
  var tile = 'uhoh';
  var cmd = [ validate, tile ].join(' ');

  exec(cmd, function(err, stdout, stderr) {
    t.ok(err);
    t.ok(stdout.indexOf('uhoh does not exist') == 0);
    t.end();
  });
});

test('invalid tile', function(t) {
  var tile = mvtfixtures + '/fixtures/003/tile.mvt';
  var cmd = [ validate, tile ].join(' ');

  exec(cmd, function(err, stdout, stderr) {
    t.ifError(err, 'no error');
    t.equal(stdout, 'unknown geometry type');
    t.end();
  });
});