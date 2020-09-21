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
import shibbolethHeaders from "./middleware/shibbolethHeaders";
import authorization, { authChecker } from "./middleware/authorization";
import seeding from "./testUtils/seeding";

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
    .use(shibbolethHeaders)
    .use(authorization)
    .use("/graphql", graphqlHttp({ schema, graphiql: true }))
    .use(bodyParser.json())
    .use(morgan(logFormat))
    .use(router);

  // Route for keep-alive polling.
  app.get("/assembler/keepalive", (req, res) => res.send("This is the way."));

  // Route for logout. Shibboleth gives logout url in headers to server, but not directly to client.
  app.get("/assembler/logout", (req, res) => {
    if (process.env.NODE_ENV === "development") {
      res.send("http://stackoverflow.com");
    } else {
      res.send(req.headers.shib_logout_url);
    }
  });

  // Register routes for development and testing utilities.
  if (process.env.NODE_ENV !== "production") {
    seeding(router);
  }

  // Serve frontend.
  app.use(express.static("public"));
  app.get("*", (req, res) => res.sendFile(path.resolve("public", "index.html")));

  // Start the app.
  app.listen(port);
  console.log(`Listening to port ${port}`);
};

main().catch(error => console.log(error));
