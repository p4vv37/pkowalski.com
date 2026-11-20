# 0001 — Converting acuity, diopters, and thresholds into on-screen pixels

**Date:** 2026-11-20
**Status:** accepted

## Context

The simulator's research inputs are visual-science quantities — cycles per degree,
diopters of defocus, Michelson contrast thresholds — but a WebGL shader blurs and
scales *pixels*. The mapping is not unique, so it is recorded here. A future reader
who "just fixes" any of these choices would silently change what the page claims
to be science.

## Decision

- **Acuity → blur.** Acuity A(age) [c/deg] becomes a Gaussian low-pass with
  σ = 1/(π·A) degrees of visual angle, which puts the acuity frequency at e⁻²
  (≈13.5%) modulation transfer. Chosen over an FFT-domain CSF (as MIMo grows!
  does) because it matches the cutoff within the spread of the underlying
  studies while staying a readable real-time shader.
- **Defocus → blur.** Defocus of ΔD diopters through a pupil of diameter p gives
  a blur-circle angle θ = p·ΔD in radians. We substitute a Gaussian with
  equal per-axis variance, σ = θ/4 in the same angular units. See ADR 0002
  for the limits of combining this with behavioral acuity.
- **Degrees → pixels.** Visual angle belongs to the *viewer's* screen, not the
  camera FOV. σ [px] = σ [deg] × px-per-degree, computed from the viewing
  distance (device default ≈35 cm touch / ≈55 cm desktop, user-adjustable
  25–100 cm) under the CSS assumption of 96 px/inch. Without this assumption
  "research-grounded blur" is undefined, so the page ships the control.
- **Kernel.** 25 taps at offsets i·σ/4 with weights exp(−i²/32) (covers ±3σ);
  each tap refines its spacing with the local σ (two-step probe) so
  depth-dependent blur transitions smoothly instead of banding.
- **Contrast.** The infant:adult threshold ratio is rendered as
  gain = (T_adult/T_infant)^0.5 — a compressive suprathreshold map. A linear map
  would render week 0 as featureless fog (0.65% residual contrast); the exponent
  keeps strong edges visible at ≈8%, in the spirit of suprathreshold contrast
  constancy. Frame mean luminance is read from the source texture's 1×1 mip
  (averaged in gamma space — acceptable for a mean, no reduction pass).
- **Color.** Invertible opponent basis y = (r+2g+b)/4, v = r−g (≈L−M),
  u = b−y (≈S), scaled by age-keyed channel gains and a global saturation
  multiplier. No TinyEyes-style *chromatic blur*: the literature says early
  color weakness is largely a contrast-threshold effect (Brown 1990), which the
  gains already model.

## Consequences

- All shader constants arrive as uniforms computed by `render.ts`/`model.ts`;
  the shaders contain no age- or scene-specific numbers.
- Weekly-resolution acuity data does not exist in the literature; the model
  interpolates log-linearly between monthly anchors (week 0 from Brown 2018).
  Smooth by construction — and honest about being interpolation.
- Grating acuity ≠ recognition (optotype) acuity; the readout communicates
  Snellen equivalents as approximations only.
