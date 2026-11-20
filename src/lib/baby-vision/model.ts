/**
 * The science core of the Baby Vision Simulator.
 *
 * Everything here is data + pure functions: age (weeks after birth) in,
 * rendering parameters out. Every numeric anchor carries a `sourceId` that
 * must resolve in sources.ts (a unit test enforces this), so no number can
 * sneak in without a citation.
 *
 * Age convention: *weeks after birth* (chronological, fractional — the UI
 * interpolates at sub-week resolution). We use the 52-week year convention,
 * 1 month = 52/12 weeks, so the slider's week 52 is exactly the 12-month
 * research anchor.
 *
 * Interpolation: acuity and contrast thresholds develop roughly
 * exponentially, so they are interpolated linearly in log space; channel
 * gains are interpolated linearly.
 */

export const MAX_WEEKS = 52;

/** Months → weeks (52-week year convention). */
const mo = (months: number): number => (months * MAX_WEEKS) / 12;

export interface Anchor {
  /** Age in weeks after birth. */
  weeks: number;
  /** Anchor value (see the array it belongs to for units). */
  value: number;
  /** Must resolve in sources.ts. */
  sourceId: string;
  /** What the number is, for humans reading the model. */
  note?: string;
}

/**
 * Visual acuity (behavioral, binocular) in cycles/degree.
 * Week 0: in-hospital newborn median (Brown 2018).
 * Months 1–12: geometric means derived from the TAC II meta-analysis
 * prediction limits (Neijzen 2025), cross-checked against Mayer 1995
 * and measured Sydney TAC II values (Leone 2014).
 */
export const ACUITY_ANCHORS: Anchor[] = [
  { weeks: 0, value: 0.783, sourceId: 'brown2018', note: 'newborn behavioral median ≈ 20/766' },
  { weeks: mo(1), value: 1.05, sourceId: 'neijzen2025', note: '≈ 20/570' },
  { weeks: mo(2), value: 2.06, sourceId: 'neijzen2025', note: '≈ 20/290' },
  { weeks: mo(3), value: 3.01, sourceId: 'neijzen2025', note: '≈ 20/200' },
  { weeks: mo(4), value: 3.92, sourceId: 'neijzen2025', note: '≈ 20/150' },
  { weeks: mo(6), value: 5.63, sourceId: 'neijzen2025', note: '≈ 20/110' },
  { weeks: mo(9), value: 7.72, sourceId: 'neijzen2025', note: '≈ 20/78' },
  { weeks: mo(12), value: 9.01, sourceId: 'neijzen2025', note: '≈ 20/67' },
];

/**
 * Michelson contrast threshold (fraction) at low spatial frequencies.
 * Week 0: newborn median (Brown 2018). Weeks 2.5–9: sweep-VEP development
 * (Norcia 1990). Week 13: adult low-SF reference (Norcia 1990) — after this
 * the remaining contrast immaturity is confined to high spatial frequencies,
 * which the acuity blur already models.
 */
export const CONTRAST_ANCHORS: Anchor[] = [
  { weeks: 0, value: 0.46, sourceId: 'brown2018', note: 'newborn median, 0.083 c/deg' },
  { weeks: 2.5, value: 0.07, sourceId: 'norcia1990', note: 'low SF, 2–3 weeks' },
  { weeks: 9, value: 0.005, sourceId: 'norcia1990', note: 'low-SF asymptote' },
  { weeks: 13, value: 0.003, sourceId: 'norcia1990', note: 'adult low-SF reference' },
];

/**
 * Red–green (L−M) opponent channel gain, 0..1.
 * Design mapping (documented in the ADR): newborns discriminate saturated
 * red reliably (74%) but little else (Adams 1994); the L−M mechanism
 * matures first and is essentially adult-like by ~2 months (Varner 1985,
 * Skelton 2022). 1.0 means "no attenuation".
 */
export const RED_GREEN_GAIN_ANCHORS: Anchor[] = [
  { weeks: 0, value: 0.15, sourceId: 'adams1994', note: 'saturated reds faintly visible' },
  { weeks: 4, value: 0.4, sourceId: 'adams1994', note: 'red clearly discriminated at 1 month' },
  { weeks: 8, value: 1.0, sourceId: 'varner1985', note: 'R–G mechanism mature' },
];

/**
 * Blue–yellow (S) opponent channel gain, 0..1.
 * Design mapping: S-cone (tritan) discrimination is unreliable before
 * ~4–8 weeks (Varner 1985); trichromatic vision by ~3 months (Skelton 2022).
 */
export const BLUE_YELLOW_GAIN_ANCHORS: Anchor[] = [
  { weeks: 0, value: 0.02, sourceId: 'adams1994', note: 'blue discriminated by only 14% of newborns' },
  { weeks: 4, value: 0.05, sourceId: 'varner1985', note: 'youngest 1-month-olds fail tritan' },
  { weeks: 8, value: 0.5, sourceId: 'varner1985', note: 'most 2-month-olds pass tritan' },
  { weeks: 12, value: 1.0, sourceId: 'skelton2022', note: 'trichromatic by ~3 months' },
];

/**
 * Global saturation multiplier, 0..1.
 * Design mapping: hue discrimination is functional by ~3 months but
 * *saturation* thresholds stay immature long after (adult only in late
 * adolescence; Knoblauch 2001 via Skelton 2022) — so a mild desaturation
 * persists through the first year.
 */
export const SATURATION_ANCHORS: Anchor[] = [
  { weeks: 12, value: 0.85, sourceId: 'skelton2022', note: 'hues present, saturation muted' },
  { weeks: 52, value: 0.92, sourceId: 'skelton2022', note: 'still mildly desaturated vs adult' },
];

/** Adult low-SF contrast threshold (Michelson fraction, Norcia 1990). */
export const ADULT_CONTRAST_THRESHOLD = 0.003;

/**
 * Rendering interpretation (see ADR): suprathreshold attenuation is a
 * compressive function of the infant:adult threshold ratio. A linear map
 * would render week 0 as featureless fog (0.65% residual contrast); the
 * exponent 0.5 keeps strong edges visible at ~8%, consistent with
 * suprathreshold contrast constancy.
 */
export const CONTRAST_GAIN_EXPONENT = 0.5;

export interface Interpolated {
  value: number;
  /** Source ids of the anchors bracketing this age (for the readout). */
  sourceIds: string[];
}

/** Piecewise interpolation between anchors; clamps outside the anchor range. */
export function interpolate(
  anchors: Anchor[],
  weeks: number,
  space: 'log' | 'linear' = 'log',
): Interpolated {
  if (anchors.length === 0) throw new Error('no anchors');
  const w = Math.min(Math.max(weeks, anchors[0].weeks), anchors[anchors.length - 1].weeks);
  if (w <= anchors[0].weeks) return { value: anchors[0].value, sourceIds: [anchors[0].sourceId] };
  const last = anchors.length - 1;
  if (w >= anchors[last].weeks) {
    return { value: anchors[last].value, sourceIds: [anchors[last].sourceId] };
  }
  let hi = 1;
  while (anchors[hi].weeks < w) hi++;
  const a = anchors[hi - 1];
  const b = anchors[hi];
  const t = (w - a.weeks) / (b.weeks - a.weeks);
  const value =
    space === 'log'
      ? Math.exp(Math.log(a.value) + t * (Math.log(b.value) - Math.log(a.value)))
      : a.value + t * (b.value - a.value);
  return { value, sourceIds: [a.sourceId, b.sourceId] };
}

/** Rendering parameters for a given age. Pure; tested. */
export interface VisionParams {
  /** Clamped age actually used. */
  weeks: number;
  /** Behavioral binocular grating acuity, cycles/degree. */
  acuityCpd: number;
  /** log10(30 / acuityCpd); 0 = 20/20. */
  logMAR: number;
  /** Snellen denominator x in "20/x" (approximate communication only). */
  snellen: number;
  /** Michelson contrast threshold at low spatial frequency. */
  contrastThreshold: number;
  /** Suprathreshold contrast attenuation factor, 0..1 (rendering interpretation). */
  contrastGain: number;
  /** Red–green opponent channel gain, 0..1. */
  redGreenGain: number;
  /** Blue–yellow opponent channel gain, 0..1. */
  blueYellowGain: number;
  /** Global saturation multiplier, 0..1. */
  saturation: number;
  /** Sources bracketing the values above (for the readout). */
  sourceIds: string[];
}

export function visionParamsAtWeeks(weeks: number): VisionParams {
  const w = Math.min(Math.max(weeks, 0), MAX_WEEKS);
  const acuity = interpolate(ACUITY_ANCHORS, w, 'log');
  const contrast = interpolate(CONTRAST_ANCHORS, w, 'log');
  const rg = interpolate(RED_GREEN_GAIN_ANCHORS, w, 'linear');
  const by = interpolate(BLUE_YELLOW_GAIN_ANCHORS, w, 'linear');
  const sat = interpolate(SATURATION_ANCHORS, w, 'linear');
  const contrastGain = Math.min(
    1,
    Math.pow(ADULT_CONTRAST_THRESHOLD / contrast.value, CONTRAST_GAIN_EXPONENT),
  );
  return {
    weeks: w,
    acuityCpd: acuity.value,
    logMAR: Math.log10(30 / acuity.value),
    snellen: (20 * 30) / acuity.value,
    contrastThreshold: contrast.value,
    contrastGain,
    redGreenGain: rg.value,
    blueYellowGain: by.value,
    saturation: sat.value,
    sourceIds: [...new Set([...acuity.sourceIds, ...contrast.sourceIds, ...rg.sourceIds, ...by.sourceIds, ...sat.sourceIds])],
  };
}

/**
 * Age in fractional weeks between a birth date (local midnight) and `now`.
 * Dates are compared as timestamps; "today" is whatever the user's clock says.
 */
export function weeksSince(birth: string | Date, now: Date = new Date()): number {
  const start = typeof birth === 'string' ? new Date(`${birth}T00:00:00`) : birth;
  return Math.max(0, (now.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
}

/** Split fractional weeks into whole weeks + leftover days (for labels). */
export function weeksAndDays(weeks: number): { weeks: number; days: number } {
  const totalDays = Math.round(weeks * 7);
  return { weeks: Math.floor(totalDays / 7), days: totalDays % 7 };
}
