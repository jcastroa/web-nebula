// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

// Función para obtener info del dispositivo
const getDeviceInfo = () => {
  // Detectar plataforma de forma moderna
  const getPlatform = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('windows')) return 'Windows';
    if (ua.includes('mac')) return 'macOS';
    if (ua.includes('linux')) return 'Linux';
    if (ua.includes('android')) return 'Android';
    if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
    return 'Unknown';
  };

  // Detectar si es móvil
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    .test(navigator.userAgent);

  // Detectar navegador específico
  const getBrowser = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edg')) return 'Edge';
    return 'Other';
  };

  // Detectar tipo de dispositivo
  const getDeviceType = () => {
    if (isMobile) return 'Mobile';
    if (navigator.userAgent.includes('Tablet')) return 'Tablet';
    return 'Desktop';
  };

  return {
    userAgent: navigator.userAgent,
    platform: getPlatform(),
    browser: getBrowser(),
    deviceType: getDeviceType(),
    isMobile: isMobile,
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString(),
    // Info adicional útil para seguridad
    cookieEnabled: navigator.cookieEnabled,
    onlineStatus: navigator.onLine,
    // Memoria aproximada del dispositivo (si está disponible)
    deviceMemory: navigator.deviceMemory || 'unknown',
    // Conexión de red (si está disponible)
    connectionType: navigator.connection?.effectiveType || 'unknown'
  };
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Acciones
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user
      }),
      
      setLoading: (isLoading) => set({ isLoading }),

      // Login - SOLO lógica de negocio
      login: async (username, password, recaptchaToken = null) => {
        try {
          set({ isLoading: true });

          const response = await api.post('/auth/login', {
            username,
            password,
            recaptcha_token: recaptchaToken || "",
            device_info: getDeviceInfo()
          });

          const user = response.data.user;
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false
          });

          return { success: true, user };

        } catch (error) {
          set({ 
            isLoading: false,
            user: null,
            isAuthenticated: false
          });
          
          // NO procesar errores - solo retornarlos sin tocar
          return { 
            success: false, 
            error: error.response?.data,
            status: error.response?.status
          };
        }
      },

      // Verificar autenticación
      checkAuth: async () => {
        try {
          const response = await api.get('/auth/me');
          const user = response.data.user;
          set({ user, isAuthenticated: true });
          return true;
        } catch (error) {
          set({ user: null, isAuthenticated: false });
          return false;
        }
      },

      // Logout
      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.log('Error en logout:', error);
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },

      // Reset store
      reset: () => set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      })
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);