#!/usr/bin/env node

"use strict";

var exists = require('fs').existsSync;
var fs = require('fs');
var zlib = require('zlib');

var usage = 'usage:';
usage += '\n  node bin/vtvalidate.js <vector tile>';

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
var uncompressed_buffer = decompressBuffer(buffer);

function decompressBuffer(buffer) {
    if (buffer[0] === 0x1F && buffer[1] === 0x8B) {
        return zlib.gunzipSync(buffer);
    } 
    else if (buffer[0] === 0x78 && 
        (buffer[1] === 0x9C ||
         buffer[1] === 0x01 ||
         buffer[1] === 0xDA ||
         buffer[1] === 0x5E)) {
      return zlib.inflate(buffer);
    } else return null;
}


// Allow compressed gzip or compressed zlib
if (uncompressed_buffer) {
    validator.isValid(uncompressed_buffer, function(err, valid) {
        if (err) {
            console.error(err.message);
            process.exit(1);
        }
        process.stdout.write(valid); // Using "if (valid)" here because vtvalidate returns "/n" for some reason
        process.exit(0);
    });    
} else {
    validator.isValid(buffer, function(err, valid) {
        if (err) {
            console.error(err.message);
            process.exit(1);
        }
        process.stdout.write(valid); // Using "if (valid)" here because vtvalidate returns "/n" for some reason
        process.exit(0);
    });    
}
