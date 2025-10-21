// src/hooks/useWebSocket.js
import { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const useWebSocket = (codigoNegocio) => {
  const [wsStatus, setWsStatus] = useState('disconnected');
  const [notifications, setNotifications] = useState([]);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // ✅ Obtener base URL desde variable de entorno
  const getWebSocketUrl = () => {
    // Obtener URL base del API
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';
    
    // Determinar protocolo WebSocket (ws o wss)
    const protocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
    
    // Extraer host del API URL (sin /api/v1)
    const urlObj = new URL(apiUrl);
    const host = urlObj.host; // incluye puerto si existe
    
    return `${protocol}://${host}/api/v1`;
  };

  // Función para obtener token de WebSocket
  const getWebSocketToken = async () => {
    try {
      const response = await api.get(`/negocios/${codigoNegocio}/ws-token`);
      const data = response.data;
      return data.ws_token;
    } catch (error) {
      console.error('Error getting WebSocket token:', error);
      return null;
    }
  };

  // Función para conectar WebSocket
  const connectWebSocket = async () => {
    try {
      setWsStatus('connecting');
      
      // 1. Obtener token
      const wsToken = await getWebSocketToken();
      console.log('WebSocket token obtenido');
      
      if (!wsToken) {
        console.error('No se pudo obtener token de WebSocket');
        setWsStatus('error');
        return;
      }

      // ✅ 2. Construir URL dinámico
      const baseWsUrl = getWebSocketUrl();
      const wsUrl = `${baseWsUrl}/negocios/${codigoNegocio}/smart-ws?token=${wsToken}`;
      console.log('🔌 Conectando WebSocket a:', wsUrl);

      const ws = new WebSocket(wsUrl);
      
      // 3. Configurar event handlers
      ws.onopen = () => {
        console.log('✅ WebSocket conectado');
        setWsStatus('connected');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setWsStatus('error');
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket desconectado');
        setWsStatus('disconnected');
        
        // Reconectar después de 5 segundos
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };

      wsRef.current = ws;
      
    } catch (error) {
      console.error('Error connecting WebSocket:', error);
      setWsStatus('error');
    }
  };

  // Manejar mensajes del WebSocket
  const handleWebSocketMessage = (message) => {
    console.log('📨 Mensaje recibido:', message);
    
    switch(message.type) {
      case 'negocio_update':
        setNotifications(prev => [{
          ...message.data,
          receivedAt: new Date().toISOString()
        }, ...prev]);
        
        window.dispatchEvent(new CustomEvent('ws-appointment-update', { 
          detail: message.data
        }));
        break;
        
      case 'connection_established':
        console.log('Conexión establecida:', message.message);
        break;
        
      default:
        console.log('Mensaje desconocido:', message);
    }
  };

  // Conectar al montar el componente
  useEffect(() => {
    connectWebSocket();

    // Cleanup al desmontar
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [codigoNegocio]);

  // Reconectar cada 23 horas para renovar token
  useEffect(() => {
    const reconnectInterval = setInterval(() => {
      console.log('🔄 Renovando token de WebSocket...');
      if (wsRef.current) {
        wsRef.current.close();
      }
      connectWebSocket();
    }, 23 * 60 * 60 * 1000); // 23 horas

    return () => clearInterval(reconnectInterval);
  }, []);

  return {
    wsStatus,
    notifications,
    sendMessage: (message) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(message));
      }
    }
  };
};

export default useWebSocket;