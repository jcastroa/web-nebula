// src/services/businessService.js
import api from './api';

class BusinessService {
    constructor() {
        this.baseUrl = '/negocios';
    }

    /**
     * Listar todos los negocios
     * @returns {Promise}
     */
    async listarNegocios() {
        try {
            const response = await api.get(`${this.baseUrl}/`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || error.response?.data?.message || 'Error al listar negocios'
            };
        }
    }

    /**
     * Obtener un negocio por ID
     * @param {string|number} id - ID del negocio
     * @returns {Promise}
     */
    async obtenerNegocio(id) {
        try {
            const response = await api.get(`${this.baseUrl}/${id}/`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || error.response?.data?.message || 'Error al obtener negocio'
            };
        }
    }

    /**
     * Crear un nuevo negocio
     * @param {Object} negocio - Datos del negocio
     * @param {string} negocio.nombre - Nombre del negocio
     * @param {boolean} negocio.permite_pago - Si permite pago
     * @param {boolean} negocio.envia_recordatorios - Si envía recordatorios
     * @param {string} negocio.tipo_recordatorio - Tipo de recordatorio ('con_confirmacion' | 'sin_confirmacion')
     * @returns {Promise}
     */
    async crearNegocio(negocio) {
        try {
            const response = await api.post(`${this.baseUrl}/`, negocio);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || error.response?.data?.message || 'Error al crear negocio'
            };
        }
    }

    /**
     * Actualizar un negocio
     * @param {string|number} id - ID del negocio
     * @param {Object} negocio - Datos del negocio a actualizar
     * @returns {Promise}
     */
    async actualizarNegocio(id, negocio) {
        try {
            const response = await api.put(`${this.baseUrl}/${id}/`, negocio);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || error.response?.data?.message || 'Error al actualizar negocio'
            };
        }
    }

    /**
     * Cambiar estado de un negocio (activar/desactivar)
     * @param {string|number} id - ID del negocio
     * @param {boolean} activo - Nuevo estado del negocio
     * @returns {Promise}
     */
    async cambiarEstadoNegocio(id, activo) {
        try {
            const response = await api.patch(`${this.baseUrl}/${id}/estado/`, { activo });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || error.response?.data?.message || 'Error al cambiar estado del negocio'
            };
        }
    }

    /**
     * Activar un negocio
     * @param {string|number} id - ID del negocio
     * @returns {Promise}
     */
    async activarNegocio(id) {
        return this.cambiarEstadoNegocio(id, true);
    }

    /**
     * Desactivar un negocio
     * @param {string|number} id - ID del negocio
     * @returns {Promise}
     */
    async desactivarNegocio(id) {
        return this.cambiarEstadoNegocio(id, false);
    }

    /**
     * Buscar negocios por nombre
     * @param {string} termino - Término de búsqueda
     * @returns {Promise}
     */
    async buscarNegocios(termino) {
        try {
            const response = await api.get(`${this.baseUrl}/buscar/`, {
                params: { q: termino }
            });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || error.response?.data?.message || 'Error al buscar negocios'
            };
        }
    }
}

export default new BusinessService();
