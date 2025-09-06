// components/SolicitudRow.jsx - VERSIÓN CORREGIDA
import React from 'react';
import { Clock, Phone, CreditCard, ChevronRight,CheckCircle ,DollarSign } from 'lucide-react';
import { EstadoBadge } from '../../components/common/EstadoBadge';

export function SolicitudRow({ solicitud, onClick }) {
  // Verificación de seguridad
  if (!solicitud) {
    console.warn('SolicitudRow: solicitud is null/undefined');
    return null;
  }

  return (
    <tr 
      className="cursor-pointer hover:bg-gray-100 transition"
      onClick={() => onClick?.(solicitud)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">{solicitud.id || 'N/A'}</span>
          </div>
          <div className="text-xs text-gray-500 flex items-center mt-1">
            <Clock className="h-3 w-3 mr-1" />
            {solicitud.tiempo || 'Sin tiempo'}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{solicitud.paciente || 'Sin nombre'}</div>
          <div className="text-xs text-gray-500 flex items-center">
            <Phone className="h-3 w-3 mr-1" />
            {solicitud.telefono || 'Sin teléfono'}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{solicitud.especialidad || 'Sin especialidad'}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{solicitud.fecha || 'Sin fecha'}</div>
        <div className="text-xs text-gray-500">{solicitud.hora || 'Sin hora'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="space-y-1">
          <EstadoBadge estado={solicitud.estado || 'Sin estado'} tipo="solicitud" />
          <div className="flex items-center text-xs text-gray-600">
            {solicitud.estado === 'Con Pago' ? (
              <>
              <CheckCircle className="h-3 w-3 mr-1 text-green-400" />
               {solicitud.pago || 'Sin Pago'}
               </>
            ) : null}
           
           
          </div>
        </div>
      </td>
      <td className="px-4 py-2 text-gray-400">
        <ChevronRight className="w-4 h-4" />
      </td>
    </tr>
  );
}