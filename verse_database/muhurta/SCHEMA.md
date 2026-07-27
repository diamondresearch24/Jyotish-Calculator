# Muhurta Rule Database — Schema

Every file in this folder is consumed by `muhurtaEvaluate()` in `jyotish_calculator.html`.
The engine has **no** knowledge of Garbhadhana, Marriage or any other category. It only:

1. loads rule tables,
2. filters them by `applies_to`,
3. matches `match` against the fact object produced by `dayFacts(jd)`,
4. picks the highest-`priority` match per `(component, slot)`,
5. combines slot scores into component scores, weights them by the **profile**, and bands.

No verdict number lives in JavaScript. If a point is added or removed, a row here caused it.

---

## 1. File envelope

```json
{
  "meta": {
    "file": "mc_tithi.json",
    "component": "tithi",
    "version": 1,
    "kind": "component",
    "slots": { "tithi": 1.0 },
    "default": { "score": 50, "status": "neutral", "en": "…", "hi": "…" }
  },
  "rules": [ /* rule rows */ ]
}
```

| `meta` field | Meaning |
|---|---|
| `component` | Key used by the profile's `weights` map (`tithi`, `nakshatra`, `moon`, …). Penalty files use `"penalty"`. |
| `kind` | `"component"` (contributes a 0–100 quality score) or `"penalty"` (contributes negative absolute points and/or a veto). |
| `slots` | Sub-dimensions of the component and their relative weights. They must sum to 1.0. Single-dimension components use one slot named after the component. |
| `default` | Used when **no** row matches, so a component can never silently vanish. |

## 2. Rule row

```json
{
  "id": "MC_TITHI_S04",
  "applies_to": ["garbhadhana", "marriage"],
  "slot": "tithi",
  "match": { "tithi_index": 3 },
  "status": "avoid",
  "score": 10,
  "priority": 2,
  "veto": false,
  "sanskrit": null,
  "iast": null,
  "translations": { "en": "…", "hi": "…" },
  "interpretation": "…",
  "exceptions": [{ "when": { "nakshatra": [3, 12] }, "score_delta": 8, "note": "…" }],
  "source": { "text": "Muhurta Chintamani", "chapter": "Tithi Prakarana", "verse": null },
  "confidence": "high",
  "tags": ["rikta"]
}
```

| Field | Type | Meaning |
|---|---|---|
| `id` | string | Unique across **all** files. Printed in the PDF audit appendix. |
| `applies_to` | string[] | Category keys, or `"*"` for every category. |
| `slot` | string | Which slot of the component this row scores. Omit for single-slot files. |
| `match` | object | See §3. Empty object `{}` matches every day (catch-alls). |
| `status` | enum | `excellent` · `good` · `neutral` · `caution` · `avoid` · `prohibited`. Drives the UI chip only. |
| `score` | 0–100 | **Component rows only.** Percentage of that slot's weight earned. |
| `penalty` | number ≤ 0 | **Penalty rows only.** Absolute points subtracted from the 100-point total. |
| `priority` | int | Higher wins when two rows match the same slot. Ties → the row appearing first. |
| `veto` | bool | `true` forces `band = "avoid"` no matter the score, and supplies the headline reason. |
| `sanskrit` / `iast` | string \| null | **`null` until a verified verse is supplied.** Never invent one (see §6). |
| `translations.en` / `.hi` | string | One-line reason shown next to the row in the UI. |
| `interpretation` | string | Longer plain-language note for the expanded detail view. |
| `exceptions` | array | Conditional adjustments, see §4. |
| `source` | object | `{text, chapter, verse}`. `verse: null` = attributed to the chapter, not a specific śloka. |
| `confidence` | enum | `high` (explicit classical statement) · `medium` (standard pañcāṅga practice) · `low` (derived/approximate fact such as the eclipse detector). |
| `kind` | enum | Optional per-row override of `meta.kind`. `mc_graha.json` uses it to keep the Moon-strength component rows and the Guru/Śukra Asta penalty rows in one file. |
| `penalty_group` | string | Which `penalty_caps` bucket a penalty row belongs to. Defaults to `meta.penalty_group`. |

A penalty row with `penalty: 0` is legal and deliberate: it records that a named day was examined
and found unrestricted (e.g. Akṣaya Tṛtīyā), so the citation still appears in the report.

## 3. `match` grammar

Keys are fact names from `dayFacts(jd)` (plus the biological/chart facts merged in by the caller).
Values may be:

| Form | Example | Meaning |
|---|---|---|
| scalar | `"tithi_index": 3` | strict equality |
| array | `"nakshatra": [3, 4, 12]` | membership |
| range | `"sun_moon_elong": { "min": 12, "max": 72 }` | `min` inclusive, `max` exclusive; either may be omitted |
| boolean | `"eclipse": true` | truthiness of the fact |
| `"any"` | `"paksha": "any"` | always matches (documentation value only) |
| negation | `"nakshatra": { "not": [8, 9] }` | inverse of scalar or array |

All keys in one `match` are **AND**-ed. To express OR, write two rows.

### Fact keys currently published

`tithi_index` (0–29) · `tithi_idx` (0–14) · `paksha` (`shukla`/`krishna`) ·
`nakshatra` (0–26) · `yoga` (0–26) · `karana_index` (0–10) · `vara` (0=Sun … 6=Sat) ·
`masa_index` (0=Chaitra … 11=Phalguna) · `adhika_masa` · `sankranti` · `eclipse` ·
`eclipse_days` (abs days to nearest eclipse) · `chaturmas` · `pitru_paksha` ·
`sun_moon_elong` (0–180) · `moon_dignity` (`exalted`/`own`/`friend`/`neutral`/`enemy`/`debilitated`) ·
`moon_sign` (0–11) · `guru_elong` · `guru_retro` · `shukra_elong` · `shukra_retro` ·
`tara` (0=Janma … 8=Ati-Mitra) · `chandrabala` (1–12) · `bio_phase` · `bio_cycle_day` ·
`has_mother_chart` · `has_father_chart` · `cycle_regular`.

## 4. `exceptions`

```json
"exceptions": [{ "when": { "nakshatra": [3, 12] }, "score_delta": 8, "note": "…" }]
```

`when` uses the same grammar as `match`. If it matches, `score_delta` is added to the row's
`score` (or `penalty_delta` to its `penalty`), clamped to 0–100. Every applied exception is
recorded in the factor's `notes[]` so the PDF shows *why* the number moved.

## 5. Profiles — `profiles/<category>.json`

```json
{
  "category": "garbhadhana",
  "weights": { "biological": 25, "nakshatra": 20, "moon": 15, "tarabala": 15,
               "tithi": 10, "yoga": 10, "karana": 5 },
  "requires": { "biological": "lmp", "tarabala": "has_mother_chart" },
  "informational": ["vara", "chandrabala"],
  "penalty_caps": { "festival": -30, "graha": -20, "prohibited": -30 },
  "bands": [ { "key": "excellent", "min": 85 }, … ],
  "redistribute_missing_weight": true
}
```

- `weights` must sum to 100.
- `requires` names the input a component needs. If the input is absent the component **does not
  fire**; with `redistribute_missing_weight: true` its weight is spread proportionally over the
  components that did fire, so a basic-mode user is not capped. The UI must then state
  *"scored across N of M components"*.
- `informational` components are evaluated and displayed with their citation but contribute **0**
  points — they never move the band.
- `penalty_caps` bound the total damage from each penalty file.
- A `veto: true` row overrides all banding.

## 6. Sanskrit policy — hard rule

`sanskrit` and `iast` are `null` in every row shipped today. They are filled **only** from a
verse the user has verified against a printed edition. Fabricating a śloka, or attaching a real
śloka to the wrong rule, is worse than leaving the field empty — the whole point of this database
is that a citation can be checked. The UI renders the `source` line whether or not `sanskrit`
is present.
