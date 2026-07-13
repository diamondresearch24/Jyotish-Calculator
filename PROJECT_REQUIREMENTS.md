# Jyotish Yantra — Project Requirements Document (PRD)

Version: 1.0 · Last updated: 2026-07-12 · Owner: diamondresearch24/Jyotish-Calculator

---

## 1. Vision

We are **not** building another astrology app that shows charts and gives generic
predictions. We are building a **professional, explainable Vedic Astrology Prediction
Engine** — "Jyotish Yantra" — where every prediction is transparent, traceable, and
verifiable.

Every prediction must answer five questions:

1. **What** is the prediction?
2. **Why** is it being predicted?
3. **How strong** is it (numeric score + confidence)?
4. **Which classical rules** support it (exact citations)?
5. **What evidence** in the horoscope confirms it?

Nothing is a black box. Every score is explainable. The system works like **Explainable
AI (XAI)** for Jyotish — a decision-support engine for both beginners and professional
astrologers, not a replacement for an astrologer.

### Example of the target output style

> **Career strength: 82%**
> - 10th lord Mercury is strong (+8)
> - D10 supports profession (+6)
> - Jupiter aspects the 10th house (+5)
> - Strong Raja Yoga (+7)
> - Current Mahadasha activates career (+9)
> - Negative: Saturn aspect (−4), weak 6th house (−2)
> - References: BPHS Ch 13-14, Phaladeepika Ch 6

---

## 2. Goals & Non-Goals

### 2.1 Goals
- **Transparency**: expose every planet, house, yoga, dasha, transit, varga and text
  reference behind a conclusion.
- **Traceability**: every computation cites a classical source (chapter/verse) with
  confidence level and known invalidation conditions.
- **Rule-completeness**: encode every *actionable* classical rule (with conditions and
  exceptions), not just prose verses.
- **Dual audience**: plain-language mode for beginners; full technical data for professionals.
- **Offline-first**: runs in a browser with no install, no server dependency for core compute.

### 2.2 Non-Goals (for now)
- Replacing a human astrologer's judgement.
- Automated life-changing decisions (medical, legal, financial) — the tool is advisory.
- Fatalistic / fear-based predictions.

---

## 3. Core Philosophy — Explainable AI for Jyotish

Every section of the engine follows the same 6-part structure:

1. **Simple Explanation** — the concept in plain language.
2. **Classical Logic** — the Jyotish rule being applied.
3. **Horoscope Evidence** — charts, planets, houses, yogas involved.
4. **Numerical Contribution** — each factor contributes signed points (+/−).
5. **Final Strength** — a percentage + confidence level.
6. **Supporting References** — exact classical sources (text, chapter, verse).

**Transparency requirements** — every prediction must expose which planet supports it,
which house contributes, which yoga activates it, which dasha triggers it, which transit
confirms it, which divisional chart agrees, and which classical text supports it.

---

## 4. The 16-Level Analysis System

The engine evaluates a horoscope through sixteen independent layers before producing a
final prediction. Each layer emits weighted, cited evidence.

| Level | Layer | Description |
|-------|-------|-------------|
| 1 | Foundations | Placements, signs, houses, dignity, friendships, aspects |
| 2 | House Analysis | Deep analysis of each relevant house with full reasoning |
| 3 | Yogas | Career, wealth, marriage, spiritual and other yogas + activation |
| 4 | Divisional Charts | D1, D9, D10, D7, D60 and other Vargas per prediction type |
| 5 | Dasha System | Mahadasha → Antardasha → Pratyantar → Sookshma → Prana + timing |
| 6 | Transit (Gochar) | Current planetary influences and activation |
| 7 | Subtle Prediction | Argala, Arudha, hidden influences, advanced logic |
| 8 | Planet Strength | Full Shadbala and all strength parameters |
| 9 | House Lordship | Functional benefics/malefics, lordship, ownership |
| 10 | Nakshatra Analysis | Planetary psychology, destiny coding, nakshatra activation |
| 11 | Argala | Primary and secondary intervention analysis |
| 12 | Arudha Lagna | Public image, perception, material manifestation |
| 13 | Jaimini System | Karakas, Pada, Chara Dasha, Jaimini principles |
| 14 | Ashtakavarga & Shadbala | Numerical strength and support system |
| 15 | KP Elements | Cusps, Star Lords, Sub Lords, precise timing |
| 16 | Final Prediction Engine | Weighted fusion of all layers into one explainable output |

---

## 5. Prediction Modules

Each domain engine uses the same 16-level framework but focuses on domain-specific
combinations.

- **Career Engine**
- **Marriage Engine**
- **Wealth Engine**
- **Health Engine**
- **Education Engine**
- **Child & Progeny Engine**
- **Foreign Travel Engine**
- **Property Engine**
- **Business Engine**
- **Spirituality & Karma Engine**
- **Longevity Engine**
- **Litigation Engine**
- **Muhurat Engine**
- **Match Making Engine**

---

## 6. Functional Requirements

### 6.1 Chart computation
- Compute planetary longitudes (9 grahas incl. Rahu/Ketu), Ascendant, MC, house cusps.
- Sidereal zodiac with **Lahiri ayanamsha** (configurable in future).
- Whole-sign houses for lordship/yogas; Placidus/Sripati cusps for KP/Chalit.
- Nakshatra + pada, dignity (exalt/debil/own/moolatrikona), combustion, retrograde,
  vargottama.
- Divisional charts: at minimum D1, D2, D7, D9, D10, D12, D24, D30, D60.
- Panchanga: tithi, vara, nakshatra, yoga, karana, sunrise/sunset.

### 6.2 Strength & support
- Shadbala (six-fold strength) and per-planet strength score with reasons.
- Ashtakavarga: Bhinnashtakavarga + Sarvashtakavarga.

### 6.3 Dasha & timing
- Vimshottari dasha to at least 3 levels (MD/AD/PD), ideally 5 (Sookshma/Prana).
- Current dasha detection and event-timing windows.
- Sadesati (Saturn) analysis.

### 6.4 Rule engine (XAI core)
- Load machine-actionable rules from `verse_database/`.
- Fire rules against the computed chart; evaluate exceptions; produce weighted, cited
  evidence bullets.
- Aggregate per-domain scores and confidence.

### 6.5 Verse database & lookup
- Search classical verses by text/category.
- Every verse links to its implementation function + status + provenance.

### 6.6 Delivery
- Browser UI (Hindi + English), responsive, offline-capable.
- City search / geolocation for birth place → lat/lon/timezone.
- Future: printable/PDF report, saved charts, family charts.

---

## 7. Non-Functional Requirements

- **Accuracy**: planetary positions within acceptable tolerance (current JS engine
  ~≤2′; target Swiss-Ephemeris-grade precision via WASM/backend in future).
- **Explainability**: no prediction without at least one cited rule and a numeric score.
- **Performance**: full report renders in < 2s on a typical laptop.
- **Portability**: single-file browser app; works from GitHub Pages and offline.
- **Maintainability**: rules are data (JSON), not code; adding rules must not require
  engine changes.
- **Verifiability**: verse citations must be Pandit-verifiable; confidence levels honest.

---

## 8. Technical Architecture

### 8.1 Current (v1)
- **Frontend/engine**: single self-contained file `jyotish_calculator.html` (HTML + CSS +
  vanilla JS). Custom Keplerian/Moshier-style ephemeris + Lahiri ayanamsha.
- **Data**: `verse_database/` JSON files (classical rules + verses), loaded via `fetch`.
- **External**: Open-Meteo geocoding API for city → coordinates/timezone.
- **Hosting**: GitHub Pages (see `CNAME`).

### 8.2 Layered model (conceptual, mirrors best practice)
```
UI / Delivery      → tabs, verse lookup, prediction panels (RENDER.* modules)
Prediction Engines → career, marriage, wealth, health, ... (16-level fusion)
Rule Engine (XAI)  → loadVerseDB(), analyzeHouseLords(), exception evaluation
Compute Core       → chart, dasha, shadbala, ashtakavarga, varga, panchanga
Knowledge/Data     → verse_database/*.json (rules, verses, provenance)
```

### 8.3 Planned precision upgrade
- Swiss Ephemeris via **WASM** (browser) or a small backend microservice, for
  professional-grade verifiable positions.

---

## 9. Data Model — Actionable Rule Schema (v2)

Rules are stored as JSON so the engine can execute them and cite them.

```json
{
  "id": "BPHS_1314_L10H9",
  "source": { "text": "BPHS", "chapter": 14, "verse": 45 },
  "rule_type": "lord_placement",
  "conditions": { "lordOfHouse": 10, "inHouse": 9 },
  "exceptions": ["lord_dignity", "lord_combust", "benefic_aspect"],
  "effect": { "domains": ["career","fortune","authority"], "polarity": "benefic", "weight": 8 },
  "translations": { "en": "...", "hi": "..." },
  "confidence": "high"
}
```

- **rule_type**: `lord_placement | planet_in_house | planet_in_sign | yoga | aspect |
  dignity | dasha_effect | nakshatra | strength | remedy | general`.
- **conditions**: evaluated against the chart (`lordOfHouse`, `inHouse`, `planet`, `sign`,
  `house`, `conjunctWith`, `aspectedBy`, `dignity`, `combust`, `retrograde`, ...).
- **effect.weight**: signed contribution (~ −10..+10) fed into the domain/level score.
- **exceptions**: named checks (Neechabhanga, Vipareeta, combustion, Harsha, ...).
- **confidence**: `high | medium | low`.

**Provenance** (planned `computation_sources.json`): for every computation store source,
rule, alternatives, invalidation conditions, and confidence — so any result can be audited.

---

## 10. Directory Structure

```
Jyotish Calculator/
├── index.html                     # Landing page
├── jyotish_calculator.html        # Main app (engine + UI, single file)
├── CNAME                          # GitHub Pages custom domain
├── README.md                      # Public overview
├── PROJECT_REQUIREMENTS.md        # THIS document
├── PROJECT_STATUS.md              # Progress + pending + phases
├── verse_database/
│   ├── index.json                 # Master index of texts
│   ├── IMPLEMENTATION_ROADMAP.md  # Engineering roadmap (16 levels → data → functions)
│   ├── bphs.json                  # BPHS representative verses (all 105 chapters)
│   ├── bphs_house_lords.json      # BPHS Ch13-14: 144 actionable house-lord rules
│   ├── phaladeepika.json
│   ├── saravali.json
│   ├── jataka_parijata.json
│   ├── hora_sara.json
│   └── uttara_kalamrita.json
└── daiv-ai-main/                  # Reference project (AGPL-3.0 — concepts only, do NOT copy)
```

---

## 11. Classical Sources

Primary: **Brihat Parashara Hora Shastra (BPHS)**. Secondary: **Phaladeepika**,
**Saravali**, **Jataka Parijata**, **Hora Sara**, **Uttara Kalamrita**, **Jaimini Sutras**,
**Krishnamurti Paddhati (KP)**.

Standard editions for citation: BPHS (Santhanam / G.C. Sharma). Verse numbers synthesized
from standard interpretation are marked `confidence: medium` and must be **Pandit-verified**
before promotion to `high`.

---

## 12. Constraints & Licensing

- `daiv-ai-main/` (reference) is **AGPL-3.0**. We adopt only *concepts* (rule schema,
  provenance model, chapter-per-file layout). We must **not** copy its code or verse text,
  as that would force AGPL onto our project.
- Verse text should come from public-domain / properly-licensed translations.
- API keys (if any external service is added) must never be hardcoded.

---

## 13. Success Criteria

- Every prediction shown in the UI has: a score, a confidence, ≥1 cited rule, and a list of
  supporting + contradicting factors.
- ≥ 90% of core computations have a provenance entry.
- All high-value actionable rule sets (house lords, planet-in-house, key yogas, dasha
  effects) encoded and firing against live charts.
- A beginner can read *why*; a professional can verify *how*.

---

## 14. Website Structure & Navigation (full sitemap)

The product is a **single-page application** (`jyotish_calculator.html`). Navigation is a
3-level drill-down: **Mode → Analysis Tab → (for Prediction) Domain → Engine Section**.

### 14.1 App shell (always visible)
```
ॐ ज्योतिष यंत्र · Predictive Engine            [font A- 100% A+]
├── 📅 Check Date  (see dasha on any given date)   [ Today ]
├── MODE SELECTOR (top level)
│     ├── 🔮 Personal Prediction (कुंडली)      ← default
│     ├── 💑 Match Making (मिलान)
│     └── 🕉 Muhurat
├── 🎂 Birth Details
│     Name · Birth Date · Birth Time (24h) · Search City ·
│     Latitude °N · Longitude °E · Time Zone (UTC±) · Ayanamsha
│     [ Generate Report ]   · live city suggestions · data stays on device
└── 💾 Saved Profiles (click to auto-fill · × to remove)
```

### 14.2 Level 1 — Modes
| Mode | Purpose | Output |
|------|---------|--------|
| **Personal Prediction** | Full natal analysis of one chart | Analysis tab bar (14.3) |
| **Match Making** | Compatibility of two charts (Ashtakoot / Kuja etc.) | Guna score + doshas |
| **Muhurat** | Electional astrology — best time for an activity | Time-window scoring |

### 14.3 Level 2 — Analysis tab bar (Personal Prediction)
```
Prediction Mode · ⭐PREDICTION · Planets · Charts · Houses · D1 Deep ·
Yogas · Nakshatra · Dasha · Transit · Argala · Arudha · Jaimini · KP · Planet Strength
```
- **PREDICTION** is the hub (domain engines below).
- The remaining tabs are **raw-data / single-technique views** (transparency layer): the
  professional can inspect each computation directly (`RENDER.planets`, `RENDER.charts`,
  `RENDER.houses`, `RENDER.yogas`, `RENDER.dasha`, `RENDER.transit`, `RENDER.nak`,
  `RENDER.strength`, plus Argala / Arudha / Jaimini / KP / D1-Deep).

### 14.4 Level 3 — Prediction domains (under PREDICTION)
```
💼 Career · 🧠 Personality · 💍 Marriage · 💰 Wealth · 👶 Child · ✈ Foreign ·
❤ Health · 🎓 Education · 🕉 Spirituality · 🏠 Property        [ 📄 PDF Download ]
```
Each domain runs the same **16-level fusion** but weighted for that domain.
(Planned additions per §5: Business, Longevity, Litigation.)

### 14.5 Level 4 — Engine sections (inside a domain, e.g. **Career Engine — "16 स्तरों का संगम"**)
Left sidebar sections, top-to-bottom = *verdict first, then the evidence that produced it*:
```
▸ Final Career Verdict        ← the fused answer (score %, nature, signature)
▸ Approach Explained          ← how this verdict was built (method, weights)
▸ Weighted Scorecard          ← every factor with its signed points
▸ भाव विश्लेषण (Houses)        ← L2  house evidence
▸ ग्रह विश्लेषण (Planets)       ← L1/L9 planet & lordship evidence
▸ करियर योग (Yogas)            ← L3  yogas + activation
▸ Divisional Charts           ← L4  D10/D1 etc.
▸ नक्षत्र विश्लेषण (Nakshatra)   ← L10
▸ Argala                      ← L11
▸ Arudha (AL + A10)           ← L12
▸ Jaimini                     ← L13
▸ ग्रह शक्ति (Strength)         ← L8  Shadbala
▸ दशा Engine (Dasha)          ← L5  timing
▸ गोचर Engine (Transit)        ← L6  activation
▸ KP Timing                   ← L15 precise timing
▸ Career Timeline             ← event windows
▸ ज्योतिष विश्लेषण             ← Ashtakavarga / numeric support (L14)
▸ Contradiction Engine        ← reconciles supporting vs contradicting factors
▸ WHY यह भविष्यवाणी            ← plain-language reasoning trace (XAI)
▸ Astrologer Verification      ← checklist for a professional to confirm
```

### 14.6 Final Verdict content (example: Career)
```
🏆 FINAL CAREER VERDICT
  Career Potential: 58%   (supporting 63% − contradiction adjustment)
  🌱 In simple words: one-paragraph plain summary (Hindi + English)
  🎯 Career Nature (breakdown %):
       Service · Business · Technical · Management · Government ·
       Private Sector · Foreign Career · Research · Job Stability · Fame Potential
  ✍ Career Signature: dominant houses/planets → recommended fields, weakest area
```

---

## 15. Prediction Engine — end-to-end data flow (how data is fetched & calculated)

This is the full path from a birth detail to a **Final Verdict**, e.g.
**Personal Prediction → PREDICTION → Career → Final Career Verdict**.

### 15.1 Pipeline overview
```
[1] INPUT            Birth data form (name, date, time, city)
        │            city → geocode (Open-Meteo API) → lat / lon / timezone
        ▼
[2] COMPUTE CORE     "Generate Report" →
        │              ephemeris → sidereal longitudes (Lahiri ayanamsha)
        │              → Ascendant + house cusps (Whole-sign + Placidus/Sripati)
        │              → nakshatra/pada, dignity, combustion, retro, vargottama
        │              → divisional charts D1,D2,D7,D9,D10,D12,D24,D30,D60
        │              → panchanga (tithi/vara/yoga/karana/sunrise-set)
        │            RESULT: global  CH  (chart object)
        │              Vimshottari dasha (MD→AD→PD→…)  → global  DASHA
        ▼
[3] MODE ROUTER      Personal Prediction | Match Making | Muhurat
        ▼            (Personal →) analysis tab bar
[4] PREDICTION HUB   choose a domain (e.g. Career)
        ▼
[5] 16-LEVEL ANALYSIS   each level reads CH/DASHA and emits
        │               signed, weighted, CITED evidence factors:
        │   L1 placements/dignity   L2 houses        L3 yogas
        │   L4 vargas (D10)         L5 dasha         L6 transit
        │   L7 subtle               L8 shadbala      L9 lordship (144 rules)
        │   L10 nakshatra           L11 argala       L12 arudha
        │   L13 jaimini             L14 ashtakavarga L15 KP
        ▼
[6] CONTRADICTION ENGINE   collect supporting (+) vs contradicting (−) factors
        ▼
[7] WEIGHTED FUSION (L16)  Σ(factor.weight × levelWeight[domain])
        │                  → normalize → score 0-100% + confidence
        ▼
[8] FINAL VERDICT     score %, career-nature breakdown, signature,
                      "in simple words", WHY trace, references, verification checklist
```

### 15.2 Step detail & responsible code
| Step | What happens | Data / functions |
|------|--------------|------------------|
| 1. Fetch input | Read form; resolve city to coordinates + timezone | form fields; Open-Meteo geocoding; **Saved Profiles** in `localStorage` |
| 2. Compute chart | Build sidereal chart & dashas once, cache globally | ephemeris → **`CH`** (`CH.sid[]`, `CH.asc`, `CH.retro[]`, vargas); `buildDasha` → **`DASHA`**; `PANCH` |
| 3. Route by mode | Show correct workspace | mode selector → Personal / Match / Muhurat |
| 4. Pick domain | Render a domain engine | `RENDER.career`, `RENDER.marriage`, `RENDER.wealth`, … |
| 5. Gather evidence | Run all 16 levels; each returns weighted, cited factors | `lordOfHouse`, `planetHouse`, `dignity`, `combust`, `neechabhanga`, `detectYogas`, `pstrength`/`shadbala`, `ashtakavarga`, `analyzeHouseLords` (loads `bphs_house_lords.json`), transit, KP cusps |
| 6. Reconcile | Separate + / − factors, apply exception adjustments | Contradiction Engine + exception registry (Neechabhanga, Vipareeta, combustion, Harsha…) |
| 7. Fuse | Weighted sum → normalized % + confidence | Level-weight config per domain → `predictionEngine` (Phase D) |
| 8. Present verdict | Score, breakdown, signature, WHY, references | `RENDER.career` "Final Verdict" + sidebar sections |

### 15.3 Worked example — "Career: 58%"
```
Personal Prediction
   └─ PREDICTION
        └─ Career  (Career Engine, 16 levels)
             ├─ Evidence gathered:
             │    + 10th lord strong / well-placed         (L9, BPHS Ch14 rule)   +8
             │    + D10 supports profession                (L4)                   +6
             │    + Jupiter aspects 10th house             (L1)                   +5
             │    + Raja Yoga present                      (L3)                   +7
             │    + Current Mahadasha activates career     (L5)                   +9
             │    − Saturn aspect on 10th                  (L1)                   −4
             │    − Weak 6th house (service karma)         (L2)                   −2
             ├─ Contradiction Engine: supporting 63% − contradictions ≈ 5
             ├─ Weighted Fusion (L16): → 58%   (confidence: medium)
             └─ FINAL CAREER VERDICT
                  Career Potential 58%
                  Career Nature: Job Stability 63% · Management 57% · Service 53% …
                  Signature: strongest = Venus/Moon/Jupiter → arts/media/teaching;
                             weakest = Mars (39%); Sun/Mercury dasha → admin/research
                  References: BPHS Ch 13-14, Phaladeepika Ch 6
```

### 15.4 Design principles enforced by this flow
- **Compute once, reuse everywhere**: `CH` and `DASHA` are built a single time; every level
  and every domain reads the same cached chart (consistency + speed).
- **Data, not code, drives rules**: levels pull from `verse_database/*.json`; adding rules
  never requires touching the engine.
- **Verdict = transparent fusion**: the number on screen is always the sum of visible,
  cited factors — the sidebar lets anyone drill from the % down to the exact classical rule.
- **Every level is independently inspectable** via the top analysis tabs (§14.3), so the
  fusion can be audited factor-by-factor.
