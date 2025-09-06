// components/ErrorMessage.jsx
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export function ErrorMessage({ 
  error, 
  onRetry, 
  title = 'Error al cargar datos' 
}) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {error || 'Ha ocurrido un error inesperado'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}