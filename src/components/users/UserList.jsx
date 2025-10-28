import React from 'react';
import {
  User,
  Building2,
  Shield,
  Star,
  Edit2,
  ToggleLeft,
  ToggleRight,
  Filter,
  X
} from 'lucide-react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { TablePagination } from '../common/TablePagination';

/**
 * Componente de badges de filtros activos
 */
const ActiveFilterBadges = ({ filters, onRemoveFilter, onClearAll, roles }) => {
  const getFilterLabel = (key, value) => {
    switch (key) {
      case 'username':
        return `Usuario: ${value}`;
      case 'email':
        return `Email: ${value}`;
      case 'rol_global':
        return `Rol: ${value}`;
      case 'activo':
        return value === 'true' ? 'Estado: Activo' : 'Estado: Inactivo';
      default:
        return value;
    }
  };

  const activeFilters = Object.entries(filters).filter(([_, value]) => value !== '');

  if (activeFilters.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-blue-900">Filtros aplicados:</span>
          {activeFilters.map(([key, value]) => (
            <span
              key={key}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg"
            >
              {getFilterLabel(key, value)}
              <button
                onClick={() => onRemoveFilter(key)}
                className="hover:bg-blue-700 rounded-full p-0.5 transition-colors"
                title="Quitar filtro"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
        <button
          onClick={onClearAll}
          className="text-sm font-medium text-blue-700 hover:text-blue-800 hover:underline"
        >
          Limpiar todos
        </button>
      </div>
    </div>
  );
};

/**
 * Componente de listado de usuarios
 */
const UserList = ({
  users = [],
  isLoading = false,
  onEdit,
  onToggleStatus,
  onManageAssignments,
  roles = [],
  // Paginación
  currentPage = 1,
  itemsPerPage = 10,
  totalItems = 0,
  onPageChange,
  onItemsPerPageChange,
  // Filtros
  filters = { username: '', email: '', rol_global: '', activo: '' },
  onClearFilters,
  onRemoveFilter
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Badges de filtros activos */}
      <ActiveFilterBadges
        filters={filters}
        onRemoveFilter={onRemoveFilter}
        onClearAll={onClearFilters}
        roles={roles}
      />

      {/* Contador de resultados */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} usuarios
          </p>
        </div>
      )}

      {/* Lista de usuarios */}
      {users.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
          <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            No se encontraron usuarios
          </h3>
          <p className="text-slate-600">
            No hay usuarios que coincidan con los criterios de búsqueda
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className={`bg-white rounded-xl p-5 border-2 transition-all
                ${user.is_active
                  ? 'border-slate-200 hover:border-slate-300'
                  : 'border-red-200 bg-red-50/30'
                }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Información del usuario */}
                <div className="flex-1 space-y-3">
                  {/* Header con username y estado */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className={`w-5 h-5 ${user.is_active ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg text-slate-800">
                          {user.username}
                        </h3>
                        <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className={`text-sm font-medium ${user.is_active ? 'text-green-700' : 'text-red-700'}`}>
                          {user.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        {user.first_name} {user.last_name}
                      </p>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-13">
                    {/* Email */}
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="text-sm text-slate-800">{user.email}</p>
                    </div>

                    {/* Rol Global */}
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="text-xs text-slate-500">Rol Global</p>
                        <p className="text-sm text-slate-800">
                          {user.rol_global_nombre || 'Sin rol global'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Negocios asignados */}
                  {user.asignaciones && user.asignaciones.length > 0 && (
                    <div className="pl-13">
                      <p className="text-xs text-slate-500 mb-2">Negocios asignados</p>
                      <div className="flex flex-wrap gap-2">
                        {user.asignaciones.map((asignacion) => (
                          <div
                            key={asignacion.id}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
                              ${asignacion.activo
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-500'
                              }`}
                          >
                            <Building2 className="w-3 h-3" />
                            {asignacion.negocio_nombre}
                            {asignacion.es_principal && (
                              <Star className="w-3 h-3 text-amber-500" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-2">
                  {/* Botón Gestionar Asignaciones */}
                  <button
                    onClick={() => onManageAssignments(user)}
                    disabled={!user.is_active}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    title="Gestionar asignaciones"
                  >
                    <Building2 className="w-5 h-5" />
                  </button>

                  {/* Botón Editar */}
                  <button
                    onClick={() => onEdit(user)}
                    disabled={!user.is_active}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    title="Editar usuario"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>

                  {/* Botón Activar/Desactivar */}
                  <button
                    onClick={() => onToggleStatus(user)}
                    className={`p-2 rounded-lg transition-colors
                      ${user.is_active
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-green-600 hover:bg-green-50'
                      }`}
                    title={user.is_active ? 'Desactivar usuario' : 'Activar usuario'}
                  >
                    {user.is_active ? (
                      <ToggleLeft className="w-5 h-5" />
                    ) : (
                      <ToggleRight className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalItems > 0 && (
        <TablePagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      )}
    </div>
  );
};

export default UserList;
