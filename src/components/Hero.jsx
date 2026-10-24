import { useEffect, useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import profilePhoto from '../assets/profile-photo.png';
import { usePortfolio } from '../context/usePortfolio';
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiFileText,
  FiArrowRight,
  FiTerminal,
  FiCpu,
  FiCode,
  FiActivity,
} from 'react-icons/fi';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export default function Hero() {
  const { settings, projects, skills } = usePortfolio();
  const shouldReduceMotion = useReducedMotion();

  const developerName = settings?.developerName || 'Tarek';
  const professionalTitle =
    settings?.professionalTitle || 'Frontend Developer | React Specialist';
  const aboutMe =
    settings?.aboutMe ||
    'Still learning, still building, and focusing on what actually matters.';
  const profileImg = settings?.profileImageUrl || profilePhoto;

  const terminalSequence = useMemo(
    () => [
      `identity.set("${developerName}")`,
      `role.assign("${professionalTitle}")`,
      `focus.set("React & Modern Frontend Interfaces")`,
    ],
    [developerName, professionalTitle]
  );

  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Dynamic typing animation cycling through the terminal sequence
  useEffect(() => {
    const currentFullText = terminalSequence[sequenceIndex % terminalSequence.length];

    if (!isDeleting && displayText === currentFullText) {
      const pauseTimer = setTimeout(() => setIsDeleting(true), 2400);
      return () => clearTimeout(pauseTimer);
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setSequenceIndex((prev) => prev + 1);
      return;
    }

    const typeSpeed = isDeleting ? 30 : 55;
    const timer = setTimeout(() => {
      setDisplayText(
        isDeleting
          ? currentFullText.substring(0, displayText.length - 1)
          : currentFullText.substring(0, displayText.length + 1)
      );
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, sequenceIndex, terminalSequence]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const publicProjectsCount = useMemo(
    () =>
      Array.isArray(projects)
        ? projects.filter((p) => p.visibility === 'public' || p.visibility === undefined).length
        : 0,
    [projects]
  );
  const publicSkillsCount = useMemo(
    () =>
      Array.isArray(skills)
        ? skills.filter((s) => s.visibility === 'public' || s.visibility === undefined).length
        : 0,
    [skills]
  );

  const hasValidGithub = Boolean(
    settings?.githubUrl?.trim() &&
      settings.githubUrl.trim().replace(/\/+$/, '').toLowerCase() !== 'https://github.com' &&
      !settings.githubUrl.toLowerCase().includes('example.com')
  );
  const hasValidLinkedin = Boolean(
    settings?.linkedinUrl?.trim() &&
      settings.linkedinUrl.trim().replace(/\/+$/, '').toLowerCase() !== 'https://linkedin.com' &&
      settings.linkedinUrl.trim().replace(/\/+$/, '').toLowerCase() !== 'https://www.linkedin.com' &&
      !settings.linkedinUrl.toLowerCase().includes('example.com')
  );
  const hasValidResume = Boolean(
    settings?.resumeUrl?.trim() && !settings.resumeUrl.toLowerCase().includes('example.com')
  );

  return (
    <section id="hero" className="relative px-5 pt-12 pb-24 sm:px-8 lg:px-10 overflow-hidden">
      {/* Decorative Aurora Ambient Glows */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-[45rem] max-w-full bg-[radial-gradient(ellipse_at_center,rgba(108,140,255,0.14),rgba(167,139,250,0.08)_50%,transparent_70%)] blur-3xl" />

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Typographic Powerhouse */}
          <motion.div
            className="space-y-8 lg:col-span-7"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Portfolio Eyebrow Badge */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
              <div className="glass-panel inline-flex items-center gap-2.5 rounded-full border border-[var(--aurora-primary)]/35 bg-[var(--aurora-surface)]/80 px-4 py-1.5 text-xs font-mono uppercase tracking-[0.25em] text-[var(--aurora-primary-soft)] shadow-[0_0_16px_rgba(108,140,255,0.2)]">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--aurora-accent)]" />
                <span>DEVELOPER PORTFOLIO</span>
              </div>
            </motion.div>

            {/* Oversized High-Impact Headline */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl leading-[1.08]">
                <span className="block text-[var(--aurora-text)]">Designing Next-Gen</span>
                <span className="cyber-gradient-text block">Reactive Interfaces.</span>
              </h1>
              <p className="max-w-2xl text-lg sm:text-xl font-light text-[var(--aurora-primary-soft)] leading-relaxed">
                {professionalTitle}
              </p>
              <p className="max-w-2xl text-sm sm:text-base text-[var(--aurora-text-secondary)] leading-relaxed">
                {aboutMe}
              </p>
            </motion.div>

            {/* Decorative Terminal Element */}
            <motion.div variants={itemVariants}>
              <div className="cyber-card rounded-2xl p-4 sm:p-5 font-mono text-xs sm:text-sm shadow-2xl border border-[var(--aurora-border)]">
                <div className="mb-3 flex items-center justify-between border-b border-[var(--aurora-border)] pb-3 text-[var(--aurora-text-muted)]">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 flex items-center gap-1.5 text-[11px] text-[var(--aurora-text-secondary)]">
                      <FiTerminal className="h-3 w-3 text-[var(--aurora-primary)]" />
                      portfolio_shell.sh
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] tracking-wider uppercase">
                    <span>main</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[var(--aurora-text)]">
                  <span className="text-[var(--aurora-accent)] font-bold">{'>'}</span>
                  <span className="text-[var(--aurora-primary-soft)]">{displayText}</span>
                  <span className="inline-block h-4 w-2 bg-[var(--aurora-primary)] animate-pulse" />
                </div>
              </div>
            </motion.div>

            {/* CTA Hierarchy & Social Dock */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2"
            >
              {/* Primary CTA */}
              <motion.a
                href="#projects"
                className="neon-button inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 text-xs font-bold uppercase tracking-[0.25em] text-[#080D1B] shadow-[0_0_24px_rgba(108,140,255,0.32)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-primary)]"
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              >
                <span>Explore Projects</span>
                <FiArrowRight className="h-4 w-4" />
              </motion.a>

              {/* Secondary CTA */}
              <motion.a
                href="#contact"
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[var(--aurora-border)] bg-[var(--aurora-surface)]/80 px-7 py-4 text-xs font-bold uppercase tracking-[0.22em] text-[var(--aurora-text)] transition hover:border-[var(--aurora-primary)]/60 hover:bg-[var(--aurora-surface-hover)] hover:text-[var(--aurora-primary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-primary)]"
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              >
                <span>Initiate Contact</span>
                <FiMail className="h-3.5 w-3.5 text-[var(--aurora-accent)]" />
              </motion.a>

              {/* Social Connect Icons */}
              <TooltipProvider>
                <div className="flex items-center gap-2 pt-2 sm:pt-0 sm:ml-2">
                  {hasValidGithub && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.a
                          href={settings.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub Profile"
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--aurora-border)] bg-[var(--aurora-surface)]/80 text-[var(--aurora-text-secondary)] transition hover:border-[var(--aurora-primary)]/60 hover:bg-[var(--aurora-surface-hover)] hover:text-[var(--aurora-primary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-primary)]"
                          whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
                          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                        >
                          <FiGithub className="h-4 w-4" />
                        </motion.a>
                      </TooltipTrigger>
                      <TooltipContent>GitHub Profile</TooltipContent>
                    </Tooltip>
                  )}

                  {hasValidLinkedin && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.a
                          href={settings.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn Profile"
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--aurora-border)] bg-[var(--aurora-surface)]/80 text-[var(--aurora-text-secondary)] transition hover:border-[var(--aurora-primary)]/60 hover:bg-[var(--aurora-surface-hover)] hover:text-[var(--aurora-primary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-primary)]"
                          whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
                          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                        >
                          <FiLinkedin className="h-4 w-4" />
                        </motion.a>
                      </TooltipTrigger>
                      <TooltipContent>LinkedIn Profile</TooltipContent>
                    </Tooltip>
                  )}

                  {hasValidResume && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.a
                          href={settings.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View Resume"
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--aurora-border)] bg-[var(--aurora-surface)]/80 text-[var(--aurora-text-secondary)] transition hover:border-[var(--aurora-primary)]/60 hover:bg-[var(--aurora-surface-hover)] hover:text-[var(--aurora-primary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-primary)]"
                          whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
                          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                        >
                          <FiFileText className="h-4 w-4" />
                        </motion.a>
                      </TooltipTrigger>
                      <TooltipContent>View Resume</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </TooltipProvider>
            </motion.div>

            {/* Portfolio Content Summary */}
            <motion.div
              variants={itemVariants}
              className="grid max-w-md grid-cols-2 gap-6 border-t border-[var(--aurora-border)] pt-6"
            >
              <div>
                <p className="text-2xl font-bold text-[var(--aurora-text)] tracking-tight">{publicProjectsCount}</p>
                <p className="text-[11px] font-mono uppercase tracking-widest text-[var(--aurora-primary-soft)]">
                  Published Projects
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--aurora-text)] tracking-tight">{publicSkillsCount}</p>
                <p className="text-[11px] font-mono uppercase tracking-widest text-[var(--aurora-accent-soft)]">
                  Core Skills
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Developer Profile Card */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Ambient Background Aura */}
            <div className="absolute inset-0 -m-6 rounded-3xl bg-[radial-gradient(circle_at_center,rgba(108,140,255,0.2),rgba(167,139,250,0.14)_45%,transparent_70%)] blur-2xl pointer-events-none" />

            <div className="cyber-card hud-corner rounded-[2.5rem] p-6 sm:p-8">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[var(--aurora-border)] pb-4 text-xs font-mono uppercase tracking-[0.25em] text-[var(--aurora-text-muted)]">
                <span className="flex items-center gap-2">
                  <FiCpu className="h-3.5 w-3.5 text-[var(--aurora-primary)]" />
                  DEVELOPER PROFILE
                </span>
                <span className="text-[var(--aurora-accent-soft)] font-semibold">{developerName}</span>
              </div>

              {/* Framed Avatar with Orbital Halo */}
              <div className="relative my-8 flex items-center justify-center">
                {/* Outer Rotating Cyber Orbit */}
                <motion.div
                  className="portrait-orbit"
                  animate={shouldReduceMotion ? { rotate: 0 } : { rotate: 360 }}
                  transition={{ duration: 24, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                />

                {/* Inner Halo Glow */}
                <div className="portrait-halo absolute inset-0 m-auto h-64 w-64 rounded-full" />

                {/* Frame Container */}
                <motion.div
                  className="portrait-frame relative z-10 flex h-64 w-64 items-center justify-center rounded-full p-2.5 shadow-[0_0_50px_rgba(108,140,255,0.26)]"
                  animate={shouldReduceMotion ? { y: 0 } : { y: [0, -6, 0] }}
                  transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-full border border-[var(--aurora-border)] bg-[#080D1B]">
                    <img
                      src={profileImg}
                      alt={`Portrait of ${developerName}`}
                      className="h-full w-full object-cover object-top filter contrast-105"
                      onError={(e) => {
                        e.currentTarget.src = profilePhoto;
                      }}
                    />
                    {/* Futuristic Glass Gradient Lens */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_40%,rgba(8,13,27,0.4)_75%,rgba(8,13,27,0.85)_100%)]" />
                  </div>
                </motion.div>
              </div>

              {/* Focus Sub-Cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--aurora-primary)]/25 bg-[#080D1B]/60 p-4 transition hover:border-[var(--aurora-primary)]/55">
                  <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[var(--aurora-primary-soft)] mb-1">
                    <FiCode className="h-3.5 w-3.5 text-[var(--aurora-primary)]" />
                    <span>Stack Focus</span>
                  </div>
                  <p className="text-base font-bold text-[var(--aurora-text)]">React &amp; Tailwind</p>
                  <p className="text-[11px] text-[var(--aurora-text-muted)] mt-0.5">Component-driven UI</p>
                </div>

                <div className="rounded-xl border border-[var(--aurora-accent)]/25 bg-[#080D1B]/60 p-4 transition hover:border-[var(--aurora-accent)]/55">
                  <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[var(--aurora-accent-soft)] mb-1">
                    <FiActivity className="h-3.5 w-3.5 text-[var(--aurora-accent)]" />
                    <span>UI Focus</span>
                  </div>
                  <p className="text-base font-bold text-[var(--aurora-text)]">Interactive UI</p>
                  <p className="text-[11px] text-[var(--aurora-text-muted)] mt-0.5">Modern web interfaces</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
