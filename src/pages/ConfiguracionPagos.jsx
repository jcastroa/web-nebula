// src/pages/ConfiguracionPagos.jsx
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  X,
  Check,
  DollarSign,
  User,
  Hash,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import paymentMethodsService from '../services/paymentMethodsService';

const ConfiguracionPagos = () => {
  // Estados
  const [mediosPago, setMediosPago] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [medioActual, setMedioActual] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [medioAEliminar, setMedioAEliminar] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Estados del formulario
  const [formData, setFormData] = useState({
    descripcion: '',
    detalle: '',
    nombre_titular: '',
    numero_cuenta: ''
  });

  // Estados de validación
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar medios de pago al montar el componente
  useEffect(() => {
    cargarMediosPago();
  }, []);

  // Limpiar mensaje de éxito después de 5 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Función para cargar medios de pago
  const cargarMediosPago = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await paymentMethodsService.listar();

      if (result.success) {
        // Filtrar solo medios de pago activos y no eliminados
        const mediosActivos = (result.data || []).filter(
          medio => medio.activo && !medio.eliminado
        );
        setMediosPago(mediosActivos);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado al cargar medios de pago');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle expandir fila
  const toggleExpandRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Abrir modal para agregar
  const handleAgregar = () => {
    setModoEdicion(false);
    setMedioActual(null);
    setFormData({
      descripcion: '',
      detalle: '',
      nombre_titular: '',
      numero_cuenta: ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEditar = (medio) => {
    setModoEdicion(true);
    setMedioActual(medio);
    setFormData({
      descripcion: medio.descripcion || '',
      detalle: medio.detalle || '',
      nombre_titular: medio.nombre_titular || '',
      numero_cuenta: medio.numero_cuenta || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Cerrar modal
  const handleCerrarModal = () => {
    setShowModal(false);
    setModoEdicion(false);
    setMedioActual(null);
    setFormData({
      descripcion: '',
      detalle: '',
      nombre_titular: '',
      numero_cuenta: ''
    });
    setFormErrors({});
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario escribe
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validar formulario
  const validarFormulario = () => {
    const errors = {};

    if (!formData.descripcion || formData.descripcion.trim() === '') {
      errors.descripcion = 'La descripción es requerida';
    }

    if (!formData.detalle || formData.detalle.trim() === '') {
      errors.detalle = 'El detalle es requerido';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Guardar medio de pago (crear o actualizar)
  const handleGuardar = async () => {
    if (!validarFormulario()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let result;

      if (modoEdicion && medioActual) {
        // Actualizar
        result = await paymentMethodsService.actualizar(medioActual.id, formData);
      } else {
        // Crear
        result = await paymentMethodsService.crear(formData);
      }

      if (result.success) {
        // Mostrar mensaje de éxito
        setSuccessMessage(result.message);
        // Recargar lista
        await cargarMediosPago();
        handleCerrarModal();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado al guardar medio de pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Abrir modal de confirmación de eliminación
  const handleAbrirModalEliminar = (medio) => {
    setMedioAEliminar(medio);
    setShowDeleteModal(true);
  };

  // Cerrar modal de eliminación
  const handleCerrarModalEliminar = () => {
    setShowDeleteModal(false);
    setMedioAEliminar(null);
  };

  // Eliminar medio de pago
  const handleEliminar = async () => {
    if (!medioAEliminar) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await paymentMethodsService.eliminar(medioAEliminar.id);

      if (result.success) {
        // Mostrar mensaje de éxito
        setSuccessMessage(result.message);
        // Recargar lista
        await cargarMediosPago();
        handleCerrarModalEliminar();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado al eliminar medio de pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar contenido principal
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Configuración de Medios de Pago
            </h1>
            <p className="text-gray-600">
              Gestiona los medios de pago disponibles para tu negocio
            </p>
          </div>

          <button
            onClick={handleAgregar}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Agregar Medio de Pago
          </button>
        </div>
      </div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-green-800 font-medium">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-500 hover:text-green-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Mensaje de error global */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Cargando medios de pago...</p>
        </div>
      ) : mediosPago.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay medios de pago registrados
          </h3>
          <p className="text-gray-600 mb-6">
            Comienza agregando tu primer medio de pago
          </p>
          <button
            onClick={handleAgregar}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Agregar Medio de Pago
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medio de Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Información
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mediosPago.map((medio) => {
                const hasDetails = medio.nombre_titular || medio.numero_cuenta;
                const isExpanded = expandedRows.has(medio.id);

                return (
                  <React.Fragment key={medio.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900">
                              {medio.descripcion}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {medio.detalle}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {hasDetails ? (
                          <button
                            onClick={() => toggleExpandRow(medio.id)}
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-4 h-4" />
                                Ocultar detalles
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4" />
                                Ver detalles
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400 italic">
                            Sin información adicional
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditar(medio)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAbrirModalEliminar(medio)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && hasDetails && (
                      <tr className="bg-blue-50">
                        <td colSpan="3" className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {medio.nombre_titular && (
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="text-xs font-medium text-blue-900 uppercase tracking-wide">
                                    Titular
                                  </div>
                                  <div className="text-sm text-blue-800 mt-1">
                                    {medio.nombre_titular}
                                  </div>
                                </div>
                              </div>
                            )}
                            {medio.numero_cuenta && (
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Hash className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="text-xs font-medium text-blue-900 uppercase tracking-wide">
                                    Número de Cuenta
                                  </div>
                                  <div className="text-sm text-blue-800 mt-1 font-mono">
                                    {medio.numero_cuenta}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Agregar/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">
                {modoEdicion ? 'Editar Medio de Pago' : 'Agregar Medio de Pago'}
              </h2>
              <button
                onClick={handleCerrarModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido del modal con scroll */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Campos obligatorios */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Información Básica
                  </span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                {/* Campo Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    placeholder="Ej: Efectivo, Yape, Plin, Transferencia Bancaria"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      formErrors.descripcion
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {formErrors.descripcion && (
                    <p className="mt-1.5 text-sm text-red-600">{formErrors.descripcion}</p>
                  )}
                </div>

                {/* Campo Detalle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción General <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="detalle"
                    value={formData.detalle}
                    onChange={handleInputChange}
                    placeholder="Ej: Pago en efectivo al momento de la cita"
                    rows="3"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 resize-none transition-all ${
                      formErrors.detalle
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {formErrors.detalle && (
                    <p className="mt-1.5 text-sm text-red-600">{formErrors.detalle}</p>
                  )}
                </div>
              </div>

              {/* Campos opcionales */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Información Adicional (Opcional)
                  </span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-xs text-blue-800 mb-3">
                    Agrega información adicional como nombre del titular y número de cuenta para medios de pago digitales o transferencias bancarias.
                  </p>

                  {/* Campo Nombre del Titular */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        Nombre del Titular
                      </div>
                    </label>
                    <input
                      type="text"
                      name="nombre_titular"
                      value={formData.nombre_titular}
                      onChange={handleInputChange}
                      placeholder="Ej: Juan Pérez García"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  {/* Campo Número de Cuenta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-500" />
                        Número de Cuenta / Teléfono
                      </div>
                    </label>
                    <input
                      type="text"
                      name="numero_cuenta"
                      value={formData.numero_cuenta}
                      onChange={handleInputChange}
                      placeholder="Ej: 987654321 o 0011-2233-4455-6677"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <button
                onClick={handleCerrarModal}
                className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {modoEdicion ? 'Actualizar' : 'Guardar'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && medioAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Contenido del modal */}
            <div className="p-6">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
                Confirmar Eliminación
              </h2>
              <p className="text-gray-600 text-center">
                ¿Estás seguro de que deseas eliminar el medio de pago{' '}
                <span className="font-semibold text-gray-900">{medioAEliminar.descripcion}</span>?
              </p>
              <p className="text-sm text-gray-500 text-center mt-2">
                Esta acción no se puede deshacer.
              </p>
            </div>

            {/* Footer del modal */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCerrarModalEliminar}
                className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfiguracionPagos;
