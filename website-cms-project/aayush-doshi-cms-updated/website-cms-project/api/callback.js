// Step 2: GitHub sends the editor back here with a one-time code. The client secret stays on the
// server (Vercel environment variable) and is never sent to the browser.
const { siteOrigin, parseCookies, STATE_COOKIE } = require("./_lib");

function page(res, origin, message) {
  const msg = JSON.stringify(message).replace(/</g, "\\u003c");
  const org = JSON.stringify(origin).replace(/</g, "\\u003c");
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Set-Cookie", `${STATE_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=0`);
  res.end(`<!doctype html><meta charset="utf-8"><title>Signing in…</title><p>Signing in… you can close this window.</p>
<script>
(function () {
  var ORIGIN = ${org}, MSG = ${msg};
  function receive(e) {
    if (e.origin !== ORIGIN) return;
    window.opener.postMessage(MSG, e.origin);
    window.removeEventListener("message", receive, false);
  }
  window.addEventListener("message", receive, false);
  if (window.opener) window.opener.postMessage("authorizing:github", ORIGIN);
})();
</script>`);
}

const fail = (res, origin, text) =>
  page(res, origin, "authorization:github:error:" + JSON.stringify({ message: text }));

module.exports = async (req, res) => {
  const origin = siteOrigin(req);
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) return fail(res, origin, "OAuth is not configured on the server.");

  const url = new URL(req.url, "https://placeholder.invalid");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const saved = parseCookies(req)[STATE_COOKIE];
  if (!code || !state || !saved || state !== saved) return fail(res, origin, "Sign-in check failed. Please try again.");

  try {
    const r = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: `${origin}/api/callback` }),
    });
    const data = await r.json();
    if (!data.access_token) return fail(res, origin, data.error_description || "GitHub did not return a token.");
    return page(res, origin, "authorization:github:success:" + JSON.stringify({ token: data.access_token, provider: "github" }));
  } catch (e) {
    return fail(res, origin, "Could not reach GitHub. Please try again.");
  }
};
