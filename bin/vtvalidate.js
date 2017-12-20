#!/usr/bin/env node

"use strict";

var exists = require('fs').existsSync;
var fs = require('fs');
var zlib = require('zlib');

var usage = 'usage:';
usage += '\n  vtvalidate.js <vector tile>';

var input_tile = process.argv[2];
if (!input_tile) {
   console.log(usage);
   process.exit(1);
}

if (!exists(input_tile)) {
    console.log(input_tile + ' does not exist');
    process.exit(1);
}

var validator = require('../');

var buffer = fs.readFileSync(input_tile);

if (buffer[0] === 0x1F && buffer[1] === 0x8B) {
    console.log('detected gzip compressed tile');
    var uncompressed_buffer = zlib.gunzipSync(buffer);
    validator.isValid(uncompressed_buffer,function(err,valid) {
        console.log(err,valid);
    });    
} else {
    validator.isValid(buffer,function(err,valid) {
        console.log(err,valid);
    });    
}

