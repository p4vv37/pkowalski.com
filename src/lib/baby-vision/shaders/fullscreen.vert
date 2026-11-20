#version 300 es
// ---------------------------------------------------------------------------
// Baby Vision Simulator — fullscreen vertex shader.
//
// A single triangle that covers the whole viewport (no vertex buffers):
//   gl_VertexID 0 → clip (-1,-1), uv (0,0)
//   gl_VertexID 1 → clip ( 3,-1), uv (2,0)
//   gl_VertexID 2 → clip (-1, 3), uv (0,2)
// Fragments outside the viewport are clipped away, so inside the viewport
// v_uv spans exactly [0,1]².
// ---------------------------------------------------------------------------

out vec2 v_uv;

void main() {
  vec2 uv = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  v_uv = uv;
  gl_Position = vec4(uv * 2.0 - 1.0, 0.0, 1.0);
}
