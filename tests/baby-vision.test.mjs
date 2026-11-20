import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_WEEKS,
  ACUITY_ANCHORS,
  CONTRAST_ANCHORS,
  RED_GREEN_GAIN_ANCHORS,
  BLUE_YELLOW_GAIN_ANCHORS,
  SATURATION_ANCHORS,
  interpolate,
  visionParamsAtWeeks,
  weeksSince,
  weeksAndDays,
} from '../src/lib/baby-vision/model.ts';
import { SOURCES } from '../src/lib/baby-vision/sources.ts';
import {
  pxPerDegree,
  neuralSigmaDeg,
  neuralSigmaPx,
  defocusDiopters,
  defocusSigmaDeg,
  defocusSigmaPx,
  combineSigma,
} from '../src/lib/baby-vision/render.ts';

const approx = (actual, expected, tol) => Math.abs(actual - expected) <= tol;
const mo = (m) => (m * MAX_WEEKS) / 12;

const ALL_ANCHORS = [
  { name: 'acuity', anchors: ACUITY_ANCHORS },
  { name: 'contrast', anchors: CONTRAST_ANCHORS },
  { name: 'red-green', anchors: RED_GREEN_GAIN_ANCHORS },
  { name: 'blue-yellow', anchors: BLUE_YELLOW_GAIN_ANCHORS },
  { name: 'saturation', anchors: SATURATION_ANCHORS },
];

test('receipts: every anchor cites a registered source', () => {
  for (const { name, anchors } of ALL_ANCHORS) {
    for (const anchor of anchors) {
      assert.ok(
        SOURCES[anchor.sourceId],
        `${name} anchor at week ${anchor.weeks} cites unknown source '${anchor.sourceId}'`,
      );
    }
  }
});

test('anchors are age-sorted and strictly positive', () => {
  for (const { name, anchors } of ALL_ANCHORS) {
    for (let i = 0; i < anchors.length; i++) {
      assert.ok(anchors[i].weeks >= 0 && anchors[i].value > 0, `${name} anchor ${i} invalid`);
      if (i > 0) assert.ok(anchors[i].weeks > anchors[i - 1].weeks, `${name} anchors out of order`);
    }
  }
});

test('acuity matches research anchors at anchor ages', () => {
  for (const anchor of ACUITY_ANCHORS) {
    assert.ok(
      approx(visionParamsAtWeeks(anchor.weeks).acuityCpd, anchor.value, 1e-9),
      `acuity at week ${anchor.weeks}`,
    );
  }
});

test('week 0 matches Brown 2018 newborn medians', () => {
  const p = visionParamsAtWeeks(0);
  assert.ok(approx(p.acuityCpd, 0.783, 1e-9));
  assert.ok(approx(p.logMAR, Math.log10(30 / 0.783), 1e-9));
  assert.ok(approx(p.snellen, (20 * 30) / 0.783, 0.5)); // ≈ 20/766
  assert.ok(approx(p.contrastThreshold, 0.46, 1e-9));
});

test('acuity is strictly increasing and finite across the first year', () => {
  let prev = 0;
  for (let w = 0; w <= MAX_WEEKS; w += 0.25) {
    const p = visionParamsAtWeeks(w);
    assert.ok(Number.isFinite(p.acuityCpd), `week ${w}`);
    assert.ok(p.acuityCpd > prev, `acuity must increase at week ${w}`);
    prev = p.acuityCpd;
  }
});

test('interpolation is log-linear between acuity anchors', () => {
  const midWeeks = (mo(1) + mo(2)) / 2;
  const expected = Math.sqrt(1.05 * 2.06); // geometric mean of the 1 mo / 2 mo anchors
  assert.ok(approx(interpolate(ACUITY_ANCHORS, midWeeks, 'log').value, expected, 1e-9));
});

test('contrast threshold never rises: 46% at birth, adult level from 13 weeks', () => {
  let prev = Infinity;
  for (let w = 0; w <= MAX_WEEKS; w += 0.25) {
    const p = visionParamsAtWeeks(w);
    assert.ok(p.contrastThreshold <= prev, `contrast threshold must not rise at week ${w}`);
    prev = p.contrastThreshold;
  }
  assert.ok(approx(visionParamsAtWeeks(9).contrastThreshold, 0.005, 1e-9));
});

test('contrast gain: ~8% at birth, unity from 13 weeks on', () => {
  assert.ok(approx(visionParamsAtWeeks(0).contrastGain, Math.sqrt(0.003 / 0.46), 1e-9));
  assert.equal(visionParamsAtWeeks(13).contrastGain, 1);
  assert.equal(visionParamsAtWeeks(52).contrastGain, 1);
});

test('color: muted red at week 0, trichromatic by 12 weeks, monotone gains', () => {
  const p0 = visionParamsAtWeeks(0);
  assert.ok(approx(p0.redGreenGain, 0.15, 1e-9));
  assert.ok(approx(p0.blueYellowGain, 0.02, 1e-9));
  assert.ok(approx(visionParamsAtWeeks(12).blueYellowGain, 1.0, 1e-9));
  assert.ok(approx(visionParamsAtWeeks(52).saturation, 0.92, 1e-9));
  let prevRg = 0;
  let prevBy = 0;
  for (let w = 0; w <= MAX_WEEKS; w += 0.5) {
    const p = visionParamsAtWeeks(w);
    assert.ok(p.redGreenGain >= prevRg && p.blueYellowGain >= prevBy, `gains must not fall at week ${w}`);
    prevRg = p.redGreenGain;
    prevBy = p.blueYellowGain;
  }
});

test('out-of-range ages clamp to [0, 52] weeks', () => {
  assert.equal(visionParamsAtWeeks(-5).weeks, 0);
  assert.equal(visionParamsAtWeeks(80).weeks, MAX_WEEKS);
  assert.ok(approx(visionParamsAtWeeks(80).acuityCpd, 9.01, 1e-9));
});

test('readout carries the bracketing source ids of every metric', () => {
  const p = visionParamsAtWeeks(2); // between week 0 and 1 mo anchors
  // Acuity brackets brown2018 → neijzen2025 …
  assert.ok(p.sourceIds.includes('brown2018'));
  assert.ok(p.sourceIds.includes('neijzen2025'));
  // … and the other metrics cite their own brackets (contrast, color).
  assert.ok(p.sourceIds.includes('norcia1990'));
  assert.ok(p.sourceIds.includes('adams1994'));
});

test('weeksSince: 2026-11-12 to 2026-11-20 is exactly 8 days', () => {
  const w = weeksSince('2026-11-12', new Date('2026-11-20T00:00:00'));
  assert.ok(approx(w, 8 / 7, 1e-9));
  assert.deepEqual(weeksAndDays(w), { weeks: 1, days: 1 });
  assert.equal(weeksSince('2030-01-01', new Date('2026-11-20T00:00:00')), 0);
});

test('render: px per degree at 50 cm / 96 ppi ≈ 33', () => {
  const expected = (96 / 2.54) * 50 * (Math.PI / 180);
  assert.ok(approx(pxPerDegree(50), expected, 1e-9));
  assert.ok(approx(pxPerDegree(50), 32.97, 0.05));
});

test('render: newborn neural sigma ≈ 0.41 deg, scales with px/deg', () => {
  assert.ok(approx(neuralSigmaDeg(0.783), 1 / (Math.PI * 0.783), 1e-12));
  assert.ok(approx(neuralSigmaPx(0.783, 15), (1 / (Math.PI * 0.783)) * 15, 1e-12));
});

test('render: defocus is zero at the focus plane', () => {
  assert.equal(defocusDiopters(30, 30), 0);
});

test('render: 60 cm object with focus at 30 cm is 5/3 diopters out', () => {
  assert.ok(approx(defocusDiopters(60, 30), 5 / 3, 1e-9));
});

test('render: 3 D defocus through a 3 mm pupil gives sigma ≈ 0.164 deg', () => {
  const expected = (180 * 0.009) / (Math.PI * Math.PI);
  assert.ok(approx(defocusSigmaDeg(3, 3), expected, 1e-12));
  assert.ok(approx(defocusSigmaDeg(3, 3), 0.164, 0.001));
  assert.equal(defocusSigmaDeg(0, 3), 0);
  assert.ok(approx(defocusSigmaPx(3, 3, 33), defocusSigmaDeg(3, 3) * 33, 1e-12));
});

test('render: Gaussian blurs compose by adding variances', () => {
  assert.ok(approx(combineSigma(3, 4), 5, 1e-12));
});

test('physics sanity: blur regime shifts from neural- to focus-dominated', () => {
  const px = 33; // ~50 cm from a 96 ppi screen
  const newbornNeural = neuralSigmaPx(visionParamsAtWeeks(0).acuityCpd, px);
  const sixMonthNeural = neuralSigmaPx(visionParamsAtWeeks(26).acuityCpd, px);
  const distantObject = defocusSigmaPx(defocusDiopters(300, 30), 3, px); // 3 m away, focus 30 cm, 3 mm pupil
  assert.ok(newbornNeural > distantObject, 'newborn blur is dominated by neural acuity limits');
  assert.ok(sixMonthNeural < distantObject, 'by 6 months, optical defocus of distant objects dominates');
});
