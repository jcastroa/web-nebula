import { X, Plus, Search, Calendar, BarChart } from "lucide-react";

export default function QuickActionsDrawer({ open, onClose }) {
  if (!open) return null;

  return (
    <>
      {/* Fondo oscuro */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Drawer lateral */}
      <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg border-l border-gray-200 p-6 flex flex-col z-50 transition-transform">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Acciones rápidas
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Lista de acciones */}
        <div className="space-y-4">

          <button className="flex items-center gap-3 w-full p-3 
                   rounded-lg border border-gray-200 
                   bg-gray-50/50 text-gray-700 font-medium
                   hover:bg-white hover:border-gray-300 hover:text-gray-900
                   focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1
                   active:bg-gray-100
                   transition-all duration-150
                   shadow-sm hover:shadow">
            <Plus className="w-5 h-5 text-blue-600" />
            Nueva Cita Manual
          </button>

          <button className="flex items-center gap-3 w-full p-3 
                   rounded-lg border border-gray-200 
                   bg-gray-50/50 text-gray-700 font-medium
                   hover:bg-white hover:border-gray-300 hover:text-gray-900
                   focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1
                   active:bg-gray-100
                   transition-all duration-150
                   shadow-sm hover:shadow">
            <Search className="w-5 h-5 text-purple-600" />
            Buscar Paciente
          </button>

          <button className="flex items-center gap-3 w-full p-3 
                   rounded-lg border border-gray-200 
                   bg-gray-50/50 text-gray-700 font-medium
                   hover:bg-white hover:border-gray-300 hover:text-gray-900
                   focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1
                   active:bg-gray-100
                   transition-all duration-150
                   shadow-sm hover:shadow">
            <Calendar className="w-5 h-5 text-green-600"  />
            Agenda Semanal
          </button>

          <button className="flex items-center gap-3 w-full p-3 
                   rounded-lg border border-gray-200 
                   bg-gray-50/50 text-gray-700 font-medium
                   hover:bg-white hover:border-gray-300 hover:text-gray-900
                   focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1
                   active:bg-gray-100
                   transition-all duration-150
                   shadow-sm hover:shadow">
            <BarChart className="w-5 h-5 text-orange-600" />
            Reportes
          </button>
        </div>
      </div>
    </>
  );
}
