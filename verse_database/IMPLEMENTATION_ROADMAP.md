# Jyotish Yantra — Verse Database & Prediction Engine Roadmap

Goal: a **rule-complete**, fully **explainable** Vedic prediction engine where every
prediction cites classical rules, shows numeric contributions, lists exceptions, and
can be audited end-to-end. "Complete BPHS" = every *actionable* rule encoded with
conditions + effect + weight + exceptions + provenance — not one placeholder verse
per chapter.

## Guiding principles

1. **No black box** — every fired rule is one visible bullet: rule text, weight, source.
2. **Rules are executable** — machine-readable `conditions` the engine evaluates, not prose.
3. **Exceptions are first-class** — a rule never fires "raw"; cancellations (Neechabhanga,
   combustion, Vipareeta, etc.) are checked and shown.
4. **Every result is traceable** — a provenance record (source, rule, alternatives,
   invalidation, confidence) backs each computation.
5. **Two audiences** — plain-language explanation for beginners + full data for professionals.

## Actionable rule schema (v2)

Each rule object:

```json
{
  "id": "BPHS_13_L1H6",
  "source": { "text": "BPHS", "chapter": 13, "verse": 5 },
  "rule_type": "lord_placement",
  "conditions": { "lordOfHouse": 1, "inHouse": 6 },
  "exceptions": ["harsha_yoga", "lord_exalted", "lord_retrograde"],
  "effect": {
    "domains": ["health", "service", "obstacles"],
    "polarity": "mixed",
    "weight": -4
  },
  "text_sanskrit": "",
  "translations": { "en": "...", "hi": "..." },
  "confidence": "high"
}
```

Field guide:

- **rule_type** — `lord_placement` | `planet_in_house` | `planet_in_sign` | `yoga` |
  `aspect` | `dignity` | `dasha_effect` | `nakshatra` | `strength` | `remedy` | `general`.
- **conditions** — evaluated by the engine against the computed chart. Supported keys grow
  over time: `lordOfHouse`, `inHouse`, `planet`, `sign`, `house`, `conjunctWith`,
  `aspectedBy`, `dignity`, `combust`, `retrograde`.
- **effect.polarity** — `benefic` | `malefic` | `mixed`.
- **effect.weight** — signed integer contribution (roughly -10..+10) fed into the level score.
- **effect.domains** — life areas this rule feeds (career, wealth, marriage, health, ...).
- **exceptions** — named checks the engine runs; if any fires, the rule is annotated/attenuated.
- **confidence** — `high` | `medium` | `low`.

## 16-Level engine → chapter/data mapping

| Level | Analysis | Primary BPHS chapters | Data file(s) | Engine hook |
|-------|----------|----------------------|--------------|-------------|
| 1 | Foundations (placement, dignity, aspects) | 3, 4, 6, 7 | bphs.json, dignity | `signOf`, `dignity`, `combust` |
| 2 | House analysis | 11, 20, 55-56 | bphs_house_lords.json | `houseResults` |
| 3 | Yogas | 10, 15, 16, 31-45 | yoga_rules.json | `detectYogas` |
| 4 | Divisional charts | 6-7 (varga), 51-54 | varga_significations | `dSign` |
| 5 | Dasha | 46-50, 73 | dasha_effects.json | `buildDasha` |
| 6 | Transit (Gochar) | 70, gochara | gochara_rules.json | `transit` |
| 7 | Subtle (Argala/Arudha) | 31, 90-93 | argala/arudha rules | `arudhaCalculation` |
| 8 | Planet strength (Shadbala) | 27 | shadbala_reference | `shadbala` |
| 9 | House lordship (func. benefic/malefic) | 13-14 | **bphs_house_lords.json** | `lordOfHouse` |
| 10 | Nakshatra | 71-77 | nakshatra_data.json | `nakshatraAnalysis` |
| 11 | Argala | 31, 92-93 | argala_rules.json | `argalaCalculation` |
| 12 | Arudha Lagna | 90-91 | arudha_rules.json | `arudhaCalculation` |
| 13 | Jaimini | (Jaimini) | jaimini_rules.json | `charaKaraka` |
| 14 | Ashtakavarga & Shadbala | 27, 65-70 | ashtakavarga_tables | `getAVStrength` |
| 15 | KP elements | (KP) | kp_rules.json | `subLord` |
| 16 | Final fusion | — | weights config | `predictionEngine` |

## Phased plan

### Phase A — Actionable core (highest predictive payoff)
- [x] A0. Roadmap + schema documented (this file).
- [x] A1. **Ch 13-14 house-lord placements** — all 144 rules in `bphs_house_lords.json`.
- [x] A2. Wire the app: load verse DB from `verse_database/` (removed hardcoded samples; `loadVerseDB()` in `jyotish_calculator.html`, with file:// fallback).
- [x] A3. Fire house-lord rules against the live chart (`analyzeHouseLords()`), render evidence with weight, exception checks (dignity/combust/neechabhanga/vipareeta) and per-rule citation.

### Phase B — Provenance & exceptions
- [ ] B1. `computation_sources.json` + `explain(name)` lookup for every calculation.
- [ ] B2. Exception registry (Neechabhanga, combustion, Vipareeta, Harsha, etc.).

### Phase C — Complete the rule set
- [ ] C1. Ch 11 planet-in-house/sign effects (12 planets × 12 houses/signs).
- [ ] C2. Ch 15-16 Raja/Dhana yogas with cancellation rules.
- [ ] C3. Ch 46-50, 73 dasha effects.
- [ ] C4. Ch 71-77 nakshatra rules.

### Phase D — Prediction engines (16-level fusion)
- [ ] D1. Career, Marriage, Wealth, Health engines using weighted rule fusion.
- [ ] D2. Confidence scoring + supporting/contradicting factor display.

## Notes on `daiv-ai-main`

Reference project studied for architecture (do **not** copy code/text — it is **AGPL-3.0**;
copying forces AGPL on us). Concepts adopted:
- Structured scripture rules (`conditions`/`planets`/`houses`/`rule_type`).
- Provenance model (source, rule, alternatives, invalidation, confidence).
- Chapter-per-file layout.

Their ephemeris is **Swiss Ephemeris** (JPL DE431). Ours is a self-contained JS
Moshier-style approximation. For professional-grade verifiability, plan a future upgrade
to Swiss Ephemeris via **WASM** (browser) or a small backend service. Verse numbers from
any source (including daiv-ai) must be **Pandit-verified** before being marked `high` confidence.
