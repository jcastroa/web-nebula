import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { processValidationErrors } from '../utils/errorUtils';
import { Rocket, User, Eye, EyeOff } from 'lucide-react';

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

        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Contenedor principal */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

                    {/* Header */}
                    <div className="px-8 pt-8 pb-6">
                        <div className="text-center space-y-4">
                            {/* Logo - imagen de prueba */}
                            <div className="mx-auto text-center">
                                <img
                                    src="/logo_4.png"
                                    alt="Logo de la empresa"
                                    className=" h-32 w-32 mx-auto object-contain"
                                />
                            </div>

                            {/* Título minimalista */}
                            <div>
                                <h1 className="text-2xl font-semibold text-slate-900">Iniciar Sesión</h1>
                                <p className="text-sm text-slate-500 mt-1">Accede a tu cuenta</p>
                            </div>
                        </div>
                    </div>

                    {/* Formulario */}
                    <div className="px-8 pb-8">

                        {/* Error general */}
                        {generalError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm text-red-800 font-medium">{generalError}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setGeneralError('')}
                                        className="text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        <div onSubmit={handleSubmit} className="space-y-5">

                            {/* Campo Usuario */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Usuario
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Ingrese su usuario"
                                        disabled={isLoading}
                                        required
                                        className={`w-full px-4 py-3.5 bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 
                                                   focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
                                                   disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                                                   ${fieldErrors.username ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-slate-200'}`}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                        <User className="w-5 h-5 text-slate-400" />
                                    </div>
                                </div>
                                {fieldErrors.username && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {fieldErrors.username}
                                    </p>
                                )}
                            </div>

                            {/* Campo Contraseña */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Ingrese su contraseña"
                                        disabled={isLoading}
                                        required
                                        className={`w-full px-4 py-3.5 bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400
                                                   focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
                                                   disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 pr-12
                                                   ${fieldErrors.password ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-slate-200'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {fieldErrors.password && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {fieldErrors.password}
                                    </p>
                                )}
                            </div>

                            {/* Botón de envío */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                onClick={handleSubmit}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3.5 px-4 rounded-xl
                                          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                          focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
                                          active:scale-[0.98] shadow-sm hover:shadow-md"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Iniciando sesión...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        Iniciar Sesión
                                    </div>
                                )}
                            </button>

                        </div>
                    </div>

                    {/* Footer minimalista */}
                    <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
                        <div className="flex items-center justify-center text-xs text-slate-500">
                            <Rocket className="w-4 h-4 mr-1 text-slate-400" />
                            Cita247 v.0.1
                        </div>
                    </div>

                </div>

                {/* Branding discreto */}
                <div className="text-center mt-8">
                    <p className="text-xs text-slate-400">
                        © 2025{" "}
                        <a
                            href="https://neuronasystems.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            Neurona Systems
                        </a>
                        . Todos los derechos reservados.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;