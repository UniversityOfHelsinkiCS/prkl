import bodyParser from "body-parser";
import express from "express";
import graphqlHttp from "express-graphql";
import promiseRouter from "express-promise-router";
import morgan from "morgan";
import path from "path";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { CourseResolver } from "./resolvers/CourseResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { GroupResolver } from "./resolvers/GroupResolver";
import shibbCharset from './middleware/shibbolethHeaders';


export const app = express();
const router = promiseRouter();
const port = 3001;

const main = async () => {
  try {
    const connection = await createConnection({
      type: "postgres",
      host: "db",

      username: "postgres",
      password: "postgres",
      entities: [__dirname + "/entity/*.ts"],
      synchronize: true,
    });
  } catch (error) {
    console.log("error:", error);
  }

  const schema = await buildSchema({
    resolvers: [CourseResolver, UserResolver, GroupResolver],
    validate: false,
    // TODO: Do we want this?
    nullableByDefault: true,
  });

  // Logging format for morgan.
  const logFormat = process.env.NODE_ENV === "development" ? "dev" : "combined";

  // Middleware.
  app
    .use(shibbCharset)
    .use("/graphql", graphqlHttp({ schema, graphiql: true }))
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
};

main();
