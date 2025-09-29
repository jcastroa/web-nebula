// components/dashboard/AppliedFiltersBar.jsx
import React from 'react';
import { X, Filter, Trash2 } from 'lucide-react';

const AppliedFiltersBar = ({ 
  filters = {}, 
  onRemoveFilter, 
  onClearAll, 
  onEditFilters,
  loading = false 
}) => {
  // Mapeo de labels para mostrar
  const filterLabels = {
    nombre_completo: 'Nombre',
    telefono: 'Teléfono',
    numero_documento: 'Documento',
    fecha_cita: 'Fecha',
    estado_cita: 'Estado',
    estado_pago: 'Pago'
  };

  // Mapeo de valores para mostrar más amigables
  const getDisplayValue = (key, value) => {
    if (key === 'estado_cita') {
      const estados = {
        'pendiente': 'Pendiente',
        'cancelada': 'Cancelada',
        'completada': 'Completada',
        'en_proceso': 'En Proceso'
      };
      return estados[value] || value;
    }
    
    if (key === 'estado_pago') {
      const pagos = {
        'sin_pago': 'Sin pago',
        'pago_no_validado': 'Pago no validado',
        'pago_validado': 'Pago validado'
      };
      return pagos[value] || value;
    }
    
    return value;
  };

  // Filtrar solo los campos que tienen valor
  const activeFilters = Object.entries(filters).filter(([key, value]) => 
    value && value.toString().trim() !== ''
  );

  if (activeFilters.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Filtros aplicados ({activeFilters.length})
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onEditFilters}
            disabled={loading}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:text-blue-400 transition-colors"
          >
            Editar filtros
          </button>
          
          <button
            onClick={onClearAll}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md text-sm font-medium disabled:text-red-400 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Limpiar todos
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {activeFilters.map(([key, value]) => (
          <div
            key={key}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-200 rounded-full text-sm"
          >
            <span className="font-medium text-blue-700">
              {filterLabels[key]}:
            </span>
            <span className="text-blue-900">
              {getDisplayValue(key, value)}
            </span>
            <button
              onClick={() => onRemoveFilter(key)}
              disabled={loading}
              className="text-blue-400 hover:text-blue-600 disabled:text-blue-300 transition-colors ml-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {loading && (
        <div className="mt-3 flex items-center gap-2 text-blue-600">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Actualizando resultados...</span>
        </div>
      )}
    </div>
  );
};

export default AppliedFiltersBar;