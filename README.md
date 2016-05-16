# Auth Driver

Lib to use Prismatik auth server.

## Usage

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

## Running tests

Set env variables `AUTH_URL` and `AUTH_PASSWORD` for your auth server before running tests.
`AUTH_PASSWORD` should match the `API_KEY` you have defined on your auth server.
