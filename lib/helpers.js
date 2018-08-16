/*
 * Helpers for various tasks
 */

const config = require('./config');
const crypto = require('crypto');

// Container for all the helpers
const helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  } catch(e){
    return {};
  }
};

// Create a SHA256 hash
helpers.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

//takes in a string and returns an object or throwa an error
helpers.parseJsonToObject = function(str){
    try {
        var Obj = JSON.parse(str)
        return Obj
    } catch (e) {
        return {};
    }
}

module.exports = helpers;
