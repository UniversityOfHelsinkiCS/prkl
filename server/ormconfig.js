const devMode = process.env.NODE_ENV === "development";
const testMode = process.env.NODE_ENV === "test";

const prefix = devMode ? "src" : "dist/src";
const ext = devMode ? "ts" : "js";

const dbHost = testMode ? "test-db" : "db";

module.exports = {
  type: "postgres",
  host: dbHost,
  port: 5432,
  database: "postgres",
  username: "postgres",
  password: "postgres",
  entities: [`${prefix}/entities/*.${ext}`],
  migrationsTableName: "migrations",
  migrations: [`${prefix}/migrations/*.${ext}`],
  migrationsRun: true,
};
