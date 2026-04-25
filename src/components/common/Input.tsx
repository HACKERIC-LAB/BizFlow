import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  prefix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, prefix, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && <label className="label-text text-neutral-textMid">{label}</label>}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-textLight">
              {leftIcon}
            </div>
          )}
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-textMid font-medium border-r border-neutral-border pr-2">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-white border border-neutral-border rounded-input px-3 py-2 text-base placeholder:text-neutral-textLight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-standard',
              leftIcon && 'pl-10',
              prefix && 'pl-16',
              error && 'border-accent-red focus:ring-accent-red/20 focus:border-accent-red',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-textLight">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-accent-red font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
