import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Hero from '../components/Hero';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import { usePortfolio } from '../context/usePortfolio';
import { FiMenu, FiX, FiArrowUp } from 'react-icons/fi';

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const BOOT_SESSION_KEY = 'portfolio_boot_completed';

export default function PublicPortfolio() {
  const { settings } = usePortfolio();
  const shouldReduceMotion = useReducedMotion();

  const mobileToggleRef = useRef(null);
  const mobileNavRef = useRef(null);

  // Check if boot sequence has already run during this browser session
  // Also check prefers-reduced-motion to avoid initial flash
  const [isBooting, setIsBooting] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
      if (prefersReduced) return false;
      const hasBooted = window.sessionStorage.getItem(BOOT_SESSION_KEY);
      return !hasBooted;
    } catch {
      return false;
    }
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const dismissBoot = useCallback(() => {
    try {
      window.sessionStorage.setItem(BOOT_SESSION_KEY, 'true');
    } catch {
      // Ignore storage errors in restricted contexts
    }
    setIsBooting(false);
  }, []);

  // Boot timer: automatically dismiss after 2.2s, or immediately if reduced motion
  useEffect(() => {
    if (!isBooting) return;

    if (shouldReduceMotion) {
      dismissBoot();
      return;
    }

    const timer = window.setTimeout(() => {
      dismissBoot();
    }, 2200);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        dismissBoot();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isBooting, shouldReduceMotion, dismissBoot]);

  // Custom glow cursor: ONLY activate AFTER boot screen finishes and if not reduced motion
  useEffect(() => {
    if (shouldReduceMotion || isBooting) {
      document.body.classList.remove('custom-cursor-active');
      return;
    }

    document.body.classList.add('custom-cursor-active');
    const updateCursor = (event) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('pointermove', updateCursor);
    return () => {
      window.removeEventListener('pointermove', updateCursor);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [shouldReduceMotion, isBooting]);

  // Close mobile menu and restore focus to trigger button
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    mobileToggleRef.current?.focus();
  }, []);

  // Keyboard navigation & focus management for mobile menu
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = mobileNavRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (
            document.activeElement === firstElement ||
            document.activeElement === mobileToggleRef.current
          ) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, closeMobileMenu]);

  const cursorStyle = useMemo(
    () => ({
      transform: `translate3d(${cursorPosition.x - 18}px, ${cursorPosition.y - 18}px, 0)`,
    }),
    [cursorPosition],
  );

  return (
    <div className="public-portfolio relative min-h-screen overflow-hidden bg-[var(--aurora-bg)] text-[var(--aurora-text)] selection:bg-[var(--aurora-primary)]/30 selection:text-[var(--aurora-text)]">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-[var(--aurora-primary)] focus:px-4 focus:py-2 focus:text-[#080D1B] focus:font-semibold focus:shadow-[0_0_20px_rgba(108,140,255,0.5)] focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Cinematic Boot Screen (Once per session, dismissable, accessible, visible native cursor) */}
      <AnimatePresence>
        {isBooting ? (
          <motion.div
            key="loader"
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--aurora-bg)]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35, ease: 'easeInOut' } }}
          >
            <div className="glass-panel flex w-[min(92vw,38rem)] flex-col gap-6 rounded-[2rem] px-6 py-8 sm:px-8">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-[var(--aurora-text-muted)]">
                <span>Portfolio OS</span>
                <button
                  type="button"
                  onClick={dismissBoot}
                  className="rounded-full border border-[var(--aurora-border)] bg-[var(--aurora-surface)] px-2.5 py-1 text-[10px] tracking-wider text-[var(--aurora-text-secondary)] transition hover:border-[var(--aurora-primary)] hover:text-[var(--aurora-primary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-primary)] cursor-pointer"
                  aria-label="Skip boot sequence"
                >
                  Skip [Esc]
                </button>
              </div>
              <div className="space-y-3">
                <p className="font-mono text-sm text-[var(--aurora-primary)]">{'>'} Booting Portfolio OS...</p>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--aurora-bg)]/80 border border-[var(--aurora-border)]">
                  <motion.div
                    className="h-full rounded-full bg-linear-to-r from-[var(--aurora-primary)] via-[var(--aurora-text)] to-[var(--aurora-accent)]"
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

      {/* Custom Glow Cursor (Active only after boot screen finishes on desktop) */}
      {!shouldReduceMotion && !isBooting && (
        <div className="pointer-events-none fixed inset-0 z-40 hidden md:block">
          <div className="glow-cursor" style={cursorStyle} />
        </div>
      )}

      {/* Ambient Aurora Midnight Background */}
      <div className="pointer-events-none fixed inset-0 opacity-65">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(108,140,255,0.16),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(167,139,250,0.14),transparent_24%),linear-gradient(180deg,#080D1B_0%,#050914_100%)]" />
        <div className="grid-overlay absolute inset-0" />
      </div>

      {/* Header with Responsive Cyber Navigation */}
      <header className="sticky top-0 z-30 border-b border-[var(--aurora-border)] bg-[#080D1B]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8 lg:px-10">
          {/* Cyber Brand Mark */}
          <a
            href="#hero"
            className="group flex items-center gap-3 rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-primary)]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--aurora-primary)]/40 bg-[var(--aurora-surface)] text-[var(--aurora-primary)] font-mono font-bold text-xs shadow-[0_0_12px_rgba(108,140,255,0.25)] transition duration-200 group-hover:scale-105 group-hover:border-[var(--aurora-primary)] group-hover:shadow-[0_0_18px_rgba(108,140,255,0.4)]">
              &gt;_
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--aurora-text)] transition group-hover:text-[var(--aurora-primary-soft)]">
                {settings?.developerName || 'Tarek'}
                <span className="text-[var(--aurora-accent)]">.SYS</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[var(--aurora-text-muted)]">
                PORTFOLIO
              </span>
            </div>
          </a>

          {/* Desktop Nav Dock */}
          <nav className="flex items-center gap-4 text-sm" aria-label="Main Navigation">
            <div className="hidden items-center gap-1 rounded-full border border-[var(--aurora-border)] bg-[var(--aurora-surface)]/75 px-4 py-1.5 shadow-[inset_0_1px_1px_rgba(244,246,255,0.06)] backdrop-blur-md md:flex">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3.5 py-1 text-xs font-medium tracking-wider text-[var(--aurora-text-secondary)] transition duration-200 hover:bg-[var(--aurora-primary)]/15 hover:text-[var(--aurora-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-primary)] focus-visible:text-[var(--aurora-primary-soft)]"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              ref={mobileToggleRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--aurora-border)] bg-[var(--aurora-surface)] text-[var(--aurora-text)] md:hidden transition hover:border-[var(--aurora-primary)] hover:text-[var(--aurora-primary-soft)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-primary)]"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </nav>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-navigation"
              ref={mobileNavRef}
              role="region"
              aria-label="Mobile Navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-[var(--aurora-border)] bg-[#080D1B]/95 px-6 py-5 backdrop-blur-2xl md:hidden"
            >
              <nav className="flex flex-col gap-4 text-sm">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="py-1 text-[var(--aurora-text-secondary)] transition hover:text-[var(--aurora-primary-soft)] focus-visible:outline-none focus-visible:text-[var(--aurora-primary-soft)]"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area with Accessible Skip Target */}
      <main id="main-content" tabIndex={-1} className="relative z-10 focus:outline-none">
        <Hero />
        <div className="glow-line max-w-7xl mx-auto my-4 opacity-50" />
        <Skills />
        <div className="glow-line max-w-7xl mx-auto my-4 opacity-50" />
        <Projects />
        <div className="glow-line max-w-7xl mx-auto my-4 opacity-50" />
        <Contact />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--aurora-border)] bg-[#080D1B]/90 py-12 text-xs text-[var(--aurora-text-muted)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-5 sm:flex-row sm:px-8 lg:px-10">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-[var(--aurora-text)] font-semibold tracking-wide">
              <span>{settings?.developerName || 'Tarek'}</span>
              <span className="text-[var(--aurora-accent)] font-mono text-[11px]">// PORTFOLIO</span>
            </div>
            <p className="text-[var(--aurora-primary-soft)] text-xs">
              {settings?.professionalTitle || 'Frontend Developer | React Specialist'}
            </p>
            <p className="font-mono text-[10px] text-[var(--aurora-text-muted)] pt-1">
              © {new Date().getFullYear()} {settings?.developerName || 'Tarek'}. All rights reserved.
            </p>
          </div>

          {/* Quick Nav Links in Footer */}
          <div className="flex items-center gap-6 font-mono text-xs text-[var(--aurora-text-secondary)]">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition hover:text-[var(--aurora-primary-soft)] focus-visible:outline-none focus-visible:text-[var(--aurora-primary-soft)]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#hero"
              aria-label="Back to top of page"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--aurora-primary)]/35 bg-[var(--aurora-surface)] px-4 py-2 text-xs font-mono uppercase tracking-wider text-[var(--aurora-text)] shadow-[0_0_12px_rgba(108,140,255,0.12)] transition hover:border-[var(--aurora-primary)] hover:bg-[var(--aurora-primary)]/15 hover:text-[var(--aurora-text)] hover:shadow-[0_0_18px_rgba(108,140,255,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-primary)]"
            >
              <span>Back to Top</span>
              <FiArrowUp className="h-3.5 w-3.5 text-[var(--aurora-primary)]" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
