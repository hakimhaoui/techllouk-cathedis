import express from "express";

const app = express();
app.use(express.json());

const API_URL = process.env.CATHEDIS_API_URL;      // مثال: https://xxxxx
const USER = process.env.CATHEDIS_USERNAME;        // TECHLLOUK1
const PASS = process.env.CATHEDIS_PASSWORD;        // Store.ca()

async function cathedisLogin() {
  const res = await fetch(`${API_URL}/login.jsp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USER, password: PASS }),
  });

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status}`);
  }

  // ناخدو JSESSIONID من Set-Cookie
  const setCookie = res.headers.get("set-cookie") || "";
  const jsess = setCookie.split(";")[0]; // "JSESSIONID=...."
  if (!jsess.startsWith("JSESSIONID=")) {
    throw new Error("No JSESSIONID cookie received");
  }
  return jsess;
}

async function cathedisAction(cookie, action, data) {
  const res = await fetch(`${API_URL}/ws/action`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": cookie,
    },
    body: JSON.stringify({ action, data }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Action ${action} failed: ${res.status}`);
  return json;
}

// test root
app.get("/", (req, res) => {
  res.send("Techllouk Cathedis API running ✅");
});

// TRACK endpoint
app.get("/track", async (req, res) => {
  try {
    const code = String(req.query.code || "").trim();
    if (!code) return res.status(400).json({ ok: false, error: "Missing ?code=" });

    const cookie = await cathedisLogin();

    // 1) نجيب لائحة آخر 40 colis (delivery.api.my)
    const list = await cathedisAction(cookie, "delivery.api.my", {
      context: { limit: 40, offset: 0 }
    });

    // هنا خاصنا نلقاو delivery_id اللي كيربط ب code
    // غالبا code كيبان فشي field بحال nomOrder / subject / id / importId...
    const deliveries = list?.data?.[0]?.values?.data || list?.data || [];
    const found = deliveries.find(d =>
      String(d?.id) === code ||
      String(d?.nomOrder || "").includes(code) ||
      String(d?.subject || "").includes(code) ||
      String(d?.importId || "").includes(code)
    );

    if (!found?.id) {
      return res.status(404).json({
        ok: false,
        code,
        error: "Not found in last 40 deliveries. (Need search endpoint or bigger list)"
      });
    }

    const delivery_id = found.id;

    // 2) نجيب historique (delivery.api.logs)
    const logs = await cathedisAction(cookie, "delivery.api.logs", {
      context: { id: String(delivery_id) }
    });

    return res.json({
      ok: true,
      code,
      delivery_id,
      delivery: found,
      logs
    });

  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
