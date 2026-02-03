import * as React from 'react';
import { cn } from '@/shared/utils/cn';

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  }
>(function Button({ className, variant = 'primary', ...props }, ref) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants: Record<string, string> = {
    primary: 'bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-900',
    secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus:ring-zinc-400',
    ghost: 'bg-transparent text-zinc-900 hover:bg-zinc-100 focus:ring-zinc-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
  };

  return <button ref={ref} className={cn(base, variants[variant], className)} {...props} />;
});
