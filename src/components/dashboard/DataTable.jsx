// components/DataTable.jsx - VERSIÓN CORREGIDA
import React from 'react';
import { SolicitudRow } from './SolicitudRow';
import { CitaRow } from './CitaRow';
import { FileX, CalendarX } from 'lucide-react';

// const SOLICITUDES_HEADERS = [
//   'Hora',
//   'Paciente', 
//   'Especialidad',
//   'Estado Cita',
//   'Pago'
// ];



export function DataTable({ 
  headers = [],
  data = [], // Valor por defecto
  onRowClick 
}) {
  
  // Mensajes específicos para cada tipo
  const getEmptyMessage = () => {
   
      return {
        icon: CalendarX,
        title: 'No hay citas programadas',
        subtitle: 'Las citas del día aparecerán aquí'
      };
    
  };

  const isToday = (dateString) => {
    try {
        const [day, month, year] = dateString.split('/').map(Number);
        const inputDate = new Date(year, month - 1, day);
        const today = new Date();
        
        return inputDate.getFullYear() === today.getFullYear() &&
               inputDate.getMonth() === today.getMonth() &&
               inputDate.getDate() === today.getDate();
    } catch {
        return false;
    }
}
  
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
              console.warn(`Item ${index} is null/undefined`);
              return null;
            }

          
              return (
                <CitaRow 
                  key={item.codigo || index}
                  cita={item}
                  isToday = {isToday(item.fecha)}
                  onClick={onRowClick}
                />
              );
            
          })}
        </tbody>
      </table>
    </div>
  );
}