// components/CitaRow.jsx - VERSIÓN CORREGIDA
import React from 'react';
import { Phone, ChevronRight } from 'lucide-react';
import { EstadoBadge } from '../../components/common/EstadoBadge';

export function CitaRow({ cita, onClick }) {
  // Verificación de seguridad
  if (!cita) {
    console.warn('CitaRow: cita is null/undefined');
    return null;
  }

  return (
    <tr 
      className="cursor-pointer hover:bg-gray-100 transition"
      onClick={() => onClick?.(cita)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{cita.hora || 'Sin hora'}</div>
          <div className="text-xs text-gray-500">{cita.duracion || 'Sin duración'}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-900">
            {cita.paciente || 'Sin nombre'}
          </div>
          <div className="flex items-center text-xs text-gray-500 gap-3">
            <span className="font-mono text-gray-600">{cita.codigo || 'Sin código'}</span>
            <span className="flex items-center">
              <Phone className="h-3 w-3 mr-1 text-gray-400" />
              {cita.telefono || 'Sin teléfono'}
            </span>
          </div>
          <div className="text-xs text-gray-700 italic">
            {cita.motivo || 'Sin motivo'}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{cita.especialidad || 'Sin especialidad'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center text-sm text-gray-900">
          {cita.tipoConsulta || 'Sin tipo'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <EstadoBadge estado={cita.estado || 'Sin estado'} tipo="cita" />
      </td>
      <td className="px-4 py-2 text-gray-400">
        <ChevronRight className="w-4 h-4" />
      </td>
    </tr>
  );
}