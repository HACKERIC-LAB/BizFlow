import { type ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  variant?: 'default' | 'primary' | 'secondaryTeal' | 'glass' | 'outline' | 'flat';
}

export const Card = ({ children, className, onClick, hover, variant = 'default' }: CardProps) => {
  const variants = {
    default: 'bg-white shadow-medium border border-coffee-200',
    primary: 'bg-coffee-700 text-white shadow-large border-none',
    secondaryTeal: 'bg-coffee-100 text-coffee-900 shadow-medium border border-coffee-300',
    glass: 'glass-card',
    outline: 'bg-transparent border-2 border-coffee-300',
    flat: 'bg-coffee-50 border border-coffee-200',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-card p-5 animate-fade-in',
        variants[variant],
        hover && 'hover:shadow-large hover:-translate-y-1 transition-standard cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};
