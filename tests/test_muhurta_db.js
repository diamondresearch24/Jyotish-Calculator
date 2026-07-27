#!/usr/bin/env node
/**
 * test_muhurta_db.js — Phase 9 verification
 * Validates all muhurta JSON files:
 *  - Valid JSON syntax
 *  - Schema conformance (required fields present)
 *  - No duplicate rule IDs across all tables
 *  - Profile references valid tables
 */

const fs = require('fs');
const path = require('path');

const MUHURTA_DIR = path.join(__dirname, '..', 'verse_database', 'muhurta');
const PROFILES_DIR = path.join(MUHURTA_DIR, 'profiles');

const TABLE_FILES = [
  'mc_tithi.json', 'mc_nakshatra.json', 'mc_yoga.json', 'mc_karana.json',
  'mc_vara.json', 'mc_chandrabala.json', 'mc_tarabala.json', 'mc_graha.json',
  'mc_prohibited.json', 'mc_festival.json', 'mc_biological.json'
];

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

// Test 1: All table files exist and are valid JSON
test('All table files exist and parse as valid JSON', () => {
  for (const fn of TABLE_FILES) {
    const fp = path.join(MUHURTA_DIR, fn);
    assert(fs.existsSync(fp), `Missing file: ${fn}`);
    const raw = fs.readFileSync(fp, 'utf8');
    JSON.parse(raw); // throws if invalid
  }
});

// Test 2: Each table has meta and rules array
test('Each table has meta object and rules array', () => {
  for (const fn of TABLE_FILES) {
    const fp = path.join(MUHURTA_DIR, fn);
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
    assert(data.meta && typeof data.meta === 'object', `${fn}: missing meta object`);
    assert(Array.isArray(data.rules), `${fn}: missing rules array`);
    assert(data.meta.file === fn, `${fn}: meta.file should match filename`);
    assert(data.meta.component, `${fn}: meta.component required`);
  }
});

// Test 3: Each rule has required fields
test('Each rule has required fields (id, applies_to, match, status, score or penalty)', () => {
  for (const fn of TABLE_FILES) {
    const fp = path.join(MUHURTA_DIR, fn);
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
    for (let i = 0; i < data.rules.length; i++) {
      const r = data.rules[i];
      assert(r.id, `${fn} rule[${i}]: missing id`);
      assert(Array.isArray(r.applies_to), `${fn} rule ${r.id}: applies_to must be array`);
      assert(r.match && typeof r.match === 'object', `${fn} rule ${r.id}: missing match object`);
      assert(r.status, `${fn} rule ${r.id}: missing status`);
      // Penalty rules have 'penalty' field; component rules have 'score' field
      const hasScore = typeof r.score === 'number';
      const hasPenalty = typeof r.penalty === 'number';
      assert(hasScore || hasPenalty, `${fn} rule ${r.id}: must have score or penalty as number`);
    }
  }
});

// Test 4: No duplicate rule IDs across all tables
test('No duplicate rule IDs across all tables', () => {
  const allIds = new Map();
  for (const fn of TABLE_FILES) {
    const fp = path.join(MUHURTA_DIR, fn);
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
    for (const r of data.rules) {
      if (allIds.has(r.id)) {
        throw new Error(`Duplicate ID "${r.id}" in ${fn} (first seen in ${allIds.get(r.id)})`);
      }
      allIds.set(r.id, fn);
    }
  }
  console.log(`    (${allIds.size} unique rule IDs checked)`);
});

// Test 5: Profile files exist and are valid
test('Profile files exist and parse as valid JSON', () => {
  const profiles = ['garbhadhana.json', 'marriage.json'];
  for (const pf of profiles) {
    const fp = path.join(PROFILES_DIR, pf);
    assert(fs.existsSync(fp), `Missing profile: ${pf}`);
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
    assert(data.category, `${pf}: missing category`);
    assert(Array.isArray(data.tables), `${pf}: tables must be array`);
    assert(data.weights && typeof data.weights === 'object', `${pf}: missing weights`);
    assert(Array.isArray(data.bands), `${pf}: bands must be array`);
  }
});

// Test 6: Profile tables reference existing files
test('Profile tables reference existing files', () => {
  const profiles = ['garbhadhana.json', 'marriage.json'];
  for (const pf of profiles) {
    const fp = path.join(PROFILES_DIR, pf);
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
    for (const tf of data.tables) {
      const tfp = path.join(MUHURTA_DIR, tf);
      assert(fs.existsSync(tfp), `${pf} references non-existent table: ${tf}`);
    }
  }
});

// Test 7: Weights sum to a reasonable total
test('Profile weights sum to 100 or less', () => {
  const profiles = ['garbhadhana.json', 'marriage.json'];
  for (const pf of profiles) {
    const fp = path.join(PROFILES_DIR, pf);
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
    const sum = Object.values(data.weights).reduce((a, b) => a + b, 0);
    assert(sum <= 100, `${pf}: weights sum to ${sum}, expected <= 100`);
    console.log(`    ${pf}: weights sum = ${sum}`);
  }
});

// Test 8: Each rule has translations.en
test('Each rule has translations.en', () => {
  for (const fn of TABLE_FILES) {
    const fp = path.join(MUHURTA_DIR, fn);
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
    for (const r of data.rules) {
      assert(r.translations && r.translations.en, `${fn} rule ${r.id}: missing translations.en`);
    }
  }
});

// Test 9: Bands are properly ordered (descending min)
test('Profile bands are ordered by descending min', () => {
  const profiles = ['garbhadhana.json', 'marriage.json'];
  for (const pf of profiles) {
    const fp = path.join(PROFILES_DIR, pf);
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
    for (let i = 1; i < data.bands.length; i++) {
      assert(data.bands[i].min < data.bands[i-1].min, 
        `${pf}: bands not in descending order at index ${i}`);
    }
  }
});

// Test 10: Marriage has Pushya veto rule
test('Marriage profile has Pushya nakshatra as veto', () => {
  const fp = path.join(MUHURTA_DIR, 'mc_nakshatra.json');
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const pushyaMarriage = data.rules.find(r => 
    r.id === 'MC_NAK_M07' && r.applies_to.includes('marriage')
  );
  assert(pushyaMarriage, 'MC_NAK_M07 (Pushya for marriage) not found');
  assert(pushyaMarriage.veto === true, 'Pushya for marriage should have veto: true');
  assert(pushyaMarriage.match.nakshatra === 7, 'Pushya should match nakshatra 7');
});

// Summary
console.log('\n' + '─'.repeat(50));
console.log(`Muhurta DB Tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
