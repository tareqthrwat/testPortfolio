import * as React from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

function TooltipProvider({ delayDuration = 200, ...props }) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({ ...props }) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({ ...props }) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" asChild {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 6,
  children,
  ...props
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'aurora-tooltip z-50 overflow-hidden rounded-lg border border-[#6C8CFF]/35 bg-[#151D33]/95 px-3 py-1.5 text-xs text-[#F4F6FF] shadow-[0_4px_24px_rgba(108,140,255,0.24)] backdrop-blur-md animate-in fade-in-0 zoom-in-95',
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="fill-[#151D33]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
