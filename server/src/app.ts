import bodyParser from "body-parser";
import express from "express";
import promiseRouter from "express-promise-router";
import morgan from "morgan";
import path from "path";
// import { resolve } from "dns";
// import courses from "./routes/courses";

export const app = express();
const router = promiseRouter();
const port = 3001;

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
// app.use("/courses", courses);
// app.get("*", (req, res) => res.sendFile(path.resolve("..", "client", "public", "index.html")));

// Don't block ports in testing.
if (process.env.NODE_ENV !== "test") {
  app.listen(port);
}
