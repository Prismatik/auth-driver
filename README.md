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
