#version 300 es
precision highp float;

// ---------------------------------------------------------------------------
// Baby Vision Simulator — combine pass.
//
// Input: the linear-light, already-blurred image (blur.frag, pass 2).
// Applies the two remaining, non-spatial effects and encodes sRGB out:
//
//   1. CONTRAST. The baby's contrast threshold is T_infant(age) vs the
//      adult T_adult (Norcia 1990; Brown 2018). We attenuate luminance
//      modulation around the frame's mean luminance by
//      gain = (T_adult / T_infant)^0.5 — a deliberately compressive map
//      (documented in ADR 0001): a linear map would render week 0 as
//      featureless fog, this exponent is a visualization choice, not an estimated
//      suprathreshold appearance curve.
//
//      Mean luminance is measured per frame on the host from the source
//      mipmap — no magic constant.
//
//   2. COLOR, in an invertible opponent basis (the physiology: the red–green
//      (L−M) mechanism matures first, blue–yellow (S) several weeks later —
//      Adams 1994, Varner 1985, Skelton 2022; gains from model.ts):
//
//         y = (r + 2g + b) / 4   luminance-ish
//         v = r − g              red–green   (≈ L−M)
//         u = b − y              blue–yellow (≈ S)
//
//      Inverse:  g = y − (v+u)/3;  r = g + v;  b = y + u.
//
//      v is scaled by the red–green gain, u by the blue–yellow gain, and
//      both by a global saturation multiplier (saturation thresholds stay
//      immature well past the first year — Skelton 2022).
//
// Setting all gains to 1 (and skipping the blur passes) is the "compare"
// view: this shader then round-trips sRGB→linear→sRGB, i.e. a passthrough.
// ---------------------------------------------------------------------------

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_image;   // linear-light blurred RGB
uniform float u_meanLuma;    // frame mean luminance (linear), from host
uniform float u_contrastGain;
uniform float u_rgGain;      // red–green channel gain, 0..1
uniform float u_byGain;      // blue–yellow channel gain, 0..1
uniform float u_saturation;  // global saturation multiplier, 0..1

// IEC 61966-2-1 exact sRGB encode (not the pow(1/2.2) approximation).
vec3 linearToSrgb(vec3 c) {
  bvec3 low = lessThan(c, vec3(0.0031308));
  vec3 lo = c * 12.92;
  vec3 hi = 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055;
  return clamp(mix(hi, lo, vec3(low)), 0.0, 1.0);
}

void main() {
  vec3 lin = texture(u_image, v_uv).rgb;

  // To opponent space.
  float y = (lin.r + 2.0 * lin.g + lin.b) * 0.25;
  float v = lin.r - lin.g;   // red–green
  float u = lin.b - y;       // blue–yellow

  // Contrast: squeeze luminance modulation around the frame mean.
  y = u_meanLuma + (y - u_meanLuma) * u_contrastGain;

  // Color: opponent gains × residual saturation deficit.
  v *= u_rgGain * u_saturation;
  u *= u_byGain * u_saturation;

  // Back to RGB (inverse documented in the header) and out.
  float g = y - (v + u) / 3.0;
  float r = g + v;
  float b = y + u;

  fragColor = vec4(linearToSrgb(vec3(r, g, b)), 1.0);
}
