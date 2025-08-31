import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { processValidationErrors } from '../utils/errorUtils';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // Estado de errores - LOCAL al formulario
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario escribe
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Limpiar errores previos
    setFieldErrors({});
    setGeneralError('');
    
    if (!formData.username || !formData.password) {
      return;
    }

    // Llamar al store - SOLO lógica de negocio
    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      // Procesar errores de UI - LOCAL al formulario
      const { fieldErrors: fields, generalError: general } = processValidationErrors(result.error, result.status);
      
      if (fields && Object.keys(fields).length > 0) {
        setFieldErrors(fields);
      }
      
      if (general) {
        setGeneralError(general);
      }
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

                {/* Error general */}
                {generalError && (
                  <div className="alert alert-danger alert-dismissible fade show">
                    {generalError}
                    <button 
                      type="button" 
                      className="btn-close"
                      onClick={() => setGeneralError('')}
                    ></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  
                  {/* Campo Username */}
                  <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <input
                      type="text"
                      name="username"
                      className={`form-control ${fieldErrors.username ? 'is-invalid' : ''}`}
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="tu_usuario"
                      disabled={isLoading}
                      required
                    />
                    {fieldErrors.username && (
                      <div className="invalid-feedback">
                        {fieldErrors.username}
                      </div>
                    )}
                  </div>

                  {/* Campo Password */}
                  <div className="mb-4">
                    <label className="form-label">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      disabled={isLoading}
                      required
                    />
                    {fieldErrors.password && (
                      <div className="invalid-feedback">
                        {fieldErrors.password}
                      </div>
                    )}
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </button>
                  </div>
                </form>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;