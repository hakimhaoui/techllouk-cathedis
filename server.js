import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Techllouk Cathedis API running ✅");
});

app.get("/track", (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ ok: false, error: "code is required" });
  }

  res.json({
    ok: true,
    code,
    message: "Received code successfully",
  });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
