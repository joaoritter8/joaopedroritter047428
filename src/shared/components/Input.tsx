import * as React from 'react';
import { cn } from '@/shared/utils/cn';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none shadow-sm focus:ring-2 focus:ring-zinc-400',
        className,
      )}
      {...props}
    />
  );
});
