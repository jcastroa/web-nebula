import React, { useState, useEffect } from 'react';
import { Building2, Shield, Star, AlertCircle } from 'lucide-react';
import { LoadingSpinner, ButtonSpinner } from '../common/LoadingSpinner';
import { getBusinesses, getRoles } from '../../services/userBusinessService';

/**
 * Formulario para asignar usuario a negocio
 */
const BusinessAssignmentForm = ({
  userId,
  userHasGlobalRole,
  currentAssignments = [],
  onSubmit,
  isLoading = false,
  editingAssignment = null,
  onCancelEdit = null,
  showPanel = true
}) => {
  const [formData, setFormData] = useState({
    negocio_id: '',
    rol_id: '',
    es_principal: false
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [businesses, setBusinesses] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [validationWarning, setValidationWarning] = useState('');

  // Cargar negocios y roles disponibles
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      const [businessResult, rolesResult] = await Promise.all([
        getBusinesses(),
        getRoles()
      ]);

      if (businessResult.success) {
        setBusinesses(businessResult.data);
      }
      if (rolesResult.success) {
        setRoles(rolesResult.data);
      }
      setLoadingData(false);
    };
    fetchData();
  }, []);

  // Cargar datos de edición
  useEffect(() => {
    if (editingAssignment) {
      setFormData({
        negocio_id: editingAssignment.consultorio_id || '',
        rol_id: editingAssignment.rol_id || '',
        es_principal: editingAssignment.es_principal || false
      });
    } else {
      setFormData({
        negocio_id: '',
        rol_id: '',
        es_principal: false
      });
    }
  }, [editingAssignment]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));

    // Limpiar error del campo al cambiar
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Validar si intenta marcar como principal y ya existe otro principal
    if (name === 'es_principal' && checked) {
      const hasPrincipal = currentAssignments.some(
        assignment =>
          assignment.es_principal &&
          (!editingAssignment || assignment.id !== editingAssignment.id) &&
          assignment.estado === 'activo'
      );

      if (hasPrincipal) {
        setValidationWarning('Ya existe un consultorio marcado como principal. Al guardar, este será el nuevo consultorio principal.');
      } else {
        setValidationWarning('');
      }
    } else if (name === 'es_principal' && !checked) {
      setValidationWarning('');
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validar que el usuario no tenga rol global
    if (userHasGlobalRole) {
      errors.general = 'Este usuario tiene un rol global asignado. No se pueden crear asignaciones específicas por negocio.';
      setFieldErrors(errors);
      return false;
    }

    if (!formData.negocio_id) {
      errors.negocio_id = 'Debe seleccionar un negocio';
    }

    if (!formData.rol_id) {
      errors.rol_id = 'Debe seleccionar un rol';
    }

    // Validar que el consultorio no esté ya asignado (excepto si es edición)
    if (!editingAssignment) {
      const businessAlreadyAssigned = currentAssignments.some(
        assignment =>
          assignment.consultorio_id === parseInt(formData.negocio_id) &&
          assignment.estado === 'activo'
      );

      if (businessAlreadyAssigned) {
        errors.negocio_id = 'Este consultorio ya está asignado al usuario';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const dataToSubmit = {
      usuario_id: userId,
      negocio_id: parseInt(formData.negocio_id),
      rol_id: parseInt(formData.rol_id),
      es_principal: formData.es_principal
    };

    onSubmit(dataToSubmit, setFieldErrors);
  };

  const handleCancel = () => {
    setFormData({
      negocio_id: '',
      rol_id: '',
      es_principal: false
    });
    setFieldErrors({});
    setValidationWarning('');
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  // Mostrar mensaje si el usuario tiene rol global
  if (userHasGlobalRole) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-900 mb-1">
              No se pueden crear asignaciones específicas
            </h4>
            <p className="text-amber-800 text-sm">
              Este usuario tiene un rol global asignado. Para crear asignaciones específicas
              por negocio, primero debe remover el rol global del usuario.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formContent = (
    <>
      {showPanel && (
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          {editingAssignment ? 'Editar Asignación a Negocio' : 'Asignar a Negocio'}
        </h3>
      )}

      {fieldErrors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{fieldErrors.general}</p>
        </div>
      )}

      {validationWarning && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm">{validationWarning}</p>
          </div>
        </div>
      )}

        <div className="space-y-4">
          {/* Selección de Negocio */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Negocio *
            </label>
            <select
              name="negocio_id"
              value={formData.negocio_id}
              onChange={handleChange}
              disabled={isLoading || !!editingAssignment}
              className={`w-full px-4 py-2.5 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
                ${fieldErrors.negocio_id ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-slate-200'}`}
            >
              <option value="">Seleccione un negocio</option>
              {businesses.map(negocio => (
                <option key={negocio.id} value={negocio.id}>
                  {negocio.nombre} {negocio.codigo && `(${negocio.codigo})`}
                </option>
              ))}
            </select>
            {fieldErrors.negocio_id && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.negocio_id}</p>
            )}
          </div>

          {/* Selección de Rol */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-600" />
                Rol para este negocio *
              </div>
            </label>
            <select
              name="rol_id"
              value={formData.rol_id}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-2.5 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
                ${fieldErrors.rol_id ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-slate-200'}`}
            >
              <option value="">Seleccione un rol</option>
              {roles.map(rol => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </select>
            {fieldErrors.rol_id && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.rol_id}</p>
            )}
          </div>

          {/* Es Principal */}
          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
            <input
              type="checkbox"
              id="es_principal"
              name="es_principal"
              checked={formData.es_principal}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded
                focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <div className="flex-1">
              <label
                htmlFor="es_principal"
                className="text-sm font-medium text-slate-700 cursor-pointer flex items-center gap-2"
              >
                <Star className="w-4 h-4 text-amber-500" />
                Marcar como negocio principal
              </label>
              <p className="text-xs text-slate-600 mt-1">
                Solo puede haber un negocio marcado como principal por usuario
              </p>
            </div>
          </div>
        </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 mt-6">
        {editingAssignment && onCancelEdit && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="min-w-[180px] px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors
            flex items-center justify-center gap-2 font-medium"
        >
          {isLoading ? (
            <>
              <ButtonSpinner className="w-4 h-4" />
              Guardando...
            </>
          ) : (
            <>
              <Building2 className="w-4 h-4" />
              {editingAssignment ? 'Actualizar Asignación' : 'Asignar Consultorio'}
            </>
          )}
        </button>
      </div>
    </>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {showPanel ? (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          {formContent}
        </div>
      ) : (
        formContent
      )}
    </form>
  );
};

export default BusinessAssignmentForm;
