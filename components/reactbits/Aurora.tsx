"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Color, Triangle } from "ogl";

interface AuroraProps {
  colorStops?: [string, string, string];
  amplitude?: number;
  blend?: number;
  speed?: number;
  className?: string;
}

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uTime;
uniform float uAmplitude;
uniform float uBlend;
uniform float uSpeed;

out vec4 fragColor;

// Simplex noise / Perlin hash
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,
                      0.366025403784439,
                     -0.577350269189626,
                      0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
        + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float time = uTime * uSpeed * 0.5;

  // Layered wavy displacement
  float n1 = snoise(vec2(uv.x * 1.8 + time * 0.3, uv.y * 0.8));
  float n2 = snoise(vec2(uv.x * 3.2 - time * 0.2, uv.y * 1.5 + n1 * uAmplitude));
  float n3 = snoise(vec2(uv.x * 0.9 + time * 0.1, uv.y * 2.2 + n2 * 0.5));

  float wave = (n1 + n2 * 0.5 + n3 * 0.25) / 1.75;
  float yGradient = smoothstep(0.0, 0.85, uv.y + wave * 0.25 * uAmplitude);

  // Gradient mixing across color stops
  vec3 col1 = uColorStops[0];
  vec3 col2 = uColorStops[1];
  vec3 col3 = uColorStops[2];

  vec3 colorA = mix(col1, col2, smoothstep(0.1, 0.5, yGradient));
  vec3 finalColor = mix(colorA, col3, smoothstep(0.4, 0.9, yGradient));

  // Vignette & atmospheric depth
  float alpha = smoothstep(0.05, 0.6, yGradient) * uBlend;
  alpha *= smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.7, uv.y);

  fragColor = vec4(finalColor, alpha);
}
`;

export default function Aurora({
  colorStops = ["#4338ca", "#6366f1", "#06b6d4"],
  amplitude = 1.2,
  blend = 0.65,
  speed = 0.8,
  className = "",
}: AuroraProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer | null = null;
    let animationFrameId: number;

    try {
      renderer = new Renderer({
        alpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio, 2),
      });

      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);

      const canvas = gl.canvas as HTMLCanvasElement;
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.pointerEvents = "none";

      container.appendChild(canvas);

      const geometry = new Triangle(gl);

      const parseColor = (hex: string) => {
        const c = new Color(hex);
        return [c.r, c.g, c.b];
      };

      const c1 = parseColor(colorStops[0]);
      const c2 = parseColor(colorStops[1]);
      const c3 = parseColor(colorStops[2]);

      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uColorStops: { value: [...c1, ...c2, ...c3] },
          uResolution: { value: [container.clientWidth, container.clientHeight] },
          uTime: { value: 0 },
          uAmplitude: { value: amplitude },
          uBlend: { value: blend },
          uSpeed: { value: speed },
        },
        transparent: true,
      });

      const mesh = new Mesh(gl, { geometry, program });

      const resize = () => {
        if (!container || !renderer) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        program.uniforms.uResolution.value = [width, height];
      };

      window.addEventListener("resize", resize);
      resize();

      let startTime = performance.now();

      const update = (now: number) => {
        const elapsed = (now - startTime) * 0.001;
        program.uniforms.uTime.value = elapsed;
        renderer?.render({ scene: mesh });
        animationFrameId = requestAnimationFrame(update);
      };

      animationFrameId = requestAnimationFrame(update);

      return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animationFrameId);
        if (canvas && container.contains(canvas)) {
          container.removeChild(canvas);
        }
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    } catch (err) {
      console.warn("WebGL Aurora not supported, falling back to CSS aurora:", err);
    }
  }, [colorStops, amplitude, blend, speed]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    />
  );
}
