// src/App.js
import React from 'react';
import { useAuth } from './hooks/useAuth';

// Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3"></div>
          <p className="text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si está autenticado, mostrar Dashboard
  if (isAuthenticated && user) {
    return <Dashboard />;
  }

  // Si no está autenticado, mostrar Login
  return <Login />;
}

export default App;