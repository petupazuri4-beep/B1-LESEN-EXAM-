import { INITIAL_EXAMS } from '../data/exams';
import { validateExam } from '../utils/validator';
import { convertRawToScaledScore, isPassingScore, OFFICIAL_B1_CONVERSION_TABLE } from '../utils/scoreConversion';

console.log('================================================');
console.log('RUNNING B1 LESEN EXAM STUDIO TEST SUITE');
console.log('================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${testName}`);
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
  }
}

// 1. Test Numbering & Structure of all 10 seed exams
console.log('[Test Suite 1] All 10 Exams Conformity & Item Numbering');
assert(INITIAL_EXAMS.length === 10, 'Exactly 10 seed exams loaded');

INITIAL_EXAMS.forEach((exam, idx) => {
  const num = idx + 1;
  const report = validateExam(exam);
  assert(report.totalItems === 30, `Exam ${num} has exactly 30 items`);
  assert(report.errorCount === 0, `Exam ${num} passes validation without errors`);

  // Verify item numbering sequence
  const t1Numbers = exam.teil1.items.map(i => i.number);
  assert(JSON.stringify(t1Numbers) === JSON.stringify([1, 2, 3, 4, 5, 6]), `Exam ${num} Teil 1 items are 1–6`);

  const t2Numbers = [...exam.teil2.textA.items, ...exam.teil2.textB.items].map(i => i.number);
  assert(JSON.stringify(t2Numbers) === JSON.stringify([7, 8, 9, 10, 11, 12]), `Exam ${num} Teil 2 items are 7–12`);

  const t3Numbers = exam.teil3.situations.map(s => s.number);
  assert(JSON.stringify(t3Numbers) === JSON.stringify([13, 14, 15, 16, 17, 18, 19]), `Exam ${num} Teil 3 items are 13–19`);

  const t4Numbers = exam.teil4.leserbriefe.map(lb => lb.number);
  assert(JSON.stringify(t4Numbers) === JSON.stringify([20, 21, 22, 23, 24, 25, 26]), `Exam ${num} Teil 4 items are 20–26`);

  const t5Numbers = exam.teil5.items.map(i => i.number);
  assert(JSON.stringify(t5Numbers) === JSON.stringify([27, 28, 29, 30]), `Exam ${num} Teil 5 items are 27–30`);

  // Check exactly one '0' in Teil 3 matching
  const zeroMatches = exam.teil3.situations.filter(s => s.correctAnswer === '0');
  assert(zeroMatches.length === 1, `Exam ${num} Teil 3 has exactly one unmatched situation (answer '0')`);
});

// 2. Test Official Score Conversion Table
console.log('\n[Test Suite 2] Official CEFR B1 Score Conversion');
assert(convertRawToScaledScore(30) === 100, 'Raw score 30 = 100 scaled points');
assert(convertRawToScaledScore(18) === 60, 'Raw score 18 = 60 scaled points (Pass limit)');
assert(isPassingScore(18) === true, '18 points is a passing score (>= 60%)');
assert(isPassingScore(17) === false, '17 points fails (< 60%)');
assert(convertRawToScaledScore(0) === 0, 'Raw score 0 = 0 scaled points');
assert(OFFICIAL_B1_CONVERSION_TABLE.length === 31, 'Score conversion table has all 31 tiers (0 to 30)');

// 3. Test Validator Error Detection on Defective Exam
console.log('\n[Test Suite 3] Validator Catches Invalid Papers');
const defectiveExam = JSON.parse(JSON.stringify(INITIAL_EXAMS[0]));
defectiveExam.teil1.items.pop(); // Remove 1 item
const defectReport = validateExam(defectiveExam);
assert(defectReport.isValid === false, 'Validator catches missing item in Teil 1');
assert(defectReport.totalItems === 29, 'Validator reports totalItems = 29');

// 4. Test AI Exam Generator & Strict Goethe Compliance
console.log('\n[Test Suite 4] AI Exam Generator & Goethe Norm Compliance');
import { THEME_PRESETS, generateCuratedB1Exam } from '../utils/aiGenerator';

THEME_PRESETS.forEach((preset) => {
  const generated = generateCuratedB1Exam(preset, 11, {
    audience: 'Erwachsene',
    city: preset.suggestedCity,
    institution: preset.suggestedInstitution,
  });
  const report = validateExam(generated);
  assert(report.totalItems === 30, `AI Generated "${preset.id}" has 30 items`);
  assert(report.errorCount === 0, `AI Generated "${preset.id}" passes validation with 0 errors`);

  const zeroMatches = generated.teil3.situations.filter(s => s.correctAnswer === '0');
  assert(zeroMatches.length === 1, `AI Generated "${preset.id}" Teil 3 has exactly 1 unmatched situation (answer '0')`);
  assert(generated.teil3.advertisements.length === 10, `AI Generated "${preset.id}" Teil 3 has 10 ads (A–J)`);
});

// Test custom theme generation (e.g. 'Haustiere im Altersheim')
const customGenerated = generateCuratedB1Exam({
  id: 'custom_haustiere',
  title: 'Haustiere im Altersheim & Tiergestützte Therapie',
  theme: 'Haustiere im Altersheim',
  description: 'Besuchstiere im Seniorenheim und emotionale Unterstützung',
  category: 'Gesellschaft',
  suggestedCity: 'München',
  suggestedInstitution: 'Goethe-Institut München',
}, 12);
const customReport = validateExam(customGenerated);
assert(customReport.totalItems === 30, 'Custom Theme "Haustiere im Altersheim" has 30 items');
assert(customReport.errorCount === 0, 'Custom Theme "Haustiere im Altersheim" passes validation with 0 errors');
assert(customGenerated.teil3.situations.filter(s => s.correctAnswer === '0').length === 1, 'Custom Theme has exactly one unmatched situation "0"');

// 5. Test Space Line & Download Layout Configuration
console.log('\n[Test Suite 5] Space Line & Download Layout Editor');
import { DEFAULT_SPACE_LINE_CONFIG } from '../types/exam';
assert(DEFAULT_SPACE_LINE_CONFIG.showNoteLines === true, 'DEFAULT_SPACE_LINE_CONFIG has showNoteLines enabled');
assert(DEFAULT_SPACE_LINE_CONFIG.linesCount === 4, 'DEFAULT_SPACE_LINE_CONFIG has 4 note lines');
assert(DEFAULT_SPACE_LINE_CONFIG.lineStyle === 'dotted', 'DEFAULT_SPACE_LINE_CONFIG uses dotted line style');
assert(DEFAULT_SPACE_LINE_CONFIG.lineSpacingMm === 8, 'DEFAULT_SPACE_LINE_CONFIG uses 8mm line spacing');
assert(customGenerated.styleConfig.spaceLines !== undefined, 'Generated exam has spaceLines configured');
assert(customGenerated.styleConfig.spaceLines?.linesCount === 4, 'Generated exam spaceLines line count is 4');

// 6. Test CEFR B1 Linter and Line Numbering Utilities
console.log('\n[Test Suite 6] CEFR B1 Linter & Line Numbering');
import { lintGermanText } from '../utils/b1Linter';
import { formatTextWithLineNumbers } from '../utils/lineNumbering';

const testSampleText = `Liebe Sarah, ich hoffe, dass es dir gut geht. Gestern habe ich in der neuen Stadt ein wunderbares Café entdeckt, in dem man sehr gemütlich Kaffee trinken und Bücher lesen kann. Beziehungsweise sollten wir uns am nächsten Samstag dort treffen, um über unsere Urlaubspläne zu sprechen.`;
const lintResult = lintGermanText(testSampleText, 'teil1');
assert(lintResult.totalWords > 40, 'B1 Linter counts total words');
assert(lintResult.flaggedWords.some(f => f.word.toLowerCase() === 'beziehungsweise'), 'B1 Linter flags B2+ word "beziehungsweise"');
assert(lintResult.targetWordRange[0] === 200 && lintResult.targetWordRange[1] === 260, 'Teil 1 target word range is 200–260');

const lineNumResult = formatTextWithLineNumbers(testSampleText, 5, 40);
assert(lineNumResult.totalLines > 2, 'Line numbering calculates lines');
assert(lineNumResult.paragraphs.length > 0, 'Line numbering preserves paragraphs');

console.log('\n================================================');
console.log(`SUMMARY: ${passedTests} / ${totalTests} tests passed.`);
console.log('================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
