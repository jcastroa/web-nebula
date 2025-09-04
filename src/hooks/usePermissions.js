// src/hooks/usePermissions.js
import { useAuth } from '../contexts/AuthContext';
import { useMemo } from 'react';

export const usePermissions = () => {
  const { user } = useAuth();
  
  // Memoizar cálculos de permisos para evitar recalcular en cada render
  const permissions = useMemo(() => {
    if (!user) return null;
    
    return {
      // Información básica del usuario
      userInfo: user.usuario,
      globalRole: user.rol_global,
      isSuperAdmin: user.es_superadmin,
      
      // Permisos y roles
      permissions: user.permisos_lista || [],
      activeRole: user.rol_activo || null,
      
      // Consultorios
      currentConsultorio: user.consultorio_contexto_actual,
      principalConsultorio: user.consultorio_principal,
      lastActiveConsultorio: user.ultimo_consultorio_activo,
      userConsultorios: user.consultorios_usuario || [],
      allConsultorios: user.todos_consultorios || [],
      
      // Menú y módulos
      menuModules: user.menu_modulos || [],
      
      // Funciones de utilidad
      hasPermission: (moduleName, action = 'READ') => {
        if (!user.permisos_lista) return false;
        const permission = `${moduleName}:${action}`;
        return user.permisos_lista.includes(permission) || user.es_superadmin;
      },
      
      hasAnyPermission: (permissions = []) => {
        if (!user.permisos_lista) return false;
        if (user.es_superadmin) return true;
        return permissions.some(permission => user.permisos_lista.includes(permission));
      },
      
      hasAllPermissions: (permissions = []) => {
        if (!user.permisos_lista) return false;
        if (user.es_superadmin) return true;
        return permissions.every(permission => user.permisos_lista.includes(permission));
      },
      
      canAccess: (moduleName) => {
        // Verificar si puede acceder al módulo (cualquier acción)
        if (user.es_superadmin) return true;
        if (!user.permisos_lista) return false;
        
        const modulePermissions = user.permisos_lista.filter(
          permission => permission.startsWith(`${moduleName}:`)
        );
        return modulePermissions.length > 0;
      },
      
      getModulePermissions: (moduleName) => {
        if (!user.permisos_lista) return [];
        return user.permisos_lista
          .filter(permission => permission.startsWith(`${moduleName}:`))
          .map(permission => permission.split(':')[1]);
      },
      
      canCreate: (moduleName) => {
        return user.es_superadmin || user.permisos_lista?.includes(`${moduleName}:CREATE`);
      },
      
      canRead: (moduleName) => {
        return user.es_superadmin || user.permisos_lista?.includes(`${moduleName}:READ`);
      },
      
      canUpdate: (moduleName) => {
        return user.es_superadmin || user.permisos_lista?.includes(`${moduleName}:UPDATE`);
      },
      
      canDelete: (moduleName) => {
        return user.es_superadmin || user.permisos_lista?.includes(`${moduleName}:DELETE`);
      },
      
      // Utilidades para consultorios
      hasConsultorioAccess: (consultorioId) => {
        if (user.es_superadmin) return true;
        if (!consultorioId) return false;
        
        return user.consultorios_usuario?.some(
          consultorio => consultorio.consultorio_id === consultorioId
        );
      },
      
      // Utilidades para el menú
      getAvailableModules: () => {
        return user.menu_modulos?.filter(modulo => {
          // Si es super admin, puede ver todos los módulos
          if (user.es_superadmin) return true;
          
          // Verificar si tiene algún permiso para este módulo
          const hasModulePermission = user.permisos_lista?.some(
            permission => permission.startsWith(`${modulo.nombre}:`)
          );
          
          return hasModulePermission;
        }) || [];
      },
      
      // Función para verificar permisos específicos de acciones
      can: (action, moduleName = null) => {
        if (user.es_superadmin) return true;
        if (!user.permisos_lista) return false;
        
        if (moduleName) {
          return user.permisos_lista.includes(`${moduleName}:${action}`);
        }
        
        // Buscar la acción en todos los módulos
        return user.permisos_lista.some(permission => 
          permission.endsWith(`:${action}`)
        );
      }
    };
  }, [user]);
  
  return permissions;
};

// Hook específico para verificar permisos de forma más directa
export const useHasPermission = (moduleName, action = 'READ') => {
  const permissions = usePermissions();
  
  return useMemo(() => {
    if (!permissions) return false;
    return permissions.hasPermission(moduleName, action);
  }, [permissions, moduleName, action]);
};

// Hook para verificar si es super admin
export const useIsSuperAdmin = () => {
  const permissions = usePermissions();
  return permissions?.isSuperAdmin || false;
};

// Hook para obtener módulos disponibles
export const useAvailableModules = () => {
  const permissions = usePermissions();
  
  return useMemo(() => {
    if (!permissions) return [];
    return permissions.getAvailableModules();
  }, [permissions]);
};