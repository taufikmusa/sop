---
name: tekla-site-helper
description: >
  Jawab soalan sokongan Tekla Structures berdasarkan dokumentasi rasmi Tekla User Assistance
  (support.tekla.com, docs.tekla.com) sahaja, kemudian hantar dalam chat ATAU sebagai satu page
  HTML dalam knowledge base "Tekla Structures FAQ Vault" (struktur A/B/C: Customer Question, Email
  Reply, Detailed SOP). Guna skill ini SETIAP KALI ada soalan "macam mana nak buat X dalam Tekla",
  mesej ralat Tekla, atau permintaan SOP/guide/page untuk workflow Tekla — termasuk sebutan "tekla
  sop", "tekla site helper", "buat page Tekla", "guide Tekla", "cari dalam TUA", "FAQ Vault",
  "service documentation". Trigger walaupun HTML atau skill tak disebut. WAJIB cari dokumentasi
  rasmi dahulu dan jangan reka laluan menu. Subjek mesti Tekla Structures; PowerFab hanya kalau ia
  sebelah integrasi Tekla Structures, soalan PowerFab tulen ke powerfab-training-docs. BERBEZA
  daripada tekla-model-macro, tekla-drawing-macro, tekla-visual-studio-skill (kod C#) dan
  sop-retro-brutalist-style (SOP dalaman retro-brutalist).
---

# Tekla Site Helper

Tiga kerja dalam satu skill:

1. **Jawapan sokongan yang sahih** — berpandukan Tekla User Assistance (TUA) rasmi, bukan ingatan.
2. **Susun jadi A/B/C** — Customer Question, Email Reply, Detailed SOP.
3. **Terbit ke FAQ Vault** — satu page HTML dalam knowledge base, plus satu entry dalam `search-index.json`.

Jangan sesekali langkau kerja 1 dan terus ke kerja 3. Page yang cantik tapi menu path salah lebih memudaratkan daripada tiada page langsung.

**Skop: subjeknya mesti Tekla Structures.**

Produk lain boleh masuk *kalau* ia bersambung dengan Tekla Structures — contohnya export ke PowerFab, model exchange, atau apa-apa handoff antara dua produk tu. Dalam kes macam ni tulis dari sudut Tekla Structures: apa yang user buat dalam Tekla Structures, dan di mana sempadan penyerahan itu. Bahagian yang berlaku sepenuhnya dalam produk lain, rujuk keluar sahaja — jangan cuba dokumenkan di sini.

Yang di luar skop ialah soalan yang **langsung tak sentuh Tekla Structures** — workflow dalaman PowerFab semata-mata, atau produk Tekla lain yang berdiri sendiri. Soalan PowerFab tulen pergi ke skill `powerfab-training-docs`, bukan vault ni.

Ujian ringkas: adakah jawapannya melibatkan sekurang-kurangnya satu langkah di dalam Tekla Structures? Kalau ya, ia layak masuk.

---

## Peta repo — baca ini dulu dalam session baru

Repo: `taufikmusa/sop`. GitHub Pages dari branch `main`, root. Live di `https://taufikmusa.github.io/sop/`.

```
index.html            Hub - kotak search + senarai penuh, dirender daripada index
search-index.json     Sumber tunggal untuk sidebar, senarai hub dan search
assets/kb.css         Shell: sidebar, search, section A/B/C, butang Copy
assets/kb.js          Bina sidebar, live filter, drawer mobile, copy-as-plain-text
tools/check-pages.py  Penguat kuasa peraturan skill ini
tekla/<slug>/         Satu folder satu page
```

**Langkah pertama sekali, sebelum apa-apa: baca `search-index.json`.** Ia memberitahu apa yang sudah ada dalam vault. Jangan andaikan vault kosong.

Kalau soalan yang masuk itu **soalan sama yang dah ada page**, cuma berbunyi lain:

- **Jangan buat page baru.** Tambah ayat baru tu ke blok "Also asked as" pada page sedia ada dan ke `variants` dalam index.
- Page kedua untuk soalan yang sama memecahkan search dan memaksa Taufik pilih antara dua page yang hampir serupa.

Buat page baru hanya bila ia soalan yang **berlainan**, bukan ayat yang berlainan.

---

## Langkah 0 — Tentukan mod output

| Isyarat daripada pengguna | Mod |
|---|---|
| Soalan pantas, satu isu, "kenapa ni jadi", "macam mana nak…" | **Mod Jawapan** (markdown dalam chat) |
| "buat SOP", "buat page", "buat guide", "HTML", "untuk team", "nak share link", "training material" | **Mod Page** (page dalam vault) |
| Workflow 4 langkah atau lebih, atau melibatkan beberapa tool/dialog | **Mod Page** — walaupun dia tak minta |
| Taufik paste QnA yang dia dah tulis (.docx, emel, teks) | **Mod Page** — ikut Langkah 0b |
| Betul-betul kabur | Tanya sekali sahaja, ringkas. Jangan tanya bertalu-talu. |

---

## Langkah 0b — Kalau Taufik paste QnA yang dia dah tulis

Selalunya bahan tu bukan soalan mentah customer, tetapi QnA yang Taufik sendiri dah jawab — fail .docx, emel lama, atau teks yang dia paste terus. Boleh terus jadi page. Tapi **jangan salin bulat-bulat.**

Jalannya begini:

1. **Asingkan Q dan A** daripada bahan tu.
2. **Jadikan soalan generic** ikut peraturan Section A di bawah.
3. **Sahkan setiap dakwaan dalam jawapan lama terhadap TUA.** Ini bahagian yang paling penting dan paling kerap dilangkau. Jawapan yang ditulis tergesa-gesa untuk satu customer selalunya ada satu butiran yang salah, dan butiran tu akan hidup selama-lamanya kalau disalin masuk vault. Nama laluan menu, nama advanced option, dan **tempat sesuatu setting itu ditetapkan** adalah yang paling kerap tersasar.
4. **Betulkan apa yang salah, dan catat pembetulan tu** dalam Detailed SOP sebagai warning box — supaya orang seterusnya tak ulang silap yang sama.
5. **Tulis semula reply** ikut peraturan Section B. Jawapan lama hampir pasti melanggar peraturan tu: ada salam pembuka, perenggan panjang, pautan tersisip tengah ayat.
6. **Kembangkan jadi Detailed SOP.** Jawapan asal biasanya cukup untuk satu customer sahaja. Section C perlu punca, langkah penuh, perbezaan versi, dan jalan escalate.
7. **Tambah topik berkaitan** yang jawapan asal tak sentuh tetapi TUA sahkan — mesej ralat berkaitan, versi lama yang berlainan caranya, dan cara elak berulang.

**Bila jawapan lama bercanggah dengan TUA, TUA menang.** Beritahu Taufik apa yang dibetulkan dan mana sumbernya. Jangan senyap-senyap tukar, dan jangan kekalkan yang salah semata-mata sebab itu yang dah dihantar kepada customer.

**Kalau butiran teknikal dalam jawapan lama tak dapat disahkan langsung dalam TUA:** buang daripada Email Reply, dan dalam Detailed SOP tandakan ia belum disahkan. Jangan naikkan taraf tekaan jadi prosedur rasmi.

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

Bukan transkrip satu tiket. Ini **bentuk generic** soalan itu — satu ayat rujukan yang customer seterusnya, yang tanya benda lebih kurang sama, akan cam sebagai soalan dia juga.

**Bila Taufik paste soalan customer sebenar, jadikan ia generic:**

1. **Buang identiti.** Nama orang, nama syarikat, nombor projek, nama model, nombor tiket, tarikh — semua keluar.
2. **Buang butiran sekali guna.** "minggu lepas", "dua tiga batang beam", "job 4471" — tukar kepada bentuk umum, atau buang terus.
3. **Kekalkan perkataan simptom.** Ini yang paling penting. "dimensions have not moved", "will not open", "already unlocked" — biarkan dalam perkataan customer. Perkataan simptom inilah yang buat orang jumpa page ni nanti.
4. **Kekalkan bunyi customer.** Jangan tulis semula jadi bahasa dokumentasi. Kalau dia tanya "Is this a bug?", biarkan.
5. **Longgarkan versi** dalam badan soalan kalau isu tu bukan khusus versi. Versi duduk dalam baris meta bawah kotak, bukan dalam soalan.

Hasilnya satu soalan, dalam kotak berlorek, pendek.

**Blok "Also asked as".** Bawah soalan tu, senaraikan 3–5 cara lain soalan sama masuk — termasuk cara yang lebih teknikal dan cara yang lebih kabur. Setiap baris tu **mesti** disalin ke array `variants` dalam `search-index.json`, sebab di situlah ia jadi boleh dicari. Blok pada page dan array dalam index kena sama, perkataan demi perkataan.

**Bila soalan yang sama masuk lagi, dengan ayat lain:** jangan buat page baru. Tambah ayat baru tu ke dalam blok "Also asked as" dan ke dalam `variants`. Satu page, banyak pintu masuk.

**Yang tak boleh:**
- **Jangan reka soalan bila memang tiada punca.** Kalau tiada tiket, tiada emel, tiada apa-apa daripada customer sebenar — tanya Taufik dulu dan berhenti. Membuat generic daripada soalan sebenar itu satu hal; mengarang soalan daripada kosong itu hal lain.
- Kalau dia mahu page disiapkan juga tanpa punca, tulis `{{CUSTOMER_QUESTION}}` sebagai placeholder yang jelas dan beritahu section A masih kosong. Jangan buat rekaan nampak macam rekod sebenar.
- Baris meta bawah kotak jangan kata "verbatim". Ia berbunyi: bentuk generic soalan customer sebenar, butiran identiti dibuang, plus versi.

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

`question`, `variants` dan `keywords` itulah yang buat page tu boleh dijumpai. `question` bentuk generic, `variants` cara lain orang tanya benda sama, `keywords` nama dialog tepat, nama column dan nama advanced option. Masukkan perkataan customer sendiri. Jangan letak keyword generic macam "tekla" atau "problem".

Bila soalan sama masuk dengan ayat berbeza, tambah ayat tu ke `variants` — jangan buat page kedua.

Sahkan JSON masih sah selepas edit:

```
python3 -c "import json; d=json.load(open('search-index.json')); print(len(d['pages']), 'pages')"
```

---

## Langkah 5 — Hantar

**Dalam chat (claude.ai):**
Tulis fail ke `/mnt/user-data/outputs/<slug>.html` dan panggil `present_files`. Jangan paste 300 baris HTML dalam chat. Selepas fail, tulis 2–3 baris sahaja: apa yang disemak, dan sebarang jurang yang TUA tak jawab.

**Dalam Claude Code:**
Simpan sebagai `tekla/<slug>/index.html`. Kemudian:

1. Tambah entry dalam `search-index.json` (Langkah 4). Hub dan sidebar update sendiri — **jangan** edit `index.html` untuk tambah kad, hub tu render daripada index.
2. Jalankan penguat kuasa:

   ```
   python3 tools/check-pages.py
   ```

   Ia semak shell, padanan page dengan index, dan setiap peraturan Section B. **Kena PASS sebelum commit.** Jangan longgarkan checker tu supaya page lulus — betulkan page.
3. Uji dalam browser: `python3 -m http.server 8000`, buka page tu, sahkan sidebar terisi, search jumpa page baru dengan perkataan daripada `variants`, dan butang Copy keluarkan plain text dengan `Title: URL` pada baris sendiri.
4. Kerja atas branch, jangan tolak terus ke `main`:

   ```
   git checkout -b claude/tekla-<slug>
   git add . && git commit -m "tekla: <slug>"
   git push -u origin claude/tekla-<slug>
   ```

   Kemudian buka PR. **Jangan merge** melainkan Taufik suruh — dia yang merge.
5. Beritahu URL live selepas merge: `https://taufikmusa.github.io/sop/tekla/<slug>/`

Satu PR yang dah di-merge tak boleh terima commit baru. Kalau ada kerja susulan selepas PR di-merge, buat branch baru dan PR baru — jangan tolak atas branch lama dan sangka ia masuk.

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
- [ ] Kalau bahan datang daripada QnA lama: setiap dakwaan dalam jawapan tu disemak semula, bukan disalin
- [ ] Apa-apa pembetulan dicatat dalam SOP dan diberitahu kepada Taufik
- [ ] URL sumber sah dan boleh diklik (muncul dalam keputusan carian, bukan direka)
- [ ] Versi dinyatakan; perbezaan antara versi ditandakan kalau ada
- [ ] Skop Tekla Structures sahaja

**Section A**
- [ ] Soalan datang daripada punca sebenar — atau Taufik sudah ditanya dan sedar ia placeholder
- [ ] Nama orang, syarikat, nombor projek, nombor tiket dan tarikh sudah dibuang
- [ ] Butiran sekali guna dibuang, tetapi perkataan simptom customer dikekalkan
- [ ] Blok "Also asked as" ada 3–5 baris
- [ ] Blok tu sama, perkataan demi perkataan, dengan `variants` dalam `search-index.json`
- [ ] Baris meta tidak kata "verbatim"

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
- [ ] `python3 tools/check-pages.py` PASS
- [ ] Soalan ni memang belum ada page — kalau dah ada, `variants` ditambah, bukan page baru
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
                        <p>&ldquo;{{GENERIC_CUSTOMER_QUESTION}}&rdquo;</p>
                        <div class="kb-question-variants">
                            <p class="kb-question-variants-title">Also asked as</p>
                            <ul>
                                <li>{{VARIANT_1}}</li>
                                <li>{{VARIANT_2}}</li>
                                <li>{{VARIANT_3}}</li>
                            </ul>
                        </div>
                        <p class="kb-question-meta">Generic form of a real customer question &mdash; names, company and project details removed. {{PRODUCT_VERSION}}.</p>
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
  "question": "Bentuk generic soalan customer, satu atau dua ayat.",
  "variants": [
    "Cara lain soalan sama masuk.",
    "Versi yang lebih teknikal.",
    "Versi yang lebih kabur."
  ],
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
| `question` | Bentuk generic soalan customer — bahan carian utama |
| `variants` | Cara lain soalan sama masuk. Mesti sama, perkataan demi perkataan, dengan blok "Also asked as" pada page. Ini yang buat soalan berbunyi lain tetap jumpa page ni |
| `summary` | Satu ayat untuk hub |
| `keywords` | Simptom, nama dialog, nama column, advanced option |
