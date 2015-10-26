var request = require('request-promise');

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
  return request.get(this.AUTH_URL + '/entities?token=' + token);
};

Driver.prototype.signIn = function(email, password) {
  return request.post(_this.AUTH_URL + '/login', { email: email, password: password });
};

Driver.prototype.create = function(data) {
  return request.post(_this.AUTH_URL + '/entities', data);
};

Driver.prototype.search = function(type, uuid) {
  return request.get(_this.AUTH_URL + '/entities?perm.type=' + type + '&perm.entity=' + uuid);
};

Driver.prototype.getAll = function() {
  return request.get(_this.AUTH_URL + '/entities');
};

Driver.prototype.update = function(id, data) {
  return request.put(_this.AUTH_URL + '/entities/' + id, data);
};

module.exports = Driver;
