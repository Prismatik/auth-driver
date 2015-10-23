// * signin - email and password, returns matching entity or invalid
// * token validation - pass JWT, returns matching entity or invalid
// * accept entity queries - run query against auth API and return results
// * create entities
// * update entities (adding / deleting permissions, changing name, adding / deleting emails)

// auth.signIn
// auth.validate
// auth.read
// auth.create
// auth.update

var request = require('request');
var AUTH_URL = process.env.AUTH_URL || 'http://localhost:9000';

exports.validate = function(jwt) {

};

exports.signIn = function(email, password) {
  return new Promise(function(resolve, reject){
    request.post(AUTH_URL + '/login', { email: email, password: password }, function(err, res, body){
      if (err) reject(err);

      return resolve(body);
    })
  });
};

exports.create = function(data) {
  return new Promise(function(resolve, reject){
    request.post(AUTH_URL + '/entities', data, function(err, res, body){
      if (err) reject(err);

      return resolve(body);
    })
  });
};

exports.read = function(query) {
  return new Promise(function(resolve, reject){
    request.get(AUTH_URL + '/entities', function(err, res, body){
      if (err) reject(err);

      return resolve(body);
    })
  });
};

exports.update = function(id, data) {
  return new Promise(function(resolve, reject){
    request.put(AUTH_URL + '/entities/' + id, data, function(err, res, body){
      if (err) reject(err);

      return resolve(body);
    });
  });
};
