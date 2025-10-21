// src/pages/configuracion/WhatsAppVinculacion.jsx
import React, { useState, useEffect } from 'react';
import {
    CheckCircle,
    ArrowRight,
    Phone,
    Loader2,
    AlertCircle,
    ExternalLink,
    CheckCircle2,
    Trash2,
    RefreshCw,
    AlertTriangle,
    Zap
} from 'lucide-react';
import whatsappService from '../services/whatsappService';

const WhatsAppVinculacion = () => {
    // Estados principales
    const [vistaActual, setVistaActual] = useState('cargando');
    const [instanciaVinculada, setInstanciaVinculada] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estados del Paso 1 - YA NO SE USAN (el backend lo maneja)
    const [sessionId, setSessionId] = useState(null);

    // Estados del Paso 2
    const [numerosDisponibles, setNumerosDisponibles] = useState([]);
    const [wabaName, setWabaName] = useState('');

    // Estados del Paso 3
    const [numeroSeleccionado, setNumeroSeleccionado] = useState(null);
    const [instanciaCreada, setInstanciaCreada] = useState(null);

    // Modal de confirmación para cancelar
    const [showCancelModal, setShowCancelModal] = useState(false);

    // ========================================
    // CARGAR INSTANCIA EXISTENTE AL MONTAR
    // ========================================
    useEffect(() => {
        verificarInstanciaExistente();
    }, []);

    const verificarInstanciaExistente = async () => {
        setVistaActual('cargando');

        try {
            const result = await whatsappService.listarInstancias();

            if (result.success && result.data?.instancias && result.data.instancias.length > 0) {
                const instancia = result.data.instancias[0];
                setInstanciaVinculada(instancia);
                setVistaActual('instancia-vinculada');
            } else {
                setVistaActual('wizard');
            }
        } catch (err) {
            console.error('Error verificando instancia:', err);
            setVistaActual('wizard');
        }
    };

    // Detectar código OAuth en la URL (callback de Meta)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (code && state && vistaActual === 'wizard' && currentStep === 1) {
            const extractedSessionId = state.replace('session_', '');
            setSessionId(extractedSessionId);

            // Avanzar automáticamente al paso 2
            handlePaso2(extractedSessionId, code);
        }
    }, [vistaActual]);

    // ========================================
    // PASO 1: Iniciar Vinculación (SIMPLIFICADO)
    // ========================================
    const handleConectarConMeta = async () => {
        setError(null);
        setIsLoading(true);

        try {
            // ✅ NO enviamos nada, el backend maneja todo con la sesión
            const result = await whatsappService.iniciarVinculacion();

            if (result.success) {
                setSessionId(result.data.session_id);

                // Redirigir a la URL de OAuth de Meta
                window.location.href = result.data.oauth_url;
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Error inesperado al iniciar vinculación');
        } finally {
            setIsLoading(false);
        }
    };

    // ========================================
    // PASO 2: Obtener Números Disponibles
    // ========================================
    const handlePaso2 = async (sid, code) => {
        setIsLoading(true);
        setError(null);
        setCurrentStep(2);

        try {
            const result = await whatsappService.obtenerNumeros(sid, code);

            if (result.success) {
                setNumerosDisponibles(result.data.numeros_disponibles || []);
                setWabaName(result.data.waba_name);

                // Limpiar URL
                window.history.replaceState({}, document.title, window.location.pathname);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Error al obtener números disponibles');
        } finally {
            setIsLoading(false);
        }
    };

    // ========================================
    // PASO 3: Seleccionar Número y Crear Instancia
    // ========================================
    const handlePaso3Submit = async () => {
        if (!numeroSeleccionado) {
            setError('Debes seleccionar un número');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await whatsappService.seleccionarNumero(
                sessionId,
                numeroSeleccionado.phone_number_id
            );

            if (result.success) {
                setInstanciaCreada(result.data);
                setCurrentStep(3);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Error al crear instancia');
        } finally {
            setIsLoading(false);
        }
    };

    // ========================================
    // CANCELAR VINCULACIÓN
    // ========================================
    const handleCancelarVinculacion = async () => {
        if (!instanciaVinculada) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await whatsappService.cancelarVinculacion(instanciaVinculada.id);

            if (result.success) {
                setInstanciaVinculada(null);
                setShowCancelModal(false);
                resetWizard();
                setVistaActual('wizard');
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Error inesperado al cancelar vinculación');
        } finally {
            setIsLoading(false);
        }
    };

    // ========================================
    // REFRESCAR ESTADO
    // ========================================
    const handleRefreshEstado = async () => {
        if (!instanciaVinculada) return;

        setIsLoading(true);

        try {
            const result = await whatsappService.obtenerEstadoVinculacion(instanciaVinculada.id);

            if (result.success) {
                setInstanciaVinculada(result.data);
            }
        } catch (err) {
            console.error('Error refrescando estado:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // ========================================
    // RESETEAR WIZARD
    // ========================================
    const resetWizard = () => {
        setCurrentStep(1);
        setSessionId(null);
        setNumerosDisponibles([]);
        setNumeroSeleccionado(null);
        setInstanciaCreada(null);
        setError(null);
    };

    // ========================================
    // COMPLETAR VINCULACIÓN
    // ========================================
    const handleCompletarVinculacion = () => {
        verificarInstanciaExistente();
    };

    // ========================================
    // RENDERS
    // ========================================
    const renderStepper = () => {
        const steps = [
            { number: 1, title: 'Conectar', description: 'Autorizar con Meta' },
            { number: 2, title: 'Seleccionar Número', description: 'Elige tu número' },
            { number: 3, title: 'Confirmación', description: 'Instancia creada' }
        ];

        return (
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.number}>
                            <div className="flex flex-col items-center flex-1">
                                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg
                  transition-all duration-300
                  ${currentStep > step.number
                                        ? 'bg-green-500 text-white'
                                        : currentStep === step.number
                                            ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                                            : 'bg-gray-200 text-gray-500'
                                    }
                `}>
                                    {currentStep > step.number ? (
                                        <CheckCircle className="w-6 h-6" />
                                    ) : (
                                        <span>{step.number}</span>
                                    )}
                                </div>

                                <div className="text-center mt-2">
                                    <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                                        }`}>
                                        {step.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {step.description}
                                    </p>
                                </div>
                            </div>

                            {index < steps.length - 1 && (
                                <div className={`
                  h-1 flex-1 mx-4 rounded
                  transition-all duration-300
                  ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'}
                `} style={{ marginTop: '-2rem' }} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    };

    const renderStepContent = () => {
        // ========================================
        // PASO 1 - SIMPLIFICADO (NUEVO)
        // ========================================
        if (currentStep === 1) {
            return (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">

                    {/* Header Minimalista - ACTUALIZADO */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 p-8 text-center">

                        {/* Logo WhatsApp */}
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-200">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="#25D366"
                                className="w-10 h-10"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                        </div>

                        {/* Título */}
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                            Conecta tu WhatsApp a Cita247
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Para integrar tu cuenta de WhatsApp con nuestro bot de citas,
                            necesitamos autorización segura a través de Meta (Facebook).
                        </p>
                    </div>

                    {/* Contenido */}
                    <div className="p-8">

                        {/* Beneficios */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="text-center p-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Zap className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="font-medium text-gray-900 mb-1">Rápido y Seguro</h3>
                                <p className="text-sm text-gray-600">
                                    Conexión directa con Meta
                                </p>
                            </div>

                            <div className="text-center p-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Phone className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-medium text-gray-900 mb-1">Tu número</h3>
                                <p className="text-sm text-gray-600">
                                    Usa tu número verificado
                                </p>
                            </div>

                            <div className="text-center p-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="font-medium text-gray-900 mb-1">Automático</h3>
                                <p className="text-sm text-gray-600">
                                    Sin configuración manual
                                </p>
                            </div>
                        </div>

                        {/* Información */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-900 mb-2">
                                        ¿Qué sucederá después?
                                    </p>
                                    <ol className="text-sm text-blue-800 space-y-1.5">
                                        <li className="flex items-start gap-2">
                                            <span className="font-semibold">1.</span>
                                            <span>Serás redirigido a Facebook/Meta para autorizar</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-semibold">2.</span>
                                            <span>Seleccionarás tu cuenta de WhatsApp Business</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-semibold">3.</span>
                                            <span>Elegirás el número de teléfono a vincular</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-semibold">4.</span>
                                            <span>¡Listo! Tu WhatsApp estará conectado</span>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                        {/* Botón principal */}
                        <div className="flex justify-center">
                            <button
                                onClick={handleConectarConMeta}
                                disabled={isLoading}
                                className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span className="text-lg font-semibold">Conectando...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                                        </svg>
                                        <span className="text-lg font-semibold">Conectar con Meta</span>
                                        <ExternalLink className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Nota de seguridad */}
                        <p className="text-center text-xs text-gray-500 mt-6">
                            🔒 Conexión segura mediante OAuth 2.0 de Meta
                            <br></br>No almacenamos tus credenciales ni accedemos a tus mensajes.
                        </p>
                    </div>
                </div>
            );
        }

        // PASO 2 - Seleccionar Número (sin cambios)
        if (currentStep === 2) {
            return (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Phone className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Selecciona tu Número de WhatsApp
                            </h2>
                            <p className="text-sm text-gray-500">
                                Cuenta: <span className="font-medium text-gray-700">{wabaName}</span>
                            </p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                            <p className="text-gray-600">Obteniendo tus números disponibles...</p>
                        </div>
                    ) : numerosDisponibles.length === 0 ? (
                        <div className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No se encontraron números
                            </h3>
                            <p className="text-gray-600">
                                No hay números de WhatsApp disponibles en tu cuenta de Meta.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3 mb-6">
                                {numerosDisponibles.map((numero) => (
                                    <div
                                        key={numero.phone_number_id}
                                        onClick={() => setNumeroSeleccionado(numero)}
                                        className={`
                      p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${numeroSeleccionado?.phone_number_id === numero.phone_number_id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-300'
                                            }
                    `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          ${numeroSeleccionado?.phone_number_id === numero.phone_number_id
                                                        ? 'bg-blue-100'
                                                        : 'bg-gray-100'
                                                    }
                        `}>
                                                    <Phone className={`w-5 h-5 ${numeroSeleccionado?.phone_number_id === numero.phone_number_id
                                                        ? 'text-blue-600'
                                                        : 'text-gray-600'
                                                        }`} />
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {numero.display_phone_number}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {numero.verified_name}
                                                    </p>
                                                    <div className="flex gap-3 mt-1">
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${numero.quality_rating === 'GREEN'
                                                            ? 'bg-green-100 text-green-700'
                                                            : numero.quality_rating === 'YELLOW'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            Calidad: {numero.quality_rating || 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {numeroSeleccionado?.phone_number_id === numero.phone_number_id && (
                                                <CheckCircle2 className="w-6 h-6 text-blue-600" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end pt-4 border-t">
                                <button
                                    onClick={handlePaso3Submit}
                                    disabled={!numeroSeleccionado || isLoading}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Creando...
                                        </>
                                    ) : (
                                        <>
                                            Crear Instancia
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            );
        }

        // PASO 3 - Confirmación (sin cambios)
        if (currentStep === 3) {
            return (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>

                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            ¡Vinculación Exitosa!
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Tu número de WhatsApp ha sido vinculado correctamente
                        </p>

                        {instanciaCreada && (
                            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left max-w-2xl mx-auto">
                                <h3 className="font-semibold text-gray-900 mb-4">
                                    Detalles de la Instancia
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Número:</span>
                                        <span className="font-medium text-gray-900">
                                            {instanciaCreada.whatsapp?.phone_number}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Nombre Verificado:</span>
                                        <span className="font-medium text-gray-900">
                                            {instanciaCreada.whatsapp?.verified_name}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">Calidad:</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${instanciaCreada.whatsapp?.quality_rating === 'GREEN'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {instanciaCreada.whatsapp?.quality_rating || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={handleCompletarVinculacion}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Ver Instancia Vinculada
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
    };

    // VISTA DE INSTANCIA VINCULADA (sin cambios - ya la tienes)
    const renderInstanciaVinculada = () => {
        // ... código que ya tienes ...
    };

    // ========================================
    // RENDER PRINCIPAL
    // ========================================
    if (vistaActual === 'cargando') {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600">Verificando estado de vinculación...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    WhatsApp Business
                </h1>
                <p className="text-gray-600">
                    {vistaActual === 'instancia-vinculada'
                        ? 'Gestiona tu número de WhatsApp Business vinculado'
                        : 'Conecta tu número de WhatsApp Business con Meta'
                    }
                </p>
            </div>

            {error && (
                <div className="relative mb-6 bg-red-50 border border-red-200 rounded-xl p-5 text-center shadow-sm">
                    {/* Botón de cerrar arriba a la derecha */}
                    <button
                        onClick={() => setError(null)}
                        className="absolute top-2.5 right-3 text-red-500 hover:text-red-700 font-bold text-xl leading-none transition-colors"
                        aria-label="Cerrar"
                    >
                        ×
                    </button>

                    {/* Ícono arriba centrado */}
                    <div className="flex flex-col items-center gap-3">
                        <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-800 break-words whitespace-pre-wrap leading-relaxed max-w-full px-2">
                            {error}
                        </p>
                    </div>
                </div>
            )}



            {vistaActual === 'instancia-vinculada' ? (
                renderInstanciaVinculada()
            ) : (
                <>
                    {renderStepper()}
                    {renderStepContent()}
                </>
            )}
        </div>
    );
};

export default WhatsAppVinculacion;