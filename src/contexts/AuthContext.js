// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const store = useAuthStore(); // UNA sola instancia estable
  
  // Verificación inicial SOLO una vez
  useEffect(() => {
    if (!store.isAuthenticated && !store.user) {
      store.checkAuth();
    }
  }, []); // Array vacío - sin dependencias que causen re-creaciones

  // Valor estable - no se recrea en cada render
  return (
    <AuthContext.Provider value={store}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook simple que solo retorna el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;