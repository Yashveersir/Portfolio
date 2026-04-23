import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { socialLinks } from '../constants';
import { fadeIn, textVariant } from '../utils/motion';
import { FaEnvelope, FaPhone, FaGithub, FaLinkedin, FaPaperPlane, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const contactInfo = [
  { icon: <FaEnvelope />, label: 'Email', value: socialLinks.email, href: `mailto:${socialLinks.email}` },
  { icon: <FaPhone />, label: 'Phone', value: socialLinks.phone, href: `tel:${socialLinks.phone.replace(/\s/g, '')}` },
  { icon: <FaGithub />, label: 'GitHub', value: 'github.com/yashveersingh', href: socialLinks.github },
  { icon: <FaLinkedin />, label: 'LinkedIn', value: 'linkedin.com/in/yashveersingh', href: socialLinks.linkedin },
];

export default function Contact() {
  const formRef = useRef();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus('sending');

    try {
      // Safely hardcode Render URL in production to prevent Vercel env var misconfigurations
      const API_URL = import.meta.env.DEV ? 'http://localhost:5000' : 'https://portfolio-d6sq.onrender.com';
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <section id="contact" className="relative section-padding">
      {/* Background glows */}
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/[0.05] blur-[120px]" />
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] rounded-full bg-accent/[0.04] blur-[100px]" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          variants={textVariant()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <p className="text-primary-light text-sm font-semibold tracking-widest uppercase mb-3">
            Get In Touch
          </p>
          <h2 className="section-title gradient-text">Contact Me</h2>
          <p className="section-subtitle">
            Have a project in mind or want to collaborate? Let's connect!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Left: Contact Info */}
          <motion.div
            variants={fadeIn('right', 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {contactInfo.map((info, i) => (
              <motion.a
                key={info.label}
                href={info.href}
                target={info.label === 'Email' || info.label === 'Phone' ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="glass rounded-xl card-spacing flex items-center gap-4 no-underline group gradient-border cursor-pointer card-hover-lift"
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 0 25px rgba(99, 102, 241, 0.12)',
                }}
              >
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary-light text-lg shrink-0 group-hover:scale-110 transition-transform">
                  {info.icon}
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-text-dim text-xs font-medium uppercase tracking-wider mb-0.5">
                    {info.label}
                  </p>
                  <p className="text-white text-sm font-medium m-0 group-hover:text-primary-light transition-colors">
                    {info.value}
                  </p>
                </div>
              </motion.a>
            ))}
            <div className="glass rounded-xl card-spacing card-hover-lift">
              <p className="text-white text-sm font-semibold mb-2">Why contact me?</p>
              <ul className="m-0 pl-4 space-y-1">
                <li className="text-text-muted text-xs">Avg. response time under 24 hours</li>
                <li className="text-text-muted text-xs">Clear milestones and transparent communication</li>
                <li className="text-text-muted text-xs">Open to internships, full-time, and freelance work</li>
              </ul>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            variants={fadeIn('left', 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="lg:col-span-3"
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="glass rounded-2xl card-spacing-lg neon-glow card-hover-lift"
            >
              <div className="flex flex-col gap-5">
                {/* Name */}
                <div>
                  <label className="text-text-muted text-sm font-medium mb-2 block">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Yashveer Singh"
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-dark-200/60 border border-white/[0.08] text-white text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-text-dim"
                    style={{ fontFamily: 'var(--font-body)' }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-text-muted text-sm font-medium mb-2 block">
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="yashveer@example.com"
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-dark-200/60 border border-white/[0.08] text-white text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-text-dim"
                    style={{ fontFamily: 'var(--font-body)' }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-text-muted text-sm font-medium mb-2 block">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    required
                    rows={5}
                    className="w-full px-4 py-3.5 rounded-xl bg-dark-200/60 border border-white/[0.08] text-white text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-text-dim resize-none"
                    style={{ fontFamily: 'var(--font-body)' }}
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  className={`btn-primary w-full justify-center !py-4 ${
                    status === 'sending' ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  whileHover={status !== 'sending' ? { scale: 1.02 } : {}}
                  whileTap={status !== 'sending' ? { scale: 0.98 } : {}}
                >
                  {status === 'idle' && (
                    <>
                      <FaPaperPlane className="relative z-10" />
                      <span>Send Message</span>
                    </>
                  )}
                  {status === 'sending' && <span>Sending...</span>}
                  {status === 'success' && (
                    <>
                      <FaCheck className="relative z-10" />
                      <span>Message Sent!</span>
                    </>
                  )}
                  {status === 'error' && (
                    <>
                      <FaExclamationTriangle className="relative z-10" />
                      <span>Failed. Try Again</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
