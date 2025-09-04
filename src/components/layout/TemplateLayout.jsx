import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Home, Settings, User, LogOut, Users, FileText, Database, Upload, BarChart3, Cog, Building2, Bell, Edit3, MapPin, Check, Calendar, CalendarClock, CreditCard, BarChart2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const TemplateLayout = ({ children, activeMenu = 'dashboard', currentPage = 'Dashboard' }) => {
  const navigate = useNavigate();
  const { user, logout, cambiarConsultorio } = useAuth();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [userDropdown, setUserDropdown] = useState(false);
  const [consultorioModal, setConsultorioModal] = useState(false);
  const [isChangingConsultorio, setIsChangingConsultorio] = useState(false);


  // ✅ Selección inicial inteligente basada en el usuario actual
  const [selectedConsultorio, setSelectedConsultorio] = useState(() => {
    return user?.ultimo_consultorio_activo ||
      user?.consultorio_contexto_actual || 
           user?.consultorio_principal?.id ;
  });

  // Mapeo de iconos por nombre
  const iconMap = {
    Home,
    Calendar,
    CalendarClock,
    Users,
    FileText,
    CreditCard,
    BarChart2,
    BarChart3,
    Settings,
    Cog,
    Database,
    Upload,
    User,
    Building2
  };

  // Lista de consultorios - ahora usando datos reales del usuario
  const consultorios = useMemo(() => {
    if (user?.consultorios_usuario && user.consultorios_usuario.length > 0) {
      return user.consultorios_usuario.map(consultorio => ({
        id: consultorio.consultorio_id,
        name: consultorio.nombre,
        location: consultorio.direccion || 'Sin dirección'
      }));
    }

    // Si no hay consultorios específicos, usar todos los consultorios disponibles
    if (user?.todos_consultorios && user.todos_consultorios.length > 0) {
      return user.todos_consultorios.map(consultorio => ({
        id: consultorio.consultorio_id,
        name: consultorio.nombre,
        location: consultorio.direccion || 'Sin dirección'
      }));
    }

    // Fallback para cuando no hay consultorios
    return [
      { id: 'general', name: 'Consultorio General', location: 'Principal' }
    ];
  }, [user?.consultorios_usuario, user?.todos_consultorios]);

  // Generar menú dinámicamente desde los datos del usuario
  const menuItems = useMemo(() => {
    if (!user?.menu_modulos || user.menu_modulos.length === 0) {
      // Fallback al dashboard si no hay módulos
      return [{
        id: 'dashboard',
        label: 'Dashboard',
        icon: Home,
        route: '/dashboard',
        submenu: null,
        orden: 0
      }];
    }

    // Construir menú dinámico
    const dynamicMenu = [];

    // Siempre agregar Dashboard al inicio
    dynamicMenu.push({
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      route: '/dashboard',
      submenu: null,
      orden: 0
    });

    // Procesar módulos del usuario
    user.menu_modulos
      .sort((a, b) => a.orden - b.orden) // Ordenar por campo orden
      .forEach(modulo => {
        const IconComponent = iconMap[modulo.icono] || Settings; // Fallback a Settings si no encuentra el icono

        // Determinar si es un módulo padre o hijo
        if (!modulo.modulo_padre_id) {
          // Es un módulo principal
          const menuItem = {
            id: modulo.nombre.toLowerCase().replace(/\s+/g, '-'),
            label: modulo.nombre,
            icon: IconComponent,
            route: modulo.ruta,
            submenu: null,
            orden: modulo.orden,
            modulo_id: modulo.modulo_id
          };

          // Buscar submódulos hijos
          const submodulos = user.menu_modulos.filter(
            sub => sub.modulo_padre_id === modulo.modulo_id
          ).sort((a, b) => a.orden - b.orden);

          if (submodulos.length > 0) {
            menuItem.submenu = submodulos.map(submodulo => ({
              id: submodulo.nombre.toLowerCase().replace(/\s+/g, '-'),
              label: submodulo.nombre,
              route: submodulo.ruta,
              modulo_id: submodulo.modulo_id
            }));
          }

          dynamicMenu.push(menuItem);
        }
      });

    return dynamicMenu.sort((a, b) => a.orden - b.orden);
  }, [user?.menu_modulos]);

  // Verificar permisos para mostrar elementos del menú
  const hasPermission = (moduleName, action = 'READ') => {
    if (!user?.permisos_lista) return false;
    const permission = `${moduleName}:${action}`;
    return user.permisos_lista.includes(permission) || user.es_superadmin;
  };

  const toggleSubmenu = (menuId) => {
    setOpenSubmenu(openSubmenu === menuId ? null : menuId);
  };

  const handleMenuClick = (menuId, route = null) => {
    if (route) {
      navigate(route);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // Obtener iniciales del usuario
  const getUserInitials = () => {
    if (user?.usuario?.first_name && user?.usuario?.last_name) {
      return (user.usuario.first_name.charAt(0) + user.usuario.last_name.charAt(0)).toUpperCase();
    }
    if (user?.usuario?.username) {
      return user.usuario.username.substring(0, 2).toUpperCase();
    }
    if (user?.usuario?.email) {
      return user.usuario.email.substring(0, 2).toUpperCase();
    }
    return 'US';
  };

  const getUserDisplayName = () => {
    if (user?.usuario?.first_name && user?.usuario?.last_name) {
      return `${user.usuario.first_name} ${user.usuario.last_name}`;
    }
    return user?.usuario?.username || user?.usuario?.email || 'Usuario';
  };

  const getSelectedConsultorioInfo = () => {
    // ✅ PRIMERO: Obtener el ID del consultorio actual
    const currentConsultorioId = user?.ultimo_consultorio_activo ||
      user?.consultorio_contexto_actual ||
      user?.consultorio_principal?.id;

      console.log('🏥 Consultorios disponibles:', consultorios);
      console.log('🏥 Consultorio seleccionado:', selectedConsultorio);

    // ✅ SEGUNDO: Buscar el objeto completo en el array de consultorios
    if (currentConsultorioId) {
      const currentConsultorio = consultorios.find(c => c.id === currentConsultorioId);

      if (currentConsultorio) {
        return {
          id: currentConsultorio.id,
          name: currentConsultorio.name,
          location: currentConsultorio.location
        };
      }
    }

    // Fallback a la lista de consultorios disponibles
    const consultorio = consultorios.find(c => c.id === selectedConsultorio);
    return consultorio || consultorios[0] || { name: 'Sin consultorio', location: '' };
  };

  const getCurrentRoleName = () => {
    // Si es super admin, mostrar rol global
    if (user?.es_superadmin) {
      return user?.rol_global?.nombre || 'Super Admin';
    }

    // Obtener el ID del consultorio actual
    const currentConsultorioId = user?.ultimo_consultorio_activo ||
                                 user?.consultorio_contexto_actual;
    
    // Buscar el rol específico para ese consultorio
    if (currentConsultorioId && user?.consultorios_usuario) {
      const consultorioData = user.consultorios_usuario.find(
        c => c.consultorio_id === currentConsultorioId
      );
      
      if (consultorioData?.rol_nombre) {
        return consultorioData.rol_nombre;
      }
    }
    
    // Fallback al rol global si no encuentra rol específico
    return user?.rol_global?.nombre || 'Usuario';
  };

  const handleConsultorioChange = async (consultorioId) => {
    if (isChangingConsultorio) return; // Evitar múltiples clicks

    setIsChangingConsultorio(true);

    try {
      console.log('🏥 Cambiando a consultorio:', consultorioId);

      const result = await cambiarConsultorio(consultorioId);

      if (result.success) {
        console.log('✅ Consultorio cambiado exitosamente');

        // Actualizar selección local
        setSelectedConsultorio(consultorioId);

        // Cerrar modal
        setConsultorioModal(false);

        // Opcional: Mostrar notificación de éxito
        // toast.success('Consultorio cambiado exitosamente');

      } else {
        console.error('❌ Error cambiando consultorio:', result.error);
        // Opcional: Mostrar notificación de error
        // toast.error(result.error || 'Error cambiando consultorio');
      }

    } catch (error) {
      console.error('💥 Error inesperado:', error);
      // toast.error('Error inesperado cambiando consultorio');
    } finally {
      setIsChangingConsultorio(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col h-screen overflow-hidden">
        {/* Logo */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center h-8">
            <div className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <span className="text-gray-800 font-semibold">NEBULA</span>
          </div>
        </div>

        {/* Menu dinámico - con scroll interno */}
        <nav className="py-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            // Verificar permisos para el módulo (excepto dashboard)
            const canAccess = item.id === 'dashboard' || hasPermission(item.label);

            if (!canAccess) return null;

            return (
              <div key={item.id} className="mb-0">
                <div
                  className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-all duration-200 ${activeMenu === item.id
                      ? 'bg-blue-50 text-blue-600 border-r-3 border-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  onClick={() => {
                    if (item.submenu) {
                      toggleSubmenu(item.id);
                    } else {
                      handleMenuClick(item.id, item.route);
                      setOpenSubmenu(null);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <item.icon className="w-4 h-4 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.submenu && (
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${openSubmenu === item.id ? 'rotate-90' : ''
                        }`}
                    />
                  )}
                </div>

                {/* Submenu */}
                {item.submenu && openSubmenu === item.id && (
                  <div className="bg-gray-25">
                    {item.submenu.map((subItem) => {
                      // También verificar permisos en submenu
                      const canAccessSub = hasPermission(subItem.label);
                      if (!canAccessSub) return null;

                      return (
                        <div
                          key={subItem.id}
                          className={`flex items-center pl-4 pr-4 py-2 text-sm cursor-pointer transition-colors ${activeMenu === subItem.id
                              ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600 font-medium'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                          onClick={() => handleMenuClick(subItem.id, subItem.route)}
                        >
                          <div className="w-1 h-1 bg-current rounded-full mr-3 ml-6 opacity-60"></div>
                          <span>{subItem.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom User Section */}
        <div className="border-t border-gray-200 p-4 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{getUserInitials()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{getUserDisplayName()}</p>
                <p className="text-xs text-blue-600 truncate">{getCurrentRoleName()}</p>
              </div>
            </div>
            <button
              className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Cerrar sesión"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 flex-shrink-0">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-semibold text-gray-800">{currentPage}</h1>

              {/* Selector de Consultorio */}
              {consultorios.length > 1 && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg px-3 py-1.5 shadow-sm">
                    <Building2 className="w-4 h-4 mr-2 text-blue-700" />
                    <span className="font-semibold text-blue-800 text-sm">{getSelectedConsultorioInfo().name}</span>
                    <button
                      onClick={() => setConsultorioModal(true)}
                      className="ml-2 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded transition-colors"
                      title="Cambiar consultorio"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {/* Notificaciones */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setUserDropdown(!userDropdown)}
                  title={`${getUserDisplayName()} - ${user?.usuario?.email}`}
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{getUserInitials()}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
                </button>

                {/* Dropdown Menu */}
                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">{getUserInitials()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{getUserDisplayName()}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.usuario?.email}</p>
                          <p className="text-xs text-blue-600 truncate">{getCurrentRoleName()}</p>
                        </div>
                      </div>
                    </div>

                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors">
                      <User className="w-4 h-4 mr-3" />
                      Perfil
                    </button>
                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors">
                      <Settings className="w-4 h-4 mr-3" />
                      Configuración
                    </button>
                    <hr className="my-2 border-gray-200" />
                    <button
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 w-full text-left transition-colors"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Modal de Selección de Consultorio */}
        {consultorioModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-800">Seleccionar Consultorio</h3>
                  <button
                    onClick={() => setConsultorioModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {consultorios.map((consultorio) => (
                    <div
                      key={consultorio.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedConsultorio === consultorio.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                        } ${isChangingConsultorio ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => {
                        if (!isChangingConsultorio) {
                          handleConsultorioChange(consultorio.id);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Building2 className={`w-5 h-5 ${selectedConsultorio === consultorio.id ? 'text-blue-600' : 'text-gray-400'
                            }`} />
                          <div>
                            <p className={`font-medium ${selectedConsultorio === consultorio.id ? 'text-blue-800' : 'text-gray-800'
                              }`}>
                              {consultorio.name}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {consultorio.location}
                            </p>
                          </div>
                        </div>
                        {isChangingConsultorio && selectedConsultorio === consultorio.id ? (
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : selectedConsultorio === consultorio.id ? (
                          <Check className="w-5 h-5 text-blue-600" />
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>


                {/* Texto informativo durante el cambio */}
                {isChangingConsultorio && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 text-center">
                      Cambiando consultorio... Por favor espera.
                    </p>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Overlay for dropdowns and modal */}
      {(userDropdown || consultorioModal) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setUserDropdown(false);
            if (!consultorioModal) setConsultorioModal(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default TemplateLayout;