// components/CitaRow.jsx - VERSIÓN CORREGIDA
import React from 'react';
import { Phone, ChevronRight } from 'lucide-react';


export function CitaRow({ cita, onClick, isToday = false }) {
  // Verificación de seguridad
  if (!cita) {
    console.warn('CitaRow: cita is null/undefined');
    return null;
  }

  // Función para formatear la hora/fecha
  const formatDateTime = () => {
    if (isToday) {
      return { line1: cita.hora || 'Sin hora', line2: null };
    } else {
      return { 
        line1: cita.fecha || 'Sin fecha', 
        line2: cita.hora || null 
      };
    }
  };

  // Formatear el estado del pago
  const formatPagoStatus = () => {
    const pagoStatus = cita.pago_status;
    if (!pagoStatus) return { line1: 'Sin información de pago', line2: null };

    const line1 = `${pagoStatus.emoji || ''} ${pagoStatus.text || ''}`.trim();
    
    let line2 = '';
    if (pagoStatus.monto) {
      line2 += `S/.${pagoStatus.monto}`;
    }
    if (pagoStatus.medio) {
      line2 += `${line2 ? ' ' : ''}${pagoStatus.medio}`;
    }
    
    return { 
      line1: line1 || 'Sin estado', 
      line2: line2 || null 
    };
  };


  // Función para obtener el estado a mostrar
  const getEstadoInfo = () => {
    const estado = cita.estado;
    const priority = cita.priority || {};
    
    // Estados terminales - no importa priority
    if (estado === 'completada') {
      return { badge: '🟢 Concluida', reason: null, color: '#10B981' };
    }
    
    if (estado === 'cancelada') {
      return { badge: '❌ Cancelada', reason: null, color: '#EF4444' };
    }
    
    // Estado pendiente con casos especiales
    if (estado === 'pendiente') {
      if (priority.level === 'PAST_DUE') {
        return { badge: '⚫ No se confirmó - ', reason: priority.reason, color: '#6B7280' };
      }

     
      
      // Si tiene priority normal, usar badge + reason
      if (priority.badge) {
        return { 
          badge: priority.badge, 
          reason: priority.reason, 
          color: priority.color,
          pulse: priority.pulse 
        };
      }
    }
    
    // Fallback
    return { badge: 'Sin estado', reason: null, color: '#6B7280' };
  };
    
  

  const dateTimeInfo = formatDateTime();
  const pagoInfo = formatPagoStatus();
  const estadoInfo = getEstadoInfo();

    return (
    <tr 
      className="cursor-pointer hover:bg-gray-100 transition"
      onClick={() => onClick?.(cita)}
    >
      {/* Columna Hora */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {dateTimeInfo.line1}
          </div>
          {dateTimeInfo.line2 && (
            <div className="text-xs text-gray-500">
              {dateTimeInfo.line2}
            </div>
          )}
        </div>
      </td>

      {/* Columna Estado Cita */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="space-y-1">
          {/* Estado badge */}
          <div className="text-sm" style={{ color: estadoInfo.color || '#6B7280' }}>
            <span className={estadoInfo.pulse ? 'animate-pulse' : ''}>
              {estadoInfo.badge}
              {estadoInfo.reason && ` ${estadoInfo.reason}`}
            </span>
          </div>
          
          {/* Teléfono */}
          <div className="flex items-center text-xs text-gray-500">
            <Phone className="h-3 w-3 mr-1 text-gray-400" />
            {cita.telefono || 'Sin teléfono'}
          </div>
        </div>
      </td>


      {/* Columna Paciente */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-gray-900">
          {cita.nombre || 'Sin nombre'}
        </div>
      </td>

      {/* Columna Especialidad */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {cita.especialidad || 'Consulta general'}
        </div>
      </td>

      
      {/* Columna Pago */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm text-gray-900">
            {pagoInfo.line1}
          </div>
          {pagoInfo.line2 && (
            <div className="text-xs text-gray-600">
              {pagoInfo.line2}
            </div>
          )}
        </div>
      </td>

      {/* Columna de acción */}
      <td className="px-4 py-2 text-gray-400">
        <ChevronRight className="w-4 h-4" />
      </td>
    </tr>
  );
}