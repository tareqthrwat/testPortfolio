import { motion, useReducedMotion } from 'framer-motion';
import { usePortfolio } from '../context/usePortfolio';
import { Badge } from './ui/badge';
import { FiExternalLink, FiGithub, FiLayers, FiFolder } from 'react-icons/fi';

export default function Projects({ projects: propProjects }) {
  const { projects: contextProjects } = usePortfolio();
  const shouldReduceMotion = useReducedMotion();

  // Use provided prop or fallback to PortfolioContext, filtering for public visibility and sorting by order
  const projectsToDisplay = (propProjects || contextProjects)
    .filter((project) => project.visibility === 'public' || project.visibility === undefined)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <section id="projects" className="relative px-5 py-24 sm:px-8 lg:px-10">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[var(--aurora-primary)]/8 blur-3xl" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.5 }}
          className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-[var(--aurora-border)] pb-10"
        >
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.35em] text-[var(--aurora-primary)]">
                [ 01 // ARCHITECTURE & BUILDS ]
              </span>
              <Badge variant="default" size="sm" className="font-mono">
                {projectsToDisplay.length} Published
              </Badge>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--aurora-text)] sm:text-5xl">
              Featured <span className="cyber-gradient-text">Projects</span>
            </h2>
            <p className="text-sm leading-relaxed text-[var(--aurora-text-secondary)] sm:text-base">
              Interactive systems, modular state architectures, and web interfaces built with modern
              frontend technologies.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-[var(--aurora-text-muted)]">
            <span className="flex items-center gap-1.5">
              <FiLayers className="text-[var(--aurora-accent)]" />
              SELECTED WORK
            </span>
          </div>
        </motion.div>

        {projectsToDisplay.length === 0 ? (
          <div className="cyber-card rounded-3xl p-16 text-center text-[var(--aurora-text-muted)]">
            <FiFolder className="mx-auto h-10 w-10 text-[var(--aurora-primary)]/40 mb-3" />
            <p className="text-base font-mono">No public projects currently available.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projectsToDisplay.map((project, index) => {
              const imageSrc = project.imageUrl || project.imageLabel;
              const isTextOnlyImage =
                typeof imageSrc === 'string' &&
                (imageSrc.startsWith('STUDIO') ||
                  (!imageSrc.includes('/') &&
                    !imageSrc.startsWith('http') &&
                    !imageSrc.startsWith('data:')));

              const techStack = Array.isArray(project.technologies)
                ? project.technologies
                : Array.isArray(project.techStack)
                ? project.techStack
                : [];

              const description =
                project.shortDescription || project.fullDescription || project.description || '';

              const hasLiveUrl =
                Boolean(project.liveUrl?.trim()) &&
                !project.liveUrl.toLowerCase().includes('example.com');
              const hasGithubUrl =
                Boolean(project.githubUrl?.trim()) &&
                project.githubUrl.trim().replace(/\/+$/, '').toLowerCase() !==
                  'https://github.com' &&
                !project.githubUrl.toLowerCase().includes('example.com');

              const staggerDelay = shouldReduceMotion ? 0 : Math.min(index * 0.08, 0.35);

              return (
                <motion.article
                  key={project.id}
                  className="cyber-card hud-corner group relative flex flex-col justify-between overflow-hidden rounded-[2rem] p-5 sm:p-6"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: shouldReduceMotion ? 0.05 : 0.5,
                    delay: staggerDelay,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  whileHover={
                    shouldReduceMotion
                      ? {}
                      : {
                          y: -6,
                        }
                  }
                >
                  {/* Top Meta Bar */}
                  <div className="mb-4 flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-2 text-[var(--aurora-text-muted)] uppercase tracking-wider">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--aurora-primary)]" />
                      {project.category || 'Engineering'}
                    </span>

                    {/* Featured Chip */}
                    {project.featured && (
                      <Badge
                        variant="featured"
                        size="sm"
                        className="gap-1.5 shadow-[0_0_12px_rgba(167,139,250,0.25)]"
                      >
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--aurora-accent)] opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--aurora-accent)]" />
                        </span>
                        Featured
                      </Badge>
                    )}
                  </div>

                  <div>
                    {/* Visual Media Showcase Frame */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--aurora-border)] bg-[#080D1B]/80 shadow-inner">
                      {imageSrc && !isTextOnlyImage ? (
                        <>
                          <img
                            src={imageSrc}
                            alt={`Preview screenshot of ${project.title}`}
                            className="h-full w-full object-cover object-top transition duration-700 ease-out group-hover:scale-105 filter group-hover:brightness-105"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div
                            style={{ display: 'none' }}
                            className="flex h-full w-full items-center justify-center bg-[#080D1B]/85 px-4 text-center font-mono text-xs uppercase tracking-widest text-[var(--aurora-text-muted)]"
                          >
                            Preview Unavailable
                          </div>
                        </>
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,#151D33_0%,#080D1B_100%)] p-6 text-center">
                          <FiFolder className="h-8 w-8 text-[var(--aurora-accent)]/70 mb-2" />
                          <p className="font-mono text-xs uppercase tracking-widest text-[var(--aurora-primary-soft)]">
                            {project.category || 'Project Preview'}
                          </p>
                        </div>
                      )}

                      {/* Subtle futuristic bottom gradient line */}
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-[#080D1B]/85 to-transparent pointer-events-none" />
                    </div>

                    {/* Content Section */}
                    <div className="mt-6">
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--aurora-text)] transition duration-200 group-hover:text-[var(--aurora-primary-soft)]">
                        {project.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-[var(--aurora-text-secondary)] line-clamp-3">
                        {description}
                      </p>

                      {/* Tech Stack Chips */}
                      {techStack.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {techStack.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-md border border-[var(--aurora-primary)]/25 bg-[var(--aurora-primary)]/10 px-2.5 py-1 text-[11px] font-mono text-[var(--aurora-text)] transition hover:border-[var(--aurora-accent)]/50 hover:bg-[var(--aurora-accent)]/15"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Link Footer */}
                  {(hasLiveUrl || hasGithubUrl) && (
                    <div className="mt-7 flex items-center gap-3 border-t border-[var(--aurora-border)] pt-4">
                      {hasLiveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open live demo of ${project.title}`}
                          className="neon-button inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#080D1B] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-primary)]"
                        >
                          <span>Live Demo</span>
                          <FiExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {hasGithubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open GitHub repository of ${project.title}`}
                          className={`inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--aurora-border)] bg-[#080D1B]/60 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--aurora-text-secondary)] transition hover:border-[var(--aurora-primary)]/55 hover:bg-[var(--aurora-surface-hover)] hover:text-[var(--aurora-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-primary)] ${
                            hasLiveUrl ? 'flex-1' : 'w-full'
                          }`}
                        >
                          <FiGithub className="h-3.5 w-3.5" />
                          <span>Code</span>
                        </a>
                      )}
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
