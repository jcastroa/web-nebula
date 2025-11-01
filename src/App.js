// // src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './contexts/AuthContext';

// // Páginas
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';

// // Rutas protegidas
// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated, isLoading } = useAuth();

//   // ✅ Mostrar loading mientras verifica auth
//   if (isLoading) {
//     return (
//       <div className="min-vh-100 d-flex align-items-center justify-content-center">
//         <div className="text-center">
//           <div className="spinner-border text-primary mb-3"></div>
//           <p className="text-muted">Verificando autenticación...</p>
//         </div>
//       </div>
//     );
//   }

//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// const PublicRoute = ({ children }) => {
//   const { isAuthenticated, isLoading } = useAuth();

//   // ✅ Mostrar loading mientras verifica auth
//   if (isLoading) {
//     return (
//       <div className="min-vh-100 d-flex align-items-center justify-content-center">
//         <div className="text-center">
//           <div className="spinner-border text-primary mb-3"></div>
//           <p className="text-muted">Cargando...</p>
//         </div>
//       </div>
//     );
//   }

//   return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
// };

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Navigate to="/dashboard" replace />} />

//         <Route 
//           path="/login" 
//           element={
//             <PublicRoute>
//               <Login />
//             </PublicRoute>
//           } 
//         />

//         <Route 
//           path="/dashboard" 
//           element={
//             <PrivateRoute>
//               <Dashboard />
//             </PrivateRoute>
//           } 
//         />

//         <Route path="*" element={<Navigate to="/dashboard" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// src/App.js - ACTUALIZADO CON RUTAS DINÁMICAS
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layout
import TemplateLayout from './components/layout/TemplateLayout';

// Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WhatsAppVinculacion from './pages/WhatsAppVinculacion';
import ScheduleConfig from './pages/ScheduleConfig';
import Promociones from './pages/Promociones';
import ConfiguracionPagos from './pages/ConfiguracionPagos';
import ConfiguracionServicios from './pages/ConfiguracionServicios';
import ChatbotConfig from './pages/ChatbotConfig';
import UserBusinessManagement from './pages/UserBusinessManagement';
import BusinessConfig from './pages/BusinessConfig';

// Wrapper que aplica el Layout automáticamente a las rutas protegidas
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  // Función para obtener configuración de página basada en módulos del usuario
  const getPageConfig = () => {
    const path = location.pathname;

    // Dashboard siempre disponible
    if (path === '/dashboard' || path === '/') {
      return {
        activeMenu: 'dashboard',
        currentPage: 'Dashboard'
      };
    }

    // Buscar en los módulos del usuario
    if (user?.menu_modulos) {
      // Buscar módulo que coincida con la ruta actual
      const currentModule = user.menu_modulos.find(modulo =>
        modulo.ruta === path || path.startsWith(modulo.ruta + '/')
      );

      if (currentModule) {
        return {
          activeMenu: currentModule.nombre.toLowerCase().replace(/\s+/g, '-'),
          currentPage: currentModule.nombre
        };
      }

      // Si no encuentra coincidencia exacta, buscar por prefijo de ruta
      const moduleByPrefix = user.menu_modulos.find(modulo =>
        path.startsWith(modulo.ruta.split('/')[1] ? '/' + modulo.ruta.split('/')[1] : modulo.ruta)
      );

      if (moduleByPrefix) {
        return {
          activeMenu: moduleByPrefix.nombre.toLowerCase().replace(/\s+/g, '-'),
          currentPage: moduleByPrefix.nombre
        };
      }
    }

    // Fallback para rutas no encontradas
    return {
      activeMenu: 'dashboard',
      currentPage: 'Página'
    };
  };

  const { activeMenu, currentPage } = getPageConfig();

  return (
    <TemplateLayout activeMenu={activeMenu} currentPage={currentPage}>
      {children}
    </TemplateLayout>
  );
};

// Rutas protegidas CON Layout automático
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading mientras verifica auth
  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3"></div>
          <p className="text-muted">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? (
    <LayoutWrapper>
      {children}
    </LayoutWrapper>
  ) : <Navigate to="/login" replace />;
};

// Rutas públicas SIN Layout
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading mientras verifica auth
  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3"></div>
          <p className="text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// Componente para páginas que aún no están implementadas
const ComingSoon = ({ moduleName }) => (
  <div className="max-w-7xl mx-auto">
    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-blue-600 text-2xl">🚧</span>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {moduleName} - Próximamente
      </h2>
      <p className="text-gray-600">
        Esta funcionalidad está en desarrollo y estará disponible pronto.
      </p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Ruta pública - SIN Layout */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Ruta principal - CON Layout automático */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Rutas dinámicas para los módulos - Páginas temporales */}
        <Route
          path="/citas"
          element={
            <PrivateRoute>
              <ComingSoon moduleName="Citas" />
            </PrivateRoute>
          }
        />

        <Route
          path="/agenda"
          element={
            <PrivateRoute>
              <ComingSoon moduleName="Agenda" />
            </PrivateRoute>
          }
        />

        <Route
          path="/pacientes"
          element={
            <PrivateRoute>
              <ComingSoon moduleName="Pacientes" />
            </PrivateRoute>
          }
        />

        <Route
          path="/historia-clinica"
          element={
            <PrivateRoute>
              <ComingSoon moduleName="Historia Clínica" />
            </PrivateRoute>
          }
        />

        <Route
          path="/pagos"
          element={
            <PrivateRoute>
              <ComingSoon moduleName="Pagos" />
            </PrivateRoute>
          }
        />

        <Route
          path="/reportes"
          element={
            <PrivateRoute>
              <ComingSoon moduleName="Reportes" />
            </PrivateRoute>
          }
        />

        <Route
          path="/configuracion/vincular"
          element={
            <PrivateRoute>
              <WhatsAppVinculacion />
            </PrivateRoute>
          }
        />

        <Route
          path="/configuracion/whatsapp-callback"
          element={
            <PrivateRoute>
              <WhatsAppVinculacion />
            </PrivateRoute>
          }
        />

        <Route
          path="/configuracion/horarios"
          element={
            <PrivateRoute>
              <ScheduleConfig />
              </PrivateRoute>
          }
        />  
            
         <Route
          path="/configuracion/promociones"
          element={
            <PrivateRoute>
              <Promociones />
            </PrivateRoute>
                    }
                  />  
            
            
         <Route
          path="/configuracion/pagos"
          element={
            <PrivateRoute>
              <ConfiguracionPagos />
              </PrivateRoute>
          }
        />  
            
            
         <Route
          path="/configuracion/servicios"
          element={
            <PrivateRoute>
              <ConfiguracionServicios />
            </PrivateRoute>
          }
        />  

         <Route
          path="/configuracion/chatbot"
          element={
            <PrivateRoute>
              <ChatbotConfig />
            </PrivateRoute>
          }
        />  
          <Route
          path="/configuracion/usuarios"
          element={
            <PrivateRoute>
              <UserBusinessManagement />
            </PrivateRoute>
          }
        />  
          <Route
          path="/configuracion/negocios"
          element={
            <PrivateRoute>
              <BusinessConfig />
            </PrivateRoute>
          }
        />

        {/* Catch-all para rutas no encontradas */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;