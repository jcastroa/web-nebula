import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  CreditCard, 
  Save, 
  CheckCircle, 
  Calendar, 
  Clock, 
  Phone, 
  FileText,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  Trash2
} from 'lucide-react';

const CitaDetailsModal = ({ 
  isOpen, 
  onClose, 
  citaData, 
  onUpdateCita,
  loading = false 
}) => {
  // Estados para datos del paciente
  const [pacienteData, setPacienteData] = useState({
    tipo_documento: 'DNI',
    numero_documento: '',
    apellido_paterno: '',
    apellido_materno: '',
    nombres: '',
    celular_contacto: ''
  });

  // Estados para pago
  const [pagoData, setPagoData] = useState({
    monto: 0,
    medio_pago: 'efectivo',
    validado: false,
    devolucion_monto: 0,
    devolucion_razon: '',
    tiene_comprobante: false
  });

  // Estados del modal
  const [activeTab, setActiveTab] = useState('paciente');
  const [showDevolucion, setShowDevolucion] = useState(false);
  const [tipoDevolucion, setTipoDevolucion] = useState(''); // 'parcial' | 'total'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Efecto para precargar datos cuando se abre el modal
  useEffect(() => {
    if (isOpen && citaData) {
      precargarDatos();
    }
  }, [isOpen, citaData]);

  const precargarDatos = () => {
    // Precargar datos del paciente desde nombre existente
    if (citaData.nombre) {
      const nombreCompleto = citaData.nombre.trim();
      const partesNombre = nombreCompleto.split(' ');
      
      // Intentar dividir el nombre (asumiendo formato: nombres apellido_paterno apellido_materno)
      if (partesNombre.length >= 2) {
        const apellido_paterno = partesNombre[partesNombre.length - 2] || '';
        const apellido_materno = partesNombre[partesNombre.length - 1] || '';
        const nombres = partesNombre.slice(0, partesNombre.length - 2).join(' ') || partesNombre[0] || '';
        
        setPacienteData(prev => ({
          ...prev,
          nombres: nombres,
          apellido_paterno: apellido_paterno,
          apellido_materno: apellido_materno,
          celular_contacto: citaData.telefono || ''
        }));
      } else {
        // Si no se puede dividir, poner todo en nombres
        setPacienteData(prev => ({
          ...prev,
          nombres: nombreCompleto,
          celular_contacto: citaData.telefono || ''
        }));
      }
    }

    // Precargar datos de pago si existen
    if (citaData.pago && citaData.pago.realizado) {
      setPagoData(prev => ({
        ...prev,
        monto: citaData.pago.monto || 0,
        medio_pago: citaData.pago.medio || 'efectivo',
        validado: citaData.pago.validado || false,
        tiene_comprobante: !!citaData.pago.comprobante_url
      }));
    }
  };

  const handlePacienteChange = (field, value) => {
    setPacienteData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar errores del campo modificado
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePagoChange = (field, value) => {
    setPagoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validarDatosPaciente = () => {
    const newErrors = {};
    
    if (!pacienteData.numero_documento.trim()) {
      newErrors.numero_documento = 'Número de documento es obligatorio';
    }
    
    if (!pacienteData.nombres.trim()) {
      newErrors.nombres = 'Nombres son obligatorios';
    }
    
    if (!pacienteData.apellido_paterno.trim()) {
      newErrors.apellido_paterno = 'Apellido paterno es obligatorio';
    }
    
    if (!pacienteData.apellido_materno.trim()) {
      newErrors.apellido_materno = 'Apellido materno es obligatorio';
    }
    
    if (!pacienteData.celular_contacto.trim()) {
      newErrors.celular_contacto = 'Celular de contacto es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGuardarPaciente = async () => {
    if (!validarDatosPaciente()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Aquí harías la llamada al endpoint para actualizar datos del paciente
      await onUpdateCita?.({
        id: citaData.id,
        accion: 'actualizar_paciente',
        datos_paciente: pacienteData
      });

      console.log('Datos del paciente guardados y cita confirmada');
      // Opcional: Mostrar notificación de éxito
      
    } catch (error) {
      console.error('Error guardando datos del paciente:', error);
      // Opcional: Mostrar notificación de error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTerminarCita = async () => {
    if (!validarDatosPaciente()) {
      setActiveTab('paciente');
      return;
    }

    setIsSubmitting(true);
    try {
      // Preparar datos completos para enviar
      const datosCompletos = {
        id: citaData.id,
        accion: 'terminar_cita',
        datos_paciente: pacienteData,
        datos_pago: tienePago ? {
          // Si ya existe pago, enviar datos de actualización
          validado: pagoData.validado
        } : {
          // Si no existe pago, enviar datos para crear nuevo pago
          monto: pagoData.monto,
          medio_pago: pagoData.medio_pago
        },
        devolucion: showDevolucion ? {
          tipo: tipoDevolucion,
          monto: pagoData.devolucion_monto,
          razon: pagoData.devolucion_razon
        } : null
      };

      await onUpdateCita?.(datosCompletos);
      
      console.log('Cita terminada y confirmada exitosamente');
      onClose();
      
    } catch (error) {
      console.error('Error terminando la cita:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDevolucion = (tipo) => {
    setTipoDevolucion(tipo);
    setShowDevolucion(true);
    
    if (tipo === 'total') {
      setPagoData(prev => ({
        ...prev,
        devolucion_monto: prev.monto
      }));
    } else {
      setPagoData(prev => ({
        ...prev,
        devolucion_monto: 0
      }));
    }
  };

  const handleCancelarCita = async () => {
    setIsSubmitting(true);
    try {
      await onUpdateCita?.({
        id: citaData.id,
        accion: 'cancelar_cita'
      });

      console.log('Cita cancelada exitosamente');
      setShowCancelConfirm(false);
      onClose();
      
    } catch (error) {
      console.error('Error cancelando la cita:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEstadoBadge = () => {
    const estado = citaData?.estado;
    const colors = {
      'pendiente': 'bg-orange-100 text-orange-800',
      'confirmada': 'bg-blue-100 text-blue-800',
      'completada': 'bg-green-100 text-green-800',
      'cancelada': 'bg-red-100 text-red-800',
      'en_proceso': 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[estado] || 'bg-gray-100 text-gray-800'}`}>
        {estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : 'Sin estado'}
      </span>
    );
  };

  if (!isOpen || !citaData) return null;

  const tienePago = citaData.pago && citaData.pago.realizado;
  const tieneComprobante = tienePago && citaData.pago.comprobante_url;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Detalles de Cita</h2>
                <p className="text-blue-300 text-sm">ID: {citaData.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-blue-300 hover:text-white transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Información de la cita */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-300" />
              <span>{citaData.fecha}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-300" />
              <span>{citaData.hora}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-300" />
              <span>{citaData.telefono}</span>
            </div>
            <div>
              {getEstadoBadge()}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('paciente')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'paciente'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="w-4 h-4" />
              Datos del Paciente
            </button>
            <button
              onClick={() => setActiveTab('pago')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'pago'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Información de Pago
              {tienePago && <div className="w-2 h-2 bg-green-500 rounded-full" />}
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          
          {/* Sección Datos del Paciente */}
          {activeTab === 'paciente' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Información Personal</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Tipo de Documento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Documento *
                  </label>
                  <select
                    value={pacienteData.tipo_documento}
                    onChange={(e) => handlePacienteChange('tipo_documento', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="DNI">DNI</option>
                    <option value="CE">Carné de Extranjería</option>
                    <option value="PASAPORTE">Pasaporte</option>
                  </select>
                </div>

                {/* Número de Documento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    value={pacienteData.numero_documento}
                    onChange={(e) => handlePacienteChange('numero_documento', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.numero_documento ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ingrese número de documento"
                  />
                  {errors.numero_documento && (
                    <p className="mt-1 text-sm text-red-600">{errors.numero_documento}</p>
                  )}
                </div>

                {/* Nombres */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombres *
                  </label>
                  <input
                    type="text"
                    value={pacienteData.nombres}
                    onChange={(e) => handlePacienteChange('nombres', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.nombres ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Nombres del paciente"
                  />
                  {errors.nombres && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombres}</p>
                  )}
                </div>

                {/* Apellido Paterno */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido Paterno *
                  </label>
                  <input
                    type="text"
                    value={pacienteData.apellido_paterno}
                    onChange={(e) => handlePacienteChange('apellido_paterno', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.apellido_paterno ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Apellido paterno"
                  />
                  {errors.apellido_paterno && (
                    <p className="mt-1 text-sm text-red-600">{errors.apellido_paterno}</p>
                  )}
                </div>

                {/* Apellido Materno */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido Materno *
                  </label>
                  <input
                    type="text"
                    value={pacienteData.apellido_materno}
                    onChange={(e) => handlePacienteChange('apellido_materno', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.apellido_materno ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Apellido materno"
                  />
                  {errors.apellido_materno && (
                    <p className="mt-1 text-sm text-red-600">{errors.apellido_materno}</p>
                  )}
                </div>

                {/* Celular de Contacto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Celular de Contacto *
                  </label>
                  <input
                    type="tel"
                    value={pacienteData.celular_contacto}
                    onChange={(e) => handlePacienteChange('celular_contacto', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.celular_contacto ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Número de celular"
                  />
                  {errors.celular_contacto && (
                    <p className="mt-1 text-sm text-red-600">{errors.celular_contacto}</p>
                  )}
                </div>
              </div>

              {/* Botón Guardar y Confirmar */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleGuardarPaciente}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Guardar y Confirmar
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Sección Información de Pago */}
          {activeTab === 'pago' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Información de Pago</h3>
              </div>

              {tienePago ? (
                <div className="space-y-4">
                  {/* Información del Pago Existente */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Pago Registrado</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Monto:</span>
                        <span className="font-medium ml-2">S/. {citaData.pago.monto}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Medio:</span>
                        <span className="font-medium ml-2 capitalize">{citaData.pago.medio}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Fecha:</span>
                        <span className="font-medium ml-2">
                          {new Date(citaData.pago.fecha_pago).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Estado:</span>
                        <span className={`font-medium ml-2 ${citaData.pago.validado ? 'text-green-600' : 'text-orange-600'}`}>
                          {citaData.pago.validado ? 'Validado' : 'Por validar'}
                        </span>
                      </div>
                    </div>

                    {/* Comprobante */}
                    {tieneComprobante && (
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Comprobante de pago:</span>
                          <a
                            href={citaData.pago.comprobante_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <FileText className="w-4 h-4" />
                            Ver comprobante
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Checkbox para validar pago (solo si hay comprobante) */}
                  {tieneComprobante && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="pago_validado"
                        checked={pagoData.validado}
                        onChange={(e) => handlePagoChange('validado', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="pago_validado" className="text-sm font-medium text-gray-700">
                        Marcar pago como validado
                      </label>
                    </div>
                  )}

                  {/* Opciones de Devolución */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-800 mb-3">Opciones de Devolución</h4>
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={() => handleDevolucion('parcial')}
                        className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                      >
                        Devolución Parcial
                      </button>
                      <button
                        onClick={() => handleDevolucion('total')}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Devolución Total
                      </button>
                    </div>

                    {/* Formulario de Devolución */}
                    {showDevolucion && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-gray-800">
                            Devolución {tipoDevolucion === 'total' ? 'Total' : 'Parcial'}
                          </h5>
                          <button
                            onClick={() => setShowDevolucion(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Monto a devolver
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max={citaData.pago.monto}
                              value={pagoData.devolucion_monto}
                              onChange={(e) => handlePagoChange('devolucion_monto', parseFloat(e.target.value) || 0)}
                              disabled={tipoDevolucion === 'total'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                              placeholder="0.00"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Razón de la devolución
                            </label>
                            <input
                              type="text"
                              value={pagoData.devolucion_razon}
                              onChange={(e) => handlePagoChange('devolucion_razon', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Motivo de la devolución"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Sin Pago - Formulario para registrar */
                <div className="space-y-6">
                  <div className="text-center py-6 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Sin información de pago</h3>
                    <p className="text-gray-600 text-sm">
                      Esta cita no tiene un pago registrado en el sistema.
                    </p>
                  </div>

                  {/* Formulario para registrar pago */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <h4 className="text-lg font-semibold text-gray-800">Registrar Pago</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Monto */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monto (S/.) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-500">S/.</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={pagoData.monto}
                            onChange={(e) => handlePagoChange('monto', parseFloat(e.target.value) || 0)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      {/* Medio de Pago */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Medio de Pago *
                        </label>
                        <select
                          value={pagoData.medio_pago}
                          onChange={(e) => handlePagoChange('medio_pago', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="efectivo">Efectivo</option>
                          <option value="yape">Yape</option>
                          <option value="plin">Plin</option>
                          <option value="transferencia_bancaria">Transferencia Bancaria</option>
                          <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                          <option value="otros">Otros</option>
                        </select>
                      </div>
                    </div>

                    {/* Información adicional */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <div className="flex gap-2">
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Nota:</span> El pago será registrado cuando presiones el botón "Terminar y Confirmar Cita". Asegúrate de ingresar el monto correcto y el medio de pago utilizado.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Preview del pago a registrar */}
                    {pagoData.monto > 0 && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Resumen del pago a registrar:</h5>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Monto:</span>
                          <span className="font-semibold text-gray-900">S/. {pagoData.monto.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span className="text-gray-600">Medio de pago:</span>
                          <span className="font-medium text-gray-900 capitalize">
                            {pagoData.medio_pago.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer con botón principal */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 transition-colors"
              >
                Cerrar
              </button>
              
              <button
                onClick={() => setShowCancelConfirm(true)}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar Cita
              </button>
            </div>
            
            <button
              onClick={handleTerminarCita}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Terminar y Confirmar Cita
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Modal de Confirmación para Cancelar Cita */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">¿Cancelar esta cita?</h3>
                  <p className="text-sm text-gray-500">ID: {citaData.id}</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800">
                  <span className="font-medium">Atención:</span> Esta acción cambiará el estado de la cita a "cancelada". 
                  Los datos del paciente y pago registrados se mantendrán.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 transition-colors"
                >
                  No, volver
                </button>
                <button
                  onClick={handleCancelarCita}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Cancelando...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      Sí, cancelar cita
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitaDetailsModal;