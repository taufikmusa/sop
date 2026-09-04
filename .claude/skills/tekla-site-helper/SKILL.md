---
name: tekla-site-helper
description: >
  Jawab soalan sokongan Tekla Structures berdasarkan dokumentasi rasmi Tekla User Assistance
  (support.tekla.com, docs.tekla.com) sahaja, kemudian hantar sebagai jawapan support berstruktur
  dalam chat ATAU satu page HTML dalam knowledge base "Tekla Structures FAQ Vault" dengan struktur
  tetap A/B/C (Customer Question, Email Reply, Detailed SOP). Guna skill ini SETIAP KALI ada
  soalan "macam mana nak buat X dalam Tekla", mesej ralat Tekla, atau permintaan SOP/guide/page
  untuk workflow Tekla — termasuk sebutan "tekla sop", "tekla site helper", "buat page Tekla",
  "guide Tekla", "cari dalam TUA", "FAQ Vault", "service documentation". Trigger walaupun HTML
  atau skill tak disebut. WAJIB cari dokumentasi rasmi dahulu dan jangan reka laluan menu. Skop
  Tekla Structures sahaja — bukan PowerFab. BERBEZA daripada tekla-model-macro,
  tekla-drawing-macro dan tekla-visual-studio-skill (semua tu tulis kod C#) serta
  sop-retro-brutalist-style (SOP dalaman gaya retro-brutalist).
---

# Tekla Site Helper

Tiga kerja dalam satu skill:

1. **Jawapan sokongan yang sahih** — berpandukan Tekla User Assistance (TUA) rasmi, bukan ingatan.
2. **Susun jadi A/B/C** — Customer Question, Email Reply, Detailed SOP.
3. **Terbit ke FAQ Vault** — satu page HTML dalam knowledge base, plus satu entry dalam `search-index.json`.

Jangan sesekali langkau kerja 1 dan terus ke kerja 3. Page yang cantik tapi menu path salah lebih memudaratkan daripada tiada page langsung.

**Skop: Tekla Structures sahaja.** Bukan PowerFab, bukan Trimble Connect, bukan produk Tekla lain. Kalau soalan tu tentang produk lain, cakap terus ia di luar skop vault ni.

---

## Langkah 0 — Tentukan mod output

| Isyarat daripada pengguna | Mod |
|---|---|
| Soalan pantas, satu isu, "kenapa ni jadi", "macam mana nak…" | **Mod Jawapan** (markdown dalam chat) |
| "buat SOP", "buat page", "buat guide", "HTML", "untuk team", "nak share link", "training material" | **Mod Page** (page dalam vault) |
| Workflow 4 langkah atau lebih, atau melibatkan beberapa tool/dialog | **Mod Page** — walaupun dia tak minta |
| Betul-betul kabur | Tanya sekali sahaja, ringkas. Jangan tanya bertalu-talu. |

---

## Langkah 1 — Riset (WAJIB, tiada pengecualian)

1. Kenal pasti **versi Tekla Structures**, **nama tool/dialog**, dan **teks ralat tepat** kalau ada. Kalau versi tak disebut, andaikan versi terkini dan nyatakan secara terbuka bahawa langkah mungkin berbeza untuk versi lama.
2. Cari dengan `web_search`. Query yang berkesan:
   - `site:support.tekla.com <tool/error>`
   - `Tekla Structures <versi> <nama dialog> user assistance`
   - `<teks ralat penuh> tekla`
3. `web_fetch` artikel TUA yang paling hampir. Baca langkah sebenar — jangan bergantung pada snippet carian sahaja.
4. Kalau isu tu merentas versi (contoh 2021 vs 2024 vs 2026), cari kedua-dua dan catat perbezaannya secara eksplisit.

**Garis merah:**
- Jangan reka laluan menu, nama butang, nama fail `.ini`/`.xml`, atau nilai advanced option. Kalau tak jumpa dalam dokumen rasmi, cakap tak jumpa.
- Jangan bina URL TUA sendiri. Guna hanya URL yang muncul dalam keputusan carian atau halaman yang telah di-fetch.
- Kalau TUA memang senyap tentang isu tu, katakan dengan jelas dan cadangkan escalate kepada local Tekla support / Trimble SEA. Lebih baik jawapan pendek yang jujur daripada page penuh yang mengarut.
- Forum, blog pihak ketiga dan YouTube boleh jadi petunjuk arah, tetapi tidak boleh jadi satu-satunya sumber. Tandakan ia sebagai tidak rasmi kalau terpaksa dipakai.
- **Tiada pautan video** di mana-mana dalam page — tidak dalam hero, tidak dalam Email Reply. Dalam Official Reference pun, utamakan artikel bertulis.

---

## Langkah 2 — Susun jadi A/B/C

Setiap page dalam vault ada **tiga section tetap, dalam susunan ni**. Tiada section tambahan di aras atas, tiada susunan lain.

### A. Customer Question

Soalan asal customer, **verbatim**, dalam kotak berlorek. Ringkas.

- **Kalau tiada teks tiket sebenar, JANGAN reka soalan itu.** Tanya Taufik dulu: minta teks tiket atau emel customer yang sebenar. Berhenti dan tunggu — jangan karang soalan yang munasabah dan teruskan.
- Kalau dia memang mahu page tu disiapkan tanpa tiket, tulis `{{CUSTOMER_QUESTION}}` sebagai placeholder yang jelas dan beritahu dia section A masih kosong. Jangan buat rekaan nampak macam rekod sebenar.
- Kekalkan perkataan customer. Betulkan typo yang mengelirukan sahaja — jangan tulis semula jadi bahasa kemas.
- Buang nama orang, nama syarikat dan nombor projek sebelum masuk vault.

### B. Email Reply

Jawapan siap-hantar. Peraturan ni wajib, satu pun tak boleh dilanggar:

- **Buka terus dengan jawapan.** Tiada "Hi [Name]", tiada nama orang, tiada nama syarikat. Reply ni generic, sedia pakai untuk sesiapa.
- **Satu idea satu perenggan.** Perenggan maksimum 2 ayat.
- **Ayat pendek.** Kalau satu ayat lebih 20 patah, pecahkan.
- **Langkah berturutan guna senarai bernombor pendek** (`<ol>`), jangan himpun dalam satu perenggan panjang.
- **Pautan TUA sebagai baris berasingan di bawah**, dalam blok `.kb-email-links`, bukan disisip tengah ayat. **Maksimum 2.**
- **Tutup dengan jemputan balas emel.** Contoh nada: "Let me know if this helps" atau "Reply here if it still happens after this".
- **JANGAN sesekali suruh mereka call, phone, atau hubungi terus. Jangan sebut pun perkataan call.** Emel sahaja.
- Nada: profesional, kemas, mesra. Bukan bahasa manual.
- **Maksimum 150 patah keseluruhan**, termasuk baris pautan dan baris penutup.

Butang Copy mesti bawa URL TUA sekali dalam teks yang disalin, format `Title: https://...` pada baris sendiri. Itu berlaku automatik selagi setiap pautan berdiri sendiri dalam `<p class="kb-email-link">` — anchor yang bersendirian dalam bloknya disalin sebagai `Title: URL`, anchor di tengah ayat disalin sebagai `Title (URL)`. Selepas menulis, uji hasil salinan: plain text bersih, tiada tag HTML, tiada entity seperti `&amp;`.

### C. Detailed SOP

Rujukan penuh untuk Taufik sendiri, bukan untuk customer. Boleh panjang. Petakan bahan riset kepada blok ni:

- **Issue Summary** — 1–2 ayat, sahkan kefahaman.
- **Before You Start / Prerequisites** → Stage Cards (lesen, role, versi, fail konfigurasi yang perlu ada).
- **Likely Causes** → Stage Cards, disusun ikut kekerapan sebenar.
- **Resolution** → Timeline langkah bernombor. Elemen UI dalam **bold**: Klik **File** > **Settings**.
- **Perbezaan versi / jebakan** → Warning Box dan jadual versi.
- **Official Reference** → pautan TUA sebenar, sentiasa blok terakhir.

Section C tiada had panjang dan tiada had pautan — semua rujukan TUA yang dibaca masuk sini.

Nada page: Bahasa Inggeris (customer-facing, Trimble SEA), melainkan Taufik minta Bahasa Melayu. Istilah UI Tekla kekal dalam Bahasa Inggeris walau apa pun bahasa page.

---

## Langkah 3 — Render (Mod Page sahaja)

Mula daripada template dalam **Lampiran A**. **Jangan tulis template dari kosong.**

Peraturan yang tidak boleh dilanggar:
- Tukar **hanya** placeholder `{{...}}` dalam template.
- `<head>`, `tailwind.config`, `<header>`, shell sidebar (`.kb-shell`, `#kb-sidebar`, `#kb-overlay`, `#kb-burger`), `<footer>`, dan kedua-dua `<script>` — kekal 100% seperti asal. Ini yang buat sidebar, search dan setiap page nampak satu keluarga.
- **Jangan sentuh `assets/kb.css` atau `assets/kb.js` untuk satu page.** Kalau satu page perlu style baru, style tu masuk `kb.css` sebagai komponen yang boleh guna semula, bukan `<style>` dalam page.
- `window.KB_ROOT` mesti tepat: `'../../'` untuk page dua aras (`tekla/<slug>/`).
- Satu fail HTML per page. Tailwind CDN. Tiada build step.
- Icon: inline SVG gaya Heroicons sahaja. Tiada FontAwesome, tiada CDN icon lain.
- Kekalkan kelas grid responsif (`grid-cols-1 md:grid-cols-2 xl:grid-cols-3`).

Aras heading dalam section C: sub-section dibalut `<div class="kb-sub mb-14">` dengan `<h3>`, tajuk kad `<h4>`, tajuk warning box `<h5>`. Jangan guna `<h2>` dalam section C — `<h1>` hero dan label A/B/C sudah pegang aras atas.

Snippet komponen penuh ada dalam **Lampiran B** — baca sebelum menulis `{{SOP_CONTENT}}`.

---

## Langkah 4 — Daftar dalam `search-index.json` (WAJIB)

Page yang tiada entry dalam `search-index.json` **tidak wujud** — ia tak muncul dalam sidebar, tak muncul dalam hub, tak boleh dicari. Satu page baru = satu entry baru. Format ada dalam **Lampiran C**.

`question` dan `keywords` itulah yang buat page tu boleh dijumpai. Masukkan perkataan customer sendiri, nama dialog tepat, nama column, dan nama advanced option. Jangan letak keyword generic macam "tekla" atau "problem".

Sahkan JSON masih sah selepas edit:

```
python3 -c "import json; d=json.load(open('search-index.json')); print(len(d['pages']), 'pages')"
```

---

## Langkah 5 — Hantar

**Dalam chat (claude.ai):**
Tulis fail ke `/mnt/user-data/outputs/<slug>.html` dan panggil `present_files`. Jangan paste 300 baris HTML dalam chat. Selepas fail, tulis 2–3 baris sahaja: apa yang disemak, dan sebarang jurang yang TUA tak jawab.

**Dalam Claude Code:**
Simpan sebagai `tekla/<slug>/index.html` dalam repo SOP Taufik (`taufikmusa/sop`, GitHub Pages dari branch `main`, root). Kemudian:

1. Tambah entry dalam `search-index.json` (Langkah 4). Hub dan sidebar update sendiri — **jangan** edit `index.html` untuk tambah kad, hub tu render daripada index.
2. Uji: `python3 -m http.server 8000`, buka page tu, sahkan sidebar terisi, search jumpa page baru, dan butang Copy keluarkan plain text yang betul.
3. `git add . && git commit -m "tekla: <slug>" && git push`
4. Beritahu URL live: `https://taufikmusa.github.io/sop/tekla/<slug>/`

`<slug>` = kebab-case, deskriptif, kekal: `clash-check-setup`, `numbering-series-reset`, `drawing-not-updating`.

Pastikan fail `.nojekyll` wujud di root repo. Jangan buat repo baru untuk setiap page.

---

## Mod Jawapan (bukan page)

Struktur yang sama, tetapi markdown:

1. **Ringkasan isu** — satu perenggan pendek.
2. **Penyelesaian** — heading bold untuk setiap kaedah, senarai bernombor untuk langkah, elemen UI dalam **bold**.
3. **Nota versi** kalau berkaitan.
4. **Source:** `[Tajuk artikel](URL)`

Elak dinding teks. Kalau jawapan melebihi ~12 langkah, tawarkan untuk tukar ke Mod Page.

---

## Senarai semak sebelum hantar

**Riset**
- [ ] Setiap laluan menu datang daripada halaman TUA yang benar-benar dibaca, bukan ingatan
- [ ] URL sumber sah dan boleh diklik (muncul dalam keputusan carian, bukan direka)
- [ ] Versi dinyatakan; perbezaan antara versi ditandakan kalau ada
- [ ] Skop Tekla Structures sahaja

**Section A**
- [ ] Soalan datang daripada tiket sebenar — atau Taufik sudah ditanya dan sedar ia placeholder
- [ ] Nama orang, syarikat dan nombor projek sudah dibuang

**Section B**
- [ ] Tiada salam pembuka, tiada nama
- [ ] Setiap perenggan ≤ 2 ayat; setiap ayat ≤ 20 patah
- [ ] Langkah berturutan dalam `<ol>`
- [ ] ≤ 2 pautan TUA, dalam blok `.kb-email-links` di bawah, satu baris satu pautan
- [ ] Baris terakhir menjemput balas emel
- [ ] Perkataan *call* / *phone* / *contact us* tiada langsung
- [ ] ≤ 150 patah keseluruhan
- [ ] Butang Copy diuji: plain text bersih, `Title: URL` pada baris sendiri

**Shell**
- [ ] head/header/sidebar/footer/script tidak disentuh; `KB_ROOT` betul
- [ ] Tiada `<style>` dalam page; tiada icon library luar; SVG inline sahaja
- [ ] Tiada pautan video di mana-mana

**Terbit**
- [ ] Entry ditambah dalam `search-index.json` dan JSON masih sah
- [ ] Diuji atas HTTP: sidebar terisi, search jumpa page baru
- [ ] Fail dihantar (`present_files` dalam chat, atau di-push dalam Claude Code) — bukan sekadar dipaparkan

---

# Lampiran A — KB Page Shell

Shell knowledge base semasa: header brand, sidebar kiri yang kekal pada setiap page, kotak search, hero, tiga section A/B/C, footer. Sidebar dan search dibina oleh `assets/kb.js` daripada `search-index.json` — page tak perlu senaraikan apa-apa sendiri.

Salin bulat-bulat. Tukar hanya placeholder.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}} | Tekla Structures FAQ Vault</title>
    <!-- Google Fonts: Open Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        if (window.tailwind) tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['"Open Sans"', 'sans-serif'] },
                    colors: {
                        trimble: {
                            blue: '#0063A3', darkBlue: '#003054', midBlue: '#004F83',
                            lightBlue: '#368FC7', darkGrey: '#252A2E', grey: '#464B52',
                            lightGrey: '#90939F', accent: '#FBAD26',
                        }
                    }
                }
            }
        }
    </script>
    <script>window.KB_ROOT = '../../';</script>
    <link rel="stylesheet" href="../../assets/kb.css">
</head>
<body>
    <header class="std-header">
        <div class="std-container">
            <button type="button" id="kb-burger" class="kb-burger" aria-label="Show all pages" aria-expanded="false" aria-controls="kb-sidebar">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <a href="../../" class="std-brand" style="text-decoration:none;">Tekla <span>Structures FAQ Vault</span></a>
        </div>
    </header>

    <div class="kb-shell">
        <aside class="kb-sidebar" id="kb-sidebar" aria-label="Knowledge base pages"></aside>
        <div class="kb-overlay" id="kb-overlay"></div>

        <div class="kb-main">

            <section class="std-hero">
                <div class="std-container">
                    <div class="kb-eyebrow">{{EYEBROW}}</div>
                    <h1>{{HERO_TITLE}}</h1>
                    <p>{{HERO_SUBTITLE}}</p>
                </div>
            </section>

            <main class="std-container pb-20">

                <!-- ============ A. CUSTOMER QUESTION ============ -->
                <section class="kb-block mb-16">
                    <div class="kb-section-label"><b>A</b> Customer Question</div>
                    <div class="kb-question">
                        <p>&ldquo;{{CUSTOMER_QUESTION}}&rdquo;</p>
                        <p class="kb-question-meta">Recorded verbatim from the ticket. {{PRODUCT_VERSION}}.</p>
                    </div>
                </section>

                <!-- ============ B. EMAIL REPLY ============ -->
                <section class="kb-block mb-16">
                    <div class="kb-section-label"><b>B</b> Email Reply</div>
                    <div class="kb-email">
                        <div class="kb-email-bar">
                            <span>Ready to send</span>
                            <button type="button" class="kb-copy-btn" data-kb-copy="#kb-email-body">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                <span data-kb-copy-label>Copy</span>
                            </button>
                        </div>
                        <div class="kb-email-body" id="kb-email-body">
                            {{EMAIL_REPLY_PARAGRAPHS_AND_STEPS}}
                            <div class="kb-email-links">
                                <p class="kb-email-link"><a href="{{TUA_URL_1}}" target="_blank" rel="noopener">{{TUA_TITLE_1}}</a></p>
                                <p class="kb-email-link"><a href="{{TUA_URL_2}}" target="_blank" rel="noopener">{{TUA_TITLE_2}}</a></p>
                            </div>
                            <p class="kb-email-sign">{{CLOSING_INVITATION}}</p>
                        </div>
                        <div class="kb-email-foot">Copy takes the plain text only, with each TUA link as &ldquo;Title: URL&rdquo; on its own line.</div>
                    </div>
                </section>

                <!-- ============ C. DETAILED SOP ============ -->
                <section>
                    <div class="kb-section-label"><b>C</b> Detailed SOP</div>
                    <p class="kb-sop-intro">Internal reference. Everything below is background for the reply above &mdash; do not paste it to the customer.</p>

                    {{SOP_CONTENT}}
                </section>

            </main>

            <footer class="std-footer">
                <div class="std-container">
                    <p>&copy; Tekla Structures Service Team Resources. Internal Use Only.</p>
                </div>
            </footer>

        </div>
    </div>

    <script src="../../assets/kb.js"></script>
</body>
</html>
```

---

# Lampiran B — Component Library

Salin snippet ni terus untuk `{{SOP_CONTENT}}`. Jangan ubah kelas warna, radius, atau struktur. Isi hanya teksnya.

Kandungan:
1. Sub-section wrapper + heading (section C)
2. Stage Card
3. Step Timeline
4. Warning / Troubleshooting Box
5. Copyable Code / Prompt Box
6. Blok Official Reference
7. Jadual perbezaan versi
8. Blok Email Reply (section B)

---

## 1. Sub-section wrapper + heading — untuk setiap blok dalam section C

```html
<div class="kb-sub mb-14">
    <h3 class="text-xl font-bold text-trimble-darkBlue mb-6 border-b border-gray-200 pb-2">Section Title</h3>
    <!-- content -->
</div>
```

Blok terakhir dalam section C (Official Reference) guna `<div>` kosong tanpa `kb-sub mb-14`, supaya tiada ruang tergantung di bawah.

---

## 2. Stage Card — prasyarat, kategori, punca

Guna dalam grid: `<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">`

```html
<div class="stage-card bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <div class="text-trimble-blue font-black text-xs uppercase tracking-widest mb-2">CATEGORY/TAG</div>
    <h4 class="text-lg font-bold text-trimble-darkBlue mb-3">Card Title</h4>
    <p class="text-sm text-gray-600 leading-relaxed">Description goes here.</p>
</div>
```

---

## 3. Step Timeline — workflow berturutan

```html
<ol class="relative border-l-2 border-trimble-blue/20 ml-3 space-y-8">
    <li class="ml-8 relative">
        <span class="absolute flex items-center justify-center w-8 h-8 bg-trimble-blue rounded-full -left-[2.65rem] ring-4 ring-white shadow-sm">
            <span class="text-white font-bold text-sm">1</span>
        </span>
        <h4 class="flex items-center mb-1 text-lg font-bold text-trimble-darkBlue">Step Title</h4>
        <p class="text-sm text-gray-600">Step details here.</p>
    </li>
</ol>
```

Elemen UI dalam teks langkah sentiasa bold: `Click <strong>File</strong> &gt; <strong>Settings</strong>`.
Warning box boleh diletak di dalam `<li>` kalau amaran tu khusus untuk langkah tersebut.

---

## 4. Warning / Troubleshooting Box

```html
<div class="mt-8 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r shadow-sm">
    <h5 class="text-sm font-bold text-amber-800 flex items-center">
        <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        Warning / Troubleshooting
    </h5>
    <p class="mt-1 text-sm text-amber-700">Warning text goes here.</p>
</div>
```

---

## 5. Copyable Code / Prompt Box

Untuk advanced options, kandungan `.xml`/`.ini`, path fail, atau snippet macro.

```html
<div class="bg-[#1e1e1e] p-4 rounded-lg shadow-lg border-2 border-gray-200 mb-4">
    <pre class="text-[#d4d4d4] font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed">Your code/prompt here</pre>
</div>
```

---

## 6. Blok Official Reference — sentiasa blok terakhir dalam section C

```html
<div>
    <h3 class="text-xl font-bold text-trimble-darkBlue mb-6 border-b border-gray-200 pb-2">Official Reference</h3>
    <div class="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <p class="text-sm text-gray-600 mb-3">This guide follows the official Tekla User Assistance documentation:</p>
        <div class="space-y-2">
            <div><a href="TUA_URL" target="_blank" rel="noopener" class="text-trimble-blue font-bold hover:underline">Article Title &rarr;</a></div>
        </div>
        <p class="text-xs text-gray-500 mt-4">Verified against Tekla Structures VERSION. Steps may differ in older versions.</p>
    </div>
</div>
```

URL mesti URL sebenar daripada keputusan carian. Kalau tiada artikel rasmi, tukar blok ni kepada nota jujur bahawa isu tersebut tiada dalam TUA dan arahkan escalate kepada local Tekla support.

---

## 7. Jadual perbezaan versi

```html
<div class="overflow-x-auto">
  <table class="w-full text-sm border border-gray-200 rounded-lg">
    <thead class="bg-gray-50">
      <tr>
        <th class="text-left p-3 font-bold text-trimble-darkBlue border-b border-gray-200">Version</th>
        <th class="text-left p-3 font-bold text-trimble-darkBlue border-b border-gray-200">Behaviour / Path</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="p-3 border-b border-gray-100 font-semibold">2026</td><td class="p-3 border-b border-gray-100 text-gray-600">…</td></tr>
      <tr><td class="p-3 border-b border-gray-100 font-semibold">2023–2025</td><td class="p-3 border-b border-gray-100 text-gray-600">…</td></tr>
    </tbody>
  </table>
</div>
```

---

## 8. Blok Email Reply — badan section B

Perenggan dan langkah masuk sebelum `.kb-email-links`. Pautan satu baris satu, penutup selepasnya.

```html
<p>Satu idea, maksimum dua ayat.</p>
<p>Idea kedua, perenggan sendiri.</p>
<ol>
    <li>Langkah pertama, pendek.</li>
    <li>Langkah kedua.</li>
</ol>
<p>Sebab atau jebakan yang paling kerap, dua ayat.</p>
<div class="kb-email-links">
    <p class="kb-email-link"><a href="TUA_URL_1" target="_blank" rel="noopener">Article Title 1</a></p>
    <p class="kb-email-link"><a href="TUA_URL_2" target="_blank" rel="noopener">Article Title 2</a></p>
</div>
<p class="kb-email-sign">Let me know if this helps, or reply here if it still happens after this.</p>
```

---

# Lampiran C — Entry `search-index.json`

Satu page = satu entry dalam `pages[]`. `url` relatif kepada root site.

```json
{
  "id": "tekla-my-new-page",
  "title": "Tajuk page yang pendek",
  "folder": "Tekla Structures",
  "category": "Drawings",
  "product": "Tekla Structures 2026",
  "url": "tekla/my-new-page/",
  "question": "Soalan customer dalam satu atau dua ayat.",
  "summary": "Satu baris keterangan yang muncul dalam hub.",
  "keywords": ["symptom", "nama dialog", "nama column", "XS_ADVANCED_OPTION"]
}
```

| Field | Peranan |
|---|---|
| `id` | Unik, kebab-case, berprefiks folder |
| `title` | Muncul dalam sidebar dan hub |
| `folder` | Kumpulan dalam sidebar. Sekarang `Tekla Structures` |
| `category` | Sub-label kecil bawah tajuk dalam sidebar |
| `product` | Versi yang page tu disahkan terhadapnya |
| `url` | Mesti berakhir dengan `/` |
| `question` | Soalan customer — bahan carian utama |
| `summary` | Satu ayat untuk hub |
| `keywords` | Simptom, nama dialog, nama column, advanced option |
