# Jyotish Kundli (জ্যোতিষ কুণ্ডলী)

Static, dependency-free Vedic astrology web app (HTML, CSS, JavaScript). Runs entirely in the browser.

## Languages and chart styles
- **Languages:** Assamese (default), Bengali, Hindi and English. Pick one in the Language box at the top; the choice is remembered in the browser. Names of signs, planets, nakshatras, tithi, yoga, karana, vaara, maasa and the table headings are translated. The 60 Samvatsara names, technical audit notes and English-source BPHS chapter guide remain in English/Latin.
- **Chart styles:** East Indian (default; Assam, Bengal, Odisha), North Indian and South Indian, switchable at any time. They apply to D1, D9 and every divisional chart. East Indian is sign-fixed in a 3x3 frame with divided corner cells, Aries in the top-centre cell, signs running anti-clockwise. The cell geometry is in `js/chart.js` (`E_POLY`, `E_POS`).
- **Places:** `data/places.csv` now starts with Assam, North-East, West Bengal and Bangladesh towns (names in Assamese or Bengali script are searchable too). Guwahati is the default place.
- **Adding or editing text:** all translations are in `js/i18n.js`. Keys are the English text; anything missing falls back to English.

## Features
Kundli (Lahiri sidereal): lagna, planets, nakshatra and pada, panchang (vaara, tithi, yoga, karana, sunrise, sunset, hora), Samvatsara and Chandra Maasa, Avkahada details, Navatara chakra (Tara Bala), a diagrammatic Pataki Rishta vedha map with the BPHS Dhoom-derived Upagraha chain (Dhoom, Vyatipat, Parivesh, Chap and Upaketu) and Gulika (Mandi) placements, Vimshottari mahadasha/antardasha/pratyantar with qualified source results, KP star and sub lords, Ashtakavarga (BAV/SAV plus Lagna BAV and Trikona/Ekadhipatya Shodhana worksheets), selected BPHS yoga formations with historical source results and qualifications (sensitive medical, longevity and mortality clauses are omitted in the display), Chara Karakas, Rahu Kala, 16 divisional charts (D1–D60 including D30), and Ashtakoota matching. The Analysis tab includes selected Moon/Sun and Nabhash formations, historical Panchamahapurusha results with source citations and sensitive-claim redactions, a sixteen-varga topic/dignity matrix, bhava-lord explorer, graha/rāśi aspect tables, lordships and dignity. The Jaimini tab adds Karakamsa, twelve Bhava Padas using the supplied edition’s exceptions, Argala count tables and a labeled BPHS/Neelakantha-style Chara Dasha. The Chakras tab adds the three-ring Sudarshana Chakra and current Bhava periods. The BPHS Guide contains all 97 chapter summaries and a searchable index of source-result records from Chapters 34–42 and 75. Calculation conventions and limits are documented in `BPHS_ANALYSIS.md`; this is not a complete software implementation of every BPHS calculation or prediction.

## Deploy on GitHub Pages
1. Push this folder to a repository.
2. Settings > Pages > Deploy from branch > `main` / root.
3. Open `https://<user>.github.io/<repo>/`.

## Places database
`data/places.csv` loads automatically. Columns: `name,lat,lon,tz`. `tz` is a UTC offset (`5.5`) or an IANA name (`Asia/Kolkata`). Replace the sample with your own data, or use the in-page import button. JSON arrays with the same keys also work.

## Ephemeris data (`data/ephemeris.csv`)
Converted from `EphimerisTABLE` in `EPHEMERISImportantData.mdb`: 47,857 daily rows, 1930-01-01 to 2061-01-09, 0h UT, sidereal (Lahiri). The app interpolates between days with a cubic fit; dates outside the range fall back to formulas. Positions match the sample report to the arcminute, and Rahu and Ketu are the true node.

| Source columns | In the CSV | Notes |
|---|---|---|
| `Date` | row order | contiguous, one row per day |
| `Ayanamsa` (d:m:s) | `ay` (arcsec) | |
| `Textbox6-8`, `10-12`, `14-16`, `18-20`, `26-28` | `sun, moon, mars, mercury, venus` (arcsec) | table has degrees inside the sign only; the sign is restored from formula positions (agree within 0.25 deg) |
| `Textbox21-24` | `jupiter` | sign included |
| `Textbox29, 31, 32` | `saturn` | whole degree missing in the source, restored the same way; sign column agrees on all rows |
| `Textbox33-36`, `37-40` | `rahu`, `ketu` | sign included |
| `Textbox41-49` | `lords` | nakshatra-lord planet numbers for Sun..Ketu (1 Sun, 2 Moon, 3 Mars, 4 Mercury, 5 Jupiter, 6 Venus, 7 Saturn, 8 Rahu, 9 Ketu) |
| `Textbox81:82` | `moonmot` (arcmin) | Moon's daily motion |
| `Textbox1-4` | `rise`, `set` (minutes after midnight) | sunrise and sunset; they fit Guwahati (about 26 N, 91.7 E) in IST, inferred and not stated in the file |
| `Textbox10Other` | `other` | meaning not identified. On every row it equals the next day's Moon whole degree (`Textbox10` of the next row) or that minus 1, but the rule choosing between them is unknown. Kept exactly as stored |

**Nothing is dropped.** `data/source/EphimerisTABLE_raw.csv.gz` is a verbatim export of all 49 source columns and 47,857 rows, exactly as stored (including Id and the Date text). `python tools/audit_ephemeris.py` compares `ephemeris.csv` with it cell for cell and runs sanity scans; the last run is saved in `data/DATA_AUDIT.txt` (all checks passed).

Known quirks of the source, all kept as is: 220 minute cells equal 60 (a rounding rollover of 59'59.x", worth at most 2 arcseconds); the ayanamsha dips by 1 arcsecond now and then because it includes nutation; the table has no sign for Sun, Moon, Mars, Mercury or Venus and no whole degree for Saturn, so those are restored as described above.

Rebuild with `python tools/build_ephemeris.py <file.mdb> data/ephemeris.csv` (needs `access-parser`, `pandas`, `numpy`, `node`).

## Panchang data (`data/panchang/`)
Converted from `PanchangTABLE` in `PANCHANGAImportantData.mdb`: 47,857 table rows, of which 45,964 carry a date (1930-01-01 to 2041-02-01, Gauhati, IST). 5,389 dates have two rows (a second tithi, nakshatra or yoga ending the same day). The 1,893 undated rows hold only bookkeeping (Set, Recnum, ID, flag) and are kept in the raw export only. `data/source/PanchangTABLE_raw.csv.gz` is a verbatim export of all 44 columns; `data/panchang/<year>.json` holds every dated row with all non-constant columns, and `meta.json` holds the constant columns and the decoded name maps. Nothing is corrected. Run `python tools/audit_panchang.py` (last run in `data/PANCHANG_AUDIT.txt`).

| Source columns | Meaning (how it was verified) |
|---|---|
| `Set`, `Recnum`, `ID` | row bookkeeping, kept (`ID` is not unique) |
| `PDate`, `SunRise`, `SunSet` | date, sunrise and sunset to the second (Gauhati) |
| `TextBox27` | Dinamana in ghati:pala:vipala (equals (sunset - sunrise) / 24 min on every row) |
| `TextBox2`, `5`, `8` | tithi, nakshatra and yoga end, ghati:pala:vipala after sunrise (reproduced from `ephemeris.csv`: median 0.05 min, worst 0.54 min) |
| `TextBox4`, `10`, `13` | nakshatra at sunrise, karana, Moon rashi, as legacy-font text (inferred names: 96-100% agreement with computed values) |
| `TextBox37`, `40` | Amanta and Purnimanta maasa, legacy-font text (99.9% and 98.4%) |
| `TextBox38`, `39` | Vikram and Shaka year, change at Chaitra Shukla 1 (match the sample report) |
| `TextBox35`, `36` | Vikram and Shaka year counted from Kartika (change in Oct/Nov) |
| `TextBox41` | 1 on adhika-maasa days (runs of about 29 days, 1,476 rows); the 34 rows holding 2 are not identified |
| `TextBox42`, `43`, `44` | ayana, gola, ritu (100% agreement) |
| `TextBox45`, `46` | moonrise, moonset (`-----` on days without one) |
| `TextBox22` | ayanamsha as printed; only 3 values in 112 years (22:52:35, 23:44:01, 24:00:49) |
| `TextBox29`-`34` | six ghati times from sunrise, spaced one eighth of the day apart; exact meaning not identified, shown raw |
| `TextBox15`, `16`, `17`, `21` | always 0.0, not identified |
| `TextBox18`-`20`, `26`, `128` | location (91:45:E, 26:10:N, meridian 82:30:E), language Hindi, place Gauhati |
| `TextBox23`-`25` | always empty |

Source quirks, kept as is: the text `um^` is printed for both Shravana and Uttara Ashadha (the app shows both names); on 1 Jan 1930 Uttara Ashadha has its own longer text; 3 Jun 2030 shows Mrigashira's text where my sunrise position is 0.3 minutes past the boundary (the table's own end time is 4 seconds after sunrise); the ayanamsha is printed as 3 values only. The legacy-font text itself is stored untouched and shown as a tooltip beside the inferred name.

In the app, the Shaka year, Vikram year, Chandra Maasa, ayana and ritu rows use this table for dates inside its range, and the Panchang card and browser show every column. Tithi, nakshatra, yoga and karana at birth are still computed from the ephemeris table positions.

## Accuracy and limits
Within 1930-2061 positions come from the table. Outside it, compact formulas (about 0.1-0.5 degrees, mean Rahu) are used. The table's ayanamsha is about 19 arcseconds below the sample report's value (24:08:28 against 24:08:47 for 13 Sep 2020), so the lagna can differ by about an arcminute. Shadbala is not implemented. Vashya and Gana matching scores are simplified. Sunrise, sunset and hora are formula-based and approximate (hora uses the disc-centre 'Vedic' sunrise and sunset). Rahu Kala uses the standard eighth-of-day method.

## License and credits
Bindu tables and several rules were cross-checked against [kunjara/jyotish](https://github.com/kunjara/jyotish), which is GPL-2.0-or-later, so this project should be released under **GPL-2.0-or-later** as well. Add a `LICENSE` file with the GPL text. Classical sources: Brihat Parashara Hora Shastra.

D30 (Trimsamsa) uses the BPHS degree split for even signs (5/7/8/5/5), which differs from that library.

## Chakras and dasha results (js/chakra.js, js/dasha.js)
- **Navatara chakra:** nine taras counted from the Janma nakshatra (Janma, Sampat, Vipat, Kshema, Pratyari, Sadhana, Naidhana, Mitra, Parama Mitra), three nakshatras each, with the chart's planets and today's Moon tara.
- **Pataki Rishta Chakra:** now shown as a twelve-house diagram with selectable Lagna/Moon vedha links and an accessible placement table. The movable/fixed/dual sign groups follow the cited K. N. Rao table; Dhoom and its four derived Upagrahas (Vyatipat, Parivesh, Chap and Upaketu) plus Gulika (Mandi) use BPHS Ch. 3 rules, with Gulika dependent on the app's approximate sunrise model. Dandesh/Ardhayamesh and age-specific PRC timing are not implemented; no fatalistic health/longevity outcome is predicted.
- **Dasha results:** all nine mahadashas with their antardashas, the running pratyantar table, and a grade for every period from the lord's houses owned and occupied, dignity, friendship with the mahadasha lord and its Navatara from the Moon. These are classical rules of thumb, not predictions. Result text is in English.

## Interface
Sticky header with language, chart style and light/dark switch. The birth form collapses after you generate a chart (tap it to edit), remembers your last inputs, has a "use current time" button and keeps coordinates under an advanced section. Results are split into tabs: Summary, Analysis, BPHS Guide, Jaimini, Charts, Dasha, Chakras, More (KP, Ashtakavarga, yogas and data tables), Matching and Data. Wide Jaimini tables scroll horizontally on small screens. The Print button prints every result section for saving as PDF. UI code is in `js/ui.js`.

## Assamese language completion
`js/i18n-as.js` (loaded after `app.js`) translates app-generated headings, notes and sentence templates that previously showed in English when the language was Assamese. It only runs when the language is Assamese. BPHS source-text paraphrases loaded from `data/*.json` (chapter summaries, yoga result wording and rule conditions) are still in English.


---

## Merged build (v16) — two apps combined

This release merges **jyotish-kundli-v12-pataki-improved** (newest modular code: improved
Pataki Rishta Chakra with Dandesh/Ardhayamesh lords, mishap predictions and remedies,
BPHS guide, Jaimini tools, Assamese i18n) with **kundli** (single-file packaging idea).

Fixes & improvements applied on top of the merge:

1. **Two entry points now ship in one package**
   - `index.html` — modular version (css/ + js/), best for development/hosting.
   - `index-standalone.html` — fully self-contained single file (~275 KB): all CSS and JS
     inlined in `index.html` script order. Only the `data/` folder is still fetched at runtime.
2. **Favicon added** (inline SVG brand mark) — eliminates the 404 and adds a home-screen icon.
3. **`<noscript>` fallback** message for JS-disabled browsers.
4. **Unified cache-busting** (`?v=16`) on all CSS/JS so stale assets are not served after upgrades.
5. **Print stylesheet** (`@media print`): hides controls/tabs, keeps chart cards clean, forces
   `print-color-adjust: exact` on the Pataki diagram so vedha colors survive printing.
6. **Audit clean**: all asset references resolve, no duplicate DOM ids, every
   `getElementById` target exists, all `fetch()` data paths verified on disk, and the full
   JS bundle passes `node --check`.

Verified data loads: panchang meta (1930-01-01 → 2041-02-01), bphs-guide (97 sections),
ephemeris CSV, places CSV.
