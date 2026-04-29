'use client';

import { useRef, useEffect, useCallback, useState } from 'react';

/**
 * Dramatic background animations for non-Hero sections.
 * Each variant gives a distinct visual identity:
 *   - 'grid'    → flowing holographic grid lines
 *   - 'bokeh'   → large soft glowing orbs drifting
 *   - 'circuit' → circuit-board traces with moving pulses
 *   - 'waves'   → sine-wave ribbons flowing horizontally
 *   - 'hexgrid' → hexagonal mesh with glow nodes
 */
type Variant = 'grid' | 'bokeh' | 'circuit' | 'waves' | 'hexgrid';

interface Props {
  variant: Variant;
  color?: string;
  opacity?: number;
}

export default function SectionBg({ variant, color = '#22d3ee', opacity = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  const hexToRgb = useCallback((hex: string) => {
    const c = hex.replace('#', '');
    return {
      r: parseInt(c.substring(0, 2), 16),
      g: parseInt(c.substring(2, 4), 16),
      b: parseInt(c.substring(4, 6), 16),
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const rgb = hexToRgb(color);
    let time = 0;

    // ═══════ GRID — flowing perspective grid ═══════
    const drawGrid = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const spacing = 60;
      const cols = Math.ceil(w / spacing) + 2;
      const rows = Math.ceil(h / spacing) + 2;

      // Horizontal lines with wave
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 4) {
          const baseY = r * spacing;
          const wave = Math.sin((x * 0.008) + time * 0.6 + r * 0.5) * 8;
          const y = baseY + wave;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const fadeY = Math.abs((r * spacing / h) - 0.5) * 2;
        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${0.06 * (1 - fadeY * 0.6)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Vertical lines with wave
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let y = 0; y <= h; y += 4) {
          const baseX = c * spacing;
          const wave = Math.sin((y * 0.006) + time * 0.4 + c * 0.7) * 6;
          const x = baseX + wave;
          if (y === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const fadeX = Math.abs((c * spacing / w) - 0.5) * 2;
        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${0.05 * (1 - fadeX * 0.5)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // Intersection glow nodes
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const pulse = Math.sin(time * 0.8 + r * 1.2 + c * 0.9) * 0.5 + 0.5;
          if (pulse > 0.7) {
            const x = c * spacing + Math.sin((r * spacing * 0.006) + time * 0.4 + c * 0.7) * 6;
            const y = r * spacing + Math.sin((x * 0.008) + time * 0.6 + r * 0.5) * 8;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${0.25 * pulse})`;
            ctx.fill();
          }
        }
      }
    };

    // ═══════ BOKEH — large soft glowing orbs ═══════
    const orbs = Array.from({ length: 8 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 120 + 60,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.15,
      phase: Math.random() * Math.PI * 2,
    }));

    const drawBokeh = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      for (const orb of orbs) {
        orb.x += orb.vx * 0.001;
        orb.y += orb.vy * 0.001;
        if (orb.x < -0.1) orb.x = 1.1;
        if (orb.x > 1.1) orb.x = -0.1;
        if (orb.y < -0.1) orb.y = 1.1;
        if (orb.y > 1.1) orb.y = -0.1;

        const pulse = Math.sin(time * 0.3 + orb.phase) * 0.3 + 0.7;
        const px = orb.x * w;
        const py = orb.y * h;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, orb.r * pulse);
        grad.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${0.08 * pulse})`);
        grad.addColorStop(0.5, `rgba(${rgb.r},${rgb.g},${rgb.b},${0.03 * pulse})`);
        grad.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
        ctx.beginPath();
        ctx.arc(px, py, orb.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    };

    // ═══════ CIRCUIT — circuit board traces ═══════
    const traces: { points: { x: number; y: number }[]; pulse: number; speed: number }[] = [];
    const initCircuit = () => {
      traces.length = 0;
      const w = canvas.width, h = canvas.height;
      for (let i = 0; i < 12; i++) {
        const pts: { x: number; y: number }[] = [];
        let cx = Math.random() * w, cy = Math.random() * h;
        const segs = Math.floor(Math.random() * 6) + 4;
        pts.push({ x: cx, y: cy });
        for (let s = 0; s < segs; s++) {
          const dir = Math.random() > 0.5;
          const len = Math.random() * 100 + 40;
          if (dir) cx += (Math.random() > 0.5 ? 1 : -1) * len;
          else cy += (Math.random() > 0.5 ? 1 : -1) * len;
          cx = Math.max(0, Math.min(w, cx));
          cy = Math.max(0, Math.min(h, cy));
          pts.push({ x: cx, y: cy });
        }
        traces.push({ points: pts, pulse: Math.random(), speed: Math.random() * 0.3 + 0.1 });
      }
    };
    if (variant === 'circuit') initCircuit();

    const drawCircuit = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      for (const trace of traces) {
        // Draw trace line
        ctx.beginPath();
        trace.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.06)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw nodes
        for (const p of trace.points) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.15)`;
          ctx.fill();
        }

        // Animate pulse
        trace.pulse = (trace.pulse + trace.speed * 0.01) % 1;
        const totalPts = trace.points.length - 1;
        const seg = Math.floor(trace.pulse * totalPts);
        const t = (trace.pulse * totalPts) - seg;
        if (seg < totalPts) {
          const px = trace.points[seg].x + (trace.points[seg + 1].x - trace.points[seg].x) * t;
          const py = trace.points[seg].y + (trace.points[seg + 1].y - trace.points[seg].y) * t;
          const glow = ctx.createRadialGradient(px, py, 0, px, py, 12);
          glow.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},0.5)`);
          glow.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
          ctx.beginPath();
          ctx.arc(px, py, 12, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.8)`;
          ctx.fill();
        }
      }
    };

    // ═══════ WAVES — flowing sine ribbons ═══════
    const drawWaves = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const ribbons = 5;

      for (let r = 0; r < ribbons; r++) {
        ctx.beginPath();
        const baseY = h * (0.2 + r * 0.15);
        const amp = 30 + r * 10;
        const freq = 0.003 + r * 0.001;
        const phase = time * (0.2 + r * 0.08) + r * 1.5;

        for (let x = 0; x <= w; x += 3) {
          const y = baseY + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 2.5 + phase * 1.3) * (amp * 0.3);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${0.06 - r * 0.008})`;
        ctx.lineWidth = 1.5 - r * 0.2;
        ctx.stroke();

        // Glow version
        ctx.beginPath();
        for (let x = 0; x <= w; x += 3) {
          const y = baseY + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 2.5 + phase * 1.3) * (amp * 0.3);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${0.02})`;
        ctx.lineWidth = 6;
        ctx.stroke();
      }
    };

    // ═══════ HEXGRID — hexagonal mesh ═══════
    const drawHexgrid = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const size = 40;
      const hexH = size * Math.sqrt(3);
      const cols = Math.ceil(w / (size * 1.5)) + 2;
      const rows = Math.ceil(h / hexH) + 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = c * size * 1.5;
          const cy = r * hexH + (c % 2 === 1 ? hexH / 2 : 0);
          const dist = Math.hypot(cx - w / 2, cy - h / 2) / Math.max(w, h);
          const pulse = Math.sin(time * 0.5 + c * 0.3 + r * 0.4) * 0.5 + 0.5;
          const alpha = 0.04 * (1 - dist * 0.8) * (0.5 + pulse * 0.5);

          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const px = cx + size * 0.6 * Math.cos(angle);
            const py = cy + size * 0.6 * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();

          // Bright node on high-pulse hexes
          if (pulse > 0.85) {
            ctx.beginPath();
            ctx.arc(cx, cy, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${0.4 * pulse})`;
            ctx.fill();
          }
        }
      }
    };

    const drawFns: Record<Variant, () => void> = {
      grid: drawGrid,
      bokeh: drawBokeh,
      circuit: drawCircuit,
      waves: drawWaves,
      hexgrid: drawHexgrid,
    };

    let lastFrame = 0;
    const FRAME_INTERVAL = 1000 / 30; // Cap at 30fps
    const animate = (now: number) => {
      animRef.current = requestAnimationFrame(animate);
      const delta = now - lastFrame;
      if (delta < FRAME_INTERVAL) return;
      lastFrame = now - (delta % FRAME_INTERVAL);
      time += 0.016;
      drawFns[variant]();
    };
    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [variant, color, hexToRgb, isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 w-full h-full"
      style={{ zIndex: 0, opacity }}
    />
  );
}
