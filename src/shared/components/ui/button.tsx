import { type ComponentProps } from 'react';
import { cn } from '@/shared/lib/cn';

const buttonBase =
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

/** Brand colors: red = primary, blue = storefront actions, gray = neutral */
const buttonVariants = {
  default:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  secondary:
    'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
  destructive:
    'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
  outline:
    'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400',
  ghost:
    'text-gray-600 hover:text-gray-900 focus-visible:ring-red-500',
  link:
    'text-xs text-gray-400 hover:text-gray-600 focus-visible:ring-red-500',
} as const;

const buttonSizes = {
  xs: 'rounded px-2 py-1 text-sm',
  sm: 'rounded px-3 py-1 text-sm',
  default: 'rounded-lg px-4 py-2 text-sm',
  lg: 'rounded-lg px-6 py-3 text-sm',
  icon: 'h-10 w-10 shrink-0 rounded-lg text-sm',
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

type ButtonBaseProps = Omit<ComponentProps<'button'>, 'type'> & {
  loading?: boolean;
  variant?: ButtonVariant;
  type?: 'button' | 'submit' | 'reset';
};

type DefaultSizeButtonProps = ButtonBaseProps & {
  size?: Exclude<ButtonSize, 'icon'>;
};

type IconSizeButtonProps = ButtonBaseProps & {
  size: 'icon';
  'aria-label': string;
};

export type ButtonProps = DefaultSizeButtonProps | IconSizeButtonProps;

export function Button({
  ref,
  className,
  variant = 'default',
  size = 'default',
  type = 'button',
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export { buttonVariants, buttonSizes };

/** Use on form submit buttons (Sign in, Start chat, etc.) */
export const formButtonClassName = 'w-full';
