import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useTransform, MotionValue } from "motion/react";

/**
 * A physically-shaped black hole, ray-traced per pixel in a fragment shader.
 *
 * Each pixel is a light ray traced backwards from the camera through Schwarzschild spacetime
 * (u'' = -u + 3u^2, u = 1/r). The thin accretion disk is hit wherever that ray crosses the disk
 * plane, which is what produces the real signature: a small black shadow, a thin photon ring on
 * its edge, the far side of the disk bent up over the top (and a dimmer image underneath), and the
 * near side sweeping across the front. Doppler beaming makes one side much brighter.
 *
 * Falls back to a flat CSS version if WebGL is unavailable.
 */

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uIncl;
uniform float uExposure;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++){ s += a * vnoise(p); p = p * 2.03 + vec2(7.1, 3.7); a *= 0.5; }
  return s;
}
vec3 ramp(float x){
  vec3 c0 = vec3(0.16, 0.02, 0.0);
  vec3 c1 = vec3(0.95, 0.30, 0.04);
  vec3 c2 = vec3(1.0, 0.74, 0.40);
  vec3 c3 = vec3(1.0, 0.94, 0.86);
  vec3 c4 = vec3(0.80, 0.88, 1.0);
  vec3 c = mix(c0, c1, smoothstep(0.0, 0.45, x));
  c = mix(c, c2, smoothstep(0.45, 0.9, x));
  c = mix(c, c3, smoothstep(0.9, 1.3, x));
  return mix(c, c4, smoothstep(1.3, 1.9, x));
}

void main(){
  // screen position in units of M (gravitational radius); the view spans +-30 M horizontally
  float pxPerM = uRes.x * 0.5 / 30.0;
  vec2 s = (gl_FragCoord.xy - 0.5 * uRes) / pxPerM;
  float b = max(length(s), 1e-3);
  vec2 d = s / b;

  vec3 c = vec3(0.0, 0.0, 1.0);          // toward the camera
  vec3 e2 = vec3(d, 0.0);                // direction of this pixel's offset
  vec3 n = vec3(0.0, sin(uIncl), cos(uIncl)); // disk normal
  vec3 a1 = vec3(1.0, 0.0, 0.0);
  vec3 a2 = cross(n, a1);

  const float D = 100.0;
  float u0 = 1.0 / D;
  float u = u0;
  float du = sqrt(max(0.0, 1.0 / (b * b) - u0 * u0 * (1.0 - 2.0 * u0)));
  float psi = 0.0;
  const float h = 0.03;

  vec3 Pprev = D * c;
  float fPrev = dot(n, Pprev);
  vec3 col = vec3(0.0);
  float captured = 0.0;
  float done = 0.0;

  for (int i = 0; i < 300; i++){
    float acc = -u + 3.0 * u * u;
    du += acc * h;
    u += du * h;
    psi += h;
    if (u > 0.5){ captured = 1.0; done = 1.0; break; }
    if (u < u0 && du < 0.0){ done = 1.0; break; }
    float r = 1.0 / u;
    vec3 P = r * (cos(psi) * c + sin(psi) * e2);
    float f = dot(n, P);
    if (f * fPrev < 0.0){
      float t = fPrev / (fPrev - f);
      vec3 Pc = mix(Pprev, P, t);
      float rc = length(Pc);
      if (rc > 5.9 && rc < 26.0){
        vec3 w = normalize(Pprev - P);                 // light travels toward the camera
        vec3 vhat = normalize(cross(n, Pc));           // orbital direction
        float beta = 0.8 * min(0.7, 1.0 / sqrt(max(rc - 2.0, 0.5)));
        float gam = 1.0 / sqrt(1.0 - beta * beta);
        float g = sqrt(max(0.0, 1.0 - 2.0 / rc)) / (gam * (1.0 - beta * dot(vhat, w)));
        // differential rotation: inner gas outruns the outer gas
        float ang = uTime * 0.55 * pow(6.0 / rc, 1.5);
        vec2 q = vec2(dot(Pc, a1), dot(Pc, a2));
        q = mat2(cos(ang), sin(ang), -sin(ang), cos(ang)) * q;
        float tex = 0.35 + 1.15 * fbm(q * 0.55);
        tex *= 0.88 + 0.12 * sin(rc * 8.0);
        float emis = pow(6.0 / rc, 2.2) * smoothstep(5.9, 6.9, rc) * (1.0 - smoothstep(12.0, 26.0, rc));
        float T = pow(6.0 / rc, 0.75) * g;
        col += ramp(T) * emis * tex * pow(g, 2.0) * 2.6;
      }
    }
    fPrev = f;
    Pprev = P;
  }

  // thin photon ring hugging the shadow edge (circular, like the real one)
  float ring = exp(-pow((b - 5.28) / 0.13, 2.0));
  col += vec3(1.0, 0.86, 0.66) * ring * 0.95;

  col = 1.0 - exp(-col * uExposure);
  float a = clamp(max(max(col.r, col.g), col.b), 0.0, 1.0);
  if (captured > 0.5) a = 1.0;   // the shadow is truly black, and hides whatever is behind it
  gl_FragColor = vec4(col, a);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn("black hole shader:", gl.getShaderInfoLog(sh));
    return null;
  }
  return sh;
}

/** Shader-driven canvas. Returns false from `ok` if WebGL isn't available. */
function HoleCanvas({
  opacity,
  onFail,
}: {
  opacity: MotionValue<number>;
  onFail: () => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) {
      onFail();
      return;
    }
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      onFail();
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      onFail();
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uIncl = gl.getUniformLocation(prog, "uIncl");
    const uExp = gl.getUniformLocation(prog, "uExposure");
    gl.clearColor(0, 0, 0, 0);

    // adaptive resolution: if frames get slow (weak GPU), render fewer pixels and let CSS scale up
    let quality = (window as unknown as { __bhQuality?: number }).__bhQuality ?? 1;
    let lastNow = 0;
    let slow = 0;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (w > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    let raf = 0;
    let t0 = performance.now();
    let running = false;
    const draw = (now: number) => {
      raf = 0;
      if (!running) return;
      if (lastNow) {
        const dt = now - lastNow;
        slow = dt > 45 ? slow + 1 : Math.max(0, slow - 1);
        if (slow >= 3 && quality > 0.3) {
          quality = Math.max(0.3, quality * 0.75);
          slow = 0;
        }
      }
      lastNow = now;
      size();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.uniform1f(uIncl, (84 * Math.PI) / 180);
      gl.uniform1f(uExp, 1.5);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(draw);
    };
    const setRunning = (on: boolean) => {
      if (on && !running) {
        running = true;
        lastNow = 0;
        t0 = performance.now();
        raf = requestAnimationFrame(draw);
      } else if (!on && running) {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    setRunning(opacity.get() > 0.01);
    const un = opacity.on("change", (v) => setRunning(v > 0.01));
    return () => {
      un();
      setRunning(false);
    };
  }, [opacity, onFail]);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full"
      style={{ transform: "rotate(-9deg)" }}
    />
  );
}

/** Flat CSS stand-in used only when WebGL is missing. */
function CssHole() {
  return (
    <>
      <div
        className="absolute rounded-full"
        style={{
          left: "50%",
          top: "50%",
          width: 700,
          height: 120,
          margin: "-60px -350px",
          background:
            "radial-gradient(ellipse closest-side, rgba(255,230,190,0.95), rgba(255,140,60,0.5) 45%, transparent 100%)",
          filter: "blur(3px)",
          transform: "rotate(-9deg)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          left: "50%",
          top: "50%",
          width: 200,
          height: 200,
          margin: -100,
          background: "#000",
          boxShadow: "0 0 0 2px rgba(255,238,216,0.9), 0 0 40px 8px rgba(255,150,70,0.45)",
        }}
      />
    </>
  );
}

export default function BlackHole({
  x,
  y,
  scale,
  opacity,
}: {
  x: number;
  y: number;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
}) {
  const transform = useTransform(scale, (s) => `translate(-50%, -50%) scale(${s.toFixed(4)})`);
  const [fallback, setFallback] = useState(false);
  const fail = useCallback(() => setFallback(true), []);
  const [w, setW] = useState(1200);

  useEffect(() => {
    const f = () => setW(Math.round(Math.min(1200, Math.max(460, window.innerWidth))));
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  const h = Math.round(w * 0.5);

  return (
    <motion.div
      aria-hidden="true"
      className="absolute pointer-events-none will-change-transform"
      style={{ left: `${x}%`, top: `${y}%`, width: w, height: h, transform, opacity }}
    >
      {/* soft warm bloom behind the lensed light */}
      <div
        className="absolute"
        style={{
          left: "50%",
          top: "50%",
          width: "92%",
          height: "92%",
          transform: "translate(-50%, -50%) rotate(-9deg)",
          background:
            "radial-gradient(ellipse closest-side, rgba(255,165,80,0.22), rgba(255,120,50,0.07) 55%, transparent 100%)",
        }}
      />
      {fallback ? <CssHole /> : <HoleCanvas opacity={opacity} onFail={fail} />}
    </motion.div>
  );
}
