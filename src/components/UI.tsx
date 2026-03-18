import React from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  ...props
}) => {
  const variants = {
    primary:
      'bg-orange-500 text-white hover:bg-orange-400 shadow-lg shadow-orange-500/20 active:scale-95',
    secondary: 'bg-slate-700 text-white hover:bg-slate-600 active:scale-95',
    danger: 'bg-red-500 text-white hover:bg-red-400 shadow-lg shadow-red-500/20 active:scale-95',
    ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95',
    outline:
      'bg-transparent border border-slate-700 text-slate-300 hover:bg-slate-800 active:scale-95',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-bold rounded-lg',
    md: 'px-6 py-3 text-sm font-bold rounded-xl',
    lg: 'px-8 py-4 text-base font-bold rounded-2xl',
    icon: 'p-3 rounded-xl',
  };

  return (
    <button
      className={cn(
        'flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}> = ({ children, className, title, icon }) => (
  <div
    className={cn(
      'bg-slate-800/40 border border-slate-700 rounded-3xl backdrop-blur-xl overflow-hidden',
      className,
    )}
  >
    {title && (
      <div className="p-6 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-lg font-bold flex items-center gap-3 text-white">
          <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
          {icon && <span className="text-slate-400">{icon}</span>}
          {title}
        </h2>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({
  label,
  className,
  ...props
}) => (
  <div className="space-y-2 w-full">
    {label && (
      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
        {label}
      </label>
    )}
    <input
      className={cn(
        'w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-slate-600',
        className,
      )}
      {...props}
    />
  </div>
);
