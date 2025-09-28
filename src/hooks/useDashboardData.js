// hooks/useDashboardData.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';

// ==========================================
// DATOS MOCK - Remover cuando uses API real
// ==========================================


const MOCK_CITAS =
{
  "success": true,
  "total": 9,
  "currentPage": 1,
  "itemsPerPage": 10,
  "totalPages": 1,
  "data": {
    "appointments": [
      {
        "codigo_negocio": "salud_vida",
        "pago": {
          "fecha_pago": "2025-04-13T20:49:12.323196+00:00",
          "validado": false,
          "medio": "efectivo",
          "realizado": true,
          "monto": 80
        },
        "pago_status": {
          "status": "pending_validation",
          "emoji": "🟡",
          "text": "Por validar",
          "color": "yellow",
          "monto": 80,
          "medio": "efectivo"
        },
        "hora": "20:30",
        "fecha_modificacion": "2025-04-14T01:53:31.377000+00:00",
        "estado": "pendiente",
        "usuario_id": "51932557022@c.us",
        "fecha_creacion": "2025-04-14T01:48:35.965000+00:00",
        "fecha": "23/09/2025",
        "nombre": "Esthefany Zavaleta",
        "telefono": "932557022",
        "id": "j1U0B9Zi5aCt0jEUwbvm",
        "priority": {
          "level": "CRITICAL",
          "score": 96.78015458333333,
          "reason": "⏰ En 3 min",
          "color": "#EF4444",
          "pulse": true,
          "sound_alert": true,
          "badge": "🚨 URGENTE"
        },
        "minutes_until": 3.2,
        "appointment_datetime": "2025-09-23T20:30:00"
      },
      {
        "codigo_negocio": "salud_vida",
        "hora": "19:30",
        "estado": "pendiente",
        "usuario_id": "51946657268@c.us",
        "fecha_creacion": "2025-04-13T02:06:09.243000+00:00",
        "fecha": "23/09/2025",
        "nombre": "orlando florida",
        "telefono": "946657268",
        "id": "HH0i4heWFL4zGrAvOqNN",
        "pago_status": {
          'status': 'pending',
          'emoji': '⚪',
          'text': 'Sin pago',
          'color': 'red'
        },
        "priority": {
          "level": "PAST_DUE",
          "score": 0,
          "reason": "Cita vencida",
          "color": "#6B7280",
          "pulse": false,
          "sound_alert": false
        },
        "minutes_until": -56.8,
        "appointment_datetime": "2025-09-23T19:30:00"
      }
    ],
    "stats": {
      "total": 2,
      "urgentes": 1,
      "proximas": 0,
      "por_confirmar": 2,
      "sin_pago": 2,
      "concluidas": 0
    },
    "cached_critical": false,
    "timestamp": "2025-09-23T20:26:46.809275",
    "codigo_negocio": "salud_vida"
  },
  "message": "Retrieved 2 prioritized appointments"
};


const codigoNegocio = 'salud_vida';
const fetchCitas = async (params = {}) => {
  console.log('🔄 Fetching citas...', params);
  try {

    const response = await api.get(`/negocios/${codigoNegocio}/citas-priorizadas`, {
      params
    });

    const data = response.data;

    return data

  } catch (error) {
    console.error('Error getting citas:', error);
    return null;
  }
};

// export function useDashboardData() {
//   const [activeTab, setActiveTab] = useState('solicitudes');

//   // Estados para solicitudes
//   const [solicitudesData, setSolicitudesData] = useState([]);
//   const [solicitudesLoading, setSolicitudesLoading] = useState(true);
//   const [solicitudesError, setSolicitudesError] = useState(null);
//   const [solicitudesTotal, setSolicitudesTotal] = useState(0);

//   // Estados para citas
//   const [citasData, setCitasData] = useState([]);
//   const [citasLoading, setCitasLoading] = useState(true);
//   const [citasError, setCitasError] = useState(null);
//   const [citasTotal, setCitasTotal] = useState(0);

//   // Filtros y parámetros de búsqueda
//   const [filters, setFilters] = useState({
//     search: '',
//     estado: '',
//     fecha: '',
//     especialidad: ''
//   });

//   // Función para cargar solicitudes
//   const loadSolicitudes = useCallback(async (customFilters = {}) => {
//     console.log('📝 loadSolicitudes iniciado');
//     try {
//       setSolicitudesLoading(true);
//       setSolicitudesError(null);

//       const params = { ...filters, ...customFilters };
//       const response = await fetchSolicitudes(params);

//       console.log('📝 Respuesta solicitudes:', response);
//       setSolicitudesData(response.data || []);
//       setSolicitudesTotal(response.total || 0);
//     } catch (error) {
//       console.log('📝 Error en solicitudes:', error.message);
//       setSolicitudesError(error.message);
//       setSolicitudesData([]); // Asegurar que hay datos por defecto
//       console.error('Error loading solicitudes:', error);
//     } finally {
//       setSolicitudesLoading(false);
//       console.log('📝 loadSolicitudes finalizado');
//     }
//   }, [filters]);

//   // Función para cargar citas
//   const loadCitas = useCallback(async (customFilters = {}) => {
//     console.log('📅 loadCitas iniciado');
//     try {
//       setCitasLoading(true);
//       setCitasError(null);

//       const params = { ...filters, ...customFilters };
//       const response = await fetchCitas(params);

//       console.log('📅 Respuesta citas:', response);
//       setCitasData(response.data || []);
//       setCitasTotal(response.total || 0);
//     } catch (error) {
//       console.log('📅 Error en citas:', error.message);
//       setCitasError(error.message);
//       setCitasData([]); // Asegurar que hay datos por defecto
//       console.error('Error loading citas:', error);
//     } finally {
//       setCitasLoading(false);
//       console.log('📅 loadCitas finalizado');
//     }
//   }, [filters]);

//   // Cargar datos iniciales
//   useEffect(() => {
//     console.log('🚀 useEffect: Cargando datos iniciales');
//     loadSolicitudes();
//     loadCitas();
//   }, [loadSolicitudes, loadCitas]);

//   // Función para refrescar datos
//   const refreshData = useCallback(() => {
//     loadSolicitudes();
//     loadCitas();
//   }, [loadSolicitudes, loadCitas]);

//   // Función para aplicar filtros
//   const applyFilters = useCallback((newFilters) => {
//     setFilters(prev => ({ ...prev, ...newFilters }));
//   }, []);

//   // Función para limpiar filtros
//   const clearFilters = useCallback(() => {
//     setFilters({
//       search: '',
//       estado: '',
//       fecha: '',
//       especialidad: ''
//     });
//   }, []);

//   // Estadísticas calculadas - con verificación de arrays
//   const estadisticasSolicitudes = useMemo(() => {
//     if (!Array.isArray(solicitudesData)) {
//       return { pendientes: 0, confirmadas: 0 };
//     }
//     const pendientes = solicitudesData.filter(s => s?.estado === 'pendiente').length;
//     const confirmadas = solicitudesData.filter(s => s?.estado === 'confirmada').length;
//     return { pendientes, confirmadas };
//   }, [solicitudesData]);

//   const estadisticasCitas = useMemo(() => {
//     if (!Array.isArray(citasData)) {
//       return { completadas: 0, enProceso: 0, pendientes: 0, confirmadas: 0 };
//     }
//     const completadas = citasData.filter(c => c?.estado === 'Completada').length;
//     const enProceso = citasData.filter(c => c?.estado === 'En Proceso').length;
//     const pendientes = citasData.filter(c => c?.estado === 'Pendiente').length;
//     const confirmadas = citasData.filter(c => c?.estado === 'Confirmada').length;
//     return { completadas, enProceso, pendientes, confirmadas };
//   }, [citasData]);

//   // Estados derivados para el tab actual
//   const currentLoading = activeTab === 'solicitudes' ? solicitudesLoading : citasLoading;
//   const currentError = activeTab === 'solicitudes' ? solicitudesError : citasError;
//   const currentData = activeTab === 'solicitudes' ? solicitudesData : citasData;
//   const currentTotal = activeTab === 'solicitudes' ? solicitudesTotal : citasTotal;

//   console.log('🎯 Estados actuales:', {
//     activeTab,
//     loading: { solicitudes: solicitudesLoading, citas: citasLoading, current: currentLoading },
//     dataLength: { solicitudes: solicitudesData.length, citas: citasData.length }
//   });

//   return {
//     // Estados básicos
//     activeTab,
//     setActiveTab,

//     // Datos
//     solicitudesData: Array.isArray(solicitudesData) ? solicitudesData : [],
//     citasData: Array.isArray(citasData) ? citasData : [],

//     // Estados de carga y error
//     loading: {
//       solicitudes: Boolean(solicitudesLoading),
//       citas: Boolean(citasLoading),
//       current: Boolean(currentLoading)
//     },
//     error: {
//       solicitudes: solicitudesError || null,
//       citas: citasError || null,
//       current: currentError || null
//     },

//     // Totales
//     total: {
//       solicitudes: Number(solicitudesTotal) || 0,
//       citas: Number(citasTotal) || 0,
//       current: Number(currentTotal) || 0
//     },

//     // Filtros
//     filters: filters || {},

//     // Estadísticas
//     estadisticasSolicitudes,
//     estadisticasCitas,

//     // Funciones
//     refreshData,
//     loadSolicitudes,
//     loadCitas,
//     applyFilters,
//     clearFilters
//   };
// }


export function useDashboardData() {

  // Estados para citas
  const [citasData, setCitasData] = useState([]);
  const [stats, setStats] = useState({});
  const [citasLoading, setCitasLoading] = useState(true);
  const [citasError, setCitasError] = useState(null);
  const [citasTotal, setCitasTotal] = useState(0);


  // Estados de paginación para citas
  const [citasPagination, setCitasPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 0
  });

  // Filtros y parámetros de búsqueda
  const [filters, setFilters] = useState({
    search: '',
    estado: '',
    fecha: '',
    especialidad: ''
  });


  // Función para cargar citas CON PAGINACIÓN
  const loadCitas = useCallback(async (customFilters = {}, page = null, limit = null) => {
    console.log('📅 loadCitas iniciado');
    try {
      setCitasLoading(true);
      setCitasError(null);

      // Usar página actual si no se especifica
      const currentPage = page !== null ? page : citasPagination.currentPage;
      const itemsPerPage = limit !== null ? limit : citasPagination.itemsPerPage;

      const params = {
        ...filters,
        ...customFilters,
        page: currentPage,
        include_past : true,
        items_per_page: itemsPerPage
      };

      const response = await fetchCitas(params);

      console.log('📅 Respuesta citas:', response);
      console.log('📅 Respuesta DATA citas:', response.data);
      setStats(response?.data?.stats || {});
      setCitasData(response?.data?.appointments || []);
      setCitasTotal(response.total || 0);

      // Actualizar información de paginación
      setCitasPagination(prev => ({
        ...prev,
        currentPage: response.currentPage || currentPage,
        itemsPerPage: response.itemsPerPage || itemsPerPage,
        totalPages: response.totalPages || Math.ceil((response.total || 0) / itemsPerPage)
      }));

    } catch (error) {
      console.log('📅 Error en citas:', error.message);
      setCitasError(error.message);
      setCitasData([]);
      console.error('Error loading citas:', error);
    } finally {
      setCitasLoading(false);
      console.log('📅 loadCitas finalizado');
    }
  }, [filters, citasPagination.currentPage, citasPagination.itemsPerPage]);

  // Handlers de paginación para citas
  const handleCitasPageChange = useCallback((newPage) => {
    loadCitas({}, newPage, null);
  }, [loadCitas]);

  const handleCitasItemsPerPageChange = useCallback((newItemsPerPage) => {
    loadCitas({}, 1, newItemsPerPage); // Reiniciar a página 1
  }, [loadCitas]);

  // Cargar datos iniciales
  useEffect(() => {
    console.log('🚀 useEffect: Cargando datos iniciales');
    loadCitas({date_filter: 'today'});
  }, [loadCitas]);

  // Función para refrescar datos (mantiene página actual)
  const refreshData = useCallback((filters) => {
    loadCitas(filters);
  }, [loadCitas]);

  // Función para aplicar filtros (reinicia a página 1)
  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Reiniciar paginación al aplicar filtros
    setCitasPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  // Función para limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      estado: '',
      fecha: '',
      especialidad: ''
    });
    // Reiniciar paginación al limpiar filtros
    setCitasPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);


  // Estados derivados para el tab actual
  const currentLoading = citasLoading;
  const currentError = citasError;
  const currentData = citasData;
  const currentTotal = citasTotal;
  const currentPagination = citasPagination;

  // Handlers de paginación para el tab actual
  const currentPageChange = handleCitasPageChange;
  const currentItemsPerPageChange = handleCitasItemsPerPageChange;

  console.log('🎯 Estados actuales:', {
    loading: { citas: citasLoading, current: currentLoading },
    dataLength: { citas: citasData.length },
    pagination: { citas: citasPagination, current: currentPagination }
  });

  return {

    // Datos
    citasData: Array.isArray(citasData) ? citasData : [],
    stats: stats || {},
    currentData: Array.isArray(currentData) ? currentData : [],

    // Estados de carga y error
    loading: {
      citas: Boolean(citasLoading),
      current: Boolean(currentLoading)
    },
    error: {
      citas: citasError || null,
      current: currentError || null
    },

    // Totales
    total: {
      citas: Number(citasTotal) || 0,
      current: Number(currentTotal) || 0
    },

    // Paginación
    pagination: {
      citas: citasPagination,
      current: currentPagination
    },

    // Filtros
    filters: filters || {},

    // Funciones originales
    refreshData,
    loadCitas,
    applyFilters,
    clearFilters,

    // Nuevas funciones de paginación
    handleCitasPageChange,
    handleCitasItemsPerPageChange,

    // Handlers para el tab actual
    currentPageChange,
    currentItemsPerPageChange
  };
}