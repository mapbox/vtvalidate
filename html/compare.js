
//console.warn = function() {}
var vtw = require('./module.js');
var vtn = require('../');
var fs = require('fs');

var files = [
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3188-1888.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3189-1888.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3190-1888.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3191-1888.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3192-1888.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3193-1888.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3194-1888.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3195-1888.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3188-1889.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3189-1889.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3190-1889.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3191-1889.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3192-1889.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3193-1889.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3194-1889.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3195-1889.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3188-1890.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3189-1890.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3190-1890.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3191-1890.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3192-1890.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3193-1890.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3194-1890.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3195-1890.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3188-1891.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3189-1891.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3190-1891.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3191-1891.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3192-1891.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3193-1891.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3194-1891.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3195-1891.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3188-1892.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3189-1892.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3190-1892.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3191-1892.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3192-1892.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3193-1892.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3194-1892.mvt",
    "../node_modules/@mapbox/mvt-fixtures/real-world/bangkok/12-3195-1892.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/001/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/023/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/002/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/024/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/003/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/025/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/004/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/026/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/005/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/027/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/006/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/030/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/007/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/032/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/008/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/033/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/009/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/034/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/010/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/035/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/011/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/036/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/012/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/037/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/013/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/038/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/014/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/039/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/015/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/040/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/016/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/041/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/017/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/042/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/018/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/043/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/019/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/044/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/020/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/021/tile.mvt",
    "../node_modules/@mapbox/mvt-fixtures/fixtures/022/tile.mvt"
]

vtw.addOnPreMain(run);

var mvts = []

files.forEach(function(f) {
    mvts.push(fs.readFileSync(f));
})


var iterations = 10;

function wasm(cb) {
    var count = mvts.length*iterations;
    var count2 = 0;
    for (var i=0;i<iterations;++i) {
        mvts.forEach(function(f) {
            vtw.isValid(f);
            count2++;
        });        
    }
    return cb(count2);
}

function node(cb) {
    var count = mvts.length*iterations;
    var count2 = 0;

    function done() {
        if (--count == 0) {
            count2++;
            return cb(count2);
        }
    }
    for (var i=0;i<iterations;++i) {
        mvts.forEach(function(f) {
            vtn.isValid(f,done);
        });        
    }
}

function validate(cb) {
    var count = mvts.length;
    function done() {
        if (--count == 0) {
            count++;
            return cb();
        }
    }
    // validate results
    mvts.forEach(function(f) {
        var w_res = vtw.isValid(f);
        vtn.isValid(f,function(err,res) {
            if (w_res != res) {
                console.log('trouble',w_res,res);
            }
            done();
        });
    });
}

function run() {
    validate(function(err) {
        console.time('node');
        node(function(c) {
            console.timeEnd('node');
            console.time('wasm');
            wasm(function(c) {
                console.timeEnd('wasm');
            });
        })
    });
}
