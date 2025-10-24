// src/pages/BusinessConfig.jsx
import React, { useState, useEffect } from 'react';
import {
    Building2,
    Plus,
    Search,
    Edit2,
    Trash2,
    CreditCard,
    Bell,
    AlertCircle,
    CheckCircle,
    XCircle,
    Loader2,
    Star,
    Phone,
    Mail,
    User,
    Power,
    PowerOff
} from 'lucide-react';
import { useBusinessConfig } from '../hooks/useBusinessConfig';
import BusinessModal from '../components/business/BusinessModal';
import Toast from '../components/common/Toast';

const BusinessConfig = () => {
    const {
        negocios,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        crearNegocio,
        actualizarNegocio,
        cambiarEstadoNegocio
    } = useBusinessConfig();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNegocio, setSelectedNegocio] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [toast, setToast] = useState(null);

    // Mostrar toast cuando hay error del hook
    useEffect(() => {
        if (error) {
            setToast({ message: error, type: 'error' });
        }
    }, [error]);

    // Abrir modal para crear
    const handleCreate = () => {
        setSelectedNegocio(null);
        setIsModalOpen(true);
    };

    // Abrir modal para editar
    const handleEdit = (negocio) => {
        setSelectedNegocio(negocio);
        setIsModalOpen(true);
    };

    // Guardar (crear o actualizar)
    const handleSave = async (formData) => {
        let result;
        if (selectedNegocio) {
            result = await actualizarNegocio(selectedNegocio.id, formData);
            if (result.success) {
                setToast({ message: 'Negocio actualizado exitosamente', type: 'success' });
            } else {
                setToast({ message: result.error || 'Error al actualizar negocio', type: 'error' });
            }
        } else {
            result = await crearNegocio(formData);
            if (result.success) {
                setToast({ message: 'Negocio creado exitosamente', type: 'success' });
            } else {
                setToast({ message: result.error || 'Error al crear negocio', type: 'error' });
            }
        }
        return result;
    };

    // Cambiar estado del negocio
    const handleToggleStatus = (negocio) => {
        setConfirmAction({
            negocio,
            newStatus: !negocio.activo,
            action: negocio.activo ? 'desactivar' : 'activar'
        });
    };

    const confirmToggleStatus = async () => {
        if (!confirmAction) return;

        setIsProcessing(true);
        try {
            const result = await cambiarEstadoNegocio(confirmAction.negocio.id, confirmAction.newStatus);
            if (result.success) {
                const action = confirmAction.action === 'desactivar' ? 'desactivado' : 'activado';
                setToast({
                    message: `Negocio ${action} exitosamente`,
                    type: 'success'
                });
                setConfirmAction(null);
            } else {
                setToast({
                    message: result.error || 'Error al cambiar estado del negocio',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                message: 'Error inesperado al cambiar estado del negocio',
                type: 'error'
            });
        } finally {
            setIsProcessing(false);
        }
    };

    // Renderizar badge de estado
    const renderBadge = (value, icon, label, colorTrue, colorFalse) => {
        const Icon = icon;
        const colors = value ? colorTrue : colorFalse;

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colors}`}>
                <Icon className="h-3.5 w-3.5" />
                {label}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-blue-600 rounded-xl">
                            <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Gestión de Negocios
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Administra los negocios y sus configuraciones
                            </p>
                        </div>
                    </div>
                </div>

                {/* Barra de acciones */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        {/* Búsqueda */}
                        <div className="relative flex-1 w-full sm:max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar negocios..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Botón crear */}
                        <button
                            onClick={handleCreate}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="h-5 w-5" />
                            Crear Negocio
                        </button>
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {/* Loading */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                            <p className="text-gray-500">Cargando negocios...</p>
                        </div>
                    )}

                    {/* Error */}
                    {error && !loading && (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="p-4 bg-red-50 rounded-full mb-4">
                                <AlertCircle className="h-12 w-12 text-red-500" />
                            </div>
                            <p className="text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Lista vacía */}
                    {!loading && !error && negocios.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="p-4 bg-gray-100 rounded-full mb-4">
                                <Building2 className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No hay negocios registrados
                            </h3>
                            <p className="text-gray-500 text-center mb-6">
                                {searchTerm
                                    ? 'No se encontraron negocios con ese criterio de búsqueda'
                                    : 'Comienza creando tu primer negocio'
                                }
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={handleCreate}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <Plus className="h-5 w-5" />
                                    Crear Primer Negocio
                                </button>
                            )}
                        </div>
                    )}

                    {/* Tabla de negocios */}
                    {!loading && !error && negocios.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Negocio
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contacto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Responsable
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Configuración
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {negocios.map((negocio) => (
                                        <tr key={negocio.id} className="hover:bg-gray-50 transition-colors">
                                            {/* Negocio */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-50 rounded-lg">
                                                        <Building2 className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {negocio.nombre}
                                                            </p>
                                                            {negocio.es_principal && (
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                                                                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                                                    Principal
                                                                </span>
                                                            )}
                                                        </div>
                                                        {negocio.ruc && (
                                                            <p className="text-xs text-gray-500">
                                                                RUC: {negocio.ruc}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contacto */}
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    {negocio.telefono_contacto && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                                                            {negocio.telefono_contacto}
                                                        </div>
                                                    )}
                                                    {negocio.email && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                                            <Mail className="h-3.5 w-3.5 text-gray-400" />
                                                            {negocio.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Responsable */}
                                            <td className="px-6 py-4">
                                                {negocio.nombre_responsable && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                                        <User className="h-3.5 w-3.5 text-gray-400" />
                                                        {negocio.nombre_responsable}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Estado */}
                                            <td className="px-6 py-4">
                                                {renderBadge(
                                                    negocio.activo,
                                                    negocio.activo ? CheckCircle : XCircle,
                                                    negocio.activo ? 'Activo' : 'Inactivo',
                                                    'bg-green-50 text-green-700',
                                                    'bg-red-50 text-red-700'
                                                )}
                                            </td>

                                            {/* Configuración */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {renderBadge(
                                                        negocio.permite_pago,
                                                        negocio.permite_pago ? CheckCircle : XCircle,
                                                        negocio.permite_pago ? 'Pagos' : 'Sin pagos',
                                                        'bg-green-50 text-green-700',
                                                        'bg-gray-100 text-gray-600'
                                                    )}
                                                    {renderBadge(
                                                        negocio.envia_recordatorios,
                                                        negocio.envia_recordatorios ? Bell : XCircle,
                                                        negocio.envia_recordatorios ? 'Recordatorios' : 'Sin recordatorios',
                                                        'bg-blue-50 text-blue-700',
                                                        'bg-gray-100 text-gray-600'
                                                    )}
                                                </div>
                                            </td>

                                            {/* Acciones */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(negocio)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(negocio)}
                                                        className={`p-2 rounded-lg transition-colors ${
                                                            negocio.activo
                                                                ? 'text-red-600 hover:bg-red-50'
                                                                : 'text-green-600 hover:bg-green-50'
                                                        }`}
                                                        title={negocio.activo ? 'Desactivar' : 'Activar'}
                                                    >
                                                        {negocio.activo ? (
                                                            <PowerOff className="h-4 w-4" />
                                                        ) : (
                                                            <Power className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Resumen */}
                {!loading && !error && negocios.length > 0 && (
                    <div className="mt-4 text-sm text-gray-500 text-center">
                        Mostrando {negocios.length} {negocios.length === 1 ? 'negocio' : 'negocios'}
                    </div>
                )}
            </div>

            {/* Modal de crear/editar */}
            <BusinessModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                negocio={selectedNegocio}
            />

            {/* Modal de confirmación de cambio de estado */}
            {confirmAction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-full ${
                                confirmAction.action === 'desactivar'
                                    ? 'bg-red-50'
                                    : 'bg-green-50'
                            }`}>
                                {confirmAction.action === 'desactivar' ? (
                                    <PowerOff className="h-6 w-6 text-red-600" />
                                ) : (
                                    <Power className="h-6 w-6 text-green-600" />
                                )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Confirmar {confirmAction.action === 'desactivar' ? 'Desactivación' : 'Activación'}
                            </h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            ¿Estás seguro de que deseas {confirmAction.action} el negocio{' '}
                            <strong>{confirmAction.negocio.nombre}</strong>?
                            {confirmAction.action === 'desactivar' && (
                                <span className="block mt-2 text-sm text-gray-500">
                                    El negocio no estará disponible mientras esté desactivado.
                                </span>
                            )}
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setConfirmAction(null)}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                disabled={isProcessing}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmToggleStatus}
                                disabled={isProcessing}
                                className={`px-4 py-2 text-white rounded-lg transition-colors disabled:cursor-not-allowed flex items-center gap-2 ${
                                    confirmAction.action === 'desactivar'
                                        ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
                                        : 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
                                }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        {confirmAction.action === 'desactivar' ? 'Desactivando...' : 'Activando...'}
                                    </>
                                ) : (
                                    <>
                                        {confirmAction.action === 'desactivar' ? (
                                            <>
                                                <PowerOff className="h-4 w-4" />
                                                Desactivar
                                            </>
                                        ) : (
                                            <>
                                                <Power className="h-4 w-4" />
                                                Activar
                                            </>
                                        )}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast para mensajes */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default BusinessConfig;
