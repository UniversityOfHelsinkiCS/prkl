import express from 'express';
const app = express();

const PORT = 3004 || process.env.PORT;

app.get("/ping", (_req, res) => {
    res.send("pong");
})

app.listen(PORT, () => {
    console.log(`Algorithm server running on port ${PORT}`)
})