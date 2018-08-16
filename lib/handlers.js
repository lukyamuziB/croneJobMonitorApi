/**
 * request handlers
 */

//dependencies
const _data = require('./data');
const helpers = require('./helpers');

//Define handlers
const handlers = {};

//ping handler
handlers.ping = function(data, callback){
    callback(200);
};

//not found handler
handlers.notFound = function(data, callback){
    callback(404);
}

//users
handlers.users = function(data, callback){
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.HttpMethod) > -1){
        handlers._users[data.HttpMethod](data,callback);
    } else {
        callback(405);
    }
}

// Container for all the users methods
handlers._users  = {};

handlers._users.post = function(data,callback){
    // Check that all required fields are filled out
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
  
    if(firstName && lastName && phone && password && tosAgreement){
      // Make sure the user doesnt already exist
      _data.read('users',phone,function(err,data){
        if(err){
          // Hash the password
          var hashedPassword = helpers.hash(password);
  
          // Create the user object
          if(hashedPassword){
            var userObject = {
              'firstName' : firstName,
              'lastName' : lastName,
              'phone' : phone,
              'hashedPassword' : hashedPassword,
              'tosAgreement' : true
            };
  
            // Store the user
            _data.create('users',phone,userObject,function(err){
              if(!err){
                callback(200);
              } else {
                console.log(err);
                callback(500,{'Error' : 'Could not create the new user'});
              }
            });
          } else {
            callback(500,{'Error' : 'Could not hash the user\'s password.'});
          }
  
        } else {
          // User alread exists
          callback(400,{'Error' : 'A user with that phone number already exists'});
        }
      });
  
    } else {
      callback(400,{'Error' : 'Missing required fields'});
    }
  
  };

  /**
   * Required data: phone
   * Optional data: none
   * @todo Only let an authenticated user access their object. Dont let them access anyone elses.
   */
  
  handlers._users.get = function(data,callback){
    // Check that phone number is valid
    var phone = typeof(data.QueryParameters.phone) == 'string' && data.QueryParameters.phone.trim().length == 10 ? data.QueryParameters.phone.trim() : false;
    if(phone){
      // Lookup the user
      _data.read('users',phone,function(err,data){
        if(!err && data){
          // Remove the hashed password from the user user object before returning it to the requester
          delete data.hashedPassword;
          callback(200,data);
        } else {
          callback(404);
        }
      });
    } else {
      callback(400,{'Error' : 'Missing required field'})
    }
  };

module.exports = handlers;
