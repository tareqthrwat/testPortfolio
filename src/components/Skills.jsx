import { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { usePortfolio } from '../context/usePortfolio';
import SkillIcon from './admin/SkillIcon';
import { FiCpu } from 'react-icons/fi';

function Skills({ skills: propSkills }) {
  const { skills: contextSkills } = usePortfolio();
  const shouldReduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Read skills from prop or PortfolioContext, filter public visibility, and sort by displayOrder
  const allSkills = useMemo(() => {
    return (propSkills || contextSkills)
      .filter((skill) => skill.visibility === 'public' || skill.visibility === undefined)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [propSkills, contextSkills]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set();
    allSkills.forEach((s) => {
      if (s.category && s.category.trim()) {
        cats.add(s.category.trim());
      }
    });
    return ['ALL', ...Array.from(cats)];
  }, [allSkills]);

  // Filter skills based on active category
  const filteredSkills = useMemo(() => {
    if (activeCategory === 'ALL') return allSkills;
    return allSkills.filter(
      (s) => s.category?.trim().toLowerCase() === activeCategory.toLowerCase()
    );
  }, [allSkills, activeCategory]);

  return (
    <section id="skills" className="relative px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.5 }}
          className="mb-12 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--aurora-primary)]/30 bg-[var(--aurora-surface)]/80 px-3 py-1 text-xs font-mono uppercase tracking-[0.25em] text-[var(--aurora-primary-soft)]">
            <FiCpu className="h-3.5 w-3.5 text-[var(--aurora-primary)]" />
            <span>Technical Skills</span>
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--aurora-text)] sm:text-4xl lg:text-5xl">
            Core Competencies &amp; Tech Stack.
          </h2>
          <p className="mt-3 text-base text-[var(--aurora-text-secondary)] sm:text-lg">
            Frontend technologies, styling tools, and libraries used to build modern web applications.
          </p>
        </motion.div>

        {/* Category Filter Pills (if multiple categories present) */}
        {categories.length > 2 && (
          <div className="mb-8 flex flex-wrap items-center gap-2.5">
            <span className="mr-2 text-xs font-mono uppercase tracking-widest text-[var(--aurora-text-muted)]">
              Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-primary)] ${
                  activeCategory === cat
                    ? 'border border-[var(--aurora-primary)] bg-[var(--aurora-primary)]/20 text-[var(--aurora-text)] shadow-[0_0_14px_rgba(108,140,255,0.28)]'
                    : 'border border-[var(--aurora-border)] bg-[var(--aurora-surface)]/70 text-[var(--aurora-text-secondary)] hover:border-[var(--aurora-primary)]/45 hover:text-[var(--aurora-text)]'
                }`}
              >
                {cat === 'ALL' ? 'All Modules' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Skills Cards Grid */}
        {filteredSkills.length === 0 ? (
          <div className="glass-panel rounded-2xl py-12 text-center text-sm font-mono text-[var(--aurora-text-muted)]">
            No capability metrics currently published for this criteria.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSkills.map((skill, index) => {
              const proficiencyValue =
                skill.proficiency !== undefined
                  ? Number(skill.proficiency)
                  : Number(skill.level ?? 80);
              const safePercentage = Math.min(Math.max(proficiencyValue, 0), 100);

              const staggerDelay = shouldReduceMotion ? 0 : Math.min(index * 0.05, 0.3);

              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: shouldReduceMotion ? 0.05 : 0.45,
                    delay: staggerDelay,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="cyber-card group relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 hover:border-[var(--aurora-primary)]/45 hover:shadow-[0_0_24px_rgba(108,140,255,0.16)]"
                >
                  <div>
                    {/* Top Row: Icon + Names + Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <motion.div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--aurora-border)] bg-[#080D1B]/60 text-[var(--aurora-primary)] transition-all duration-300 group-hover:scale-105 group-hover:border-[var(--aurora-primary)]/55 group-hover:bg-[var(--aurora-primary)]/15 group-hover:text-[var(--aurora-accent-soft)]"
                          whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
                          transition={{ duration: 0.2 }}
                        >
                          <SkillIcon
                            iconIdentifier={skill.iconIdentifier}
                            skillName={skill.name}
                            className="h-6 w-6 shrink-0"
                          />
                        </motion.div>
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-[var(--aurora-text)] tracking-wide text-base transition-colors group-hover:text-[var(--aurora-primary-soft)]">
                            {skill.name}
                          </h3>
                          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--aurora-text-muted)]">
                            {skill.category || 'Framework / Lib'}
                          </span>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-md border border-[var(--aurora-accent)]/35 bg-[var(--aurora-accent)]/12 px-2 py-0.5 font-mono text-xs font-bold text-[var(--aurora-accent-soft)]">
                        {safePercentage}%
                      </span>
                    </div>

                    {/* Progress Bar Container with Accessibility Attributes */}
                    <div className="mt-6 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-[var(--aurora-text-muted)]">
                        <span>PROFICIENCY</span>
                        <span>{safePercentage}%</span>
                      </div>

                      <div
                        className="relative h-2.5 overflow-hidden rounded-full bg-[#080D1B]/80 border border-[var(--aurora-border)]/60 p-[2px]"
                        role="progressbar"
                        aria-valuenow={safePercentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${skill.name} proficiency`}
                      >
                        <motion.div
                          className="relative h-full rounded-full bg-linear-to-r from-[var(--aurora-primary)] via-[#8CA4FF] to-[var(--aurora-accent)] shadow-[0_0_12px_rgba(108,140,255,0.4)]"
                          initial={{ width: shouldReduceMotion ? `${safePercentage}%` : 0 }}
                          whileInView={{ width: `${safePercentage}%` }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{
                            duration: shouldReduceMotion ? 0 : 0.85,
                            ease: [0.16, 1, 0.3, 1],
                            delay: shouldReduceMotion ? 0 : staggerDelay + 0.05,
                          }}
                        >
                          {/* Static subtle endpoint accent highlight (visible when > 0%) */}
                          {safePercentage > 0 && (
                            <span className="absolute right-0 top-0 bottom-0 w-1.5 rounded-full bg-[var(--aurora-text)] shadow-[0_0_8px_#F4F6FF]" />
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Skills;
