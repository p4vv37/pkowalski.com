/**
 * Rendering physics: converts the science core's units (cycles/degree,
 * diopters) into on-screen pixel quantities for the WebGL shader.
 *
 * The chain, with all units:
 *
 *   acuity [c/deg] --(σ = 1/(π·A))--> neural blur σ [deg]
 *   viewing distance + assumed screen density --> pixels per degree [px/deg]
 *   σ [deg] × px/deg --> σ [px]  (shader blur radius)
 *
 * Why σ = 1/(π·A): for a Gaussian point-spread function the modulation
 * transfer function is MTF(f) = exp(−2π²σ²f²). Setting MTF(A) = e⁻²
 * (≈13.5% transmission) at the acuity limit A gives σ = 1/(π·A). This is
 * our documented approximation of the acuity cutoff (ADR 0001); MIMo grows!
 * uses an FFT-domain CSF for the same purpose.
 *
 * Defocus (depth of field): an infant accommodating at focus distance F
 * sees an object at depth Z defocused by ΔD = |100/F − 100/Z| diopters.
 * The geometric blur circle has angular diameter θ = pupil × ΔD (pupil in
 * metres, θ in radians). Its MTF first zero is at f₀ = 1/θ cycles/radian;
 * with the same e⁻² Gaussian convention σ = 180·θ/π² degrees.
 *
 * Two independent Gaussian blurs compose by adding variances
 * (σ_total² = σ₁² + σ₂²), which is how neural and optical blur combine.
 */

/** CSS pixels are assumed to land on a 96-per-inch physical grid. */
export const CSS_PPI = 96;

/**
 * Pixels of visual angle per degree, for a viewer `viewingDistanceCm` from a
 * screen with `ppi` physical pixels per inch. 1° subtends
 * distance × π/180 of arc-length; converted to pixels via px/cm.
 */
export function pxPerDegree(viewingDistanceCm: number, ppi: number = CSS_PPI): number {
  const pxPerCm = ppi / 2.54;
  return pxPerCm * viewingDistanceCm * (Math.PI / 180);
}

/** Neural (acuity-limited) blur as a Gaussian σ in degrees of visual angle. */
export function neuralSigmaDeg(acuityCpd: number): number {
  return 1 / (Math.PI * acuityCpd);
}

/** Neural blur σ in screen pixels. */
export function neuralSigmaPx(acuityCpd: number, pxPerDeg: number): number {
  return neuralSigmaDeg(acuityCpd) * pxPerDeg;
}

/** Defocus in diopters between an object at `depthCm` and focus at `focusCm`. */
export function defocusDiopters(depthCm: number, focusCm: number): number {
  return Math.abs(100 / focusCm - 100 / depthCm);
}

/**
 * Defocus blur as a Gaussian σ in degrees of visual angle.
 * `pupilMm` is the eye's pupil diameter; `diopters` the defocus amount.
 */
export function defocusSigmaDeg(diopters: number, pupilMm: number): number {
  const thetaRad = (pupilMm / 1000) * diopters; // blur circle angular diameter
  if (thetaRad <= 0) return 0;
  return (180 * thetaRad) / (Math.PI * Math.PI);
}

/** Defocus blur σ in screen pixels. */
export function defocusSigmaPx(
  diopters: number,
  pupilMm: number,
  pxPerDeg: number,
): number {
  return defocusSigmaDeg(diopters, pupilMm) * pxPerDeg;
}

/** Compose two independent Gaussian blurs (variances add). */
export function combineSigma(sigmaA: number, sigmaB: number): number {
  return Math.sqrt(sigmaA * sigmaA + sigmaB * sigmaB);
}
