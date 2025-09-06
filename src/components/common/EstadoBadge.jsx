// components/EstadoBadge.jsx
import React from 'react';

export function EstadoBadge({ estado, tipo = 'solicitud' }) {
  const getEstadoClasses = () => {
    if (tipo === 'solicitud') {
      switch (estado) {
        case 'Pendiente':
          return 'bg-orange-100 text-orange-800';
        case 'Con Pago':
          return 'bg-green-100 text-green-800';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    } else {
      switch (estado) {
        case 'Completada':
          return 'bg-green-100 text-green-800';
        case 'En Proceso':
          return 'bg-purple-100 text-purple-800';
        case 'Pendiente':
          return 'bg-orange-100 text-orange-800';
        case 'Confirmada':
          return 'bg-blue-100 text-blue-800';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getEstadoClasses()}`}>
      {estado}
    </span>
  );
}