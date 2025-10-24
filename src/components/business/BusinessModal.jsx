// src/components/business/BusinessModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Save, Building2, CreditCard, Bell, Loader2, Phone, Mail, User, FileText, Star } from 'lucide-react';

const BusinessModal = ({
    isOpen,
    onClose,
    onSave,
    negocio = null,
    loading = false
}) => {
    const [formData, setFormData] = useState({
        nombre: '',
        ruc: '',
        telefono_contacto: '',
        email: '',
        nombre_responsable: '',
        es_principal: false,
        permite_pago: false,
        envia_recordatorios: false,
        tipo_recordatorio: 'sin_confirmacion'
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Precargar datos si es edición
    useEffect(() => {
        if (isOpen && negocio) {
            setFormData({
                nombre: negocio.nombre || '',
                ruc: negocio.ruc || '',
                telefono_contacto: negocio.telefono_contacto || '',
                email: negocio.email || '',
                nombre_responsable: negocio.nombre_responsable || '',
                es_principal: negocio.es_principal || false,
                permite_pago: negocio.permite_pago || false,
                envia_recordatorios: negocio.envia_recordatorios || false,
                tipo_recordatorio: negocio.tipo_recordatorio || 'sin_confirmacion'
            });
        } else if (isOpen && !negocio) {
            // Reset para nuevo negocio
            setFormData({
                nombre: '',
                ruc: '',
                telefono_contacto: '',
                email: '',
                nombre_responsable: '',
                es_principal: false,
                permite_pago: false,
                envia_recordatorios: false,
                tipo_recordatorio: 'sin_confirmacion'
            });
        }
        setErrors({});
    }, [isOpen, negocio]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validar nombre
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        }

        // Validar teléfono
        if (!formData.telefono_contacto.trim()) {
            newErrors.telefono_contacto = 'El teléfono de contacto es obligatorio';
        } else if (!/^\d{9,15}$/.test(formData.telefono_contacto.replace(/[\s\-\(\)]/g, ''))) {
            newErrors.telefono_contacto = 'Ingrese un teléfono válido (9-15 dígitos)';
        }

        // Validar email
        if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Ingrese un email válido';
        }

        // Validar nombre del responsable
        if (!formData.nombre_responsable.trim()) {
            newErrors.nombre_responsable = 'El nombre del responsable es obligatorio';
        }

        // Validar RUC si se proporciona (opcional pero si se llena debe ser válido)
        if (formData.ruc.trim() && !/^\d{11}$/.test(formData.ruc)) {
            newErrors.ruc = 'El RUC debe tener 11 dígitos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await onSave(formData);

            if (result.success) {
                onClose();
            } else {
                setErrors({ submit: result.error });
            }
        } catch (error) {
            setErrors({ submit: 'Error al guardar el negocio' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {negocio ? 'Editar Negocio' : 'Crear Nuevo Negocio'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isSubmitting}
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Sección: Información Básica */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Información Básica
                        </h3>
                        <div className="space-y-4">
                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre del Negocio
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.nombre ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Ej: Clínica Dental Centro"
                                    disabled={isSubmitting}
                                />
                                {errors.nombre && (
                                    <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                                )}
                            </div>

                            {/* RUC */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    RUC
                                    <span className="text-gray-400 ml-1 text-xs">(Opcional)</span>
                                </label>
                                <input
                                    type="text"
                                    name="ruc"
                                    value={formData.ruc}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.ruc ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Ej: 20123456789"
                                    maxLength="11"
                                    disabled={isSubmitting}
                                />
                                {errors.ruc && (
                                    <p className="mt-1 text-sm text-red-600">{errors.ruc}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sección: Información de Contacto */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Información de Contacto
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Teléfono */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Teléfono de Contacto
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="telefono_contacto"
                                    value={formData.telefono_contacto}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.telefono_contacto ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Ej: 987654321"
                                    disabled={isSubmitting}
                                />
                                {errors.telefono_contacto && (
                                    <p className="mt-1 text-sm text-red-600">{errors.telefono_contacto}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Ej: contacto@negocio.com"
                                    disabled={isSubmitting}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sección: Responsable */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Responsable
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre del Responsable
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                name="nombre_responsable"
                                value={formData.nombre_responsable}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.nombre_responsable ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder="Ej: Juan Pérez García"
                                disabled={isSubmitting}
                            />
                            {errors.nombre_responsable && (
                                <p className="mt-1 text-sm text-red-600">{errors.nombre_responsable}</p>
                            )}
                        </div>
                    </div>

                    {/* Negocio Principal */}
                    <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                name="es_principal"
                                id="es_principal"
                                checked={formData.es_principal}
                                onChange={handleChange}
                                className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                                disabled={isSubmitting}
                            />
                            <div className="flex-1">
                                <label htmlFor="es_principal" className="flex items-center gap-2 text-sm font-medium text-gray-900 cursor-pointer">
                                    <Star className="h-4 w-4 text-amber-500" />
                                    Negocio Principal
                                </label>
                                <p className="text-sm text-gray-600 mt-1">
                                    Marca este negocio como el principal de tu organización
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sección: Configuraciones */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Configuraciones
                        </h3>
                        <div className="space-y-4">
                            {/* Permite Pago */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        name="permite_pago"
                                        id="permite_pago"
                                        checked={formData.permite_pago}
                                        onChange={handleChange}
                                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        disabled={isSubmitting}
                                    />
                                    <div className="flex-1">
                                        <label htmlFor="permite_pago" className="flex items-center gap-2 text-sm font-medium text-gray-900 cursor-pointer">
                                            <CreditCard className="h-4 w-4 text-gray-500" />
                                            Permite Pago
                                        </label>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Habilita la opción de registrar pagos para las citas de este negocio
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Recordatorios */}
                            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        name="envia_recordatorios"
                                        id="envia_recordatorios"
                                        checked={formData.envia_recordatorios}
                                        onChange={handleChange}
                                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        disabled={isSubmitting}
                                    />
                                    <div className="flex-1">
                                        <label htmlFor="envia_recordatorios" className="flex items-center gap-2 text-sm font-medium text-gray-900 cursor-pointer">
                                            <Bell className="h-4 w-4 text-gray-500" />
                                            Enviar Recordatorios
                                        </label>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Envía recordatorios automáticos a los clientes sobre sus citas
                                        </p>
                                    </div>
                                </div>

                                {/* Tipo de recordatorio (solo si está habilitado) */}
                                {formData.envia_recordatorios && (
                                    <div className="ml-7 mt-3 space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tipo de Recordatorio
                                        </label>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="tipo_recordatorio"
                                                    value="sin_confirmacion"
                                                    checked={formData.tipo_recordatorio === 'sin_confirmacion'}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                    disabled={isSubmitting}
                                                />
                                                <span className="text-sm text-gray-700">
                                                    Sin confirmación
                                                    <span className="text-gray-500 ml-2">
                                                        (Solo recordatorio informativo)
                                                    </span>
                                                </span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="tipo_recordatorio"
                                                    value="con_confirmacion"
                                                    checked={formData.tipo_recordatorio === 'con_confirmacion'}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                    disabled={isSubmitting}
                                                />
                                                <span className="text-sm text-gray-700">
                                                    Con confirmación
                                                    <span className="text-gray-500 ml-2">
                                                        (Solicita confirmación del cliente)
                                                    </span>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Error general */}
                    {errors.submit && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{errors.submit}</p>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                {negocio ? 'Actualizar' : 'Crear Negocio'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BusinessModal;
