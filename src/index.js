import axios from 'axios';
import HttpError from 'standard-http-error';

// Polyfill btoa if on node
if (typeof window === 'undefined') {
  var btoa = s => new Buffer(s).toString('base64');
}

/*
* Usage:
* import Driver from 'auth-driver';
* const driver = new Driver('https://localhost:3000', {
*   username: 'username',
*   password: 'key'
* });
*/

export default class Driver {
  constructor(url, opts) {
    if (!url)
      throw new Error('Driver must be instantiated with a url');

    this._axios = configureInterceptors(axios.create(opts), url, opts);
  }

  validate(token) {
    return this._axios.get(`/entities?token=${token}`);
  }

  signIn(email, password) {
    return this._axios.post('/login', { email, password });
  }

  create(data) {
    return this._axios.post('/entities', data);
  }

  findByPerm(type, uuid) {
    return this._axios.get(`/entities?perm.type=${type}&perm.entity=${uuid}`);
  }

  search(params) {
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
    const qs = params.map(p => [p.key, p.value].join('=')).join('&');
    return this._axios.get(`/entities?${qs}`);
  }

  getAll() {
    return this._axios.get('/entities');
  }

  get(id) {
    return this._axios.get(`/entities/${id}`);
  }

  update(id, data) {
    return this._axios.post(`/entities/${id}`, data);
  }
}

function configureInterceptors(instance, url, { username, password } = {}) {
  const auth = btoa(`${username || ''}:${password || ''}`);

  instance.interceptors.request.use(config => {
    config.url = `${url}${config.url}`;
    config.headers = {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    }

    return config;
  })

  instance.interceptors.response.use(
    res => res.data,
    err => Promise.reject(errorify(err))
  );

  return instance;
}

function errorify(err) {
  if (typeof err !== 'object') return new HttpError(500);
  return new HttpError(err.status, err.statusText, {
    response: err.data,
    message: err.data.message
  })
}
