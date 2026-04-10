import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Hero from './components/Hero';

import Skills from './components/Skills';
import Projects from './components/Projects';

import img from "./assets/profile-photo.png"

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
];

const projects = [
  {
    title: 'Neural Commerce',
    description: 'A futuristic storefront with predictive search, adaptive product storytelling, and immersive micro-interactions.',
    techStack: ['React', 'Tailwind', 'Framer Motion'],
    imageLabel: img,
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/',
  },
  {
    title: 'Synapse Analytics',
    description: 'An AI dashboard concept that turns product and performance metrics into a cinematic command center experience.',
    techStack: ['Next.js', 'Charts', 'Design Systems'],
    imageLabel: 'ANALYTICS//AI',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/',
  },
  {
    title: 'Orbital Studio',
    description: 'A bold creative portfolio for launching brands with motion-led narratives and responsive visual identity systems.',
    techStack: ['React', 'UI Engineering', 'Responsive UX'],
    imageLabel: 'STUDIO//LAB',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/',
  },
];

const skillData = [
  { name: 'HTML', level: 96 },
  { name: 'CSS', level: 93 },
  { name: 'JavaScript', level: 90 },
  { name: 'React', level: 92 },
  { name: 'Tailwind CSS', level: 95 },
];

function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = window.setTimeout(() => setIsBooting(false), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateCursor = (event) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('pointermove', updateCursor);
    return () => window.removeEventListener('pointermove', updateCursor);
  }, []);

  const cursorStyle = useMemo(
    () => ({
      transform: `translate3d(${cursorPosition.x - 18}px, ${cursorPosition.y - 18}px, 0)`,
    }),
    [cursorPosition],
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-background)] text-white selection:bg-[var(--color-cyan)]/30 selection:text-white">
      <AnimatePresence>
        {isBooting ? (
          <motion.div
            key="loader"
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-background)]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeInOut' } }}
          >
            <div className="glass-panel flex w-[min(92vw,38rem)] flex-col gap-6 rounded-[2rem] px-6 py-8 sm:px-8">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/55">
                <span>Portfolio OS</span>
                <span>v2.6</span>
              </div>
              <div className="space-y-3">
                <p className="font-mono text-sm text-[var(--color-cyan)]">{'>'} Booting Portfolio OS...</p>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-linear-to-r from-[var(--color-cyan)] via-white to-[var(--color-purple)]"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.8, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-0 z-40 hidden md:block">
        <div className="glow-cursor" style={cursorStyle} />
      </div>

      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,245,255,0.14),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.14),transparent_22%),linear-gradient(180deg,#05070d_0%,#0a0a0a_100%)]" />
        <div className="grid-overlay absolute inset-0" />
      </div>

      <motion.header
        className="sticky top-0 z-30 border-b border-white/8 bg-black/25 backdrop-blur-xl"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 2.1 }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <a href="#hero" className="text-sm font-semibold uppercase tracking-[0.45em] text-[var(--color-cyan)]">
            Tarek
          </a>
          <nav className="hidden items-center gap-6 text-sm text-white/72 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition duration-300 hover:text-[var(--color-cyan)]">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </motion.header>

      <main className="relative z-10">
        <Hero />
        
        <Skills skills={skillData} />
        <Projects projects={projects} />
        
      </main>
    </div>
  );
}

export default App;
