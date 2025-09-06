

// // src/services/api.js
// import axios from 'axios';
// import { useAuthStore } from '../store/authStore';

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // ✅ Interceptor con debug completo
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
    
//     // ✅ Solo manejar 401 y si no hemos intentado refresh ya
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       console.log('🔄 Error 401 detectado');
      
//       // ✅ NO hacer refresh en endpoints de autenticación (evita bucles)
//       if (originalRequest.url.includes('/auth/')) {
//         console.log('❌ Error en endpoint de auth - NO hacer refresh');
//         return Promise.reject(error);
//       }
      
//       originalRequest._retry = true;
//       console.log('🔄 Intentando refresh token...');
      
//       try {
//         // ✅ Intentar renovar tokens
//         console.log('📡 POST /auth/refresh...');
//         await api.post('/auth/refresh');
//         console.log('✅ Refresh exitoso - reintentando petición original');
        
//         // ✅ Token renovado - reintentar la petición original
//         return api(originalRequest);
        
//       } catch (refreshError) {
//         console.log('💥 === REFRESH FALLÓ ===');
//         console.log('Status:', refreshError.response?.status);
//         console.log('Data:', refreshError.response?.data);
//         console.log('🧹 Forzando logout...');
        
//         // ✅ Usar el método del store para logout limpio
//         useAuthStore.getState().forceLogout();
        
//         // ✅ Limpiar storage y redirigir
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

import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ✅ Interceptor con manejo mejorado de tokens expirados
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
    console.log('Cookies:', document.cookie);
    
    const originalRequest = error.config;
    
    // ✅ Manejar 401 en endpoints de autenticación 
    if (error.response?.status === 401 && originalRequest.url.includes('/auth/')) {
      console.log('❌ Error 401 en endpoint de auth');
      
      // ✅ Si es el endpoint de refresh específicamente, significa tokens expirados
      if (originalRequest.url.includes('/auth/refresh')) {
        console.log('🔄 Refresh token expirado - forzando logout');
        
        // ✅ Limpiar sesión completamente
        useAuthStore.getState().forceLogout();
        localStorage.removeItem('auth-store');
        
        // ✅ Redirigir al login
        window.location.href = '/login';
        
        return Promise.reject(error);
      }
      
      // ✅ Para otros endpoints de auth (login, etc), solo rechazar
      console.log('❌ Error en otros endpoints de auth - NO hacer refresh');
      return Promise.reject(error);
    }
    
    // ✅ Manejar 401 en endpoints normales (no auth)
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔄 Error 401 detectado en endpoint normal');
      
      originalRequest._retry = true;
      console.log('🔄 Intentando refresh token...');
      
      try {
        // ✅ Intentar renovar tokens
        console.log('📡 POST /auth/refresh...');
        const refreshResponse = await api.post('/auth/refresh');
        console.log('✅ Refresh exitoso:', refreshResponse.status);
        
        // ✅ Token renovado - reintentar la petición original
        console.log('🔄 Reintentando petición original...');
        return api(originalRequest);
        
      } catch (refreshError) {
        console.log('💥 === REFRESH FALLÓ ===');
        console.log('Refresh Status:', refreshError.response?.status);
        console.log('Refresh Data:', refreshError.response?.data);
        
        // ✅ El refresh falló, limpiar todo y redirigir
        console.log('🧹 Limpiando sesión y redirigiendo...');
        useAuthStore.getState().forceLogout();
        localStorage.removeItem('auth-store');
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }
    
    console.log('❌ Error no manejado por interceptor');
    return Promise.reject(error);
  }
);

export default api;