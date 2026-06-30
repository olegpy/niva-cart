import { useId, type ComponentProps } from 'react';
import { cn } from '@/shared/lib/cn';

export type TextareaProps = ComponentProps<'textarea'> & {
  invalid?: boolean;
};

export function Textarea({
  ref,
  className,
  invalid,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
  id,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const isInvalid = Boolean(invalid) || ariaInvalid === true || ariaInvalid === 'true';

  return (
    <textarea
      ref={ref}
      id={textareaId}
      aria-invalid={isInvalid || undefined}
      aria-describedby={ariaDescribedBy}
      className={cn(
        'w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50',
        isInvalid && 'border-red-500 focus-visible:ring-red-500',
        className,
      )}
      {...props}
    />
  );
}
