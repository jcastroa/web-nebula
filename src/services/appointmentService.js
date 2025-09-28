// services/appointmentService.js
class AppointmentService {
  constructor(codigoNegocio) {
    this.codigoNegocio = codigoNegocio;
    this.baseUrl = '/api/v1/negocios';
  }
  
  // Obtener token para WebSocket
  async getWebSocketToken() {
    const response = await fetch(
      `${this.baseUrl}/${this.codigoNegocio}/ws-token`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to get WebSocket token');
    }
    
    return response.json();
  }
  
  // Obtener citas priorizadas
  async getCitasPriorizadas() {
    const response = await fetch(
      `${this.baseUrl}/${this.codigoNegocio}/citas-priorizadas`,
      {
        credentials: 'include'
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to get appointments');
    }
    
    return response.json();
  }
  
  // Smart refresh
  async smartRefresh(editingIds = [], lastUpdate = null) {
    const params = new URLSearchParams();
    
    if (editingIds.length > 0) {
      params.append('editing_ids', editingIds.join(','));
    }
    if (lastUpdate) {
      params.append('last_update', lastUpdate);
    }
    
    const response = await fetch(
      `${this.baseUrl}/${this.codigoNegocio}/smart-refresh?${params}`,
      {
        credentials: 'include'
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to refresh');
    }
    
    return response.json();
  }
}

export default AppointmentService;