import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Techllouk Tracking API OK ✅");
});

app.get("/track", (req, res) => {
  res.json({
    ok: true,
    message: "Tracking endpoint working",
    example: "Use /track?code=XXXX"
  });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
