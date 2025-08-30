import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand">Mi App</span>
          
          <div className="navbar-nav ms-auto">
            <div className="nav-item dropdown">
              <button 
                className="btn btn-link nav-link dropdown-toggle text-white"
                type="button"
                data-bs-toggle="dropdown"
              >
                {user?.name || user?.email}
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button 
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            
            <div className="card">
              <div className="card-body">
                <h1 className="card-title">
                  ¡Bienvenido, {user?.name || 'Usuario'}!
                </h1>
                <p className="card-text text-muted">
                  Email: {user?.email}
                </p>
                <p className="card-text text-muted">
                  ID: {user?.id}
                </p>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-md-4">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <h5>Bienvenido</h5>
                    <h2>{user?.name}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <h5>Tu Email</h5>
                    <p className="mb-0">{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-info text-white">
                  <div className="card-body">
                    <h5>Estado</h5>
                    <p className="mb-0">Conectado</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;