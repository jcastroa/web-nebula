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
    X
} from 'lucide-react';
import { chatbotService } from '../services/chatbotService';

const ChatbotConfig = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

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
            especialidades: '',
            preciosAdicionales: ''
        },
        politicas: {
            protocolos: ''
        },
        preguntasFrecuentes: ''
    });

    useEffect(() => {
        cargarConfiguracion();
    }, []);

    const cargarConfiguracion = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await chatbotService.obtenerConfiguracion();
            setConfig(data);
        } catch (err) {
            setError('Error al cargar la configuración del chatbot');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGuardar = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccessMessage(null);

            await chatbotService.guardarConfiguracion(config);

            setSuccessMessage('Configuración guardada exitosamente');
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (err) {
            setError('Error al guardar la configuración');
            console.error(err);
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
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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

                {/* Mensajes de error/éxito */}
                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-red-800">{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-600 hover:text-red-800"
                        >
                            ×
                        </button>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-green-800">{successMessage}</p>
                        </div>
                        <button
                            onClick={() => setSuccessMessage(null)}
                            className="text-green-600 hover:text-green-800"
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
                    onChange={(value) => handleInputChange('preguntasFrecuentes', null, value)}
                />

                {/* Botones de acción inferiores */}
                <div className="mt-6 flex gap-3 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                    <button
                        onClick={handleGuardar}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
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
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    Datos generales de tu consultorio que el chatbot compartirá con los pacientes.
                </p>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Centro Médico
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
                        Horario de Atención
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
                            Teléfono
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
    return (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-gray-800">Servicios y Precios</h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    Lista de especialidades, precios y servicios adicionales que ofreces.
                </p>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Especialidades Disponibles y Precios
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                        Lista las especialidades con sus precios en el formato: - Especialidad: S/Precio
                    </p>
                    <textarea
                        value={data.especialidades}
                        onChange={(e) => onChange('especialidades', e.target.value)}
                        rows={10}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm"
                        placeholder="Ejemplo:&#10;- Medicina General: S/120&#10;- Pediatría: S/150&#10;- Ginecología: S/180&#10;- Cardiología: S/200&#10;- Dermatología: S/170&#10;- Nutrición: S/130&#10;- Psicología: S/160&#10;- Ortopedia: S/190"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precios Adicionales y Descuentos
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                        Información sobre costos adicionales, recargos y descuentos disponibles.
                    </p>
                    <textarea
                        value={data.preciosAdicionales}
                        onChange={(e) => onChange('preciosAdicionales', e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm"
                        placeholder="Ejemplo:&#10;- Primera consulta (paciente nuevo): +S/20 sobre el precio base&#10;- Consulta de urgencia (mismo día): +S/50 sobre el precio base&#10;- Consulta a domicilio: +S/100 sobre el precio base&#10;- Consulta virtual: -S/20 sobre el precio base&#10;- Descuento para adultos mayores y niños: 10% del precio base"
                    />
                </div>
            </div>
        </div>
    );
};

// Componente: Sección Políticas
const SeccionPoliticas = ({ data, onChange }) => {
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
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Protocolos y Políticas
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                        Reglas sobre citas, cancelaciones, requisitos, pagos, etc.
                    </p>
                    <textarea
                        value={data.protocolos}
                        onChange={(e) => onChange('protocolos', e.target.value)}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm"
                        placeholder="Ejemplo:&#10;- Las citas deben agendarse con al menos 24 horas de anticipación&#10;- Cancelaciones deben realizarse con mínimo 12 horas de antelación&#10;- Se requiere llegar 15 minutos antes de la hora programada&#10;- Traer identificación oficial y tarjeta del seguro médico (si aplica)&#10;- Para primera consulta, traer historial médico relevante&#10;- Pago de consulta al momento de la atención"
                    />
                </div>
            </div>
        </div>
    );
};

// Componente: Sección Preguntas Frecuentes
const SeccionPreguntasFrecuentes = ({ data, onChange }) => {
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
                <textarea
                    value={data}
                    onChange={(e) => onChange(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm"
                    placeholder="Ejemplo:&#10;¿Aceptan seguros médicos?&#10;Sí, trabajamos con los principales seguros del país...&#10;&#10;¿Hacen consultas a domicilio?&#10;Sí, contamos con servicio a domicilio..."
                />
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
