require('required_env')([ 'AUTH_URL' ]);
var Driver = require('./index.js')
var driver = new Driver(process.env.AUTH_URL);

var test = require('blue-tape');
var bandname = require('bandname');

var spec = {
  email: (bandname()+'@example.com').replace(/ /g, '_'),
  password: bandname().replace(/ /g, '_'),
  permissions: [{type: 'foo', entity: 'bar'}]
};

var entity;
var token;

test('create should succeed', t => {
  return driver.create(spec)
  .then(res => {
    entity = res;
  });
});

test('signIn should succeed', t => {
  return driver.signIn(spec.email, spec.password)
  .then(res => {
    console.log(res);
    token = res;
  });
});

test('validate should succeed', t => {
  return driver.validate(token);
});

test('validate should fail an invalid token', t => {
  return driver.validate('wut')
  .then(t.fail)
  .catch(() => {
    t.ok(true);
  });
});

test('findByPerm should succeed', t => {
  return driver.findByPerm('foo', 'bar')
  .then(res => {
    var passed = false;
    res.forEach(ent => {
      if (ent.email === spec.email) passed = true;
    });
    t.ok(passed);
  });
});

test('search should succeed', t => {
  return driver.search([{key: 'email', value: spec.email}])
  .then(res => {
    console.log('res is', res);
    t.equal(res.length, 1);
    t.equal(res[0].email, spec.email);
  });
});

test('get should succeed', t => {
  return driver.get(entity.id)
  .then(res => {
    t.equal(res.email, spec.email);
  });
});

test('update should succeed', t => {
  spec.permissions = [{type: 'baz', entity: 'quux'}];
  return driver.update(entity.id, spec)
});
