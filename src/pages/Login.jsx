import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { login, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            
            <div className="card shadow border-0">
              <div className="card-body p-4">
                
                <div className="text-center mb-4">
                  <h4 className="text-dark mb-1">Iniciar Sesión</h4>
                  <p className="text-muted small">Accede a tu cuenta</p>
                </div>

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show">
                    {error}
                    <button 
                      type="button" 
                      className="btn-close"
                      onClick={clearError}
                    ></button>
                  </div>
                )}

                <div onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="d-grid">
                    <button
                      type="button"
                      className="btn btn-primary btn-lg"
                      onClick={handleSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </button>
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

export default Login;