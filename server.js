import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Techllouk Tracking API OK ✅");
});

app.get("/track", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({
      ok: false,
      error: "Missing code",
      example: "/track?code=XXXX"
    });
  }

  return res.json({
    ok: true,
    code,
    message: "Received code successfully"
  });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
