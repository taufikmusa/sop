/* ------------------------------------------------------------------
   Trimble Service Documentation - knowledge base runtime
   - builds the left sidebar on every page from /search-index.json
   - live client-side filtering on title + question + keywords
   - hamburger drawer on mobile
   - "Copy" on the Email Reply block copies plain text only
   Adding a page = adding one entry to search-index.json.
   ------------------------------------------------------------------ */
(function () {
    'use strict';

    var ROOT = window.KB_ROOT || './';
    var ICON_SEARCH = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"></path></svg>';

    var state = { pages: [], query: '', loaded: false };
    var els = { nav: null, meta: null, inputs: [], hub: null, hubMeta: null };

    /* ---------- helpers ---------- */

    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) { node.className = className; }
        if (text !== undefined && text !== null) { node.textContent = text; }
        return node;
    }

    function normalisePath(path) {
        path = path.replace(/index\.html$/, '');
        if (path.length > 1 && path.charAt(path.length - 1) !== '/') { path += '/'; }
        return path;
    }

    function isActive(page) {
        if (!page.url) { return false; }
        var here = normalisePath(window.location.pathname);
        var target = normalisePath('/' + String(page.url).replace(/^\.?\//, ''));
        return target !== '/' && here.length >= target.length && here.slice(-target.length) === target;
    }

    function haystack(page) {
        return [
            page.title,
            page.question,
            page.summary,
            page.folder,
            page.category,
            page.product,
            (page.keywords || []).join(' ')
        ].join(' ').toLowerCase();
    }

    function matches(page) {
        if (!state.query) { return true; }
        var hay = haystack(page);
        return state.query.split(/\s+/).every(function (term) {
            return hay.indexOf(term) !== -1;
        });
    }

    function groupByFolder(pages) {
        var order = [];
        var groups = {};
        pages.forEach(function (page) {
            var key = page.folder || 'Other';
            if (!groups[key]) { groups[key] = []; order.push(key); }
            groups[key].push(page);
        });
        return order.map(function (key) { return { folder: key, pages: groups[key] }; });
    }

    /* ---------- sidebar ---------- */

    function buildSidebar() {
        var aside = document.getElementById('kb-sidebar');
        if (!aside) { return; }

        var searchWrap = el('div', 'kb-sidebar-search');
        var field = el('div', 'kb-search-field');
        field.innerHTML = ICON_SEARCH;

        var input = el('input', 'kb-search-input');
        input.type = 'search';
        input.id = 'kb-search';
        input.placeholder = 'Search all pages...';
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('aria-label', 'Search the knowledge base');

        field.appendChild(input);
        searchWrap.appendChild(field);
        aside.appendChild(searchWrap);

        els.meta = el('div', 'kb-search-meta', 'Loading index...');
        aside.appendChild(els.meta);

        els.nav = el('nav', 'kb-nav');
        els.nav.setAttribute('aria-label', 'All pages');
        aside.appendChild(els.nav);

        registerInput(input);
    }

    function renderNav() {
        if (!els.nav) { return; }
        els.nav.innerHTML = '';

        var visible = state.pages.filter(matches);

        if (els.meta) {
            els.meta.textContent = state.query
                ? visible.length + ' of ' + state.pages.length + ' pages'
                : state.pages.length + (state.pages.length === 1 ? ' page' : ' pages');
        }

        if (!visible.length) {
            els.nav.appendChild(el('p', 'kb-nav-empty', 'No page matches "' + state.query + '".'));
            return;
        }

        groupByFolder(visible).forEach(function (group) {
            var wrap = el('div', 'kb-nav-group');
            wrap.appendChild(el('div', 'kb-nav-group-title', group.folder));
            group.pages.forEach(function (page) {
                var link = el('a', 'kb-nav-link' + (isActive(page) ? ' is-active' : ''));
                link.href = ROOT + page.url;
                link.appendChild(document.createTextNode(page.title));
                if (page.category) { link.appendChild(el('small', null, page.category)); }
                if (isActive(page)) { link.setAttribute('aria-current', 'page'); }
                wrap.appendChild(link);
            });
            els.nav.appendChild(wrap);
        });
    }

    /* ---------- hub listing ---------- */

    function renderHub() {
        if (!els.hub) { return; }
        els.hub.innerHTML = '';

        var visible = state.pages.filter(matches);

        if (els.hubMeta) {
            els.hubMeta.textContent = state.query
                ? 'Showing ' + visible.length + ' of ' + state.pages.length + ' pages for "' + state.query + '"'
                : 'Showing all ' + state.pages.length + (state.pages.length === 1 ? ' page' : ' pages');
        }

        if (!visible.length) {
            els.hub.appendChild(el('p', 'kb-hub-empty', 'Nothing matches that search yet.'));
            return;
        }

        groupByFolder(visible).forEach(function (group) {
            var section = el('section', 'kb-hub-group');
            section.appendChild(el('h2', 'kb-hub-group-title', group.folder));

            var list = el('div', 'kb-hub-list');
            group.pages.forEach(function (page) {
                var row = el('a', 'kb-hub-row');
                row.href = ROOT + page.url;

                row.appendChild(el('div', 'kb-hub-eyebrow',
                    [page.category, page.product].filter(Boolean).join(' · ')));
                row.appendChild(el('h3', 'kb-hub-title', page.title));
                if (page.question) {
                    row.appendChild(el('p', 'kb-hub-question', '“' + page.question + '”'));
                }
                if (page.summary) {
                    row.appendChild(el('p', 'kb-hub-summary', page.summary));
                }
                list.appendChild(row);
            });

            section.appendChild(list);
            els.hub.appendChild(section);
        });
    }

    /* ---------- search wiring ---------- */

    function registerInput(input) {
        els.inputs.push(input);
        input.addEventListener('input', function () {
            setQuery(input.value, input);
        });
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') { setQuery('', null); }
        });
    }

    function setQuery(value, source) {
        state.query = String(value || '').trim().toLowerCase();
        els.inputs.forEach(function (input) {
            if (input !== source && input.value !== value) { input.value = value; }
        });
        renderNav();
        renderHub();
    }

    /* ---------- mobile drawer ---------- */

    function setupDrawer() {
        var burger = document.getElementById('kb-burger');
        var overlay = document.getElementById('kb-overlay');
        if (!burger) { return; }

        function close() {
            document.body.classList.remove('kb-nav-open');
            burger.setAttribute('aria-expanded', 'false');
        }

        burger.addEventListener('click', function () {
            var open = document.body.classList.toggle('kb-nav-open');
            burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        if (overlay) { overlay.addEventListener('click', close); }
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') { close(); }
        });
        window.addEventListener('resize', function () {
            if (window.innerWidth >= 1024) { close(); }
        });
    }

    /* ---------- copy the email reply as plain text ---------- */

    function emailToPlainText(node) {
        var clone = node.cloneNode(true);

        Array.prototype.slice.call(clone.querySelectorAll('a')).forEach(function (anchor) {
            var label = anchor.textContent.trim();
            var href = anchor.getAttribute('href') || '';
            var text = href && href.indexOf('http') === 0 ? label + ' (' + href + ')' : label;
            anchor.parentNode.replaceChild(document.createTextNode(text), anchor);
        });

        Array.prototype.slice.call(clone.querySelectorAll('li')).forEach(function (item, index) {
            var parent = item.parentNode;
            var prefix = parent && parent.tagName === 'OL' ? (index + 1) + '. ' : '- ';
            item.insertBefore(document.createTextNode(prefix), item.firstChild);
        });

        var blocks = clone.querySelectorAll('p, li');
        var lines = [];
        Array.prototype.slice.call(blocks).forEach(function (block) {
            lines.push(block.textContent.replace(/\s+/g, ' ').trim());
        });

        return lines.filter(Boolean).join('\n\n');
    }

    function setupCopy() {
        Array.prototype.slice.call(document.querySelectorAll('[data-kb-copy]')).forEach(function (button) {
            var target = document.querySelector(button.getAttribute('data-kb-copy'));
            if (!target) { return; }

            var label = button.querySelector('[data-kb-copy-label]') || button;
            var original = label.textContent;

            button.addEventListener('click', function () {
                var text = emailToPlainText(target);

                function done(ok) {
                    label.textContent = ok ? 'Copied' : 'Press Ctrl+C';
                    button.classList.add('is-done');
                    setTimeout(function () {
                        label.textContent = original;
                        button.classList.remove('is-done');
                    }, 2000);
                }

                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallbackCopy(text)); });
                } else {
                    done(fallbackCopy(text));
                }
            });
        });
    }

    function fallbackCopy(text) {
        var area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (error) { ok = false; }
        document.body.removeChild(area);
        return ok;
    }

    /* ---------- boot ---------- */

    function loadIndex() {
        fetch(ROOT + 'search-index.json', { cache: 'no-cache' })
            .then(function (response) {
                if (!response.ok) { throw new Error('HTTP ' + response.status); }
                return response.json();
            })
            .then(function (data) {
                state.pages = (data && data.pages) || [];
                state.loaded = true;
                renderNav();
                renderHub();
            })
            .catch(function () {
                if (els.meta) { els.meta.textContent = 'Index unavailable'; }
                if (els.nav) {
                    els.nav.innerHTML = '';
                    els.nav.appendChild(el('p', 'kb-nav-note',
                        'search-index.json could not be loaded. Open the site over HTTP (for example: python3 -m http.server) rather than from the file system.'));
                }
                if (els.hubMeta) { els.hubMeta.textContent = 'Index unavailable'; }
            });
    }

    function init() {
        buildSidebar();
        setupDrawer();
        setupCopy();

        els.hub = document.getElementById('kb-hub-results');
        els.hubMeta = document.getElementById('kb-hub-meta');

        var hubInput = document.getElementById('kb-hub-search');
        if (hubInput) { registerInput(hubInput); }

        document.addEventListener('keydown', function (event) {
            var tag = document.activeElement ? document.activeElement.tagName : '';
            var box = hubInput || els.inputs[0];
            if (event.key === '/' && box && !/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) {
                event.preventDefault();
                box.focus();
            }
        });

        loadIndex();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
