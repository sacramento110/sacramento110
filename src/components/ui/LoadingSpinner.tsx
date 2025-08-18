import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colors = {
    primary: 'text-islamic-green-600',
    secondary: 'text-islamic-gold-500',
    white: 'text-white',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} ${colors[color]} animate-spin`}
        style={{
          backgroundImage: `conic-gradient(transparent, currentColor)`,
          borderRadius: '50%',
          mask: 'radial-gradient(circle at center, transparent 40%, black 41%)',
        }}
      />
    </div>
  );
};
