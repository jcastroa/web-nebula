// components/EstadisticasBadge.jsx
import React from 'react';

export function EstadisticasBadge({ 
  icon: Icon, 
  count, 
  label, 
  variant 
}) {
  const variants = {
    orange: 'bg-orange-100 text-orange-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800', 
    blue: 'bg-blue-100 text-blue-800'
  };

  return (
    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${variants[variant]}`}>
      {Icon && <Icon className="w-4 h-4" />}
      {label}: {count}
    </span>
  );
}

