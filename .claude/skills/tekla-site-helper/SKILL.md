---
name: tekla-site-helper
description: >
  Jawab soalan sokongan Tekla Structures dan Tekla PowerFab berdasarkan dokumentasi rasmi Tekla
  User Assistance (support.tekla.com, docs.tekla.com) sahaja, kemudian hantar sebagai jawapan
  support berstruktur dalam chat ATAU satu fail HTML gaya Trimble Service Documentation yang sedia
  di-host. Guna skill ini SETIAP KALI ada soalan "macam mana nak buat X dalam Tekla", mesej ralat
  Tekla, atau permintaan SOP/guide/page untuk workflow Tekla — termasuk sebutan "tekla sop",
  "tekla site helper", "buat page Tekla", "guide Tekla", "cari dalam TUA", "service
  documentation". Trigger walaupun HTML atau skill tak disebut. WAJIB cari dokumentasi rasmi
  dahulu dan jangan reka laluan menu. BERBEZA daripada tekla-model-macro, tekla-drawing-macro dan
  tekla-visual-studio-skill (semua tu tulis kod C#) serta sop-retro-brutalist-style (SOP dalaman
  gaya retro-brutalist).
---

# Tekla Site Helper

Dua kerja dalam satu skill:

1. **Jawapan sokongan yang sahih** — berpandukan Tekla User Assistance (TUA) rasmi, bukan ingatan.
2. **Penerbitan** — jawapan yang sama dirender jadi satu fail HTML gaya Trimble Service Documentation, sedia untuk di-host.

Jangan sesekali langkau bahagian 1 dan terus ke bahagian 2. Page yang cantik tapi menu path salah lebih memudaratkan daripada tiada page langsung.

---

## Langkah 0 — Tentukan mod output

| Isyarat daripada pengguna | Mod |
|---|---|
| Soalan pantas, satu isu, "kenapa ni jadi", "macam mana nak…" | **Mod Jawapan** (markdown dalam chat) |
| "buat SOP", "buat page", "buat guide", "HTML", "untuk team", "nak share link", "training material" | **Mod Page** (fail HTML) |
| Workflow 4 langkah atau lebih, atau melibatkan beberapa tool/dialog | **Mod Page** — walaupun dia tak minta |
| Betul-betul kabur | Tanya sekali sahaja, ringkas. Jangan tanya bertalu-talu. |

---

## Langkah 1 — Riset (WAJIB, tiada pengecualian)

1. Kenal pasti **versi Tekla**, **nama tool/dialog**, dan **teks ralat tepat** kalau ada. Kalau versi tak disebut, andaikan versi terkini dan nyatakan secara terbuka bahawa langkah mungkin berbeza untuk versi lama.
2. Cari dengan `web_search`. Query yang berkesan:
   - `site:support.tekla.com <tool/error>`
   - `Tekla Structures <versi> <nama dialog> user assistance`
   - `<teks ralat penuh> tekla`
3. `web_fetch` artikel TUA yang paling hampir. Baca langkah sebenar — jangan bergantung pada snippet carian sahaja.
4. Kalau isu tu merentas versi (contoh 2021 vs 2024 vs 2026), cari kedua-dua dan catat perbezaannya secara eksplisit.

**Garis merah:**
- Jangan reka laluan menu, nama butang, nama fail `.ini`/`.xml`, atau nilai advanced option. Kalau tak jumpa dalam dokumen rasmi, cakap tak jumpa.
- Jangan bina URL TUA sendiri. Guna hanya URL yang muncul dalam keputusan carian atau halaman yang telah di-fetch.
- Kalau TUA memang senyap tentang isu tu, katakan dengan jelas dan cadangkan hubungi local Tekla support / Trimble SEA. Lebih baik jawapan pendek yang jujur daripada page penuh yang mengarut.
- Forum, blog pihak ketiga dan YouTube boleh jadi petunjuk arah, tetapi tidak boleh jadi satu-satunya sumber. Tandakan ia sebagai tidak rasmi kalau terpaksa dipakai.

---

## Langkah 2 — Susun kandungan

Petakan bahan kepada blok tetap ini sebelum menulis sebarang HTML:

- **Ringkasan isu** — 1–2 ayat, sahkan kefahaman.
- **Prasyarat** → Stage Cards (lesen, role, versi, fail konfigurasi yang perlu ada).
- **Penyelesaian** → Timeline langkah bernombor. Elemen UI dalam **bold**: Klik **File** > **Settings**.
- **Perbezaan versi / jebakan** → Warning Box.
- **Rujukan rasmi** → pautan TUA sebenar, di penghujung.

Nada: profesional, jelas, mesra. Bahasa Inggeris untuk page yang customer-facing (Trimble SEA), melainkan Taufik minta Bahasa Melayu. Istilah UI Tekla kekal dalam Bahasa Inggeris walau apa pun bahasa page.

---

## Langkah 3 — Render (Mod Page sahaja)

Mula daripada template dalam **Lampiran A** di bawah. **Jangan tulis template dari kosong.**

Peraturan yang tidak boleh dilanggar:
- Tukar **hanya** `{{TITLE}}`, `{{HERO_TITLE}}`, `{{HERO_SUBTITLE}}`, `{{HERO_BUTTONS}}`, `{{MAIN_CONTENT}}`.
- `<head>`, `<style>`, `tailwind.config`, `<header>`, `<footer>` — kekal 100% seperti asal. Ini yang buat setiap page nampak satu keluarga.
- Satu fail sahaja. Tailwind CDN. Tiada build step.
- Icon: inline SVG gaya Heroicons sahaja. Tiada FontAwesome, tiada CDN icon lain.
- Kekalkan kelas grid responsif (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
- Setiap bahagian besar dibalut `<section class="mb-20">`, tajuknya `<h2 class="text-2xl font-bold text-trimble-darkBlue mb-8 border-b border-gray-200 pb-2">`.

Snippet komponen penuh ada dalam **Lampiran B** — baca sebelum menulis `{{MAIN_CONTENT}}`.

---

## Langkah 4 — Hantar

**Dalam chat (claude.ai):**
Tulis fail ke `/mnt/user-data/outputs/<slug>.html` dan panggil `present_files`. Jangan paste 300 baris HTML dalam chat. Selepas fail, tulis 2–3 baris sahaja: apa yang disemak, dan sebarang jurang yang TUA tak jawab.

**Dalam Claude Code:**
Simpan sebagai `tekla/<slug>/index.html` dalam repo SOP Taufik (`taufikmusa/sop`, GitHub Pages dari branch `main`, root). Kemudian:
1. Tambah kad baru dalam `index.html` hub supaya page tu boleh dijumpai.
2. `git add . && git commit -m "tekla: <slug>" && git push`
3. Beritahu URL live: `https://taufikmusa.github.io/sop/tekla/<slug>/`

`<slug>` = kebab-case, deskriptif, kekal: `clash-check-setup`, `numbering-series-reset`, `drawing-not-updating`.

Pastikan fail `.nojekyll` wujud di root repo. Jangan buat repo baru untuk setiap page.

---

## Mod Jawapan (bukan page)

Struktur yang sama, tetapi markdown:

1. **Pembukaan + ringkasan isu** — satu perenggan pendek.
2. **Penyelesaian** — heading bold untuk setiap kaedah, senarai bernombor untuk langkah, elemen UI dalam **bold**.
3. **Nota versi** kalau berkaitan.
4. **Source:** `[Tajuk artikel](URL)`

Elak dinding teks. Kalau jawapan melebihi ~12 langkah, tawarkan untuk tukar ke Mod Page.

---

## Senarai semak sebelum hantar

- [ ] Setiap laluan menu datang daripada halaman TUA yang benar-benar dibaca, bukan ingatan
- [ ] URL sumber sah dan boleh diklik (muncul dalam keputusan carian, bukan direka)
- [ ] Versi dinyatakan; perbezaan antara versi ditandakan kalau ada
- [ ] Template: head/style/header/footer tidak disentuh
- [ ] Tiada icon library luar; SVG inline sahaja
- [ ] Fail dihantar (`present_files` dalam chat, atau di-push dalam Claude Code) — bukan sekadar dipaparkan

---

# Lampiran A — Base Template

Salin bulat-bulat. Tukar hanya lima placeholder.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}} | Lifecycle Guide</title>
    <!-- Google Fonts: Open Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
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
    <style>
        body { font-family: 'Open Sans', sans-serif; color: #252A2E; display: flex; flex-direction: column; min-height: 100vh; background-color: #ffffff; overflow-x: hidden; }
        :root { --trimble-blue: #0063a3; --trimble-blue-dark: #004f83; --trimble-gray-dark: #252a2e; --slate-400: #94a3b8; --slate-700: #334155; --white: #ffffff; --border-color: #d1d5db; }
        .std-container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
        header.std-header { background-color: var(--white); border-bottom: 1px solid var(--border-color); padding: 15px 0; }
        .std-brand { font-size: 1.2rem; font-weight: 800; color: var(--trimble-blue); }
        .std-brand span { color: var(--trimble-gray-dark); font-weight: 400; }
        .std-hero { background: linear-gradient(135deg, var(--trimble-blue-dark) 0%, #0077c8 100%); color: white; padding: 60px 0; text-align: center; margin-bottom: 40px; }
        .std-hero h1 { font-size: 2.5rem; line-height: 1.2; color: white; margin-bottom: 1rem; font-weight: 700; }
        .std-hero p { opacity: 0.95; font-size: 1.15rem; max-width: 800px; margin: 0 auto; line-height: 1.8; }
        .std-footer { background-color: var(--trimble-gray-dark); color: var(--slate-400); padding: 1.5rem 0; text-align: center; font-size: 0.875rem; border-top: 1px solid var(--slate-700); margin-top: auto; }
        .stage-card { transition: all 0.3s ease; }
        .stage-card:hover { transform: translateY(-5px); border-color: #0063A3; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
    </style>
</head>
<body>
    <header class="std-header">
        <div class="std-container">
            <div class="std-brand">Trimble <span>Service Documentation</span></div>
        </div>
    </header>

    <section class="std-hero">
        <div class="std-container">
            <h1>{{HERO_TITLE}}</h1>
            <p class="mb-8">{{HERO_SUBTITLE}}</p>
            <div class="flex justify-center gap-4 mt-8 flex-wrap">
                {{HERO_BUTTONS}}
            </div>
        </div>
    </section>

    <main class="flex-grow std-container pb-20">
        {{MAIN_CONTENT}}
    </main>

    <footer class="std-footer">
        <div class="std-container">
            <p>&copy; 2026 Service Team Resources. Internal Use Only.</p>
        </div>
    </footer>
</body>
</html>
```

---

# Lampiran B — Component Library

Salin snippet ini terus. Jangan ubah kelas warna, radius, atau struktur. Isi hanya teksnya.

Kandungan:
1. Stage Card
2. Step Timeline
3. Warning / Troubleshooting Box
4. Action Buttons (hero)
5. Copyable Code / Prompt Box
6. Section wrapper + heading
7. Blok Official Reference
8. Jadual perbezaan versi

---

## 1. Stage Card — prasyarat, kategori, ciri

Guna dalam grid: `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`

```html
<div class="stage-card bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <div class="text-trimble-blue font-black text-xs uppercase tracking-widest mb-2">CATEGORY/TAG</div>
    <h3 class="text-lg font-bold text-trimble-darkBlue mb-3">Card Title</h3>
    <p class="text-sm text-gray-600 leading-relaxed">Description goes here.</p>
</div>
```

---

## 2. Step Timeline — workflow berturutan

```html
<ol class="relative border-l-2 border-trimble-blue/20 ml-3 space-y-8">
    <li class="ml-8 relative">
        <span class="absolute flex items-center justify-center w-8 h-8 bg-trimble-blue rounded-full -left-[2.65rem] ring-4 ring-white shadow-sm">
            <span class="text-white font-bold text-sm">1</span>
        </span>
        <h3 class="flex items-center mb-1 text-lg font-bold text-trimble-darkBlue">Step Title</h3>
        <p class="text-sm text-gray-600">Step details here.</p>
    </li>
</ol>
```

Elemen UI dalam teks langkah sentiasa bold: `Click <strong>File</strong> &gt; <strong>Settings</strong>`.
Warning box boleh diletak di dalam `<li>` kalau amaran tu khusus untuk langkah tersebut.

---

## 3. Warning / Troubleshooting Box

```html
<div class="mt-8 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r shadow-sm">
    <h3 class="text-sm font-bold text-amber-800 flex items-center">
        <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        Warning / Troubleshooting
    </h3>
    <p class="mt-1 text-sm text-amber-700">Warning text goes here.</p>
</div>
```

---

## 4. Action Buttons — untuk `{{HERO_BUTTONS}}`

Pautan utama (dokumen, TUA, fail):
```html
<a href="#" target="_blank" class="bg-white text-trimble-darkBlue font-bold py-3 px-6 rounded shadow-lg hover:bg-gray-100 transition-colors flex items-center">
    <svg class="w-5 h-5 mr-2 text-trimble-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg> Link Text
</a>
```

**JANGAN sesekali letak butang video.** `{{HERO_BUTTONS}}` adalah untuk pautan dokumentasi TUA sahaja — tiada butang video, tiada YouTube, tiada pautan main video walaupun TUA sendiri ada video untuk topik tu.

Kalau tiada pautan dokumen, tinggalkan `{{HERO_BUTTONS}}` kosong. Jangan letak butang mati.

---

## 5. Copyable Code / Prompt Box

Untuk advanced options, kandungan `.xml`/`.ini`, path fail, atau snippet macro.

```html
<div class="bg-[#1e1e1e] p-4 rounded-lg shadow-lg border-2 border-gray-200 mb-4">
    <pre class="text-[#d4d4d4] font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed">Your code/prompt here</pre>
</div>
```

---

## 6. Section wrapper + heading

```html
<section class="mb-20">
    <h2 class="text-2xl font-bold text-trimble-darkBlue mb-8 border-b border-gray-200 pb-2">Section Title</h2>
    <!-- content -->
</section>
```

---

## 7. Blok Official Reference — sentiasa section terakhir

```html
<section class="mb-20">
    <h2 class="text-2xl font-bold text-trimble-darkBlue mb-8 border-b border-gray-200 pb-2">Official Reference</h2>
    <div class="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <p class="text-sm text-gray-600 mb-3">This guide follows the official Tekla User Assistance documentation:</p>
        <a href="TUA_URL" target="_blank" class="text-trimble-blue font-bold hover:underline">Article Title &rarr;</a>
        <p class="text-xs text-gray-500 mt-4">Verified against Tekla Structures VERSION. Steps may differ in older versions.</p>
    </div>
</section>
```

URL mesti URL sebenar daripada keputusan carian. Kalau tiada artikel rasmi, tukar blok ini kepada nota jujur bahawa isu tersebut tiada dalam TUA dan arahkan kepada local Tekla support.

---

## 8. Jadual perbezaan versi

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
