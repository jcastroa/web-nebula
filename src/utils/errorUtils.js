// src/utils/errorUtils.js

/**
 * Procesa errores de validación de FastAPI/Pydantic
 * @param {Object} errorData - Error del backend
 * @param {number} status - Status HTTP
 * @returns {Object} - Errores organizados por campo
 */
export const processValidationErrors = (errorData, status) => {
  const fieldErrors = {};
  let generalError = null;

  console.log('Procesando errores:', { errorData, status }); // Debug

  if (status === 422 && errorData?.detail && Array.isArray(errorData.detail)) {
    // Procesar errores de validación Pydantic
    errorData.detail.forEach(error => {
      const field = error.loc?.[error.loc.length - 1]; // Último elemento: "password"
      const message = error.msg || 'Error de validación';
      
      if (field && typeof field === 'string') {
        fieldErrors[field] = message;
      } else {
        generalError = message;
      }
    });
  } else if (status === 401) {
    // Errores de autenticación
    generalError = errorData?.detail || 'Credenciales incorrectas';
  } else if (status === 400) {
    // Errores de solicitud incorrecta
    generalError = errorData?.detail || 'Solicitud incorrecta';
  } else if (status >= 500) {
    // Errores del servidor
    generalError = 'Error interno del servidor. Inténtalo más tarde.';
  } else {
    // Otros errores
    generalError = errorData?.detail || errorData?.message || 'Error desconocido';
  }

  console.log('Errores procesados:', { fieldErrors, generalError }); // Debug

  return { fieldErrors, generalError };
};