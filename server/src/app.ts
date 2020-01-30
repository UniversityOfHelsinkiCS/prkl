import { ApolloServer } from "apollo-server";
import bodyParser from "body-parser";
import express from "express";
import promiseRouter from "express-promise-router";
import morgan from "morgan";
import path from "path";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { CourseResolver } from "./resolvers/CourseResolver";

export const app = express();
const router = promiseRouter();
const port = 3001;

const main = async () => {
  const schema = await buildSchema({ resolvers: [CourseResolver] });

  const server = new ApolloServer({ schema });
  await server.listen(4000);
};

main();

// Logging format for morgan.
const logFormat = process.env.NODE_ENV === "development" ? "dev" : "combined";

// Middleware.
app
  .use(bodyParser.json())
  .use(morgan(logFormat))
  .use(router);

// Serve frontend.
app.use(express.static("public"));
app.get("*", (req, res) => res.sendFile(path.resolve("public", "index.html")));

// Don't block ports in testing.
if (process.env.NODE_ENV !== "test") {
  app.listen(port);
}
