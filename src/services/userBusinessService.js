import api from './api';

/**
 * Servicio para gestión de usuarios y sus asignaciones a negocios
 */

/**
 * Crear un nuevo usuario
 * @param {Object} userData - Datos del usuario (username, nombres, apellidos, email, rol_global)
 * @returns {Promise} Respuesta con el usuario creado
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post('/usuarios/', userData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
};

/**
 * Obtener lista de usuarios
 * @param {Object} params - Parámetros de búsqueda y paginación
 * @returns {Promise} Lista de usuarios
 */
export const getUsers = async (params = {}) => {
  try {
    const response = await api.get('/usuarios/', { params });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
};

/**
 * Obtener un usuario por ID
 * @param {number} userId - ID del usuario
 * @returns {Promise} Datos del usuario
 */
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/usuarios/${userId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
};

/**
 * Actualizar un usuario
 * @param {number} userId - ID del usuario
 * @param {Object} userData - Datos a actualizar
 * @returns {Promise} Usuario actualizado
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/usuarios/${userId}`, userData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
};

/**
 * Desactivar un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise} Resultado de la operación
 */
export const deactivateUser = async (userId) => {
  try {
    const response = await api.patch(`/usuarios/${userId}/desactivar`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
};

/**
 * Activar un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise} Resultado de la operación
 */
export const activateUser = async (userId) => {
  try {
    const response = await api.patch(`/usuarios/${userId}/activar`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
};

/**
 * Obtener lista de negocios disponibles
 * @returns {Promise} Lista de negocios
 */
export const getBusinesses = async () => {
  try {
    const response = await api.get('/negocios/');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
};

/**
 * Obtener lista de roles disponibles
 * @returns {Promise} Lista de roles
 */
export const getRoles = async () => {
  try {
    const response = await api.get('/roles/');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
};

/**
 * Crear asignación de usuario a negocio
 * @param {Object} assignmentData - Datos de asignación (usuario_id, negocio_id, rol_id, es_principal)
 * @returns {Promise} Asignación creada
 */
export const createBusinessAssignment = async (assignmentData) => {
  try {
    const response = await api.post('/usuarios/asignaciones/', assignmentData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
};

/**
 * Obtener asignaciones de un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise} Lista de asignaciones del usuario
 */
export const getUserAssignments = async (userId) => {
  try {
    const response = await api.get(`/usuarios/${userId}/asignaciones/`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
};

/**
 * Actualizar una asignación
 * @param {number} assignmentId - ID de la asignación
 * @param {Object} assignmentData - Datos a actualizar (rol_id, es_principal)
 * @returns {Promise} Asignación actualizada
 */
export const updateBusinessAssignment = async (assignmentId, assignmentData) => {
  try {
    const response = await api.put(`/usuarios/asignaciones/${assignmentId}/`, assignmentData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
};

/**
 * Desactivar una asignación
 * @param {number} assignmentId - ID de la asignación
 * @returns {Promise} Resultado de la operación
 */
export const deactivateBusinessAssignment = async (assignmentId) => {
  try {
    const response = await api.patch(`/usuarios/asignaciones/${assignmentId}/desactivar`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
};

/**
 * Activar una asignación
 * @param {number} assignmentId - ID de la asignación
 * @returns {Promise} Resultado de la operación
 */
export const activateBusinessAssignment = async (assignmentId) => {
  try {
    const response = await api.patch(`/usuarios/asignaciones/${assignmentId}/activar`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
};
