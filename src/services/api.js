

// // // src/services/api.js
// // import axios from 'axios';
// // import { useAuthStore } from '../store/authStore';

// // const api = axios.create({
// //   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
// //   withCredentials: true,
// //   headers: {
// //     'Content-Type': 'application/json'
// //   }
// // });

// // // ✅ Interceptor con debug completo
// // api.interceptors.response.use(
// //   (response) => {
// //     console.log('✅ API Response OK:', response.config.url, response.status);
// //     return response;
// //   },
// //   async (error) => {
// //     console.log('💥 === API ERROR ===');
// //     console.log('URL:', error.config?.url);
// //     console.log('Status:', error.response?.status);
// //     console.log('Data:', error.response?.data);
// //     console.log('Cookies:', document.cookie);
    
// //     const originalRequest = error.config;
    
// //     // ✅ Solo manejar 401 y si no hemos intentado refresh ya
// //     if (error.response?.status === 401 && !originalRequest._retry) {
// //       console.log('🔄 Error 401 detectado');
      
// //       // ✅ NO hacer refresh en endpoints de autenticación (evita bucles)
// //       if (originalRequest.url.includes('/auth/')) {
// //         console.log('❌ Error en endpoint de auth - NO hacer refresh');
// //         return Promise.reject(error);
// //       }
      
// //       originalRequest._retry = true;
// //       console.log('🔄 Intentando refresh token...');
      
// //       try {
// //         // ✅ Intentar renovar tokens
// //         console.log('📡 POST /auth/refresh...');
// //         await api.post('/auth/refresh');
// //         console.log('✅ Refresh exitoso - reintentando petición original');
        
// //         // ✅ Token renovado - reintentar la petición original
// //         return api(originalRequest);
        
// //       } catch (refreshError) {
// //         console.log('💥 === REFRESH FALLÓ ===');
// //         console.log('Status:', refreshError.response?.status);
// //         console.log('Data:', refreshError.response?.data);
// //         console.log('🧹 Forzando logout...');
        
// //         // ✅ Usar el método del store para logout limpio
// //         useAuthStore.getState().forceLogout();
        
// //         // ✅ Limpiar storage y redirigir
// //         localStorage.removeItem('auth-store');
// //         window.location.href = '/login';
        
// //         return Promise.reject(refreshError);
// //       }
// //     }
    
// //     console.log('❌ Error no manejado por interceptor');
// //     return Promise.reject(error);
// //   }
// // );

// // export default api;

// import axios from 'axios';
// import { useAuthStore } from '../store/authStore';

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // ✅ Interceptor con manejo mejorado de tokens expirados
// api.interceptors.response.use(
//   (response) => {
//     console.log('✅ API Response OK:', response.config.url, response.status);
//     return response;
//   },
//   async (error) => {
//     console.log('💥 === API ERROR ===');
//     console.log('URL:', error.config?.url);
//     console.log('Status:', error.response?.status);
//     console.log('Data:', error.response?.data);
//     console.log('Cookies:', document.cookie);
    
//     const originalRequest = error.config;
    
//     // ✅ Manejar 401 en endpoints de autenticación 
//     if (error.response?.status === 401 && originalRequest.url.includes('/auth/')) {
//       console.log('❌ Error 401 en endpoint de auth');
      
//       // ✅ Si es el endpoint de refresh específicamente, significa tokens expirados
//       if (originalRequest.url.includes('/auth/refresh')) {
//         console.log('🔄 Refresh token expirado - forzando logout');
        
//         // ✅ Limpiar sesión completamente
//         useAuthStore.getState().forceLogout();
//         localStorage.removeItem('auth-store');
        
//         // ✅ Redirigir al login
//         window.location.href = '/login';
        
//         return Promise.reject(error);
//       }
      
//       // ✅ Para otros endpoints de auth (login, etc), solo rechazar
//       console.log('❌ Error en otros endpoints de auth - NO hacer refresh');
//       return Promise.reject(error);
//     }
    
//     // ✅ Manejar 401 en endpoints normales (no auth)
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       console.log('🔄 Error 401 detectado en endpoint normal');
      
//       originalRequest._retry = true;
//       console.log('🔄 Intentando refresh token...');
      
//       try {
//         // ✅ Intentar renovar tokens
//         console.log('📡 POST /auth/refresh...');
//         const refreshResponse = await api.post('/auth/refresh');
//         console.log('✅ Refresh exitoso:', refreshResponse.status);
        
//         // ✅ Token renovado - reintentar la petición original
//         console.log('🔄 Reintentando petición original...');
//         return api(originalRequest);
        
//       } catch (refreshError) {
//         console.log('💥 === REFRESH FALLÓ ===');
//         console.log('Refresh Status:', refreshError.response?.status);
//         console.log('Refresh Data:', refreshError.response?.data);
        
//         // ✅ El refresh falló, limpiar todo y redirigir
//         console.log('🧹 Limpiando sesión y redirigiendo...');
//         useAuthStore.getState().forceLogout();
//         localStorage.removeItem('auth-store');
//         window.location.href = '/login';
        
//         return Promise.reject(refreshError);
//       }
//     }
    
//     console.log('❌ Error no manejado por interceptor');
//     return Promise.reject(error);
//   }
// );

// export default api;

//VERSION 2/*
/*
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// ✅ Variables globales para control de flujo
let isRefreshing = false;
let isHandlingLogout = false;
let failedQueue = [];

// ✅ Procesar cola de peticiones fallidas
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// ✅ Función para manejar logout una sola vez
const handleSessionExpired = () => {
  if (isHandlingLogout) return;
  
  isHandlingLogout = true;
  console.log('🧹 Manejando sesión expirada...');
  
  // ✅ Limpiar store
  useAuthStore.getState().forceLogout();
  localStorage.removeItem('auth-store');
  
  // ✅ Evento para navegación
  window.dispatchEvent(new CustomEvent('session-expired'));
  
  // ✅ Reset flags
  setTimeout(() => {
    isHandlingLogout = false;
    isRefreshing = false;
  }, 1000);
};

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response OK:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.log('💥 === API ERROR ===');
    console.log('URL:', error.config?.url);
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);
    
    const originalRequest = error.config;
    
    // ✅ Solo manejar errores 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // ✅ EXCEPCIONES: Endpoints que NO deben hacer refresh
      const isLoginEndpoint = originalRequest.url.includes('/auth/login');
      const isRegisterEndpoint = originalRequest.url.includes('/auth/register'); 
      const isRefreshEndpoint = originalRequest.url.includes('/auth/refresh');
      
      if (isLoginEndpoint || isRegisterEndpoint) {
        console.log('❌ Error en login/register - NO hacer refresh (es normal)');
        return Promise.reject(error);
      }
      
      if (isRefreshEndpoint) {
        console.log('❌ Refresh token expirado - sesión terminada');
        isRefreshing = false;
        processQueue(error, null);
        handleSessionExpired();
        return Promise.reject(error);
      }
      
      // ✅ Si ya estamos haciendo refresh, encolar esta petición
      if (isRefreshing) {
        console.log('🔄 Ya hay refresh en progreso - encolando petición');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          // ✅ Cuando el refresh termine exitosamente, reintentar
          return api(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }
      
      // ✅ Iniciar proceso de refresh
      originalRequest._retry = true;
      isRefreshing = true;
      
      console.log('🔄 Error 401 en:', originalRequest.url, '- Iniciando refresh...');
      
      try {
        console.log('📡 POST /auth/refresh...');
        await api.post('/auth/refresh');
        console.log('✅ Refresh exitoso');
        
        // ✅ Refresh exitoso - procesar cola y continuar
        isRefreshing = false;
        processQueue(null, 'success');
        
        // ✅ Reintentar la petición original
        return api(originalRequest);
        
      } catch (refreshError) {
        console.log('💥 Refresh falló - sesión expirada');
        
        // ✅ Refresh falló - procesar cola con error y logout
        isRefreshing = false;
        processQueue(refreshError, null);
        handleSessionExpired();
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;*/



//VERSION 3
/*
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

/**
 * Optimized Axios instance for cookie-based auth (HttpOnly cookies):
 * - Uses a separate refreshClient WITHOUT interceptors to avoid recursion
 * - Queues concurrent 401 requests while refresh is in progress
 * - Adds a timeout to the refresh call so promises do not hang indefinitely
 * - Handles session expiration once and emits event so UI can react
 */

// Flags / cola
/*
let isRefreshing = false;
let isHandlingLogout = false;
let failedQueue = [];
const MAX_QUEUE = 200; // protección contra cola descontrolada

const REFRESH_TIMEOUT_MS = 10000; // timeout para la petición de refresh

const processQueue = (error) => {
  failedQueue.forEach(({ reject }) => {
    if (error) reject(error);
    else reject(new Error('No token (cookie) after refresh')); // cookie flow: we just re-run requests; if refresh succeeded, they will pass
  });
  failedQueue = [];
};

const handleSessionExpired = () => {
  if (isHandlingLogout) return;
  isHandlingLogout = true;
  console.log('🧹 Sesión expirada: forzando logout local y notificando UI');
  try {
    useAuthStore.getState().forceLogout();
  } catch (e) {
    console.warn('Error al acceder al authStore en logout', e);
  }
  // no se puede eliminar cookie HttpOnly desde JS; backend debe limpiar cookie
  window.dispatchEvent(new CustomEvent('session-expired'));
  // resetear flags pasado un tiempo corto
  setTimeout(() => {
    isHandlingLogout = false;
    isRefreshing = false;
  }, 500);
};

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000, // opcional: timeout global de peticiones
});

// Cliente sin interceptores (para el POST /auth/refresh)
const refreshClient = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: REFRESH_TIMEOUT_MS + 2000,
});

// helper: Promise que falla after ms
const timeoutPromise = (ms) =>
  new Promise((_, reject) => setTimeout(() => reject(new Error('refresh-timeout')), ms));

// Response interceptor
api.interceptors.response.use(
  response => response,
  async (error) => {
    // si no hay config (ej. errores de CORS / network), simplemente rechazar
    const originalRequest = error?.config;
    if (!originalRequest) return Promise.reject(error);

    // Evitar interferir con peticiones que explícitamente no quieren retry
    if (originalRequest.__noRetry) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    // Solo manejamos 401 aquí
    if (status === 401 && !originalRequest._retry) {
      const url = originalRequest.url || '';

      // Excepciones: endpoints auth que no deben provocar refresh
      if (url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/logout') || url.includes('/auth/refresh')) {
        // si /auth/refresh devolvió 401, significa refresh inválido -> terminar sesión
        if (url.includes('/auth/refresh')) {
          handleSessionExpired();
        }
        return Promise.reject(error);
      }

      // Si ya hay refresh en progreso, encolamos (hasta MAX_QUEUE)
      if (isRefreshing) {
        if (failedQueue.length >= MAX_QUEUE) {
          // proteccion: rechazo inmediato
          return Promise.reject(new Error('Queue overflow - try again later'));
        }
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          // Después del refresh, reintentar originalRequest
          originalRequest._retry = true;
          return api(originalRequest);
        }).catch((err) => Promise.reject(err));
      }

      // Iniciar refresh
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // race entre la llamada de refresh y un timeout para evitar promises colgadas
        await Promise.race([
          refreshClient.post('/auth/refresh'), // backend debe devolver Set-Cookie (HttpOnly)
          timeoutPromise(REFRESH_TIMEOUT_MS),
        ]);

        // refresh completado (si backend renovó cookie correctamente, próximas peticiones pasarán)
        isRefreshing = false;

        // resolver la cola permitiendo que cada petición reintente
        failedQueue.forEach(({ resolve }) => resolve());
        failedQueue = [];

        // reintentar la petición original
        return api(originalRequest);

      } catch (refreshError) {
        // refresh falló o timeout -> limpiar cola y logout
        console.warn('Refresh falló o timeout:', refreshError);
        isRefreshing = false;
        processQueue(refreshError);
        handleSessionExpired();
        return Promise.reject(refreshError);
      }
    }

    // otros códigos: dejar pasar
    return Promise.reject(error);
  }
);

export default api;*/

// src/lib/api.js
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

let isRefreshing = false;
let isHandlingLogout = false;
let failedQueue = [];
const MAX_QUEUE = 200;
const REFRESH_TIMEOUT_MS = 10000;

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Cliente principal con interceptores (usa para la app normal)
const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

// Cliente "plain" sin interceptores — usar para /auth/me y checks críticos
const plainClient = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Cliente sin interceptores para /auth/refresh
const refreshClient = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: REFRESH_TIMEOUT_MS + 2000,
});

const timeoutPromise = (ms) =>
  new Promise((_, reject) => setTimeout(() => reject(new Error('refresh-timeout')), ms));

const processQueue = (error) => {
  failedQueue.forEach(({ reject }) => {
    if (error) reject(error);
    else reject(new Error('No token (cookie) after refresh'));
  });
  failedQueue = [];
};

const markSessionExpiredLocal = () => {
  try {
    localStorage.setItem('session-expired-at', String(Date.now()));
    // Broadcast to other tabs
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('auth');
      bc.postMessage({ type: 'session-expired', ts: Date.now() });
      bc.close();
    } else {
      // fallback: write a key to localStorage to trigger storage events
      localStorage.setItem('session-expired-bump', String(Date.now()));
    }
  } catch (e) {
    console.warn('No se pudo marcar session-expired en localStorage', e);
  }
};

const handleSessionExpired = () => {
  if (isHandlingLogout) return;
  isHandlingLogout = true;
  console.log('🧹 Sesión expirada: forzando logout local y notificando UI');

  try {
    useAuthStore.getState().forceLogout();
  } catch (e) {
    console.warn('Error al acceder al authStore en logout', e);
  }

  // marcar expiración local y notificar otras pestañas
  markSessionExpiredLocal();

  window.dispatchEvent(new CustomEvent('session-expired'));

  setTimeout(() => {
    isHandlingLogout = false;
    isRefreshing = false;
  }, 500);
};

// Response interceptor en api (solo para peticiones normales)
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error?.config;
    if (!originalRequest) return Promise.reject(error);

    // permite saltar el retry con esta flag
    if (originalRequest.__noRetry) return Promise.reject(error);

    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      const url = originalRequest.url || '';

      // endpoints auth no deben intentar refresh automático
      if (url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/logout') || url.includes('/auth/refresh')) {
        if (url.includes('/auth/refresh')) {
          handleSessionExpired();
        }
        return Promise.reject(error);
      }

      // si ya se está refrescando, encolamos
      if (isRefreshing) {
        if (failedQueue.length >= MAX_QUEUE) {
          return Promise.reject(new Error('Queue overflow - try again later'));
        }
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          originalRequest._retry = true;
          return api(originalRequest);
        }).catch((err) => Promise.reject(err));
      }

      // iniciar refresh
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await Promise.race([
          refreshClient.post('/auth/refresh'),
          timeoutPromise(REFRESH_TIMEOUT_MS),
        ]);

        isRefreshing = false;
        // permitir que las peticiones encoladas reintenten
        failedQueue.forEach(({ resolve }) => resolve());
        failedQueue = [];

        return api(originalRequest);

      } catch (refreshError) {
        console.warn('Refresh falló o timeout:', refreshError);
        isRefreshing = false;
        processQueue(refreshError);
        handleSessionExpired();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { api, plainClient, refreshClient, markSessionExpiredLocal as markSessionExpired };
export default api;

