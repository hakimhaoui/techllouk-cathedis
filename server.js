import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Techllouk Cathedis API running");
});

app.listen(3000);
