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
