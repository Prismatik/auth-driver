# Auth Driver [![Build Status](https://travis-ci.org/Prismatik/auth-driver.svg?branch=master)](https://travis-ci.org/Prismatik/auth-driver)

A driver for [Prismatik auth service](https://github.com/Prismatik/auth).

## Getting started

```
npm i auth-driver
```

To use:

```js
import Driver from 'auth-driver';

const driver = new Driver('http://localhost:3000', {
  password: 'hai'
});

driver.getAll()
.then(entities => {
  console.log(entities);
});
```

## Tests

Set env variables `AUTH_URL` and `AUTH_PASSWORD` for your auth server before
running tests. `AUTH_PASSWORD` should match the `API_KEY` you have defined on
your auth server.
