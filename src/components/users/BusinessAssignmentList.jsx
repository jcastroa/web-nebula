import React from 'react';
import { Building2, Shield, Star, Edit2, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '../common/LoadingSpinner';

/**
 * Lista de asignaciones de usuario a negocios
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
          Este usuario aún no tiene asignaciones a negocios
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-blue-600" />
        Asignaciones a Negocios ({assignments.length})
      </h3>

      <div className="grid gap-4">
        {assignments.map((assignment) => {
          const isActive = assignment.estado === 'activo';

          return (
            <div
              key={assignment.id}
              className={`bg-white rounded-xl p-5 border-2 transition-all
                ${isActive
                  ? 'border-slate-200 hover:border-slate-300'
                  : 'border-red-200 bg-red-50/30'
                }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Información de la asignación */}
                <div className="flex-1 space-y-3">
                  {/* Consultorio/Negocio */}
                  <div className="flex items-center gap-3">
                    <Building2 className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div>
                      <p className="font-semibold text-slate-800 flex items-center gap-2">
                        {assignment.consultorio_nombre}
                        {assignment.es_principal && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                            <Star className="w-3 h-3" />
                            Principal
                          </span>
                        )}
                      </p>
                      {assignment.consultorio_id && (
                        <p className="text-sm text-slate-500">
                          ID: {assignment.consultorio_id}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Rol */}
                  <div className="flex items-center gap-3">
                    <Shield className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                    <div>
                      <p className="text-sm text-slate-600">Rol asignado:</p>
                      <p className="font-medium text-slate-800">{assignment.rol_nombre}</p>
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={`text-sm font-medium ${isActive ? 'text-green-700' : 'text-red-700'}`}>
                      {isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  {/* Mensaje de advertencia para asignaciones inactivas */}
                  {!isActive && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">
                        Esta asignación está desactivada. El usuario no tiene acceso a este consultorio.
                      </p>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-2">
                  {/* Botón Editar */}
                  <button
                    onClick={() => onEdit(assignment)}
                    disabled={!isActive}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    title="Editar asignación"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>

                  {/* Botón Activar/Desactivar */}
                  <button
                    onClick={() => onToggleStatus(assignment)}
                    className={`p-2 rounded-lg transition-colors
                      ${isActive
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-green-600 hover:bg-green-50'
                      }`}
                    title={isActive ? 'Desactivar asignación' : 'Activar asignación'}
                  >
                    {isActive ? (
                      <ToggleLeft className="w-5 h-5" />
                    ) : (
                      <ToggleRight className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Fechas de creación y actualización */}
              {(assignment.created_at || assignment.updated_at || assignment.fecha_asignacion) && (
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  {assignment.fecha_asignacion && (
                    <p>Asignada: {new Date(assignment.fecha_asignacion).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  )}
                  {assignment.created_at && assignment.created_at !== assignment.fecha_asignacion && (
                    <p>Creada: {new Date(assignment.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  )}
                  {assignment.updated_at && assignment.updated_at !== assignment.created_at && (
                    <p>Actualizada: {new Date(assignment.updated_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessAssignmentList;
