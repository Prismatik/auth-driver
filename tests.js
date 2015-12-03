//FIXME these tests are full of shared state. They work, but they're liable to do unexpected things if not watched carefully as they change
require('required_env')([ 'AUTH_URL' ]);
import Driver from './src';
import test from 'blue-tape';
import bandname from 'bandname';

// Set to your auth api key
const TEST_PASSWORD = 'hai';

const driver = new Driver(process.env.AUTH_URL, { password: TEST_PASSWORD });

const rando = () => bandname().replace(/ /g, '_');
const genSpec = () => {
  const email = rando()+'@example.com';

  return {
    email: email,
    emails: [email],
    password: rando(),
    permissions: [{type: rando(), entity: rando()}]
  };
};

const run = (name, func) => {
  test(name, t => {
    let entity;
    let token;

    const spec = genSpec();

    return driver.create(spec)
    .then(res => entity = res)
    .then(() => driver.signIn(spec.email, spec.password) )
    .then(res => token = res.token)
    .then(() => {
      return func({entity: entity, token: token, spec: spec})(t)
    });
  });
};

run('create should succeed', fixtures => t => {
  const spec = genSpec();
  return driver.create(spec);
});

run('signIn should succeed', fixtures => t => {
  return driver.signIn(fixtures.spec.email, fixtures.spec.password);
});

run('validate should succeed', fixtures => t => {
  return driver.validate(fixtures.token);
});

run('validate should fail an invalid token', fixtures => t => {
  return driver.validate('wut')
  .then(t.fail)
  .catch(() => {
    t.ok(true);
  });
});

run('findByPerm should succeed', fixtures => t => {
  return driver.findByPerm(fixtures.spec.permissions[0].type, fixtures.spec.permissions[0].entity)
  .then(res => {
    res.forEach(ent => {
      t.deepEqual(ent.emails, fixtures.spec.emails);
    });
  });
});

run('search should succeed', fixtures => t => {
  return driver.search([{key: 'email', value: fixtures.spec.email}])
  .then(res => {
    t.equal(res.length, 1);
    t.deepEqual(res[0].emails, fixtures.spec.emails);
  });
});

run('get should succeed', fixtures => t => {
  return driver.get(fixtures.entity.id)
  .then(res => {
    t.deepEqual(res.emails, fixtures.spec.emails);
  });
});

run('update should succeed', fixtures => t => {
  fixtures.entity.permissions = [{type: 'baz', entity: 'quux'}];
  return driver.update(fixtures.entity.id, fixtures.entity);
});
