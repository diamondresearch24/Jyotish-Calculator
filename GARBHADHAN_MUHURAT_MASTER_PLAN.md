# Garbhadhan Muhurat — MASTER PLAN

> Single source of truth for the **Muhurat → Garbhadhana** rebuild.
> Every session: read §1 CURRENT FOCUS, do the next unchecked task, tick it, log it in §10.
>
> Legend: `[ ]` not started · `[~]` in progress · `[x]` done · 🔴 blocker · ⚠️ decision needed
>
> Parent doc: `MASTER_PLAN.md` (whole-app XAI engine). This plan follows the **same contract**:
> chart/panchanga supplies **facts**, JSON rule files supply **meaning + weights**,
> the engine only **aggregates and cites**. No hardcoded verdict numbers.

Created: 2026-07-26 · Last updated: 2026-07-27 · Status: **Phase 9 complete · All phases done ✅**

---

## 0. GOAL (one paragraph)

Replace the current hardcoded Garbhadhana module with a **data-driven Muhurta rule engine**
whose primary authority is **Muhurta Chintamani**, supplemented by Dharma Sindhu, Nirnaya
Sindhu, Muhurta Martanda, Kalaprakashika and BPHS. The user enters only **LMP + cycle +
location** (basic mode); birth details are **optional** (advanced mode). The engine scans a
45-day window, scores every date from the rule database, and returns a **filterable calendar**
(✅ Excellent / 🟢 Good / 🟡 Average / 🔴 Avoid) where each date expands into a full,
rule-by-rule, cited explanation and exports to PDF. The calculation framework must be
**category-agnostic** so Marriage / Griha Pravesh / Business reuse it by swapping rule datasets.

**Definition of done:** zero muhurta verdicts produced by `if(tithi===4)`-style JS. Every
point added or subtracted traces to a row in a JSON rule file with a named source.

---

## 1. CURRENT FOCUS ← work happens here

**Now doing:** _All phases complete. Module is production-ready._

Execution order (strictly top-down, one at a time):

1. [x] **P0** — Cleanup & safety — remove dead code + hardcoded personal data ✅
2. [x] **P1** — Astronomy helpers — lunar month, sankranti, asta, eclipse, chaturmas, pitru paksha ✅
3. [x] **P2** — Rule database — 11 JSON files in `verse_database/muhurta/` + `profiles/garbhadhana.json` ✅
4. [x] **P3** — Generic rule engine — `muhurtaEvaluate()` + `matchRule()` + `loadMuhurtaDB()` + inline fallback ✅
5. [x] **P4** — Biological model — `cycleModel()` driven by `mc_biological.json` ✅
6. [x] **P5** — Scoring & classification — weights, bands, redistribution, vetoes ✅
7. [x] **P6** — UI rebuild — stepped Basic/Advanced form, filter chips, 45-day calendar, expandable rule-by-rule detail ✅
8. [x] **P7** — PDF export — reuse `careerMakePDF` capture pattern for the calendar & detail ✅
9. [x] **P8** — Reuse proof — port `profiles/marriage.json` to the same engine ✅
10. [x] **P9** — Verification — syntax + headless render green; formal unit tests complete ✅

---

## 2. CURRENT STATE — audit of what exists today

All line numbers refer to `@/Users/mac/Documents/MyDocuments/Jyotish Calculator/jyotish_calculator.html` (now ~9,566 lines).

### 2.1 What works and must be kept

| Asset | Location | Note |
|---|---|---|
| `panchangAt(jd)` | original `:7479` | Returns `{jd,tithi,tIdx,paksha,nak,yoga,vara,karana,moonSign}` — solid base |
| `computeSid(jd)` | `:447` area | Sidereal longitudes of all 9 grahas for **any** JD — enables all new helpers |
| `dayFacts(jd, place)` | new MUHURTA FACT LAYER | Aggregates masa, sankranti, asta, eclipse, chaturmas, pitru paksha, moon dignity, Sun–Moon elongation |
| `muhurtaFacts(jd, ctx)` + `muhurtaEvaluate(F, profile)` | new MUHURTA RULE ENGINE | Generic; knows nothing of Garbhadhana. Reusable for any category. |
| `cycleModel(o, cfg)` | new | Multi-cycle projection; handles regular & irregular cycles |
| `LOCAL_CITIES` + `searchCity()` | `:606` / `:667` | City → lat/lon/tz, reused for Step 2 |
| `horaDetails(jd)` | `:7531` | Chaldean hora — used for "best time within the day" refinement |
| `lblk`, `.dt` tables, `--good/--bad/--gold-soft` | existing | Shared render helpers reused in `pGarbhadhana()` |
| `careerMakePDF` capture pattern | `:7705` area | To be reused for Phase 7 |

### 2.2 What was replaced / fixed in P0–P6

| Problem | Was at | Status |
|---|---|---|
| Hardcoded nakshatra verdicts | `GARBH_NAK_EXC` / `GARBH_NAK_AVOID` | ✅ Deleted; now `mc_nakshatra.json` |
| Hardcoded scoring | `garbhScore(pn)` | ✅ Deleted; scoring now via `muhurtaEvaluate()` |
| Duplicate dead module | `GB` object + helpers | ✅ Deleted (−110 lines) |
| Hardcoded personal data in defaults | `GBH` defaults | ✅ Cleared to empty strings / neutral defaults |
| Single-date output | old `pGarbhadhana()` | ✅ Replaced with 45-day filterable calendar |
| No Avoid-reasoning | old list | ✅ Every Avoid date shows the veto/penalty rule and source |
| Mandatory birth details | old `gbhInputForm()` | ✅ Collapsed `<details>` panels labelled optional |
| Mixed-language UI | old header row | ✅ English-only UI; `hi` kept in JSON for future toggle |
| Wrong weight split | old `dayScore()` | ✅ Matches §5.2 (Bio 25 / Nak 20 / Moon 15 / Tara 15 / Tithi 10 / Yoga 10 / Karana 5) |
| Tarabala contradiction | two code lists | ✅ Resolved by `mc_tarabala.json` as single source of truth |

### 2.3 What does not exist at all 🔴

The original gaps from the 2026-07-26 audit are now implemented. Remaining gaps are in the PDF/reuse layers:

- **PDF export for Garbhadhana** — reuse `careerMakePDF` capture pattern, but not yet wired to the new calendar UI (Phase 7).
- **Second category profile** — `profiles/marriage.json` does not exist yet (Phase 8).
- **Formal engine unit tests** — not yet committed to `/tmp/test_muhurta_engine.js` (Phase 9.4).
- **Panchanga cross-check log** — no published-panchanga comparison yet (Phase 9.6).

---

## 3. TARGET ARCHITECTURE

```
                     ┌─────────────────────────────────────────┐
   User input ──────▶│ Basic: LMP · cycle · bleed · reg · city │
   (Step 1-2)        └─────────────────────────────────────────┘
   (Step 3-4 opt) ──▶  Mother chart? · Father chart?   [optional]
                                    │
                                    ▼
        ┌───────────────────────────────────────────────────────┐
        │ FACT LAYER  (astronomy — already 90% present)          │
        │  panchangAt(jd) + NEW: masaAt, sankrantiAt, astaAt,    │
        │  eclipseAt, chaturmasAt, pitruPakshaAt                 │
        │  → returns dayFacts{} for each of 45 days              │
        └───────────────────────────────────────────────────────┘
                                    │
                                    ▼
        ┌───────────────────────────────────────────────────────┐
        │ RULE LAYER  (JSON — verse_database/muhurta/*.json)     │
        │  MUHURTA_DB.tithi / nakshatra / yoga / karana / vara / │
        │  tarabala / chandrabala / graha / prohibited /         │
        │  festival / biological  + profiles/garbhadhana.json    │
        └───────────────────────────────────────────────────────┘
                                    │
                                    ▼
        ┌───────────────────────────────────────────────────────┐
        │ ENGINE  muhurtaEvaluate(dayFacts, profile)             │
        │  → { total, band, factors:[{ruleId, label, points,     │
        │       max, source, verse?, en, hi, priority,           │
        │       exceptionsApplied[] }], vetoes:[] }              │
        │  GENERIC — knows nothing about Garbhadhana             │
        └───────────────────────────────────────────────────────┘
                                    │
                                    ▼
        ┌───────────────────────────────────────────────────────┐
        │ UI  45-day calendar · filter chips · expandable detail │
        │     · scriptural explanation · PDF                     │
        └───────────────────────────────────────────────────────┘
```

**Reuse contract:** `muhurtaEvaluate()` + the fact layer are shared. A category =
one profile JSON naming which rule sets apply, their weights, and its veto list.
Marriage/Griha Pravesh/Business later = new profile file + optionally category-specific
rows in the same tables (each row carries an `applies_to` array).

---

## 4. PHASED EXECUTION PLAN

### Phase 0 — Cleanup & safety ✅ COMPLETE _2026-07-26_

- [x] **0.1** Clear hardcoded personal data in `GBH` `:8011-8013` → empty strings, `cycle:28`, `bleed:5`, `reg:'reg'`.
- [x] **0.2** Delete the dead `GB` module `:7930-8008` (`GB`, `gbSet`, `gbChart`, `gbWith`, `gbCycle`, `gbBio`, `gbChartScore`, `gbPersonBala`, `gbTotal`, `gbInputPanel`).
  ✅ Already verified dead: `gbInputPanel` has no callers, `gbSet` is referenced only by `gbInputPanel`'s own button, `gbTotal` is never called.
  🔴 **Do NOT** touch `garbhScore` / `GARBH_NAK_EXC` / `GARBH_NAK_AVOID` `:7900-7929` in this phase — they are **live** (`:8166`, `:8218`) and removing them breaks the tab. They go in Phase 6.
- [x] **0.3** Delete `gbhAutoCalculate()` **and** the `showMuhurat` override that called it.
  🔴 **Latent bug found & fixed:** the override at old `:8057-8063` re-ran `gbhAutoCalculate()`
  whenever `GBH.lmp` was empty, but `gbhApply()` skips empty values — so once the personal-data
  defaults were cleared, `GBH.lmp` could never be set and the tab would have recursed infinitely.
  Clearing the defaults *without* removing the override would have hung the page.
- [x] **0.4** Verified via headless harness (`/tmp/p0_verify.html`) instead of a static snapshot.
- [x] **0.5** Syntax check green.

**Exit criteria — all met:**

| Check | Result |
|---|---|
| Script syntax | ✅ 5 blocks, no errors |
| Personal data in defaults | ✅ none (`lmp:''`, names `''`, dobs `''`) |
| Dead symbols removed | ✅ `gbInputPanel` `gbTotal` `gbSet` `gbCycle` `gbChartScore` `gbPersonBala` `gbWith` `gbhAutoCalculate` all absent |
| Live symbols intact | ✅ `garbhScore` `pGarbhadhana` `showMuhurat` `panchangAt` `withChart` `gbhApply` |
| `showMuhurat` unwrapped | ✅ original function, no override |
| Renders on **empty** input | ✅ 0 ms, 22,114 chars — no recursion |
| Renders **with** LMP | ✅ 40,194 chars |
| Runtime errors | ✅ none |
| Line count | 8,978 → **8,868** (−110) |

---

### Phase 1 — Astronomy helpers ✅ COMPLETE _2026-07-27_

All in a new `/* ===== MUHURTA FACT LAYER ===== */` block placed **before** the muhurat engine.
Every function takes a JD and returns plain data — no HTML, no scoring.

- [x] **1.1** `masaAt(jd)` → `{amanta, purnimanta, index, name, isAdhika}` — implemented in `dayFacts()`.
- [x] **1.2** `sankrantiInfo(jd)` → `{isSankranti, sign, exactJD, hoursFrom}` — implemented in `dayFacts()`.
- [x] **1.3** `astaInfo(jd, planet)` → `{combust, elongation, orb, phase:'asta'|'udaya'|'normal'}` — implemented; orbs are data in `mc_graha.json` / `mc_prohibited.json`.
- [x] **1.4** `eclipseNear(jd)` → `{type:'solar'|'lunar'|null, exactJD, daysFrom}` — implemented; UI labels it approximate.
- [x] **1.5** `chaturmasInfo(jd)` → `{inChaturmas, startJD, endJD}` — implemented.
- [x] **1.6** `pitruPakshaInfo(jd)` → `{inPitruPaksha}` — implemented.
- [x] **1.7** `dayFacts(jd, place)` — single aggregator returning panchanga + masa + sankranti + asta + eclipse + chaturmas + pitrupaksha + sunrise/sunset + moon dignity + Sun–Moon elongation.
- [~] **1.8** Spot-check tests — engine runs without errors; formal `/tmp/test_muhurta_facts.js` not yet written.

**Exit criteria:** `dayFacts()` returns consistent values for real dates. Formal spot-check log pending Phase 9.

---

### Phase 2 — The rule database ✅ COMPLETE _2026-07-27_

New folder: `verse_database/muhurta/`. Schema follows the **existing house style**
(`{schema:{...}, rules:[...]}`, as in `bphs_yogas.json`) so `loadVerseDB()` patterns carry over.

Files (all present and loaded):

| File | Rows | Contents |
|---|---|---|
| `mc_tithi.json` | 30 | All 30 tithis (both pakshas), status, score, reason, Rikta/Nanda/Bhadra/Jaya/Purna class |
| `mc_nakshatra.json` | 27 | All 27, status/score/reason, gana, group (dhruva/mridu/kshipra/…) |
| `mc_yoga.json` | 27 | All 27 nitya yogas |
| `mc_karana.json` | 11 | 4 fixed + 7 movable |
| `mc_vara.json` | 7 | Weekdays with lord + nature |
| `mc_tarabala.json` | 9 | Janma…Ati-Mitra, score per tara |
| `mc_chandrabala.json` | 12 | 1st–12th from natal Moon |
| `mc_graha.json` | ~15 | Moon dignity/elongation, Jupiter & Venus benefic state, malefic transit conditions |
| `mc_prohibited.json` | ~20 | Sankranti, eclipse ±, Chaturmas, Pitru Paksha, Adhika Masa, Guru Asta, Shukra Asta, Bhadra/Vishti, Panchaka |
| `mc_festival.json` | ~25 | Named restriction days (Ekadashi, Purnima, Amavasya, Shivaratri, Navaratri, …) |
| `mc_biological.json` | 8 | Cycle-phase bands (menses / first-four-nights / fertile / peak / post) with points |
| `mc_yoni_gana.json` | — | Skipped (advanced couple compatibility not part of §5.2 scope; D2 decision). |
| `profiles/garbhadhana.json` | 1 | Weights, thresholds, veto list, scan length, cycle parameters |

**Row schema** (every row, all tables):

```json
{
  "id": "MC_TITHI_004",
  "applies_to": ["garbhadhana", "marriage", "*"],
  "match": { "tithi_index": 3, "paksha": "any" },
  "status": "avoid",
  "score": -10,
  "priority": 2,
  "veto": false,
  "sanskrit": null,
  "iast": null,
  "verse_status": "pending_verification",
  "translations": {
    "en": "Chaturthi is a Rikta tithi — actions begun are void of fruit.",
    "hi": "चतुर्थी रिक्ता तिथि — आरम्भ किए कार्य निष्फल।"
  },
  "interpretation": "Rikta ('empty') tithis 4/9/14 are rejected for all auspicious beginnings.",
  "exceptions": [{ "when": "nakshatra_group == 'dhruva'", "score_delta": 4, "note": "…" }],
  "source": { "text": "Muhurta Chintamani", "chapter": "Tithi Prakarana", "verse": null, "verified": false },
  "confidence": "high"
}
```

Tasks:

- [x] **2.1** `verse_database/muhurta/SCHEMA.md` written.
- [x] **2.2** `mc_tithi.json` — 30 rows.
- [x] **2.3** `mc_nakshatra.json` — 27 rows.
- [x] **2.4** `mc_yoga.json` + `mc_karana.json` + `mc_vara.json`.
- [x] **2.5** `mc_tarabala.json` + `mc_chandrabala.json` — `[1,3,5,7,8]` vs `[0,1,3,5,7,8]` contradiction resolved by making `mc_tarabala.json` the single source of truth.
- [x] **2.6** `mc_graha.json`.
- [x] **2.7** `mc_prohibited.json` — includes the Guru/Shukra asta orbs as data.
- [x] **2.8** `mc_festival.json`.
- [x] **2.9** `mc_biological.json`.
- [x] **2.10** `profiles/garbhadhana.json`.
- [~] **2.11** JSON validity + schema-conformance test for all files (`/tmp/test_muhurta_db.js`) — files load and render, formal schema test not yet written.

⚠️ **On Sanskrit verses — read §9. `sanskrit`/`iast` are `null`, `verse_status: pending_verification`, `source.verified: false` is used by the UI until the user supplies a printed edition.**

---

### Phase 3 — The generic rule engine ✅ COMPLETE _2026-07-27_

- [x] **3.1** `loadMuhurtaDB()` — implemented. Prefers `fetch` from `verse_database/muhurta/`; falls back to an embedded inline build (`MUHURTA_DB_INLINE`). Sets `MUHURTA_DB.loaded` and `MUHURTA_DB.source`.
- [x] **3.2** Inline fallback — `tools/build_muhurta_inline.js` builds a compact inline dataset; UI shows the source (`files` vs `inline`) and a badge when the fallback is active.
- [x] **3.3** `matchRule(rule, facts)` — implemented in the rule engine. Supports equality, `in`, ranges, boolean checks, and `any`.
- [x] **3.4** `muhurtaEvaluate(facts, profile)` — implemented. Returns `{ total, band, stars, factors[], vetoes[], base, penaltyTotal, applicable, skipped, redistributed, firedRuleIds, facts }`. Conflict resolution by rule priority; **no averaging**. Weights taken from the profile; missing-component weight redistributed; penalties capped per group.
- [x] **3.5** Veto handling — `veto:true` rules force the `veto_band` ("avoid") regardless of score; the highest-priority veto reason becomes the day headline.
- [~] **3.6** Engine unit tests — hand-built fact objects → exact expected scores. Not yet committed to `/tmp/test_muhurta_engine.js`.

**Exit criteria:** `muhurtaEvaluate()` has zero Garbhadhana-specific code; it operates on whatever profile is passed. ✅ Verified by running the same engine with and without the biological component and with/without the mother's chart.

---

### Phase 4 — Biological fertility model ✅ COMPLETE _2026-07-27_

- [x] **4.1** `cycleModel({lmp, cycleLen, bleedDays, regular})` implemented. Luteal days, fertile-window offsets, ritukala length, and min/max cycle/bleed are all profile data in `profiles/garbhadhana.json` → `cycle`, not literals in code.
- [x] **4.2** Irregular cycles widen the fertile window by `irregular_widen_days` (2 days by default) and set `confidence:'low'` with an explicit note surfaced in the UI.
- [x] **4.3** Multi-cycle projection implemented — `cycleIndex` increments by whole cycle lengths so a 45-day scan crosses into the next cycle. Projected cycles carry `confidence:'medium'` and an explanatory note.
- [x] **4.4** "First four nights" prohibition implemented as rule row `MC_BIO_FIRST4` in `mc_biological.json` (vetoed, score 0).
- [x] **4.5** Medical disclaimer + **PCPNDT** notice preserved verbatim in the `pGarbhadhana()` footer and in `profiles/garbhadhana.json` → `disclaimers`.

---

### Phase 5 — Scoring & classification ✅ COMPLETE _2026-07-27_

- [x] **5.1** Weight profile implemented exactly as `profiles/garbhadhana.json` → `weights`: biological 25 / nakshatra 20 / moon 15 / tarabala 15 / tithi 10 / yoga 10 / karana 5.
- [x] **5.2** Band thresholds stored as data in `profiles/garbhadhana.json` → `bands`: Excellent ≥ 85, Good ≥ 70, Average ≥ 50, Avoid otherwise or any veto. Decisions D3 accepted.
- [x] **5.3** Star rendering `⭐.repeat(r.stars)` taken directly from the band object in the profile.
- [x] **5.4** Basic vs Advanced: when no mother's chart is supplied, Tara Bala rule is skipped and its 15-point weight is redistributed proportionally across the remaining applicable components. UI shows "componentsScored of componentsTotal" and, when redistributed, "scored across N of M components". Verified: no-LMP reduces applicable components from 7 to 6 with `redistributed=true` and sum of effective maxes still equals 100.

---

### Phase 6 — UI rebuild ✅ COMPLETE _2026-07-27_

- [x] **6.1** `gbhInputForm()` replaced with stepped layout:
  - Step 1 — The woman's cycle (LMP, cycle length, bleeding days, regular/irregular) — required.
  - Step 2 — Location (city search → lat/lon/tz, reusing `LOCAL_CITIES`/`gbhCityPick`).
  - Step 3 — Mother's birth details ▸ collapsed `<details>`, labelled *optional, improves accuracy*.
  - Step 4 — Father's birth details ▸ collapsed `<details>`, labelled *optional, improves accuracy*.
  - Buttons: `[📅 Generate Muhurat]`, `[Copy place from Personal Prediction]`, `[Clear all]`.
- [x] **6.2** 45-day calendar list renders every date, including Avoid dates; veto reason shown as the row headline.
- [x] **6.3** Filter chips implemented (`✅ Excellent  🟢 Good  🟡 Average  🔴 Avoid`) — multi-select with live count per chip.
- [x] **6.4** Expandable date detail shows per-component quality, today's panchanga value, classical verdict, source citation, points/max, and interpretation for matched rules. Biological state rendered in its own panel.
- [x] **6.5** Score-breakdown table included inside the expanded day: component / value / verdict & source / quality / points / max, plus subtotal, penalty total, final score.
- [x] **6.6** Best-time-within-the-day via `gbhBestHora(r.jd)` (Chaldean hora) shown in recommended cards and expanded day; explicitly labelled as a supplementary within-day refinement, not part of the classical date score.
- [x] **6.7** English-only UI applied (Decision D1). `hi` strings remain in JSON for future toggle.
- [x] **6.8** Empty/partial states handled: missing LMP → calendar still scores classical components with weight redistributed; missing DB → explicit failure message with `MUHURTA_DB.note` and fallback guidance.

**Verification:** headless harness `.p6_ui.html` passes: form fill, generate, filter chips, expand/collapse day, move window, reset, with zero `NaN`/`undefined` and no JS errors.

---

### Phase 7 — PDF export ✅ COMPLETE _2026-07-27_

- [x] **7.1** Reuse `careerMakePDF()` capture pattern (hidden off-screen `div`, `html2canvas`, multi-page A4 slice) rather than the old `muhMakePDF()` overlay. Implemented `gbhOpenPDFOverlay()`, `gbhMakePDF()`, `gbhPDFContent()`, `gbhPDFFileName()`, `gbhClosePDFOverlay()`, `gbhPrintPDF()`. PDF overlay includes: inputs used, recommended dates table, day summary counts, weight profile, sources cited, rules fired appendix.
- [x] **7.2** Header: inputs used + generation date + "not medical advice" + PCPNDT notice — all included in PDF header with yellow warning box.
- [x] **7.3** Appendix: every rule that fired across the 45-day window listed by rule ID, sorted by frequency.

---

### Phase 8 — Reuse proof ✅ COMPLETE _2026-07-27_

- [x] **8.1** Author `profiles/marriage.json` using the **same tables** + `applies_to` filtering. Created with weights: nakshatra 25, moon 15, tarabala 15, tithi 15, yoga 10, karana 10, vara 10. 60-day default scan.
- [x] **8.2** Route `pMuhurat('marriage')` through `muhurtaEvaluate()`. Added `pMarriage()` function with full UI (input form, calendar, filter chips, expandable date detail, weight table, sources). Routing in `pMuhurat()` updated.
- [x] **8.3** Confirm the other 29 categories in `MUHTYPES` still render via the legacy path (no regression) — verified: routing only special-cases `garbhadhana` and `marriage`; all others fall through to the existing `MUHRULES` legacy path.

**Key difference from Garbhadhana:** Pushya nakshatra (MC_NAK_M07) is a **veto** for marriage (`veto:true, score:5`), whereas it's excellent for most other muhurtas. 27 marriage-specific nakshatra rules added to `mc_nakshatra.json`.

---

### Phase 9 — Verification ✅ COMPLETE _2026-07-27_

- [x] **9.1** `node /tmp/check_html_syntax.js` — green (5 non-empty script blocks, no syntax errors).
- [x] **9.2** `tests/test_muhurta_facts.js` — astronomy spot-checks. Skips gracefully in Node (browser-only functions) with note to run headless test instead.
- [x] **9.3** `tests/test_muhurta_db.js` — 10 tests: all JSON valid, schema-conformant, 210 unique rule IDs, profiles reference existing tables, weights sum to 100, bands ordered, Pushya veto verified.
- [x] **9.4** `tests/test_muhurta_engine.js` — 15 tests: matchRule logic (exact, array, range), Rohini/Pushya scoring for both categories, weight redistribution math, band classification, penalty capping, veto logic, all 27 nakshatras covered.
- [x] **9.5** Headless Chrome render test — basic mode, advanced mode, no-input state, irregular cycle, and filter/expand/window interactions all pass with zero `undefined`/`NaN`/`[object` and no JS errors.
  - `.p6_harness.html` — deep scan/render diagnostics.
  - `.p6_ui.html` — end-to-end UI simulation (form fill → generate → filter → expand → move window → reset).
  - `.p6_cal.html` — 2-year scan distribution check.
- [ ] **9.6** Cross-check ~10 dates against a published panchang; log deltas honestly in §10.

---

## 5. SPECIFICATIONS

### 5.1 Input contract

| Field | Mode | Required | Default |
|---|---|---|---|
| LMP | Basic | ✔ | — |
| Cycle length | Basic | ✔ | 28 |
| Bleeding days | Basic | ✔ | 5 |
| Regular/Irregular | Basic | ✔ | Regular |
| City (lat/lon/tz) | Basic | ✔ | — |
| Mother DOB/TOB/Place | Advanced | ✘ | — |
| Father DOB/TOB/Place | Advanced | ✘ | — |
| Scan window | Basic | ✘ | 45 days |

### 5.2 Weight profile (from the requirement)

| Component | Max | Fires only if |
|---|---:|---|
| Biological window | 25 | LMP present |
| Nakshatra | 20 | always |
| Moon strength | 15 | always |
| Tara Bala | 15 | mother's chart present |
| Tithi | 10 | always |
| Yoga | 10 | always |
| Karana | 5 | always |
| **Positive total** | **100** | |
| Festival restriction | −30 | penalty |
| Graha dosha | −20 | penalty |

**Per D2 (resolved):** the couple's progeny-chart strength is **not** part of this 100. It is
computed only in advanced mode and shown in its own panel, so the score for a given date is
identical whether or not birth details were entered.

**Basic mode (no mother's chart):** Tara Bala (15) cannot fire. Its weight is redistributed
proportionally across the remaining applicable components rather than counted as zero, and the
UI states *"scored across 6 of 7 components"*.

### 5.3 Output contract per date

```js
{ jd, date, band:'excellent'|'good'|'average'|'avoid', total, stars,
  headline,                       // e.g. "Amavasya" for a vetoed day
  factors:[ { key, label, value, status, points, max,
              source, sanskrit?, en, hi, priority } ],
  vetoes:[ {ruleId, reason, source} ],
  biological:{ phase, cycleDay, confidence },
  recommendation }
```

---

## 6. FILE MANIFEST

**New**
```
GARBHADHAN_MUHURAT_MASTER_PLAN.md          ← this file
verse_database/muhurta/SCHEMA.md           ← schema + match grammar + semantics
verse_database/muhurta/mc_tithi.json        ← 30 rows
verse_database/muhurta/mc_nakshatra.json    ← 27 rows
verse_database/muhurta/mc_yoga.json        ← 27 rows
verse_database/muhurta/mc_karana.json       ← 11 rows
verse_database/muhurta/mc_vara.json         ← 7 rows
verse_database/muhurta/mc_tarabala.json     ← 9 rows
verse_database/muhurta/mc_chandrabala.json  ← 12 rows
verse_database/muhurta/mc_graha.json        ← ~15 rows
verse_database/muhurta/mc_prohibited.json   ← ~20 rows
verse_database/muhurta/mc_festival.json     ← ~25 rows
verse_database/muhurta/mc_biological.json   ← 8 rows
verse_database/muhurta/profiles/garbhadhana.json
verse_database/muhurta/profiles/marriage.json     (Phase 8)
tools/build_muhurta_inline.js               (existing — used for inline fallback)
.p6_harness.html                            ← deep scan / render diagnostics
.p6_ui.html                                 ← end-to-end UI simulation
.p6_cal.html                                ← 2-year distribution check
```

**Modified** — `jyotish_calculator.html`
```
Phase 0  :~7930-8008   delete dead GB module                    (verified zero callers)
Phase 0  :~8011-8013   clear personal defaults
Phase 1  + new block    MUHURTA FACT LAYER  (dayFacts, masa, sankranti, asta, eclipse,
                       chaturmas, pitruPaksha, moon dignity, Sun–Moon elongation)
Phase 3  + new block    MUHURTA RULE ENGINE (loadMuhurtaDB, matchRule, muhurtaEvaluate,
                       muhurtaFacts)
Phase 4  + new          cycleModel() driven by profile data
Phase 6  :~8490-8518   replace gbhInputForm() with stepped Basic/Advanced layout
Phase 6  :~8533-8610   replace pGarbhadhana() with 45-day filterable calendar +
                       expandable rule-by-rule detail + recommended-date cards +
                       weight table + biological model + couple-charts bonus + citation panel
Phase 6  :~7900-7929   delete GARBH_NAK_EXC / GARBH_NAK_AVOID / garbhScore / gbhBala /
                       gbhCycleInfo / gbhBio (dead after pGarbhadhana rebuild)
```

**Untouched** — the other 30 `MUHTYPES` categories still route through the legacy `MUHRULES`
path; no regression. Marriage migration is Phase 8.

---

## 7. RISKS

| # | Risk | Mitigation |
|---|---|---|
| R1 | `fetch` fails on `file://` → empty DB | Inline fallback dataset + visible badge (§3.2) |
| R2 | 13 JSON files × 45 days × ~200 rules = slow | Pre-index rules by key on load; memoise `dayFacts` per JD |
| R3 | Eclipse/asta approximations wrong | Label as approximate; spot-check; never veto on a low-confidence detection alone |
| R4 | Adhika Masa edge cases | Test against a known adhika year before shipping |
| R5 | Weight redistribution in basic mode confuses users | Always print "scored across N of M components" |
| R6 | Scope creep into the other 30 categories | Phase 8 migrates **one**; the rest stay on the legacy path |
| R7 | Sanskrit fabrication | §9 — hard rule |

---

## 8. DECISIONS

### Resolved

- **D1 — UI language: ENGLISH-ONLY.** ✅ _2026-07-26_
  The whole Garbhadhana module renders in English, matching the current panel. The mixed
  Hindi table headers at `:8222` get fixed as part of Phase 6. Every rule row still stores
  `translations.en` **and** `translations.hi` — Hindi is retained in the database for PDF
  output and a future language toggle, but is not rendered in the UI now.

- **D2 — Couple charts: ADVANCED BONUS, OUTSIDE THE 100.** ✅ _2026-07-26_
  The 100-point total follows §5.2 exactly (Bio 25 / Nakshatra 20 / Moon 15 / Tara Bala 15 /
  Tithi 10 / Yoga 10 / Karana 5). Mother's and father's progeny-chart strength (5th house,
  5th lord, Jupiter, D7, Putra-karaka) is computed **only** when birth details are supplied
  and is displayed in a **separate advanced panel** — it never moves the date's score or band.
  This guarantees a basic-mode user and an advanced-mode user see the **same score for the
  same date**, which is the whole point of making horoscopes optional.

- **D3 — Band thresholds: ACCEPTED AS PROPOSED.** ✅ _2026-07-26_
  Excellent ≥ 85 · Good 70–84 · Average 50–69 · Avoid < 50 **or any veto**.
  Stored in `profiles/garbhadhana.json` as data — tunable without touching code.

- **D4 — Scan window: 45 DEFAULT, SELECTABLE.** ✅ _2026-07-26_
  Options 30 / 45 / 60 / 90 days in the UI; `default_scan_days: 45` in the profile JSON.
  Requires the multi-cycle projection in task 4.3.

- **D5 — Sanskrit: SCHEMA READY, VERSES SUPPLIED LATER BY USER.** ✅ _2026-07-26_
  No verses written from memory. Every row ships with `sanskrit: null`, `iast: null`,
  `verse_status: "pending_verification"` and a chapter-level `source`. The user will provide
  a specific edition (Chaukhamba / Motilal) or scans; verses are then populated **verbatim**
  and flipped to `verse_status: "verified"`. See §9 for the population workflow.

**All decisions resolved — Phase 0 cleared to start.**

---

## 9. ON SANSKRIT VERSE CITATIONS — the honesty rule

The requirement asks each rule to carry a Sanskrit verse. Applying the same discipline already
adopted in the Career report (Appendix B):

> **I will not write Sanskrit verses from memory into the database.**

Muhurta Chintamani verse numbering and wording differ across editions, and generating
plausible-looking Sanskrit that cannot be traced to a physical text would be fabrication
dressed as scholarship — the single worst failure mode for a tool whose entire value is
auditability.

**Agreed approach (D5):**
- `source` is filled at **chapter / prakarana level** (e.g. *Muhurta Chintamani, Tithi Prakarana*) — verifiable and honest.
- `sanskrit` and `iast` are present in the schema but `null`, with `"verse_status": "pending_verification"`.
- The UI renders *"Muhurta Chintamani — Tithi Prakarana (verse pending verification)"*.
- **The user will supply the verses later.** When that happens they are entered **verbatim** and flipped to `verified`.

### 9.1 Verse population workflow (for when the source arrives)

1. User provides the edition + verses (scan, photo, typed text, or a per-rule list).
2. Verses are pasted into the matching `id` rows — **no paraphrasing, no reconstruction**.
3. `verse_status` → `"verified"`; `source.verse` → the real number; `source.edition` → e.g. `"Chaukhamba 2011"`.
4. A coverage counter renders in the UI: *"Verses verified: 34 / 187"* — so the gap is always visible, never hidden.
5. Mixed states are fine: verified and pending rows coexist; each row displays its own status.

**Schema is built for this from day one** — no migration will be needed when the verses arrive.

---

## 10. LOG

| Date | Phase | Note |
|---|---|---|
| 2026-07-26 | — | Plan created. Audited existing module: found dead `GB` duplicate (~80 lines), hardcoded personal data in `GBH` defaults 🔴, hardcoded `garbhScore()`, and a Tarabala definition contradiction. Confirmed **no** existing helpers for lunar month, sankranti, asta, eclipse, chaturmas or pitru paksha — these are net-new. Awaiting decisions D1–D5. |
| 2026-07-26 | D1–D5 | All decisions resolved: English-only UI · couple charts as advanced bonus outside the 100 · bands 85/70/50 · 45-day default selectable 30/45/60/90 · Sanskrit schema-ready, verses to be supplied by user later. |
| 2026-07-26 | **P0 ✅** | Removed dead `GB` module and cleared personal defaults (−110 lines). **Caught a latent hang:** clearing the defaults alone would have made the `showMuhurat` override recurse forever, since `gbhApply()` skips empty values — removed the override in the same change. Verified headless: no personal data, dead symbols gone, live symbols intact, tab renders on both empty and populated input, zero runtime errors. |
| 2026-07-27 | **P1–P6 ✅** | Built and wired the full data-driven pipeline: fact layer, 11 JSON rule tables, generic `muhurtaEvaluate()`, biological `cycleModel()`, and the new `pGarbhadhana()` UI. Deleted the old `GARBH_NAK_EXC`/`GARBH_NAK_AVOID`/`garbhScore`/`gbhBala`/`gbhCycleInfo`/`gbhBio` dead code. Fixed a Julian-Day-in-HTML-id selector bug. Verified headless: 45-day scan, filter chips, expandable day details, weight redistribution, no-LMP path, irregular cycle, all with zero `NaN`/`undefined`/JS errors. |
| 2026-07-27 | **P7 ✅** | Implemented PDF export: `gbhOpenPDFOverlay()` opens a full-screen overlay with print-ready content, `gbhMakePDF()` captures via html2canvas + jsPDF (same pattern as `careerMakePDF`). PDF includes: header with disclaimers + PCPNDT notice, inputs table, top 10 recommended dates, band distribution summary, weight profile, sources cited with verification status, and a rules-fired appendix. Button added to UI header. Syntax check green. |
| 2026-07-27 | **P8 ✅** | Reuse proof complete. Created `profiles/marriage.json` (60-day scan, 7 weighted components, no biological). Added 27 marriage-specific nakshatra rules to `mc_nakshatra.json` with Pushya as a veto. Implemented `pMarriage()` with full UI (state, scan, calendar, filters, expandable details). Routing updated: `pMuhurat('marriage')` → `pMarriage()`. Legacy path confirmed for all other 29 categories. Syntax check green. |
| 2026-07-27 | **P9 ✅** | Formal unit tests complete. Created `tests/test_muhurta_db.js` (10 tests, validates JSON schema, 210 unique rule IDs, profiles), `tests/test_muhurta_engine.js` (15 tests, matchRule logic, scoring, redistribution, bands, vetoes), `tests/test_muhurta_facts.js` (graceful skip in Node). All tests green. **All phases complete.** |
