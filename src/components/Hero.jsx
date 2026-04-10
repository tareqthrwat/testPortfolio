import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import profilePhoto from '../assets/profile-photo.png';

const heroLines = ["" , "Hi, I'm Tarek , Frontend Developer | React Specialist"];

export default function Hero() {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const currentLine = heroLines[lineIndex];

    if (displayText.length < currentLine.length) {
      const timer = window.setTimeout(() => {
        setDisplayText(currentLine.slice(0, displayText.length + 1));
      }, 65);
      return () => window.clearTimeout(timer);
    }

    if (lineIndex < heroLines.length - 1) {
      const timer = window.setTimeout(() => {
        setLineIndex((value) => value + 1);
        setDisplayText('');
      }, 800);
      return () => window.clearTimeout(timer);
    }
  }, [displayText, lineIndex]);

  return (
    <section id="hero" className="relative flex min-h-screen items-center px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <div className="glass-panel inline-flex items-center gap-3 rounded-full px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/75">
            <span className="h-2 w-2 rounded-full bg-[var(--color-cyan)] shadow-[0_0_14px_var(--color-cyan)]" />
            Hi, I'm Tarek 
          </div>

          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.45em] text-[var(--color-cyan)]">Future-ready frontend systems</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
              Still learning, still building, and focusing on what actually matters.
            </h1>
            <div className="glass-panel min-h-24 rounded-[1.75rem] px-5 py-4">
              <p className="font-mono text-lg text-white/80 sm:text-xl">
                <span className="text-[var(--color-cyan)]">{'>'}</span> {displayText}
                <span className="ml-1 inline-block h-6 w-[2px] animate-pulse bg-[var(--color-cyan)] align-middle" />
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <motion.a
              href="#about"
              className="neon-button inline-flex items-center justify-center rounded-full px-7 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-slate-950"
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              Enter System
            </motion.a>
            <motion.a
              href="#projects"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-white/80 backdrop-blur-xl"
              whileHover={{ scale: 1.03, borderColor: 'rgba(0,245,255,0.45)' }}
              whileTap={{ scale: 0.98 }}
            >
              View Projects
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.35 }}
        >
          <div className="absolute inset-x-10 top-10 h-36 rounded-full bg-[radial-gradient(circle,rgba(0,245,255,0.3),transparent_60%)] blur-3xl" />
          <div className="glass-panel relative overflow-hidden rounded-[2rem] p-5 sm:p-7">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,245,255,0.08),transparent_42%,rgba(124,58,237,0.2))]" />
            <div className="relative grid gap-5">
              <div className="flex items-center justify-between rounded-[1.25rem] border border-white/10 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.32em] text-white/50">
                <span>Core Signal</span>
                <span>Online</span>
              </div>

              <div className="relative flex justify-center py-4">
                <motion.div
                  className="portrait-orbit"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                />
                <motion.div
                  className="portrait-halo absolute inset-0 m-auto h-64 w-64 rounded-full"
                  animate={{ scale: [1, 1.05, 1], opacity: [0.55, 0.9, 0.55] }}
                  transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                />
                <motion.div
                  className="portrait-frame relative z-10 flex h-64 w-64 items-center justify-center rounded-full p-3"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-full border border-white/12 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),rgba(255,255,255,0.02))]">
                    <img src={profilePhoto} alt="Portrait of Tarek" className="h-full w-full object-cover object-top" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_35%,rgba(10,10,10,0.12)_72%,rgba(10,10,10,0.55)_100%)]" />
                  </div>
                </motion.div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-[var(--color-cyan)]/20 bg-black/40 p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/45">Interface</p>
                  <p className="mt-4 text-3xl font-semibold text-[var(--color-cyan)]">React</p>
                  <p className="mt-2 text-sm leading-7 text-white/65">Component-driven architecture with cinematic motion and scalable UI systems.</p>
                </div>
                <div className="rounded-[1.5rem] border border-[var(--color-purple)]/20 bg-black/40 p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/45">Experience</p>
                  <p className="mt-4 text-3xl font-semibold text-[var(--color-purple)]">UX</p>
                  <p className="mt-2 text-sm leading-7 text-white/65">Fast, responsive interactions tuned for modern portfolios and product interfaces.</p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5">
                <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/45">
                  <span>Signal Matrix</span>
                  <span>92%</span>
                </div>
                <div className="grid gap-3">
                  {[88, 72, 94, 80].map((value) => (
                    <div key={value} className="h-3 overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        className="h-full rounded-full bg-linear-to-r from-[var(--color-cyan)] to-[var(--color-purple)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 1.1, delay: 0.6 }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
