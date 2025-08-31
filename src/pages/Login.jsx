import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { processValidationErrors } from '../utils/errorUtils';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

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

        setFieldErrors({});
        setGeneralError('');
        setIsLoading(true);

        if (!formData.username || !formData.password) {
            setIsLoading(false);
            return;
        }

        const result = await login(formData.username, formData.password);

        setIsLoading(false);

        if (result.success) {
            setFormData({ username: '', password: '' });
            navigate('/dashboard', { replace: true });
        } else {
            const { fieldErrors: fields, generalError: general } = processValidationErrors(
                result.error,
                result.status
            );

            if (result.status !== 422) {
                setFormData({ username: '', password: '' });
            }

            if (fields && Object.keys(fields).length > 0) {
                setFieldErrors(fields);
            }

            if (general) {
                setGeneralError(general);
            }
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-white">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-4 col-lg-5 col-md-6">

                        <div className="mx-auto" style={{ maxWidth: '400px' }}>
                            
                            {/* Logo y título */}
                            <div className="text-center mb-5">
                                <div className="d-inline-flex align-items-center justify-content-center mb-4"
                                     style={{
                                         width: '80px',
                                         height: '80px',
                                         background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                         borderRadius: '20px',
                                         boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)'
                                     }}>
                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                        <circle cx="12" cy="16" r="1"/>
                                        <path d="m7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                </div>
                                
                                <h2 className="h3 fw-bold text-dark mb-2">Acceso al Sistema</h2>
                                <p className="text-muted mb-0">Ingrese sus credenciales para continuar</p>
                            </div>

                            {/* Error general */}
                            {generalError && (
                                <div className="mb-4 p-3 rounded-3" 
                                     style={{
                                         backgroundColor: '#fef2f2',
                                         border: '1px solid #fecaca',
                                         color: '#dc2626'
                                     }}>
                                    <div className="d-flex align-items-center">
                                        <svg width="16" height="16" fill="currentColor" className="me-2">
                                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                        </svg>
                                        <span className="fw-medium">{generalError}</span>
                                    </div>
                                    <button type="button" 
                                            className="btn-close position-absolute top-0 end-0 mt-3 me-3" 
                                            onClick={() => setGeneralError('')}
                                            aria-label="Cerrar"></button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

                                {/* Campo Username */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold text-dark mb-2">
                                        Usuario
                                    </label>
                                    <div className="position-relative">
                                        <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                                            <svg width="18" height="18" fill="currentColor" className="text-muted">
                                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            name="username"
                                            className="form-control ps-5"
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="Ingrese su usuario"
                                            disabled={isLoading}
                                            required
                                            style={{
                                                height: '50px',
                                                fontSize: '15px',
                                                backgroundColor: '#f8fafc',
                                                border: fieldErrors.username ? '2px solid #dc2626' : '1px solid #e2e8f0',
                                                borderRadius: '12px',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.backgroundColor = '#ffffff';
                                                e.target.style.borderColor = '#3b82f6';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.backgroundColor = '#f8fafc';
                                                e.target.style.borderColor = fieldErrors.username ? '#dc2626' : '#e2e8f0';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    </div>
                                    {fieldErrors.username && (
                                        <div className="mt-2 text-danger small d-flex align-items-center">
                                            <svg width="14" height="14" fill="currentColor" className="me-1">
                                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                            </svg>
                                            {fieldErrors.username}
                                        </div>
                                    )}
                                </div>

                                {/* Campo Password */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold text-dark mb-2">
                                        Contraseña
                                    </label>
                                    <div className="position-relative">
                                        <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                                            <svg width="18" height="18" fill="currentColor" className="text-muted">
                                                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                                            </svg>
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            className="form-control ps-5 pe-5"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Ingrese su contraseña"
                                            disabled={isLoading}
                                            required
                                            style={{
                                                height: '50px',
                                                fontSize: '15px',
                                                backgroundColor: '#f8fafc',
                                                border: fieldErrors.password ? '2px solid #dc2626' : '1px solid #e2e8f0',
                                                borderRadius: '12px',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.backgroundColor = '#ffffff';
                                                e.target.style.borderColor = '#3b82f6';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.backgroundColor = '#f8fafc';
                                                e.target.style.borderColor = fieldErrors.password ? '#dc2626' : '#e2e8f0';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="btn position-absolute top-50 end-0 translate-middle-y me-2"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                border: 'none',
                                                background: 'none',
                                                padding: '8px',
                                                color: '#6b7280'
                                            }}
                                        >
                                            {showPassword ? (
                                                <svg width="18" height="18" fill="currentColor">
                                                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                                                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                                                    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.708zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                                                </svg>
                                            ) : (
                                                <svg width="18" height="18" fill="currentColor">
                                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {fieldErrors.password && (
                                        <div className="mt-2 text-danger small d-flex align-items-center">
                                            <svg width="14" height="14" fill="currentColor" className="me-1">
                                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                            </svg>
                                            {fieldErrors.password}
                                        </div>
                                    )}
                                </div>

                                {/* Botón de envío */}
                                <div className="d-grid mb-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isLoading}
                                        style={{
                                            height: '50px',
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                            border: 'none',
                                            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isLoading) {
                                                e.target.style.transform = 'translateY(-1px)';
                                                e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isLoading) {
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
                                            }
                                        }}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="spinner-border spinner-border-sm me-2" 
                                                     role="status" 
                                                     aria-hidden="true"></div>
                                                Iniciando sesión...
                                            </>
                                        ) : (
                                            <>
                                                <svg width="18" height="18" fill="currentColor" className="me-2">
                                                    <path fillRule="evenodd" d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0v-2z"/>
                                                    <path fillRule="evenodd" d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
                                                </svg>
                                                Iniciar Sesión
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Footer de seguridad */}
                                <div className="text-center">
                                    <small className="text-muted d-flex align-items-center justify-content-center">
                                        <svg width="14" height="14" fill="currentColor" className="me-1 text-success">
                                            <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
                                            <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                                        </svg>
                                        Conexión segura SSL
                                    </small>
                                </div>
                            </form>

                        </div>

                        {/* Footer */}
                        <div className="text-center mt-5">
                            <small className="text-muted">
                                Sistema de Gestión Empresarial
                            </small>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;