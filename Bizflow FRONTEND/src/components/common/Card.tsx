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
}

export const Card = ({ children, className, onClick, hover }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-neutral-cardBg rounded-card border border-neutral-border shadow-subtle p-4',
        hover && 'hover:shadow-medium transition-standard cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};
