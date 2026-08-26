'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { socialLinks as DEFAULT_SOCIAL_LINKS } from '@/lib/constants';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { Mail, ArrowRight, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import CharSplitHeading from './CharSplitHeading';

function Closing3DObject() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 60;
      const y = (e.clientY / window.innerHeight - 0.5) * -60;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const rotateX = useSpring(mouseY, { damping: 50, stiffness: 100 });
  const rotateY = useSpring(mouseX, { damping: 50, stiffness: 100 });

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] pointer-events-none perspective-[1200px] opacity-[0.065] z-0 overflow-hidden">
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
      >
        <motion.div 
          animate={{ rotateX: [0, 360], rotateY: [0, 360] }} 
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[var(--cyan)] rounded-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute inset-0 border border-[var(--cyan)] rounded-full"
              style={{ transform: `rotateY(${i * 30}deg) rotateX(${i * 20}deg)` }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function SocialCard({ href, label, value, icon: Icon, colorRGB = "34, 211, 238" }: { href: string, label: string, value: string, icon: any, colorRGB?: string }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), { damping: 30, stiffness: 100 });
  const rotateY = useSpring(useMotionValue(0), { damping: 30, stiffness: 100 });

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    rotateX.set(((y - centerY) / centerY) * -15);
    rotateY.set(((x - centerX) / centerX) * 15);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.a
      ref={cardRef}
      href={href}
      target={href.startsWith('mailto') ? '_self' : '_blank'}
      rel={href.startsWith('mailto') ? '' : 'noopener noreferrer'}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group/social relative p-[1px] rounded-2xl block w-full sm:w-auto"
    >
      {/* Default Border */}
      <div className="absolute inset-0 rounded-2xl bg-white/5 transition-opacity duration-500 group-hover/social:opacity-0" />
      
      {/* Tracking Spotlight Border */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover/social:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              150px circle at ${mouseX}px ${mouseY}px,
              rgba(${colorRGB}, 1),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative h-full bg-[#04060C]/40 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-4 overflow-hidden shadow-xl">
        <div className="absolute inset-0 blueprint-grid opacity-[0.03]" />
        
        {/* Inner Glowing Spotlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover/social:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                200px circle at ${mouseX}px ${mouseY}px,
                rgba(${colorRGB}, 0.1),
                transparent 70%
              )
            `,
          }}
        />

        <div className="relative z-10 w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center transition-colors duration-300" style={{ transform: 'translateZ(20px)' }}>
          <Icon size={18} className="text-white/60 transition-colors duration-300 group-hover/social:text-white" />
        </div>
        
        <div className="relative z-10 flex flex-col" style={{ transform: 'translateZ(20px)' }}>
          <span className="text-[9px] uppercase tracking-widest text-white/40 font-mono mb-1">{label}</span>
          <span className="text-sm font-bold text-white transition-colors duration-300 font-syne group-hover/social:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{value}</span>
        </div>
      </div>
    </motion.a>
  );
}

export default function Contact() {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { data } = usePortfolioData();
  const socialLinks = data?.socialLinks?.email ? data.socialLinks : DEFAULT_SOCIAL_LINKS;

  const formRef = useRef<HTMLDivElement>(null);
  const formMouseX = useMotionValue(0);
  const formMouseY = useMotionValue(0);

  function handleFormMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!formRef.current) return;
    const rect = formRef.current.getBoundingClientRect();
    formMouseX.set(e.clientX - rect.left);
    formMouseY.set(e.clientY - rect.top);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const apiEndpoint = backendUrl ? `${backendUrl.replace(/\/$/, '')}/api/contact` : '/api/contact';

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        (e.target as HTMLFormElement).reset();
        setName('');
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (submitStatus !== 'idle') {
      const timer = setTimeout(() => setSubmitStatus('idle'), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const dynamicHeading = name.trim() ? `Let's Talk, ${name.trim()}.` : "Let's build\nsomething great.";

  return (
    <section id="contact" className="relative min-h-screen py-28 md:py-40 bg-transparent flex items-center overflow-hidden text-white">
      
      <Closing3DObject />
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--cyan)_0%,transparent_50%)] opacity-[0.03] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-center">
          
          {/* Left: Dramatic Typography */}
          <div className="w-full lg:w-[55%] flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--cyan)] font-mono mb-8 block flex items-center gap-4">
              <span className="w-8 h-[1px] bg-[var(--cyan)]"></span>
              CONTACT
            </span>
            
            <div className="min-h-[160px] md:min-h-[200px] mb-8">
              <CharSplitHeading text={dynamicHeading.split('\n')[0]} fontSize="clamp(2.5rem, 8vw, 6rem)" />
              {dynamicHeading.includes('\n') && (
                <div className="mt-2">
                  <CharSplitHeading text={dynamicHeading.split('\n')[1]} fontSize="clamp(2.5rem, 8vw, 6rem)" />
                </div>
              )}
            </div>

            <p className="text-[var(--text-dim)] text-base md:text-lg leading-relaxed max-w-md mb-12 font-dm-sans">
              Currently open for new opportunities. Whether you have a project, a question, or just want to say hi — I&apos;ll get back to you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <SocialCard 
                href={`mailto:${socialLinks.email}`} 
                label="Direct Message" 
                value={socialLinks.email} 
                icon={Mail} 
                colorRGB="34, 211, 238" 
              />
              <div className="flex gap-4">
                <SocialCard 
                  href={socialLinks.github} 
                  label="Code" 
                  value="GitHub" 
                  icon={FaGithub} 
                  colorRGB="167, 139, 250" 
                />
                <SocialCard 
                  href={socialLinks.linkedin} 
                  label="Network" 
                  value="LinkedIn" 
                  icon={FaLinkedin} 
                  colorRGB="96, 165, 250" 
                />
              </div>
            </div>
          </div>

          {/* Right: Premium Form */}
          <div className="w-full lg:w-[45%]">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative p-[1px] rounded-3xl group/form"
            >
              {/* Form Default Border */}
              <div className="absolute inset-0 rounded-3xl bg-white/10 transition-opacity duration-500 group-hover/form:opacity-0" />
              
              {/* Form Tracking Spotlight Border */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover/form:opacity-100"
                style={{
                  background: useMotionTemplate`
                    radial-gradient(
                      400px circle at ${formMouseX}px ${formMouseY}px,
                      rgba(34, 211, 238, 1),
                      transparent 80%
                    )
                  `,
                }}
              />

              <div 
                ref={formRef}
                onMouseMove={handleFormMouseMove}
                className="relative bg-[#04060C]/40 backdrop-blur-3xl rounded-3xl p-8 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden"
              >
                <div className="absolute inset-0 blueprint-grid opacity-[0.03]" />
                
                {/* Inner Glowing Spotlight */}
                <motion.div
                  className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover/form:opacity-100"
                  style={{
                    background: useMotionTemplate`
                      radial-gradient(
                        500px circle at ${formMouseX}px ${formMouseY}px,
                        rgba(34, 211, 238, 0.08),
                        transparent 70%
                      )
                    `,
                  }}
                />

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                  <div className="flex flex-col gap-3 group">
                    <label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-mono transition-colors group-focus-within:text-[var(--cyan)]">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[var(--cyan)] focus:bg-[var(--cyan)]/5 transition-all shadow-inner font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-3 group">
                    <label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-mono transition-colors group-focus-within:text-[var(--cyan)]">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="john@example.com"
                      className="bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[var(--cyan)] focus:bg-[var(--cyan)]/5 transition-all shadow-inner font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-3 group">
                    <label htmlFor="message" className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-mono transition-colors group-focus-within:text-[var(--cyan)]">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      placeholder="What are we building together?"
                      className="bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[var(--cyan)] focus:bg-[var(--cyan)]/5 transition-all shadow-inner font-mono resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-6 w-full bg-white text-black px-6 py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[11px] font-mono hover:bg-[var(--cyan)] hover:text-black transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Transmitting...</span>
                    ) : (
                      <>
                        Send Message <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {(isSubmitting || submitStatus !== 'idle') && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#04060C]/80 backdrop-blur-md"
              onClick={() => { if (!isSubmitting) setSubmitStatus('idle'); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-[#04060C] border border-white/10 rounded-3xl p-8 shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex flex-col items-center text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.1),transparent_70%)] pointer-events-none" />
              <div className="absolute inset-0 blueprint-grid opacity-[0.05]" />

              <div className="relative z-10 flex flex-col items-center">
                {isSubmitting && (
                  <>
                    <Loader2 className="w-12 h-12 text-[var(--cyan)] animate-spin mb-6 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                    <h3 className="text-xl font-bold text-white font-syne mb-2 tracking-wide">Transmitting</h3>
                    <p className="text-xs text-[var(--cyan)] font-mono uppercase tracking-[0.2em] animate-pulse">Establishing Secure Uplink...</p>
                  </>
                )}
                {!isSubmitting && submitStatus === 'success' && (
                  <>
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
                    <h3 className="text-xl font-bold text-white font-syne mb-2 tracking-wide">Transmission Successful</h3>
                    <p className="text-sm text-white/60 font-dm-sans mb-8">Your message has been received. I will respond to your channel shortly.</p>
                    <button onClick={() => setSubmitStatus('idle')} className="w-full px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-mono text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-colors">Acknowledge</button>
                  </>
                )}
                {!isSubmitting && submitStatus === 'error' && (
                  <>
                    <XCircle className="w-16 h-16 text-red-400 mb-4 drop-shadow-[0_0_15px_rgba(248,113,113,0.4)]" />
                    <h3 className="text-xl font-bold text-white font-syne mb-2 tracking-wide">Transmission Failed</h3>
                    <p className="text-sm text-white/60 font-dm-sans mb-8">The secure connection dropped. Please email me directly instead.</p>
                    <button onClick={() => setSubmitStatus('idle')} className="w-full px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-mono text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-colors">Acknowledge</button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
