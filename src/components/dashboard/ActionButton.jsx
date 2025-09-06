// components/ActionButton.jsx
import React from 'react';

export function ActionButton({ 
  onClick, 
  icon: Icon, 
  children, 
  variant = 'secondary' 
}) {
  const baseClasses = "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      <Icon className="h-4 w-4 mr-2" />
      {children}
    </button>
  );
}

