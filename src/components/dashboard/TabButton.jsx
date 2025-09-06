import React from 'react';

export function TabButton({ 
  isActive, 
  onClick, 
  icon: Icon, 
  children, 
  count,
  variant = 'orange' // Color por defecto
}) {
  // Variantes de colores para el badge
  const badgeVariants = {
    orange: 'bg-orange-100 text-orange-800',
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-500 text-white',
    purple: 'bg-purple-100 text-purple-800',
    gray: 'bg-gray-100 text-gray-800'
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      <Icon className="h-4 w-4 mr-2" />
      {children}
      {count && (
        <span className={`ml-2 text-xs px-2 py-0.5 rounded-md font-semibold ${badgeVariants[variant]}`}>
          {count}
        </span>
      )}
    </button>
  );
}