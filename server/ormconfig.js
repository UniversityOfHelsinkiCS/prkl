const devMode = process.env.NODE_ENV === "development";

const prefix = devMode ? "src" : "dist";
const ext = devMode ? "ts" : "js";

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [`${prefix}/entities/*.${ext}`],
  migrationsTableName: "migrations",
  migrations: [`${prefix}/migrations/*.${ext}`],
  migrationsRun: true,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
};
