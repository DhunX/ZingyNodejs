function seed(dbName, user, password) {
  console.log('Seeding database...');
  db = db.getSiblingDB(dbName);
  db.createUser({
    user: user,
    pwd: password,
    roles: [{ role: 'readWrite', db: dbName }],
  });

  db.createCollection('api_keys');
  db.createCollection('roles');

  db.api_keys.insert({
    metadata: 'To be used by the zingy',
    key: 'b70e1cd3-8133-450b-827b-0ab3fcddee54',
    version: 1,
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  db.roles.insertMany([
    { code: 'LEARNER', status: true, createdAt: new Date(), updatedAt: new Date() },
    { code: 'WRITER', status: true, createdAt: new Date(), updatedAt: new Date() },
    { code: 'EDITOR', status: true, createdAt: new Date(), updatedAt: new Date() },
    { code: 'ADMIN', status: true, createdAt: new Date(), updatedAt: new Date() },
  ]);
}

// seed('zingy-db', 'zingy-db-user', 'changeit');
// seed('zingy-test-db', 'zingy-test-db-user', 'changeit');
