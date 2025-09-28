// // components/ActionButton.jsx
// import React from 'react';

// export function ActionButton({ 
//   onClick, 
//   icon: Icon, 
//   children, 
//   variant = 'secondary' 
// }) {
//   const baseClasses = "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors";
//   const variants = {
//     primary: "bg-blue-600 text-white hover:bg-blue-700",
//     secondary: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
//   };

//   return (
//     <button 
//       onClick={onClick}
//       className={`${baseClasses} ${variants[variant]}`}
//     >
//       {Icon && <Icon className="h-4 w-4 mr-2" />}
//       {children}
//     </button>
//   );
// }
// components/ActionButton.jsx - VERSION MEJORADA
import React from 'react';

export function ActionButton({ 
  onClick, 
  icon: Icon, 
  children, 
  variant = 'secondary',
  className = '', // NUEVO: para clases adicionales
  disabled = false, // NUEVO: para deshabilitar
  badge = null, // NUEVO: para mostrar badge de notificaciones
  active = false
}) {
  const baseClasses = "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors relative"; // Agregué 'relative'
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700", // NUEVO: variant danger
    warning: "bg-orange-500 text-white hover:bg-orange-600", // NUEVO: variant warning
    active: "bg-blue-600 text-white hover:bg-blue-700 border-blue-600",
    emerald: "border text-white bg-emerald-600 hover:bg-emerald-700",
  };

  const currentVariant = active ? 'active' : variant;
  const color_badge = variant !== 'danger' ? 'bg-orange-800' : 'bg-red-800';



  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[currentVariant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {Icon && <Icon className={`h-4 w-4 mr-2 ${disabled && variant === 'secondary' ? 'animate-spin' : ''}`} />}
      {children}
      
      {/* BADGE de notificaciones */}
      {badge && badge > 0 && (
        <span className={`absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white ${color_badge} rounded-full border-2 border-white shadow-sm`}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}
