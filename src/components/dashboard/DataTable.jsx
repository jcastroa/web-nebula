// components/DataTable.jsx - VERSIÓN CORREGIDA
import React from 'react';
import { SolicitudRow } from './SolicitudRow';
import { CitaRow } from './CitaRow';
import { FileX, CalendarX } from 'lucide-react';

const SOLICITUDES_HEADERS = [
  'Solicitud',
  'Paciente', 
  'Especialidad',
  'Fecha Solicitada',
  'Estado/Pago'
];

const CITAS_HEADERS = [
  'Hora',
  'Paciente',
  'Especialidad', 
  'Tipo Consulta',
  'Estado'
];

export function DataTable({ 
  tipo, 
  data = [], // Valor por defecto
  onRowClick 
}) {
  const headers = tipo === 'solicitudes' ? SOLICITUDES_HEADERS : CITAS_HEADERS;
  
  // Mensajes específicos para cada tipo
  const getEmptyMessage = () => {
    if (tipo === 'solicitudes') {
      return {
        icon: FileX,
        title: 'No hay solicitudes pendientes',
        subtitle: 'Las nuevas solicitudes aparecerán aquí'
      };
    } else {
      return {
        icon: CalendarX,
        title: 'No hay citas programadas',
        subtitle: 'Las citas del día aparecerán aquí'
      };
    }
  };
  
  // Verificar que data es un array y tiene elementos
  if (!Array.isArray(data) || data.length === 0) {
    const emptyState = getEmptyMessage();
    const EmptyIcon = emptyState.icon;
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th 
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr>
              <td colSpan={headers.length + 1} className="px-6 py-16">
                <div className="text-center">
                  <EmptyIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {emptyState.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {emptyState.subtitle}
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th 
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => {
            // Verificar que el item existe antes de renderizar
            if (!item) {
              console.warn(`Item ${index} is null/undefined in ${tipo}`);
              return null;
            }

            if (tipo === 'solicitudes') {
              return (
                <SolicitudRow 
                  key={item.id || index}
                  solicitud={item}
                  onClick={onRowClick}
                />
              );
            } else {
              return (
                <CitaRow 
                  key={item.codigo || index}
                  cita={item}
                  onClick={onRowClick}
                />
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
}