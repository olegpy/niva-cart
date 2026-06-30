import { cloneElement, useId, type ReactElement } from 'react';
import { Label } from '@/shared/components/ui/label';

type FormControlProps = {
  id?: string;
  invalid?: boolean;
  'aria-describedby'?: string;
};

export interface FormFieldProps {
  label: string;
  id?: string;
  invalid?: boolean;
  describedBy?: string;
  labelClassName?: string;
  className?: string;
  children: ReactElement<FormControlProps>;
}

export function FormField({
  label,
  id,
  invalid,
  describedBy,
  labelClassName,
  className,
  children,
}: FormFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className={className}>
      <Label htmlFor={fieldId} className={labelClassName}>
        {label}
      </Label>
      {cloneElement(children, {
        id: fieldId,
        invalid: invalid ?? children.props.invalid,
        'aria-describedby': describedBy ?? children.props['aria-describedby'],
      })}
    </div>
  );
}
