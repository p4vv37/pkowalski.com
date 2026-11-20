#version 300 es
precision highp float;

// ---------------------------------------------------------------------------
// Baby Vision Simulator — blur pass (one direction of the separable filter).
//
// WHAT THIS BLURS
//
// The baby's eye imposes two independent low-pass filters on the retinal
// image, and independent Gaussian blurs compose by adding variances
// (σ_total² = σ₁² + σ₂²):
//
//   1. Neural acuity limit. Behavioral grating acuity A(age) in cycles per
//      degree is converted to a Gaussian σ = 1/(π·A) degrees: a Gaussian
//      point-spread function has MTF(f) = exp(−2π²σ²f²), so σ = 1/(π·A)
//      puts the acuity frequency A at e⁻² ≈ 13.5% modulation transfer.
//      (Research anchors: Brown 2018, Neijzen 2025 — see model.ts.)
//
//   2. Optical defocus. If the baby accommodates at distance F, an object
//      at depth Z is defocused by ΔD = |100/F − 100/Z| diopters. Through a
//      pupil of diameter p, the blur circle subtends θ = p·ΔD radians,
//      approximated by a Gaussian of σ = θ/4 in the same angular units
//      (matching the per-axis variance of a uniform disk).
//
// The host (render.ts) supplies both as pixels of the *displayed* canvas —
// visual angle belongs to the viewer's screen, not the camera's FOV —
// already multiplied by pixels-per-degree from the viewing distance.
//
// HOW THE KERNEL IS SAMPLED
//
// A fixed 25-tap kernel covers ±3σ: tap i sits at offset i·σ/4 with weight
// exp(−i²/32), because exp(−(i·σ/4)²/(2σ²)) = exp(−i²/32). The weights are
// therefore independent of σ — only the spacing stretches.
//
// For spatially varying σ (defocus), a one-shot center-σ kernel would band
// at depth discontinuities. Instead each tap refines its own spacing:
// first probe with the center σ, read the local σ there, then sample at
// i·σ_local/4. Two σ evaluations per tap, smooth transitions, and the
// error is confined to sub-tap geometry — acceptable next to the physics
// we are already approximating (ADR 0001).
//
// COLOR SPACE
//
// Filtering must happen in linear light, not gamma-encoded sRGB, or dark
// edges halo. The first pass (u_linearInput = false) decodes sRGB on
// fetch; its output — and the input to the second pass — is linear stored
// in a 16-bit float target.
// ---------------------------------------------------------------------------

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_image;   // RGBA8 sRGB (pass 1) or RGBA16F linear (pass 2)
uniform sampler2D u_depth;   // normalized relative depth map, 0..1 (optional)
uniform bool  u_hasDepth;
uniform bool  u_linearInput; // false: decode sRGB on fetch (first pass only)
uniform vec2  u_texel;       // 1.0 / u_image size
uniform vec2  u_dir;         // (1,0): horizontal pass, (0,1): vertical pass

// From model.ts + render.ts, converted to pixels of this canvas:
uniform float u_neuralSigma;         // σ from acuity [px]
uniform float u_focusDepth;          // normalized depth value of the target plane
uniform float u_focusOffset;         // F(age) − 100/targetCm [D]; 0 once focus tracks
uniform float u_diopterScale;        // diopters per unit of normalized depth
uniform float u_defocusPxPerDiopter; // σ [px] per diopter of defocus

// Safety clamp: keeps pathological depth assumptions from producing
// hundred-pixel kernels; the largest honest value (newborn σ at a phone
// held at 35 cm) is ≈ 40 px.
const float MAX_SIGMA = 96.0;

// Combined (neural ⊕ defocus) blur σ at a point, in pixels.
float sigmaAt(vec2 uv) {
  float s = u_neuralSigma;
  if (u_hasDepth) {
    // Relative depth maps are affine in inverse depth, and diopters are
    // linear in inverse depth — so the map between them is affine once two
    // anchors are fixed (see ADR 0002). The infant's effective focus F(age)
    // enters as the constant offset u_focusOffset.
    float d = texture(u_depth, uv).r;
    float diopters = abs(u_focusOffset - u_diopterScale * (d - u_focusDepth));
    float defocusSigma = u_defocusPxPerDiopter * diopters;
    s = sqrt(s * s + defocusSigma * defocusSigma);
  }
  return min(s, MAX_SIGMA);
}

// IEC 61966-2-1 exact sRGB decode (not the pow(2.2) approximation).
vec3 srgbToLinear(vec3 c) {
  bvec3 low = lessThan(c, vec3(0.04045));
  vec3 lo = c / 12.92;
  vec3 hi = pow((c + 0.055) / 1.055, vec3(2.4));
  return mix(hi, lo, vec3(low));
}

vec3 fetchLinear(vec2 uv) {
  vec3 c = texture(u_image, uv).rgb;
  return u_linearInput ? c : srgbToLinear(c);
}

void main() {
  vec3 sum = vec3(0.0);
  float weightSum = 0.0;

  float centerSigma = sigmaAt(v_uv);
  for (int i = -12; i <= 12; i++) {
    float fi = float(i);
    float w = exp(-fi * fi / 32.0);           // exp(−(i·σ/4)²/(2σ²)), σ-free

    // Probe with the center σ, then refine with the σ found there.
    vec2 probe = v_uv + u_dir * u_texel * (fi * centerSigma / 4.0);
    float s = sigmaAt(probe);
    vec2 tap = v_uv + u_dir * u_texel * (fi * s / 4.0);

    sum += w * fetchLinear(tap);
    weightSum += w;
  }

  fragColor = vec4(sum / weightSum, 1.0);
}
