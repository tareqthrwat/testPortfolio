import { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  FiMail,
  FiGithub,
  FiLinkedin,
  FiSend,
  FiCheck,
  FiCopy,
  FiExternalLink,
  FiAlertCircle,
  FiEdit3,
} from 'react-icons/fi';
import { usePortfolio } from '../context/usePortfolio';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export default function Contact() {
  const { settings } = usePortfolio();
  const shouldReduceMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copyStatus, setCopyStatus] = useState('idle'); // 'idle' | 'copied' | 'failed'
  const copyTimeoutRef = useRef(null);

  const rawEmail = settings?.email?.trim() || '';
  const isValidEmail =
    Boolean(rawEmail) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail) &&
    rawEmail.toLowerCase() !== 'tarek@example.com' &&
    !rawEmail.toLowerCase().endsWith('@example.com');
  const contactEmail = isValidEmail ? rawEmail : '';
  const developerName = settings?.developerName?.trim() || 'Tarek';

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

  // Clean up copy feedback timer on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Please provide your name';
    if (!formData.email.trim()) {
      errors.email = 'Please provide your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address';
    }
    if (!formData.message.trim()) errors.message = 'Please enter a message';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contactEmail) return;

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    // Construct functional, URL-encoded mailto URL
    const emailSubject =
      formData.subject.trim() || `Portfolio Contact from ${formData.name.trim()}`;
    const emailBody = `Sender Name: ${formData.name.trim()}\nSender Email: ${formData.email.trim()}\n\nMessage:\n${formData.message.trim()}`;

    const mailtoUrl = `mailto:${encodeURIComponent(contactEmail)}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;

    // Trigger user's default email client
    try {
      window.location.href = mailtoUrl;
    } catch {
      // In restricted or sandboxed iframes, window.location.href may fail safely
    }

    setIsSubmitted(true);
  };

  const handleCopyEmail = () => {
    if (!contactEmail) return;

    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }

    if (!navigator?.clipboard?.writeText) {
      setCopyStatus('failed');
      copyTimeoutRef.current = setTimeout(() => setCopyStatus('idle'), 3000);
      return;
    }

    navigator.clipboard
      .writeText(contactEmail)
      .then(() => {
        setCopyStatus('copied');
        copyTimeoutRef.current = setTimeout(() => setCopyStatus('idle'), 2500);
      })
      .catch(() => {
        setCopyStatus('failed');
        copyTimeoutRef.current = setTimeout(() => setCopyStatus('idle'), 3000);
      });
  };

  return (
    <section id="contact" className="relative px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.5 }}
          className="mb-12 max-w-3xl"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.38em] text-[var(--aurora-primary)]">
              Get in Touch
            </span>
          </div>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl text-[var(--aurora-text)]">
            Let&apos;s connect and build something extraordinary.
          </h2>
          <p className="mt-3 text-base text-[var(--aurora-text-secondary)]">
            Have a project inquiry or want to discuss modern frontend development? Reach out
            through the channels below.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Left Column: Direct Info Cards */}
          <motion.div
            className="space-y-6 lg:col-span-5"
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.5 }}
          >
            <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-[var(--aurora-border)] pb-5">
                <span className="text-xs uppercase tracking-widest text-[var(--aurora-text-muted)]">
                  Contact Channels
                </span>
                <span className="text-xs font-mono text-[var(--aurora-accent-soft)]">
                  Direct &amp; Social
                </span>
              </div>

              <div className="mt-6 space-y-6">
                {contactEmail && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[var(--aurora-text-muted)]">
                      Primary Direct Email
                    </p>
                    <div className="mt-2 flex items-center justify-between rounded-xl border border-[var(--aurora-border)] bg-[#080D1B]/65 px-4 py-3">
                      <a
                        href={`mailto:${contactEmail}`}
                        className="truncate text-sm font-mono text-[var(--aurora-primary-soft)] transition hover:text-[var(--aurora-text)] hover:underline"
                      >
                        {contactEmail}
                      </a>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={handleCopyEmail}
                              aria-label="Copy email address"
                              className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--aurora-border)] bg-[var(--aurora-surface)] text-[var(--aurora-text-secondary)] transition hover:border-[var(--aurora-primary)]/55 hover:bg-[var(--aurora-surface-hover)] hover:text-[var(--aurora-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-primary)]"
                            >
                              {copyStatus === 'copied' ? (
                                <FiCheck className="h-4 w-4 text-emerald-400" />
                              ) : copyStatus === 'failed' ? (
                                <FiAlertCircle className="h-4 w-4 text-amber-400" />
                              ) : (
                                <FiCopy className="h-4 w-4" />
                              )}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {copyStatus === 'copied'
                              ? 'Email copied to clipboard!'
                              : copyStatus === 'failed'
                              ? 'Copy failed — select email manually'
                              : 'Copy to clipboard'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--aurora-text-muted)]">
                    Developer Identity
                  </p>
                  <p className="mt-1 text-sm text-[var(--aurora-text)] font-medium">{developerName}</p>
                  <p className="text-xs text-[var(--aurora-primary-soft)]">
                    {settings?.professionalTitle || 'Frontend Developer'}
                  </p>
                </div>

                {(hasValidGithub || hasValidLinkedin || contactEmail) && (
                  <div className="border-t border-[var(--aurora-border)] pt-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[var(--aurora-text-muted)] mb-3">
                      Connect on Platforms
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {hasValidGithub && (
                        <a
                          href={settings.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-[var(--aurora-border)] bg-[#080D1B]/55 px-4 py-2 text-xs font-medium text-[var(--aurora-text-secondary)] transition hover:border-[var(--aurora-primary)]/55 hover:bg-[var(--aurora-surface-hover)] hover:text-[var(--aurora-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-primary)]"
                        >
                          <FiGithub className="h-4 w-4 text-[var(--aurora-primary)]" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {hasValidLinkedin && (
                        <a
                          href={settings.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-[var(--aurora-border)] bg-[#080D1B]/55 px-4 py-2 text-xs font-medium text-[var(--aurora-text-secondary)] transition hover:border-[var(--aurora-primary)]/55 hover:bg-[var(--aurora-surface-hover)] hover:text-[var(--aurora-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-primary)]"
                        >
                          <FiLinkedin className="h-4 w-4 text-[var(--aurora-primary)]" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {contactEmail && (
                        <a
                          href={`mailto:${contactEmail}`}
                          className="inline-flex items-center gap-2 rounded-full border border-[var(--aurora-border)] bg-[#080D1B]/55 px-4 py-2 text-xs font-medium text-[var(--aurora-text-secondary)] transition hover:border-[var(--aurora-primary)]/55 hover:bg-[var(--aurora-surface-hover)] hover:text-[var(--aurora-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-primary)]"
                        >
                          <FiMail className="h-4 w-4 text-[var(--aurora-accent)]" />
                          <span>Direct Mail</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Form or Email Client Prompt */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.5 }}
          >
            <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
              {isSubmitted ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--aurora-primary)]/45 bg-[var(--aurora-primary)]/12 text-[var(--aurora-primary)] shadow-[0_0_24px_rgba(108,140,255,0.22)]">
                    <FiExternalLink className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-[var(--aurora-text)]">
                    Email Client Launched
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--aurora-text-secondary)]">
                    Your message draft has been prepared and opened in your device's default email
                    application.
                  </p>
                  <div className="my-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200 text-left max-w-lg">
                    <p className="font-semibold uppercase tracking-wider text-amber-300 mb-1">
                      Action Required in Email App:
                    </p>
                    <p>
                      Please review the pre-filled message in your email client and press{' '}
                      <strong>Send</strong> to deliver your transmission.
                    </p>
                  </div>
                  <p className="text-xs text-[var(--aurora-text-muted)]">
                    If your email client did not open automatically, send directly to:{' '}
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-[var(--aurora-primary-soft)] font-mono underline ml-1"
                    >
                      {contactEmail}
                    </a>
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--aurora-border)] bg-[var(--aurora-surface)] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--aurora-text)] transition hover:border-[var(--aurora-primary)]/55 hover:bg-[var(--aurora-surface-hover)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-primary)]"
                  >
                    <FiEdit3 className="h-3.5 w-3.5" />
                    Edit Message / Return to Form
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-semibold uppercase tracking-wider text-[var(--aurora-text-secondary)] mb-1.5"
                      >
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        aria-invalid={Boolean(formErrors.name)}
                        aria-describedby={formErrors.name ? 'contact-name-error' : undefined}
                        className={`w-full rounded-xl border bg-[#080D1B]/70 px-4 py-3 text-sm text-[var(--aurora-text)] placeholder-[var(--aurora-text-muted)]/60 transition focus:border-[var(--aurora-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--aurora-primary)]/50 ${
                          formErrors.name ? 'border-red-500/60' : 'border-[var(--aurora-border)]'
                        }`}
                        placeholder="Your name"
                      />
                      {formErrors.name && (
                        <p id="contact-name-error" className="mt-1 text-xs text-red-400">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-semibold uppercase tracking-wider text-[var(--aurora-text-secondary)] mb-1.5"
                      >
                        Your Email *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        aria-invalid={Boolean(formErrors.email)}
                        aria-describedby={formErrors.email ? 'contact-email-error' : undefined}
                        className={`w-full rounded-xl border bg-[#080D1B]/70 px-4 py-3 text-sm text-[var(--aurora-text)] placeholder-[var(--aurora-text-muted)]/60 transition focus:border-[var(--aurora-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--aurora-primary)]/50 ${
                          formErrors.email ? 'border-red-500/60' : 'border-[var(--aurora-border)]'
                        }`}
                        placeholder="your.email@domain.com"
                      />
                      {formErrors.email && (
                        <p id="contact-email-error" className="mt-1 text-xs text-red-400">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-xs font-semibold uppercase tracking-wider text-[var(--aurora-text-secondary)] mb-1.5"
                    >
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-xl border border-[var(--aurora-border)] bg-[#080D1B]/70 px-4 py-3 text-sm text-[var(--aurora-text)] placeholder-[var(--aurora-text-muted)]/60 transition focus:border-[var(--aurora-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--aurora-primary)]/50"
                      placeholder="Project Opportunity / Collaboration"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold uppercase tracking-wider text-[var(--aurora-text-secondary)] mb-1.5"
                    >
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      aria-invalid={Boolean(formErrors.message)}
                      aria-describedby={formErrors.message ? 'contact-message-error' : undefined}
                      className={`w-full rounded-xl border bg-[#080D1B]/70 px-4 py-3 text-sm text-[var(--aurora-text)] placeholder-[var(--aurora-text-muted)]/60 transition focus:border-[var(--aurora-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--aurora-primary)]/50 ${
                        formErrors.message ? 'border-red-500/60' : 'border-[var(--aurora-border)]'
                      }`}
                      placeholder="Write your message here..."
                    />
                    {formErrors.message && (
                      <p id="contact-message-error" className="mt-1 text-xs text-red-400">
                        {formErrors.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                    {contactEmail ? (
                      <>
                        <button
                          type="submit"
                          className="neon-button inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.22em] text-[#080D1B] shadow-[0_0_20px_rgba(108,140,255,0.28)] transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aurora-primary)]"
                        >
                          <FiSend className="h-4 w-4" />
                          <span>Send Message</span>
                        </button>
                        <p className="text-[11px] text-[var(--aurora-text-muted)] max-w-xs">
                          Opens your default mail app with the formatted message ready to send.
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-[var(--aurora-text-muted)]">
                        Direct email is not currently configured. Please connect via the social
                        profiles listed.
                      </p>
                    )}
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
