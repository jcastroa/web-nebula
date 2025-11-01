import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Clock,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
  X,
  AlertTriangle
} from 'lucide-react';
import scheduleService from '../services/scheduleService';

const DIAS_SEMANA = [
  { id: 'lunes', label: 'Lunes', short: 'L' },
  { id: 'martes', label: 'Martes', short: 'M' },
  { id: 'miercoles', label: 'Miércoles', short: 'X' },
  { id: 'jueves', label: 'Jueves', short: 'J' },
  { id: 'viernes', label: 'Viernes', short: 'V' },
  { id: 'sabado', label: 'Sábado', short: 'S' },
  { id: 'domingo', label: 'Domingo', short: 'D' }
];

const INTERVALOS = [
  { value: 15, label: '15 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1 hora 30 minutos' },
  { value: 120, label: '2 horas' }
];

export default function ScheduleConfig() {
  // Ref para scroll al inicio
  const topRef = useRef(null);

  // Estados para la configuración de horarios
  const [diasLaborables, setDiasLaborables] = useState({
    lunes: false,
    martes: false,
    miercoles: false,
    jueves: false,
    viernes: false,
    sabado: false,
    domingo: false
  });

  const [horariosPorDia, setHorariosPorDia] = useState({
    lunes: [{ inicio: '09:00', fin: '18:00' }],
    martes: [{ inicio: '09:00', fin: '18:00' }],
    miercoles: [{ inicio: '09:00', fin: '18:00' }],
    jueves: [{ inicio: '09:00', fin: '18:00' }],
    viernes: [{ inicio: '09:00', fin: '18:00' }],
    sabado: [{ inicio: '09:00', fin: '13:00' }],
    domingo: [{ inicio: '09:00', fin: '13:00' }]
  });

  const [intervaloCitas, setIntervaloCitas] = useState(30);

  // Estados para excepciones
  const [excepciones, setExcepciones] = useState([]);
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [newException, setNewException] = useState({
    fechaInicio: '',
    fechaFin: '',
    motivo: '',
    tipo: 'feriado' // feriado, vacaciones, otro
  });

  // Estados de UI
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingException, setIsAddingException] = useState(false);
  const [isDeletingException, setIsDeletingException] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Estado para modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [exceptionToDelete, setExceptionToDelete] = useState(null);

  // Cargar configuración inicial
  useEffect(() => {
    loadScheduleConfig();
    loadExceptions();
  }, []);

  const loadScheduleConfig = async () => {
    try {
      setIsLoading(true);
      const result = await scheduleService.getScheduleConfig();

      if (!result.success) {
        console.error('Error loading schedule config:', result.error);
        // Si no existe configuración, usar valores por defecto
        return;
      }

      const config = result.data;

      if (config.dias_laborables) {
        setDiasLaborables(config.dias_laborables);
      }
      if (config.horarios) {
        // Convertir a formato de array si viene en formato antiguo (objeto simple)
        const horariosFormateados = {};
        Object.keys(config.horarios).forEach(dia => {
          if (Array.isArray(config.horarios[dia])) {
            horariosFormateados[dia] = config.horarios[dia];
          } else {
            // Convertir formato antiguo {inicio, fin} a [{inicio, fin}]
            horariosFormateados[dia] = [config.horarios[dia]];
          }
        });
        setHorariosPorDia(horariosFormateados);
      }
      if (config.intervalo_citas) {
        setIntervaloCitas(config.intervalo_citas);
      }
    } catch (err) {
      console.error('Error loading schedule config:', err);
      // Si no existe configuración, usar valores por defecto
    } finally {
      setIsLoading(false);
    }
  };

  const loadExceptions = async () => {
    try {
      const result = await scheduleService.getExceptions();
      if (result.success) {
        setExcepciones(result.data.excepciones || []);
      } else {
        console.error('Error loading exceptions:', result.error);
      }
    } catch (err) {
      console.error('Error loading exceptions:', err);
    }
  };

  const handleDiaToggle = (diaId) => {
    const nuevoEstado = !diasLaborables[diaId];

    setDiasLaborables(prev => ({
      ...prev,
      [diaId]: nuevoEstado
    }));

    // Si se está activando el día y no tiene horarios, agregar uno por defecto
    if (nuevoEstado && horariosPorDia[diaId].length === 0) {
      setHorariosPorDia(prev => ({
        ...prev,
        [diaId]: [{ inicio: '09:00', fin: '18:00' }]
      }));
    }

    // Si se está desactivando el día, limpiar sus horarios
    if (!nuevoEstado) {
      setHorariosPorDia(prev => ({
        ...prev,
        [diaId]: []
      }));
    }
  };

  // Función para validar que dos intervalos no se crucen
  const validarNoCruce = (intervalos, nuevoIntervalo, indexExcluir = -1) => {
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const inicioNuevo = timeToMinutes(nuevoIntervalo.inicio);
    const finNuevo = timeToMinutes(nuevoIntervalo.fin);

    // Validar que inicio sea menor que fin
    if (inicioNuevo >= finNuevo) {
      return { valido: false, mensaje: 'La hora de inicio debe ser menor que la hora de fin' };
    }

    // Verificar cruce con otros intervalos
    for (let i = 0; i < intervalos.length; i++) {
      if (i === indexExcluir) continue; // Excluir el intervalo que se está editando

      const inicioExistente = timeToMinutes(intervalos[i].inicio);
      const finExistente = timeToMinutes(intervalos[i].fin);

      // Verificar si hay cruce
      const hayCruce = (
        (inicioNuevo >= inicioExistente && inicioNuevo < finExistente) || // Inicio dentro de otro intervalo
        (finNuevo > inicioExistente && finNuevo <= finExistente) || // Fin dentro de otro intervalo
        (inicioNuevo <= inicioExistente && finNuevo >= finExistente) // Contiene completamente otro intervalo
      );

      if (hayCruce) {
        return {
          valido: false,
          mensaje: `Este horario se cruza con el intervalo ${intervalos[i].inicio} - ${intervalos[i].fin}`
        };
      }
    }

    return { valido: true };
  };

  const handleHorarioChange = (diaId, index, field, value) => {
    const nuevosHorarios = [...horariosPorDia[diaId]];
    nuevosHorarios[index] = {
      ...nuevosHorarios[index],
      [field]: value
    };

    // Validar no cruce
    const validacion = validarNoCruce(
      horariosPorDia[diaId],
      nuevosHorarios[index],
      index
    );

    if (!validacion.valido) {
      setError(validacion.mensaje);
      setTimeout(() => setError(null), 4000);
      return;
    }

    setHorariosPorDia(prev => ({
      ...prev,
      [diaId]: nuevosHorarios
    }));
  };

  const handleAgregarIntervalo = (diaId) => {
    const ultimoIntervalo = horariosPorDia[diaId][horariosPorDia[diaId].length - 1];

    // Calcular sugerencia para el nuevo intervalo (2 horas después del último)
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const minutesToTime = (mins) => {
      const hours = Math.floor(mins / 60);
      const minutes = mins % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const finUltimo = timeToMinutes(ultimoIntervalo.fin);
    const nuevoInicio = Math.min(finUltimo + 60, 20 * 60); // Máximo 20:00
    const nuevoFin = Math.min(nuevoInicio + 4 * 60, 22 * 60); // Máximo 22:00

    const nuevoIntervalo = {
      inicio: minutesToTime(nuevoInicio),
      fin: minutesToTime(nuevoFin)
    };

    // Validar el nuevo intervalo
    const validacion = validarNoCruce(horariosPorDia[diaId], nuevoIntervalo);

    if (!validacion.valido) {
      setError(validacion.mensaje);
      setTimeout(() => setError(null), 4000);
      return;
    }

    setHorariosPorDia(prev => ({
      ...prev,
      [diaId]: [...prev[diaId], nuevoIntervalo]
    }));
  };

  const handleEliminarIntervalo = (diaId, index) => {
    // No permitir eliminar si es el último intervalo
    if (horariosPorDia[diaId].length === 1) {
      setError('Debe haber al menos un intervalo de horario por día');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setHorariosPorDia(prev => ({
      ...prev,
      [diaId]: prev[diaId].filter((_, i) => i !== index)
    }));
  };

  const handleSaveConfig = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const scheduleData = {
        dias_laborables: diasLaborables,
        horarios: horariosPorDia,
        intervalo_citas: intervaloCitas
      };

      const result = await scheduleService.saveScheduleConfig(scheduleData);

      if (result.success) {
        setSuccessMessage('Configuración guardada exitosamente');
        // Scroll al inicio para mostrar el mensaje de éxito
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Error al guardar la configuración: ' + result.error);
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err) {
      setError('Error al guardar la configuración: ' + err.message);
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddException = async () => {
    if (!newException.fechaInicio || !newException.motivo) {
      setError('Fecha de inicio y motivo son obligatorios');
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    try {
      setIsAddingException(true);
      const result = await scheduleService.addException(newException);

      if (result.success) {
        await loadExceptions();
        setShowExceptionModal(false);
        setNewException({
          fechaInicio: '',
          fechaFin: '',
          motivo: '',
          tipo: 'feriado'
        });
        setSuccessMessage('Excepción agregada exitosamente');
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Error al agregar excepción: ' + result.error);
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err) {
      setError('Error al agregar excepción: ' + err.message);
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } finally {
      setIsAddingException(false);
    }
  };

  const confirmDeleteException = (exception) => {
    setExceptionToDelete(exception);
    setShowDeleteModal(true);
  };

  const handleDeleteException = async () => {
    if (!exceptionToDelete) return;

    try {
      setIsDeletingException(true);
      const result = await scheduleService.deleteException(exceptionToDelete.id);

      if (result.success) {
        await loadExceptions();
        setShowDeleteModal(false);
        setExceptionToDelete(null);
        setSuccessMessage('Excepción eliminada exitosamente');
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Error al eliminar excepción: ' + result.error);
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err) {
      setError('Error al eliminar excepción: ' + err.message);
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } finally {
      setIsDeletingException(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Ref para scroll */}
      <div ref={topRef} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Calendar className="w-8 h-8 text-blue-600" />
          Configuración de Horarios
        </h1>
        <p className="text-gray-600">
          Configura los horarios de atención, intervalos de citas y excepciones
        </p>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs">✓</span>
          </div>
          <div className="flex-1">
            <p className="text-green-800">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Panel de Configuración de Horarios */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            Configuración de Horarios de Atención
          </h2>
          <p className="text-gray-600">
            Define los días laborables, horarios de atención e intervalo de citas
          </p>
        </div>

        {/* Días Laborables */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Días Laborables
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {DIAS_SEMANA.map(dia => (
            <label
              key={dia.id}
              className={`
                flex flex-col items-center justify-center p-4 rounded-lg border-2
                cursor-pointer transition-all
                ${diasLaborables[dia.id]
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                }
              `}
            >
              <input
                type="checkbox"
                checked={diasLaborables[dia.id]}
                onChange={() => handleDiaToggle(dia.id)}
                className="sr-only"
              />
              <span className="text-2xl font-bold mb-1">{dia.short}</span>
              <span className="text-xs">{dia.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Horarios por Día */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Horarios de Atención por Día
        </h2>
        <p className="text-gray-600 mb-4">
          Puedes agregar múltiples intervalos por día (ej: 9am-1pm y 4pm-8pm)
        </p>
        <div className="space-y-4">
          {DIAS_SEMANA.map(dia => (
            <div
              key={dia.id}
              className={`
                p-4 rounded-lg border
                ${diasLaborables[dia.id]
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200 opacity-60'
                }
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-gray-900 text-lg">
                  {dia.label}
                </div>
                {diasLaborables[dia.id] && (
                  <button
                    onClick={() => handleAgregarIntervalo(dia.id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar intervalo
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {horariosPorDia[dia.id].map((intervalo, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 font-medium whitespace-nowrap">
                          Inicio:
                        </label>
                        <input
                          type="time"
                          value={intervalo.inicio}
                          onChange={(e) => handleHorarioChange(dia.id, index, 'inicio', e.target.value)}
                          disabled={!diasLaborables[dia.id]}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                      <span className="text-gray-400">—</span>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 font-medium whitespace-nowrap">
                          Fin:
                        </label>
                        <input
                          type="time"
                          value={intervalo.fin}
                          onChange={(e) => handleHorarioChange(dia.id, index, 'fin', e.target.value)}
                          disabled={!diasLaborables[dia.id]}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {diasLaborables[dia.id] && horariosPorDia[dia.id].length > 1 && (
                      <button
                        onClick={() => handleEliminarIntervalo(dia.id, index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar intervalo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {!diasLaborables[dia.id] && (
                <div className="text-sm text-gray-500 italic mt-2">
                  Día no laborable
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Intervalo de Citas */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Intervalo de Citas
        </h2>
        <p className="text-gray-600 mb-4">
          Define cada cuánto tiempo se pueden agendar las citas
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {INTERVALOS.map(intervalo => (
            <button
              key={intervalo.value}
              onClick={() => setIntervaloCitas(intervalo.value)}
              className={`
                px-4 py-3 rounded-lg border-2 font-medium transition-all
                ${intervaloCitas === intervalo.value
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400'
                }
              `}
            >
              {intervalo.label}
            </button>
          ))}
        </div>
      </div>

        {/* Botón Guardar Configuración */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveConfig}
            disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium text-lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar Configuración
            </>
          )}
        </button>
      </div>
      </div>

      {/* Excepciones (Feriados, Vacaciones) */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Calendario de Excepciones
          </h2>
          <button
            onClick={() => setShowExceptionModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Excepción
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Feriados, vacaciones o días no laborables
        </p>

        {excepciones.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No hay excepciones registradas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {excepciones.map((excepcion, index) => (
              <div
                key={excepcion.id || index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded
                      ${excepcion.tipo === 'feriado'
                        ? 'bg-purple-100 text-purple-700'
                        : excepcion.tipo === 'vacaciones'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                      }
                    `}>
                      {excepcion.tipo}
                    </span>
                    <span className="font-medium text-gray-900">
                      {excepcion.motivo}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {excepcion.fecha_inicio === excepcion.fecha_fin || !excepcion.fecha_fin
                      ? `${excepcion.fecha_inicio}`
                      : `${excepcion.fecha_inicio} - ${excepcion.fecha_fin}`
                    }
                  </div>
                </div>
                <button
                  onClick={() => confirmDeleteException(excepcion)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para Agregar Excepción */}
      {showExceptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Agregar Excepción
              </h3>
              <button
                onClick={() => setShowExceptionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Tipo de excepción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de excepción
                </label>
                <select
                  value={newException.tipo}
                  onChange={(e) => setNewException(prev => ({ ...prev, tipo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="feriado">Feriado</option>
                  <option value="vacaciones">Vacaciones</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              {/* Fecha inicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de inicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newException.fechaInicio}
                  onChange={(e) => setNewException(prev => ({ ...prev, fechaInicio: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Fecha fin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de fin (opcional)
                </label>
                <input
                  type="date"
                  value={newException.fechaFin}
                  onChange={(e) => setNewException(prev => ({ ...prev, fechaFin: e.target.value }))}
                  min={newException.fechaInicio}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Deja vacío para un solo día
                </p>
              </div>

              {/* Motivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newException.motivo}
                  onChange={(e) => setNewException(prev => ({ ...prev, motivo: e.target.value }))}
                  rows={3}
                  placeholder="Ej: Día festivo nacional, Vacaciones de verano..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowExceptionModal(false)}
                disabled={isAddingException}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddException}
                disabled={isAddingException}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAddingException ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Agregar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && exceptionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Confirmar Eliminación
                </h3>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-3">
                ¿Estás seguro de que deseas eliminar esta excepción?
              </p>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded
                    ${exceptionToDelete.tipo === 'feriado'
                      ? 'bg-purple-100 text-purple-700'
                      : exceptionToDelete.tipo === 'vacaciones'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                    }
                  `}>
                    {exceptionToDelete.tipo}
                  </span>
                  <span className="font-medium text-gray-900">
                    {exceptionToDelete.motivo}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {exceptionToDelete.fecha_inicio === exceptionToDelete.fecha_fin || !exceptionToDelete.fecha_fin
                    ? `${exceptionToDelete.fecha_inicio}`
                    : `${exceptionToDelete.fecha_inicio} - ${exceptionToDelete.fecha_fin}`
                  }
                </div>
              </div>
              <p className="text-sm text-red-600 mt-3">
                Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setExceptionToDelete(null);
                }}
                disabled={isDeletingException}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteException}
                disabled={isDeletingException}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeletingException ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
