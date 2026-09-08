# GitHub REST API recipes — copy-paste payloads

Base URL `https://api.github.com`. Every request:

```
Authorization: Bearer <token>
Accept: application/vnd.github+json
X-GitHub-Api-Version: 2022-11-28
```

---

## 1. Who am I

```bash
curl -sS -H "Authorization: Bearer $GH" https://api.github.com/user | jq '.login, .plan.name'
curl -sS -H "Authorization: Bearer $GH" https://api.github.com/user/orgs | jq '.[].login'
```

`.plan.name` matters only if the user wants a private Pages site — `free` cannot do it.

---

## 2. Create the repository

Personal account:

```bash
curl -sS -X POST https://api.github.com/user/repos \
  -H "Authorization: Bearer $GH" -H "Accept: application/vnd.github+json" \
  -d '{
    "name": "tekla-guide",
    "description": "Tekla Structures quick reference",
    "private": false,
    "auto_init": true,
    "homepage": "https://taufiktrimble.github.io/tekla-guide/"
  }'
```

Organisation — same body, different path:

```bash
curl -sS -X POST https://api.github.com/orgs/ORGNAME/repos ...
```

Read the default branch of an existing repo (never assume `main`):

```bash
curl -sS -H "Authorization: Bearer $GH" \
  https://api.github.com/repos/OWNER/REPO | jq -r '.default_branch'
```

---

## 3a. Push a single file (Contents API)

New file:

```bash
CONTENT=$(base64 -w0 index.html)
curl -sS -X PUT https://api.github.com/repos/OWNER/REPO/contents/index.html \
  -H "Authorization: Bearer $GH" \
  -d "{\"message\":\"Add landing page\",\"content\":\"$CONTENT\",\"branch\":\"main\"}"
```

Existing file — fetch the sha first, or you get `422`:

```bash
SHA=$(curl -sS -H "Authorization: Bearer $GH" \
  "https://api.github.com/repos/OWNER/REPO/contents/index.html?ref=main" | jq -r '.sha')
curl -sS -X PUT https://api.github.com/repos/OWNER/REPO/contents/index.html \
  -H "Authorization: Bearer $GH" \
  -d "{\"message\":\"Update page\",\"content\":\"$CONTENT\",\"sha\":\"$SHA\",\"branch\":\"main\"}"
```

The empty `.nojekyll` file, in one line (`""` is valid base64 for empty):

```bash
curl -sS -X PUT https://api.github.com/repos/OWNER/REPO/contents/.nojekyll \
  -H "Authorization: Bearer $GH" \
  -d '{"message":"Disable Jekyll","content":"","branch":"main"}'
```

---

## 3b. Push many files in ONE commit (Git Data API)

```bash
O=OWNER; R=REPO; B=main; API=https://api.github.com/repos/$O/$R
H=(-H "Authorization: Bearer $GH" -H "Accept: application/vnd.github+json")

# 1. a blob per file
blob() { curl -sS -X POST "${H[@]}" $API/git/blobs \
  -d "{\"content\":\"$(base64 -w0 "$1")\",\"encoding\":\"base64\"}" | jq -r .sha; }

SHA_INDEX=$(blob index.html)
SHA_CSS=$(blob assets/kb.css)

# 2. current tip + its tree
PARENT=$(curl -sS "${H[@]}" $API/git/ref/heads/$B | jq -r .object.sha)
BASE=$(curl -sS "${H[@]}" $API/git/commits/$PARENT | jq -r .tree.sha)

# 3. new tree
TREE=$(curl -sS -X POST "${H[@]}" $API/git/trees -d "{
  \"base_tree\": \"$BASE\",
  \"tree\": [
    {\"path\":\"index.html\",     \"mode\":\"100644\",\"type\":\"blob\",\"sha\":\"$SHA_INDEX\"},
    {\"path\":\"assets/kb.css\",  \"mode\":\"100644\",\"type\":\"blob\",\"sha\":\"$SHA_CSS\"}
  ]}" | jq -r .sha)

# 4. commit
COMMIT=$(curl -sS -X POST "${H[@]}" $API/git/commits \
  -d "{\"message\":\"Publish site\",\"tree\":\"$TREE\",\"parents\":[\"$PARENT\"]}" | jq -r .sha)

# 5. move the branch
curl -sS -X PATCH "${H[@]}" $API/git/refs/heads/$B -d "{\"sha\":\"$COMMIT\"}"
```

Folders are implied by the `path` — there is no "create directory" call. `mode` is `100644` for a
normal file, `100755` for an executable. To delete a path in the same commit, pass
`{"path":"old.html","mode":"100644","type":"blob","sha":null}`.

---

## 4. Enable Pages

```bash
curl -sS -X POST https://api.github.com/repos/OWNER/REPO/pages \
  -H "Authorization: Bearer $GH" -H "Accept: application/vnd.github+json" \
  -d '{"source":{"branch":"main","path":"/"}}'
```

| Code | Meaning | Do |
|---|---|---|
| 201 | Enabled | Continue to verify |
| 409 | Already enabled | Fine — continue, or change source with `PUT` |
| 403 | Token lacks Pages write, or org policy blocks it | Manual fallback |
| 404 | Wrong owner/repo, or no read access | Re-check the path |
| 422 | `path` is not `/` or `/docs` | Move the files |

Change the source later:

```bash
curl -sS -X PUT https://api.github.com/repos/OWNER/REPO/pages \
  -H "Authorization: Bearer $GH" -d '{"source":{"branch":"main","path":"/docs"}}'
```

Build from a GitHub Actions workflow instead (MkDocs, Vite, Next.js):

```bash
curl -sS -X PUT https://api.github.com/repos/OWNER/REPO/pages \
  -H "Authorization: Bearer $GH" -d '{"build_type":"workflow"}'
```

…then push `.github/workflows/pages.yml` using `actions/upload-pages-artifact` +
`actions/deploy-pages`, with `permissions: {pages: write, id-token: write}`. The token needs the
`workflow` scope to push a file under `.github/workflows/`.

---

## 5. Verify

```bash
curl -sS -H "Authorization: Bearer $GH" \
  https://api.github.com/repos/OWNER/REPO/pages | jq '{status, html_url, source}'

curl -sS -H "Authorization: Bearer $GH" \
  https://api.github.com/repos/OWNER/REPO/pages/builds/latest | jq '{status, error}'

curl -sS -o /dev/null -w '%{http_code}\n' https://OWNER.github.io/REPO/
```

`status` runs `null` → `building` → `built` (or `errored`). Poll roughly every 20–30 seconds, up to
about ten minutes. The final `curl` returning `200` is the only proof that counts.

---

## 6. Custom domain (optional)

```bash
curl -sS -X PUT https://api.github.com/repos/OWNER/REPO/pages \
  -H "Authorization: Bearer $GH" \
  -d '{"cname":"docs.example.com","https_enforced":true}'
```

DNS first, on the user's side: a subdomain needs a `CNAME` to `OWNER.github.io`; an apex domain
needs `A` records to `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`. `https_enforced` only
works after the certificate is issued, which can take up to 24 hours.
