// src/pages/Promociones.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag, Calendar, Percent, X, Loader2, AlertCircle } from 'lucide-react';
import promotionService from '../services/promotionService';

export default function Promociones() {
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPromocion, setEditingPromocion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    porcentaje_descuento: '',
    fecha_inicio: '',
    fecha_fin: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Cargar promociones al montar el componente
  useEffect(() => {
    cargarPromociones();
  }, []);

  const cargarPromociones = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await promotionService.listarPromociones();
      if (result.success) {
        setPromociones(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al cargar promociones');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (promocion = null) => {
    if (promocion) {
      setEditingPromocion(promocion);
      setFormData({
        titulo: promocion.titulo,
        descripcion: promocion.descripcion,
        porcentaje_descuento: promocion.porcentaje_descuento,
        fecha_inicio: promocion.fecha_inicio,
        fecha_fin: promocion.fecha_fin
      });
    } else {
      setEditingPromocion(null);
      setFormData({
        titulo: '',
        descripcion: '',
        porcentaje_descuento: '',
        fecha_inicio: '',
        fecha_fin: ''
      });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPromocion(null);
    setFormData({
      titulo: '',
      descripcion: '',
      porcentaje_descuento: '',
      fecha_inicio: '',
      fecha_fin: ''
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar errores del campo
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.titulo.trim()) {
      errors.titulo = 'El título es requerido';
    }

    if (!formData.descripcion.trim()) {
      errors.descripcion = 'La descripción es requerida';
    }

    const porcentaje = parseFloat(formData.porcentaje_descuento);
    if (!formData.porcentaje_descuento || isNaN(porcentaje)) {
      errors.porcentaje_descuento = 'El porcentaje es requerido';
    } else if (porcentaje <= 0 || porcentaje > 100) {
      errors.porcentaje_descuento = 'El porcentaje debe estar entre 1 y 100';
    }

    if (!formData.fecha_inicio) {
      errors.fecha_inicio = 'La fecha de inicio es requerida';
    }

    if (!formData.fecha_fin) {
      errors.fecha_fin = 'La fecha de fin es requerida';
    }

    if (formData.fecha_inicio && formData.fecha_fin) {
      const inicio = new Date(formData.fecha_inicio);
      const fin = new Date(formData.fecha_fin);

      if (fin < inicio) {
        errors.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      let result;
      if (editingPromocion) {
        result = await promotionService.actualizarPromocion(editingPromocion.id, formData);
      } else {
        result = await promotionService.crearPromocion(formData);
      }

      if (result.success) {
        handleCloseModal();
        await cargarPromociones();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al guardar la promoción');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (promocion) => {
    setDeleteConfirm(promocion);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    setIsSubmitting(true);
    try {
      const result = await promotionService.eliminarPromocion(deleteConfirm.id);
      if (result.success) {
        setDeleteConfirm(null);
        await cargarPromociones();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al eliminar la promoción');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPromocionExpired = (fechaFin) => {
    if (!fechaFin) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fin = new Date(fechaFin);
    fin.setHours(0, 0, 0, 0);
    return fin < today;
  };

  const isPromocionActive = (fechaInicio, fechaFin) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);
    const fin = new Date(fechaFin);
    fin.setHours(0, 0, 0, 0);
    return today >= inicio && today <= fin;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Promociones</h1>
          <p className="text-gray-600 mt-1">Gestiona las promociones y descuentos</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Promoción
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-700 hover:text-red-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
          <p className="text-gray-600">Cargando promociones...</p>
        </div>
      ) : (
        /* Promociones Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promociones.length === 0 ? (
            <div className="col-span-full bg-white border border-gray-200 rounded-lg p-8 text-center">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No hay promociones creadas</p>
              <p className="text-gray-500 text-sm mt-1">
                Comienza creando tu primera promoción
              </p>
            </div>
          ) : (
            promociones.map((promocion) => {
              const expired = isPromocionExpired(promocion.fecha_fin);
              const active = isPromocionActive(promocion.fecha_inicio, promocion.fecha_fin);

              return (
                <div
                  key={promocion.id}
                  className={`bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${
                    expired ? 'opacity-60' : ''
                  }`}
                >
                  {/* Badge de estado */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {active && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full mb-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Activa
                        </span>
                      )}
                      {expired && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-2">
                          Expirada
                        </span>
                      )}
                      {!active && !expired && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-2">
                          Programada
                        </span>
                      )}
                    </div>

                    {/* Porcentaje de descuento */}
                    <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                      <Percent className="w-4 h-4" />
                      <span className="font-bold">{promocion.porcentaje_descuento}</span>
                    </div>
                  </div>

                  {/* Título y descripción */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {promocion.titulo}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {promocion.descripcion}
                  </p>

                  {/* Fechas */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Inicio: {formatDate(promocion.fecha_inicio)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Fin: {formatDate(promocion.fecha_fin)}</span>
                    </div>
                  </div>

                  {/* Acciones - Solo mostrar si no ha expirado */}
                  {!expired && (
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleOpenModal(promocion)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(promocion)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  )}

                  {expired && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-center text-sm text-gray-500">
                        Esta promoción ha expirado
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal de Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingPromocion ? 'Editar Promoción' : 'Nueva Promoción'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.titulo ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Descuento de verano"
                  />
                  {formErrors.titulo && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.titulo}</p>
                  )}
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.descripcion ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe la promoción"
                  />
                  {formErrors.descripcion && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.descripcion}</p>
                  )}
                </div>

                {/* Porcentaje de descuento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Porcentaje de descuento
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="porcentaje_descuento"
                      value={formData.porcentaje_descuento}
                      onChange={handleInputChange}
                      min="1"
                      max="100"
                      step="0.01"
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.porcentaje_descuento ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="10"
                    />
                    <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  {formErrors.porcentaje_descuento && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.porcentaje_descuento}</p>
                  )}
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fecha inicio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de inicio
                    </label>
                    <input
                      type="date"
                      name="fecha_inicio"
                      value={formData.fecha_inicio}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.fecha_inicio ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.fecha_inicio && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.fecha_inicio}</p>
                    )}
                  </div>

                  {/* Fecha fin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de fin
                    </label>
                    <input
                      type="date"
                      name="fecha_fin"
                      value={formData.fecha_fin}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.fecha_fin ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.fecha_fin && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.fecha_fin}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      {editingPromocion ? 'Actualizar' : 'Crear'} Promoción
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Eliminar Promoción</h3>
                <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas eliminar la promoción{' '}
              <span className="font-semibold">"{deleteConfirm.titulo}"</span>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  'Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
