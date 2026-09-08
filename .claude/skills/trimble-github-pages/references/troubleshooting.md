# Troubleshooting — Pages says built, page says no

## The site is 404

| Cause | How to confirm | Fix |
|---|---|---|
| No `index.html` at the publish root | `GET /contents/?ref=main` — is `index.html` in the list? | Move or create it at the root |
| Wrong URL shape | Project site is `https://OWNER.github.io/REPO/` — the trailing repo segment is required | Use `.html_url` from `GET /pages` verbatim |
| Pages never enabled | `GET /pages` → 404 | Run the `POST /pages` call |
| Still building | `GET /pages` → `building` | Wait; first build takes up to 10 minutes |
| Wrong branch selected | `GET /pages` → `.source.branch` | `PUT /pages` with the right branch |
| Repo is private on a free plan | `GET /repos/...` → `.private: true` | Make it public, or upgrade |

## The page loads but has no styling / broken images

Almost always **absolute paths**. On a project site everything is served under `/REPO/`, so
`/assets/kb.css` resolves to `OWNER.github.io/assets/kb.css` — which does not exist.

- `href="/assets/kb.css"` → `href="assets/kb.css"`
- `src="/img/logo.png"` → `src="img/logo.png"`
- From a page one folder deep, `../assets/kb.css`

Second most common: **`_`-prefixed folders vanished** because Jekyll ate them. Push an empty
`.nojekyll` at the root and wait for the rebuild.

Third: **case mismatch**. Pages is case-sensitive; the user's Windows machine is not.
`assets/Logo.png` in the repo, `assets/logo.png` in the HTML → 404 on the internet, fine locally.

## `fetch()` of a local JSON file fails

Opening the file from disk gives a `file://` origin and CORS blocks it. On Pages it works, since
everything is same-origin over HTTPS. Locally, tell the user to run `python3 -m http.server 8000`
rather than double-clicking the file.

## Build status is `errored`

```bash
curl -sS -H "Authorization: Bearer $GH" \
  https://api.github.com/repos/OWNER/REPO/pages/builds/latest | jq -r '.error.message'
```

Jekyll build errors on a plain HTML site mean Jekyll should not have run — `.nojekyll` fixes it.
A `submodule` error means the repo references a submodule that Pages cannot read; remove it.

## Changes don't show up

1. Did the push land? `GET /commits?sha=main&per_page=1` — check the timestamp.
2. Did the rebuild finish? `GET /pages/builds/latest` — `status: built`, timestamp after the push.
3. Browser cache. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R), or open in a private window.

CDN propagation adds a minute or two on top of the build. Anything beyond five minutes is a real
problem, not caching.

## `403` on `POST /pages` but the repo was created fine

The token has `Contents: write` but not `Pages: write` — separate permissions on fine-grained
tokens. Either re-issue the token with **Pages: Read & write**, or enable Pages once by hand in
Settings → Pages; after that, pushes alone are enough for every future update.

## Organisation repo, everything 403

Some organisations disable Pages entirely, or restrict it to members with admin. Also check that
the OAuth app / connector is approved for that org — `GET /user/orgs` listing the org is not the
same as the app being authorised on it. Third-party access restrictions have to be lifted by an org
owner.

## Rate limited (`403` with `x-ratelimit-remaining: 0`)

5,000 requests/hour authenticated. Looping the Contents API over many files is the usual cause —
switch to the Git Data API and push one commit. `x-ratelimit-reset` is the epoch second when the
budget refills.
