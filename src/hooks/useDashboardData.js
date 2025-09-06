// hooks/useDashboardData.js
import { useState, useEffect, useMemo, useCallback } from 'react';

// ==========================================
// DATOS MOCK - Remover cuando uses API real
// ==========================================

const MOCK_SOLICITUDES = [
  {
    id: 'SOL240001',
    urgente: true,
    paciente: 'María Elena Rodríguez',
    telefono: '+51 969 558 720',
    especialidad: 'Medicina General',
    fecha: '16/04/2025',
    hora: 'Tarde',
    estado: 'Con Pago',
    pago: 'Validar S/ 60 (Yape)',
    nuevo: true,
    tiempo: 'Hoy 14:23'
  },
  {
    id: 'SOL240002',
    urgente: false,
    paciente: 'Carlos Mendoza Silva',
    telefono: '+51 987 654 321',
    especialidad: 'Cardiología',
    fecha: '17/04/2025',
    hora: 'Mañana',
    estado: 'Sin Pago',
    pago: 'Por Cobrar',
    nuevo: false,
    tiempo: 'Hoy 13:45'
  },
  {
    id: 'SOL240003',
    urgente: false,
    paciente: 'Ana Torres Vásquez',
    telefono: '+51 456 789 123',
    especialidad: 'Medicina General',
    fecha: '18/04/2025',
    hora: '09:00',
    estado: 'Con Pago',
    pago: 'Validar S/ 60',
    nuevo: false,
    tiempo: 'Hoy 12:30'
  },
  {
    id: 'SOL240004',
    urgente: true,
    paciente: 'Roberto Silva Hernández',
    telefono: '+51 999 888 777',
    especialidad: 'Dermatología',
    fecha: '19/04/2025',
    hora: 'Mañana',
    estado: 'Sin Pago',
    pago: 'Por Cobrar',
    nuevo: true,
    tiempo: 'Hoy 11:15'
  }
];

const MOCK_CITAS = [
  {
    hora: '08:00',
    duracion: '30 min',
    paciente: 'Luis García Pérez',
    codigo: 'P24001',
    telefono: '+51 987 123 456',
    motivo: 'Control Diabetes',
    doctor: 'Dr. Juan Carlos Mendoza',
    especialidad: 'Medicina General',
    consultorio: 'Consultorio 1',
    tipoConsulta: 'Control',
    tipoDetalle: 'Seguimiento',
    estado: 'Completada',
    estadoDetalle: '08:00 - 08:25'
  }
];

// Simulación de llamadas a API
const fetchSolicitudes = async (params = {}) => {
  console.log('🔄 Fetching solicitudes...', params);
  await new Promise(resolve => setTimeout(resolve, 800)); // Simular delay de red
  
  // Simular posible error (desactivado para debugging)
  // if (Math.random() < 0.1) {
  //   console.log('❌ Error en solicitudes');
  //   throw new Error('Error al cargar solicitudes');
  // }
  
  console.log('✅ Solicitudes cargadas exitosamente');
  return {
    data: MOCK_SOLICITUDES,
    total: 12,
    page: 1,
    limit: 10
  };
};

const fetchCitas = async (params = {}) => {
  console.log('🔄 Fetching citas...', params);
  await new Promise(resolve => setTimeout(resolve, 600)); // Simular delay de red
  
  // Simular posible error (desactivado para debugging)
  // if (Math.random() < 0.05) {
  //   console.log('❌ Error en citas');
  //   throw new Error('Error al cargar citas');
  // }
  
  console.log('✅ Citas cargadas exitosamente');
  return {
    data: MOCK_CITAS,
    total: 28,
    page: 1,
    limit: 10
  };
};

export function useDashboardData() {
  const [activeTab, setActiveTab] = useState('solicitudes');
  
  // Estados para solicitudes
  const [solicitudesData, setSolicitudesData] = useState([]);
  const [solicitudesLoading, setSolicitudesLoading] = useState(true);
  const [solicitudesError, setSolicitudesError] = useState(null);
  const [solicitudesTotal, setSolicitudesTotal] = useState(0);
  
  // Estados para citas
  const [citasData, setCitasData] = useState([]);
  const [citasLoading, setCitasLoading] = useState(true);
  const [citasError, setCitasError] = useState(null);
  const [citasTotal, setCitasTotal] = useState(0);

  // Filtros y parámetros de búsqueda
  const [filters, setFilters] = useState({
    search: '',
    estado: '',
    fecha: '',
    especialidad: ''
  });

  // Función para cargar solicitudes
  const loadSolicitudes = useCallback(async (customFilters = {}) => {
    console.log('📝 loadSolicitudes iniciado');
    try {
      setSolicitudesLoading(true);
      setSolicitudesError(null);
      
      const params = { ...filters, ...customFilters };
      const response = await fetchSolicitudes(params);
      
      console.log('📝 Respuesta solicitudes:', response);
      setSolicitudesData(response.data || []);
      setSolicitudesTotal(response.total || 0);
    } catch (error) {
      console.log('📝 Error en solicitudes:', error.message);
      setSolicitudesError(error.message);
      setSolicitudesData([]); // Asegurar que hay datos por defecto
      console.error('Error loading solicitudes:', error);
    } finally {
      setSolicitudesLoading(false);
      console.log('📝 loadSolicitudes finalizado');
    }
  }, [filters]);

  // Función para cargar citas
  const loadCitas = useCallback(async (customFilters = {}) => {
    console.log('📅 loadCitas iniciado');
    try {
      setCitasLoading(true);
      setCitasError(null);
      
      const params = { ...filters, ...customFilters };
      const response = await fetchCitas(params);
      
      console.log('📅 Respuesta citas:', response);
      setCitasData(response.data || []);
      setCitasTotal(response.total || 0);
    } catch (error) {
      console.log('📅 Error en citas:', error.message);
      setCitasError(error.message);
      setCitasData([]); // Asegurar que hay datos por defecto
      console.error('Error loading citas:', error);
    } finally {
      setCitasLoading(false);
      console.log('📅 loadCitas finalizado');
    }
  }, [filters]);

  // Cargar datos iniciales
  useEffect(() => {
    console.log('🚀 useEffect: Cargando datos iniciales');
    loadSolicitudes();
    loadCitas();
  }, [loadSolicitudes, loadCitas]);

  // Función para refrescar datos
  const refreshData = useCallback(() => {
    loadSolicitudes();
    loadCitas();
  }, [loadSolicitudes, loadCitas]);

  // Función para aplicar filtros
  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Función para limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      estado: '',
      fecha: '',
      especialidad: ''
    });
  }, []);

  // Estadísticas calculadas - con verificación de arrays
  const estadisticasSolicitudes = useMemo(() => {
    if (!Array.isArray(solicitudesData)) {
      return { pendientes: 0, conPago: 0 };
    }
    const pendientes = solicitudesData.filter(s => s?.estado === 'Pendiente').length;
    const conPago = solicitudesData.filter(s => s?.estado === 'Con Pago').length;
    return { pendientes, conPago };
  }, [solicitudesData]);

  const estadisticasCitas = useMemo(() => {
    if (!Array.isArray(citasData)) {
      return { completadas: 0, enProceso: 0, pendientes: 0, confirmadas: 0 };
    }
    const completadas = citasData.filter(c => c?.estado === 'Completada').length;
    const enProceso = citasData.filter(c => c?.estado === 'En Proceso').length;
    const pendientes = citasData.filter(c => c?.estado === 'Pendiente').length;
    const confirmadas = citasData.filter(c => c?.estado === 'Confirmada').length;
    return { completadas, enProceso, pendientes, confirmadas };
  }, [citasData]);

  // Estados derivados para el tab actual
  const currentLoading = activeTab === 'solicitudes' ? solicitudesLoading : citasLoading;
  const currentError = activeTab === 'solicitudes' ? solicitudesError : citasError;
  const currentData = activeTab === 'solicitudes' ? solicitudesData : citasData;
  const currentTotal = activeTab === 'solicitudes' ? solicitudesTotal : citasTotal;

  console.log('🎯 Estados actuales:', {
    activeTab,
    loading: { solicitudes: solicitudesLoading, citas: citasLoading, current: currentLoading },
    dataLength: { solicitudes: solicitudesData.length, citas: citasData.length }
  });

  return {
    // Estados básicos
    activeTab,
    setActiveTab,
    
    // Datos
    solicitudesData: Array.isArray(solicitudesData) ? solicitudesData : [],
    citasData: Array.isArray(citasData) ? citasData : [],
    
    // Estados de carga y error
    loading: {
      solicitudes: Boolean(solicitudesLoading),
      citas: Boolean(citasLoading),
      current: Boolean(currentLoading)
    },
    error: {
      solicitudes: solicitudesError || null,
      citas: citasError || null,
      current: currentError || null
    },
    
    // Totales
    total: {
      solicitudes: Number(solicitudesTotal) || 0,
      citas: Number(citasTotal) || 0,
      current: Number(currentTotal) || 0
    },
    
    // Filtros
    filters: filters || {},
    
    // Estadísticas
    estadisticasSolicitudes,
    estadisticasCitas,
    
    // Funciones
    refreshData,
    loadSolicitudes,
    loadCitas,
    applyFilters,
    clearFilters
  };
}