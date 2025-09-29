

// hooks/useDashboardData.js
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import api from '../services/api';


const codigoNegocio = 'salud_vida';

const fetchCitas = async (params = {}) => {
  console.log('🔄 Fetching citas...', params);
  try {
    const response = await api.get(`/negocios/${codigoNegocio}/citas-priorizadas`, {
      params
    });
    
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error getting citas:', error);
    return null;
  }
};

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

  // ✅ NUEVO: Estado para el filtro de fecha actual
  const [selectedFilter, setSelectedFilter] = useState('today');

  // ✅ NUEVO: Estado para controlar modo de filtros
  const [filterMode, setFilterMode] = useState('quick'); // 'quick' | 'advanced'

  // Filtros y parámetros de búsqueda
  const [filters, setFilters] = useState({
    search: '',
    estado: '',
    fecha: '',
    especialidad: ''
  });

    // ✅ NUEVO: Filtros avanzados
  const [advancedFilters, setAdvancedFilters] = useState({
    nombre_completo: '',
    telefono: '',
    numero_documento: '',
    fecha_cita: '',
    estado_cita: '',
    estado_pago: ''
  });

  // ✅ NUEVO: useRef para evitar dependencias circulares
  const latestFiltersRef = useRef(filters);
  const latestSelectedFilterRef = useRef(selectedFilter);
  const latestAdvancedFiltersRef = useRef(advancedFilters);
  const latestFilterModeRef = useRef(filterMode);

  // Actualizar refs cuando cambien los valores
  useEffect(() => {
    latestFiltersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    latestSelectedFilterRef.current = selectedFilter;
  }, [selectedFilter]);

  useEffect(() => {
    latestFilterModeRef.current = filterMode;
  }, [filterMode]);

   useEffect(() => {
    latestAdvancedFiltersRef.current = advancedFilters;
  }, [advancedFilters]);

  // ✅ OPTIMIZADO: loadCitas sin dependencias circulares
  const loadCitas = useCallback(async (customFilters = {}, page = null, limit = null) => {
    console.log('📅 loadCitas iniciado');
    try {
      setCitasLoading(true);
      setCitasError(null);

      // Usar página actual si no se especifica
      const currentPage = page !== null ? page : citasPagination.currentPage;
      const itemsPerPage = limit !== null ? limit : citasPagination.itemsPerPage;

      // ✅ NUEVO: Usar refs para obtener valores actuales
      const currentFilters = latestFiltersRef.current;
      const currentDateFilter = latestSelectedFilterRef.current;

       const currentAdvancedFilters = latestAdvancedFiltersRef.current;
       const currentFilterMode = latestFilterModeRef.current;

             // ✅ CORREGIDO: Construir parámetros según el modo de filtro
      let finalFilters = {};

      if (currentFilterMode === 'advanced' && !customFilters.date_filter) {
        // Modo filtros avanzados - enviar filtros avanzados en customFilters
        const activeAdvancedFilters = Object.entries(currentAdvancedFilters)
          .filter(([key, value]) => value && value.toString().trim() !== '')
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {});

        finalFilters = {
          ...customFilters,
          ...activeAdvancedFilters
        };

        console.log('📅 Aplicando filtros avanzados:', activeAdvancedFilters);
      } else {
        // Modo filtros rápidos o customFilters con date_filter específico
        finalFilters = {
          ...currentFilters,
          ...customFilters,
          date_filter: customFilters.date_filter || currentDateFilter
        };

        console.log('📅 Aplicando filtros rápidos:', { date_filter: finalFilters.date_filter });
      }

      // ✅ CORREGIDO: Enviar todos los parámetros al endpoint real
      const params = {
        ...finalFilters,
        page: currentPage,
        include_past: true,
        items_per_page: itemsPerPage
      };

      console.log('📋 Parámetros finales enviados al endpoint:', params);

      // const params = {
      //   ...currentFilters,
      //   ...customFilters,
      //   // ✅ IMPORTANTE: Siempre incluir el date_filter actual si no se especifica otro
      //   date_filter: customFilters.date_filter || currentDateFilter,
      //   page: currentPage,
      //   include_past: true,
      //   items_per_page: itemsPerPage
      // };

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
  }, []); // ✅ Sin dependencias para evitar re-renders

  // ✅ OPTIMIZADO: Handlers de paginación simplificados
  const handleCitasPageChange = useCallback((newPage) => {
    console.log('📄 Cambio de página:', newPage);
    setCitasPagination(prev => ({ ...prev, currentPage: newPage }));
    loadCitas({}, newPage, null);
  }, [loadCitas]);

  const handleCitasItemsPerPageChange = useCallback((newItemsPerPage) => {
    console.log('📄 Cambio de items por página:', newItemsPerPage);
    setCitasPagination(prev => ({ 
      ...prev, 
      currentPage: 1, 
      itemsPerPage: newItemsPerPage 
    }));
    loadCitas({}, 1, newItemsPerPage);
  }, [loadCitas]);

  // ✅ NUEVO: Funciones para cambiar filtros de fecha
  const handleFilterChange = useCallback(async (filterType) => {
    console.log('🗓️ Cambio de filtro:', filterType);
    setSelectedFilter(filterType);
    setCitasPagination(prev => ({ ...prev, currentPage: 1 })); // Reset pagination

     // Limpiar filtros avanzados
    const clearedAdvancedFilters = {
      nombre_completo: '',
      telefono: '',
      numero_documento: '',
      fecha_cita: '',
      estado_cita: '',
      estado_pago: ''
    };

    setAdvancedFilters(clearedAdvancedFilters);
    latestAdvancedFiltersRef.current = clearedAdvancedFilters;
    
    // Volver a modo filtros rápidos con filtro "today"
    setFilterMode('quick');
    setSelectedFilter('today');
    latestFilterModeRef.current = 'quick';
    latestSelectedFilterRef.current = 'today';


    await loadCitas({ date_filter: filterType }, 1, null);
  }, [loadCitas]);

  // Cargar datos iniciales
  useEffect(() => {
    console.log('🚀 useEffect: Cargando datos iniciales');
    loadCitas({ date_filter: 'today' });
  }, []); // ✅ Solo ejecutar una vez al montar

  // ✅ OPTIMIZADO: Función para refrescar datos (mantiene página actual)
  const refreshData = useCallback((customFilters = {}) => {
    console.log('🔄 Refreshing data con filtros:', customFilters);
    loadCitas(customFilters);
  }, [loadCitas]);

  // ✅ OPTIMIZADO: Función para aplicar filtros (reinicia a página 1)
  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCitasPagination(prev => ({ ...prev, currentPage: 1 }));
    loadCitas(newFilters, 1, null);
  }, [loadCitas]);

  // Función para limpiar filtros
  const clearFilters = useCallback(() => {
    const clearedFilters = {
      search: '',
      estado: '',
      fecha: '',
      especialidad: ''
    };
    setFilters(clearedFilters);
    setCitasPagination(prev => ({ ...prev, currentPage: 1 }));
    loadCitas(clearedFilters, 1, null);
  }, [loadCitas]);

  const applyAdvancedFilters = useCallback(async (newAdvancedFilters) => {
    console.log('🔍 Aplicando filtros avanzados:', newAdvancedFilters);
    
    // Cambiar a modo filtros avanzados PRIMERO
    setFilterMode('advanced');
    setAdvancedFilters(newAdvancedFilters);
    setCitasPagination(prev => ({ ...prev, currentPage: 1 }));
    
    // Forzar actualización del ref inmediatamente
    latestAdvancedFiltersRef.current = newAdvancedFilters;
    latestFilterModeRef.current = 'advanced';
    
    // Cargar datos con filtros avanzados
    await loadCitas(newAdvancedFilters, 1, null);
    
    // Debug: Verificar estado después de aplicar
    console.log('✅ Filtros aplicados - Estado actual:', {
      filterMode: 'advanced',
      advancedFilters: newAdvancedFilters,
      hasFilters: Object.values(newAdvancedFilters).some(v => v && v.toString().trim() !== '')
    });
  }, [loadCitas]);

  const removeAdvancedFilter = useCallback(async (filterKey) => {
    console.log('🗑️ Removiendo filtro:', filterKey);
    
    const currentFilters = latestAdvancedFiltersRef.current;
    const updatedFilters = {
      ...currentFilters,
      [filterKey]: ''
    };

    console.log('📝 Filtros después de remover:', updatedFilters);

    // Verificar si quedan filtros activos
    const hasActiveFilters = Object.values(updatedFilters).some(value => 
      value && value.toString().trim() !== ''
    );

    console.log('🔍 ¿Quedan filtros activos?', hasActiveFilters);

    if (hasActiveFilters) {
      // Mantener modo avanzado con filtros restantes
      setAdvancedFilters(updatedFilters);
      latestAdvancedFiltersRef.current = updatedFilters;
      setCitasPagination(prev => ({ ...prev, currentPage: 1 }));
      
      // Solo enviar filtros activos
      const activeFilters = Object.entries(updatedFilters)
        .filter(([key, value]) => value && value.toString().trim() !== '')
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
        
      await loadCitas(activeFilters, 1, null);
    } else {
      // No quedan filtros, volver a modo rápido
      await clearAdvancedFilters();
    }
  }, [loadCitas]);

  const clearAdvancedFilters = useCallback(async () => {
    console.log('🧹 Limpiando todos los filtros avanzados');
    
    // Limpiar filtros avanzados
    const clearedAdvancedFilters = {
      nombre_completo: '',
      telefono: '',
      numero_documento: '',
      fecha_cita: '',
      estado_cita: '',
      estado_pago: ''
    };

    setAdvancedFilters(clearedAdvancedFilters);
    latestAdvancedFiltersRef.current = clearedAdvancedFilters;
    
    // Volver a modo filtros rápidos con filtro "today"
    setFilterMode('quick');
    setSelectedFilter('today');
    latestFilterModeRef.current = 'quick';
    latestSelectedFilterRef.current = 'today';
    setCitasPagination(prev => ({ ...prev, currentPage: 1 }));
    
    // Cargar datos con filtro rápido solamente
    await loadCitas({ date_filter: 'today' }, 1, null);
    
    console.log('✅ Filtros limpiados - volviendo a modo quick');
  }, [loadCitas]);

  // ✅ CORREGIDO: Verificar si hay filtros avanzados activos (con debug)
  const hasAdvancedFilters = useMemo(() => {
    const hasFilters = filterMode === 'advanced' && Object.values(advancedFilters).some(value => 
      value && value.toString().trim() !== ''
    );
    
    console.log('🔍 hasAdvancedFilters calculado:', {
      filterMode,
      advancedFilters,
      hasFilters
    });
    
    return hasFilters;
  }, [filterMode, advancedFilters]);

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
    selectedFilter,
    loading: { citas: citasLoading, current: currentLoading },
    dataLength: { citas: citasData.length },
    pagination: { citas: citasPagination, current: currentPagination }
  });

  return {
    // ✅ NUEVO: Estado de filtro
    selectedFilter,
    setSelectedFilter,
    filterMode,
    hasAdvancedFilters,

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
    advancedFilters: advancedFilters || {},

    // Funciones originales
    refreshData,
    loadCitas,
    applyFilters,
    clearFilters,

    // Funciones de paginación
    handleCitasPageChange,
    handleCitasItemsPerPageChange,

    // Handlers para el tab actual
    currentPageChange,
    currentItemsPerPageChange,

    // ✅ NUEVA: Función para cambiar filtros de fecha
    handleFilterChange,

    applyAdvancedFilters,
    removeAdvancedFilter,
    clearAdvancedFilters
  };
}