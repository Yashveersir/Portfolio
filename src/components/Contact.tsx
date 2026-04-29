'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { socialLinks } from '@/lib/constants';
import { Mail, ArrowRight } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

function NetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -999, y: -999, rippleR: 0, rippling: false });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const handleClick = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.rippleR = 0;
      mouseRef.current.rippling = true;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
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
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    let animationFrameId: number;
    let w = 0, h = 0;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      w = canvas.width; h = canvas.height;
    };
    window.addEventListener('resize', resize); resize();

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * (w || 1400), y: Math.random() * (h || 800),
      vx: (Math.random()-0.5)*0.22, vy: (Math.random()-0.5)*0.22,
      size: Math.random()*1.6+0.4, alpha: Math.random()*0.45+0.1,
      phase: Math.random()*Math.PI*2,
      isCyan: Math.random() > 0.4,
    }));

    let time = 0;
    let lastFrame = 0;
    const FRAME_INTERVAL = 1000 / 30;
    const draw = (now: number) => {
      animationFrameId = requestAnimationFrame(draw);
      const elapsed = now - lastFrame;
      if (elapsed < FRAME_INTERVAL) return;
      lastFrame = now - (elapsed % FRAME_INTERVAL);
      time += 0.004;
      ctx.clearRect(0, 0, w, h);

      // Strong ambient breathing orbs
      const breath = Math.sin(time * 0.9) * 0.5 + 0.5;
      ctx.globalCompositeOperation = 'screen';
      const orbs = [
        { cx: w*0.3, cy: h*0.4, r: Math.max(w,h)*0.55, c: '124,111,255', a: 0.07+breath*0.04 },
        { cx: w*0.7, cy: h*0.6, r: Math.max(w,h)*0.5,  c: '34,211,238',  a: 0.06+breath*0.03 },
        { cx: w*0.5, cy: h*0.2, r: Math.max(w,h)*0.35, c: '96,165,250',  a: 0.04+breath*0.02 },
      ];
      orbs.forEach(({cx,cy,r,c,a}) => {
        const g = ctx.createRadialGradient(cx,cy,0,cx,cy,r);
        g.addColorStop(0,`rgba(${c},${a})`); g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
      });
      ctx.globalCompositeOperation = 'source-over';

      // Mouse-following glow — stronger
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      if (mx>0 && my>0) {
        const mg = ctx.createRadialGradient(mx,my,0,mx,my,320);
        mg.addColorStop(0,'rgba(34,211,238,0.09)'); mg.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=mg; ctx.fillRect(0,0,w,h);
      }

      // Move particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x<0||p.x>w) p.vx*=-1; if (p.y<0||p.y>h) p.vy*=-1;
      });

      // Connections between nearby particles
      const CONN = 100*100;
      ctx.lineWidth = 0.7;
      for (let i=0;i<particles.length;i++) {
        for (let j=i+1;j<particles.length;j++) {
          const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
          const d2=dx*dx+dy*dy;
          if (d2<CONN) {
            const a=(1-d2/CONN)*0.15;
            const col = particles[i].isCyan ? '34,211,238' : '124,111,255';
            ctx.strokeStyle=`rgba(${col},${a})`;
            ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y); ctx.stroke();
          }
        }
      }

      // Draw particles with glow halos
      particles.forEach(p => {
        const pa = p.alpha*(Math.sin(time*0.9+p.phase)*0.4+0.6);
        const col = p.isCyan ? '34,211,238' : '124,111,255';
        const halo = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*5);
        halo.addColorStop(0,`rgba(${col},${pa*0.5})`); halo.addColorStop(1,`rgba(${col},0)`);
        ctx.fillStyle=halo; ctx.beginPath(); ctx.arc(p.x,p.y,p.size*5,0,Math.PI*2); ctx.fill();
        ctx.fillStyle=`rgba(${col},${pa})`;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
      });

      // Multi-ring click ripple
      if (mouseRef.current.rippling) {
        for (let ring=0;ring<3;ring++) {
          const rr = mouseRef.current.rippleR - ring*25;
          if (rr>0) {
            const ra = Math.max(0, 0.4-rr/200);
            const rc = ring===1 ? '124,111,255' : '34,211,238';
            ctx.strokeStyle=`rgba(${rc},${ra})`;
            ctx.lineWidth=1.5-ring*0.4;
            ctx.beginPath(); ctx.arc(mx,my,rr,0,Math.PI*2); ctx.stroke();
          }
        }
        mouseRef.current.rippleR += 5;
        if (mouseRef.current.rippleR>280) mouseRef.current.rippling=false;
      }
    };
    animationFrameId = requestAnimationFrame(draw);
    return () => { window.removeEventListener('resize',resize); cancelAnimationFrame(animationFrameId); };
  }, [isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

function CharSplitHeading({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true });
  
  const words = text.split(' ');
  let charIndex = 0;

  return (
    <h2
      ref={ref}
      className="flex flex-wrap overflow-hidden"
      aria-label={text}
      style={{
        fontFamily: 'var(--font-syne)',
        fontWeight: 900,
        fontSize: 'clamp(2.4rem, 5vw, 3.5rem)',
        lineHeight: 1.05,
        letterSpacing: '-0.03em',
        paddingRight: '0.1em',
        paddingBottom: '0.1em',
      }}
    >
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="flex whitespace-nowrap" style={{ marginRight: wordIdx !== words.length - 1 ? '0.3em' : '0' }}>
          {word.split('').map((char, i) => {
            const currentIdx = charIndex++;
            return (
              <motion.span
                key={i}
                initial={{ y: -60, opacity: 0, rotate: -8 }}
                animate={isInView ? { y: 0, opacity: 1, rotate: 0 } : {}}
                transition={{ type: 'spring', stiffness: 200, damping: 12, delay: currentIdx * 0.035 }}
                style={{ display: 'inline-block' }}
                aria-hidden="true"
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}

export default function Contact() {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        (e.target as HTMLFormElement).reset();
        setName('');
      } else {
        const errBody = await response.json().catch(() => ({}));
        console.error('[Contact] Server error:', response.status, errBody);
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error('[Contact] Network/fetch error:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-dismiss success/error messages
  useEffect(() => {
    if (submitStatus !== 'idle') {
      const timer = setTimeout(() => setSubmitStatus('idle'), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const dynamicHeading = name.trim() ? `Let's Talk, ${name.trim()}.` : "Let's build\nsomething great.";

  return (
    <section id="contact" className="relative py-28 md:py-40 overflow-hidden" style={{ background: '#030409' }}>
      <NetworkBg />
      {/* Decorative bracket */}
      <div
        className="pointer-events-none absolute bottom-0 right-8 select-none z-0"
        style={{
          fontFamily: 'var(--font-syne)',
          fontSize: 'clamp(6rem, 18vw, 14rem)',
          color: 'rgba(34,211,238,0.03)',
          fontWeight: 900,
          lineHeight: 1,
        }}
      >
        ]
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left — heading + social */}
          <div className="w-full lg:w-1/2">
            <div className="flex items-start gap-6 mb-8">
              <span
                className="hidden md:block text-[10px] uppercase tracking-[0.4em] text-white/25 -rotate-90 origin-left whitespace-nowrap pt-8"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                / CONTACT
              </span>
              <div>
                {/* Live-updating headline as user types their name */}
                <div className="min-h-[120px]">
                  <CharSplitHeading text={dynamicHeading.split('\n')[0]} />
                  {dynamicHeading.includes('\n') && (
                    <div className="mt-1">
                      <CharSplitHeading text={dynamicHeading.split('\n')[1]} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-white/80 text-base leading-relaxed max-w-sm mb-10"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
            >
              Currently open for new opportunities. Whether you have a project, a question, or just want to say hi — I&apos;ll get back to you.
            </motion.p>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 }}
              className="flex flex-col gap-5"
            >
              <a
                href={`mailto:${socialLinks.email}`}
                className="group flex items-center gap-4 text-white/75 hover:text-cyan-400 transition-colors cursor-pointer"
                aria-label={`Send an email to ${socialLinks.email}`}
              >
                <div className="w-10 h-10 border border-white/8 bg-white/3 flex items-center justify-center group-hover:border-cyan-400/40 group-hover:bg-cyan-400/8 transition-all">
                  <Mail size={16} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/55 mb-0.5" style={{ fontFamily: 'var(--font-mono)' }}>Email</p>
                  <p className="text-sm font-medium text-white/70 group-hover:text-cyan-400 group-hover:underline underline-offset-4 transition-colors">{socialLinks.email}</p>
                </div>
              </a>

              <div className="flex gap-3">
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/8 bg-white/3 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
                  aria-label="GitHub Profile"
                >
                  <FaGithub size={16} aria-hidden="true" />
                </a>
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/8 bg-white/3 flex items-center justify-center text-white/40 hover:text-blue-400 hover:border-blue-400/30 transition-all"
                  aria-label="LinkedIn Profile"
                >
                  <FaLinkedin size={16} aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right — form */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="border border-white/6 bg-[#0a0a14]/60 backdrop-blur-xl p-8 relative overflow-hidden tilt-card"
            >
              {/* Cyan glow top-right */}
              <div className="absolute top-0 right-0 w-60 h-60 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
              />

              <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="name"
                    className="text-[10px] uppercase tracking-widest text-white/35"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-black/40 border border-white/8 px-4 py-3 text-white text-sm placeholder-white/15 focus:outline-none focus:border-cyan-400/50 transition-colors"
                    style={{ fontFamily: 'var(--font-mono)' }}
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-[10px] uppercase tracking-widest text-white/35"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    maxLength={254}
                    className="bg-black/40 border border-white/8 px-4 py-3 text-white text-sm placeholder-white/15 focus:outline-none focus:border-cyan-400/50 transition-colors"
                    style={{ fontFamily: 'var(--font-mono)' }}
                    placeholder="john@example.com"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="message"
                    className="text-[10px] uppercase tracking-widest text-white/35"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    minLength={10}
                    maxLength={2000}
                    className="bg-black/40 border border-white/8 px-4 py-3 text-white text-sm placeholder-white/15 focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
                    style={{ fontFamily: 'var(--font-mono)' }}
                    placeholder="What are we building together?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group mt-2 w-full border border-cyan-400 bg-cyan-400 px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition-all hover:bg-transparent hover:text-cyan-400 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-center text-green-400"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    ✓ Message received. I&apos;ll be in touch soon.
                  </motion.p>
                )}
                {submitStatus === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-center text-red-400"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    Something went wrong. Email me directly.
                  </motion.p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
