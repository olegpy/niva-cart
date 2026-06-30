import { useId, type ComponentProps } from 'react';
import { cn } from '@/shared/lib/cn';

export type InputProps = ComponentProps<'input'> & {
  invalid?: boolean;
};

export function Input({
  ref,
  className,
  type,
  invalid,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const isInvalid = Boolean(invalid) || ariaInvalid === true || ariaInvalid === 'true';

  return (
    <input
      ref={ref}
      id={inputId}
      type={type}
      aria-invalid={isInvalid || undefined}
      aria-describedby={ariaDescribedBy}
      className={cn(
        'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50',
        isInvalid && 'border-red-500 focus-visible:ring-red-500',
        className,
      )}
      {...props}
    />
  );
}
