import { motion } from 'framer-motion';

function Skills({ skills }) {
  return (
    <section id="skills" className="px-5 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-10 max-w-3xl"
        >
          <p className="text-sm uppercase tracking-[0.38em] text-[var(--color-cyan)]">Skill Matrix</p>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Animated capability tracking for the tools I build with most.</h2>
        </motion.div>

        <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <div className="grid gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <div className="mb-3 flex items-center justify-between text-sm uppercase tracking-[0.28em] text-white/66">
                  <span>{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    className="h-full rounded-full bg-linear-to-r from-[var(--color-cyan)] via-white to-[var(--color-purple)] shadow-[0_0_18px_rgba(0,245,255,0.35)]"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skills;
