'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { experiences } from '@/lib/constants';

function PathFlowBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    let animationFrameId: number;
    let w = 0, h = 0;
    interface Path { x: number; speed: number; pulseY: number; color: [number,number,number]; alpha: number; length: number; width: number; }
    let paths: Path[] = [];
    const PALETTE: [number,number,number][] = [[34,211,238],[124,111,255],[168,85,247]];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      w = canvas.width; h = canvas.height;
      paths = [];
      const n = Math.floor(w / 65);
      for (let i = 0; i < n; i++) {
        paths.push({ x: (i/n)*w + Math.random()*40, speed: 0.7+Math.random()*1.2, pulseY: Math.random()*h,
          color: PALETTE[Math.floor(Math.random()*PALETTE.length)], alpha: 0.22+Math.random()*0.28,
          length: 90+Math.random()*120, width: 1+Math.random()*1.5 });
      }
    };
    window.addEventListener('resize', resize); resize();
    let time = 0;
    const draw = () => {
      time += 0.004;
      ctx.clearRect(0, 0, w, h);
      const breath = Math.sin(time * 1.1) * 0.5 + 0.5;
      ctx.globalCompositeOperation = 'screen';
      [[w*0.15,h*0.4,320,'34,211,238',0.05+breath*0.03],[w*0.85,h*0.6,280,'124,111,255',0.045+breath*0.025]].forEach(([cx,cy,r,col,a]) => {
        const g = ctx.createRadialGradient(cx as number,cy as number,0,cx as number,cy as number,r as number);
        g.addColorStop(0,`rgba(${col},${a})`); g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
      });
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 6; i++) {
        const gy = (h/6)*i;
        ctx.strokeStyle = `rgba(34,211,238,${0.03+(i%2===0?0.012:0)})`;
        ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(w,gy); ctx.stroke();
      }
      const {x:mx,y:my} = mouseRef.current;
      if (mx>0) {
        const mg = ctx.createRadialGradient(mx,my,0,mx,my,250);
        mg.addColorStop(0,'rgba(34,211,238,0.06)'); mg.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=mg; ctx.fillRect(0,0,w,h);
      }
      paths.forEach(p => {
        const [r,g,b]=p.color;
        ctx.beginPath(); ctx.moveTo(p.x,0); ctx.lineTo(p.x,h);
        ctx.strokeStyle=`rgba(${r},${g},${b},0.03)`; ctx.lineWidth=1; ctx.stroke();
        p.pulseY += p.speed;
        if (p.pulseY > h+p.length) { p.pulseY=-p.length; p.x=Math.random()*w; p.speed=0.7+Math.random()*1.2; p.color=PALETTE[Math.floor(Math.random()*3)]; }
        const py0=p.pulseY-p.length, py1=p.pulseY+p.length;
        const gr=ctx.createLinearGradient(0,py0,0,py1);
        gr.addColorStop(0,`rgba(${r},${g},${b},0)`);
        gr.addColorStop(0.45,`rgba(${r},${g},${b},${p.alpha*0.5})`);
        gr.addColorStop(0.5,`rgba(${r},${g},${b},${p.alpha})`);
        gr.addColorStop(0.55,`rgba(${r},${g},${b},${p.alpha*0.5})`);
        gr.addColorStop(1,`rgba(${r},${g},${b},0)`);
        ctx.beginPath(); ctx.moveTo(p.x,Math.max(0,py0)); ctx.lineTo(p.x,Math.min(h,py1));
        ctx.strokeStyle=gr; ctx.lineWidth=p.width; ctx.stroke();
        const hg=ctx.createRadialGradient(p.x,p.pulseY,0,p.x,p.pulseY,18);
        hg.addColorStop(0,`rgba(${r},${g},${b},${p.alpha*0.6})`); hg.addColorStop(1,`rgba(${r},${g},${b},0)`);
        ctx.fillStyle=hg; ctx.beginPath(); ctx.arc(p.x,p.pulseY,18,0,Math.PI*2); ctx.fill();
        if (Math.abs(p.pulseY%55-27)<1.8) {
          ctx.strokeStyle=`rgba(${r},${g},${b},0.5)`; ctx.lineWidth=1.2;
          ctx.beginPath(); ctx.moveTo(p.x-5,p.pulseY); ctx.lineTo(p.x+5,p.pulseY); ctx.stroke();
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize',resize); cancelAnimationFrame(animationFrameId); };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />
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

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative py-28 md:py-40 overflow-hidden"
      style={{ background: '#030409' }}
    >
      <PathFlowBg />
      {/* Corner bracket decoration */}
      <div
        className="pointer-events-none absolute bottom-12 left-6 select-none text-white/[0.025]"
        style={{ fontFamily: 'var(--font-syne)', fontWeight: 900, fontSize: '12rem', lineHeight: 1 }}
      >
        {'{'}
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="flex items-start gap-6 mb-16">
          <span
            className="hidden md:block text-[10px] uppercase tracking-[0.4em] text-white/25 -rotate-90 origin-left whitespace-nowrap pt-8"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            / EXP
          </span>
          <div>
            <CharSplitHeading text="Experience" />
            <p className="mt-3 text-sm text-white/35 max-w-md" style={{ fontFamily: 'var(--font-mono)' }}>
              Work, community, and things that actually happened.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto mt-10 md:mt-20">
          {/* Vertical line */}
          <div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2"
            style={{ background: 'linear-gradient(to bottom, rgba(34,211,238,0.3), rgba(168,85,247,0.1), transparent)' }}
          />

          <div className="flex flex-col gap-10 md:gap-16">
            {experiences.map((exp, i) => (
              <ExperienceItem key={exp.title} exp={exp} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceItem({ exp, index }: { exp: typeof experiences[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-60px' });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -40 : 40 }}
      transition={{ type: 'spring' as const, stiffness: 90, damping: 18, delay: index * 0.1 }}
      className={`relative flex w-full group md:justify-between items-center ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
      {/* Spacer for desktop */}
      <div className="hidden md:block w-5/12" />

      {/* Timeline dot */}
      <div
        className="absolute left-4 md:left-1/2 top-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-125 group-hover:brightness-125 z-10"
        style={{ width: 16, height: 16, transform: 'translate(-50%, -50%)' }}
      >
        <div
          className="w-3 h-3 rounded-full border-2 transition-all duration-300"
          style={{ borderColor: exp.color, background: '#0a0a14', boxShadow: `0 0 8px ${exp.color}60` }}
        />
      </div>

      {/* Card Wrapper */}
      <div className={`w-full pl-12 md:pl-0 md:w-5/12 ${isEven ? 'md:pr-10' : 'md:pl-10'}`}>
        <div
          ref={ref}
          onMouseMove={handleMouseMove}
          className="bg-[#0a0a14]/60 backdrop-blur-xl p-7 relative overflow-hidden transition-colors hover-float-card"
        >
          {/* Border overlay */}
          <div 
             className="absolute inset-0 pointer-events-none border border-white/6 group-hover:border-white/15 transition-colors"
          />
          {/* Highlight line */}
          <div 
             className={`absolute inset-y-0 w-[2px] pointer-events-none left-0 ${isEven ? 'md:left-auto md:right-0' : ''}`}
             style={{ backgroundColor: `${exp.color}40` }}
          />
        {/* Dynamic glow tracking cursor */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ 
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${exp.color}15, transparent 40%)` 
          }}
        />

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">{exp.icon}</span>
            <div>
              <h3
                className="text-base font-bold"
                style={{ fontFamily: 'var(--font-syne)', color: exp.color }}
              >
                {exp.title}
              </h3>
              <p
                className="text-xs text-white/60 uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {exp.organization}
              </p>
            </div>
          </div>
          <span
            className="text-[10px] uppercase tracking-widest text-white/25 whitespace-nowrap"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {exp.date}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-white/80 leading-relaxed mb-5">
          {exp.description}
        </p>

        {/* Achievements */}
        <ul className="flex flex-col gap-2">
          {exp.achievements.map((a, ai) => (
            <li
              key={ai}
              className="flex items-start gap-2 text-xs text-white/65"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <span style={{ color: exp.color, marginTop: 2, flexShrink: 0 }}>›</span>
              {a}
            </li>
          ))}
        </ul>
      </div>
      </div>
    </motion.div>
  );
}
