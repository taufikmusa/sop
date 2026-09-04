#!/usr/bin/env python3
"""Validate every page in the FAQ Vault against the rules in the tekla-site-helper skill.

    python3 tools/check-pages.py

Exits non-zero if anything fails, so it can gate a commit. Checks:

  search-index.json  valid JSON, required fields, unique ids and urls
  page <-> index     question and variants match word for word
  shell              head/sidebar/footer/scripts present and KB_ROOT correct
  Section A          question box present, no "verbatim" claim, 3-5 variants
  Section B          the full Short Answer rule set
  Public voice       no internal or staff-facing framing anywhere on the page
"""
import glob
import html
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANNED = r'\b(call|calls|called|calling|phone|phoned|telephone|hotline|contact us|get in touch|reach out)\b'
GREETING = r'^\s*(hi|hello|hey|dear|good (morning|afternoon|evening))\b'
MAX_WORDS = 150
MAX_SENTENCES_PER_PARA = 2
MAX_WORDS_PER_SENTENCE = 20
MAX_LINKS = 2

SHELL_ANCHORS = [
    '<link rel="stylesheet" href="../../assets/kb.css">',
    "<script>window.KB_ROOT = '../../';</script>",
    '<aside class="kb-sidebar" id="kb-sidebar" aria-label="Knowledge base pages"></aside>',
    '<div class="kb-overlay" id="kb-overlay"></div>',
    '<button type="button" id="kb-burger"',
    '<a href="../../" class="std-brand" style="text-decoration:none;">Tekla <span>Structures FAQ Vault</span></a>',
    '<p>&copy; 2026 Taufik Musa &middot; Tekla Structures FAQ Vault</p>',
    '<p class="footer-note">',
    '<a href=\"https://github.com/taufikmusa/sop/blob/main/LICENSE\" target=\"_blank\" rel=\"noopener\">License</a>',
    '<script src="../../assets/kb.js"></script>',
    '<div class="kb-section-label"><b>A</b> Question</div>',
    '<div class="kb-section-label"><b>B</b> Short Answer</div>',
    '<div class="kb-section-label"><b>C</b> Detailed Answer</div>',
]

INDEX_FIELDS = ['id', 'title', 'folder', 'category', 'product',
                'url', 'question', 'variants', 'summary', 'keywords']

# The site is public. These read as notes written for a support desk rather
# than for the person with the problem, so none of them belongs on a page.
INTERNAL_PHRASES = [
    r'\binternal\b',
    r'do not paste',
    r'\bthe customer\b',
    r'\bTrimble SEA\b',
    r'\bescalate\b',
    r'Internal Use Only',
]


def text_of(fragment):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', fragment))).strip()


def blocks(body):
    """Ordered (tag, text) for each paragraph and list item."""
    return [(m.group(1), text_of(m.group(2)))
            for m in re.finditer(r'<(p|li)\b[^>]*>(.*?)</\1>', body, re.S)]


def sentences(text):
    return [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if s.strip()]


def check_index(index):
    errs = []
    ids, urls = set(), set()
    for page in index['pages']:
        where = page.get('id', '<no id>')
        missing = [f for f in INDEX_FIELDS if f not in page]
        if missing:
            errs.append('%s: missing fields %s' % (where, missing))
            continue
        if page['id'] in ids:
            errs.append('%s: duplicate id' % where)
        if page['url'] in urls:
            errs.append('%s: duplicate url' % where)
        ids.add(page['id'])
        urls.add(page['url'])
        if not page['url'].endswith('/'):
            errs.append('%s: url must end with "/"' % where)
        if not 3 <= len(page['variants']) <= 5:
            errs.append('%s: %d variants, expected 3-5' % (where, len(page['variants'])))
        if not page['keywords']:
            errs.append('%s: no keywords' % where)
    return errs


def check_page(path, entry):
    src = open(path, encoding='utf-8').read()
    errs = []

    for anchor in SHELL_ANCHORS:
        if anchor not in src:
            errs.append('shell: missing %r' % anchor[:60])

    # ---- Section A ----
    m = re.search(r'<div class="kb-question">\s*<p>&ldquo;(.*?)&rdquo;</p>', src, re.S)
    if not m:
        errs.append('A: no question box')
    elif entry and text_of(m.group(1)) != entry['question']:
        errs.append('A: question does not match search-index.json')

    vm = re.search(r'<div class="kb-question-variants">(.*?)</div>', src, re.S)
    if not vm:
        errs.append('A: no "Also asked as" block')
    elif entry:
        on_page = [text_of(x) for x in re.findall(r'<li>(.*?)</li>', vm.group(1), re.S)]
        if on_page != entry['variants']:
            errs.append('A: "Also asked as" does not match variants in search-index.json')

    if 'verbatim' in src.lower():
        errs.append('A: the page still claims to be verbatim')

    # ---- public voice ----
    readable = text_of(re.sub(r'(?s)<(script|style)\b.*?</\1>', ' ', src))
    for pattern in INTERNAL_PHRASES:
        hit = re.search(pattern, readable, re.I)
        if hit:
            errs.append('public: staff-facing wording %r - this page is public' % hit.group(0))

    # ---- Section B ----
    bm = re.search(r'<div class="kb-email-body" id="kb-email-body">(.*?)\n\s*<div class="kb-email-foot">',
                   src, re.S)
    if not bm:
        return errs + ['B: no email body']
    body = bm.group(1)
    bl = blocks(body)
    plain = ' '.join(t for _, t in bl)
    urls = re.findall(r'href="(https?://[^"]+)"', body)

    total = len(plain.split()) + len(urls)
    if total > MAX_WORDS:
        errs.append('B: %d words > %d' % (total, MAX_WORDS))
    if bl and re.match(GREETING, bl[0][1], re.I):
        errs.append('B: opens with a greeting')
    if re.search(r'\[name\]', plain, re.I):
        errs.append('B: contains a name placeholder')
    for hit in re.findall(BANNED, plain, re.I):
        errs.append('B: banned contact wording %r - the reply is email only' % hit)

    for tag, t in bl:
        if tag == 'li':
            if len(t.split()) > MAX_WORDS_PER_SENTENCE:
                errs.append('B: list item of %d words' % len(t.split()))
            continue
        sents = sentences(t)
        if len(sents) > MAX_SENTENCES_PER_PARA:
            errs.append('B: %d sentences in one paragraph: %r' % (len(sents), t[:50]))
        for sent in sents:
            if len(sent.split()) > MAX_WORDS_PER_SENTENCE:
                errs.append('B: sentence of %d words: %r' % (len(sent.split()), sent[:60]))

    if '<ol>' not in body:
        errs.append('B: sequential steps are not in a numbered list')
    if len(urls) > MAX_LINKS:
        errs.append('B: %d links > %d' % (len(urls), MAX_LINKS))

    for am in re.finditer(r'<a\b[^>]*>.*?</a>', body, re.S):
        open_p = body.rfind('<p', 0, am.start())
        close_p = body.find('</p>', am.start())
        container = body[open_p:close_p + 4] if open_p != -1 and close_p != -1 else ''
        if text_of(container) != text_of(am.group(0)):
            errs.append('B: link sits mid-sentence, not on its own line')

    links_at = body.find('kb-email-links')
    if links_at != -1 and body.find('<a ', 0, links_at) != -1:
        errs.append('B: a link appears above the bottom link block')
    if bl and not re.search(r'\breply\b|\blet me know\b', bl[-1][1], re.I):
        errs.append('B: last line does not invite a reply')

    return errs


def main():
    os.chdir(ROOT)
    try:
        index = json.load(open('search-index.json', encoding='utf-8'))
    except ValueError as exc:
        print('FAIL  search-index.json is not valid JSON: %s' % exc)
        return 1

    failures = list(check_index(index))
    for err in failures:
        print('FAIL  search-index.json  - %s' % err)

    by_url = {p['url']: p for p in index['pages']}
    pages = sorted(glob.glob('tekla/*/index.html'))

    for path in pages:
        url = os.path.dirname(path) + '/'
        entry = by_url.get(url)
        errs = check_page(path, entry)
        if entry is None:
            errs.append('not registered in search-index.json - it will not appear anywhere')
        if errs:
            failures.extend(errs)
            print('FAIL  %s' % path)
            for e in errs:
                print('        - %s' % e)
        else:
            print('PASS  %s' % path)

    for url in by_url:
        if not os.path.isfile(os.path.join(url, 'index.html')):
            failures.append(url)
            print('FAIL  search-index.json lists %s but the page does not exist' % url)

    print('\n%d page(s), %d problem(s)' % (len(pages), len(failures)))
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main())
