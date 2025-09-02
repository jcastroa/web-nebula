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

// src/App.js - ACTUALIZADO CON LAYOUT WRAPPER
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layout
import TemplateLayout from './components/layout/TemplateLayout';

// Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Wrapper que aplica el Layout automáticamente a las rutas protegidas
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  
  // Mapear rutas a configuración del menú
  const getPageConfig = () => {
    const path = location.pathname;
    
    const pageConfigs = {
      '/dashboard': { 
        activeMenu: 'dashboard', 
        currentPage: 'Dashboard' 
      },
      '/dashboard/usuarios': { 
        activeMenu: 'usuarios', 
        currentPage: 'Gestión de Usuarios' 
      },
      '/dashboard/roles/gestion': { 
        activeMenu: 'gestion-roles', 
        currentPage: 'Gestión de Roles' 
      },
      '/dashboard/roles/permisos': { 
        activeMenu: 'asignacion-permisos', 
        currentPage: 'Asignación de Permisos' 
      },
      '/dashboard/reportes': { 
        activeMenu: 'reportes', 
        currentPage: 'Reportes' 
      },
      '/dashboard/importar': { 
        activeMenu: 'importar', 
        currentPage: 'Importar Datos' 
      },
      '/dashboard/tableros': { 
        activeMenu: 'tableros', 
        currentPage: 'Tableros de Control' 
      },
      '/dashboard/sistema': { 
        activeMenu: 'sistema', 
        currentPage: 'Configuración del Sistema' 
      }
      // Agregar más rutas aquí según necesites
    };
    
    return pageConfigs[path] || { 
      activeMenu: 'dashboard', 
      currentPage: 'Dashboard' 
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
  
  // ✅ Mostrar loading mientras verifica auth
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

// Rutas públicas SIN Layout (como antes)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // ✅ Mostrar loading mientras verifica auth
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
        
        {/* Rutas adicionales - CON Layout automático (para cuando las agregues) */}
        {/* 
        <Route 
          path="/dashboard/usuarios" 
          element={
            <PrivateRoute>
              <Usuarios />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/dashboard/roles/gestion" 
          element={
            <PrivateRoute>
              <GestionRoles />
            </PrivateRoute>
          } 
        />
        */}
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;