// components/dashboard/AdvancedFiltersModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { X, Filter, Trash2, Search } from 'lucide-react';

const AdvancedFiltersModal = ({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  onClearFilters, 
  initialFilters = {},
  loading = false 
}) => {
  const [filters, setFilters] = useState({
    nombre_completo: '',
    telefono: '',
    numero_documento: '',
    fecha_cita: '',
    estado_cita: '',
    estado_pago: ''
  });

  // ✅ CORREGIDO: Usar useRef para evitar bucles infinitos
  const initialFiltersRef = useRef(initialFilters);
  const isFirstOpen = useRef(true);

  // ✅ CORREGIDO: Solo actualizar cuando se abre el modal por primera vez
  // o cuando initialFilters realmente cambie
  useEffect(() => {
    if (isOpen) {
      // Comparar si initialFilters realmente cambió
      const filtersChanged = JSON.stringify(initialFiltersRef.current) !== JSON.stringify(initialFilters);
      
      if (isFirstOpen.current || filtersChanged) {
        setFilters(prev => ({
          nombre_completo: initialFilters.nombre_completo || '',
          telefono: initialFilters.telefono || '',
          numero_documento: initialFilters.numero_documento || '',
          fecha_cita: initialFilters.fecha_cita || '',
          estado_cita: initialFilters.estado_cita || '',
          estado_pago: initialFilters.estado_pago || ''
        }));
        
        initialFiltersRef.current = initialFilters;
        isFirstOpen.current = false;
      }
    } else {
      // Reset cuando se cierra
      isFirstOpen.current = true;
    }
  }, [isOpen]); // ✅ CORREGIDO: Solo depende de isOpen

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    // Filtrar campos vacíos
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value && value.trim() !== '') {
        acc[key] = value.trim();
      }
      return acc;
    }, {});

    onApplyFilters(activeFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      nombre_completo: '',
      telefono: '',
      numero_documento: '',
      fecha_cita: '',
      estado_cita: '',
      estado_pago: ''
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value.trim() !== '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Filtros Avanzados</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Nombre Completo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={filters.nombre_completo}
                onChange={(e) => handleInputChange('nombre_completo', e.target.value)}
                placeholder="Buscar por nombre..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono/Contacto
              </label>
              <input
                type="text"
                value={filters.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                placeholder="Número de teléfono..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Número de Documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Documento
              </label>
              <input
                type="text"
                value={filters.numero_documento}
                onChange={(e) => handleInputChange('numero_documento', e.target.value)}
                placeholder="DNI, CE, Pasaporte..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Fecha de Cita */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Cita
              </label>
              <input
                type="date"
                value={filters.fecha_cita}
                onChange={(e) => handleInputChange('fecha_cita', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Estado de Cita */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado de Cita
              </label>
              <select
                value={filters.estado_cita}
                onChange={(e) => handleInputChange('estado_cita', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="cancelada">Cancelada</option>
                <option value="completada">Completada</option>
                <option value="en_proceso">En Proceso</option>
              </select>
            </div>

            {/* Estado de Pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado de Pago
              </label>
              <select
                value={filters.estado_pago}
                onChange={(e) => handleInputChange('estado_pago', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los pagos</option>
                <option value="sin_pago">Sin pago</option>
                <option value="pago_no_validado">Con pago (no validado)</option>
                <option value="pago_validado">Con pago (validado)</option>
              </select>
            </div>

          </div>

          {/* Información de filtros activos */}
          {hasActiveFilters && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Filtros configurados: {Object.values(filters).filter(v => v && v.trim() !== '').length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value || value.trim() === '') return null;
                  
                  const labels = {
                    nombre_completo: 'Nombre',
                    telefono: 'Teléfono',
                    numero_documento: 'Documento',
                    fecha_cita: 'Fecha',
                    estado_cita: 'Estado',
                    estado_pago: 'Pago'
                  };

                  return (
                    <span 
                      key={key}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      <span className="font-medium">{labels[key]}:</span>
                      <span>{value}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClear}
            disabled={loading || !hasActiveFilters}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Limpiar filtros
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleApply}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Aplicando...
                </>
              ) : (
                <>
                  <Filter className="w-4 h-4" />
                  Aplicar filtros
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdvancedFiltersModal;