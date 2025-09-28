
import React, { useMemo } from "react";
import { CheckCircle, TrendingUp, Timer, Users , AlertOctagon, Clock,PhoneCall,CreditCard } from "lucide-react";

// Componente Skeleton para las tarjetas
function StatCardSkeleton() {
  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-6 shadow-sm">
      <div className="flex-1">
        {/* Skeleton para el número */}
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-2 w-16"></div>
        {/* Skeleton para el título */}
        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
      </div>
      
      {/* Skeleton para el ícono */}
      <div className="p-3 bg-gray-100 rounded-full">
        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

// Componente individual para cada tarjeta
function StatCard({ value, title, icon: Icon, gradientBg, borderColor, iconColor, iconBg, hasValue }) {
  return (
    <div
      className={`
        flex items-center 
        ${gradientBg} 
        border ${borderColor} 
        rounded-lg px-3 py-6 
        shadow-sm
      `}
    >
      <div className="flex-1">
       
          <div className="text-3xl font-bold text-gray-800">
            {value}
          </div>
       
        <div className="text-sm font-medium text-gray-600">
          {title}
        </div>
      </div>

      <div className={`p-3 ${iconBg} rounded-full`}>
        <Icon className={`w-6 h-6 ${iconColor}`} size={20} />
      </div>
    </div>
  );
}

// Componente que renderiza todas las tarjetas con datos dinámicos
export default function StatsCards({  statsData = {}, loading = false }) {

   console.log('\nResultado final:', statsData);
  
  // Calcular estadísticas basadas en los datos reales
  const estadisticas = useMemo(() => {
   if (!statsData || typeof statsData !== 'object') {
  return {
    urgentes: 0,
    proximas: 0,
    por_confirmar: 0,
    sin_pago: 0,
    concluidas: 0
  };
}

   console.log('\nResultado final:', statsData);
    // Filtrar por estados
    const urgentes = statsData.urgentes || 0;
    const proximas =statsData.proximas || 0;//citasData.data.stats.proximas;
    const por_confirmar = statsData.por_confirmar || 0;//citasData.data.stats.por_confirmar;
    const sin_pago = statsData.sin_pago || 0;//citasData.data.stats.sin_pago;
    const concluidas = statsData.concluidas || 0;//citasData.data.stats.concluidas;
    
    return {
      urgentes,
      proximas,
      por_confirmar,
      sin_pago,
      concluidas
    };
  }, [statsData]);

  // Formatear valor con mensaje amigable para ceros
  const formatearValor = (valor) => {
    if (valor === 0) {
      return 'Ninguna';
    }
    return valor.toString();
  };


  // Si está cargando, mostrar skeletons
  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-5 gap-2">
          {[...Array(5)].map((_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Urgentes",
      value: estadisticas.urgentes,
      hasValue: estadisticas.urgentes > 0,
      icon: AlertOctagon,
      gradientBg: "bg-white",
      borderColor: "border-gray-200",
      iconColor: "text-red-600",
      iconBg: "bg-red-100"
    },
    {
      title: "Próximas", 
      value: estadisticas.proximas,
      hasValue: estadisticas.proximas > 0,
      icon: Timer,
      gradientBg: "bg-white",
      borderColor: "border-gray-200",
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100"
    },
    {
      title: "Por Confirmar",
      value: estadisticas.por_confirmar,
      hasValue: estadisticas.por_confirmar > 0,
      icon: PhoneCall,
      gradientBg: "bg-white",
      borderColor: "border-gray-200",
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100"
    },
    {
      title: "Sin pago",
      value: estadisticas.sin_pago,
      hasValue: estadisticas.sin_pago > 0,
      icon: CreditCard,
      gradientBg: "bg-white",
      borderColor: "border-gray-200",
      iconColor: "text-gray-600",
      iconBg: "bg-gray-100/80"
    },
    {
      title: "Concluidas",
      value: estadisticas.concluidas,
      hasValue: estadisticas.concluidas > 0,
      icon: CheckCircle,
      gradientBg: "bg-white",
      borderColor: "border-gray-200",
      iconColor: "text-green-600",
      iconBg: "bg-green-100/80"
    }
  ];

  return (
   <div className="w-full max-w-7xl mx-auto">
  <div className="grid grid-cols-5 gap-2">
    {stats.map((stat, index) => (
      <StatCard key={index} {...stat} />
    ))}
  </div>
</div>
  );
}