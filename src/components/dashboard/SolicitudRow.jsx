// components/SolicitudRow.jsx - VERSIÓN CORREGIDA
import React from 'react';
import { Clock, Phone, CreditCard, ChevronRight, CheckCircle, DollarSign, X, Circle } from 'lucide-react';
import { EstadoBadge } from '../../components/common/EstadoBadge';

export function SolicitudRow({ solicitud, onClick }) {
  // Verificación de seguridad
  if (!solicitud) {
    console.warn('SolicitudRow: solicitud is null/undefined');
    return null;
  }

  const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Funciones helper para formatear los datos de Firestore
  const formatearTelefono = (telefono) => {
    if (!telefono) return 'Sin teléfono';
    // Si ya viene con +51, lo devolvemos tal como está
    if (telefono.startsWith('+51')) return telefono;
    // Si no tiene +51, lo agregamos
    return `+51 ${telefono}`;
  };

  const formatearPago = (pago, estado) => {
    if (!pago || estado === 'cancelada') {
      return estado === 'cancelada' ? 'Pago Cancelado' : 'Sin Pago';
    }

    const { realizado, validado, monto, medio } = pago;

    if (realizado) {
      const estadoPago = validado ? 'Validado' : 'Validar';
      return `Con Pago - ${estadoPago} S/ ${monto} (${capitalizeFirst(medio)})`;
    }

    return 'Sin Pago';
  };

   const formatearTiempo = (fecha_creacion) => {
    if (!fecha_creacion) return 'Sin tiempo';
    
    try {
      const fechaCreacion = new Date(fecha_creacion);
      const ahora = new Date();
      const diffMs = ahora - fechaCreacion;
      const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffDias = Math.floor(diffHoras / 24);
      
      if (diffHoras < 1) {
        return `Hace ${diffMinutos} min`;
      } else if (diffHoras < 24) {
        return `Hace ${diffHoras}h`;
      } else if (diffDias === 1) {
        return 'Ayer';
      } else if (diffDias < 7) {
        return `Hace ${diffDias} días`;
      } else {
        // Formato manual para asegurar dd/mm/yyyy
        const dia = fechaCreacion.getDate().toString().padStart(2, '0');
        const mes = (fechaCreacion.getMonth() + 1).toString().padStart(2, '0');
        const año = fechaCreacion.getFullYear();
        return `${dia}/${mes}/${año}`;
      }
    } catch (error) {
      return 'Sin tiempo';
    }
  };

  const obtenerEspecialidad = (codigo_negocio) => {
    // const especialidades = {
    //   'salud_vida': 'Medicina General',
    //   'cardiologia': 'Cardiología',
    //   'dermatologia': 'Dermatología',
    //   'ginecologia': 'Ginecología'
    // };
    return  'Consulta General';
  };

  // Extraer y formatear datos de Firestore
  const {
    id,
    nombre,
    telefono,
    codigo_negocio,
    fecha,
    hora,
    estado,
    pago,
    fecha_creacion
  } = solicitud;

  const pagoFormateado = formatearPago(pago, estado);
  const telefonoFormateado = formatearTelefono(telefono);
  const tiempoFormateado = formatearTiempo(fecha_creacion);
  const especialidad = obtenerEspecialidad(codigo_negocio);

//   return (
//     <tr
//       className="cursor-pointer hover:bg-gray-100 transition"
//       onClick={() => onClick?.(solicitud)}
//     >
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div>
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-medium text-gray-900">{solicitud.id || 'N/A'}</span>
//           </div>
//           <div className="text-xs text-gray-500 flex items-center mt-1">
//             <Clock className="h-3 w-3 mr-1" />
//             {solicitud.tiempo || 'Sin tiempo'}
//           </div>
//         </div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div>
//           <div className="text-sm font-medium text-gray-900">{solicitud.paciente || 'Sin nombre'}</div>
//           <div className="text-xs text-gray-500 flex items-center">
//             <Phone className="h-3 w-3 mr-1" />
//             {solicitud.telefono || 'Sin teléfono'}
//           </div>
//         </div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <span className="text-sm text-gray-900">{solicitud.especialidad || 'Sin especialidad'}</span>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="text-sm text-gray-900">{solicitud.fecha || 'Sin fecha'}</div>
//         <div className="text-xs text-gray-500">{solicitud.hora || 'Sin hora'}</div>
//       </td>
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="space-y-1">
//           <EstadoBadge estado={solicitud.estado || 'Sin estado'} tipo="solicitud" />
//           <div className="flex items-center text-xs text-gray-600">
//             {solicitud.pago !== 'Sin Pago' ? (
//               solicitud.pago === 'Pago Cancelado' ? (
//                 <>
//                   <X className="h-3 w-3 mr-1 text-gray-400" />
//                   {solicitud.pago}
//                 </>
//               ) : (
//                 <>
//                   <CreditCard className="h-3 w-3 mr-1 text-green-400" />
//                   {solicitud.pago}
//                 </>
//               )
//             ) : (
//               <>
//                 <Circle className="h-3 w-3 mr-1 text-gray-400" />
//                 {solicitud.pago}
//               </>
//             )}


//           </div>
//         </div>
//       </td>
//       <td className="px-4 py-2 text-gray-400">
//         <ChevronRight className="w-4 h-4" />
//       </td>
//     </tr>
//   );
// }

return (
    <tr
      className="cursor-pointer hover:bg-gray-100 transition"
      onClick={() => onClick?.(solicitud)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">{id || 'N/A'}</span>
          </div>
          <div className="text-xs text-gray-500 flex items-center mt-1">
            <Clock className="h-3 w-3 mr-1" />
            {tiempoFormateado}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{nombre || 'Sin nombre'}</div>
          <div className="text-xs text-gray-500 flex items-center">
            <Phone className="h-3 w-3 mr-1" />
            {telefonoFormateado}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{especialidad}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{fecha || 'Sin fecha'}</div>
        <div className="text-xs text-gray-500">{hora || 'Sin hora'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="space-y-1">
          <EstadoBadge estado={estado || 'Sin estado'} tipo="solicitud" />
          <div className="flex items-center text-xs text-gray-600">
            {pagoFormateado !== 'Sin Pago' ? (
              pagoFormateado === 'Pago Cancelado' ? (
                <>
                  <X className="h-3 w-3 mr-1 text-gray-400" />
                  {pagoFormateado}
                </>
              ) : (
                <>
                  <CreditCard className="h-3 w-3 mr-1 text-green-400" />
                  {pagoFormateado}
                </>
              )
            ) : (
              <>
               <Circle className="h-3 w-3 mr-1 text-gray-400" />
                {pagoFormateado}
              </>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-2 text-gray-400">
        <ChevronRight className="w-4 h-4" />
      </td>
    </tr>
  );
}