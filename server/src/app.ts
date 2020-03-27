import bodyParser from "body-parser";
import express from "express";
import graphqlHttp from "express-graphql";
import promiseRouter from "express-promise-router";
import morgan from "morgan";
import path from "path";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import { createConnection } from "typeorm";
import cors from "cors";
import { CourseResolver } from "./resolvers/CourseResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { GroupResolver } from "./resolvers/GroupResolver";
import { RegistrationResolver } from "./resolvers/RegistrationResolver";
import shibbCharset from "./middleware/shibbolethHeaders";
import authorization, { authChecker } from "./middleware/authorization";
import seeding from "./testUtils/seeding";
import { switchUser } from "./testUtils/switchUser";

export const app = express();
const router = promiseRouter();
const port = 3001;

const main = async (): Promise<void> => {
  try {
    await createConnection();
  } catch (error) {
    console.log("error:", error);
  }

  const schema = await buildSchema({
    resolvers: [CourseResolver, UserResolver, GroupResolver, RegistrationResolver],
    // FIXME: Shouldn't validation be on..?
    validate: false,
    authChecker,
  });

  // Logging format for morgan.
  const logFormat = process.env.NODE_ENV === "development" ? "dev" : "combined";

  // CORS for development
  if (process.env.NODE_ENV === "development") {
    app.use(cors({ origin: "http://localhost:3000" }));
  }

  // Middleware.
  app
    .use(shibbCharset)
    .use(authorization)
    .use("/graphql", graphqlHttp({ schema, graphiql: true }))
    .use(bodyParser.json())
    .use(morgan(logFormat))
    .use(router);

  // Route for keep-alive polling.
  app.get("/keepalive", (req, res) => res.send("This is the way."));

  // Register routes for development and testing utilities.
  if (process.env.NODE_ENV !== "production") {
    seeding(router);
    switchUser(router);
  }

  // TODO: for debugging, remove this
  app.get("/env", (req, res) => res.send(process.env.NODE_ENV));

  // Serve frontend.
  app.use(express.static("public"));
  app.get("*", (req, res) => res.sendFile(path.resolve("public", "index.html")));

  // Start the app.
  app.listen(port);
  console.log(`Listening to port ${port}`);
};

main().catch(error => console.log(error));
