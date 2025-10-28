import React, { useState, useEffect } from 'react';
import { User, Mail, Shield } from 'lucide-react';
import { LoadingSpinner, ButtonSpinner } from '../common/LoadingSpinner';
import { getRoles } from '../../services/userBusinessService';

/**
 * Formulario para crear/editar usuarios
 */
const UserForm = ({ onSubmit, initialData = null, isLoading = false, showPanel = true }) => {
  const [formData, setFormData] = useState({
    username: '',
    nombres: '',
    apellidos: '',
    email: '',
    rol_global: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Cargar roles disponibles
  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      const result = await getRoles();
      if (result.success) {
        setRoles(result.data);
      }
      setLoadingRoles(false);
    };
    fetchRoles();
  }, []);

  // Cargar datos iniciales si es edición
  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || '',
        nombres: initialData.nombres || '',
        apellidos: initialData.apellidos || '',
        email: initialData.email || '',
        rol_global: initialData.rol_global || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Limpiar error del campo al escribir
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    if (!formData.nombres.trim()) {
      errors.nombres = 'Los nombres son requeridos';
    }

    if (!formData.apellidos.trim()) {
      errors.apellidos = 'Los apellidos son requeridos';
    }

    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El email no es válido';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Enviar datos, excluyendo rol_global si está vacío
    const dataToSubmit = {
      ...formData,
      rol_global: formData.rol_global || null
    };

    onSubmit(dataToSubmit, setFieldErrors);
  };

  if (loadingRoles) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  const formContent = (
    <>
      {showPanel && (
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Datos del Usuario
        </h3>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre de Usuario *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading || initialData !== null}
              className={`w-full px-4 py-2.5 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
                ${fieldErrors.username ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-slate-200'}`}
              placeholder="usuario123"
            />
            {fieldErrors.username && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${fieldErrors.email ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-slate-200'}`}
                placeholder="usuario@ejemplo.com"
              />
            </div>
            {fieldErrors.email && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Nombres */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombres *
            </label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-2.5 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
                ${fieldErrors.nombres ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-slate-200'}`}
              placeholder="Juan Carlos"
            />
            {fieldErrors.nombres && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.nombres}</p>
            )}
          </div>

          {/* Apellidos */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Apellidos *
            </label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-2.5 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
                ${fieldErrors.apellidos ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-slate-200'}`}
              placeholder="Pérez García"
            />
            {fieldErrors.apellidos && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.apellidos}</p>
            )}
          </div>

          {/* Rol Global (opcional) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-600" />
                Rol Global (opcional)
              </div>
            </label>
            <select
              name="rol_global"
              value={formData.rol_global}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-2.5 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
                ${fieldErrors.rol_global ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-slate-200'}`}
            >
              <option value="">Sin rol global</option>
              {roles.map(rol => (
                <option key={rol.id} value={rol.nombre}>
                  {rol.nombre}
                </option>
              ))}
            </select>
            <p className="text-sm text-slate-500 mt-1">
              Si asignas un rol global, no podrás asignar roles específicos por negocio
            </p>
            {fieldErrors.rol_global && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.rol_global}</p>
            )}
          </div>
        </div>
      {/* Fin del grid */}

      {/* Botón de envío */}
      <div className="flex justify-end gap-3 mt-6">
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
              <User className="w-4 h-4" />
              {initialData ? 'Actualizar Usuario' : 'Crear Usuario'}
            </>
          )}
        </button>
      </div>
    </>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

export default UserForm;
