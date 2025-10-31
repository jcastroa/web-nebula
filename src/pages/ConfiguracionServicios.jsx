import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, AlertCircle, Search, Package, TrendingUp, Activity, Inbox } from 'lucide-react';
import api from '../services/api';

const ConfiguracionServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentServicio, setCurrentServicio] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    nombre: '',
    duracion_minutos: '',
    precio: '',
    activo: true,
    descripcion: ''
  });

  // Cargar servicios
  const loadServicios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/configuracion/servicios/');
      setServicios(response.data);
    } catch (err) {
      console.error('Error cargando servicios:', err);
      setError('Error al cargar los servicios. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServicios();
  }, []);

  // Filtrar servicios
  const filteredServicios = servicios.filter(servicio =>
    servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal para crear
  const handleCreate = () => {
    setIsEditing(false);
    setCurrentServicio(null);
    setFormData({
      nombre: '',
      duracion_minutos: '',
      precio: '',
      activo: true,
      descripcion: ''
    });
    setModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (servicio) => {
    setIsEditing(true);
    setCurrentServicio(servicio);
    setFormData({
      nombre: servicio.nombre,
      duracion_minutos: servicio.duracion_minutos,
      precio: servicio.precio,
      activo: servicio.activo,
      descripcion: servicio.descripcion || ''
    });
    setModalOpen(true);
  };

  // Guardar (crear o editar)
  const handleSave = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre.trim()) {
      setError('El nombre del servicio es requerido');
      return;
    }
    if (!formData.duracion_minutos || formData.duracion_minutos <= 0) {
      setError('La duración debe ser mayor a 0');
      return;
    }
    if (!formData.precio || formData.precio < 0) {
      setError('El precio debe ser mayor o igual a 0');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const dataToSend = {
        ...formData,
        duracion_minutos: parseInt(formData.duracion_minutos),
        precio: parseFloat(formData.precio)
      };

      if (isEditing && currentServicio) {
        // Editar
        await api.put(`/configuracion/servicios/${currentServicio.id}/`, dataToSend);
        setSuccessMessage('Servicio actualizado exitosamente');
      } else {
        // Crear
        await api.post('/configuracion/servicios/', dataToSend);
        setSuccessMessage('Servicio creado exitosamente');
      }

      // Recargar lista
      await loadServicios();

      // Cerrar modal
      setModalOpen(false);

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err) {
      console.error('Error guardando servicio:', err);
      setError(err.response?.data?.message || 'Error al guardar el servicio');
    } finally {
      setSaving(false);
    }
  };

  // Eliminar servicio
  const handleDelete = async (servicioId) => {
    try {
      setError(null);
      await api.delete(`/configuracion/servicios/${servicioId}/`);
      setSuccessMessage('Servicio eliminado exitosamente');

      // Recargar lista
      await loadServicios();

      // Cerrar confirmación
      setDeleteConfirm(null);

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err) {
      console.error('Error eliminando servicio:', err);
      setError(err.response?.data?.message || 'Error al eliminar el servicio');
    }
  };

  // Formatear duración
  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header con búsqueda y botón */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Configuración de Servicios</h2>
            <p className="text-gray-600">Gestiona los servicios que ofreces y sus tarifas</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Servicio
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>
      </div>

      {/* Mensajes de éxito */}
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center animate-in fade-in slide-in-from-top-2 duration-300">
          <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}

      {/* Mensajes de error */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
          <span className="text-red-800 flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-3 text-red-600 hover:text-red-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Total Servicios</p>
              <p className="text-3xl font-bold text-blue-900">{servicios.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Servicios Activos</p>
              <p className="text-3xl font-bold text-green-900">
                {servicios.filter(s => s.activo).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">Precio Promedio</p>
              <p className="text-3xl font-bold text-purple-900">
                S/ {servicios.length > 0
                  ? (servicios.reduce((sum, s) => sum + parseFloat(s.precio), 0) / servicios.length).toFixed(2)
                  : '0.00'}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de servicios */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando servicios...</p>
          </div>
        ) : filteredServicios.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              {searchTerm ? (
                <Search className="w-8 h-8 text-gray-400" />
              ) : (
                <Inbox className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {searchTerm ? 'No se encontraron servicios' : 'No hay servicios configurados'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm
                ? 'Intenta con otro término de búsqueda o limpia el filtro para ver todos los servicios.'
                : 'Comienza creando tu primer servicio para gestionar las tarifas de tu consultorio.'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
              >
                <Plus className="w-5 h-5 mr-2" />
                Crear primer servicio
              </button>
            )}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duración
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio (S/)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredServicios.map((servicio) => (
                <tr key={servicio.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{servicio.nombre}</p>
                      {servicio.descripcion && (
                        <p className="text-sm text-gray-500 mt-1">{servicio.descripcion}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {formatDuration(servicio.duracion_minutos)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      S/ {parseFloat(servicio.precio).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {servicio.activo ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="mr-1">✅</span> Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <span className="mr-1">⏸️</span> Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(servicio)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(servicio)}
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
        )}
      </div>

      {/* Modal para crear/editar */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="p-6 space-y-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Servicio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Consulta general"
                    required
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Descripción opcional del servicio"
                    rows="2"
                  />
                </div>

                {/* Duración y Precio */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duración (minutos) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.duracion_minutos}
                      onChange={(e) => setFormData({ ...formData, duracion_minutos: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="30"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio (S/) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="50.00"
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* Estado */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.activo}
                      onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Servicio activo</span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    Los servicios inactivos no estarán disponibles para agendar
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {isEditing ? 'Actualizar' : 'Crear'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                ¿Eliminar servicio?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                ¿Estás seguro de que deseas eliminar el servicio <strong>{deleteConfirm.nombre}</strong>?
                Esta acción no se puede deshacer.
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfiguracionServicios;
