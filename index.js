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
  return request.post(this.AUTH_URL + '/login', { email: email, password: password });
};

Driver.prototype.create = function(data) {
  return request.post(this.AUTH_URL + '/entities', data);
};

Driver.prototype.findByPerm = function(type, uuid) {
  return request.get(this.AUTH_URL + '/entities?perm.type=' + type + '&perm.entity=' + uuid);
};

Driver.prototype.search = function(params) {
  /*
  * params should be an array of objects. eg, "I want to know whether Alice has any kind of permission over c47e":
  * [{
  *   key: 'email',
  *   value: 'alice@example.com'
  * },
  * {
  *   key: 'perm.entity',
  *   value: 'c47eb6a4-b7bd-4aa2-9107-bc907e159ec5'
  * }]
  */
  var qs = params.map(function(param) {
    return [param.key, param.value].join('=');
  }).join('&');
  return request.get(_this.AUTH_URL + '/entities?'+ qs);
};

Driver.prototype.getAll = function() {
  return request.get(this.AUTH_URL + '/entities');
};

Driver.prototype.get = function(id) {
  return request.get(this.AUTH_URL + '/entities/' + id);
};

Driver.prototype.update = function(id, data) {
  return request.put(this.AUTH_URL + '/entities/' + id, data);
};

module.exports = Driver;
