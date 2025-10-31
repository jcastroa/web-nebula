import React, { useState, useEffect } from 'react';
import {
    Bot,
    Building2,
    DollarSign,
    FileText,
    AlertCircle,
    Save,
    Loader2,
    Eye,
    CheckCircle2,
    X,
    Plus,
    Trash2
} from 'lucide-react';
import { chatbotService } from '../services/chatbotService';

const ChatbotConfig = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isNewConfig, setIsNewConfig] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);

    const [config, setConfig] = useState({
        negocio: {
            nombre: '',
            horario: '',
            telefono: '',
            direccion: '',
            sitioWeb: '',
            email: ''
        },
        servicios: {
            especialidades: [],
            preciosAdicionales: []
        },
        politicas: {
            protocolos: []
        },
        preguntasFrecuentes: []
    });

    useEffect(() => {
        cargarConfiguracion();
    }, []);

    const cargarConfiguracion = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await chatbotService.obtenerConfiguracion();

            // El servicio retorna { id, negocio_id, configuracion, ... }
            // Solo necesitamos el campo 'configuracion' para el estado
            if (data && data.configuracion) {
                setConfig(data.configuracion);
                setIsNewConfig(false);
            } else {
                // Si no viene configuracion, usar valores por defecto
                setConfig(chatbotService.getConfiguracionDefault());
                setIsNewConfig(true);
            }
        } catch (err) {
            console.error('Error al cargar configuración:', err);

            // Si es un error 404 (no hay configuración guardada), usar configuración por defecto
            if (err.message?.includes('404') || err.message?.includes('not found')) {
                console.log('No hay configuración guardada, usando valores por defecto');
                setConfig(chatbotService.getConfiguracionDefault());
                setIsNewConfig(true);
            } else {
                // Para otros errores, mostrar mensaje pero también cargar valores por defecto
                setError(err.message || 'Error al cargar la configuración del chatbot');
                setConfig(chatbotService.getConfiguracionDefault());
                setIsNewConfig(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const validarConfiguracion = () => {
        const errores = [];

        // Validar Información del Negocio (obligatorio)
        if (!config.negocio.nombre?.trim()) {
            errores.push('El nombre del centro médico es obligatorio');
        }
        if (!config.negocio.horario?.trim()) {
            errores.push('El horario de atención es obligatorio');
        }
        if (!config.negocio.telefono?.trim()) {
            errores.push('El teléfono es obligatorio');
        }

        // Validar Servicios (al menos 1 especialidad obligatoria)
        if (!config.servicios.especialidades || config.servicios.especialidades.length === 0) {
            errores.push('Debes agregar al menos una especialidad');
        } else {
            const especialidadesValidas = config.servicios.especialidades.filter(
                esp => esp.nombre?.trim() && esp.precio?.trim()
            );
            if (especialidadesValidas.length === 0) {
                errores.push('Debes completar al menos una especialidad con nombre y precio');
            }
        }

        return errores;
    };

    const handleGuardar = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccessMessage(null);
            setValidationErrors([]);

            // Validar antes de guardar
            const errores = validarConfiguracion();
            if (errores.length > 0) {
                setValidationErrors(errores);
                setError('Por favor completa todos los campos obligatorios');

                // Scroll automático hacia arriba para que vea los errores
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const result = await chatbotService.guardarConfiguracion(config);

            setSuccessMessage(result.message || 'Configuración guardada exitosamente');
            setIsNewConfig(false);

            // Scroll automático hacia arriba para que vea el mensaje de éxito
            window.scrollTo({ top: 0, behavior: 'smooth' });

            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (err) {
            setError(err.message || 'Error al guardar la configuración');
            console.error('Error al guardar:', err);

            // Scroll automático hacia arriba para que vea el error
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (section, field, value) => {
        if (typeof config[section] === 'object' && field) {
            setConfig(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            setConfig(prev => ({
                ...prev,
                [section]: value
            }));
        }
    };

    const generarVistaPrevia = () => {
        return chatbotService.generarPromptCompleto(config);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600 text-sm">Cargando configuración del chatbot...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Bot className="h-8 w-8 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-800">Configuración del Chatbot</h1>
                    </div>
                    <p className="text-gray-600">
                        Personaliza la información que el asistente virtual utilizará para responder a tus pacientes.
                    </p>
                </div>

                {/* Banner informativo según estado */}
                {isNewConfig && (
                    <div className="mb-6 bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <Bot className="h-6 w-6 text-blue-600 mt-0.5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                                    Configura tu chatbot por primera vez
                                </h3>
                                <p className="text-sm text-blue-800">
                                    Completa la información de tu consultorio. Los campos marcados como <span className="font-semibold">obligatorios</span> son necesarios para que el chatbot pueda responder correctamente.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mensajes de validación */}
                {validationErrors.length > 0 && (
                    <div className="mb-4 bg-amber-50 border-2 border-amber-400 rounded-lg p-4 shadow-lg animate-pulse">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-amber-900 mb-2">⚠️ Campos obligatorios incompletos:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    {validationErrors.map((error, index) => (
                                        <li key={index} className="text-sm text-amber-800 font-medium">{error}</li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                onClick={() => setValidationErrors([])}
                                className="text-amber-600 hover:text-amber-800 font-bold text-xl"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}

                {/* Mensajes de error/éxito */}
                {error && (
                    <div className="mb-4 bg-red-50 border-2 border-red-400 rounded-lg p-4 shadow-lg animate-pulse flex items-start gap-3">
                        <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-red-900 font-semibold">❌ {error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-600 hover:text-red-800 font-bold text-xl"
                        >
                            ×
                        </button>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 bg-green-50 border-2 border-green-400 rounded-lg p-4 shadow-lg animate-pulse flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-green-900 font-semibold">✅ {successMessage}</p>
                        </div>
                        <button
                            onClick={() => setSuccessMessage(null)}
                            className="text-green-600 hover:text-green-800 font-bold text-xl"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Botones de acción superiores */}
                <div className="mb-6 flex gap-3">
                    <button
                        onClick={handleGuardar}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Guardar Configuración
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <Eye className="h-4 w-4" />
                        Ver Vista Previa
                    </button>
                </div>

                {/* Sección 1: Sobre el Negocio */}
                <SeccionNegocio
                    data={config.negocio}
                    onChange={(field, value) => handleInputChange('negocio', field, value)}
                />

                {/* Sección 2: Servicios y Precios */}
                <SeccionServicios
                    data={config.servicios}
                    onChange={(field, value) => handleInputChange('servicios', field, value)}
                />

                {/* Sección 3: Políticas y Atención */}
                <SeccionPoliticas
                    data={config.politicas}
                    onChange={(field, value) => handleInputChange('politicas', field, value)}
                />

                {/* Sección 4: Preguntas Frecuentes */}
                <SeccionPreguntasFrecuentes
                    data={config.preguntasFrecuentes}
                    onChange={(field, value) => handleInputChange('preguntasFrecuentes', field, value)}
                />

                {/* Botones de acción inferiores - Flotantes y siempre visibles */}
                <div className="mt-6 flex gap-3 sticky bottom-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl shadow-2xl border-2 border-blue-300 backdrop-blur-sm">
                    <button
                        onClick={handleGuardar}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                Guardar Configuración
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium border-2 border-gray-300 shadow-md hover:shadow-lg"
                    >
                        <Eye className="h-5 w-5" />
                        Vista Previa
                    </button>
                </div>

            {/* Modal de Vista Previa */}
            {showPreview && (
                <ModalVistaPrevia
                    prompt={generarVistaPrevia()}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </div>
    );
};

// Componente: Sección Negocio
const SeccionNegocio = ({ data, onChange }) => {
    return (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-800">Información del Negocio</h2>
                    <span className="ml-auto px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                        Obligatorio
                    </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    Datos generales de tu consultorio que el chatbot compartirá con los pacientes.
                </p>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Centro Médico <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.nombre}
                        onChange={(e) => onChange('nombre', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Ej: Centro Médico Salud y Vida"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Horario de Atención <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.horario}
                        onChange={(e) => onChange('horario', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Ej: Lunes a viernes de 8:00 a 20:00, sábados de 9:00 a 14:00"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Teléfono <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.telefono}
                            onChange={(e) => onChange('telefono', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Ej: (123) 456-7890"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => onChange('email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Ej: citas@saludyvida.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección
                    </label>
                    <input
                        type="text"
                        value={data.direccion}
                        onChange={(e) => onChange('direccion', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Ej: Av. Principal 123, Colonia Centro"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sitio Web
                    </label>
                    <input
                        type="text"
                        value={data.sitioWeb}
                        onChange={(e) => onChange('sitioWeb', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Ej: www.saludyvida.com"
                    />
                </div>
            </div>
        </div>
    );
};

// Componente: Sección Servicios
const SeccionServicios = ({ data, onChange }) => {
    const agregarEspecialidad = () => {
        const nuevasEspecialidades = [...data.especialidades, { nombre: '', precio: '' }];
        onChange('especialidades', nuevasEspecialidades);
    };

    const eliminarEspecialidad = (index) => {
        const nuevasEspecialidades = data.especialidades.filter((_, i) => i !== index);
        onChange('especialidades', nuevasEspecialidades);
    };

    const actualizarEspecialidad = (index, campo, valor) => {
        const nuevasEspecialidades = [...data.especialidades];
        nuevasEspecialidades[index][campo] = valor;
        onChange('especialidades', nuevasEspecialidades);
    };

    const agregarPrecioAdicional = () => {
        const nuevosPrecios = [...data.preciosAdicionales, { concepto: '', modificador: '' }];
        onChange('preciosAdicionales', nuevosPrecios);
    };

    const eliminarPrecioAdicional = (index) => {
        const nuevosPrecios = data.preciosAdicionales.filter((_, i) => i !== index);
        onChange('preciosAdicionales', nuevosPrecios);
    };

    const actualizarPrecioAdicional = (index, campo, valor) => {
        const nuevosPrecios = [...data.preciosAdicionales];
        nuevosPrecios[index][campo] = valor;
        onChange('preciosAdicionales', nuevosPrecios);
    };

    return (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-gray-800">Servicios y Precios</h2>
                    <span className="ml-auto px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                        Al menos 1 especialidad
                    </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    Lista de especialidades, precios y servicios adicionales que ofreces.
                </p>
            </div>
            <div className="p-6 space-y-6">
                {/* Especialidades */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Especialidades Disponibles y Precios
                        </label>
                        <button
                            type="button"
                            onClick={agregarEspecialidad}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Agregar
                        </button>
                    </div>

                    {data.especialidades.length === 0 ? (
                        <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-500 text-sm mb-1">No hay especialidades agregadas</p>
                            <p className="text-gray-400 text-xs">Comienza agregando una especialidad con su precio</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {data.especialidades.map((esp, index) => (
                                <div key={index} className="flex gap-3 items-start p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Especialidad</label>
                                            <input
                                                type="text"
                                                value={esp.nombre}
                                                onChange={(e) => actualizarEspecialidad(index, 'nombre', e.target.value)}
                                                placeholder="Ej: Medicina General"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Precio</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                                    S/
                                                </span>
                                                <input
                                                    type="number"
                                                    value={esp.precio}
                                                    onChange={(e) => actualizarEspecialidad(index, 'precio', e.target.value)}
                                                    placeholder="120"
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => eliminarEspecialidad(index)}
                                        className="mt-5 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Eliminar especialidad"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Precios Adicionales */}
                <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Precios Adicionales y Descuentos
                        </label>
                        <button
                            type="button"
                            onClick={agregarPrecioAdicional}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Agregar
                        </button>
                    </div>

                    {data.preciosAdicionales.length === 0 ? (
                        <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-500 text-sm mb-1">No hay precios adicionales agregados</p>
                            <p className="text-gray-400 text-xs">Agrega recargos, descuentos o modificadores de precio</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {data.preciosAdicionales.map((precio, index) => (
                                <div key={index} className="flex gap-3 items-start p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Concepto</label>
                                            <input
                                                type="text"
                                                value={precio.concepto}
                                                onChange={(e) => actualizarPrecioAdicional(index, 'concepto', e.target.value)}
                                                placeholder="Ej: Primera consulta (paciente nuevo)"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Modificador</label>
                                            <input
                                                type="text"
                                                value={precio.modificador}
                                                onChange={(e) => actualizarPrecioAdicional(index, 'modificador', e.target.value)}
                                                placeholder="Ej: +S/20 sobre el precio base"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => eliminarPrecioAdicional(index)}
                                        className="mt-5 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Eliminar precio adicional"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Componente: Sección Políticas
const SeccionPoliticas = ({ data, onChange }) => {
    const agregarProtocolo = () => {
        const nuevosProtocolos = [...data.protocolos, ''];
        onChange('protocolos', nuevosProtocolos);
    };

    const eliminarProtocolo = (index) => {
        const nuevosProtocolos = data.protocolos.filter((_, i) => i !== index);
        onChange('protocolos', nuevosProtocolos);
    };

    const actualizarProtocolo = (index, valor) => {
        const nuevosProtocolos = [...data.protocolos];
        nuevosProtocolos[index] = valor;
        onChange('protocolos', nuevosProtocolos);
    };

    return (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-800">Políticas y Atención</h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    Protocolos, políticas y requisitos que los pacientes deben conocer.
                </p>
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Protocolos y Políticas
                    </label>
                    <button
                        type="button"
                        onClick={agregarProtocolo}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Agregar
                    </button>
                </div>

                {data.protocolos.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-sm mb-1">No hay protocolos agregados</p>
                        <p className="text-gray-400 text-xs">Define las políticas y reglas de atención</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {data.protocolos.map((protocolo, index) => (
                            <div key={index} className="flex gap-3 items-start p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Protocolo #{index + 1}</label>
                                    <input
                                        type="text"
                                        value={protocolo}
                                        onChange={(e) => actualizarProtocolo(index, e.target.value)}
                                        placeholder="Ej: Las citas deben agendarse con al menos 24 horas de anticipación"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => eliminarProtocolo(index)}
                                    className="mt-5 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Eliminar protocolo"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Componente: Sección Preguntas Frecuentes
const SeccionPreguntasFrecuentes = ({ data, onChange }) => {
    const agregarPregunta = () => {
        const nuevasPreguntas = [...data, { pregunta: '', respuesta: '' }];
        onChange(null, nuevasPreguntas);
    };

    const eliminarPregunta = (index) => {
        const nuevasPreguntas = data.filter((_, i) => i !== index);
        onChange(null, nuevasPreguntas);
    };

    const actualizarPregunta = (index, campo, valor) => {
        const nuevasPreguntas = [...data];
        nuevasPreguntas[index][campo] = valor;
        onChange(null, nuevasPreguntas);
    };

    return (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-600" />
                    <h2 className="text-lg font-semibold text-gray-800">Preguntas Frecuentes</h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    Respuestas a preguntas comunes que hacen tus pacientes (opcional).
                </p>
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Preguntas y Respuestas
                    </label>
                    <button
                        type="button"
                        onClick={agregarPregunta}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Agregar
                    </button>
                </div>

                {data.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-sm mb-1">No hay preguntas frecuentes agregadas</p>
                        <p className="text-gray-400 text-xs">Agrega preguntas comunes y sus respuestas</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data.map((item, index) => (
                            <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-xs font-semibold text-gray-500">FAQ #{index + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => eliminarPregunta(index)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Eliminar pregunta"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Pregunta</label>
                                        <input
                                            type="text"
                                            value={item.pregunta}
                                            onChange={(e) => actualizarPregunta(index, 'pregunta', e.target.value)}
                                            placeholder="Ej: ¿Aceptan seguros médicos?"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Respuesta</label>
                                        <textarea
                                            value={item.respuesta}
                                            onChange={(e) => actualizarPregunta(index, 'respuesta', e.target.value)}
                                            placeholder="Ej: Sí, trabajamos con los principales seguros del país incluyendo..."
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Componente: Modal Vista Previa
const ModalVistaPrevia = ({ prompt, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header del Modal */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Eye className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-800">Vista Previa del Prompt</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Contenido del Modal */}
                <div className="flex-1 overflow-y-auto p-6">
                    <pre className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-sm whitespace-pre-wrap font-mono text-gray-800">
                        {prompt}
                    </pre>
                </div>

                {/* Footer del Modal */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatbotConfig;
