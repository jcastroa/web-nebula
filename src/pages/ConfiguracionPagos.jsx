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
  DollarSign
} from 'lucide-react';
import paymentMethodsService from '../services/paymentMethodsService';

const ConfiguracionPagos = () => {
  // Estados
  const [mediosPago, setMediosPago] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [medioActual, setMedioActual] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [medioAEliminar, setMedioAEliminar] = useState(null);

  // Estados del formulario
  const [formData, setFormData] = useState({
    descripcion: '',
    detalle: ''
  });

  // Estados de validación
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar medios de pago al montar el componente
  useEffect(() => {
    cargarMediosPago();
  }, []);

  // Función para cargar medios de pago
  const cargarMediosPago = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await paymentMethodsService.listar();

      if (result.success) {
        setMediosPago(result.data || []);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado al cargar medios de pago');
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir modal para agregar
  const handleAgregar = () => {
    setModoEdicion(false);
    setMedioActual(null);
    setFormData({ descripcion: '', detalle: '' });
    setFormErrors({});
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEditar = (medio) => {
    setModoEdicion(true);
    setMedioActual(medio);
    setFormData({
      descripcion: medio.descripcion || '',
      detalle: medio.detalle || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Cerrar modal
  const handleCerrarModal = () => {
    setShowModal(false);
    setModoEdicion(false);
    setMedioActual(null);
    setFormData({ descripcion: '', detalle: '' });
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
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalle
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mediosPago.map((medio) => (
                <tr key={medio.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {medio.descripcion}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {medio.detalle}
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Agregar/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
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

            {/* Contenido del modal */}
            <div className="p-6 space-y-4">
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
                  placeholder="Ej: Efectivo, Yape, Plin, Tarjeta"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.descripcion
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {formErrors.descripcion && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.descripcion}</p>
                )}
              </div>

              {/* Campo Detalle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detalle <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="detalle"
                  value={formData.detalle}
                  onChange={handleInputChange}
                  placeholder="Ej: Pago en efectivo al momento de la cita"
                  rows="3"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                    formErrors.detalle
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {formErrors.detalle && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.detalle}</p>
                )}
              </div>
            </div>

            {/* Footer del modal */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCerrarModal}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
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
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header del modal */}
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
                Confirmar Eliminación
              </h2>
              <p className="text-gray-600 text-center">
                ¿Estás seguro de que deseas eliminar el medio de pago{' '}
                <span className="font-semibold">{medioAEliminar.descripcion}</span>?
              </p>
              <p className="text-sm text-gray-500 text-center mt-2">
                Esta acción no se puede deshacer.
              </p>
            </div>

            {/* Footer del modal */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCerrarModalEliminar}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
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
