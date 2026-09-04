# Tekla Structures FAQ Vault

Internal support knowledge base for Tekla Structures, built on the Trimble
Service Documentation visual template (Lampiran A in the tekla-site-helper skill).
Scope is Tekla Structures only.

## Structure

```
index.html            Hub - search box + full list of every page
search-index.json     Single source of truth for the sidebar, the hub list and search
assets/kb.css         Shell styling (sidebar, search, A/B/C sections, copy button)
assets/kb.js          Sidebar builder, live filter, mobile drawer, copy-as-plain-text
tekla/<slug>/         One folder per page
```

Every page carries a persistent left sidebar listing all pages, grouped by folder,
with a search box on top. Below 1024px the sidebar collapses into a hamburger drawer.

## Page structure

Every page has the same three sections, in this order:

| Section | Purpose | Rules |
| --- | --- | --- |
| **A. Customer Question** | The original question, verbatim, in a shaded box | Keep it short |
| **B. Email Reply** | Ready-to-send answer with a Copy button | Max 150 words, 1-2 TUA links inline |
| **C. Detailed SOP** | Full internal reference | Timeline steps, warning boxes, version tables. Can be long |

The Copy button copies plain text only - never HTML. Links are flattened to
`anchor text (url)` so the URL survives the paste into the mail client.

## Adding a page

1. Create `<folder>/<slug>/index.html`. Copy an existing page as the starting point
   and keep the same shell: `window.KB_ROOT`, `assets/kb.css`, `#kb-sidebar`,
   `#kb-overlay`, `#kb-burger`, `assets/kb.js`. Set `KB_ROOT` to the relative path
   back to the site root (`../../` for a two-level page).
2. Add **one** entry to `pages[]` in `search-index.json`:

```json
{
  "id": "tekla-my-new-page",
  "title": "Short page title",
  "folder": "Tekla Structures",
  "category": "Drawings",
  "product": "Tekla Structures 2026",
  "url": "tekla/my-new-page/",
  "question": "The customer question in one or two sentences.",
  "summary": "One-line description shown on the hub.",
  "keywords": ["symptom", "dialog name", "advanced option"]
}
```

`folder` groups the page in the sidebar and on the hub. `question` and `keywords`
are what makes the page findable - put the customer's own words and the exact
dialog, column and advanced-option names in there.

Nothing else needs editing. The sidebar, the hub listing and the search all read
that one file.

## Running locally

`search-index.json` is fetched over HTTP, so serve the folder rather than opening
the files directly:

```
python3 -m http.server 8000
```

Opening a page from the file system shows the page content but leaves the sidebar
empty, with a note explaining why.
