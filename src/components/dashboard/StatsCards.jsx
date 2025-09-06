import React from "react";
import { CheckCircle, TrendingUp, Timer, Users } from "lucide-react";

// Componente individual para cada tarjeta
function StatCard({ value, title, icon: Icon, gradientBg, borderColor, iconColor, iconBg }) {
  return (
    <div
      className={`
        flex items-center 
        ${gradientBg} 
        border ${borderColor} 
        rounded-lg px-3 py-6 
        shadow-sm cursor-pointer
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

// Componente que renderiza todas las tarjetas
export default function StatsCards() {
  const stats = [
    {
      title: "Solicitudes Pendientes",
      value: "12",
      icon: Timer,
      gradientBg: "bg-white",
      borderColor: "border-gray-200",
      iconColor: "text-red-600",
      iconBg: "bg-red-100"
    },
    {
      title: "Citas Confirmadas",
      value: "28",
      icon: CheckCircle,
      gradientBg: "bg-white",
      borderColor: "border-gray-200",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100"
    },
    {
      title: "En Atención",
      value: "5",
      icon: Users,
      gradientBg: "bg-white",
      borderColor: "border-gray-200",
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100"
    },
    {
      title: "Ingresos del Día",
      value: "S/ 1,240",
      icon: TrendingUp,
      gradientBg: "bg-white",
      borderColor: "border-gray-300",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100/80"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto ">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
}
