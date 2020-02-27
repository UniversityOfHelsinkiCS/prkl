const devMode = process.env.NODE_ENV === "development";
const prefix = devMode ? "src" : "dist";
const ext = devMode ? "ts" : "js";

module.exports = {
  type: "postgres",
  host: "db",
  port: 5432,
  database: "postgres",
  username: "postgres",
  entities: [`${prefix}/entities/*.${ext}`],
  migrationsTableName: "migrations",
  migrations: [`${prefix}/migrations/*.${ext}`],
  migrationsRun: true,
};
