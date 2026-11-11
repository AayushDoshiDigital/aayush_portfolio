// Step 1: Decap CMS opens this URL in a popup. We send the editor to GitHub to sign in.
const crypto = require("crypto");
const { siteOrigin, STATE_COOKIE } = require("./_lib");

const ALLOWED_SCOPES = ["public_repo", "repo", "public_repo,user", "repo,user"];

module.exports = (req, res) => {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    return res.end("GITHUB_OAUTH_CLIENT_ID is not set in the Vercel environment variables.");
  }
  const url = new URL(req.url, "https://placeholder.invalid");
  const asked = url.searchParams.get("scope");
  const scope = ALLOWED_SCOPES.includes(asked) ? asked : process.env.GITHUB_OAUTH_SCOPE || "public_repo";
  const state = crypto.randomBytes(16).toString("hex");
  const redirect = new URL("https://github.com/login/oauth/authorize");
  redirect.searchParams.set("client_id", clientId);
  redirect.searchParams.set("redirect_uri", `${siteOrigin(req)}/api/callback`);
  redirect.searchParams.set("scope", scope);
  redirect.searchParams.set("state", state);
  res.setHeader("Set-Cookie", `${STATE_COOKIE}=${state}; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=600`);
  res.setHeader("Cache-Control", "no-store");
  res.statusCode = 302;
  res.setHeader("Location", redirect.toString());
  res.end();
};
