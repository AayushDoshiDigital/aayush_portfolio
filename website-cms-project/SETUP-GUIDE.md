# Website + Dashboard: Setup Guide (Gujarati-English)

Aa project ma tamari website ane ek dashboard (`/admin`) chhe. Dashboard thi tame blogs, meta data (SEO title/description), images, content ane internal links badli shako. Badhu **free** chhe.

> Dhyan: Aa guide ma Netlify ane GitHub na button na naam thodaak alag hoi shake (e loko vakhatovakhat screen badle chhe). Jo koi naam na male, to aajubaju na option jovo.

## Dashboard kevi rite kaam kare chhe
1. Tame dashboard ma badlav karo ane **Publish** dabavo.
2. Badlav GitHub ma save thay chhe.
3. Netlify automatically website fari banave chhe. **1 thi 2 minute** ma badlav live thay chhe.

## Part A: Free accounts banavo (ek var)
- **GitHub:** github.com par sign up karo.
- **Netlify:** netlify.com par sign up karo. "Sign up with GitHub" vaparo to saru.

## Part B: Project GitHub par mukvo
1. GitHub ma **New repository** banavo. Naam: `aayush-website`. **Private** rakhi shako.
2. `website-cms-project.zip` unzip karo.
3. Repository ma **"uploading an existing file"** par click karo.
4. Unzip karela folder ni **andar ni badhi files ane folders** (`src`, `package.json`, `netlify.toml`, `eleventy.config.js`, `.gitignore`, ...) drag-drop karo. (Folder pote nahi, ena andar nu.)
5. **Commit changes** dabavo.

## Part C: Netlify par live karo
1. Netlify ma **Add new site → Import an existing project → GitHub** par jao.
2. `aayush-website` repository pasand karo.
3. Build settings automatic aavi jashe (`netlify.toml` mathi). **Deploy** dabavo.
4. 1-2 minute ma tamne link malshe, jem ke `xxxx.netlify.app`. Site configuration ma "Change site name" thi naam badli shako.

## Part D: Dashboard ni config ma tamaru repository lakho
1. GitHub ma `src/admin/config.yml` file kholo ane pencil (edit) dabavo.
2. Aa line shodho: `repo: YOUR-GITHUB-USERNAME/YOUR-REPO-NAME`
3. Ene tamara GitHub username/repo thi badlo, jem ke `aayushdoshi/aayush-website`. Commit karo.

## Part E: Dashboard login chalu karo (ek var)
Dashboard GitHub thi login thay chhe. Ena mate:
1. GitHub: **Settings → Developer settings → OAuth Apps → New OAuth App**.
   - Homepage URL: tamari Netlify site no link.
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Banavya pachhi **Client ID** ane navo **Client secret** copy karo.
2. Netlify: tamari site → **Site configuration → Access & security → OAuth** → **Install provider** → **GitHub** → Client ID ane secret paste karo.
3. Browser ma `tamari-site.netlify.app/admin/` kholo → **Login with GitHub**.

## Part F: Pehlo kaam (website address)
Dashboard ma **Contact, images & links → Contact details, logo & photos** kholo ane **Website address** ma tamaro Netlify link lakho (jem ke `https://aayushdoshi.netlify.app`). Aa canonical links ane sitemap mate jaruri chhe. Pachhi Publish karo.

## Dashboard ma shu shu badli shakay
| Section | Shu badlavi shako |
|---|---|
| **Blog posts** | Navo article lakho: title, meta description, featured image, article (heading, lists, links, images), related pages (internal links), draft/publish. |
| **Pages (SEO & content)** | Dareke page nu SEO title ane meta description, main heading (yellow shabd mate `<em>shabd</em>`), intro text, button text, section headings/intro text, FAQs. |
| **Portfolio** | Client names ane **logos**, ane **screenshots** (upload karo, caption lakho). |
| **Contact, images & links** | Email, phone, WhatsApp, LinkedIn, logo, tamaro photo. **Navbar ane footer ni links** (internal linking), dropdown menu. |

**Blogs:** Dashboard ma "Blog posts → New Blog post" thi navo article lakho. Publish karo etle `/blog/` page, homepage ni "Latest Insights" ane sitemap ma automatically aavi jashe. "Draft" tick karelo post website par nahi dekhay.

## Je dashboard thi nathi badlatu (haju)
- Cards ni andar ni text (jem ke "Why SEO Is Important" na 6 points, service cards, process steps, comparison cards).
- Icons, colours ane layout.
Aa mate mane kehjo, hu ene pan dashboard ma ume dais.

## Koi problem aave to
- **Login na thay:** Part E ni callback URL (`https://api.netlify.com/auth/done`) ane Part D no `repo` barabar chhe ke nahi check karo.
- **Badlav site par nathi dekhato:** Netlify ma **Deploys** tab ma jao. Build chalti hoy to 2 minute raah juo. Fail thay to log ma error vanchvo.
- **Browser cache:** Ctrl+F5 dabavo.

## Computer par test karvu hoy (optional)
Node.js install karo, folder ma `npm install` ane `npm start` chalavo. Website `http://localhost:8080` par khulshe.
