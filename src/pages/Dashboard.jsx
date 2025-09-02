// src/pages/Dashboard.jsx - ACTUALIZADO PARA USAR EL LAYOUT WRAPPER
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, BarChart3, FileText, Database, User, Upload } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    // ❌ YA NO necesitas envolver con DashboardLayout - se aplica automáticamente
    // El LayoutWrapper en App.js ya lo maneja
    <div className="max-w-7xl mx-auto">
      {/* Welcome Message */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
            <span className="text-orange-600 text-lg">👋</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-800">
            ¡Bienvenido {user?.name || user?.username || 'Usuario'}, a Hispro Web v1.0!
          </h1>
        </div>
        <p className="text-gray-600 text-sm">
          Tu Sistema de Información en Salud está aquí para ayudarte a tomar mejores decisiones. 🏥📊
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">+5.2% desde el mes pasado</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reportes</p>
              <p className="text-2xl font-bold text-gray-900">856</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">+12.3% desde el mes pasado</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Archivos</p>
              <p className="text-2xl font-bold text-gray-900">2,847</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">+3.1% desde el mes pasado</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Base de Datos</p>
              <p className="text-2xl font-bold text-gray-900">99.2%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Database className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Sistema saludable</p>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h2>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Nuevo usuario registrado</p>
              <p className="text-xs text-gray-500">Hace 2 minutos</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <Upload className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Archivo importado exitosamente</p>
              <p className="text-xs text-gray-500">Hace 15 minutos</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <BarChart3 className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Reporte generado</p>
              <p className="text-xs text-gray-500">Hace 1 hora</p>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de acceso rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900">Gestionar Usuarios</h3>
          </div>
          <p className="text-sm text-gray-600">Administrar usuarios y permisos del sistema</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900">Ver Reportes</h3>
          </div>
          <p className="text-sm text-gray-600">Acceder a reportes y análisis de datos</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <Upload className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900">Importar Datos</h3>
          </div>
          <p className="text-sm text-gray-600">Cargar nuevos datos al sistema</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;