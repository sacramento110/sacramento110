import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  className = '',
  type = 'button',
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary:
      'bg-islamic-green-600 hover:bg-islamic-green-700 text-white focus:ring-islamic-green-500 transform hover:scale-105',
    secondary:
      'bg-islamic-gold-500 hover:bg-islamic-gold-600 text-white focus:ring-islamic-gold-500 transform hover:scale-105',
    outline:
      'border-2 border-islamic-green-600 text-islamic-green-600 hover:bg-islamic-green-600 hover:text-white focus:ring-islamic-green-500',
    ghost:
      'text-islamic-green-600 hover:bg-islamic-green-50 focus:ring-islamic-green-500',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-4 py-3 text-base min-h-[44px]',
    lg: 'px-6 py-4 text-lg min-h-[48px]',
  };

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100'
    : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} touch-friendly ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 xs:w-5 xs:h-5 mr-2" />}
      {children}
    </button>
  );
};
