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
      <div className="w-full space-y-2 animate-fade-in">
        {label && <label className="text-xs font-bold uppercase tracking-widest text-neutral-textLight ml-1">{label}</label>}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-textLight group-focus-within:text-primary transition-standard">
              {leftIcon}
            </div>
          )}
          {prefix && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-textMid font-bold text-sm border-r border-neutral-border/50 pr-3 group-focus-within:border-primary/30 transition-standard">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-neutral-background/50 border-2 border-transparent rounded-[1.25rem] px-4 py-3.5 text-sm font-medium text-neutral-darkNavy placeholder:text-neutral-textLight focus:outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 shadow-subtle hover:bg-neutral-background transition-standard',
              leftIcon && 'pl-12',
              prefix && 'pl-20',
              error && 'border-accent-red/20 focus:border-accent-red focus:ring-accent-red/5 bg-accent-red/5',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-textLight group-focus-within:text-primary transition-standard">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-[10px] font-bold text-accent-red uppercase tracking-wider ml-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
