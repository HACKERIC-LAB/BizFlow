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
  variant?: 'default' | 'primary' | 'secondary' | 'glass' | 'outline' | 'flat';
}

export const Card = ({ children, className, onClick, hover, variant = 'default' }: CardProps) => {
  const variants = {
    default: 'bg-white shadow-medium border border-coffee-100',
    primary: 'bg-coffee-900 text-white shadow-large border-none',
    secondary: 'bg-coffee-50 text-coffee-900 shadow-medium border border-coffee-200',
    glass: 'glass-card',
    outline: 'bg-transparent border-2 border-coffee-200',
    flat: 'bg-coffee-50 border border-coffee-200',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-card p-5',
        variants[variant],
        hover && 'hover:shadow-large hover:-translate-y-1 hover:scale-[1.02] active:scale-95 transition-standard cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};
