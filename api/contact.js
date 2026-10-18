// Contact form handler. Sends every submission to Kas@drkashenry.com via Resend.
// Required env var on Vercel: RESEND_API_KEY. Optional: FROM_EMAIL (defaults to a Resend onboarding sender until drkashenry.com is verified in Resend).
const TO = "Kas@drkashenry.com";

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};
  const clean = (v, n = 2000) => String(v || "").trim().slice(0, n);
  const name = clean(body.name, 120), email = clean(body.email, 200), organization = clean(body.organization, 200);
  const topic = clean(body.topic, 80), message = clean(body.message, 5000);
  if (body.website) return res.status(200).json({ ok: true }); // honeypot
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) return res.status(400).json({ ok: false, error: "Missing fields" });
  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(500).json({ ok: false, error: "Mail not configured" });
  const from = process.env.FROM_EMAIL || "Dr. Kas Henry Website <onboarding@resend.dev>";
  const esc = s => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const html = `<p><b>Name:</b> ${esc(name)}<br><b>Email:</b> ${esc(email)}<br><b>Organization:</b> ${esc(organization) || "—"}<br><b>Topic:</b> ${esc(topic) || "—"}</p><p style="white-space:pre-wrap">${esc(message)}</p><p style="color:#777;font-size:12px">Sent from drkashenry.com</p>`;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [TO], reply_to: email, subject: `[drkashenry.com] ${topic || "New inquiry"} from ${name}`, html })
  });
  if (!r.ok) return res.status(502).json({ ok: false, error: "Mail provider error" });
  return res.status(200).json({ ok: true });
};
