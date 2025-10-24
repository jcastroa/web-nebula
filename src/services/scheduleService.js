// services/scheduleService.js
class ScheduleService {
  constructor(codigoNegocio) {
    this.codigoNegocio = codigoNegocio;
    this.baseUrl = '/api/v1/negocios';
  }

  // Obtener configuración de horarios
  async getScheduleConfig() {
    const response = await fetch(
      `${this.baseUrl}/${this.codigoNegocio}/horarios`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get schedule configuration');
    }

    return response.json();
  }

  // Guardar configuración de horarios
  async saveScheduleConfig(scheduleData) {
    const response = await fetch(
      `${this.baseUrl}/${this.codigoNegocio}/horarios`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scheduleData)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to save schedule configuration');
    }

    return response.json();
  }

  // Obtener excepciones (feriados, vacaciones)
  async getExceptions() {
    const response = await fetch(
      `${this.baseUrl}/${this.codigoNegocio}/horarios/excepciones`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get schedule exceptions');
    }

    return response.json();
  }

  // Agregar excepción
  async addException(exceptionData) {
    const response = await fetch(
      `${this.baseUrl}/${this.codigoNegocio}/horarios/excepciones`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(exceptionData)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to add exception');
    }

    return response.json();
  }

  // Eliminar excepción
  async deleteException(exceptionId) {
    const response = await fetch(
      `${this.baseUrl}/${this.codigoNegocio}/horarios/excepciones/${exceptionId}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete exception');
    }

    return response.json();
  }
}

export default ScheduleService;
