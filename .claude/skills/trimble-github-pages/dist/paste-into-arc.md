# GitHub Pages Publisher

Take files that already exist — or that another skill just produced — and make them live at a
`https://<owner>.github.io/<repo>/` URL on the user's own connected GitHub account.

Four steps, in order. None may be skipped or assumed:

1. Identify the account, personal vs. organisation.
2. Create or reuse the repository.
3. Push the files.
4. Enable Pages, then verify the live URL actually responds.

Reporting "it's published" without step 4 passing is the most common failure of this task. GitHub
Pages returns 404 for up to ten minutes after a first build, and a repo can look perfect while Pages
was never switched on at all. Always verify by fetching the URL.

All API calls below use base `https://api.github.com` with these headers:

```
Authorization: Bearer <token>
Accept: application/vnd.github+json
X-GitHub-Api-Version: 2022-11-28
```

---

## Step 0 — Preconditions

| Check | How | If it fails |
|---|---|---|
| GitHub is connected | `GET /user` returns a `login` | Ask the user to connect GitHub, then stop |
| Who owns the site | `GET /user` for the personal login, `GET /user/orgs` for organisations | Ask which one — never guess |
| Plan allows it | `GET /user` → `.plan.name` | Pages on a **private** repo needs Pro/Team/Enterprise. On `free`, the repo must be public |
| Token can write | See the scope table | Use the manual fallback near the end |

### Token scopes

| Token type | Needs |
|---|---|
| Classic PAT | `repo` (whole scope). Add `workflow` only if pushing files under `.github/workflows/` |
| Fine-grained PAT | Repository permissions → **Administration: Read & write**, **Contents: Read & write**, **Pages: Read & write** |
| Connector / OAuth app | Must be granted repo write **and** Pages write for that account or org |

`Pages: Read & write` is the one people forget. Without it, steps 1–3 succeed, step 4 returns 403,
and the site never goes live. Practical shortcut: if Pages is enabled once by hand, every later push
rebuilds automatically and only `Contents: write` is needed from then on.

---

## Step 1 — Create or reuse the repository

Confirm three things with the user before any call: **owner**, **repo name**, **public or private**.
Propose a name and get a yes — never invent one silently.

Naming decides the final URL:

| Repo name | Live URL |
|---|---|
| `<login>.github.io` | `https://<login>.github.io/` — the root site, one per account |
| anything else | `https://<login>.github.io/<repo>/` — a project site, unlimited |

Default to a project site unless the user explicitly wants the root domain. The root site is a
single scarce slot and is annoying to reclaim once used.

Create it — personal account:

```bash
curl -sS -X POST https://api.github.com/user/repos \
  -H "Authorization: Bearer $GH" -H "Accept: application/vnd.github+json" \
  -d '{
    "name": "my-site",
    "description": "One-line description",
    "private": false,
    "auto_init": true,
    "homepage": "https://OWNER.github.io/my-site/"
  }'
```

Organisation — identical body, different path: `POST https://api.github.com/orgs/ORGNAME/repos`.

`auto_init: true` matters. It creates the first commit and the `main` branch. Without a branch, both
the Contents API and the Pages API reject everything sent afterwards.

Reusing an existing repo: `GET /repos/OWNER/REPO` and read `.default_branch` — do not assume `main`,
older repos are on `master`. Use that value for every later call.

`422 name already exists` is not something to route around by renaming silently. Tell the user the
name is taken and ask: reuse it, or pick another.

---

## Step 2 — Push the files

### One or two files — Contents API

New file:

```bash
CONTENT=$(base64 -w0 index.html)
curl -sS -X PUT https://api.github.com/repos/OWNER/REPO/contents/index.html \
  -H "Authorization: Bearer $GH" \
  -d "{\"message\":\"Add landing page\",\"content\":\"$CONTENT\",\"branch\":\"main\"}"
```

Updating a file that already exists needs its blob sha, or the call returns 422:

```bash
SHA=$(curl -sS -H "Authorization: Bearer $GH" \
  "https://api.github.com/repos/OWNER/REPO/contents/index.html?ref=main" | jq -r '.sha')
curl -sS -X PUT https://api.github.com/repos/OWNER/REPO/contents/index.html \
  -H "Authorization: Bearer $GH" \
  -d "{\"message\":\"Update page\",\"content\":\"$CONTENT\",\"sha\":\"$SHA\",\"branch\":\"main\"}"
```

The empty `.nojekyll` file in one line — `""` is valid base64 for an empty file:

```bash
curl -sS -X PUT https://api.github.com/repos/OWNER/REPO/contents/.nojekyll \
  -H "Authorization: Bearer $GH" \
  -d '{"message":"Disable Jekyll","content":"","branch":"main"}'
```

### Three or more files — Git Data API, one commit

Never loop the Contents API over twenty files. That is twenty commits, twenty Pages rebuilds and a
rate-limit wall. Build one tree, one commit:

```bash
O=OWNER; R=REPO; B=main; API=https://api.github.com/repos/$O/$R
H=(-H "Authorization: Bearer $GH" -H "Accept: application/vnd.github+json")

# 1. one blob per file
blob() { curl -sS -X POST "${H[@]}" $API/git/blobs \
  -d "{\"content\":\"$(base64 -w0 "$1")\",\"encoding\":\"base64\"}" | jq -r .sha; }
SHA_INDEX=$(blob index.html)
SHA_CSS=$(blob assets/style.css)

# 2. current tip and its tree
PARENT=$(curl -sS "${H[@]}" $API/git/ref/heads/$B | jq -r .object.sha)
BASE=$(curl -sS "${H[@]}" $API/git/commits/$PARENT | jq -r .tree.sha)

# 3. new tree
TREE=$(curl -sS -X POST "${H[@]}" $API/git/trees -d "{
  \"base_tree\": \"$BASE\",
  \"tree\": [
    {\"path\":\"index.html\",      \"mode\":\"100644\",\"type\":\"blob\",\"sha\":\"$SHA_INDEX\"},
    {\"path\":\"assets/style.css\",\"mode\":\"100644\",\"type\":\"blob\",\"sha\":\"$SHA_CSS\"}
  ]}" | jq -r .sha)

# 4. commit
COMMIT=$(curl -sS -X POST "${H[@]}" $API/git/commits \
  -d "{\"message\":\"Publish site\",\"tree\":\"$TREE\",\"parents\":[\"$PARENT\"]}" | jq -r .sha)

# 5. move the branch
curl -sS -X PATCH "${H[@]}" $API/git/refs/heads/$B -d "{\"sha\":\"$COMMIT\"}"
```

Folders are implied by `path` — there is no "create directory" call. `mode` is `100644` for a normal
file, `100755` for an executable. To delete a path in the same commit, pass
`{"path":"old.html","mode":"100644","type":"blob","sha":null}`.

### File rules that decide whether the site works

- **`index.html` must sit at the publish root.** No root `index.html` means a 404 even though the
  build succeeded. This is the number one cause of "it deployed but I get 404".
- **Add an empty `.nojekyll` at the root.** Without it, Jekyll runs and silently drops every file and
  folder whose name starts with `_` (`_assets`, `_next`). One empty file saves an hour.
- **Relative paths only.** `href="assets/style.css"`, never `href="/assets/style.css"`. On a project
  site everything is served under `/<repo>/`, so a leading slash points somewhere that does not
  exist and the CSS silently never loads.
- **Case is significant.** `Assets/Logo.PNG` is not `assets/logo.png`. Works on the user's Windows
  machine, breaks on Pages.
- Binary assets (png, jpg, woff2, pdf) must be base64-encoded blobs, never pasted as text.

---

## Step 3 — Enable GitHub Pages

```bash
curl -sS -X POST https://api.github.com/repos/OWNER/REPO/pages \
  -H "Authorization: Bearer $GH" -H "Accept: application/vnd.github+json" \
  -d '{"source":{"branch":"main","path":"/"}}'
```

| Code | Meaning | Do |
|---|---|---|
| 201 | Enabled | Continue to verification |
| 409 | Already enabled | Not a failure — continue, or change the source with `PUT` |
| 403 | Token lacks Pages write, or an org policy blocks it | Manual fallback; do not retry the same call |
| 404 | Wrong owner/repo, or no read access | Re-check the path |
| 422 | `path` is not `/` or `/docs` | Move the files |

`path` may only be `"/"` or `"/docs"`. If the site lives in another subfolder, move it to the root or
to `docs/` — there is no third option on a branch source.

Change the source later:

```bash
curl -sS -X PUT https://api.github.com/repos/OWNER/REPO/pages \
  -H "Authorization: Bearer $GH" -d '{"source":{"branch":"main","path":"/docs"}}'
```

Building from a GitHub Actions workflow instead (MkDocs, Vite, Next.js):

```bash
curl -sS -X PUT https://api.github.com/repos/OWNER/REPO/pages \
  -H "Authorization: Bearer $GH" -d '{"build_type":"workflow"}'
```

Then push `.github/workflows/pages.yml` using `actions/upload-pages-artifact` and
`actions/deploy-pages`, with `permissions: {pages: write, id-token: write}`. Pushing a file under
`.github/workflows/` requires the `workflow` scope. For plain HTML, the branch source is correct and
simpler — do not reach for Actions without a build step to run.

---

## Step 4 — Verify (mandatory)

```bash
curl -sS -H "Authorization: Bearer $GH" \
  https://api.github.com/repos/OWNER/REPO/pages | jq '{status, html_url, source}'

curl -sS -H "Authorization: Bearer $GH" \
  https://api.github.com/repos/OWNER/REPO/pages/builds/latest | jq '{status, error}'

curl -sS -o /dev/null -w '%{http_code}\n' https://OWNER.github.io/REPO/
```

`status` runs `null` → `building` → `built`, or `errored`. Poll roughly every 20–30 seconds for up to
ten minutes. Do not hammer it every two seconds and do not declare failure at minute one. The final
`curl` returning `200` is the only proof that counts — an API saying `built` is not enough.

Report back in this shape:

```
Live:  https://OWNER.github.io/REPO/
Repo:  https://github.com/OWNER/REPO
Build: built (verified 200)
```

If verification did not pass, say exactly that and what is still pending. Never round "the API
accepted my request" up to "your site is live".

---

## Updating a site that already exists

Same flow without repo creation and without enabling Pages. Push the changed files with their `sha`,
then wait out the rebuild — every push to the publish branch triggers one automatically. Confirm the
change is live only after re-fetching the URL. Browser caching bites here: tell the user to hard
refresh (Ctrl+Shift+R, or Cmd+Shift+R on Mac) before reporting that nothing changed.

---

## Manual fallback — when the token cannot write

Not a defeat. Produce the files, hand them over, and give exactly these steps. Keep it this short;
extra detail is what makes people give up. Tell them the URL they will end up with before they start.

**A. Create the repository**

1. Sign in to github.com on the right account — confirm the login shown top-right is the intended
   one, not a second account in another tab.
2. **+ ▾ → New repository**.
3. **Repository name** — becomes part of the URL, so lowercase with hyphens: `my-site`, not `My Site`.
4. **Public**. Pages on a private repo needs a paid plan.
5. Tick **Add a README file**. This creates the `main` branch; without a branch the Pages settings
   screen has nothing to offer.
6. **Create repository**.

**B. Upload the files**

1. **Add file ▾ → Upload files**.
2. Drag in the folder contents — `index.html`, `assets/`, images, everything. Folder structure is
   preserved when a folder is dragged in.
3. Scroll down → **Commit changes**.
4. Create the `.nojekyll` file: **Add file ▾ → Create new file**, filename `.nojekyll`, leave the
   body empty, commit.

**C. Turn on Pages**

1. **Settings** (repo settings, not account settings) → **Pages** in the left sidebar.
2. **Source**: `Deploy from a branch`.
3. **Branch**: `main`, folder `/ (root)` → **Save**.
4. Wait 1–2 minutes and refresh that same page. The live URL appears in a box at the top.

The first build is slow — up to ten minutes is normal, and a 404 during that window means nothing.
After that, every commit rebuilds automatically within a minute.

**D. Updating later**

Edit a file on github.com (open it, pencil icon, Commit changes), or drag new files in via **Add
file → Upload files** to overwrite. The site rebuilds on its own.

---

## Troubleshooting

### The site is 404

| Cause | How to confirm | Fix |
|---|---|---|
| No `index.html` at the publish root | `GET /repos/OWNER/REPO/contents/?ref=main` — is it in the list? | Create or move it to the root |
| Wrong URL shape | A project site is `https://OWNER.github.io/REPO/` — the repo segment is required | Use `.html_url` from `GET /pages` verbatim |
| Pages never enabled | `GET /pages` returns 404 | Run the `POST /pages` call |
| Still building | `GET /pages` says `building` | Wait; the first build takes up to 10 minutes |
| Wrong branch selected | `GET /pages` → `.source.branch` | `PUT /pages` with the right branch |
| Private repo on a free plan | `GET /repos/...` → `.private: true` | Make it public, or upgrade |

### The page loads but has no styling, or images are broken

Almost always **absolute paths**. On a project site everything is served under `/REPO/`, so
`/assets/style.css` resolves to `OWNER.github.io/assets/style.css`, which does not exist.

- `href="/assets/style.css"` → `href="assets/style.css"`
- `src="/img/logo.png"` → `src="img/logo.png"`
- From a page one folder deep: `../assets/style.css`

Second most common: **`_`-prefixed folders vanished** because Jekyll processed them. Push an empty
`.nojekyll` at the root and wait for the rebuild.

Third: **case mismatch**. Pages is case-sensitive, Windows is not. `assets/Logo.png` in the repo and
`assets/logo.png` in the HTML works locally and 404s on the internet.

### `fetch()` of a local JSON file fails

Opening the file from disk gives a `file://` origin and CORS blocks it. It works on Pages because
everything is same-origin over HTTPS. Locally, tell the user to run `python3 -m http.server 8000`
rather than double-clicking the file.

### Build status is `errored`

```bash
curl -sS -H "Authorization: Bearer $GH" \
  https://api.github.com/repos/OWNER/REPO/pages/builds/latest | jq -r '.error.message'
```

A Jekyll build error on a plain HTML site means Jekyll should not have run — `.nojekyll` fixes it. A
submodule error means the repo references a submodule Pages cannot read; remove it.

### Changes do not show up

1. Did the push land? `GET /repos/OWNER/REPO/commits?sha=main&per_page=1` — check the timestamp.
2. Did the rebuild finish? `GET /pages/builds/latest` — `status: built`, timestamped after the push.
3. Browser cache. Hard refresh, or open a private window.

CDN propagation adds a minute or two on top of the build. Anything beyond five minutes is a real
problem, not caching.

### 403 on `POST /pages` although the repo was created fine

The token has Contents write but not Pages write — separate permissions on fine-grained tokens.
Either re-issue the token with **Pages: Read & write**, or have the user enable Pages once by hand in
Settings → Pages. After that, pushes alone are enough for every future update.

### Organisation repo, everything 403

Some organisations disable Pages entirely or restrict it to admins. Also check that the OAuth app or
connector is approved for that org — `GET /user/orgs` listing the org is not the same as the app
being authorised on it. Third-party access restrictions must be lifted by an org owner.

### Rate limited — 403 with `x-ratelimit-remaining: 0`

5,000 requests per hour authenticated. Looping the Contents API over many files is the usual cause;
switch to the Git Data API and push one commit. `x-ratelimit-reset` is the epoch second when the
budget refills.

---

## Custom domain (optional)

```bash
curl -sS -X PUT https://api.github.com/repos/OWNER/REPO/pages \
  -H "Authorization: Bearer $GH" \
  -d '{"cname":"docs.example.com","https_enforced":true}'
```

DNS comes first, on the user's side. A subdomain needs a `CNAME` record pointing to
`OWNER.github.io`. An apex domain needs `A` records to `185.199.108.153`, `185.199.109.153`,
`185.199.110.153`, `185.199.111.153`. `https_enforced` only works once the certificate is issued,
which can take up to 24 hours.

---

## Starter page when nothing has been written yet

Trimble-branded, single file, all-relative paths. Replace the placeholder copy before pushing — this
is a starting point, not a finished site.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Site title</title>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  :root{--blue:#0063A3;--blue-14:#003054;--grey-10:#252A2E;--grey-8:#464B52;
        --grey-6:#6A6E79;--stroke:#CBCDD6;--amber:#FBAD26}
  *{box-sizing:border-box}
  body{margin:0;background:#fff;color:var(--grey-10);
       font:400 16px/1.6 'Open Sans','Segoe UI',system-ui,Arial,sans-serif}
  header{background:var(--blue-14);color:#fff;padding:56px 24px}
  .wrap{max-width:880px;margin:0 auto}
  header h1{margin:0 0 8px;font-size:clamp(28px,5vw,40px);font-weight:700}
  header p{margin:0;color:#CBD8E4;font-size:18px}
  main{padding:40px 24px 72px}
  h2{font-size:22px;font-weight:700;margin:36px 0 12px}
  a{color:var(--blue)}
  .card{border:1px solid var(--stroke);border-radius:6px;padding:20px 22px;margin:16px 0}
  .note{border-left:4px solid var(--blue);background:#F2F7FB;padding:14px 18px}
  .warn{border-left:4px solid var(--amber);background:#FEF7EA;padding:14px 18px}
  footer{border-top:1px solid var(--stroke);padding:24px;color:var(--grey-6);font-size:14px}
</style>
</head>
<body>
<header><div class="wrap"><h1>Site title</h1><p>One line saying what this page is for.</p></div></header>
<main class="wrap">
  <h2>Section heading</h2>
  <p>Body copy. Keep every internal link relative — <code>assets/style.css</code>, never
     <code>/assets/style.css</code>.</p>
  <div class="card"><strong>Card title</strong><p>Short supporting line.</p></div>
  <div class="note"><strong>Note.</strong> Trimble Blue #0063A3, Open Sans, Grey 10 text.</div>
  <div class="warn"><strong>Careful.</strong> This page is public the moment it is pushed.</div>
</main>
<footer class="wrap">Built with the GitHub Pages Publisher skill.</footer>
</body>
</html>
```

---

## Scope — what this skill does not do

- **It does not design the page.** Styling, decks and multi-page docs belong to the design skills.
  This one publishes what they produce.
- **It does not touch a repo the user did not name.** Never push to, rename or delete a repository
  outside the one agreed in Step 1.
- **It does not flip a private repo to public** to dodge the plan limitation. Raise it, let the user
  decide.
- **It does not publish anything containing secrets.** Scan the files for API keys, tokens,
  passwords, internal hostnames, customer names and personal data before pushing. A GitHub Pages site
  is public to the whole internet and gets indexed within days, and anything committed stays in the
  git history even after the file is deleted.

---

## QA checklist before reporting done

- [ ] Owner and repo name were confirmed by the user, not guessed
- [ ] Repo is public, or the user knowingly accepted a paid-plan private site
- [ ] `index.html` exists at the publish root
- [ ] `.nojekyll` exists at the root
- [ ] All internal links, CSS, JS and image paths are relative — no leading `/`
- [ ] No secrets, tokens or personal data in any pushed file
- [ ] `GET /pages` reports `status: built`
- [ ] The live URL was actually fetched and returned 200 with the expected content
- [ ] The user was given both the live URL and the repo URL
