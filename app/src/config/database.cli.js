require('dotenv').config();

function explicitConfig(database) {
  return {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database,
    host: process.env.POSTGRES_HOST || 'db',
    port: Number(process.env.POSTGRES_PORT || 5432),
    dialect: 'postgres',
    logging: false,
  };
}

function configFor(database) {
  if (process.env.DATABASE_URL) {
    return {
      use_env_variable: 'DATABASE_URL',
      dialect: 'postgres',
      logging: false,
    };
  }

  return explicitConfig(database);
}

const baseDatabase = process.env.POSTGRES_DB;

module.exports = {
  development: configFor(baseDatabase),
  test: configFor(process.env.POSTGRES_TEST_DB || `${baseDatabase}_test`),
  qa: configFor(process.env.POSTGRES_QA_DB || `${baseDatabase}_qa`),
  production: configFor(process.env.POSTGRES_PROD_DB || baseDatabase),
};
