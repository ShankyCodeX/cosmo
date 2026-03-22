import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'destructive';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', ...props }, ref) => {
    return (
      <button 
        ref={ref}
        className={`${styles.btn} ${styles[variant]} ${className}`} 
        {...props} 
      />
    );
  }
);

Button.displayName = 'Button';
