// Runs after the Eleventy build (and therefore during every Vercel deploy).
// It fails the build if the CMS would be broken, so a bad config never goes live silently.
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const REPO_PREFIX = "website-cms-project/"; // folder of this project inside the GitHub repository
const SITE = "_site";
const errors = [];
const need = (cond, msg) => { if (!cond) errors.push(msg); };

const cfgPath = path.join(SITE, "admin", "config.yml");
const idxPath = path.join(SITE, "admin", "index.html");
need(fs.existsSync(idxPath), `${idxPath} is missing`);
need(fs.existsSync(cfgPath), `${cfgPath} is missing`);

if (fs.existsSync(cfgPath)) {
  const raw = fs.readFileSync(cfgPath, "utf8");
  need(!/^\s*<(!doctype|html)/i.test(raw), "admin/config.yml contains HTML, not YAML");
  let cfg;
  try { cfg = yaml.load(raw); } catch (e) { errors.push("admin/config.yml is not valid YAML: " + e.message); }
  if (cfg && typeof cfg === "object") {
    const b = cfg.backend || {};
    need(["github", "turbo-github"].includes(b.name), `backend.name must be github or turbo-github (found ${b.name})`);
    need(/^[\w.-]+\/[\w.-]+$/.test(b.repo || "") && !/YOUR-/i.test(b.repo || ""), `backend.repo looks wrong: ${b.repo}`);
    need(!!b.branch, "backend.branch is missing");
    if (b.name === "turbo-github") need(/^[0-9a-f-]{36}$/i.test(b.turbo_site_id || ""), "turbo_site_id must be the real UUID from the Turbo dashboard");
    if (b.name === "github") need(!!b.auth_endpoint && !!b.base_url, "github backend needs base_url and auth_endpoint when not hosted on Netlify");
    need(!/YOUR-|netlify\.app/i.test(raw), "config.yml still contains a placeholder or Netlify URL");
    const inRepo = (p) => path.join(".", p.startsWith(REPO_PREFIX) ? p.slice(REPO_PREFIX.length) : "__outside__/" + p);
    const paths = [cfg.media_folder];
    (cfg.collections || []).forEach((c) => { if (c.folder) paths.push(c.folder); (c.files || []).forEach((f) => paths.push(f.file)); });
    paths.filter(Boolean).forEach((p) => {
      need(p.startsWith(REPO_PREFIX), `CMS path must start with "${REPO_PREFIX}": ${p}`);
      const local = inRepo(p);
      if (p === cfg.media_folder) fs.mkdirSync(local, { recursive: true });
      need(fs.existsSync(local), `CMS path does not exist in the project: ${p}`);
    });
  }
}
const site = JSON.parse(fs.readFileSync("src/_data/site.json", "utf8"));
need(!/YOUR-SITE/i.test(site.url), "src/_data/site.json still has a placeholder website address");

if (errors.length) {
  console.error("\n[verify-build] CMS check FAILED:\n - " + errors.join("\n - ") + "\n");
  process.exit(1);
}
console.log("[verify-build] OK: _site/admin/config.yml is valid YAML and every CMS path exists.");
