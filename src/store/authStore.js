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
      // ✅ SOLO estado de autenticación persistente
      user: null,
      isAuthenticated: false,
      isLoading: false, // ✅ Por defecto NO loading

      // Acciones básicas
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false // ✅ Loading false cuando tenemos datos
      }),

      // ✅ Login simple - SOLO maneja autenticación exitosa
      login: async (username, password, recaptchaToken = null) => {
        try {
          // ✅ NO tocar el store hasta saber el resultado
          const response = await api.post('/auth/login', {
            username,
            password,
            recaptcha_token: recaptchaToken || "",
            device_info: getDeviceInfo()
          });

          // ✅ ÉXITO: Actualizar store con datos persistentes
          const user = response.data.user;
          set({ 
            user, 
            isAuthenticated: true
          });

          return { success: true, user };

        } catch (error) {
          // ✅ ERROR: NO TOCAR EL STORE
          return { 
            success: false, 
            error: error.response?.data,
            status: error.response?.status
          };
        }
      },

      // ✅ Verificar autenticación existente
      checkAuth: async () => {
        console.log('🔍 === INICIANDO checkAuth ===');
        console.log('🍪 Cookies actuales:', document.cookie);
        
        // ✅ Establecer loading solo cuando empezamos a verificar
        set({ isLoading: true });
        
        try {
          console.log('📡 Haciendo GET /auth/me...');
          const response = await api.get('/auth/me');
          console.log('✅ Respuesta exitosa status:', response.status);
          console.log('📡 Respuesta completa del servidor:', response.data);
          
          const user = response.data;
          console.log('👤 Usuario extraído:', user);
          
          if (!user || !user.usuario.id) {
            console.log('❌ Datos de usuario inválidos - limpiando estado');
            set({ user: null, isAuthenticated: false, isLoading: false });
            return false;
          }
          
          console.log('✅ Usuario válido - actualizando store');
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
          
        } catch (error) {
          console.log('💥 === ERROR EN checkAuth ===');
          console.log('Status:', error.response?.status);
          console.log('Data:', error.response?.data);
          console.log('Message:', error.message);
          console.log('Config URL:', error.config?.url);
          console.log('🧹 Limpiando estado...');
          
          set({ user: null, isAuthenticated: false, isLoading: false });
          return false;
        }
      },

      // ✅ Logout - limpiar datos persistentes
      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.log('Error en logout:', error);
        } finally {
          // ✅ Limpiar datos persistentes
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false
          });
        }
      },

      // ✅ Logout forzado (para token expirado)
      forceLogout: () => {
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false
        });
      },

      // ✅ NUEVA FUNCIÓN: Cambiar consultorio
      cambiarConsultorio: async (consultorioId) => {
        console.log('🏥 Cambiando consultorio a:', consultorioId);
        
        // ✅ Mostrar loading durante el cambio
        set({ isLoading: true });
        
        try {
          const response = await api.post('/auth/cambiar-consultorio', {
            consultorio_id: parseInt(consultorioId) // Asegurar que sea número
          });

          console.log('✅ Consultorio cambiado exitosamente:', response.data);
          
          // Actualizar el store con la nueva data del usuario
          const updatedData = response.data;
          
          if (updatedData.success && updatedData.user) {
            set({ 
              user: updatedData.user,
              isAuthenticated: true,
              isLoading: false // ✅ Quitar loading
            });
            
            console.log('🔄 Store actualizado con nuevo consultorio');
            return { 
              success: true, 
              message: updatedData.message,
              user: updatedData.user 
            };
          } else {
            console.log('❌ Respuesta sin datos de usuario válidos');
            set({ isLoading: false }); // ✅ Quitar loading en error
            return { 
              success: false, 
              error: 'Respuesta inválida del servidor' 
            };
          }

        } catch (error) {
          console.log('❌ Error cambiando consultorio:', error.response?.data);
          set({ isLoading: false }); // ✅ Quitar loading en error
          
          return { 
            success: false, 
            error: error.response?.data?.detail || 'Error cambiando consultorio',
            status: error.response?.status
          };
        }
      },

      // Funciones de utilidad para acceder a datos específicos
      getUserInfo: () => get().user?.usuario,
      
      getGlobalRole: () => get().user?.rol_global,
      
      getPermissions: () => get().user?.permisos_lista || [],
      
      hasPermission: (moduleName, action = 'READ') => {
        const state = get();
        if (!state.user?.permisos_lista) return false;
        
        const permission = `${moduleName}:${action}`;
        return state.user.permisos_lista.includes(permission) || state.user.es_superadmin;
      },
      
      isSuperAdmin: () => get().user?.es_superadmin || false,
      
      getCurrentConsultorio: () => get().user?.consultorio_contexto_actual,
      
      getUserConsultorios: () => get().user?.consultorios_usuario || [],
      
      getAllConsultorios: () => get().user?.todos_consultorios || [],
      
      getMenuModules: () => get().user?.menu_modulos || [],

      // Reset completo
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