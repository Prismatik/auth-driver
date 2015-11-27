require('required_env')([ 'AUTH_URL' ]);
var Driver = require('./index.js')
var driver = new Driver(process.env.AUTH_URL);

var test = require('blue-tape');
var bandname = require('bandname');

var rando = () => bandname().replace(/ /g, '_');

var spec = {
  email: (rando()+'@example.com'),
  password: rando(),
  permissions: [{type: rando(), entity: rando()}]
};

spec.emails = [spec.email];

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
  return driver.findByPerm(spec.permissions[0].type, spec.permissions[0].entity)
  .then(res => {
    res.forEach(ent => {
      t.deepEqual(ent.emails, spec.emails)
    });
  });
});

test('search should succeed', t => {
  return driver.search([{key: 'email', value: spec.email}])
  .then(res => {
    t.equal(res.length, 1);
    t.deepEqual(res[0].emails, spec.emails);
  });
});

test('get should succeed', t => {
  return driver.get(entity.id)
  .then(res => {
    t.deepEqual(res.emails, spec.emails);
  });
});

test('update should succeed', t => {
  spec.permissions = [{type: 'baz', entity: 'quux'}];
  return driver.update(entity.id, spec)
});
