// src/services/promotionService.js
import api from './api';

class PromotionService {
    constructor() {
        this.baseUrl = '/promociones/';
    }

    /**
     * Listar todas las promociones
     */
    async listarPromociones() {
        try {
            const response = await api.get(this.baseUrl);
            return {
                success: true,
                data: response.data.promociones || [],
                total: response.data.total || 0
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Error al listar promociones'
            };
        }
    }

    /**
     * Crear una nueva promoción
     * @param {Object} promocion - Datos de la promoción
     */
    async crearPromocion(promocion) {
        try {
            const response = await api.post(this.baseUrl, promocion);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message || 'Promoción creada exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Error al crear promoción',
                status: error.response?.status
            };
        }
    }

    /**
     * Actualizar una promoción existente
     * @param {number} id - ID de la promoción
     * @param {Object} promocion - Datos actualizados
     */
    async actualizarPromocion(id, promocion) {
        try {
            const response = await api.put(`${this.baseUrl}${id}/`, promocion);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message || 'Promoción actualizada exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Error al actualizar promoción',
                status: error.response?.status
            };
        }
    }

    /**
     * Eliminar una promoción
     * @param {number} id - ID de la promoción
     */
    async eliminarPromocion(id) {
        try {
            const response = await api.delete(`${this.baseUrl}${id}/`);
            return {
                success: true,
                message: response.data.message || 'Promoción eliminada exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Error al eliminar promoción'
            };
        }
    }
}

const promotionServiceInstance = new PromotionService();
export default promotionServiceInstance;
