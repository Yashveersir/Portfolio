'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const BIO_WORDS = [
  'Computer', 'Science', 'Engineering', 'student', 'with', '8.6', 'CGPA,',
  'specializing', 'in', 'MERN', 'stack', 'and', 'Generative', 'AI.',
  'Experienced', 'in', 'building', 'secure', 'REST', 'APIs,', 'scalable',
  'applications,', 'and', 'integrating', 'AI', 'into', 'modern',
  'web', 'architecture.',
];

// Hand-drawn SVG underline for "Generative AI"
function HandUnderline() {
  return (
    <svg
      className="absolute -bottom-1 left-0 w-full overflow-visible pointer-events-none"
      height="6"
      viewBox="0 0 100 6"
      preserveAspectRatio="none"
    >
      <path
        d="M0,4 Q10,1 20,4 Q30,7 40,3 Q55,0 70,4 Q82,7 100,3"
        fill="none"
        stroke="#ff6400"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="draw-line"
      />
    </svg>
  );
}

function WordReveal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' });

  return (
    <motion.p
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="drop-cap text-lg md:text-xl leading-relaxed text-white/85 font-light"
      style={{ maxWidth: '520px' }}
    >
      {BIO_WORDS.map((word, i) => {
        // Mark "Generative AI" words for underline
        const isHighlight = i === 12 || i === 13;
        return (
          <motion.span
            key={i}
            className={isHighlight ? 'relative inline-block' : 'inline-block mr-[0.35em]'}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.4, ease: 'easeOut' } }
            }}
            style={{ marginRight: '0.35em' }}
          >
            {word}
            {isHighlight && i === 13 && <HandUnderline />}
          </motion.span>
        );
      })}
    </motion.p>
  );
}

const STATS = [
  { value: '8.6', label: 'CGPA', color: '#ff6400' },
  { value: 'MERN', label: 'Specialization', color: '#22d3ee' },
  { value: '3+', label: 'Live Projects', color: '#7c6fff' },
  { value: '13+', label: 'Certifications', color: '#a855f7' },
];

function NeuralBg() {
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
      nodes.forEach(n => { n.x = Math.random() * w; n.y = Math.random() * h; });
    };
    window.addEventListener('resize', resize);

    // More nodes, slightly faster
    const nodes = Array.from({ length: 60 }, () => ({
      x: Math.random() * 1400,
      y: Math.random() * 800,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      z: Math.random() * 1.8 + 0.5,
      phase: Math.random() * Math.PI * 2,
      isCyan: Math.random() > 0.5, // cyan or violet tint
    }));

    // Travelling light pulses on connections
    interface Pulse { i: number; j: number; t: number; speed: number }
    const pulses: Pulse[] = [];
    let nextPulse = 40;

    let frameId: number;
    let time = 0;

    resize();

    const draw = () => {
      time += 0.005;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, w, h);

      // ── Ambient gradient orbs (depth feel) ──
      const breath = Math.sin(time * 1.4) * 0.5 + 0.5;
      ctx.globalCompositeOperation = 'screen';
      const o1 = ctx.createRadialGradient(w * 0.15 + mx * -20, h * 0.3 + my * -15, 0, w * 0.15, h * 0.3, 350);
      o1.addColorStop(0, `rgba(34,211,238,${0.05 + breath * 0.03})`);
      o1.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = o1; ctx.fillRect(0, 0, w, h);

      const o2 = ctx.createRadialGradient(w * 0.85 + mx * -15, h * 0.7 + my * -10, 0, w * 0.85, h * 0.7, 300);
      o2.addColorStop(0, `rgba(124,111,255,${0.045 + breath * 0.025})`);
      o2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = o2; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';

      // ── Dot grid — slightly brighter ──
      const gs = 55;
      const gox = ((mx * 14) % gs + gs) % gs;
      const goy = ((my * 14) % gs + gs) % gs;
      ctx.fillStyle = 'rgba(255,255,255,0.035)';
      for (let gx = gox - gs; gx < w + gs; gx += gs) {
        for (let gy = goy - gs; gy < h + gs; gy += gs) {
          ctx.beginPath(); ctx.arc(gx, gy, 0.9, 0, Math.PI * 2); ctx.fill();
        }
      }

      // ── Grid lines ──
      const lgs = 110;
      const lgox = ((mx * 22) % lgs + lgs) % lgs;
      const lgoy = ((my * 22) % lgs + lgs) % lgs;
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(34,211,238,0.04)';
      ctx.beginPath();
      for (let gx = lgox - lgs; gx < w + lgs; gx += lgs) { ctx.moveTo(gx, 0); ctx.lineTo(gx, h); }
      for (let gy = lgoy - lgs; gy < h + lgs; gy += lgs) { ctx.moveTo(0, gy); ctx.lineTo(w, gy); }
      ctx.stroke();

      // Mouse world position (0..w, 0..h)
      const mwx = (mx * 0.5 + 0.5) * w;
      const mwy = (my * 0.5 + 0.5) * h;

      // Move nodes + mouse attraction
      nodes.forEach(n => {
        const pdx = mwx - n.x, pdy = mwy - n.y;
        const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
        if (pdist < 200) {
          const pull = (1 - pdist / 200) * 0.25;
          n.vx += (pdx / pdist) * pull;
          n.vy += (pdy / pdist) * pull;
        }
        n.vx *= 0.98; n.vy *= 0.98; // dampen
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });

      // ── Connections — stronger, dual-color ──
      const MAX_DIST2 = 200 * 200;
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        const ni = nodes[i];
        const px1 = ni.x + mx * 20 / ni.z, py1 = ni.y + my * 20 / ni.z;
        for (let j = i + 1; j < nodes.length; j++) {
          const nj = nodes[j];
          const px2 = nj.x + mx * 20 / nj.z, py2 = nj.y + my * 20 / nj.z;
          const dx = px1 - px2, dy = py1 - py2;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < MAX_DIST2) {
            const breathe = Math.sin(time * 1.1 + ni.phase + nj.phase) * 0.45 + 0.55;
            const alpha = (1 - dist2 / MAX_DIST2) * 0.18 * breathe;
            // Color: cyan lines for cyan nodes, violet otherwise
            const isMixed = ni.isCyan !== nj.isCyan;
            const lineColor = isMixed
              ? `rgba(150,160,255,${alpha})`
              : ni.isCyan
                ? `rgba(34,211,238,${alpha})`
                : `rgba(124,111,255,${alpha})`;
            ctx.strokeStyle = lineColor;
            ctx.beginPath(); ctx.moveTo(px1, py1); ctx.lineTo(px2, py2); ctx.stroke();
          }
        }
      }

      // ── Travelling pulses along connections ──
      if (--nextPulse <= 0) {
        const a = Math.floor(Math.random() * nodes.length);
        let b = Math.floor(Math.random() * nodes.length);
        while (b === a) b = Math.floor(Math.random() * nodes.length);
        const dx = nodes[a].x - nodes[b].x, dy = nodes[a].y - nodes[b].y;
        if (dx * dx + dy * dy < MAX_DIST2) pulses.push({ i: a, j: b, t: 0, speed: 0.006 + Math.random() * 0.006 });
        nextPulse = 25 + Math.random() * 50;
      }
      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k]; p.t += p.speed;
        if (p.t >= 1) { pulses.splice(k, 1); continue; }
        const na = nodes[p.i], nb = nodes[p.j];
        const px = na.x + (nb.x - na.x) * p.t;
        const py = na.y + (nb.y - na.y) * p.t;
        const pa = Math.sin(p.t * Math.PI) * 0.9;
        ctx.fillStyle = na.isCyan ? `rgba(34,211,238,${pa})` : `rgba(168,130,255,${pa})`;
        ctx.beginPath(); ctx.arc(px, py, 2.2, 0, Math.PI * 2); ctx.fill();
        // Trail glow
        ctx.fillStyle = na.isCyan ? `rgba(34,211,238,${pa * 0.25})` : `rgba(168,130,255,${pa * 0.25})`;
        ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
      }

      // ── Nodes — vivid glow, two colors ──
      nodes.forEach((n) => {
        const px = n.x + mx * 20 / n.z;
        const py = n.y + my * 20 / n.z;
        const pulse = Math.sin(time * 1.4 + n.phase) * 0.4 + 0.6;
        const baseAlpha = (0.55 / n.z) * pulse;

        // Outer glow halo
        const haloR = 8 / n.z;
        const halo = ctx.createRadialGradient(px, py, 0, px, py, haloR);
        const c = n.isCyan ? '34,211,238' : '124,111,255';
        halo.addColorStop(0, `rgba(${c},${baseAlpha * 0.5})`);
        halo.addColorStop(1, `rgba(${c},0)`);
        ctx.fillStyle = halo;
        ctx.beginPath(); ctx.arc(px, py, haloR, 0, Math.PI * 2); ctx.fill();

        // Core dot
        ctx.fillStyle = n.isCyan
          ? `rgba(34,211,238,${baseAlpha})`
          : `rgba(168,130,255,${baseAlpha})`;
        ctx.beginPath(); ctx.arc(px, py, 1.8 / n.z, 0, Math.PI * 2); ctx.fill();
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

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '6%']);

  const isStatsInView = useInView(statsRef, { once: true, margin: '-50px' });
  const isTerminalInView = useInView(terminalRef, { once: true, margin: '-50px' });
  const isLocationInView = useInView(locationRef, { once: true, margin: '-50px' });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-28 md:py-40 overflow-hidden"
    >
      <NeuralBg />
      {/* Decorative bracket behind heading */}
      <div
        className="pointer-events-none absolute top-8 left-8 select-none"
        style={{
          fontFamily: 'var(--font-syne)',
          fontSize: 'clamp(6rem, 20vw, 16rem)',
          color: 'rgba(34,211,238,0.03)',
          fontWeight: 900,
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        [
      </div>
      <div
        className="pointer-events-none absolute top-8 right-8 select-none"
        style={{
          fontFamily: 'var(--font-syne)',
          fontSize: 'clamp(6rem, 20vw, 16rem)',
          color: 'rgba(34,211,238,0.03)',
          fontWeight: 900,
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        ]
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-28 items-start">

          {/* Left col — section label + heading + bio */}
          <div className="w-full lg:w-1/2">
            {/* Rotated section label */}
            <div className="flex items-center gap-6 mb-10">
              <span
                className="hidden md:block text-[10px] uppercase tracking-[0.4em] text-white/30 -rotate-90 origin-left whitespace-nowrap"
                style={{ fontFamily: 'var(--font-mono)', marginTop: 24 }}
              >
                / ABOUT
              </span>
              <div>
                <CharSplitHeading text="About Me" />
              </div>
            </div>

            <WordReveal />

            {/* Stats grid */}
            <div ref={statsRef} className="grid grid-cols-2 gap-4 mt-10">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={isStatsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-5 border border-white/5 bg-white/3 hover:bg-white/6 transition-colors"
                  style={{ borderLeft: `2px solid ${s.color}40` }}
                >
                  <p
                    className="text-3xl font-black mb-1"
                    style={{ color: s.color, fontFamily: 'var(--font-syne)' }}
                  >
                    {s.value}
                  </p>
                  <p className="text-xs text-white/60 uppercase tracking-widest" style={{ fontFamily: 'var(--font-mono)' }}>
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right col — code terminal */}
          <div className="w-full lg:w-1/2 lg:pt-16">

            <motion.div
              ref={terminalRef}
              initial="hidden"
              animate={isTerminalInView ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, x: 40 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: { 
                    duration: 0.7, 
                    when: "beforeChildren",
                    staggerChildren: 0.1 
                  }
                }
              }}
              className="rounded-xl border border-white/8 bg-[#0a0a14]/80 backdrop-blur-xl overflow-hidden shadow-2xl"
            >
              {/* Window bar */}
              <div className="flex items-center gap-1.5 border-b border-white/5 bg-white/3 px-4 py-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span
                  className="ml-auto text-[10px] text-white/20"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  yashveer.ts
                </span>
              </div>
              <div className="p-6" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', lineHeight: 1.8 }}>
                <motion.p variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}><span className="text-[#c084fc]">const</span> <span className="text-[#60a5fa]">developer</span> <span className="text-white/50">=</span> {'{'}</motion.p>
                <motion.p variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="pl-5"><span className="text-[#4ade80]">name:</span> <span className="text-[#fbbf24]">&apos;Yashveer Singh&apos;</span>,</motion.p>
                <motion.p variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="pl-5"><span className="text-[#4ade80]">role:</span> <span className="text-[#fbbf24]">&apos;Full-Stack &amp; AI Engineer&apos;</span>,</motion.p>
                <motion.p variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="pl-5"><span className="text-[#4ade80]">location:</span> <span className="text-[#fbbf24]">&apos;Burdwan, West Bengal, India&apos;</span>,</motion.p>
                <motion.p variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="pl-5"><span className="text-[#4ade80]">stack:</span> [<span className="text-[#22d3ee]">&apos;React&apos;</span>, <span className="text-[#22d3ee]">&apos;Next.js&apos;</span>, <span className="text-[#22d3ee]">&apos;Node&apos;</span>, <span className="text-[#22d3ee]">&apos;AI&apos;</span>],</motion.p>
                <motion.p variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="pl-5"><span className="text-[#4ade80]">openToWork:</span> <span className="text-[#c084fc]">true</span>,</motion.p>
                <motion.p variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="pl-5"><span className="text-[#4ade80]">cgpa:</span> <span className="text-[#fb923c]">8.6</span>,</motion.p>
                <motion.p variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>{'}'}</motion.p>
                <motion.p variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="mt-3 text-white/20 animate-pulse">▌</motion.p>
              </div>
            </motion.div>

            {/* Location + availability note */}
            <motion.div
              ref={locationRef}
              initial={{ opacity: 0 }}
              animate={isLocationInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <p
                className="text-xs text-white/30 uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Burdwan, West Bengal, India · Remote-friendly
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Falling-character split heading with spring bounce
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
      {text.split(' ').map((word, wIdx, words) => {
        const prevChars = words.slice(0, wIdx).join('').length + wIdx;
        return (
          <span key={wIdx} className="inline-block mr-[0.3em] whitespace-nowrap">
            {word.split('').map((char, cIdx) => {
              const i = prevChars + cIdx;
              return (
                <motion.span
                  key={cIdx}
                  custom={i}
                  variants={{
                    hidden: { y: -60, opacity: 0, rotate: -8 },
                    visible: { y: 0, opacity: 1, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 12, delay: i * 0.04 } }
                  }}
                  style={{ display: 'inline-block' }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </motion.h2>
  );
}
