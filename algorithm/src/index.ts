import express from "express";
// import bodyParser from "body-parser";
import { Registration } from "./entities/Registration";
import { formGroups } from "./algorithm/algorithm";
const app = express();
app.use(express.json({ limit: "50mb" }));

const PORT = 3004 || process.env.PORT;

interface RequestParameters {
  groupSize: number;
  registrations: Registration[];
}

app.post("/", (req, res) => {
  const data = req.body as RequestParameters;

  const formed = formGroups(data.groupSize, data.registrations);
  res.send(formed);
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`Algorithm server running on port ${PORT}`);
});
