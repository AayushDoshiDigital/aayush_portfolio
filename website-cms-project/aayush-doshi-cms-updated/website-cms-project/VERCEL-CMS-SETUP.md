# Vercel + Decap CMS: fix and setup

## What was actually wrong (found by inspecting your repository)
Your repository (`AayushDoshiDigital/aayush_portfolio`) has the project inside the folder **`website-cms-project/`**.
The live site renders correctly, so Vercel already builds that folder with Eleventy. The CMS, however, had four problems:

1. **Wrong paths (main cause of the 404s).** Decap reads files through the GitHub API using paths from the *repository root*.
   The config said `src/blog`, `src/_data/site.json`, etc., but the files are at `website-cms-project/src/...`.
   GitHub answered "404 Not Found" for every collection. All paths now start with `website-cms-project/`.
2. **Placeholder repository.** `repo: YOUR-GITHUB-USERNAME/YOUR-REPO-NAME` is now `AayushDoshiDigital/aayush_portfolio`.
3. **No sign-in for Vercel.** Without `base_url`/`auth_endpoint`, Decap sends the login popup to Netlify's auth service, which
   only works for sites hosted on Netlify, so login failed on Vercel. Added two small server functions (`api/auth.js`, `api/callback.js`).
4. **Relative config path.** `/admin` (without a slash) made the browser look for `/config.yml`. `admin/index.html` now points to `/admin/config.yml` directly.

Also fixed: `site.json` still had `YOUR-SITE.netlify.app`, which made canonical links and the sitemap wrong.

## Files changed or added (all inside `website-cms-project/`)
| File | Change |
|---|---|
| `src/admin/config.yml` | repo, branch, paths, auth endpoint, site URL |
| `src/admin/index.html` | absolute config link, Decap `^3.17.0` |
| `src/_data/site.json` | `url` set to the Vercel address |
| `api/auth.js`, `api/callback.js`, `api/_lib.js` | **new**: GitHub sign-in for Vercel |
| `vercel.json` | **new**: build command, output folder, YAML headers |
| `scripts/verify-build.js` | **new**: fails the deploy if the CMS config is broken |
| `package.json`, `package-lock.json` | build runs the verify step; `js-yaml` added |
| `docs/config.turbo.example.yml` | **new**: optional Turbo config (inactive) |
| `SETUP-GUIDE.md`, `netlify.toml` | removed (Netlify-specific) |

## 1. Vercel project settings (check these)
- **Root Directory:** `website-cms-project` (it contains `package.json` and `eleventy.config.js`)
- **Framework Preset:** Other
- **Build Command:** `npm run build` · **Output Directory:** `_site` (also set in `vercel.json`)
- **Node.js version:** 20.x or newer
The folder `website-files/` is the old static copy. Vercel ignores it, and you can delete it from GitHub.

## 2. Create a GitHub OAuth App (one time)
GitHub, Settings, Developer settings, OAuth Apps, New OAuth App:
- Homepage URL: `https://aayush-portfolio-gold.vercel.app`
- Authorization callback URL: `https://aayush-portfolio-gold.vercel.app/api/callback`
Copy the **Client ID**, then click "Generate a new client secret" and copy it.

## 3. Add environment variables in Vercel
Project, Settings, Environment Variables (Production):
- `GITHUB_OAUTH_CLIENT_ID` = the Client ID
- `GITHUB_OAUTH_CLIENT_SECRET` = the secret (mark it Sensitive)
- Optional: `SITE_ORIGIN` = `https://aayush-portfolio-gold.vercel.app`
Then **redeploy**: environment variables only apply to new deployments.

## 4. Upload the changed files to GitHub
Replace the files above inside `website-cms-project/` (GitHub: Add file, Upload files, same folder paths; commit to `main`).
Vercel redeploys automatically.

## 5. Verify (in this order)
1. Open `https://aayush-portfolio-gold.vercel.app/admin/config.yml`. You must see text starting with `backend:`. If you see a web page, it is wrong.
2. Open `/admin/`. You should see **Login with GitHub**.
3. Log in with the GitHub account that owns the repository. You should see: Blog posts, Pages, Portfolio, Contact/images/links.
4. Blog posts, New Blog post: add a title, tick **Draft**, Publish. A new commit appears in `website-cms-project/src/blog/`.
5. Upload an image into a post. It lands in `website-cms-project/src/images/uploads/`.
6. Each save triggers a Vercel deploy (about 1 minute). Untick Draft to publish.
Every deploy also runs `scripts/verify-build.js`; if the CMS config is broken, the deploy fails with a clear message in the Vercel build log.

## Decap Turbo (optional alternative)
- Decap Turbo is generally available since Decap CMS **3.17.0**. The backend name is `turbo-github`. This project loads Decap `^3.17.0`.
- It needs a **Site ID (UUID) from the Turbo dashboard**. It cannot be generated or guessed; `docs/config.turbo.example.yml` has a placeholder only.
- Setup: create a Turbo account, install the Decap Turbo GitHub App on this repository, create a site (repository, branch `main`, admin URL), copy the Site ID, switch the `backend:` block.
- Benefits: editors can sign in without a GitHub account (invited by email), and no OAuth app, environment variables or `api/` functions to maintain.
- Check Turbo's current pricing and terms on its website before choosing it; I could not verify them.
- For a single owner, the included GitHub OAuth setup is simpler and has no extra service.

## Token and secret safety
- The client secret exists only as a Vercel environment variable; it is never in the repository or in any file sent to the browser.
- Decap's GitHub backend does give the signed-in editor's own access token to that editor's browser while logged in (required to commit). It is not stored in any file.
- Scope is `public_repo`. If you make the repository private, change `auth_scope` to `repo`.
- If a secret is ever exposed, generate a new client secret in GitHub and update the Vercel variable.

## If you still see a 404 or error
- `/admin/config.yml` is a web page: Root Directory is wrong or `src/admin` was not deployed; check the Vercel build log.
- Login popup says "Not Found" or never completes: check the callback URL in the GitHub OAuth App and the two environment variables, then redeploy.
- "Failed to load entries: Not Found": a path or `repo` is wrong. Paths must start with `website-cms-project/`.
- Config error "backend not found" with Turbo: Decap is older than 3.17.0.

## Creating new website pages in the CMS

The CMS now includes a **Website pages (create new pages)** collection. In `/admin/`, open that collection and choose **New Website page**. Fill in the page title, URL slug, SEO title/description, optional canonical URL, H1, intro, optional hero image and alt text, then write the page body using the Markdown editor. Save as a draft while preparing it, or publish it when ready. Published pages use the URL `/<slug>.html` and the shared responsive page layout.

The sample file `src/pages/example-new-page.md` is deliberately marked as a draft and is excluded from the generated website. It can be deleted from the CMS after setup. Existing fixed page settings remain in the separate **Existing page settings** collection.

To link a newly published page from the site's existing menus, open the **Navbar & footer links** settings in the CMS and add its URL (for example `/google-analytics-services.html`) to the relevant menu list. The new page is not automatically inserted into the navigation.
