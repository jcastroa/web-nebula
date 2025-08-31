// // src/services/api.js
// import axios from 'axios';

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Interceptor para refresh automático
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
    
//     // NO hacer refresh si:
//     // 1. Ya intentamos refresh en esta petición
//     // 2. Es una petición de login, refresh, logout o verificación inicial
//     // 3. No es un error 401
//     if (
//       error.response?.status === 401 && 
//       !originalRequest._retry &&
//       !originalRequest.url.includes('/auth/login') &&
//       !originalRequest.url.includes('/auth/refresh') &&
//       !originalRequest.url.includes('/auth/logout') &&
//       !originalRequest.url.includes('/auth/me') // ← EXCLUIR checkAuth del refresh
//     ) {
//       originalRequest._retry = true;
      
//       try {
//         // Intentar renovar tokens
//         await api.post('/auth/refresh');
        
//         // Reintentar petición original
//         return api(originalRequest);
        
//       } catch (refreshError) {
//         console.log('Refresh token expirado, haciendo logout');
        
//         // Limpiar estado local
//         localStorage.removeItem('auth-store');
        
//         // Redirigir al login
//         window.location.href = '/login';
        
//         return Promise.reject(refreshError);
//       }
//     }
    
//     // Si es /auth/me que falló, no hacer nada especial
//     if (originalRequest.url.includes('/auth/me')) {
//       return Promise.reject(error);
//     }
    
//     return Promise.reject(error);
//   }
// );

// export default api;


// src/services/api.js
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ✅ Interceptor con debug completo
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
    
    // ✅ Solo manejar 401 y si no hemos intentado refresh ya
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔄 Error 401 detectado');
      
      // ✅ NO hacer refresh en endpoints de autenticación (evita bucles)
      if (originalRequest.url.includes('/auth/')) {
        console.log('❌ Error en endpoint de auth - NO hacer refresh');
        return Promise.reject(error);
      }
      
      originalRequest._retry = true;
      console.log('🔄 Intentando refresh token...');
      
      try {
        // ✅ Intentar renovar tokens
        console.log('📡 POST /auth/refresh...');
        await api.post('/auth/refresh');
        console.log('✅ Refresh exitoso - reintentando petición original');
        
        // ✅ Token renovado - reintentar la petición original
        return api(originalRequest);
        
      } catch (refreshError) {
        console.log('💥 === REFRESH FALLÓ ===');
        console.log('Status:', refreshError.response?.status);
        console.log('Data:', refreshError.response?.data);
        console.log('🧹 Forzando logout...');
        
        // ✅ Usar el método del store para logout limpio
        useAuthStore.getState().forceLogout();
        
        // ✅ Limpiar storage y redirigir
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