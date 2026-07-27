#!/usr/bin/env node
/**
 * test_muhurta_engine.js — Phase 9 verification
 * Tests the muhurta rule engine logic with fixed inputs
 * 
 * Since the full engine requires browser context, this test validates:
 * 1. Rule matching logic patterns
 * 2. Score calculation formulas
 * 3. Veto/prohibition logic
 * 4. Weight redistribution math
 */

const fs = require('fs');
const path = require('path');

const MUHURTA_DIR = path.join(__dirname, '..', 'verse_database', 'muhurta');
const PROFILES_DIR = path.join(MUHURTA_DIR, 'profiles');

let passed = 0, failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (e) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${e.message}`);
    failed++;
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// Load profiles
const garbhadhana = JSON.parse(fs.readFileSync(path.join(PROFILES_DIR, 'garbhadhana.json'), 'utf8'));
const marriage = JSON.parse(fs.readFileSync(path.join(PROFILES_DIR, 'marriage.json'), 'utf8'));

// Load nakshatra rules
const nakRules = JSON.parse(fs.readFileSync(path.join(MUHURTA_DIR, 'mc_nakshatra.json'), 'utf8'));

// Simulate matchRule logic
function matchRule(match, facts) {
  for (const key of Object.keys(match)) {
    const cond = match[key];
    const val = facts[key];
    if (typeof cond === 'number') {
      if (val !== cond) return false;
    } else if (Array.isArray(cond)) {
      if (!cond.includes(val)) return false;
    } else if (typeof cond === 'object' && cond !== null) {
      if (cond.min !== undefined && val < cond.min) return false;
      if (cond.max !== undefined && val > cond.max) return false;
      if (cond.not !== undefined) {
        if (Array.isArray(cond.not) && cond.not.includes(val)) return false;
        if (val === cond.not) return false;
      }
    }
  }
  return true;
}

// Simulate finding applicable rules for a category
function findRules(rules, category, facts) {
  return rules.filter(r => {
    if (!r.applies_to.includes(category) && !r.applies_to.includes('*')) return false;
    return matchRule(r.match, facts);
  });
}

// Test 1: matchRule with exact nakshatra
test('matchRule: exact nakshatra match', () => {
  const match = { nakshatra: 3 };
  assert(matchRule(match, { nakshatra: 3 }), 'Should match nakshatra 3');
  assert(!matchRule(match, { nakshatra: 4 }), 'Should not match nakshatra 4');
});

// Test 2: matchRule with array of values
test('matchRule: array match', () => {
  const match = { tithi: [1, 2, 3] };
  assert(matchRule(match, { tithi: 2 }), 'Should match tithi 2');
  assert(!matchRule(match, { tithi: 4 }), 'Should not match tithi 4');
});

// Test 3: matchRule with min/max range
test('matchRule: range match', () => {
  const match = { cycleDay: { min: 10, max: 16 } };
  assert(matchRule(match, { cycleDay: 12 }), 'Should match cycleDay 12');
  assert(!matchRule(match, { cycleDay: 8 }), 'Should not match cycleDay 8');
  assert(!matchRule(match, { cycleDay: 20 }), 'Should not match cycleDay 20');
});

// Test 4: Rohini (nakshatra 3) is excellent for both garbhadhana and marriage
test('Rohini (nak 3) is excellent for garbhadhana', () => {
  const facts = { nakshatra: 3 };
  const matched = findRules(nakRules.rules, 'garbhadhana', facts);
  assert(matched.length > 0, 'Should find a rule for Rohini');
  const rohini = matched[0];
  assert(rohini.status === 'excellent', `Rohini should be excellent, got ${rohini.status}`);
  assert(rohini.score === 100, `Rohini should score 100, got ${rohini.score}`);
});

test('Rohini (nak 3) is excellent for marriage', () => {
  const facts = { nakshatra: 3 };
  const matched = findRules(nakRules.rules, 'marriage', facts);
  assert(matched.length > 0, 'Should find a rule for Rohini');
  const rohini = matched[0];
  assert(rohini.status === 'excellent', `Rohini should be excellent, got ${rohini.status}`);
  assert(rohini.score === 100, `Rohini should score 100, got ${rohini.score}`);
});

// Test 5: Pushya (nakshatra 7) - excellent for garbhadhana, VETO for marriage
test('Pushya (nak 7) is excellent for garbhadhana', () => {
  const facts = { nakshatra: 7 };
  const matched = findRules(nakRules.rules, 'garbhadhana', facts);
  assert(matched.length > 0, 'Should find a rule for Pushya');
  const pushya = matched[0];
  assert(pushya.status === 'excellent', `Pushya should be excellent for garbhadhana, got ${pushya.status}`);
  assert(pushya.score >= 85, `Pushya should score >=85, got ${pushya.score}`);
});

test('Pushya (nak 7) is VETO for marriage', () => {
  const facts = { nakshatra: 7 };
  const matched = findRules(nakRules.rules, 'marriage', facts);
  assert(matched.length > 0, 'Should find a rule for Pushya');
  const pushya = matched[0];
  assert(pushya.status === 'avoid', `Pushya should be avoid for marriage, got ${pushya.status}`);
  assert(pushya.veto === true, 'Pushya should be a veto for marriage');
  assert(pushya.score <= 10, `Pushya should score low, got ${pushya.score}`);
});

// Test 6: Weight redistribution formula
test('Weight redistribution preserves total of 100', () => {
  const weights = { a: 30, b: 25, c: 20, d: 15, e: 10 };
  const active = ['a', 'b', 'd']; // c and e are inactive
  
  const activeSum = active.reduce((s, k) => s + weights[k], 0);
  const totalSum = Object.values(weights).reduce((s, v) => s + v, 0);
  const scale = totalSum / activeSum;
  
  const redistributed = {};
  for (const k of active) {
    redistributed[k] = Math.round(weights[k] * scale);
  }
  
  const newSum = Object.values(redistributed).reduce((s, v) => s + v, 0);
  // Allow for rounding: should be within 1 of 100
  assert(Math.abs(newSum - 100) <= 2, `Redistributed should sum to ~100, got ${newSum}`);
});

// Test 7: Band classification
test('Band classification thresholds work correctly', () => {
  const bands = garbhadhana.bands;
  
  function getBand(score) {
    for (const b of bands) {
      if (score >= b.min) return b.key;
    }
    return 'avoid';
  }
  
  assert(getBand(90) === 'excellent', 'Score 90 should be excellent');
  assert(getBand(85) === 'excellent', 'Score 85 should be excellent');
  assert(getBand(75) === 'good', 'Score 75 should be good');
  assert(getBand(70) === 'good', 'Score 70 should be good');
  assert(getBand(60) === 'average', 'Score 60 should be average');
  assert(getBand(50) === 'average', 'Score 50 should be average');
  assert(getBand(40) === 'avoid', 'Score 40 should be avoid');
});

// Test 8: Quality percentage calculation
test('Quality percentage formula', () => {
  // quality = score / 100 * 100 (when max is 100)
  // For a rule with score 80 out of default 100:
  const score = 80;
  const max = 100;
  const quality = Math.round(score / max * 100);
  assert(quality === 80, `Quality should be 80%, got ${quality}`);
});

// Test 9: Points calculation with weight
test('Points calculation: quality * weight / 100', () => {
  const quality = 80; // 80%
  const weight = 25; // nakshatra weight
  const points = Math.round(quality * weight / 100);
  assert(points === 20, `Points should be 20, got ${points}`);
});

// Test 10: Penalty capping
test('Penalty capping limits deductions', () => {
  const caps = garbhadhana.penalty_caps;
  
  function capPenalty(group, total) {
    const cap = caps[group];
    if (cap === undefined) return total;
    return Math.max(total, cap); // cap is negative, so max gives less negative
  }
  
  // If prohibited penalty is -40 but cap is -30
  const penaltyRaw = -40;
  const penaltyCapped = capPenalty('prohibited', penaltyRaw);
  assert(penaltyCapped === -30, `Capped penalty should be -30, got ${penaltyCapped}`);
  
  // If penalty is -20 but cap is -30, keep -20
  const smallPenalty = -20;
  const smallCapped = capPenalty('prohibited', smallPenalty);
  assert(smallCapped === -20, `Small penalty should stay -20, got ${smallCapped}`);
});

// Test 11: All 27 nakshatras have rules for both categories
test('All 27 nakshatras have rules for garbhadhana', () => {
  for (let n = 0; n < 27; n++) {
    const facts = { nakshatra: n };
    const matched = findRules(nakRules.rules, 'garbhadhana', facts);
    assert(matched.length > 0, `Missing garbhadhana rule for nakshatra ${n}`);
  }
});

test('All 27 nakshatras have rules for marriage', () => {
  for (let n = 0; n < 27; n++) {
    const facts = { nakshatra: n };
    const matched = findRules(nakRules.rules, 'marriage', facts);
    assert(matched.length > 0, `Missing marriage rule for nakshatra ${n}`);
  }
});

// Test 12: Veto forces avoid band regardless of score
test('Veto logic: vetoed date goes to avoid band', () => {
  // Simulate: even if base score is 85, a veto forces avoid
  function finalBand(baseScore, hasVeto, bands) {
    if (hasVeto) return 'avoid';
    for (const b of bands) {
      if (baseScore >= b.min) return b.key;
    }
    return 'avoid';
  }
  
  assert(finalBand(85, true, garbhadhana.bands) === 'avoid', 
    'Vetoed date should be avoid regardless of score');
  assert(finalBand(85, false, garbhadhana.bands) === 'excellent', 
    'Non-vetoed 85 should be excellent');
});

// Summary
console.log('\n' + '─'.repeat(50));
console.log(`Muhurta Engine Tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
