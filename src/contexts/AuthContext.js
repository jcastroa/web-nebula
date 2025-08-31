// // src/contexts/AuthContext.js
// import React, { createContext, useContext, useEffect } from 'react';
// import { useAuthStore } from '../store/authStore';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const store = useAuthStore(); // UNA sola instancia estable
  
//   // Verificación inicial SOLO una vez
//   useEffect(() => {
//     if (!store.isAuthenticated && !store.user) {
//       store.checkAuth();
//     }
//   }, []); // Array vacío - sin dependencias que causen re-creaciones

//   // Valor estable - no se recrea en cada render
//   return (
//     <AuthContext.Provider value={store}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook simple que solo retorna el contexto
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth debe usarse dentro de AuthProvider');
//   }
//   return context;
// };

// export default AuthContext;



// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const store = useAuthStore();
  
  // ✅ Verificar autenticación de forma inteligente
  useEffect(() => {
    console.log('🚀 AuthProvider montado - Estado inicial:', {
      isAuthenticated: store.isAuthenticated,
      hasUser: !!store.user
    });
    
    // ✅ CASO 1: Primera carga (no hay datos) - verificar con servidor
    if (!store.isAuthenticated && !store.user) {
      console.log('🔄 Primera carga - verificando si hay sesión activa...');
      store.checkAuth();
    }
    // ✅ CASO 2: Datos corruptos (autenticado pero sin usuario) - verificar con servidor  
    else if (store.isAuthenticated && !store.user) {
      console.log('🔄 Datos corruptos - verificando con servidor...');
      store.checkAuth();
    }
    // ✅ CASO 3: Datos completos - confiar en localStorage, NO verificar
    else if (store.isAuthenticated && store.user) {
      console.log('✅ Datos completos en localStorage - NO verificar servidor');
      // No hacer nada, confiar en los datos locales
    }
  }, []);

  return (
    <AuthContext.Provider value={store}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;