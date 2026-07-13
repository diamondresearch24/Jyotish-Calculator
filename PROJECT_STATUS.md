# Jyotish Yantra — Project Status & Phase Plan

Version: 1.0 · Last updated: 2026-07-12
Companion docs: `PROJECT_REQUIREMENTS.md` (what we're building) ·
`verse_database/IMPLEMENTATION_ROADMAP.md` (engineering detail)

Legend: ✅ done · 🟡 partial · ⬜ not started

---

## 1. Executive summary

- The app (`jyotish_calculator.html`) is a working single-file browser engine: it computes
  charts, dashas, yogas, strengths and renders 26 analysis modules incl. 9 domain
  prediction panels.
- The **verse database** now exists per-text under `verse_database/`, with **BPHS covering
  all 105 chapters** (representative verses) and the **first fully actionable rule set**:
  144 house-lord rules (Ch 13-14).
- The **explainable rule engine** has started: `analyzeHouseLords()` fires the 144 rules on
  the live chart with weights, exception checks and per-rule citations.
- The biggest gap: the **16-level weighted fusion** ("Final Prediction Engine") and
  converting the remaining classical rules into the actionable schema.

---

## 2. What is implemented so far ✅

### 2.1 Compute core
- ✅ Planetary positions (9 grahas), Ascendant, MC (Keplerian/Moshier + Lahiri ayanamsha).
- ✅ Whole-sign houses; Placidus cusps + Sripati chalit.
- ✅ Nakshatra + pada, dignity (exalt/debil/own/moolatrikona), combustion, retrograde,
  vargottama.
- ✅ Divisional charts: D1, D2, D7, D9, D10, D12, D24, D30, D60.
- ✅ Panchanga (tithi, vara, nakshatra, yoga, karana, sunrise/sunset).

### 2.2 Strength, dasha, transit
- 🟡 Planet strength score with reasons (`pstrength`) — Shadbala-style, not full six-fold.
- 🟡 Ashtakavarga (`ashtakavarga`, `getAVStrength`) — computed, interpretation partial.
- ✅ Vimshottari dasha (MD/AD/PD) + current-dasha detection + timeline.
- ✅ Transit (Gochar) module.
- ✅ Sadesati analysis.

### 2.3 Analysis & prediction UI (RENDER modules)
- ✅ Foundations: `panchanga`, `planets`, `houses`, `nak` (nakshatra), `charts`.
- ✅ `yogas` (Gajakesari, Budhaditya, Pancha Mahapurusha, Raja, Dhana, Vipareeta,
  Neechabhanga, Kemadruma, Parivartana, etc. with strength + activation + source).
- ✅ `strength`, `dasha`, `transit`, `sadesati`, `timeline`, `summary`.
- ✅ Domain prediction panels: `career`, `marriage`, `wealth`, `health`, `education`,
  `children`, `foreign`, `property`, `spiritual`.
- ✅ `remedies`.
- ✅ `evidence`, `risks`, `references` (transparency-oriented views).

### 2.4 Verse database & XAI foundation
- ✅ Split per-text DB in `verse_database/` + `index.json`.
- ✅ **BPHS all 105 chapters** have representative verses (`bphs.json`, 92 entries).
- ✅ **144 actionable house-lord rules** (`bphs_house_lords.json`, BPHS Ch 13-14) in
  schema v2 (conditions/effect/weight/exceptions/provenance).
- ✅ App wired to load DB from `verse_database/` (`loadVerseDB()`, file:// fallback).
- ✅ Live explainable engine `analyzeHouseLords()` — fires 144 rules on the chart, applies
  exception checks (dignity, combust, neechabhanga, vipareeta), shows weight + citation +
  per-domain net score.
- ✅ `PROJECT_REQUIREMENTS.md`, `PROJECT_STATUS.md`, `verse_database/IMPLEMENTATION_ROADMAP.md`.

---

## 3. What is pending ⬜ / partial 🟡

### 3.1 Rule content (convert prose → actionable rules)
- ⬜ Ch 11: planet-in-house effects (9 planets × 12 houses = 108 rules).
- ⬜ Ch 11: planet-in-sign effects.
- ⬜ Ch 15-16: Raja/Dhana yogas with formal cancellation rules.
- ⬜ Ch 46-50, 73: dasha-phala (result of each dasha/antardasha).
- ⬜ Ch 71-77: nakshatra rules (gana, yoni, effects).
- 🟡 BPHS verses currently descriptive placeholders for many chapters — need actionable
  `conditions`/`effect` blocks.

### 3.2 Engine layers (16-level)
- 🟡 L7 Subtle (Argala/Arudha) — not firing as rules yet.
- ⬜ L11 Argala — dedicated computation + rules.
- 🟡 L12 Arudha Lagna — partial.
- 🟡 L13 Jaimini (Chara Karakas, Chara Dasha) — partial.
- 🟡 L14 Ashtakavarga interpretation — computed, needs weighted interpretation.
- 🟡 L15 KP (cusps done; Star Lord / Sub Lord + timing) — partial.
- ⬜ **L16 Final Prediction Engine** — weighted fusion of all layers into one explainable
  score per domain (the core XAI deliverable). Currently only the house-lord evidence layer
  is wired.

### 3.3 Provenance & exceptions
- ⬜ `computation_sources.json` + `explain(name)` lookup (source/rule/alternatives/
  invalidation/confidence) for every computation.
- ⬜ Central exception registry shared across all rule types.

### 3.4 Missing prediction engines (vs PRD)
- ⬜ Business Engine, Longevity Engine, Litigation Engine, Muhurat Engine, Match Making
  (Ashtakoot 36-guna) Engine.

### 3.5 Precision & platform
- ⬜ Swiss-Ephemeris-grade precision (WASM or backend).
- ⬜ PDF/report export, saved charts, family charts.
- 🟡 Full confidence-scoring + alternative-prediction suggestions across all modules.

### 3.6 Other texts
- 🟡 Phaladeepika (2 verses), Saravali (1) — need expansion.
- ⬜ Jataka Parijata, Hora Sara, Uttara Kalamrita — currently empty shells.

---

## 4. Phase plan (detailed)

Six phases. Phases A–B are the critical path to the explainable engine; C expands rule
coverage; D–F add breadth, precision and polish.

### Phase A — Actionable core (STATUS: ✅ complete)
Goal: prove the XAI pipeline end-to-end with the highest-value rule set.
- ✅ A0 Roadmap + schema documented.
- ✅ A1 BPHS Ch 13-14 — 144 house-lord rules encoded.
- ✅ A2 App loads verse DB from `verse_database/` (removed hardcoded samples).
- ✅ A3 `analyzeHouseLords()` fires rules on live chart with weights, exceptions, citations.

### Phase B — Provenance & exception framework (STATUS: ⬜ next)
Goal: no result without a citation; exceptions centralized.
- ⬜ B1 `computation_sources.json` — source/rule/alternatives/invalidation/confidence for
  every computation.
- ⬜ B2 `explain(name)` lookup surfaced in the UI (every panel can show its basis).
- ⬜ B3 Shared exception registry (Neechabhanga, Vipareeta, Harsha, combustion, war,
  benefic/malefic aspect) reused by all rule types.
- Exit criteria: any number shown in the app can be traced to a source in one click.

### Phase C — Complete the actionable rule set (STATUS: ⬜)
Goal: rule-completeness for the core predictive chapters.
- ⬜ C1 Ch 11 planet-in-house (108 rules) in schema v2.
- ⬜ C2 Ch 11 planet-in-sign rules.
- ⬜ C3 Ch 15-16 Raja/Dhana yogas + cancellation rules.
- ⬜ C4 Ch 46-50 / 73 dasha-phala rules.
- ⬜ C5 Ch 71-77 nakshatra rules.
- Exit criteria: Levels 1-3, 5, 9, 10 fully rule-driven and cited.

### Phase D — 16-Level Final Prediction Engine (STATUS: ⬜)
Goal: the flagship deliverable — weighted fusion.
- ⬜ D1 Level-weight configuration (per domain) + normalization to 0-100%.
- ⬜ D2 Fusion function that aggregates all layers' cited evidence into one score +
  confidence per domain.
- ⬜ D3 Rebuild each domain panel (career/marriage/wealth/...) on top of the fusion engine,
  showing supporting vs contradicting factors, final score, confidence, references.
- ⬜ D4 Complete missing engines: Business, Longevity, Litigation, Muhurat, Match Making.
- Exit criteria: every domain prediction is a transparent weighted fusion with full audit.

### Phase E — Precision, breadth & other systems (STATUS: ⬜)
- ⬜ E1 Argala (L11), Arudha (L12) as full rule-driven layers.
- ⬜ E2 Jaimini (L13): Chara Karakas + Chara Dasha.
- ⬜ E3 KP (L15): Star Lord / Sub Lord + sub-lord-based timing.
- ⬜ E4 Ashtakavarga weighted interpretation (L14).
- ⬜ E5 Swiss Ephemeris precision (WASM/backend) with ayanamsha selection.
- ⬜ E6 Expand Phaladeepika / Saravali / Jataka Parijata / Hora Sara / Uttara Kalamrita.

### Phase F — Product polish & delivery (STATUS: ⬜)
- ⬜ F1 PDF/printable report; saved & family charts.
- ⬜ F2 Beginner vs Professional view toggle.
- ⬜ F3 Pandit review/correction loop feeding confidence + provenance.
- ⬜ F4 Benchmark/comparison tooling for prediction accuracy.

---

## 5. Progress snapshot

| Area | Status |
|------|--------|
| Chart / compute core | ✅ working (JS-precision) |
| Dasha / transit / sadesati | ✅ |
| Yogas | ✅ (curated set) |
| Domain prediction panels | ✅ 9 of 14 (heuristic, pre-fusion) |
| Verse DB (BPHS chapters) | ✅ 105/105 chapters represented |
| Actionable rules | 🟡 144/‌(many hundreds target) — Ch 13-14 done |
| Explainable rule engine | 🟡 house-lord layer live; fusion pending |
| Provenance system | ⬜ |
| 16-level fusion (L16) | ⬜ |
| Precision (Swiss Eph) | ⬜ |

---

## 6. Immediate next step

Begin **Phase B (provenance & exceptions)** or **Phase C1 (Ch 11 planet-in-house rules)** —
both feed directly into the Phase D fusion engine.
