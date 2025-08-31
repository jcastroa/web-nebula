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
  } else {
    // Error general (401, 500, etc.)
    generalError = errorData?.detail || errorData?.message || 'Error desconocido';
  }

  return { fieldErrors, generalError };
};