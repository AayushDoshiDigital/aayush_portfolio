// Shared helpers for the GitHub OAuth endpoints used by Decap CMS on Vercel.
// Files starting with "_" are not exposed as routes by Vercel.
const DEFAULT_ORIGIN = "https://aayush-portfolio-gold.vercel.app";

function siteOrigin(req) {
  if (process.env.SITE_ORIGIN) return process.env.SITE_ORIGIN.replace(/\/$/, "");
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return host ? `https://${host}` : DEFAULT_ORIGIN;
}

function parseCookies(req) {
  const out = {};
  String(req.headers.cookie || "").split(";").forEach((part) => {
    const i = part.indexOf("=");
    if (i > -1) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

const STATE_COOKIE = "decap_oauth_state";

module.exports = { siteOrigin, parseCookies, STATE_COOKIE };
