import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    const variants = {
      primary: 'bg-lime-500 text-black hover:bg-lime-400 shadow-[0_4px_14px_0_rgba(132,204,22,0.39)]',
      secondary: 'bg-zinc-800 text-white hover:bg-zinc-700',
      outline: 'border border-zinc-700 bg-transparent hover:bg-zinc-800 text-white',
      ghost: 'hover:bg-zinc-800 text-zinc-400',
    };
    const sizes = {
      default: 'h-11 px-6 py-2 rounded-2xl',
      sm: 'h-9 rounded-xl px-3',
      lg: 'h-14 rounded-3xl px-8',
      icon: 'h-10 w-10',
    };
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer',
          variants[variant] || variants.primary,
          sizes[size] || sizes.default,
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-white ring-offset-black file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('rounded-3xl border border-white/5 bg-zinc-900 shadow-xl overflow-hidden', className)}>{children}</div>
);

export const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-lime-500/10 text-lime-500 uppercase tracking-wide', className)}>
    {children}
  </span>
);

export interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({ value, onValueChange, min = 0, max = 100, step = 1, className }) => {
  const currentVal = value && value.length > 0 ? value[0] : 0;
  
  return (
    <div className={cn('relative w-full h-6 flex items-center group touch-none select-none', className)}>
      <div className="absolute w-full h-1.5 bg-zinc-800 rounded-full" />
      <div 
        className="absolute h-1.5 bg-lime-500 rounded-full" 
        style={{ width: `${((currentVal - min) / (max - min)) * 100}%` }} 
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentVal}
        onChange={(e) => onValueChange([parseInt(e.target.value) || 0])}
        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div 
        className="absolute w-5 h-5 bg-white border-2 border-lime-500 rounded-full shadow-lg pointer-events-none transition-transform group-hover:scale-125"
        style={{ left: `calc(${((currentVal - min) / (max - min)) * 100}% - 10px)` }}
      />
    </div>
  );
};