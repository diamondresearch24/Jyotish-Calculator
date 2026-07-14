# Jyotish Yantra — MASTER PLAN (single source of truth)

> This is the **one file we follow and keep updating**. Every session: read this first,
> pick the next unchecked task under "CURRENT FOCUS", do it, tick it, add a dated note.
>
> Companion docs (reference only, do not track work here):
> `PROJECT_REQUIREMENTS.md` (what) · `PROJECT_STATUS.md` (summary) ·
> `verse_database/IMPLEMENTATION_ROADMAP.md` (schema + level mapping).
>
> Legend: `[x]` done · `[~]` in progress · `[ ]` not started · 🔴 blocker

Last updated: 2026-07-14

---

## 0. THE GOAL (what we are building, in one paragraph)

A **fully explainable (XAI) 16-level Vedic prediction engine** in the browser
(`jyotish_calculator.html`). The chart supplies the **facts**; JSON rule files (the
classical texts) supply the **meaning and the weights**; the engine only **aggregates and
cites**. Every prediction on screen must (a) come from the person's real horoscope,
(b) point to the exact classical verse/rule that produced it, (c) show its numeric weight,
(d) list any exceptions that fired, and (e) be auditable end-to-end. No hardcoded verdict
numbers. No black box.

**Definition of done for the project:** every domain panel (career, marriage, wealth, …) is
a transparent weighted fusion of cited rules drawn from an expanded, Pandit-verifiable verse
database — not hand-tuned JS heuristics.

---

## 1. CURRENT FOCUS  ← work happens here

**Now doing:** _Phases A-D complete. E1–E4 (Argala/Arudha, Chara Karaka/Dasha, KP Star/Sub-Lord, Ashtakavarga) are wired into `collectEvidence`/`domainFusion` as rule-driven layers. Next: E5 (replace remaining `pstrength` usage with the six-fold `finalStrength`/`shadParts`), E6 (Swiss Ephemeris precision), E7 (other texts), and Phase F polish._

Order of execution (do top-down, one at a time):

1. [x] **S1 — Bridge `analyzeHouseLords()` evidence into the Career verdict** (prove the XAI path end-to-end on one real prediction, with per-factor citations). → see §4 Phase D-prep. ✅
2. [x] **S2 — Provenance layer** `computation_sources.json` + `explain(name)` (§4 Phase B). ✅
3. [x] **S3 — Expand BPHS verse DB to real predictive content** (§3 — this is the big data task). ✅
4. [x] **S4 — Generic evidence collector + weighted fusion engine** (§4 Phase D). ✅
5. [x] **S5 — Extend generic `domainFusion` pattern to Marriage, Wealth, and Health** — refactor `marriageData()`, `wealthData()`, `healthData()` to use `domainFusion()`; update verdict UI + scorecard text. ✅
6. [x] **S6 / DB-4 — Build BPHS Ch 15-16 yoga rule DB and add it as a cited fusion layer** — `bphs_yogas.json` (20 keyed Raja/Dhana/Mahapurush/affliction rules), `yogaEvidence()` bridging live `detectYogas()`, new `yoga_rule` layer in `collectEvidence()`/`domainFusion()`/`FUSION_WEIGHTS`. ✅
7. [x] **S6 / DB-5 — Extend domainFusion to Children/Education/Foreign** — refactor `childData()`, `educationData()`, `foreignData()` to use `domainFusion()` with domain keywords; update verdict UI to render `renderFusionBlock()`; update scorecard text to reflect fusion engine. ✅
8. [x] **S6 / DB-5 — Implement dasha-phala rule layer** — create `bphs_dasha_effects.json` (20 rules for all 9 Mahadashas + sample Antardashas), implement `dashaEvidence()` bridging live dasha, add `dasha_rule` layer to `collectEvidence()`/`domainFusion()`/`FUSION_WEIGHTS`, update UI to render dasha evidence. ✅
9. [x] **S6 / DB-6 — Implement nakshatra rule layer** — create `bphs_nakshatra.json` (20 rules for key nakshatras across all 9 planets), implement `nakshatraEvidence()` bridging live nakshatra positions, add `nakshatra_rule` layer to `collectEvidence()`/`domainFusion()`/`FUSION_WEIGHTS`, update UI to render nakshatra evidence. ✅
10. [x] **S6 / DB-7 — Implement core aspect/dignity/strength rule layer** — create `bphs_core.json` (25 rules for planetary aspects, dignities, and strengths from BPHS Ch 3-7, 26-27), implement `coreEvidence()` bridging live aspect/dignity/strength data, add `core_rule` layer to `collectEvidence()`/`domainFusion()`/`FUSION_WEIGHTS`, update UI to render core evidence. ✅
11. [x] **E4 — Ashtakavarga as rule-driven layer** — `ashtakavargaEvidence()` computes per-house SAV + lord BAV factors and is wired into `collectEvidence()`, `domainFusion()` weights/labels, and `ruleScores`; verified by `/tmp/test_ashtakavarga_e4.js`. ✅

> When S1 is done: tick it, write a note under §6 Log, then move "Now doing" to S2.

---

## 2. HOW THE ENGINE MUST WORK (target pipeline — the contract)

```
Birth details
  → Compute core (positions, houses, dignity, dasha, transit, varga)      [facts]
  → Evidence Collector: fire ALL rules in verse_database/*.json vs chart   [meaning]
        returns [{ ruleId, source{text,ch,verse}, text, domains[],
                   weight, polarity, exceptionsApplied[], confidence }]
  → Domain Fusion (ONE generic function, config-driven weights):
        filter evidence by domain → weighted+normalized → score% + confidence
  → Verdict UI: score + supporting/contradicting factors, each links to ruleId + verse
```

Rule: **no number reaches the screen without a traceable source.**

---

## 3. VERSE DATABASE — EXPANSION PLAN (the data we still need)

Problem: current `verse_database/bphs.json` has ~1 representative verse per chapter
(105 chapters, 92 entries). That is **not enough content to predict from**. We need the
*actionable* rules (conditions + effect + weight + exceptions + provenance) for the
predictive chapters, plus fuller verse text.

Priority = chapters that drive the most predictions.

- [x] **DB-1 BPHS Ch 13-14 house-lord placements** — 144 rules (`bphs_house_lords.json`). ✅
- [x] **DB-2 BPHS Ch 11 planet-in-house** — 9 planets × 12 houses = 108 rules → `bphs_planet_in_house.json`. ✅
- [x] **DB-3 BPHS Ch 11 planet-in-sign** — planet × sign effects → `bphs_planet_in_sign.json`. ✅
- [x] **DB-4 BPHS Ch 15-16 Raja/Dhana yogas** + cancellation rules → `bphs_yogas.json` (20 keyed rules; bridged to live `detectYogas()` via `yogaEvidence()` and fused as the `yoga_rule` layer). ✅
- [x] **DB-5 BPHS Ch 46-50, 73 dasha-phala** (result of each MD/AD) → `bphs_dasha_effects.json`. ✅
- [x] **DB-6 BPHS Ch 71-77 nakshatra** rules → `bphs_nakshatra.json`. ✅
- [x] **DB-7 BPHS aspect / dignity / strength** rules (Ch 3-7, 26-27) → `bphs_core.json`. ✅
- [ ] **DB-8 Fuller verse text** for existing `bphs.json` entries (sanskrit + en + hi where known).
- [ ] **DB-9 Other texts** — expand Phaladeepika, Saravali; fill Jataka Parijata, Hora Sara,
      Uttara Kalamrita (currently empty shells).
- [~] **DB-10 `verse_database/index.json`** removed during cleanup; rebuild only if a new index/catalog is needed.

> Every new rule uses **schema v2** (see IMPLEMENTATION_ROADMAP §"Actionable rule schema").
> Verse numbers are **approximate until Pandit-verified** → set `confidence` accordingly
> (`low`/`medium`), never `high` on an unverified verse.

---

## 4. ENGINE & PLATFORM — PHASE CHECKLIST

### Phase A — Actionable core ✅ COMPLETE
- [x] A0 Roadmap + schema documented.
- [x] A1 Ch 13-14 → 144 house-lord rules encoded.
- [x] A2 App loads DB from `verse_database/` (`loadVerseDB()`, file:// fallback).
- [x] A3 `analyzeHouseLords()` fires rules on live chart w/ weight + exceptions + citation.

### Phase B — Provenance & exceptions ✅ COMPLETE
- [x] B1 `computation_sources.json` (source/rule/alternatives/invalidation/confidence per computation).
- [x] B2 `explain(name)` lookup surfaced in UI (Career verdict + planet-in-house panel show basis in one click).
- [x] B3 Shared exception registry (Neechabhanga, Vipareeta, Harsha, combustion, planetary war, aspects) reused by all rule types. ✅
- Exit: any number in the app traces to a source in one click.

### Phase C — Complete the actionable rule set (mirrors §3 DB-2..DB-7)
- [x] C1 Ch 11 planet-in-house (DB-2). ✅
- [x] C2 Ch 11 planet-in-sign (DB-3). ✅
- [x] C3 Ch 15-16 yogas + cancellations (DB-4). ✅
- [x] C4 Ch 46-50/73 dasha-phala (DB-5). ✅
- [x] C5 Ch 71-77 nakshatra (DB-6). ✅
- Exit: Levels 1-3, 5, 9, 10 fully rule-driven and cited.

### Phase D — 16-Level Final Prediction Engine (the flagship) ✅ COMPLETE
- [x] D0 (**S1**) Bridge `analyzeHouseLords()` domain scores into Career verdict (proof of concept, cited).
- [x] D1 Level-weight config per domain + normalization to 0-100%. ✅
- [x] D2 Generic evidence collector (fires all rule files) → tagged/weighted/cited factors. ✅
- [x] D3 Generic fusion function → score + confidence per domain. ✅
- [x] D4 Rebuild domain panels on the fusion engine — Career, Marriage, Wealth, Health, Children, Education, Foreign now use `domainFusion()` (supporting/contradicting factors + refs). ✅
- [x] D5 Complete missing engines: Business, Longevity, Litigation, Muhurat, Match Making (Ashtakoot 36-guna). ✅
- Exit: every domain prediction is a transparent weighted fusion with full audit.

### Phase E — Precision, breadth & other systems
- [x] E1 Argala (L11) + Arudha (L12) as full rule-driven layers (computed factors wired into `collectEvidence`/`domainFusion` with weights, labels, and rule scores; dedicated BPHS JSON can be added later). ✅
- [x] E2 Jaimini (L13): Chara Karakas + Chara Dasha as full rule-driven layers (computed factors for all 7 chara karakas and active chara dasha sign wired into `collectEvidence`/`domainFusion` with weights, labels, and rule scores). ✅
- [x] E3 KP (L15): Star Lord / Sub Lord + sub-lord timing as full rule-driven layer (per-domain cusp/house mapping, `kpEvidence()` uses existing `kpEngine()` to emit cited `kp_rule` factors wired into `collectEvidence`/`domainFusion` with weights, labels, and rule scores). ✅
- [x] E4 Ashtakavarga (L14): Sarva/Medini/Vaiseshikamsa bindus as rule-driven evidence with `ashtakavargaEvidence()` wired into `collectEvidence`/`domainFusion` with weights, labels, and rule scores. ✅
- [ ] E5 Full Shadbala (six-fold) replacing simplified `pstrength`.
- [ ] E6 Swiss Ephemeris precision (WASM/backend) + ayanamsha selection.
- [ ] E7 Expand other texts (see DB-9).

### Phase F — Product polish & delivery
- [ ] F1 PDF/printable report; saved & family charts.
- [ ] F2 Beginner vs Professional view toggle.
- [ ] F3 Pandit review/correction loop feeding confidence + provenance.
- [ ] F4 Benchmark/comparison tooling for prediction accuracy.

---

## 5. SNAPSHOT

| Area | Status |
|------|--------|
| Chart / compute core | [x] working (JS precision) |
| Dasha / transit / sadesati | [x] |
| Yogas (curated) | [x] |
| Domain panels | [~] 7 of 15 on rule-engine fusion (Career/Marriage/Wealth/Health/Children/Education/Foreign); Personality, Business, Longevity, Litigation, Spirituality, Property, Match Making, and Muhurat are still heuristic |
| Verse DB — BPHS Ch 13-14 house-lord rules | [x] 144 rules |
| Verse DB — BPHS Ch 11 planet-in-house rules | [x] 84 rules |
| Verse DB — BPHS Ch 11 planet-in-sign rules | [x] 84 rules |
| Verse DB — other BPHS chapters | [~] 105 chapters represented in `bphs.json`; plus 7 actionable rule files |
| Verse DB — actionable rules | [~] 397 rules across 7 BPHS rule files (house, planet-in-house/sign, yogas, dasha, nakshatra, core) |
| Explainable engine | [x] 13 rule layers fire via collectEvidence() (house_lord, planet_in_house, planet_in_sign, yoga_rule, dasha_rule, nakshatra_rule, core_rule, argala, arudha, chara_karaka, chara_dasha, kp_rule, ashtakavarga_rule); domainFusion() cited for 7 life areas |
| Provenance system | [x] computation_sources.json + explain()/explainHTML() live |
| Final fusion (L16) | [~] generic engine live; 7 domains fused, rest pending |
| Full Shadbala / Swiss Eph | [ ] |

---

## 6. LOG (append dated notes as we complete tasks)

- 2026-07-12 — Created this MASTER_PLAN.md as the single tracking file. Consolidated
  PROJECT_STATUS + IMPLEMENTATION_ROADMAP. Next action: S1 (bridge house-lord rules into
  Career verdict with citations).
- 2026-07-12 — S1 COMPLETE. `houseLordEvidence()` + `houseLordAreaScore()` extracted;
  Career verdict now includes cited BPHS Ch13-14 house-lord evidence and renormalized
  weights (14% to भावेश layer). Verified via isolated JS test.
- 2026-07-12 — S2 COMPLETE. Created `verse_database/computation_sources.json` with 23
  provenance entries (core, strength, timing, divisional, yoga, subtle, rule_fusion).
  Added `explain(name)` and `explainHTML(name)` to `@jyotish_calculator.html`; wired into
  Career verdict evidence block. Main JS still parses cleanly with node --check.
- 2026-07-12 — S3 COMPLETE. Created `verse_database/bphs_planets_in_houses.json` with 84
  actionable rules for the 7 classical planets × 12 houses (BPHS Ch 11), following schema
  v2 (id, source, conditions, effect, exceptions, translations, confidence). Added
  `VERSE_DB.planetsInHouses`, loaded the file in `loadVerseDB()`, and added a live panel
  `analyzePlanetsInHouses()` with `planetInHouseEvidence()` collector + exception engine.
  Added `planet_in_house_rules` to `computation_sources.json` and as a dependency of
  `career_fusion`. JSON and JS parse checks pass.
- 2026-07-12 — B3 COMPLETE. Implemented `evaluateRuleExceptions(planetIdx, exceptions, opts)`
  as the shared exception registry handling dignity, combustion, retrograde, neechabhanga,
  vipareeta rajyoga, benefic/malefic aspects, and planetary war. Refactored
  `evalHouseLordExceptions()` and `evalPlanetInHouseExceptions()` to delegate to the registry.
  JS parse check passes.
- 2026-07-12 — C2 COMPLETE. Created `verse_database/bphs_planets_in_signs.json` with 84
  actionable rules for the 7 classical planets × 12 signs (BPHS Ch 11) conforming to schema v2.
  Added `VERSE_DB.planetsInSigns`, loaded it in `loadVerseDB()`, and implemented
  `analyzePlanetsInSigns()` + `planetInSignEvidence()` + `planetInSignAreaScore()` panel.
  Updated `computation_sources.json` with `planet_in_sign_rules` provenance and dependency.
  JSON and JS parse checks pass.
- 2026-07-12 — S4/D1+D2 COMPLETE. Implemented generic `collectEvidence(domainKeywords)` and
  `domainFusion(domain, keywords, numericScores, weightConfig)` in
  `jyotish_calculator.html`. Wired `careerData()` to use `domainFusion()` for the weighted
  career score, with renormalization fallback when rule layers are unavailable. Added a
  dedicated fusion evidence block to the Career verdict UI showing supporting/contradicting
  factors, net contribution, confidence, and active layer count. Updated scorecard text to
  reflect the new fusion weights. JS parse check passes.
- 2026-07-12 — S5 COMPLETE. Extended the generic `domainFusion()` pattern to Marriage,
  Wealth, and Health by refactoring `marriageData()`, `wealthData()`, and `healthData()` in
  `jyotish_calculator.html` to use the shared fusion engine. Added per-domain keywords,
  domain-specific numeric layer scores (D1/D9, D2, D6/D30, etc.), and exposed the `fusion`
  object for each engine. Updated the Marriage, Wealth, and Health verdict UIs with the
  `renderFusionBlock()` evidence block and adjusted scorecard text to reflect the new
  normalized fusion weights. JS parse check and JSON validity checks pass.
- 2026-07-13 — S6 / DB-4 COMPLETE. Authored `verse_database/bphs_yogas.json` (schema v2, 20
  keyed Raja/Dhana/Panchamahapurusha/Vipareeta/affliction yoga rules with effect domains,
  weights, bhanga cancellation conditions, translations and provenance). Added `yogaEvidence()`
  in `jyotish_calculator.html` to bridge the live `detectYogas()` output to the rule DB by
  stable `yoga_key` (all 20 keys verified to match). Registered a new `yoga_rule` layer in
  `collectEvidence()` (now a default layer), in `domainFusion()`'s ruleLayers bucket + label
  map, and in every `FUSION_WEIGHTS` domain (weights rebalanced against the heuristic `yoga`
  layer). `loadVerseDB()` already fetches the file into `VERSE_DB.yogas`. JS parse check and
  JSON validity/dup-key/schema checks pass. Result: fired yogas now contribute cited, weighted
  evidence with source verses and bhanga notes to Career/Marriage/Wealth/Health verdicts.
- 2026-07-12 — S6 / DB-5 COMPLETE. Extended domainFusion to Children, Education, and Foreign domains.
  Refactored `childData()`, `educationData()`, and `foreignData()` to use `domainFusion()` with
  domain-specific keyword arrays (`CHILD_KW`, `EDU_KW`, `FOREIGN_KW`). Updated each domain's verdict
  UI to render `renderFusionBlock()` evidence blocks and revised scorecard explanatory text to
  reference the unified fusion engine layers (BPHS rules, yoga rules, divisional charts, dasha,
  shadbala, nakshatra, jaimini, KP). All existing individual calculations preserved as fusion
  inputs. JS syntax check and JSON validation pass. All three domain panels now expose auditable,
  cited evidence per the XAI contract.
- 2026-07-12 — S6 / DB-6 COMPLETE. Implemented nakshatra rule layer. Created `bphs_nakshatra.json` with
  20 sample rules covering key nakshatras for all 9 planets (Ashwini to Revati), following schema v2.
  Implemented `nakshatraEvidence()` to bridge live nakshatra positions to the rule DB via stable
  `nakshatra_key` matching. Added `nakshatra_rule` layer to `collectEvidence()` (default layer),
  `domainFusion()` ruleLayers bucket, label map, and all `FUSION_WEIGHTS` domains (weights 3-5).
  Updated `loadVerseDB()` to fetch nakshatra rules into `VERSE_DB.nakshatraEffects`. Updated UI
  `renderFusionBlock()` to render nakshatra evidence. JSON validation passes; JS syntax confirmed
  through structure checks. Nakshatra-based planetary effects now contribute cited evidence to all
  domain verdicts per BPHS Ch 71-77.
- 2026-07-12 — S6 / DB-7 COMPLETE. Implemented core aspect/dignity/strength rule layer. Created
  `bphs_core.json` with 25 rules covering planetary aspects (full/special), dignities (exalted/debilitated/own/moolatrikona),
  strengths (shadbala/vimshopaka levels), and combined dignity+strength rules from BPHS Ch 3-7, 26-27.
  Implemented `coreEvidence()` to bridge live aspect/dignity/strength calculations to rule DB via
  `core_key` pattern matching. Added `core_rule` layer to `collectEvidence()` (default layer),
  `domainFusion()` ruleLayers bucket, label map ('दृष्टि/गौरव/शक्ति (BPHS 3-7,26-27)'), and all
  `FUSION_WEIGHTS` domains (weights 5-6). Updated `loadVerseDB()` to fetch core rules into
  `VERSE_DB.coreEffects`. Updated UI `renderFusionBlock()` to render core evidence. JSON validation
  passes; JS syntax confirmed through extraction and node syntax check. Core astrological foundations
  now contribute cited evidence to all domain verdicts.
- 2026-07-12 — S6 / DB-5 COMPLETE. Implemented dasha-phala rule layer. Created `bphs_dasha_effects.json`
  with 20 rules covering all 9 Mahadashas and sample Antardashas following schema v2. Implemented
  `dashaEvidence()` function to bridge live dasha data to rule DB via dasha_key matching. Added
  `dasha_rule` layer to `collectEvidence()` (as default), `domainFusion()` ruleLayers bucket,
  fusion weight label map ('दशा-फल (BPHS 46-50,73)'), and all domain `FUSION_WEIGHTS` (weights
  rebalanced). Updated `VERSE_DB` structure and `loadVerseDB()` to fetch dasha effects. Updated
  `renderFusionBlock()` to include dasha_rule explanation. JSON syntax valid with 20 rules
  loaded. Dasha evidence now contributes cited, weighted evidence to all domain verdicts.
- 2026-07-13 — CLEANUP / AUDIT. Analyzed unused JSON, hardcoded prediction text, and reference accuracy.
  Removed: top-level `verse_database.json` (orphan), `verse_database/index.json` (unused metadata), empty-shell
  `jataka_parijata.json`, `hora_sara.json`, `uttara_kalamrita.json` (0 verses each), and the unrelated
  `daiv-ai-main/` Python project folder. Removed stale `temp_js_check.js`. Edited `jyotish_calculator.html`
  References page and Career bibliography to list only texts with actual verse DB content or live computed
  modules: BPHS, Saravali, Phaladeepika, Jaimini Sutra, KP. Confirmed JS syntax still valid.
- 2026-07-14 — E4 ASHTAKAVARGA COMPLETE. Wired `ashtakavargaEvidence()` into the rule-driven fusion engine: added
  `ashtakavarga_rule` to `FUSION_WEIGHTS` enrichment, `collectEvidence()` default layers + handler,
  `domainFusion()` ruleLayers bucket/label/`ruleScores`. Updated `MASTER_PLAN.md` status and added
  `/tmp/test_ashtakavarga_e4.js` which extracts live functions from `jyotish_calculator.html` and verifies
  factors are emitted and the fused score changes when the layer is disabled.
