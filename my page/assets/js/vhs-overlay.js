import { VFX } from "https://esm.sh/@vfx-js/core@0.8.0";

const shader = `
precision highp float;
uniform vec2 resolution;
uniform float time;
out vec4 outColor;

float rand(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  float n = rand(uv * time * 60.0);

  // --- Puntitos RGB más tenues (evitar blanco total) ---
  vec3 rgb = vec3(
    step(0.66, n) * 0.6,   // rojo más suave
    step(0.33, n) * (1.0 - step(0.66, n)) * 0.6, // verde suave
    (1.0 - step(0.33, n)) * 0.6 // azul suave
  );

  // --- Scanlines oscuros ---
  float scan = 0.5 + 0.5 * sin(uv.y * resolution.y * 1.2);

  // --- Flicker (parpadeo leve) ---
  float flick = 0.9 + 0.1 * sin(time * 50.0);

  // --- Aberración cromática leve ---
  float offset = 0.0015 * sin(time * 2.0);
  vec3 chroma = vec3(
    rgb.r,
    rgb.g * (1.0 - offset),
    rgb.b * (1.0 + offset)
  );

  // --- Color final más oscuro ---
  vec3 color = chroma * scan * flick * 0.5; 

  // Transparencia de la overlay:
  // 👉 ajusta este valor (0.12 = muy sutil, 0.25 = más fuerte)
  outColor = vec4(color, 0.12);
}
`;

const vfx = new VFX({ 
  scrollPadding: false,
  overlay: true, 
  postEffect: { shader } 
});

window.addEventListener("load", () => {
  vfx.add(document.body, { overlay: true });
});
