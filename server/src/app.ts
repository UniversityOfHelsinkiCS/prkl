import express from "express";
import promiseRouter from "express-promise-router";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import authorization, { authChecker } from "./middleware/authorization";
import cors from "cors";
import headersMiddleware from "unfuck-utf8-headers-middleware";
import logInAs, { MockedByRequest } from "./middleware/logInAs";
import graphqlHttp from "express-graphql";
import bodyParser from "body-parser";
import morgan from "morgan";
import seeding from "./testUtils/seeding";
import path from "path";
import "reflect-metadata";
import { CourseResolver } from "./resolvers/CourseResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { GroupResolver } from "./resolvers/GroupResolver";
import { RegistrationResolver } from "./resolvers/RegistrationResolver";

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
    .use(headersMiddleware(["uid", "givenname", "sn", "mail", "hypersonstudentid"]))
    .use(authorization)
    .use(logInAs)
    .use("/graphql", graphqlHttp({ schema, graphiql: true }))
    .use(bodyParser.json())
    .use(morgan(logFormat))
    .use(router);

  // Route for keep-alive polling.
  app.get("/keepalive", (req, res) => res.send("This is the way."));

  // Route for logout. Shibboleth gives logout url in headers to server, but not directly to client.
  app.get("/logout", (req, res) => {
    if (process.env.NODE_ENV === "development") {
      res.send("http://stackoverflow.com");
    } else {
      res.send(req.headers.shib_logout_url);
    }
  });

  app.get("/mocking", (req: MockedByRequest, res) => {
    res.send({
      mockedBy: req.mockedBy,
      mockedUser: req.user ? req.user.shibbolethUid : req.mockedBy,
    });
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
