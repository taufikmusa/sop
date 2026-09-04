# Tekla Structures FAQ Vault

Internal support knowledge base for Tekla Structures, built on the Trimble
Service Documentation visual template (Lampiran A in the tekla-site-helper skill).

The subject of every page is Tekla Structures. Another product may appear where
it connects to it — an export to PowerFab, a model exchange, any handoff between
the two — written from the Tekla Structures side. Questions that never touch
Tekla Structures belong elsewhere.

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
| **A. Customer Question** | The question in generic form, in a shaded box, with an "Also asked as" list | Strip identifying detail, keep the customer's symptom words |
| **B. Email Reply** | Ready-to-send answer with a Copy button | Max 150 words, 1-2 TUA links inline |
| **C. Detailed SOP** | Full internal reference | Timeline steps, warning boxes, version tables. Can be long |

The Copy button copies plain text only - never HTML. Links are flattened to
`anchor text (url)` so the URL survives the paste into the mail client.

## Starting from a QnA you already wrote

A .docx, an old email or pasted text can become a page directly, but the
existing answer is treated as a draft, not as truth: every claim in it is
re-checked against Tekla User Assistance first, corrections are recorded in
the Detailed SOP, and the reply is rewritten to the Email Reply rules above.
Where the old answer and the documentation disagree, the documentation wins.

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
  "question": "The customer question in generic form, one or two sentences.",
  "variants": [
    "Another way the same question arrives.",
    "A more technical wording.",
    "A vaguer wording."
  ],
  "summary": "One-line description shown on the hub.",
  "keywords": ["symptom", "dialog name", "advanced option"]
}
```

`folder` groups the page in the sidebar and on the hub. `question`, `variants` and
`keywords` are what make the page findable - put the customer's own words and the
exact dialog, column and advanced-option names in there.

`variants` must match the "Also asked as" list on the page word for word. When the
same question arrives worded differently, add that wording to both rather than
creating a second page: one page, many ways in.

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
