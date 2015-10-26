var request = require('request');

/*
* Usage:
*
* var Driver = require('./index')
* var driver = new Driver('https://username:key@localhost:3000');
*/


Driver = function(AUTH_URL) {
  this.AUTH_URL = AUTH_URL;
};

Driver.prototype.validate = function(token) {
  var _this = this;
  return new Promise(function(resolve, reject){
    request.get(_this.AUTH_URL + '/entities?token=' + token, function(err, res, body){
      if (err) reject(err);
      return resolve(body);
    });
  });
};

Driver.prototype.signIn = function(email, password) {
  var _this = this;
  return new Promise(function(resolve, reject){
    request.post(_this.AUTH_URL + '/login', { email: email, password: password }, function(err, res, body){
      if (err) reject(err);
      return resolve(body);
    })
  });
};

Driver.prototype.create = function(data) {
  var _this = this;
  return new Promise(function(resolve, reject){
    request.post(_this.AUTH_URL + '/entities', data, function(err, res, body){
      if (err) reject(err);
      return resolve(body);
    });
  });
};

Driver.prototype.search = function(type, uuid) {
  var _this = this;
  return new Promise(function(resolve, reject){
    request.get(_this.AUTH_URL + '/entities?perm.type=' + type + '&perm.entity=' + uuid, function(err, res, body){
      if (err) reject(err);
      return resolve(body);
    })
  });
};

Driver.prototype.getAll = function() {
  var _this = this;
  return new Promise(function(resolve, reject){
    request.get(_this.AUTH_URL + '/entities', function(err, res, body){
      if (err) reject(err);
      return resolve(body);
    });
  });
};

Driver.prototype.update = function(id, data) {
  var _this = this;
  return new Promise(function(resolve, reject){
    request.put(_this.AUTH_URL + '/entities/' + id, data, function(err, res, body){
      if (err) reject(err);
      return resolve(body);
    });
  });
};

module.exports = Driver;
