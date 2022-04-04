import express from 'express';
import * as _ from "lodash";
import  bodyParser  from 'body-parser';
import { Registration } from './entities/Registration';
import { formGroups } from './algorithm/algorithm';
const app = express();
app.use(bodyParser.json())

const PORT = 3004 || process.env.PORT;

interface RequestParameters {
    groupSize: number,
    registrations: Registration[]
}

app.post("/", (req, res) => {
    console.log('yay')
    const data = req.body as RequestParameters;
    const formed = formGroups(data.groupSize, data.registrations);
    res.send(formed);
})

app.listen(PORT, () => {
    console.log(`Algorithm server running on port ${PORT}`)
})