console.warn = function() {}
var vtvalidate = require('./module.js');

var fs = require('fs');

// Users/dane/projects/mvt-fixtures/real-world/chicago/13-2099-3043.mvt

var mvt = process.argv[2];

if (!mvt) {
    console.error('please provide path to mvt');
    process.exit(1);
}

function run() {
    var result = vtvalidate.isValid(fs.readFileSync(mvt));
    if (!result) {
        console.log('success',mvt);
    } else {
        console.log('fail',result,mvt)
    }
}

if (vtvalidate.addOnPreMain) {
    vtvalidate.addOnPreMain(run);
} else {
    run();
}
