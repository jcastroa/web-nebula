import React, { useState } from 'react';
import axios from 'axios';

const TestComponent = () => {
  const [testError, setTestError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ TEST: Llamada directa a axios SIN usar el AuthStore
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 SUBMIT SIN AUTH STORE');
    
    try {
      const response = await axios.post('http://localhost:8000/api/v1/auth/login', {
        username: formData.username,
        password: formData.password,
        recaptcha_token: "",
        device_info: {}
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Login exitoso:', response.data);
      
    } catch (error) {
      console.log('❌ Error en login:', error.response?.data);
      
      // ✅ Establecer error DIRECTAMENTE
      console.log('🚀 Estableciendo error directo...');
      setTestError('ERROR DIRECTO - Funciona!');
      console.log('🚀 Después del setTestError directo');
    }
  };

  console.log('🚀 RENDER - testError:', testError);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            
            <div className="card shadow border-0">
              <div className="card-body p-4">
                
                <div className="text-center mb-4">
                  <h4 className="text-dark mb-1">TEST SIN AUTH STORE</h4>
                  <p className="text-muted small">Prueba aislada</p>
                </div>

                {/* Debug info */}
                <div style={{
                  border: '2px solid blue',
                  padding: '10px',
                  marginBottom: '10px',
                  backgroundColor: '#e3f2fd'
                }}>
                  <strong>DEBUG:</strong><br/>
                  testError: "{testError}"<br/>
                </div>

                {/* Error display */}
                {testError && (
                  <div style={{
                    border: '2px solid red',
                    padding: '10px',
                    marginBottom: '10px',
                    backgroundColor: '#ffebee',
                    color: 'red'
                  }}>
                    <strong>ERROR:</strong> {testError}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  
                  <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="tu_usuario"
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
                      required
                    />
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                    >
                      Test Submit
                    </button>
                  </div>
                </form>

                {/* Botón de test directo */}
                <div className="mt-3">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                      console.log('🚀 Click directo en test');
                      setTestError('ERROR DESDE BOTÓN');
                    }}
                  >
                    Test Botón Directo
                  </button>
                  
                  <button
                    type="button"
                    className="btn btn-warning ms-2"
                    onClick={() => {
                      console.log('🚀 Limpiando error');
                      setTestError('');
                    }}
                  >
                    Limpiar
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;