// src/services/paymentMethodsService.js
import api from './api';

const paymentMethodsService = {
  // Listar todos los medios de pago
  listar: async () => {
    try {
      const response = await api.get('/medios-pago');
      return {
        success: true,
        data: response.data.medios_pago || [],
        total: response.data.total || 0
      };
    } catch (error) {
      console.error('Error al listar medios de pago:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al obtener medios de pago'
      };
    }
  },

  // Crear un nuevo medio de pago
  crear: async (data) => {
    try {
      const response = await api.post('/medios-pago', data);
      return {
        success: response.data.success || true,
        data: response.data.data,
        message: response.data.message || 'Medio de pago creado exitosamente'
      };
    } catch (error) {
      console.error('Error al crear medio de pago:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Error al crear medio de pago'
      };
    }
  },

  // Actualizar un medio de pago existente
  actualizar: async (id, data) => {
    try {
      const response = await api.put(`/medios-pago/${id}`, data);
      return {
        success: response.data.success || true,
        data: response.data.data,
        message: response.data.message || 'Medio de pago actualizado exitosamente'
      };
    } catch (error) {
      console.error('Error al actualizar medio de pago:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Error al actualizar medio de pago'
      };
    }
  },

  // Eliminar un medio de pago
  eliminar: async (id) => {
    try {
      const response = await api.delete(`/medios-pago/${id}`);
      return {
        success: response.data.success || true,
        message: response.data.message || 'Medio de pago eliminado exitosamente'
      };
    } catch (error) {
      console.error('Error al eliminar medio de pago:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || 'Error al eliminar medio de pago'
      };
    }
  }
};

export default paymentMethodsService;
