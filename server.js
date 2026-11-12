const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 150 * 1024 * 1024 }, // 150 MB
});

const TOKEN = process.env.APPETIZE_API_TOKEN;

app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (_req, res) => res.send("ok"));

app.post("/upload", upload.single("apk"), async (req, res) => {
  try {
    if (!TOKEN) return res.status(500).json({ error: "APPETIZE_API_TOKEN is not set on the server." });
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });
    if (!/\.apk$/i.test(req.file.originalname)) return res.status(400).json({ error: "Please upload a .apk file." });

    const form = new FormData();
    form.append("file", new Blob([req.file.buffer]), req.file.originalname);
    form.append("platform", "android");

    const r = await fetch("https://api.appetize.io/v1/apps", {
      method: "POST",
      headers: { Authorization: "Basic " + Buffer.from(TOKEN + ":").toString("base64") },
      body: form,
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || !data.publicKey) {
      return res.status(502).json({ error: data.message || data.error || "Appetize upload failed (" + r.status + ")" });
    }
    res.json({ publicKey: data.publicKey });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log("APK player listening on " + port));
