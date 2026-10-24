import * as React from 'react';
import { Slot } from 'radix-ui';
import { cn } from '@/lib/utils';
import { badgeVariants } from './variants';

export function Badge({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot.Root : 'span';
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export default Badge;
