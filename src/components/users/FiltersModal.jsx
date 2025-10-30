import React, { useState, useEffect } from 'react';
import { X, Search, Filter } from 'lucide-react';

/**
 * Modal para filtros de usuarios
 */
const FiltersModal = ({ isOpen, onClose, onApplyFilters, initialFilters, roles }) => {
  const [filters, setFilters] = useState({
    username: '',
    email: '',
    rol_global: '',
    activo: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFilters(initialFilters);
    }
  }, [isOpen, initialFilters]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    const clearedFilters = {
      username: '',
      email: '',
      rol_global: '',
      activo: ''
    };
    setFilters(clearedFilters);
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-800">Filtros de Búsqueda</h2>
              {hasActiveFilters && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  Filtros activos
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Búsqueda por username */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre de usuario
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={filters.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    placeholder="Buscar..."
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Búsqueda por email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="text"
                  value={filters.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="email@ejemplo.com"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filtro por rol */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rol Global
                </label>
                <select
                  value={filters.rol_global}
                  onChange={(e) => handleChange('rol_global', e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  {roles.map(rol => (
                    <option key={rol.id} value={rol.nombre}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por estado */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  value={filters.activo}
                  onChange={(e) => handleChange('activo', e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors font-medium"
            >
              Limpiar filtros
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersModal;
