'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Polyfill btoa if on node
if (typeof window === 'undefined') {
  var btoa = function btoa(s) {
    return new Buffer(s).toString('base64');
  };
}

/*
* Usage:
* import Driver from 'auth-driver';
* const driver = new Driver('https://localhost:3000', {
*   username: 'username',
*   password: 'key'
* });
*/

var Driver = function () {
  function Driver(url, opts) {
    _classCallCheck(this, Driver);

    if (!url) throw new Error('Driver must be instantiated with a url');

    this._axios = configureInterceptors(_axios2.default.create(), url, opts);
  }

  _createClass(Driver, [{
    key: 'validate',
    value: function validate(token) {
      return this._axios.get('/entities?token=' + token);
    }
  }, {
    key: 'signIn',
    value: function signIn(email, password) {
      return this._axios.post('/login', { email: email, password: password });
    }
  }, {
    key: 'create',
    value: function create(data) {
      return this._axios.post('/entities', data);
    }
  }, {
    key: 'findByPerm',
    value: function findByPerm(type, uuid) {
      return this._axios.get('/entities?perm.type=' + type + '&perm.entity=' + uuid);
    }
  }, {
    key: 'search',
    value: function search(params) {
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
      var qs = params.map(function (p) {
        return [p.key, p.value].join('=');
      }).join('&');
      return this._axios.get('/entities?' + qs);
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      return this._axios.get('/entities');
    }
  }, {
    key: 'get',
    value: function get(id) {
      return this._axios.get('/entities/' + id);
    }
  }, {
    key: 'update',
    value: function update(id, data) {
      return this._axios.post('/entities/' + id, data);
    }
  }]);

  return Driver;
}();

exports.default = Driver;


function configureInterceptors(instance, url) {
  var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var username = _ref.username;
  var password = _ref.password;

  var auth = btoa((username || '') + ':' + (password || ''));

  instance.interceptors.request.use(function (config) {
    config.url = '' + url + config.url;
    config.headers = {
      'Authorization': 'Basic ' + auth,
      'Content-Type': 'application/json'
    };

    return config;
  });

  instance.interceptors.response.use(function (res) {
    return res.data;
  });

  return instance;
}