// src/services/whatsappService.js
import api from './api';

class WhatsAppService {
    constructor() {
        this.baseUrl = '/vinculacion';
    }

    /**
      * Listar instancias vinculadas
      */
    async listarInstancias() {
        try {
            const response = await api.get(`${this.baseUrl}/instancias`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Error al listar instancias'
            };
        }
    }

    /**
    * PASO 1: Iniciar vinculación (SIMULADO PARA PRUEBAS)
    */
    async iniciarVinculacion() {
        try {
            // ✅ MODO DESARROLLO: Simular respuesta
            const isDevelopment = false; // Cambiar a false cuando conectes con el backend real

            if (isDevelopment) {
                // Simular delay de red
                await new Promise(resolve => setTimeout(resolve, 800));

                // Respuesta simulada
                const sessionId = `session_${Math.random().toString(36).substring(7)}`;
                const metaAppId = '4247760212109780'; // Simular APP ID
                const redirectUrl = `${window.location.origin}/configuracion/whatsapp-callback`;

                // Construir URL de OAuth simulada (misma estructura que Meta)
                const oauthUrl = `https://www.facebook.com/v21.0/dialog/oauth?` +
                    `client_id=${metaAppId}&` +
                    `redirect_uri=${encodeURIComponent(redirectUrl)}&` +
                    `state=session_${sessionId}&` +
                    `scope=whatsapp_business_management,whatsapp_business_messaging&` +
                    `response_type=code`;

                return {
                    success: true,
                    data: {
                        paso: 1,
                        session_id: sessionId,
                        oauth_url: oauthUrl,
                        mensaje: "Redirige al usuario a oauth_url para autorizar en Facebook"
                    }
                };
            }

            // ✅ MODO PRODUCCIÓN: Llamada real al backend
            const response = await api.post(`${this.baseUrl}/paso1-iniciar`);

            return {
                success: true,
                data: response.data
            };

        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Error al iniciar vinculación'
            };
        }
    }

    /**
     * PASO 2: Obtener números disponibles después del OAuth
     * @param {string} sessionId - ID de sesión
     * @param {string} code - Código OAuth de Meta
     * @returns {Promise}
     */
    async obtenerNumeros(sessionId, code) {
        try {
            const response = await api.post(`${this.baseUrl}/paso2-obtener-numeros`, {
                session_id: sessionId,
                code: code
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Error al obtener números'
            };
        }
    }

    /**
     * PASO 3: Seleccionar número y crear instancia
     * @param {string} sessionId - ID de sesión
     * @param {string} phoneNumberId - ID del número seleccionado
     * @returns {Promise}
     */
    async seleccionarNumero(sessionId, phoneNumberId) {
        try {
            const response = await api.post(`${this.baseUrl}/paso3-seleccionar-numero`, {
                session_id: sessionId,
                phone_number_id: phoneNumberId
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Error al crear instancia'
            };
        }
    }

    /**
     * Obtener estado de una instancia vinculada
     * @param {string} instanceId - ID de la instancia
     * @returns {Promise}
     */
    async obtenerEstadoVinculacion(instanceId) {
        try {
            const response = await api.get(`${this.baseUrl}/estado/${instanceId}`);

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Error al obtener estado'
            };
        }
    }

    /**
     * Cancelar vinculación de una instancia
     * @param {string} instanceId - ID de la instancia
     * @returns {Promise}
     */
    async cancelarVinculacion(instanceId) {
        try {
            const response = await api.post(`${this.baseUrl}/cancelar`, null, {
                params: { instance_id: instanceId }
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Error al cancelar vinculación'
            };
        }
    }
}

export default new WhatsAppService();