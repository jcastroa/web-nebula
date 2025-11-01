// services/scheduleService.js
import api from './api';

class ScheduleService {
  constructor() {
    this.baseUrl = '/horarios';
  }

  // Obtener configuración de horarios
  async getScheduleConfig() {
    try {
      const response = await api.get(this.baseUrl);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al obtener configuración de horarios'
      };
    }
  }

  // Guardar configuración de horarios
  async saveScheduleConfig(scheduleData) {
    try {
      const response = await api.post(this.baseUrl, scheduleData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al guardar configuración de horarios'
      };
    }
  }

  // Obtener excepciones (feriados, vacaciones)
  async getExceptions() {
    try {
      const response = await api.get(`${this.baseUrl}/excepciones`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al obtener excepciones'
      };
    }
  }

  // Agregar excepción
  async addException(exceptionData) {
    try {
      const response = await api.post(`${this.baseUrl}/excepciones`, exceptionData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al agregar excepción'
      };
    }
  }

  // Eliminar excepción
  async deleteException(exceptionId) {
    try {
      const response = await api.delete(`${this.baseUrl}/excepciones/${exceptionId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al eliminar excepción'
      };
    }
  }
}

export default new ScheduleService();
