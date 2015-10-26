var request = require('request');
var AUTH_URL = process.env.AUTH_URL || 'http://auth-ordermentum-sandpit.prismatik.com.au';

exports.validate = function(token) {
  return new Promise(function(resolve, reject){
    request.get(AUTH_URL + '/entities?token=' + token, function(err, res, body){
      if (err) reject(err);
      return resolve(body);
    });
  });
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
    });
  });
};

exports.search = function(type, uuid) {
  return new Promise(function(resolve, reject){
    request.get(AUTH_URL + '/entities?perm.type=' + type + '&perm.entity=' + uuid, function(err, res, body){
      if (err) reject(err);
      return resolve(body);
    })
  });
};

exports.getAll = function() {
  return new Promise(function(resolve, reject){
    request.get(AUTH_URL + '/entities', function(err, res, body){
      if (err) reject(err);
      return resolve(body);
    });
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
