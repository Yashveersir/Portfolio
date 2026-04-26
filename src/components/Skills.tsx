'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { skillCategories } from '@/lib/constants';

// 3D tilt card with glassmorphism
function BentoCell({
  children,
  color,
  className = '',
  rotate = 0,
  animFrom = 'bottom',
  delay = 0,
}: {
  children: React.ReactNode;
  color: string;
  className?: string;
  rotate?: number;
  animFrom?: 'left' | 'bottom' | 'scale';
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 250, damping: 28 });
  const sy = useSpring(my, { stiffness: 250, damping: 28 });
  const rotX = useTransform(sy, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotY = useTransform(sx, [-0.5, 0.5], ['-8deg', '8deg']);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const initAnim =
    animFrom === 'left'
      ? { x: -50, opacity: 0 }
      : animFrom === 'scale'
      ? { scale: 0.8, opacity: 0 }
      : { y: 50, opacity: 0 };

  const borderStyle = { borderTop: `1.5px solid ${color}30` } as React.CSSProperties;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', rotate, ...borderStyle }}
      initial={initAnim}
      animate={isInView ? { x: 0, y: 0, scale: 1, opacity: 1 } : initAnim}
      transition={{ type: 'spring' as const, stiffness: 100, damping: 18, delay }}
      className={`relative border border-white/6 bg-[#0a0a14]/80 backdrop-blur-xl overflow-hidden group ${className}`}
    >
      {/* Color glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 0%, ${color}12, transparent 60%)` }}
      />
      {/* Content at z30 for 3D depth */}
      <div className="relative z-10 h-full" style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </motion.div>
  );
}

function CoreSystemBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', resize);
    resize();

    let frameId: number;
    let time = 0;

    // Orbiting data particles on 3 rings — dual-color
    const RING_RADII = [180, 270, 360];
    const orbiters = RING_RADII.flatMap((r, ri) =>
      Array.from({ length: 8 + ri * 4 }, (_, i) => ({
        angle: (i / (8 + ri * 4)) * Math.PI * 2,
        speed: (0.007 - ri * 0.0015) * (i % 2 === 0 ? 1 : -1),
        radius: r,
        size: 2 - ri * 0.2,
        alpha: 0.75 - ri * 0.1,
        isCyan: i % 3 !== 0, // 2/3 cyan, 1/3 violet
      }))
    );

    // Star-field background
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random(), y: Math.random(),
      s: Math.random() * 1 + 0.3,
      a: Math.random() * 0.25 + 0.05,
      phase: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      time += 0.005;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, w, h);

      // Core center — offset by mouse for parallax
      const cx = w * 0.82 + mx * -40;
      const cy = h * 0.5 + my * -30;

      ctx.save();
      ctx.translate(cx, cy);
      // Slight perspective tilt based on mouse
      ctx.transform(1, my * 0.04, mx * 0.04, 1, 0, 0);

      const pulse = Math.sin(time * 2) * 0.5 + 0.5;

      // ── Background concentric rings ──
      for (let i = 1; i <= 6; i++) {
        ctx.strokeStyle = `rgba(34,211,238,${0.025 + (i === 3 ? 0.02 : 0)})`;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(0, 0, i * 100, 0, Math.PI * 2); ctx.stroke();
      }

      // ── Main tech rings ──
      // Inner — violet dashes, slow CW
      ctx.save(); ctx.rotate(time * 0.22);
      ctx.strokeStyle = `rgba(124,111,255,${0.35 + pulse * 0.15})`;
      ctx.lineWidth = 1.5; ctx.setLineDash([6, 14, 40, 14]);
      ctx.beginPath(); ctx.arc(0, 0, 180, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      // Middle — cyan dashes, slow CCW
      ctx.save(); ctx.rotate(-time * 0.14);
      ctx.strokeStyle = `rgba(34,211,238,${0.4 + pulse * 0.1})`;
      ctx.lineWidth = 1.2; ctx.setLineDash([90, 45, 3, 10, 3, 10]);
      ctx.beginPath(); ctx.arc(0, 0, 270, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      // Outer — thin cyan, very slow CW
      ctx.save(); ctx.rotate(time * 0.08);
      ctx.strokeStyle = `rgba(34,211,238,0.12)`;
      ctx.lineWidth = 1.8; ctx.setLineDash([200, 120]);
      ctx.beginPath(); ctx.arc(0, 0, 360, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      ctx.setLineDash([]);

      // ── Radial spokes ──
      ctx.strokeStyle = `rgba(124,111,255,0.06)`;
      ctx.lineWidth = 0.8;
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2 + time * 0.04;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * 80, Math.sin(angle) * 80);
        ctx.lineTo(Math.cos(angle) * 500, Math.sin(angle) * 500);
        ctx.stroke();
      }

      // ── Multi-ring pulse emission ──
      for (let wave = 0; wave < 3; wave++) {
        const wt = ((time + wave * 0.66) % 2);
        const pulseR = wt * 420;
        const pulseAlpha = Math.max(0, 0.35 - wt * 0.18);
        const wColor = wave === 1 ? `rgba(124,111,255,${pulseAlpha})` : `rgba(34,211,238,${pulseAlpha})`;
        ctx.strokeStyle = wColor;
        ctx.lineWidth = 2 - wt * 1.2;
        ctx.beginPath(); ctx.arc(0, 0, pulseR, 0, Math.PI * 2); ctx.stroke();
      }

      // ── Orbiting data particles — dual-color with halos ──
      orbiters.forEach((o) => {
        o.angle += o.speed;
        const px = Math.cos(o.angle) * o.radius;
        const py = Math.sin(o.angle) * o.radius;
        const col = (o as typeof o & { isCyan: boolean }).isCyan ? '34,211,238' : '124,111,255';
        // Halo
        const halo = ctx.createRadialGradient(px, py, 0, px, py, 7);
        halo.addColorStop(0, `rgba(${col},${o.alpha * 0.5})`);
        halo.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = halo;
        ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fill();
        // Core dot
        ctx.fillStyle = `rgba(${col},${o.alpha})`;
        ctx.beginPath(); ctx.arc(px, py, o.size, 0, Math.PI * 2); ctx.fill();
      });

      // ── Inner core glow — dual layer ──
      const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 70);
      coreGrad.addColorStop(0, `rgba(200,180,255,${0.55 + pulse * 0.2})`);
      coreGrad.addColorStop(0.4, `rgba(124,111,255,${0.25 + pulse * 0.1})`);
      coreGrad.addColorStop(1, 'rgba(124,111,255,0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath(); ctx.arc(0, 0, 70, 0, Math.PI * 2); ctx.fill();

      // Bright center pinpoint
      const pin = ctx.createRadialGradient(0, 0, 0, 0, 0, 12);
      pin.addColorStop(0, `rgba(255,255,255,${0.6 + pulse * 0.3})`);
      pin.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = pin;
      ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill();

      ctx.restore();

      // ── Star-field (outside translate scope) ──
      stars.forEach(s => {
        const sa = s.a * (Math.sin(time * 0.6 + s.phase) * 0.4 + 0.6);
        ctx.fillStyle = `rgba(200,220,255,${sa})`;
        ctx.beginPath(); ctx.arc(s.x * w, s.y * h, s.s, 0, Math.PI * 2); ctx.fill();
      });

      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

export default function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // All skill names for cross-glow
  const allSkillNames = skillCategories.flatMap((c) => c.skills.map((s) => s.name));

  return (
    <section
      id="skills"
      className="relative py-28 md:py-40 overflow-hidden"
    >
      <CoreSystemBg />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="flex items-start gap-6 mb-16">
          <span
            className="hidden md:block text-[10px] uppercase tracking-[0.4em] text-white/25 -rotate-90 origin-left whitespace-nowrap pt-8"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            / SKILLS
          </span>
          <div>
            <CharSplitHeading text="Tech Stack" />
            <p className="mt-3 text-sm text-white/35 max-w-md" style={{ fontFamily: 'var(--font-mono)' }}>
              Tools I think in, not just tools I&apos;ve touched.
            </p>
          </div>
        </div>

        {/* Bento grid — intentionally NOT a clean rectangle */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridTemplateRows: 'auto auto',
          }}
        >
          {/* Backend — wide, prominent */}
          <BentoCell
            color={skillCategories[0].color}
            className="col-span-12 md:col-span-7 p-8"
            animFrom="left"
            delay={0}
          >
            <CellContent category={skillCategories[0]} hoveredSkill={hoveredSkill} setHoveredSkill={setHoveredSkill} tight={false} />
          </BentoCell>

          {/* Programming — narrow, tighter padding */}
          <BentoCell
            color={skillCategories[2].color}
            className="col-span-12 md:col-span-5 p-5"
            rotate={1}
            animFrom="bottom"
            delay={0.1}
          >
            <CellContent category={skillCategories[2]} hoveredSkill={hoveredSkill} setHoveredSkill={setHoveredSkill} tight />
          </BentoCell>

          {/* Frontend — medium */}
          <BentoCell
            color={skillCategories[1].color}
            className="col-span-12 md:col-span-5 p-8"
            animFrom="scale"
            delay={0.2}
          >
            <CellContent category={skillCategories[1]} hoveredSkill={hoveredSkill} setHoveredSkill={setHoveredSkill} tight={false} />
          </BentoCell>

          {/* Tools — wider */}
          <BentoCell
            color={skillCategories[3].color}
            className="col-span-12 md:col-span-7 p-6"
            animFrom="bottom"
            delay={0.15}
          >
            <CellContent category={skillCategories[3]} hoveredSkill={hoveredSkill} setHoveredSkill={setHoveredSkill} tight={false} />
          </BentoCell>
        </div>
      </div>
    </section>
  );
}

function CellContent({
  category,
  hoveredSkill,
  setHoveredSkill,
  tight,
}: {
  category: typeof skillCategories[0];
  hoveredSkill: string | null;
  setHoveredSkill: (s: string | null) => void;
  tight: boolean;
}) {
  return (
    <>
      <div className="flex items-center gap-2 mb-5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: category.color }} />
        <h3
          className="text-xs uppercase tracking-widest font-bold"
          style={{ color: category.color, fontFamily: 'var(--font-mono)' }}
        >
          {category.title}
        </h3>
      </div>
      <div className={`flex flex-wrap ${tight ? 'gap-2' : 'gap-3'}`}>
        {category.skills.map((skill) => {
          const isGlowing = hoveredSkill !== null && hoveredSkill === skill.name;
          const isFaded = hoveredSkill !== null && hoveredSkill !== skill.name;
          return (
            <motion.div
              key={skill.name}
              className="flex items-center gap-2 border border-white/6 px-3 py-2 cursor-default transition-colors"
              onHoverStart={() => setHoveredSkill(skill.name)}
              onHoverEnd={() => setHoveredSkill(null)}
              animate={{
                borderColor: isGlowing ? `${category.color}80` : 'rgba(255,255,255,0.06)',
                opacity: isFaded ? 0.4 : 1,
                boxShadow: isGlowing ? `0 0 12px ${category.color}30` : 'none',
              }}
              transition={{ duration: 0.2 }}
            >
              {skill.image ? (
                <img src={skill.image} alt={skill.name} className="w-4 h-4 object-contain" />
              ) : (
                <span className="w-1 h-1 rounded-full" style={{ background: category.color }} />
              )}
              <span
                className="text-xs text-white/65 whitespace-nowrap"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {skill.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

function CharSplitHeading({ text }: { text: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.h2
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="flex flex-wrap overflow-hidden"
      style={{
        fontFamily: 'var(--font-syne)',
        fontWeight: 900,
        fontSize: 'clamp(2.4rem, 5vw, 4rem)',
        lineHeight: 1,
        letterSpacing: '-0.03em',
      }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { y: -60, opacity: 0, rotate: -8 },
            visible: { y: 0, opacity: 1, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 12, delay: i * 0.04 } }
          }}
          style={{ display: 'inline-block', minWidth: char === ' ' ? '0.3em' : undefined }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h2>
  );
}
