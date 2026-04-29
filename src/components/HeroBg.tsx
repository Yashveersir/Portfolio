'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  // Fullscreen quad
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uClickTime;
uniform float uTheme; // 0 for dark, 1 for light

varying vec2 vUv;

// --- Simplex Noise 3D ---
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0);
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// Fractal Brownian Motion
float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 3; i++) {
    value += amplitude * snoise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  // Normalize coordinates and fix aspect ratio
  vec2 uv = (vUv - 0.5) * 2.0;
  float aspect = uResolution.x / uResolution.y;
  uv.x *= aspect;

  // Mouse coords mapped properly
  vec2 m = (uMouse - 0.5) * 2.0;
  m.x *= aspect;
  m.y = -m.y; // flip Y for mouse

  // Core configuration
  vec2 center = vec2(0.5, 0.0); // Offset to the right
  float baseRadius = 0.55;
  
  // Time variations (very calm and slow)
  float t = uTime * 0.3;
  
  // Magnetic Pull to Mouse (softened)
  float distToMouse = length(uv - m);
  float pullForce = exp(-distToMouse * 2.5) * 0.08;
  vec2 uvPulled = uv + (m - uv) * pullForce;
  
  // Distance to core
  vec2 dirToCenter = uvPulled - center;
  float distToCenter = length(dirToCenter);
  float angle = atan(dirToCenter.y, dirToCenter.x);

  // Glitch Effect (Very rare, subtle scanline distortion)
  float glitchLine = step(0.995, fract(sin(uTime * 43.0) * 43758.5453));
  float glitchDisp = glitchLine * sin(uv.y * 20.0 + t) * 0.02;
  uvPulled.x += glitchDisp;

  // --- Core Shape & Internal Flow ---
  // Rhythmic pulse (smooth breathing)
  float pulse = pow(sin(t * 1.2) * 0.5 + 0.5, 3.0) * 0.03;
  
  // Surface noise (flowing energy)
  float surfaceNoise = fbm(vec3(dirToCenter * 3.0, t * 0.8)) * 0.15;
  float currentRadius = baseRadius + pulse + surfaceNoise;
  
  float coreSDF = distToCenter - currentRadius;

  // Colors
  vec3 darkBg = vec3(0.01, 0.02, 0.05);
  vec3 lightBg = vec3(0.97, 0.98, 0.99);
  vec3 cBlack = mix(darkBg, lightBg, uTheme);

  vec3 darkCyan = vec3(0.05, 0.7, 0.9);
  vec3 lightCyan = vec3(0.0, 0.5, 0.7);
  vec3 cCyan = mix(darkCyan, lightCyan, uTheme);

  vec3 darkPurple = vec3(0.3, 0.1, 0.7);
  vec3 lightPurple = vec3(0.5, 0.3, 0.8);
  vec3 cPurple = mix(darkPurple, lightPurple, uTheme);

  vec3 darkWhite = vec3(0.85, 0.9, 1.0);
  vec3 lightWhite = vec3(0.1, 0.15, 0.2); // Core is darker in light mode for contrast
  vec3 cWhite = mix(darkWhite, lightWhite, uTheme);

  vec3 finalColor = cBlack;

  // Inside the core
  if (coreSDF <= 0.0) {
    // Inner swirl
    float innerNoise = fbm(vec3(uvPulled * 4.0 - dirToCenter * t * 0.2, t * 1.2));
    float heat = smoothstep(-0.2, 0.8, innerNoise);
    
    // Mix purple to cyan to white based on heat & depth
    vec3 coreColor = mix(cPurple, cCyan, heat);
    coreColor = mix(coreColor, cWhite, smoothstep(0.5, 1.0, heat + pulse*2.0));
    
    // Darken towards edges
    float edgeDarken = smoothstep(-0.15, 0.0, coreSDF);
    finalColor = mix(coreColor, cBlack, edgeDarken * 0.8);
  } else {
    // Outside the core (Aura, waves, data lines)
    
    // Massive bloom/glow
    float glow = exp(-coreSDF * 3.5);
    vec3 aura = mix(cPurple, cCyan, exp(-coreSDF * 1.5)) * glow * 1.2;
    
    // Abstract energy waves moving outward
    float wave = fbm(vec3(dirToCenter * 2.0, t * -0.5));
    float waveLines = sin(distToCenter * 20.0 - t * 4.0 + wave * 5.0) * 0.5 + 0.5;
    waveLines = pow(waveLines, 8.0) * exp(-coreSDF * 2.0) * 0.3;
    
    // Data Shards / Rays
    float rayNoise = fbm(vec3(cos(angle)*5.0, sin(angle)*5.0, t * -0.3));
    float rays = smoothstep(0.6, 0.8, rayNoise) * exp(-coreSDF * 1.2);
    
    // Magnetic bending effect visually
    float magGlow = pullForce * exp(-coreSDF * 2.0);

    finalColor += aura;
    finalColor += cCyan * waveLines;
    finalColor += cPurple * rays;
    finalColor += cCyan * magGlow * 2.0;
  }

  // --- Click Shockwave ---
  // uClickTime represents time since last click. >1 means inactive.
  if (uClickTime < 1.0) {
    float swRadius = baseRadius + uClickTime * 3.0;
    float swThickness = 0.08 * (1.0 - uClickTime);
    float swDist = abs(distToCenter - swRadius);
    float swIntensity = smoothstep(swThickness, 0.0, swDist) * (1.0 - uClickTime);
    
    finalColor += cWhite * swIntensity * 0.6;
    
    // Core flashes white
    if (coreSDF <= 0.0) {
      finalColor = mix(finalColor, cWhite, (1.0 - uClickTime) * exp(-uClickTime * 5.0) * 0.4);
    }
  }

  // High contrast & Vignette
  finalColor = pow(finalColor, vec3(mix(1.2, 0.9, uTheme))); // Less contrast in light mode
  float vignette = smoothstep(2.5, 0.2, length(uv));
  finalColor = mix(finalColor * vignette, finalColor, uTheme * 0.5); // Softer vignette in light mode

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

function WebGLBackground({ isVisible, theme }: { isVisible: boolean; theme: 'dark' | 'light' }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const mouse = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });
  const clickTime = useRef(999.0); // Time since last click

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uClickTime: { value: 999.0 },
      uTheme: { value: theme === 'light' ? 1.0 : 0.0 },
    }),
    [size, theme]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.tx = e.clientX / window.innerWidth;
      mouse.current.ty = e.clientY / window.innerHeight;
    };
    const handleClick = () => {
      clickTime.current = 0.0;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  useFrame((state, delta) => {
    if (!materialRef.current || !isVisible) return;

    // Smooth mouse interpolation
    mouse.current.x += (mouse.current.tx - mouse.current.x) * 3.0 * delta;
    mouse.current.y += (mouse.current.ty - mouse.current.y) * 3.0 * delta;

    // Advance click time
    if (clickTime.current < 2.0) {
      clickTime.current += delta * 1.5; // Controls shockwave expansion speed
    }

    const unifs = materialRef.current.uniforms;
    unifs.uTime.value = state.clock.elapsedTime;
    unifs.uMouse.value.set(mouse.current.x, mouse.current.y);
    unifs.uClickTime.value = clickTime.current;
  });

  return (
    <mesh>
      {/* A plane that fills the screen in clip space */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export default function HeroBg() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    setMounted(true);
    
    // Check initial theme
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' || 'dark';
    setTheme(currentTheme);

    // Observe theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' || 'dark';
          setTheme(newTheme);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    
    if (!containerRef.current) return;
    
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.01 }
    );
    
    intersectionObserver.observe(containerRef.current);
    return () => {
      observer.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 w-full h-full bg-theme" style={{ background: 'var(--bg)' }} suppressHydrationWarning />;
  }

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none" 
      style={{ zIndex: 0 }} 
      suppressHydrationWarning
    >
      {/* Orthographic camera is perfect for a full-screen quad shader */}
      <Canvas orthographic camera={{ position: [0, 0, 1], left: -1, right: 1, top: 1, bottom: -1 }}>
        <WebGLBackground isVisible={isVisible} theme={theme} />
      </Canvas>
    </div>
  );
}
