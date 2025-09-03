// src/components/auth/PermissionGuard.jsx
import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

/**
 * Componente para proteger elementos basado en permisos
 * @param {Object} props
 * @param {string} props.module - Nombre del módulo
 * @param {string|string[]} props.action - Acción(es) requerida(s)
 * @param {boolean} props.requireAll - Si requiere todos los permisos (AND) o cualquiera (OR)
 * @param {React.ReactNode} props.children - Contenido a mostrar si tiene permisos
 * @param {React.ReactNode} props.fallback - Contenido a mostrar si NO tiene permisos
 * @param {boolean} props.showFallback - Si mostrar el fallback o simplemente ocultar
 */
const PermissionGuard = ({ 
  module, 
  action = 'READ', 
  requireAll = false,
  children, 
  fallback = null,
  showFallback = false 
}) => {
  const permissions = usePermissions();
  
  // Si no hay datos de permisos, no mostrar nada (aún cargando)
  if (!permissions) {
    return null;
  }
  
  // Verificar permisos
  const hasAccess = () => {
    // Si es super admin, siempre tiene acceso
    if (permissions.isSuperAdmin) return true;
    
    // Si no se especifica módulo, verificar solo la acción global
    if (!module) {
      if (Array.isArray(action)) {
        return requireAll 
          ? permissions.hasAllPermissions(action)
          : permissions.hasAnyPermission(action);
      }
      return permissions.can(action);
    }
    
    // Verificar permisos específicos del módulo
    if (Array.isArray(action)) {
      const modulePermissions = action.map(act => `${module}:${act}`);
      return requireAll 
        ? permissions.hasAllPermissions(modulePermissions)
        : permissions.hasAnyPermission(modulePermissions);
    }
    
    return permissions.hasPermission(module, action);
  };
  
  const canAccess = hasAccess();
  
  if (canAccess) {
    return <>{children}</>;
  }
  
  // Si no tiene acceso
  if (showFallback && fallback) {
    return <>{fallback}</>;
  }
  
  return null;
};

/**
 * Componente específico para proteger rutas de módulos
 */
export const ModuleGuard = ({ module, children, fallback }) => (
  <PermissionGuard 
    module={module} 
    action="READ"
    showFallback={true}
    fallback={fallback || (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">🚫</span>
          </div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Acceso Denegado
          </h2>
          <p className="text-red-600">
            No tienes permisos para acceder al módulo de {module}.
          </p>
        </div>
      </div>
    )}
  >
    {children}
  </PermissionGuard>
);

/**
 * Componente para proteger acciones específicas (botones, enlaces, etc.)
 */
export const ActionGuard = ({ module, action, children, fallback = null }) => (
  <PermissionGuard 
    module={module} 
    action={action}
    showFallback={false}
    fallback={fallback}
  >
    {children}
  </PermissionGuard>
);

/**
 * Componente para mostrar contenido solo a super admins
 */
export const SuperAdminOnly = ({ children, fallback = null }) => {
  const permissions = usePermissions();
  
  if (!permissions) return null;
  
  if (permissions.isSuperAdmin) {
    return <>{children}</>;
  }
  
  return fallback ? <>{fallback}</> : null;
};

/**
 * Componente para mostrar contenido basado en rol
 */
export const RoleGuard = ({ roles = [], children, fallback = null, requireAll = false }) => {
  const permissions = usePermissions();
  
  if (!permissions) return null;
  
  // Si es super admin, siempre tiene acceso
  if (permissions.isSuperAdmin) {
    return <>{children}</>;
  }
  
  // Verificar roles
  const hasRole = () => {
    if (!Array.isArray(roles)) {
      roles = [roles];
    }
    
    const userRoles = permissions.activeRoles || [];
    
    if (requireAll) {
      return roles.every(role => userRoles.includes(role));
    }
    
    return roles.some(role => userRoles.includes(role));
  };
  
  if (hasRole()) {
    return <>{children}</>;
  }
  
  return fallback ? <>{fallback}</> : null;
};

export default PermissionGuard;