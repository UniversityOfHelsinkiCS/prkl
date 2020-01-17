import express from "express";

export const app = express();
const port = 3001;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
