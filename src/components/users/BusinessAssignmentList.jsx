import React from 'react';
import { Building2, Shield, Star, Edit2, ToggleLeft, ToggleRight, Calendar } from 'lucide-react';
import { LoadingSpinner } from '../common/LoadingSpinner';

/**
 * Lista de asignaciones de usuario a consultorios en tabla compacta
 */
const BusinessAssignmentList = ({
  assignments = [],
  isLoading = false,
  onEdit,
  onToggleStatus
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
        <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          Sin asignaciones
        </h3>
        <p className="text-slate-600">
          Este usuario aún no tiene asignaciones a consultorios
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-blue-600" />
        Asignaciones a Consultorios ({assignments.length})
      </h3>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Consultorio
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Principal
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Fecha Asignación
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {assignments.map((assignment) => {
                const isActive = assignment.estado === 'activo';

                return (
                  <tr
                    key={assignment.id}
                    className={`transition-colors ${
                      isActive ? 'hover:bg-slate-50' : 'bg-red-50/30'
                    }`}
                  >
                    {/* Consultorio */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100' : 'bg-slate-100'}`}>
                          <Building2 className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{assignment.consultorio_nombre}</p>
                          <p className="text-xs text-slate-500">ID: {assignment.consultorio_id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Rol */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-slate-900">{assignment.rol_nombre}</span>
                      </div>
                    </td>

                    {/* Principal */}
                    <td className="px-4 py-3 text-center">
                      {assignment.es_principal ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                          <Star className="w-3 h-3" />
                          Principal
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>

                    {/* Fecha Asignación */}
                    <td className="px-4 py-3">
                      {assignment.fecha_asignacion ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-sm text-slate-900">
                              {new Date(assignment.fecha_asignacion).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(assignment.fecha_asignacion).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                        {isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {/* Editar */}
                        <button
                          onClick={() => onEdit(assignment)}
                          disabled={!isActive}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          title="Editar asignación"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Activar/Desactivar */}
                        <button
                          onClick={() => onToggleStatus(assignment)}
                          className={`p-1.5 rounded transition-colors ${
                            isActive
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={isActive ? 'Desactivar asignación' : 'Activar asignación'}
                        >
                          {isActive ? (
                            <ToggleLeft className="w-4 h-4" />
                          ) : (
                            <ToggleRight className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BusinessAssignmentList;
