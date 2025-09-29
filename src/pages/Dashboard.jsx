// // components/Dashboard.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Calendar,
  FileText,
  Filter,
  Plus,
  Clock,
  CheckCircle,
  Loader2,
  CalendarCheck,
  RefreshCw, DollarSign, CreditCard, Timer, PhoneCall, Bell
} from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
// import { TabButton } from '../components/dashboard/TabButton';
import { ActionButton } from '../components/dashboard/ActionButton';
import { DataTable } from '../components/dashboard/DataTable';
import { EstadisticasBadge } from '../components/dashboard/EstadisticasBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import StatsCards from "../components/dashboard/StatsCards"; // ajusta la ruta según tu estructura
import { TablePagination } from '../components/common/TablePagination';
import AppointmentService from '../services/appointmentService';
import { CriticalAlert } from '../components/dashboard/CriticalAlert'; // NUEVO
import useWebSocket from '../hooks/useWebSocket';
import { SmartRefreshButton } from '../components/dashboard/SmartRefreshButton'; // NUEVO
import AdvancedFiltersModal from '../components/dashboard/AdvancedFiltersModal';
import AppliedFiltersBar from '../components/dashboard/AppliedFiltersBar';
import CitaDetailsModal from '../components/dashboard/CitaDetailsModal'; // NUEVO: Importar el modal


export default function Dashboard() {
  const {
    // ✅ NUEVO: selectedFilter ahora viene del hook
    selectedFilter,
    filterMode,
    hasAdvancedFilters,
    citasData,
    stats,
    currentData,
    loading,
    error,
    total,
    pagination,
    refreshData,
    currentPageChange,
    currentItemsPerPageChange,
    // ✅ NUEVA: función unificada para cambiar filtros
    handleFilterChange,
    advancedFilters,
    applyAdvancedFilters,
    removeAdvancedFilter,
    clearAdvancedFilters
  } = useDashboardData();

  // NUEVOS ESTADOS para alertas
  const [criticalAlert, setCriticalAlert] = useState(null);
  const [pendingUpdates, setPendingUpdates] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // NUEVO: Estados para el modal de detalles de cita
  const [selectedCita, setSelectedCita] = useState(null);
  const [showCitaModal, setShowCitaModal] = useState(false);
  const [citaModalLoading, setCitaModalLoading] = useState(false);

  const codigoNegocio = 'salud_vida';
  // WebSocket hook
  const { wsStatus, notifications, sendMessage } = useWebSocket(codigoNegocio);

  //const [selectedFilter, setSelectedFilter] = useState('today');



  // ESCUCHAR NOTIFICACIONES DEL WEBSOCKET
  useEffect(() => {
    if (notifications.length > 0) {
      const lastNotification = notifications[0];
      console.log('📨 Nueva notificación:', lastNotification);

      // Procesar según el tipo de notificación
      if (lastNotification.notification_type === 'URGENT_ALERT') {
        // Mostrar alerta crítica
        setCriticalAlert({
          type: 'urgent',
          appointments: lastNotification.critical_appointments || [],
          timestamp: lastNotification.timestamp,
          playSound: true
        });

        // Actualizar indicador del botón
        setPendingUpdates({
          type: 'urgent',
          count: lastNotification.summary?.new_critical || 1
        });

        // Actualizar stats sin refrescar tabla (opcional)
        // if (updateStats) {
        //   updateStats({
        //     urgentes: (stats.urgentes || 0) + (lastNotification.summary?.new_critical || 0)
        //   });
        // }

      } else if (lastNotification.summary?.new_appointments > 0) {
        // Actualización normal - solo mostrar badge
        setPendingUpdates(prev => ({
          type: 'normal',
          count: (prev?.count || 0) + lastNotification.summary.new_appointments
        }));
      } else if (lastNotification.summary?.priority_upgraded > 0) {
        // Actualización normal - solo mostrar badge
        setPendingUpdates(prev => ({
          type: 'normal',
          count: (prev?.count || 0) + lastNotification.summary.priority_upgraded
        }));
      }
    }
  }, [notifications]);


  console.log('ESTADO SOCKET:', wsStatus);

  // ✅ NUEVA FUNCIÓN: Manejar click en fila
  const handleRowClick = useCallback((cita) => {
    console.log('🎯 Clicked cita:', cita);

    if (!cita || !cita.id) {
      console.warn('❌ Cita inválida:', cita);
      return;
    }

    // Opción 1: Usar datos existentes (recomendado para velocidad)
    // Ya tienes todos los datos necesarios en la estructura que me mostraste
    setSelectedCita(cita);
    setShowCitaModal(true);

    // Opción 2: Si necesitas datos adicionales, puedes hacer una llamada al endpoint
    // fetchCitaDetails(cita.id);
  }, []);

  // ✅ FUNCIÓN OPCIONAL: Obtener detalles adicionales de la cita
  const fetchCitaDetails = async (citaId) => {
    setCitaModalLoading(true);
    // try {
    //   console.log('📡 Obteniendo detalles de cita:', citaId);

    //   // Llamada al endpoint para obtener detalles completos
    //   const response = await api.get(`/negocios/${codigoNegocio}/citas/${citaId}/detalles`);

    //   console.log('✅ Detalles obtenidos:', response.data);
    //   setSelectedCita(response.data);
    //   setShowCitaModal(true);

    // } catch (error) {
    //   console.error('❌ Error obteniendo detalles de cita:', error);
    //   // Opcional: Mostrar notificación de error
    // } finally {
    //   setCitaModalLoading(false);
    // }
  };

  // ✅ FUNCIÓN: Actualizar cita desde el modal
  const handleUpdateCita = async (updateData) => {
    console.log('📝 Actualizando cita:', updateData);

    // try {
    //   const response = await api.post(`/negocios/${codigoNegocio}/citas/${updateData.id}/actualizar`, {
    //     accion: updateData.accion,
    //     datos_paciente: updateData.datos_paciente,
    //     datos_pago: updateData.datos_pago,
    //     devolucion: updateData.devolucion
    //   });

    //   console.log('✅ Cita actualizada:', response.data);

    //   // Cerrar modal
    //   setShowCitaModal(false);
    //   setSelectedCita(null);

    //   // Refrescar datos para mostrar cambios
    //   await refreshData();

    //   // Opcional: Mostrar notificación de éxito
    //   // toast.success('Cita actualizada exitosamente');

    //   return response.data;

    // } catch (error) {
    //   console.error('❌ Error actualizando cita:', error);

    //   // Opcional: Mostrar notificación de error
    //   // toast.error(error.response?.data?.detail || 'Error actualizando cita');

    //   throw error;
    // }
  };

  // ✅ FUNCIÓN: Cerrar modal
  const handleCloseCitaModal = () => {
    setShowCitaModal(false);
    setSelectedCita(null);
  };

  const handleNewCita = () => {
    console.log('Nueva cita clicked');
    // Manejar creación de nueva cita
  };

  const handleFilter = () => {
    console.log('Filter clicked - Abriendo modal de filtros avanzados');
    setShowAdvancedFilters(true);
  };

  // ✅ NUEVAS: Funciones para manejar filtros avanzados
  const handleApplyAdvancedFilters = async (filters) => {
    console.log('🎯 [DASHBOARD] handleApplyAdvancedFilters recibió:', filters);
    console.log('🎯 [DASHBOARD] Tipo de datos recibidos:', typeof filters);
    console.log('🎯 [DASHBOARD] Claves del objeto:', Object.keys(filters));

    setShowAdvancedFilters(false);

    // ✅ CORREGIDO: Pasar los filtros directamente
    await applyAdvancedFilters(filters);

    console.log('🎯 [DASHBOARD] Después de applyAdvancedFilters - advancedFilters actuales:', advancedFilters);
  };

  const handleClearAdvancedFilters = async () => {
    console.log('🧹 Limpiando filtros avanzados');
    await clearAdvancedFilters();
  };

  const handleEditAdvancedFilters = () => {
    console.log('✏️ Editando filtros avanzados');
    setShowAdvancedFilters(true);
  };





  // ✅ OPTIMIZADO: Handlers de filtros simplificados
  const handleFilterToday = useCallback(async () => {
    setIsRefreshing(true);
    setPendingUpdates(null);
    setCriticalAlert(null);

    await handleFilterChange('today');

    setIsRefreshing(false);
  }, [handleFilterChange]);

  const handleFilterTomorrow = useCallback(async () => {
    setIsRefreshing(true);

    await handleFilterChange('tomorrow');

    setIsRefreshing(false);
  }, [handleFilterChange]);

  const handleFilterWeek = useCallback(async () => {
    setIsRefreshing(true);
    setPendingUpdates(null);
    setCriticalAlert(null);

    await handleFilterChange('week');

    setIsRefreshing(false);
  }, [handleFilterChange]);

  const handleFilterAll = useCallback(async () => {
    setIsRefreshing(true);
    setPendingUpdates(null);
    setCriticalAlert(null);

    await handleFilterChange('all');

    setIsRefreshing(false);
  }, [handleFilterChange]);

  // ✅ OPTIMIZADO: Refresh mantiene el filtro actual
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setPendingUpdates(null);
    setCriticalAlert(null);

    // ✅ MEJORADO: Si hay filtros avanzados, limpiarlos primero
    if (hasAdvancedFilters) {
      console.log('🧹 Refresh: Limpiando filtros avanzados primero');
      await clearAdvancedFilters();
    } else {
      // Si no hay filtros avanzados, solo actualizar con filtro "today"
      await handleFilterChange('today');
    }

    setIsRefreshing(false);
  }, [hasAdvancedFilters, clearAdvancedFilters, handleFilterChange]);


  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">

      {/* ALERTA CRÍTICA FLOTANTE */}
      <CriticalAlert
        alert={criticalAlert}
        onDismiss={() => setCriticalAlert(null)}
        onRefresh={() => {
          handleRefresh();
          setCriticalAlert(null);
        }}
      />

      {/* INDICADOR DE WEBSOCKET */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow">
          {wsStatus === 'connected' ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600">Conectado</span>
            </>
          ) : wsStatus === 'connecting' ? (
            <>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-xs text-yellow-600">Conectando...</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-xs text-red-600">Desconectado</span>
            </>
          )}
        </div>
      </div>

      <StatsCards
        statsData={stats}
        loading={loading.citas}
      />




      <div className="flex justify-between items-center mb-6 mt-8">

        {!hasAdvancedFilters && (
          <div className="flex gap-2">
            <ActionButton onClick={handleFilterToday} active={selectedFilter === 'today'}>
              Hoy
            </ActionButton>
            <ActionButton onClick={handleFilterTomorrow} active={selectedFilter === 'tomorrow'}>
              Mañana
            </ActionButton>

            <ActionButton onClick={handleFilterWeek} active={selectedFilter === 'week'} >
              Semana
            </ActionButton>
            <ActionButton onClick={handleFilterAll} active={selectedFilter === 'all'} >
              Todas
            </ActionButton>
          </div>
        )}

        {/* ✅ NUEVO: Mostrar texto informativo cuando hay filtros avanzados */}
        {hasAdvancedFilters && (
          <div className="flex items-center gap-2 text-gray-600">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">
              Mostrando resultados filtrados
            </span>
          </div>
        )}

        <div className="flex gap-2">
          {/* BADGE DE ACTUALIZACIONES PENDIENTES */}
          {pendingUpdates && !isRefreshing && (
            <div className={`
              flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium
              ${pendingUpdates.type === 'urgent'
                ? 'bg-red-100 text-red-700 animate-pulse'
                : 'bg-blue-100 text-blue-700'}
            `}>
              <Bell className="w-4 h-4" />
              <span>{pendingUpdates.count} nueva{pendingUpdates.count > 1 ? 's' : ''}</span>
            </div>
          )}

          {!hasAdvancedFilters && (
            <ActionButton onClick={handleFilter} icon={Filter}>
              Filtros avanzados
            </ActionButton>
          )}

          {/* BOTÓN INTELIGENTE DE ACTUALIZAR */}
          <SmartRefreshButton
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            pendingUpdates={pendingUpdates}
          />

          <ActionButton onClick={handleNewCita} icon={Plus} variant="primary">
            Nueva Cita
          </ActionButton>
        </div>


      </div>
      {/* ✅ NUEVO: Barra de filtros aplicados */}
      {hasAdvancedFilters && (
        <AppliedFiltersBar
          filters={advancedFilters}
          onRemoveFilter={removeAdvancedFilter}
          onClearAll={handleClearAdvancedFilters}
          onEditFilters={handleEditAdvancedFilters}
          loading={loading.current}
        />
      )}


      {/* Content Area */}
      {loading.current ? (
        <div className="bg-white border border-gray-200 rounded-lg">
          <LoadingSpinner
            text={`Cargando citas...`}
          />
        </div>
      ) : error.current ? (
        <div className="bg-white border border-gray-200 rounded-lg">
          <ErrorMessage
            error={error.current}
            onRetry={refreshData}
            title={`Error al cargar citas`}
          />
        </div>
      ) : (
        <>
          {/* Data Table */}
          <DataTable
            headers={[
              'Hora',
              'Estado Cita',
              'Paciente',
              'Especialidad',
              'Pago'
            ]}
            data={citasData || []}
            onRowClick={handleRowClick}
          />

          {/* Footer Stats */}
          <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
            <TablePagination
              currentData={currentData} // ✅ Usar currentData del hook
              total={total.current} // ✅ Usar total.current del hook
              currentPage={pagination.current.currentPage} // ✅ Usar pagination.current del hook
              itemsPerPage={pagination.current.itemsPerPage} // ✅ Usar pagination.current del hook
              itemName={'citas'}
              onPageChange={currentPageChange} // ✅ Usar currentPageChange del hook
              onItemsPerPageChange={currentItemsPerPageChange} // ✅ Usar currentItemsPerPageChange del hook
              loading={loading.current}
            />

            {/* Estadísticas */}

            <div className="flex gap-4">
              <EstadisticasBadge
                icon={PhoneCall}
                count={stats.por_confirmar || 0}
                label="Por confirmar"
                variant="yellow"
              />
              <EstadisticasBadge
                icon={CreditCard}
                count={stats.sin_pago || 0}
                label="Sin pago"
                variant="gray"
              />

              <EstadisticasBadge
                icon={CheckCircle}
                count={stats.concluidas || 0}
                label="Concluidas"
                variant="green"
              />
            </div>

          </div>

           {/* ✅ NUEVO: MODAL DE DETALLES DE CITA */}
          <CitaDetailsModal
            isOpen={showCitaModal}
            onClose={handleCloseCitaModal}
            citaData={selectedCita}
            onUpdateCita={handleUpdateCita}
            loading={citaModalLoading}
          />

          {/* ✅ MODAL DE FILTROS AVANZADOS */}
          <AdvancedFiltersModal
            isOpen={showAdvancedFilters}          // ← Se muestra cuando es true
            onClose={() => setShowAdvancedFilters(false)}
            onApplyFilters={handleApplyAdvancedFilters}
            onClearFilters={handleClearAdvancedFilters}
            initialFilters={advancedFilters}
            loading={loading.current}
          />


        </>
      )}



    </div>);
}