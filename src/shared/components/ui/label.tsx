import type { LabelHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn('mb-1 block text-sm font-medium text-gray-700', className)}
      {...props}
    />
  );
}
