// src/services/businessService.js
import api from './api';

class BusinessService {
    constructor() {
        this.baseUrl = '/negocios';
    }

    /**
     * Procesar errores de respuesta del backend
     * @param {Object} error - Error de axios
     * @returns {string} Mensaje de error legible
     */
    processError(error) {
        if (error.response?.data) {
            const data = error.response.data;

            // Si hay un array de errores de validación
            if (Array.isArray(data.detail)) {
                return data.detail.map(err => {
                    if (typeof err === 'object' && err.msg) {
                        return `${err.loc?.[1] || 'Campo'}: ${err.msg}`;
                    }
                    return String(err);
                }).join(', ');
            }

            // Si es un string directo
            if (typeof data.detail === 'string') {
                return data.detail;
            }

            if (typeof data.message === 'string') {
                return data.message;
            }

            // Si es un objeto de error individual
            if (typeof data.detail === 'object' && data.detail.msg) {
                return data.detail.msg;
            }
        }

        return error.message || 'Error desconocido';
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
                data: response.data.data || response.data,
                total: response.data.total,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                error: this.processError(error)
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
                data: response.data.data || response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.processError(error)
            };
        }
    }

    /**
     * Crear un nuevo negocio
     * @param {Object} negocio - Datos del negocio
     * @returns {Promise}
     */
    async crearNegocio(negocio) {
        try {
            const response = await api.post(`${this.baseUrl}/`, negocio);
            return {
                success: true,
                data: response.data.data || response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.processError(error)
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
                data: response.data.data || response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.processError(error)
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
                data: response.data.data || response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.processError(error)
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
                data: response.data.data || response.data,
                total: response.data.total,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                error: this.processError(error)
            };
        }
    }
}

export default new BusinessService();
