import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Home, Settings, User, LogOut, Users, FileText, Database, Upload, BarChart3, Cog, Building2, Bell, Edit3, MapPin, Check } from 'lucide-react';

// Simulando contextos para el ejemplo
const useAuth = () => ({
  user: { 
    name: 'Dr. Juan Martín Castro',
    email: 'jmartincastroa@gmail.com',
    username: '71642131'
  },
  logout: () => console.log('Logout')
});

const useNavigate = () => (path) => console.log(`Navigate to: ${path}`);

const TemplateLayout = ({ children, activeMenu = 'dashboard', currentPage = 'Dashboard' }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [userDropdown, setUserDropdown] = useState(false);
  const [selectedConsultorio, setSelectedConsultorio] = useState('consultorio-1');
  const [consultorioModal, setConsultorioModal] = useState(false);

  // Lista de consultorios - personaliza según tu sistema
  const consultorios = [
    { id: 'consultorio-1', name: 'Consultorio General', location: 'Piso 1 - A' },
    { id: 'consultorio-2', name: 'Consultorio Pediatría', location: 'Piso 2 - B' },
    { id: 'consultorio-3', name: 'Consultorio Cardiología', location: 'Piso 3 - C' },
    { id: 'consultorio-4', name: 'Consultorio Emergencia', location: 'Piso 1 - E' }
  ];

  // Configuración del menú
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      route: '/dashboard',
      submenu: null
    },
    {
      id: 'roles',
      label: 'Roles',
      icon: Users,
      submenu: [
        { id: 'gestion-roles', label: 'Gestión de Roles', route: '/dashboard/roles/gestion' },
        { id: 'asignacion-permisos', label: 'Asignación Permisos', route: '/dashboard/roles/permisos' }
      ]
    },
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: User,
      route: '/dashboard/usuarios',
      submenu: null
    },
    {
      id: 'importar',
      label: 'Importar',
      icon: Upload,
      route: '/dashboard/importar',
      submenu: null
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: BarChart3,
      route: '/dashboard/reportes',
      submenu: null
    },
    {
      id: 'tableros',
      label: 'Tableros',
      icon: Database,
      route: '/dashboard/tableros',
      submenu: null
    },
    {
      id: 'sistema',
      label: 'Sistema',
      icon: Cog,
      route: '/dashboard/sistema',
      submenu: null
    }
  ];

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

  // Obtener iniciales del usuario (2 del primer nombre + 1 del apellido)
  const getUserInitials = () => {
    if (user?.name) {
      const nameParts = user.name.trim().split(' ');
      if (nameParts.length >= 2) {
        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1];
        return (firstName.substring(0, 2) + lastName.substring(0, 1)).toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'US';
  };

  const getUserDisplayName = () => {
    return user?.name || user?.username || user?.email || 'Usuario';
  };

  const getSelectedConsultorioInfo = () => {
    return consultorios.find(c => c.id === selectedConsultorio) || consultorios[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden"> {/* Agregado overflow-hidden */}
      {/* Sidebar */}
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col h-screen overflow-hidden"> {/* Agregado overflow-hidden */}
        {/* Logo */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0"> {/* Agregado flex-shrink-0 */}
          <div className="flex items-center h-8">
            <div className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            <span className="text-gray-800 font-semibold">HISPRO</span>
          </div>
        </div>


        
        {/* Menu - con scroll interno */}
        <nav className="py-1 flex-1 overflow-y-auto"> {/* Agregado overflow-y-auto */}
          {menuItems.map((item) => (
            <div key={item.id} className="mb-0">
              <div
                className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-all duration-200 ${
                  activeMenu === item.id 
                    ? 'bg-blue-50 text-blue-600 border-r-3 border-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`} /* Removido: || (item.submenu && openSubmenu === item.id) */
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
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openSubmenu === item.id ? 'rotate-90' : ''
                    }`}
                  />
                )}
              </div>
              
              {/* Submenu */}
              {item.submenu && openSubmenu === item.id && (
                <div className="bg-gray-25"> {/* Agregado fondo sutil para submenú */}
                  {item.submenu.map((subItem) => (
                    <div
                      key={subItem.id}
                      className={`flex items-center pl-4 pr-4 py-2 text-sm cursor-pointer transition-colors ${
                        activeMenu === subItem.id
                          ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600 font-medium'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => handleMenuClick(subItem.id, subItem.route)}
                    >
                      <div className="w-1 h-1 bg-current rounded-full mr-3 ml-6 opacity-60"></div>
                      <span>{subItem.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        
        {/* Bottom User Section */}
         <div className="border-t border-gray-200 p-4 mt-auto">
          <div className="flex items-center justify-between">
            {/* Solo avatar y nombre */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{getUserInitials()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{getUserDisplayName()}</p>
              </div>
            </div>
            {/* Botón de logout más grande */}
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
      <div className="flex-1 flex flex-col h-screen overflow-hidden"> {/* Agregado overflow-hidden */}
        {/* Header Simplificado */}
        <header className="bg-white border-b border-gray-200 px-6 flex-shrink-0">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-semibold text-gray-800">{currentPage}</h1>
              
              {/* Selector de Consultorio como Label con Modal */}
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
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Icono de Notificaciones */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                {/* Badge de notificaciones */}
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
            
            {/* User Menu - Solo Avatar */}
            <div className="relative">
              <button
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setUserDropdown(!userDropdown)}
                title={`${getUserDisplayName()} - ${user?.email}`}
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{getUserInitials()}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
              </button>
              
              {/* Dropdown Menu */}
              {userDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* Info del usuario en dropdown */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">{getUserInitials()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{getUserDisplayName()}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        <p className="text-xs text-blue-600 truncate">{getSelectedConsultorioInfo().name}</p>
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
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedConsultorio === consultorio.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                      }`}
                      onClick={() => {
                        setSelectedConsultorio(consultorio.id);
                        setConsultorioModal(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Building2 className={`w-5 h-5 ${
                            selectedConsultorio === consultorio.id ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <div>
                            <p className={`font-medium ${
                              selectedConsultorio === consultorio.id ? 'text-blue-800' : 'text-gray-800'
                            }`}>
                              {consultorio.name}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {consultorio.location}
                            </p>
                          </div>
                        </div>
                        {selectedConsultorio === consultorio.id && (
                          <Check className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
            if (!consultorioModal) setConsultorioModal(false); // No cerrar modal con overlay
          }}
        ></div>
      )}
    </div>
  );
};

export default TemplateLayout;