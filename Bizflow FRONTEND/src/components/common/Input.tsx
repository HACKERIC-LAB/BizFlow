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
        {label && <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 ml-1">{label}</label>}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-coffee-700 transition-standard">
              {leftIcon}
            </div>
          )}
          {prefix && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-600 font-bold text-sm border-r border-coffee-200/50 pr-3 group-focus-within:border-coffee-700/30 transition-standard">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-white border-2 border-coffee-200 rounded-[1.25rem] px-4 py-3.5 text-sm font-medium text-coffee-900 placeholder:text-neutral-500 focus:outline-none focus:bg-white focus:border-coffee-700 focus:ring-4 focus:ring-coffee-700/10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-coffee-400/50 transition-standard',
              leftIcon && 'pl-12',
              prefix && 'pl-20',
              error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10 bg-red-500/5',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-coffee-700 transition-standard">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
