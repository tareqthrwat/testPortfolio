import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all select-none',
  {
    variants: {
      variant: {
        default:
          'border border-[var(--aurora-primary)]/35 bg-[var(--aurora-primary)]/12 text-[var(--aurora-primary-soft)] shadow-[0_0_12px_rgba(108,140,255,0.18)]',
        secondary:
          'border border-[var(--aurora-border)] bg-[var(--aurora-surface)]/80 text-[var(--aurora-text-secondary)] backdrop-blur-md hover:border-[var(--aurora-primary)]/45 hover:bg-[var(--aurora-surface-hover)] hover:text-[var(--aurora-text)]',
        outline:
          'border border-[var(--aurora-border)] text-[var(--aurora-text)] bg-transparent',
        featured:
          'border border-[var(--aurora-accent)]/50 bg-[var(--aurora-surface)]/90 text-[var(--aurora-accent-soft)] backdrop-blur-md shadow-[0_0_14px_rgba(167,139,250,0.25)]',
        purple:
          'border border-[var(--aurora-accent)]/35 bg-[var(--aurora-accent)]/12 text-[var(--aurora-accent-soft)] shadow-[0_0_12px_rgba(167,139,250,0.18)]',
        destructive:
          'border border-red-500/30 bg-red-500/15 text-red-400',
      },
      size: {
        sm: 'px-2.5 py-0.5 text-[10px] tracking-widest',
        default: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
