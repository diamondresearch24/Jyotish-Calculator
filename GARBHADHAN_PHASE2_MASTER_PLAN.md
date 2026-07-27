# Garbhadhana Muhurat Engine — Phase 2 Master Plan

> **Goal:** Transform the prototype into a **research-grade Classical Muhurta Chintamani Engine** that is transparent, modular, explainable, and based on authentic Jyotisha principles.
>
> The engine should be usable by practicing astrologers and become the foundation for all future Muhurat modules.

Created: 2026-07-27 · Status: **Planning**

---

## 0. CORE PRINCIPLES

1. **Never hardcode astrology rules** — everything from structured rule database
2. **Every recommendation traceable** — rule ID, source, verse, verified status
3. **Every point has a reason** — no magic numbers
4. **Rules independently enabled/disabled** — granular control
5. **Multi-authority support** — selectable classical sources
6. **Reusable architecture** — same engine for Marriage, Griha Pravesh, etc.

---

## 1. CURRENT STATE (Phase 1 Complete)

| Asset | Status | Gap |
|-------|--------|-----|
| 11 JSON rule tables | ✅ | Need ~25 tables |
| 210 rules | ✅ | Need ~500+ rules |
| Basic rule schema | ✅ | Missing Sanskrit, IAST, verse, verification |
| Single-stage scoring | ✅ | Need 6-stage weighted engine |
| Date-level muhurat | ✅ | Need time-window refinement (30-min slots) |
| Biological model | ✅ | Need confidence scores, uncertainty |
| Moon sign/strength | ✅ | Missing afflictions, aspects, combust analysis |
| No Lagna engine | ❌ | Critical gap |
| No Hora engine | ❌ | Need implementation |
| No daily restrictions | ❌ | Rahu Kalam, Durmuhurta, Varjyam, etc. |
| Single authority (MC) | ✅ | Need selectable authority |
| Basic PDF | ✅ | Need comprehensive report |

---

## 2. TARGET DATABASE ARCHITECTURE

```
verse_database/muhurta/
├── authorities/
│   ├── muhurta_chintamani.json      # Authority metadata
│   ├── dharma_sindhu.json
│   ├── nirnaya_sindhu.json
│   ├── muhurta_martanda.json
│   └── kalaprakashika.json
├── profiles/
│   ├── garbhadhana.json             # ✅ exists
│   ├── marriage.json                # ✅ exists
│   └── [future categories]
├── tables/
│   ├── mc_tithi.json                # ✅ exists
│   ├── mc_nakshatra.json            # ✅ exists
│   ├── mc_yoga.json                 # ✅ exists
│   ├── mc_karana.json               # ✅ exists
│   ├── mc_vara.json                 # ✅ exists
│   ├── mc_chandrabala.json          # ✅ exists
│   ├── mc_tarabala.json             # ✅ exists
│   ├── mc_graha.json                # ✅ exists (partial)
│   ├── mc_prohibited.json           # ✅ exists
│   ├── mc_festival.json             # ✅ exists
│   ├── mc_biological.json           # ✅ exists
│   ├── mc_lagna.json                # 🆕 NEW
│   ├── mc_hora.json                 # 🆕 NEW
│   ├── mc_durmuhurta.json           # 🆕 NEW
│   ├── mc_rahukalam.json            # 🆕 NEW
│   ├── mc_yamaganda.json            # 🆕 NEW
│   ├── mc_gulika.json               # 🆕 NEW
│   ├── mc_varjyam.json              # 🆕 NEW
│   ├── mc_panchaka.json             # 🆕 NEW
│   ├── mc_bhadra.json               # 🆕 NEW
│   ├── mc_abhijit.json              # 🆕 NEW
│   ├── mc_moon_affliction.json      # 🆕 NEW
│   ├── mc_planetary_aspects.json    # 🆕 NEW
│   └── mc_ritukala.json             # 🆕 NEW
└── scoring/
    └── weights.json                 # Global weight configuration
```

---

## 3. ENHANCED RULE SCHEMA

```json
{
  "id": "MC_TITHI_G01",
  "rule_name": "Shukla Dwadashi for Garbhadhana",
  "applies_to": ["garbhadhana"],
  "authority": "muhurta_chintamani",
  "source": {
    "text": "Muhurta Chintamani",
    "chapter": "Garbhadhana Prakarana",
    "section": "Tithi Vichar",
    "verse": "12",
    "page": null,
    "edition": "Chaukhamba Sanskrit Pratishthan",
    "translator": null,
    "verified": true,
    "verification_date": "2026-07-27",
    "verification_note": "Cross-checked with Dharma Sindhu"
  },
  "sanskrit": "द्वादशी शुक्लपक्षे तु गर्भाधाने शुभा स्मृता।",
  "iast": "dvādaśī śuklapakṣe tu garbhādhāne śubhā smṛtā।",
  "translations": {
    "hi": "शुक्ल पक्ष की द्वादशी गर्भाधान के लिए शुभ मानी गई है।",
    "en": "The twelfth tithi of the bright fortnight is considered auspicious for conception."
  },
  "match": {
    "tithi": 11,
    "paksha": "shukla"
  },
  "category": "tithi",
  "status": "excellent",
  "score": 95,
  "priority": 5,
  "weight_class": "primary",
  "veto": false,
  "mandatory": false,
  "can_override": [],
  "overridden_by": ["MC_ECLIPSE_001", "MC_GURU_ASTA_001"],
  "exceptions": [],
  "notes": "Particularly favorable when Moon is strong.",
  "tags": ["tithi", "shukla", "garbhadhana"]
}
```

---

## 4. SIX-STAGE SCORING ENGINE

```
┌─────────────────────────────────────────────────────────────┐
│                    STAGE 1: BIOLOGICAL                      │
│  Is conception biologically possible on this date?          │
│  Output: fertile_probability (0-100), confidence (0-100)    │
│  If probability < 10% → soft warning, not veto              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                STAGE 2: SCRIPTURAL PROHIBITIONS             │
│  Check absolute vetoes (cannot be overridden):              │
│  • Eclipse period                                           │
│  • Guru Asta (Jupiter combust)                              │
│  • Shukra Asta (Venus combust)                              │
│  • Chaturmas (if tradition observes)                        │
│  • Pitru Paksha                                             │
│  • Sankranti (day of)                                       │
│  Output: vetoed (boolean), veto_reasons[]                   │
│  If vetoed → Final = AVOID, skip remaining stages           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  STAGE 3: PANCHANGA QUALITY                 │
│  Evaluate the five limbs:                                   │
│  • Tithi (weight: 20)                                       │
│  • Nakshatra (weight: 25)                                   │
│  • Yoga (weight: 10)                                        │
│  • Karana (weight: 10)                                      │
│  • Vara (weight: 10)                                        │
│  Output: panchanga_score (0-75)                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 STAGE 4: PLANETARY QUALITY                  │
│  • Moon strength (paksha bala, elongation)                  │
│  • Moon afflictions (with Rahu/Ketu/Saturn/Mars)            │
│  • Moon combust check                                       │
│  • Chandrabala (from birth Moon)                            │
│  • Tarabala (from birth Moon)                               │
│  • Jupiter/Venus transits                                   │
│  Output: planetary_score (0-25)                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   STAGE 5: LAGNA QUALITY                    │
│  For each potential time window:                            │
│  • Evaluate rising sign                                     │
│  • Check Lagnesh strength                                   │
│  • 5th/9th lord positions                                   │
│  • Malefics in Lagna/Kendras                                │
│  • Benefics aspecting Lagna                                 │
│  Output: best_lagna, lagna_score (0-20)                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│               STAGE 6: TIME WINDOW REFINEMENT               │
│  Within the best Lagna window:                              │
│  • Check Hora (prefer Guru/Shukra/Chandra)                  │
│  • Avoid Durmuhurta                                         │
│  • Avoid Rahu Kalam                                         │
│  • Avoid Yamaganda                                          │
│  • Avoid Varjyam                                            │
│  • Prefer Abhijit Muhurta if available                      │
│  Output: recommended_windows[], window_score (0-10)         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      FINAL AGGREGATION                      │
│  total = panchanga + planetary + lagna + window + bio_bonus │
│  Apply penalty caps                                         │
│  Classify into band: Exceptional/Excellent/Good/Avg/Avoid   │
│  Generate explanation with all fired rules                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. ENHANCED BIOLOGICAL MODEL

```json
{
  "inputs": {
    "lmp": "2026-07-10",
    "cycle_length": 28,
    "cycle_variation": "regular|irregular|highly_irregular",
    "bleeding_days": 5,
    "known_ovulation_day": null,
    "previous_cycles": []
  },
  "outputs": {
    "estimated_ovulation": "2026-07-24",
    "ovulation_window": ["2026-07-22", "2026-07-26"],
    "fertile_window": ["2026-07-19", "2026-07-25"],
    "peak_fertility": ["2026-07-23", "2026-07-24"],
    "confidence": 85,
    "uncertainty_days": 2,
    "late_ovulation_probability": 15,
    "early_ovulation_probability": 10,
    "warnings": [],
    "disclaimer": "This is an estimation based on averages. Actual ovulation timing varies."
  }
}
```

---

## 6. MOON ANALYSIS (EXPANDED)

| Analysis | Current | Phase 2 Target |
|----------|---------|----------------|
| Moon sign | ✅ | ✅ |
| Moon strength (paksha) | ✅ | ✅ |
| Moon elongation | ✅ | ✅ |
| Chandrabala | ✅ | ✅ |
| Tarabala | ✅ | ✅ |
| Moon combust | ❌ | ✅ `elongation < 12°` |
| Moon with Rahu | ❌ | ✅ `within 12°` |
| Moon with Ketu | ❌ | ✅ `within 12°` |
| Moon with Saturn | ❌ | ✅ `within 10°` |
| Moon with Mars | ❌ | ✅ `within 8°` |
| Papakartari | ❌ | ✅ hemmed by malefics |
| Moon debilitated | ❌ | ✅ in Scorpio |
| Moon exalted | ❌ | ✅ in Taurus |
| Waxing/Waning | ✅ | ✅ |
| Moon in benefic houses | ❌ | ✅ 1,4,5,7,9,10,11 from Lagna |
| Moon in malefic houses | ❌ | ✅ 6,8,12 from Lagna |

---

## 7. LAGNA ENGINE (NEW)

For each date, calculate all 12 Lagnas and their rising times. Evaluate:

| Check | Weight | Good | Bad |
|-------|--------|------|-----|
| Lagna nature | 5 | Fixed/dual for stability | Movable less ideal |
| Lagnesh strength | 4 | Exalted/own sign | Debilitated/combust |
| 5th Lord | 3 | Strong, well-placed | Afflicted |
| 9th Lord | 3 | Strong, well-placed | Afflicted |
| Malefics in Lagna | 3 | None | Mars/Saturn/Rahu |
| 8th House | 2 | Empty or benefic | Malefic occupied |
| Benefics in Kendras | 2 | Jupiter/Venus | None |
| Aspects on Lagna | 2 | Jupiter aspect | Saturn/Mars aspect |

**Best Lagnas for Garbhadhana:** Taurus, Cancer, Leo, Virgo, Sagittarius, Pisces

---

## 8. TIME RESTRICTIONS (DAILY)

| Restriction | Calculation | Action |
|-------------|-------------|--------|
| **Rahu Kalam** | 1.5 hrs, varies by weekday | AVOID |
| **Yamaganda** | 1.5 hrs, varies by weekday | AVOID |
| **Gulika Kalam** | 1.5 hrs, varies by weekday | CAUTION |
| **Durmuhurta** | ~48 mins each, 2 per day | AVOID |
| **Varjyam** | ~1.5 hrs, nakshatra-based | AVOID |
| **Abhijit Muhurta** | ~48 mins around noon | PREFER |

---

## 9. SELECTABLE AUTHORITY

```javascript
const AUTHORITIES = [
  { id: 'muhurta_chintamani', name: 'Muhurta Chintamani', default: true },
  { id: 'dharma_sindhu', name: 'Dharma Sindhu', default: false },
  { id: 'nirnaya_sindhu', name: 'Nirnaya Sindhu', default: false },
  { id: 'muhurta_martanda', name: 'Muhurta Martanda', default: false },
  { id: 'kalaprakashika', name: 'Kalaprakashika', default: false },
  { id: 'custom', name: 'Custom Rule Set', default: false }
];
```

Rules are filtered by `authority` field. Different authorities may have different recommendations for the same tithi/nakshatra.

---

## 10. ENHANCED UI

### 10.1 Calendar View
```
┌──────────────────────────────────────────────────┐
│  August 2026                              ◀ ▶   │
├──────────────────────────────────────────────────┤
│  Mon   Tue   Wed   Thu   Fri   Sat   Sun        │
│                              1     2            │
│                              ★★★   ❌           │
│   3     4     5     6     7     8     9         │
│   ❌    ★★★   ★★★★  ★★★★★ ★★★★  ★★★   ❌        │
│  ...                                            │
└──────────────────────────────────────────────────┘
```

### 10.2 Date Detail (Expanded)
```
┌──────────────────────────────────────────────────┐
│  6 August 2026 (Thursday)        ★★★★★ 92/100   │
├──────────────────────────────────────────────────┤
│  BIOLOGICAL WINDOW                    24/25     │
│  Near Ovulation · Excellent                     │
├──────────────────────────────────────────────────┤
│  TITHI                                          │
│  Shukla Dwadashi · Excellent                    │
│  📖 MC Garbhadhana 12: "द्वादशी शुक्लपक्षे..."   │
├──────────────────────────────────────────────────┤
│  NAKSHATRA                                      │
│  Uttara Ashadha · Excellent                     │
│  📖 MC Nakshatra 45: "उत्तराषाढा..."            │
├──────────────────────────────────────────────────┤
│  MOON ANALYSIS                                  │
│  Strong · Waxing · 85% paksha bala              │
│  No afflictions · Chandrabala 8 · Tarabala 9    │
├──────────────────────────────────────────────────┤
│  BEST TIME WINDOWS                              │
│  🟢 06:42–08:15 (Vrishabha Lagna, Guru Hora)    │
│  🟢 09:30–11:00 (Mithuna Lagna, Shukra Hora)    │
│  🟡 14:00–15:30 (Karka Lagna, Chandra Hora)     │
│  🔴 12:00–13:30 (Rahu Kalam — avoid)            │
├──────────────────────────────────────────────────┤
│  PROHIBITIONS                                   │
│  ✓ No Eclipse · ✓ No Guru Asta · ✓ No Sankranti │
├──────────────────────────────────────────────────┤
│  FINAL RECOMMENDATION                           │
│  ★★★★★ HIGHLY RECOMMENDED                       │
│  Best window: 06:42–08:15 IST                   │
└──────────────────────────────────────────────────┘
```

---

## 11. PHASED EXECUTION

| Phase | Scope | Est. Effort |
|-------|-------|-------------|
| **P2.0** | Expand rule schema (Sanskrit, IAST, verification fields) | 2 hrs |
| **P2.1** | Add 14 new rule tables (lagna, hora, durmuhurta, etc.) | 6 hrs |
| **P2.2** | Implement 6-stage scoring engine | 4 hrs |
| **P2.3** | Expand Moon analysis (afflictions, aspects) | 3 hrs |
| **P2.4** | Build Lagna Engine | 4 hrs |
| **P2.5** | Build time-window refinement (30-min slots) | 4 hrs |
| **P2.6** | Implement selectable authority | 2 hrs |
| **P2.7** | Enhanced UI (time-based calendar, detailed explainer) | 4 hrs |
| **P2.8** | Comprehensive PDF report | 3 hrs |
| **P2.9** | Testing and verification | 3 hrs |

**Total estimated: ~35 hours**

---

## 12. DECISIONS NEEDED

| ID | Question | Options |
|----|----------|---------|
| D1 | Include Beeja/Kshetra Sphuta? | Yes (traditional) / No (complex, rarely used) |
| D2 | Calculate Dreshkana for Lagna? | Yes / No |
| D3 | Include regional variations? | Yes (South vs North) / No (MC only) |
| D4 | Sanskrit entry method? | Manual / AI-assisted / Leave blank |
| D5 | How to handle rule conflicts between authorities? | Priority-based / User-selectable / Show both |

---

## 13. LOG

| Date | Phase | Note |
|------|-------|------|
| 2026-07-27 | — | Phase 2 plan created based on user's comprehensive requirements. |

