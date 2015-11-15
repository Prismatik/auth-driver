var axios = require('axios');

/*
* Usage:
*
* var Driver = require('./index')
* var driver = new Driver('https://username:key@localhost:3000');
*/

var returnBody = res => {
  return res.data;
};

Driver = function(AUTH_URL) {
  var creds = AUTH_URL.split('@')[0].split('//')[1];
  this.headers = {
    Authorization: 'Basic '+new Buffer(creds).toString('base64')
  };
  this.AUTH_URL = AUTH_URL;
};

Driver.prototype.validate = function(token) {
  return axios({
    url: this.AUTH_URL + '/entities?token=' + token,
    headers: this.headers
  }).then(returnBody);
};

Driver.prototype.signIn = function(email, password) {
  return axios({
          url: this.AUTH_URL + '/login',
          data:{ email: email, password: password },
          method: 'POST',
          headers: this.headers
        }).then(returnBody);
};

Driver.prototype.create = function(data) {
  return axios({
          url: this.AUTH_URL + '/entities',
          data: data,
          method: 'POST',
          headers: this.headers
        }).then(returnBody);
};

Driver.prototype.findByPerm = function(type, uuid) {
  return axios({
    url: this.AUTH_URL + '/entities?perm.type=' + type + '&perm.entity=' + uuid,
    headers: this.headers
  }).then(returnBody);
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
  console.log('qs is', qs);
  return axios({
    url: this.AUTH_URL + '/entities?'+ qs,
    headers: this.headers
  }).then(returnBody);
};

Driver.prototype.getAll = function() {
  return axios({
    url: this.AUTH_URL + '/entities',
    headers: this.headers
  }).then(returnBody);
};

Driver.prototype.get = function(id) {
  return axios({
    url: this.AUTH_URL + '/entities/' + id,
    headers: this.headers
  }).then(returnBody);
};

Driver.prototype.update = function(id, data) {
  return axios({
    url: this.AUTH_URL + '/entities/' + id,
    headers: this.headers,
    data: data,
    method: 'POST',
  }).then(returnBody);
};

module.exports = Driver;
