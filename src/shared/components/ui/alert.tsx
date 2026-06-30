import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

const alertVariants = {
  destructive: 'border border-red-200 bg-red-50 text-sm text-red-600',
} as const;

export type AlertVariant = keyof typeof alertVariants;

export interface AlertProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: AlertVariant;
  children: ReactNode;
}

export function Alert({ variant = 'destructive', className, children, ...props }: AlertProps) {
  return (
    <p
      role="alert"
      aria-live="assertive"
      className={cn('rounded-lg px-3 py-2', alertVariants[variant], className)}
      {...props}
    >
      {children}
    </p>
  );
}
