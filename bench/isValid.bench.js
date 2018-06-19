"use strict";

var argv = require('minimist')(process.argv.slice(2));
if (!argv.iterations || !argv.concurrency) {
  console.error('Please provide desired iterations, concurrency');
  console.error('Example: \n\tnode bench/isValid.bench.js --iterations 50 --concurrency 10');
  console.error('Optional args: \n\t--mem (reports memory stats)');
  process.exit(1);
}

// This env var sets the libuv threadpool size.
// This value is locked in once a function interacts with the threadpool
// Therefore we need to set this value either in the shell or at the very
// top of a JS file (like we do here)
process.env.UV_THREADPOOL_SIZE = argv.concurrency;

var fs = require('fs');
var path = require('path');
var assert = require('assert')
var d3_queue = require('d3-queue');
var module = require('../lib/index.js');
var queue = d3_queue.queue();
var bytes = require('bytes');

var p = 'node_modules/@mapbox/mvt-fixtures/real-world/chicago/';

// Get chicago tiles from real-world fixtures
fs.readdir(p, function (err, files) {
  if (err) throw err;
  start(files);
});

var start = function(files){
  var track_mem = argv.mem ? true : false;
  var iterations = argv.iterations;
  var concurrency = argv.concurrency;
  var runs = 0;
  var tiles = [];
  var memstats = {
    max_rss:0,
    max_heap:0,
    max_heap_total:0
  };

  files.forEach(function(file) {
    var path = p+file;
    var buffer = fs.readFileSync(path);

    tiles.push(buffer);
  });

  function run(buffer, cb) {
    module.isValid(buffer, function(err, result) {
        if (err) {
          return cb(err);
        } else if (result.length > 0) {
          return cb(new Error(result));
        } else {
          ++runs;
          if (track_mem && runs % 1000) {
            var mem = process.memoryUsage();
            if (mem.rss > memstats.max_rss) memstats.max_rss = mem.rss;
            if (mem.heapTotal > memstats.max_heap_total) memstats.max_heap_total = mem.heapTotal;
            if (mem.heapUsed > memstats.max_heap) memstats.max_heap = mem.heapUsed;
          }
          return cb();
        }
    });
  }

  // Start monitoring time before async work begins within the defer iterator below.
  // AsyncWorkers will kick off actual work before the defer iterator is finished,
  // and we want to make sure we capture the time of the work of that initial cycle.
  console.log('Running benchmark...');
  var time = +(new Date());

  for (var i = 0; i < iterations; i++) {
    tiles.forEach(function(tile) {
      queue.defer(run, tile);
    });
  }

  queue.awaitAll(function(error) {
    if (error) throw error;
    if (runs != iterations*tiles.length) {
      throw new Error('Error: did not run as expected');
    }
    // check rate
    time = +(new Date()) - time;

    if (time == 0) {
      console.log('Warning: ms timer not high enough resolution to reliably track rate. Try more iterations');
    } else {
    // number of milliseconds per iteration
      var rate = runs/(time/1000);
      console.log('Benchmark speed: ' + rate.toFixed(0) + ' runs/s (runs: ' + runs + ' ms: ' + time + ' )');

      if (track_mem) {
        console.log('Benchmark peak mem (max_rss, max_heap, max_heap_total): ', bytes(memstats.max_rss), bytes(memstats.max_heap), bytes(memstats.max_heap_total));
      } else {
        console.log('Note: pass --mem to track memory usage');
      }
    }

    console.log('Benchmark iterations: ', iterations, 'concurrency: ', concurrency);

    // There may be instances when you want to assert some performance metric
    //assert.equal(rate > 1000, true, 'speed not at least 1000/second ( rate was ' + rate + ' runs/s )');

  });

}
