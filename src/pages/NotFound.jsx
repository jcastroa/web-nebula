import React from 'react';

const NotFound = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-muted">404</h1>
        <h2 className="mb-4">Página no encontrada</h2>
        <p className="text-muted mb-4">
          La página que buscas no existe.
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.href = '/dashboard'}
        >
          Ir al Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;