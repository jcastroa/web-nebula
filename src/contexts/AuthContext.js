



// // src/contexts/AuthContext.js
// import React, { createContext, useContext, useEffect } from 'react';
// import { useAuthStore } from '../store/authStore';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const store = useAuthStore();
  
//   // ✅ Verificar autenticación de forma inteligente
//   useEffect(() => {
//     console.log('🚀 AuthProvider montado - Estado inicial:', {
//       isAuthenticated: store.isAuthenticated,
//       hasUser: !!store.user
//     });
    
//     // ✅ CASO 1: Primera carga (no hay datos) - verificar con servidor
//     if (!store.isAuthenticated && !store.user) {
//       console.log('🔄 Primera carga - verificando si hay sesión activa...');
//       store.checkAuth();
//     }
//     // ✅ CASO 2: Datos corruptos (autenticado pero sin usuario) - verificar con servidor  
//     else if (store.isAuthenticated && !store.user) {
//       console.log('🔄 Datos corruptos - verificando con servidor...');
//       store.checkAuth();
//     }
//     // ✅ CASO 3: Datos completos - confiar en localStorage, NO verificar
//     else if (store.isAuthenticated && store.user) {
//       console.log('✅ Datos completos en localStorage - NO verificar servidor');
//       // No hacer nada, confiar en los datos locales
//     }
//   }, []);

//   const contextValue = {
//     // Estado
//     user: store.user,
//     isAuthenticated: store.isAuthenticated,
//     isLoading: store.isLoading,
//     sessionId: store.sessionId,
//     csrfToken: store.csrfToken,
//     expiresIn: store.expiresIn,
    
//     // Acciones principales
//     login: store.login,
//     logout: store.logout,
//     checkAuth: store.checkAuth,
//     forceLogout: store.forceLogout,
//     setUser: store.setUser,
//     reset: store.reset,
    
//     // ✅ Nueva función de cambio de consultorio
//     cambiarConsultorio: store.cambiarConsultorio,
    
//     // Funciones de utilidad
//     getUserInfo: store.getUserInfo,
//     getGlobalRole: store.getGlobalRole,
//     getPermissions: store.getPermissions,
//     hasPermission: store.hasPermission,
//     isSuperAdmin: store.isSuperAdmin,
//     getCurrentConsultorio: store.getCurrentConsultorio,
//     getUserConsultorios: store.getUserConsultorios,
//     getAllConsultorios: store.getAllConsultorios,
//     getMenuModules: store.getMenuModules
//   };

//   return (
//     <AuthContext.Provider value={store}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth debe usarse dentro de AuthProvider');
//   }
//   return context;
// };

// export default AuthContext;


// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { wasRecentlyLoggedOut } from '../utils/sessionHelpers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const store = useAuthStore();
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      console.log('🚀 AuthProvider montado - Estado inicial:', {
        isAuthenticated: store.isAuthenticated,
        hasUser: !!store.user
      });

      // Si hubo logout muy reciente, no intentar restaurar sesión
      if (wasRecentlyLoggedOut(5)) {
        console.log('⛔ Logout reciente detectado - no intentar /auth/me');
        if (mounted) setAuthInitialized(true);
        return;
      }

      // CASO: si store está vacío o corrupto -> verificar con servidor
      if (!store.isAuthenticated || !store.user) {
        try {
          await store.checkAuth(); // checkAuth debe retornar true|false
        } catch (e) {
          console.warn('checkAuth fallo', e);
        }
      } else {
        console.log('✅ Datos completos en localStorage - NO verificar servidor');
      }

      if (mounted) setAuthInitialized(true);
    };

    init();

    // escuchar mensajes de otras pestañas sobre session-expired para reaccionar en caliente
    let bc;
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel('auth');
      bc.onmessage = (ev) => {
        if (ev.data?.type === 'session-expired') {
          try {
            store.forceLogout();
          } catch (e) {}
        }
      };
    } else {
      // fallback: escuchar storage events
      const onStorage = (e) => {
        if (e.key === 'session-expired-at' || e.key === 'session-expired-bump') {
          try { store.forceLogout(); } catch (err) {}
        }
      };
      window.addEventListener('storage', onStorage);
      // cleanup
      return () => {
        window.removeEventListener('storage', onStorage);
      };
    }

    return () => {
      mounted = false;
      if (bc) bc.close();
    };
  }, []);

  // Exponer store directamente (ya lo tenías)
  return (
    <AuthContext.Provider value={store}>
      {/* Si no hemos inicializado, podríamos mostrar un spinner en vez de children */}
      {!authInitialized ? (
        <div className="h-screen flex items-center justify-center">Comprobando sesión...</div>
      ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};

export default AuthContext;
