import React, { ReactNode } from 'react';

interface NeumorphismProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

// Neumorphism Card Component
export const NeuCard: React.FC<NeumorphismProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`bg-neu-base shadow-neu-card rounded-neu-sm p-6 transition-all duration-300 hover:shadow-neu-button ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Neumorphism Button Component
export const NeuButton: React.FC<NeumorphismProps & { type?: 'button' | 'submit'; disabled?: boolean }> = ({ 
  children, 
  className = '', 
  onClick, 
  type = 'button',
  disabled = false 
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        bg-neu-base shadow-neu-button rounded-neu-sm px-6 py-3 font-semibold text-gray-700
        transition-all duration-200 
        hover:shadow-neu-pressed active:shadow-neu-pressed
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Neumorphism Input Component
interface NeuInputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
}

export const NeuInput: React.FC<NeuInputProps> = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = '',
  id 
}) => {
  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`
        bg-neu-base shadow-neu-input rounded-neu-sm px-4 py-3 w-full
        text-gray-700 placeholder-gray-500 border-none outline-none
        transition-all duration-200 focus:shadow-neu-pressed
        ${className}
      `}
    />
  );
};

// Neumorphism Container/Layout
export const NeuContainer: React.FC<NeumorphismProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-neu-base ${className}`}>
      {children}
    </div>
  );
};

// Neumorphism Panel (for sections like dashboard widgets)
export const NeuPanel: React.FC<NeumorphismProps & { title?: string }> = ({ 
  children, 
  className = '', 
  title 
}) => {
  return (
    <div className={`bg-neu-base shadow-neu-card rounded-neu-sm p-8 ${className}`}>
      {title && (
        <h3 className="text-xl font-semibold text-gray-700 mb-6">{title}</h3>
      )}
      {children}
    </div>
  );
};

// Neumorphism Icon Button (for navigation icons)
export const NeuIconButton: React.FC<NeumorphismProps> = ({ children, className = '', onClick }) => {
  return (
    <button
      className={`
        bg-neu-base shadow-neu-button rounded-full w-12 h-12 flex items-center justify-center
        transition-all duration-200 hover:shadow-neu-pressed active:shadow-neu-pressed
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Neumorphism Label
export const NeuLabel: React.FC<{ children: ReactNode; htmlFor?: string; className?: string }> = ({ 
  children, 
  htmlFor, 
  className = '' 
}) => {
  return (
    <label 
      htmlFor={htmlFor}
      className={`block text-gray-600 font-medium mb-2 ${className}`}
    >
      {children}
    </label>
  );
};
