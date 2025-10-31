// components/LoadingSpinner.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 'md', text = 'Cargando...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
        <span className="text-sm text-gray-600">{text}</span>
      </div>
    </div>
  );
}

// Spinner simple para usar en botones (sin contenedor ni texto)
export function ButtonSpinner({ className = "w-4 h-4" }) {
  return <Loader2 className={`${className} animate-spin`} />;
}