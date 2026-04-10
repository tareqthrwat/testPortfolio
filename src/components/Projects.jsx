import { motion } from 'framer-motion';



function Projects({ projects }) {
  return (
    <section id="projects" className="px-5 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.38em] text-[var(--color-cyan)]">Project Grid</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Responsive concept builds with neon depth, glass layers, and 3D hover energy.</h2>
          </div>
          <p className="max-w-2xl text-sm leading-8 text-white/68 sm:text-base">
            Each card is designed like a futuristic module, mixing visual previews, stack details, and interactive calls to action.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              className="glass-panel group overflow-hidden rounded-[2rem] p-5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: index * 0.1 }}
              whileHover={{ y: -10, rotateX: 4, rotateY: -6 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40">
                <img src={(project.imageLabel)} alt={project.title} className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
              </div>
              <div className="mt-5">
                <h3 className="text-2xl font-semibold">{project.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.techStack.map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs uppercase tracking-[0.22em] text-white/70">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="neon-button inline-flex flex-1 items-center justify-center rounded-full px-4 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-950"
                  >
                    Live Demo
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white/82 transition hover:border-[var(--color-purple)]/45 hover:text-white"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
