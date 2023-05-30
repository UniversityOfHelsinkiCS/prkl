const devMode = process.env.NODE_ENV === "development";
const testMode = process.env.NODE_ENV === "test";

const prefix = devMode ? "src" : "dist";
const ext = devMode ? "ts" : "js";

const dbHost = testMode ? "test-db" : process.env.POSTGRES_HOST;

module.exports = {
  type: "postgres",
  host: dbHost,
  port: 5432,
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  entities: [`${prefix}/entities/*.${ext}`],
  migrationsTableName: "migrations",
  migrations: [`${prefix}/migrations/*.${ext}`],
  migrationsRun: true,
};
