import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'mpesa' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = ({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: 'bg-primary text-white shadow-medium hover:opacity-90 active:scale-95',
    secondary: 'bg-emerald-600 text-white shadow-medium hover:opacity-90 active:scale-95',
    outline: 'border-2 border-primary/20 text-primary hover:bg-primary/5 active:scale-95',
    ghost: 'text-neutral-textMid hover:bg-neutral-background active:scale-95',
    danger: 'bg-accent-red text-white hover:bg-accent-red/90 shadow-subtle active:scale-95',
    mpesa: 'bg-mpesa-green text-white hover:bg-mpesa-green/90 shadow-subtle active:scale-95',
    link: 'text-primary hover:underline p-0 h-auto',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs font-bold uppercase tracking-wider',
    md: 'px-6 py-3 text-sm font-bold',
    lg: 'px-8 py-4 text-base font-bold',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-button font-heading transition-standard focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2.5">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2.5">{rightIcon}</span>}
    </button>
  );
};
