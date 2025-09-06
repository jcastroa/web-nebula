// components/Dashboard.jsx
import React from 'react';
import { 
  Calendar, 
  FileText, 
  Filter, 
  Plus,
  Clock,
  CheckCircle,
  Loader2,
  CalendarCheck,
  RefreshCw , DollarSign , CreditCard
} from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
import { TabButton } from '../components/dashboard/TabButton';
import { ActionButton } from '../components/dashboard/ActionButton';
import { DataTable } from '../components/dashboard/DataTable';
import { EstadisticasBadge } from '../components/dashboard/EstadisticasBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import StatsCards from "../components/dashboard/StatsCards"; // ajusta la ruta según tu estructura

export default function Dashboard() {
  const {
    activeTab,
    setActiveTab,
    solicitudesData,
    citasData,
    loading,
    error,
    total,
    estadisticasSolicitudes,
    estadisticasCitas,
    refreshData
  } = useDashboardData();

  const handleRowClick = (item) => {
    console.log('Clicked item:', item);
    // Aquí puedes manejar la navegación o abrir modales
  };

  const handleNewCita = () => {
    console.log('Nueva cita clicked');
    // Manejar creación de nueva cita
  };

  const handleFilter = () => {
    console.log('Filter clicked');
    // Manejar filtros
  };

  const handleVistaSemanal = () => {
    console.log('Vista semanal clicked');
    // Cambiar a vista semanal
  };

  const handleRefresh = () => {
    refreshData();
  };

  const currentData = activeTab === 'solicitudes' ? solicitudesData : citasData;
  
  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
       <StatsCards />
      {/* Navigation Tabs */}
      <div className="flex justify-between items-center mb-6 mt-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <TabButton
            isActive={activeTab === 'solicitudes'}
            onClick={() => setActiveTab('solicitudes')}
            icon={FileText}
            count={loading.solicitudes ? '...' : total.solicitudes}
            variant="red"
          >
            Solicitudes
          </TabButton>
          <TabButton
            isActive={activeTab === 'citas'}
            onClick={() => setActiveTab('citas')}
            icon={Calendar}
            count={loading.citas ? '...' : total.citas}
            variant="blue"
          >
            Citas del Día
          </TabButton>
        </div>

        <div className="flex gap-2">
          <ActionButton onClick={handleRefresh} icon={RefreshCw}>
            Actualizar
          </ActionButton>
          <ActionButton onClick={handleFilter} icon={Filter}>
            Filtrar
          </ActionButton>
          {activeTab === 'citas' && (
            <ActionButton onClick={handleVistaSemanal} icon={Calendar}>
              Vista Semanal
            </ActionButton>
          )}
          <ActionButton onClick={handleNewCita} icon={Plus} variant="primary">
            Nueva Cita
          </ActionButton>
        </div>
      </div>

      {/* Content Area */}
      {loading.current ? (
        <div className="bg-white border border-gray-200 rounded-lg">
          <LoadingSpinner 
            text={`Cargando ${activeTab}...`}
          />
        </div>
      ) : error.current ? (
        <div className="bg-white border border-gray-200 rounded-lg">
          <ErrorMessage 
            error={error.current}
            onRetry={refreshData}
            title={`Error al cargar ${activeTab}`}
          />
        </div>
      ) : (
        <>
          {/* Data Table */}
          <DataTable 
            tipo={activeTab}
            data={currentData || []}
            onRowClick={handleRowClick}
          />

          {/* Footer Stats */}
          <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Mostrando <span className="font-semibold text-gray-900">
                  {(currentData || []).length} de {total.current}
                </span> {activeTab}.
              </span>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Ver todas
              </button>
            </div>
            
            {/* Estadísticas */}
            {activeTab === 'solicitudes' ? (
              <div className="flex gap-4">
                <EstadisticasBadge 
                  icon={CreditCard}
                  count={estadisticasSolicitudes.pendientes}
                  label="Sin Pago"
                  variant="gray"
                />
                <EstadisticasBadge 
                  icon={CheckCircle}
                  count={estadisticasSolicitudes.conPago}
                  label="Con Pago"
                  variant="green"
                />
              </div>
            ) : (
              <div className="flex gap-4">
                <EstadisticasBadge 
                  icon={CheckCircle}
                  count={estadisticasCitas.completadas}
                  label="Completadas"
                  variant="green"
                />
                <EstadisticasBadge 
                  icon={Loader2}
                  count={estadisticasCitas.enProceso}
                  label="En Proceso"
                  variant="purple"
                />
                <EstadisticasBadge 
                  icon={Clock}
                  count={estadisticasCitas.pendientes}
                  label="Pendientes"
                  variant="orange"
                />
                <EstadisticasBadge 
                  icon={CalendarCheck}
                  count={estadisticasCitas.confirmadas}
                  label="Confirmadas"
                  variant="blue"
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}