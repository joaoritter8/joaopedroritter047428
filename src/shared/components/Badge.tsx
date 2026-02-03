import * as React from 'react'
import { cn } from '@/shared/utils/cn'

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700', className)}
      {...props}
    />
  )
}
