import React from 'react';
import {
  User,
  Building2,
  Shield,
  Star,
  Edit2,
  ToggleLeft,
  ToggleRight,
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
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
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
 * Componente de listado de usuarios en tabla compacta
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
    <div className="space-y-4">
      {/* Badges de filtros activos */}
      <ActiveFilterBadges
        filters={filters}
        onRemoveFilter={onRemoveFilter}
        onClearAll={onClearFilters}
        roles={roles}
      />

      {/* Tabla de usuarios */}
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
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Rol Global
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Asignaciones
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className={`transition-colors ${
                      user.is_active
                        ? 'hover:bg-slate-50'
                        : 'bg-red-50/30'
                    }`}
                  >
                    {/* Usuario */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${user.is_active ? 'bg-blue-100' : 'bg-slate-100'}`}>
                          <User className={`w-4 h-4 ${user.is_active ? 'text-blue-600' : 'text-slate-400'}`} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{user.username}</p>
                          <p className="text-sm text-slate-600">{user.first_name} {user.last_name}</p>
                          {user.created_at && (
                            <p className="text-xs text-slate-400 mt-0.5">
                              Creado: {new Date(user.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-900">{user.email}</p>
                    </td>

                    {/* Rol Global */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-slate-900">
                          {user.rol_global_nombre || 'Sin rol global'}
                        </span>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                        {user.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    {/* Asignaciones */}
                    <td className="px-4 py-3">
                      {user.asignaciones && user.asignaciones.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {user.asignaciones.map((asig, index) => (
                            <span
                              key={asig.id || index}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                            >
                              <Building2 className="w-3 h-3" />
                              {asig.consultorio_nombre}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Sin negocios</span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {/* Gestionar Asignaciones */}
                        <button
                          onClick={() => onManageAssignments(user)}
                          disabled={!user.is_active}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          title="Gestionar asignaciones"
                        >
                          <Building2 className="w-4 h-4" />
                        </button>

                        {/* Editar */}
                        <button
                          onClick={() => onEdit(user)}
                          disabled={!user.is_active}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          title="Editar usuario"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Activar/Desactivar */}
                        <button
                          onClick={() => onToggleStatus(user)}
                          className={`p-1.5 rounded transition-colors ${
                            user.is_active
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={user.is_active ? 'Desactivar usuario' : 'Activar usuario'}
                        >
                          {user.is_active ? (
                            <ToggleLeft className="w-4 h-4" />
                          ) : (
                            <ToggleRight className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Paginación */}
      {totalItems > 0 && (
        <TablePagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          total={totalItems}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
          showItemsPerPage={true}
          itemName="usuarios"
        />
      )}
    </div>
  );
};

export default UserList;
