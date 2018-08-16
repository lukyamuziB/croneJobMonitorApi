/*
* Library for storing and editing data
*
*/

//dependencies
const fs = require('fs');
const path = require('path');

//container for the module to be exported
const lib = {};

// Base directory
lib.baseDir = path.join(_dirname,'/../.data/');

//write data to a file
lib.create = function(dir, file, data, callback){
    // open file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err, fileDescriptor){});
};
