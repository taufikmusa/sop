# Manual setup — creating the repo and turning on Pages by hand

Give the user this when the token cannot write, or when they simply prefer clicking. Nine minutes,
no command line.

## A. Create the repository

1. Sign in to github.com on the right account (top-right avatar — confirm the login is the one you
   mean, not a second account in another tab).
2. **+ ▾ → New repository**.
3. **Repository name** — this becomes part of the URL, so keep it lowercase with hyphens:
   `tekla-guide`, not `Tekla Guide`.
4. **Public**. Pages on a private repo needs a paid plan.
5. Tick **Add a README file**. This creates the `main` branch; without a branch, the Pages settings
   screen has nothing to offer you.
6. **Create repository**.

Naming decision worth getting right the first time:

| Name it | URL you get |
|---|---|
| `<your-login>.github.io` | `https://<your-login>.github.io/` — one per account, the root site |
| anything else | `https://<your-login>.github.io/<repo>/` — as many as you like |

## B. Upload the files

1. On the repo page: **Add file ▾ → Upload files**.
2. Drag in the whole folder contents — `index.html`, `assets/`, images, everything. Folder structure
   is preserved when you drag a folder in.
3. Scroll down → **Commit changes**.

Two files that decide whether this works:

- **`index.html` at the top level**, not inside a subfolder. If the browser gets a 404 later, this
  is why.
- **`.nojekyll`** — an empty file at the top level. Without it GitHub silently drops every folder
  starting with `_`. Create it via **Add file ▾ → Create new file**, type `.nojekyll` as the
  filename, leave the body empty, commit.

## C. Turn on Pages

1. **Settings** (repo settings, not account settings) → **Pages** in the left sidebar.
2. **Source**: `Deploy from a branch`.
3. **Branch**: `main`, folder `/ (root)` → **Save**.
4. Wait 1–2 minutes and refresh that same page. The live URL appears in a box at the top.

The first build is slow — up to ten minutes is normal, and a 404 during that window means nothing.
After that, every commit rebuilds automatically within a minute.

## D. Updating later

Edit a file directly on github.com (open it → pencil icon → Commit changes), or drag new files in
via **Add file → Upload files** to overwrite. The site rebuilds on its own. If the change doesn't
show, hard refresh: Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac.

## Before you upload anything

The site is public to the entire internet and gets indexed by search engines within days. Anything
committed stays in the git history even after you delete the file. So: no customer names, no
internal hostnames, no licence keys, no API tokens, nothing under NDA.
