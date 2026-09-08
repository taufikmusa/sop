---
name: trimble-github-pages
description: >
  Create a live GitHub Pages website end-to-end on the user's connected GitHub account — create or
  reuse a repository, push the HTML/CSS/JS files, enable GitHub Pages, then verify the URL is
  actually serving. Use this skill WHENEVER the user asks to "publish this to GitHub", "create a
  GitHub Pages site", "buat github pages", "host page ni", "put this online", "deploy to
  github.io", "make a repo and publish", "share this HTML as a link", or hands over a finished HTML
  page and asks where to put it. Also trigger when the user asks to update, re-publish, or add
  pages to a site that already lives on GitHub Pages. Works through the GitHub REST API using the
  connected GitHub account; falls back to a manual browser upload path when API writes are not
  permitted. Styling of the page itself is NOT this skill's job — pair it with `trimble-brand-style`
  (tokens), `trimble-mkdocs-site` (multi-page docs) or `trimble-html-presentation` (slide deck) and
  let this skill do only the repo + publish + verify.
---

# GitHub Pages Publisher

One job: take files that already exist (or that another skill just produced) and make them live at
a `https://<owner>.github.io/<repo>/` URL — on the user's own GitHub account, not a third-party host.

Four steps, in order, and **none of them may be skipped or assumed**:

1. **Identify** the account and decide personal vs. organisation.
2. **Create or reuse** the repository.
3. **Push** the files.
4. **Enable Pages, then verify the live URL responds.**

Reporting "it's published" without step 4 passing is the single most common failure of this task.
GitHub Pages returns 404 for a good ten minutes after the first build, and a repo can look perfect
while Pages was never switched on at all. Always verify.

---

## Step 0 — Preconditions (check these before promising anything)

| Check | How | If it fails |
|---|---|---|
| GitHub is connected | `GET /user` → returns a `login` | Ask the user to connect the GitHub connector, then stop |
| Who owns the site | `GET /user` gives the personal login; `GET /user/orgs` lists organisations | Ask which one — never guess |
| Token can write | See scope table below | Use the **manual fallback** at the bottom |
| Repo will be public | Pages on a **private** repo needs GitHub Pro / Team / Enterprise | Tell the user; offer public repo or a different host |

### Token scopes required

| Token type | Needs |
|---|---|
| Classic PAT | `repo` (whole scope). `workflow` only if the site uses GitHub Actions |
| Fine-grained PAT | Repository permissions → **Administration: Read & write**, **Contents: Read & write**, **Pages: Read & write** |
| Connector / OAuth app | The app must have been granted repo write **and** Pages write for that account or org |

`Pages: Read & write` is the one people forget. Without it, steps 1–3 succeed, step 4 returns
`403` and the site never goes live.

---

## Step 1 — Create or reuse the repository

Ask (or confirm) three things first: **owner**, **repo name**, **public or private**. Do not invent
a repo name from thin air — propose one and get a yes.

**Naming rule that changes the final URL:**

| Repo name | Live URL |
|---|---|
| `<login>.github.io` (e.g. `taufiktrimble.github.io`) | `https://taufiktrimble.github.io/` — the root site, one per account |
| Anything else (e.g. `tekla-guide`) | `https://taufiktrimble.github.io/tekla-guide/` — a project site, unlimited |

Default to a **project site** unless the user explicitly wants the root domain. Root sites are a
single scarce slot; burning it on a one-off page is a mistake that is annoying to undo.

Create it:

```http
POST /user/repos                      # personal account
POST /orgs/{org}/repos                # organisation
Content-Type: application/json

{
  "name": "tekla-guide",
  "description": "Short one-line description",
  "private": false,
  "auto_init": true,
  "homepage": "https://taufiktrimble.github.io/tekla-guide/"
}
```

`auto_init: true` matters — it creates the first commit and the `main` branch. Without it the repo
has no branch, and both the Contents API and the Pages API will reject everything you send next.

Reusing an existing repo instead: `GET /repos/{owner}/{repo}` to confirm it exists and read
`default_branch` — do not assume `main`, older repos are on `master`. Use whatever that field says
for every call after this.

`422 name already exists` is not an error to work around by renaming silently. Tell the user the
name is taken and ask: reuse it, or pick another.

---

## Step 2 — Push the files

### One or two files → Contents API

```http
PUT /repos/{owner}/{repo}/contents/index.html
{
  "message": "Add landing page",
  "content": "<base64 of the file bytes>",
  "branch": "main"
}
```

Updating a file that already exists requires its blob `sha`: `GET
/repos/{owner}/{repo}/contents/index.html?ref=main`, take `.sha`, include it in the `PUT`. Omitting
the sha on an existing path returns `422`.

### Three or more files → Git Data API, one commit

Do not loop the Contents API over twenty files. That is twenty commits, twenty Pages rebuilds, and
a rate-limit wall. Build one tree, one commit:

```
POST   /repos/{o}/{r}/git/blobs          {"content": "<base64>", "encoding": "base64"}   → blob sha, per file
GET    /repos/{o}/{r}/git/ref/heads/main                                                 → .object.sha  (parent)
GET    /repos/{o}/{r}/git/commits/{parent}                                               → .tree.sha    (base tree)
POST   /repos/{o}/{r}/git/trees          {"base_tree": "<base tree>", "tree": [ {"path":"index.html","mode":"100644","type":"blob","sha":"<blob>"}, ... ] }
POST   /repos/{o}/{r}/git/commits        {"message": "Publish site", "tree": "<new tree>", "parents": ["<parent>"]}
PATCH  /repos/{o}/{r}/git/refs/heads/main {"sha": "<new commit>"}
```

Full copy-paste payloads live in `references/api-recipes.md`.

No page written yet? `assets/starter/index.html` is a blank Trimble-branded single-file page
(Trimble Blue `#0063A3`, Open Sans, note/warning boxes, all-relative paths) plus the empty
`.nojekyll` beside it. Use it as the starting point, not as the finished site — replace the
placeholder copy before pushing.

### File rules that decide whether the site works

- **`index.html` must sit at the publish root.** No `index.html` at the root → GitHub serves a 404
  page even though the build succeeded. This is the #1 cause of "it deployed but I get 404".
- **Add an empty `.nojekyll` at the root.** Without it, Jekyll processes the site and silently drops
  every file and folder whose name starts with `_` (`_assets`, `_next`, …). One empty file, saves an
  hour of confusion.
- **Relative paths only.** `href="assets/kb.css"`, never `href="/assets/kb.css"`. On a project site
  everything lives under `/<repo>/`, so a leading slash points at the wrong place and the CSS
  silently never loads.
- **Case is significant.** `Assets/Logo.PNG` ≠ `assets/logo.png`. It works on the user's Windows
  machine and breaks on Pages.
- Binary assets (png, jpg, woff2, pdf) must be base64-encoded blobs — never paste them as text.

---

## Step 3 — Enable GitHub Pages

```http
POST /repos/{owner}/{repo}/pages
Accept: application/vnd.github+json

{ "source": { "branch": "main", "path": "/" } }
```

- `201` → enabled.
- `409` → Pages was already enabled. Not a failure. Change the source with `PUT
  /repos/{owner}/{repo}/pages` using the same body shape, or just carry on to verification.
- `403` → the token lacks Pages write. Go to the manual fallback; do not retry the same call.

`path` may only be `"/"` or `"/docs"`. Anything else is rejected. If the site's files live in some
other subfolder, move them to the root or to `docs/` — there is no third option on the branch
source.

Building from a GitHub Actions workflow instead (MkDocs, Vite, Next.js) uses
`{"build_type": "workflow"}` and a workflow file — see `references/api-recipes.md`. For plain HTML,
branch source is correct and simpler.

---

## Step 4 — Verify (mandatory)

```
GET /repos/{owner}/{repo}/pages               → .status = "built", .html_url
GET /repos/{owner}/{repo}/pages/builds/latest → .status, .error.message
```

Then actually fetch `html_url` and confirm HTTP 200 with real content — not just that the API says
`built`.

First build takes **1–10 minutes**. Poll a few times with a sensible gap; do not hammer it every
two seconds, and do not declare failure at minute one. If it is still not live after ten minutes,
read `.error.message` from the latest build and work the troubleshooting table in
`references/troubleshooting.md` — it maps every common symptom (404, missing CSS, stale content,
`403` on Pages, org policy blocks) to its actual cause.

Report to the user, in this shape:

```
Live:  https://taufiktrimble.github.io/tekla-guide/
Repo:  https://github.com/taufiktrimble/tekla-guide
Build: built (verified 200)
```

If verification did not pass, say exactly that and say what is still pending. Never round "the API
accepted my request" up to "your site is live".

---

## Updating a site that already exists

Same flow, minus repo creation and minus Pages enabling. Push the changed files (with their `sha`),
then wait out the rebuild — every push to the publish branch triggers one automatically. Tell the
user the change is live only after re-fetching the URL. Browser caching bites here: suggest a hard
refresh before they report "it didn't change".

---

## Manual fallback — when the token cannot write

Not a defeat. Produce the files, hand them over, and give exactly these steps. Keep it this short;
extra detail is what makes people give up.

1. github.com → **New repository** → name it, **Public**, tick **Add a README file** → Create.
2. On the repo page → **Add file ▾ → Upload files** → drag the whole folder in → **Commit changes**.
3. **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` →
   **Save**.
4. Wait 1–2 minutes, refresh that same Settings → Pages screen. The live URL appears in a green box
   at the top.

Tell them the URL they will get before they start (`https://<login>.github.io/<repo>/`) so they know
what they are waiting for. The fuller click-by-click version, including the two files people always
miss, is in `references/manual-setup.md` — paste it to them rather than retyping it.

---

## Scope — what this skill does not do

- **It does not design the page.** Styling comes from `trimble-brand-style`; multi-page docs from
  `trimble-mkdocs-site`; slide decks from `trimble-html-presentation`. This skill publishes what
  those produce.
- **It does not touch a repo the user did not name.** Never push to, rename, or delete a repository
  outside the one agreed in Step 1.
- **It does not make a private repo public** to get around the Pages plan limitation. Raise it, let
  the user decide.
- **It does not publish anything with secrets in it.** Scan the files for API keys, tokens,
  passwords, internal hostnames or personal data before pushing. A GitHub Pages site is public to
  the whole internet and gets indexed by search engines within days. Anything committed stays in the
  git history even after deletion.

---

## QA checklist before reporting done

- [ ] Owner and repo name were confirmed by the user, not guessed
- [ ] Repo is public (or the user knowingly accepted a paid-plan private site)
- [ ] `index.html` exists at the publish root
- [ ] `.nojekyll` exists at the root
- [ ] All internal links, CSS, JS and image paths are relative — no leading `/`
- [ ] No secrets, tokens or personal data in any pushed file
- [ ] `GET /pages` reports `status: built`
- [ ] The live URL was actually fetched and returned 200 with the expected content
- [ ] The user was given both the live URL and the repo URL
