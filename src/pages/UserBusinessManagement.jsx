import React, { useState, useEffect, useCallback } from 'react';
import { Users, ArrowLeft, CheckCircle, AlertTriangle, X, Plus, Filter } from 'lucide-react';
import UserList from '../components/users/UserList';
import UserFormModal from '../components/users/UserFormModal';
import FiltersModal from '../components/users/FiltersModal';
import BusinessAssignmentForm from '../components/users/BusinessAssignmentForm';
import BusinessAssignmentList from '../components/users/BusinessAssignmentList';
import {
  createUser,
  getUsers,
  updateUser,
  deactivateUser,
  activateUser,
  getRoles,
  createBusinessAssignment,
  getUserAssignments,
  updateBusinessAssignment,
  deactivateBusinessAssignment,
  activateBusinessAssignment
} from '../services/userBusinessService';
import { processValidationErrors } from '../utils/errorUtils';

/**
 * Componente simple para mostrar errores
 */
const ErrorAlert = ({ message, onClose }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <p className="font-semibold text-red-900">{message}</p>
    </div>
    {onClose && (
      <button
        onClick={onClose}
        className="text-red-600 hover:text-red-800 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    )}
  </div>
);

/**
 * Página para gestión de usuarios y asignaciones a negocios
 */
const UserBusinessManagement = () => {
  // Vista actual: 'list' | 'assignments'
  const [currentView, setCurrentView] = useState('list');

  // Estados para el listado de usuarios
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [roles, setRoles] = useState([]);
  const [filters, setFilters] = useState({
    username: '',
    email: '',
    rol_global: '',
    activo: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  });

  // Estados para el modal de formulario de usuario
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSavingUser, setIsSavingUser] = useState(false);

  // Estados para el modal de filtros
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  // Estados para las asignaciones
  const [currentUser, setCurrentUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);
  const [isSavingAssignment, setIsSavingAssignment] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Mensajes globales
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Cargar roles disponibles
   */
  useEffect(() => {
    const fetchRoles = async () => {
      const result = await getRoles();
      if (result.success) {
        setRoles(result.data);
      }
    };
    fetchRoles();
  }, []);

  /**
   * Cargar usuarios con filtros y paginación
   */
  const loadUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    setErrorMessage('');

    const params = {
      page: pagination.currentPage,
      limit: pagination.itemsPerPage,
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      )
    };

    const result = await getUsers(params);

    if (result.success) {
      setUsers(result.data.items || result.data);
      setPagination(prev => ({
        ...prev,
        totalItems: result.data.total || result.data.length
      }));
    } else {
      setErrorMessage('Error al cargar usuarios');
    }

    setIsLoadingUsers(false);
  }, [filters, pagination.currentPage, pagination.itemsPerPage]);

  /**
   * Cargar usuarios al montar y cuando cambien filtros/paginación
   */
  useEffect(() => {
    if (currentView === 'list') {
      loadUsers();
    }
  }, [currentView, loadUsers]);

  /**
   * Limpiar filtros
   */
  const handleClearFilters = () => {
    setFilters({
      username: '',
      email: '',
      rol_global: '',
      activo: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  /**
   * Abrir modal de filtros
   */
  const handleOpenFilters = () => {
    setIsFiltersModalOpen(true);
  };

  /**
   * Cerrar modal de filtros
   */
  const handleCloseFilters = () => {
    setIsFiltersModalOpen(false);
  };

  /**
   * Aplicar filtros desde el modal
   */
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  /**
   * Remover un filtro individual
   */
  const handleRemoveFilter = (filterKey) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: ''
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  /**
   * Cambiar página
   */
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  /**
   * Cambiar items por página
   */
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setPagination(prev => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1
    }));
  };

  /**
   * Crear nuevo usuario
   */
  const handleCreateUser = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
    setSuccessMessage('');
    setErrorMessage('');
  };

  /**
   * Editar usuario
   */
  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
    setSuccessMessage('');
    setErrorMessage('');
  };

  /**
   * Cerrar modal de usuario
   */
  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
    setErrorMessage('');
  };

  /**
   * Guardar usuario (crear o actualizar)
   */
  const handleSaveUser = async (userData, setFieldErrors) => {
    setIsSavingUser(true);
    setErrorMessage('');
    setSuccessMessage('');

    let result;
    if (editingUser) {
      result = await updateUser(editingUser.id, userData);
    } else {
      result = await createUser(userData);
    }

    if (result.success) {
      setSuccessMessage(
        editingUser
          ? 'Usuario actualizado exitosamente'
          : 'Usuario creado exitosamente'
      );

      // Recargar lista de usuarios
      await loadUsers();

      // Cerrar modal
      setIsUserModalOpen(false);
      setEditingUser(null);

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } else {
      const { fieldErrors, generalError } = processValidationErrors(
        result.error,
        result.status
      );

      if (Object.keys(fieldErrors).length > 0) {
        setFieldErrors(fieldErrors);
      }

      if (generalError) {
        setErrorMessage(generalError);
      }
    }

    setIsSavingUser(false);
  };

  /**
   * Activar/Desactivar usuario
   */
  const handleToggleUserStatus = async (user) => {
    const confirmMessage = user.activo
      ? '¿Está seguro de desactivar este usuario? Perderá acceso al sistema.'
      : '¿Está seguro de activar este usuario? Recuperará acceso al sistema.';

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setErrorMessage('');

    const result = user.activo
      ? await deactivateUser(user.id)
      : await activateUser(user.id);

    if (result.success) {
      setSuccessMessage(
        user.activo
          ? 'Usuario desactivado exitosamente'
          : 'Usuario activado exitosamente'
      );

      // Recargar lista de usuarios
      await loadUsers();

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrorMessage(
        user.activo
          ? 'Error al desactivar el usuario'
          : 'Error al activar el usuario'
      );
    }
  };

  /**
   * Gestionar asignaciones de usuario
   */
  const handleManageAssignments = async (user) => {
    setCurrentUser(user);
    setCurrentView('assignments');
    setSuccessMessage('');
    setErrorMessage('');
    await loadAssignments(user.id);
  };

  /**
   * Cargar asignaciones del usuario
   */
  const loadAssignments = useCallback(async (userId) => {
    setIsLoadingAssignments(true);
    setErrorMessage('');

    const result = await getUserAssignments(userId);

    if (result.success) {
      setAssignments(result.data);
    } else {
      setErrorMessage('Error al cargar las asignaciones del usuario');
    }

    setIsLoadingAssignments(false);
  }, []);

  /**
   * Crear o actualizar asignación
   */
  const handleSaveAssignment = async (assignmentData, setFieldErrors) => {
    setIsSavingAssignment(true);
    setErrorMessage('');
    setSuccessMessage('');

    let result;

    if (editingAssignment) {
      const updateData = {
        rol_id: assignmentData.rol_id,
        es_principal: assignmentData.es_principal
      };
      result = await updateBusinessAssignment(editingAssignment.id, updateData);
    } else {
      result = await createBusinessAssignment(assignmentData);
    }

    if (result.success) {
      setSuccessMessage(
        editingAssignment
          ? 'Asignación actualizada exitosamente'
          : 'Asignación creada exitosamente'
      );

      // Recargar asignaciones
      await loadAssignments(currentUser.id);

      // Limpiar formulario de edición
      setEditingAssignment(null);

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      const { fieldErrors, generalError } = processValidationErrors(
        result.error,
        result.status
      );

      if (Object.keys(fieldErrors).length > 0) {
        setFieldErrors(fieldErrors);
      }

      if (generalError) {
        setErrorMessage(generalError);
      }
    }

    setIsSavingAssignment(false);
  };

  /**
   * Editar asignación
   */
  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setErrorMessage('');
    setSuccessMessage('');
  };

  /**
   * Cancelar edición de asignación
   */
  const handleCancelEditAssignment = () => {
    setEditingAssignment(null);
    setErrorMessage('');
  };

  /**
   * Activar/Desactivar asignación
   */
  const handleToggleAssignmentStatus = async (assignment) => {
    const confirmMessage = assignment.activo
      ? '¿Está seguro de desactivar esta asignación? El usuario perderá acceso a este negocio.'
      : '¿Está seguro de activar esta asignación? El usuario recuperará acceso a este negocio.';

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');

    const result = assignment.activo
      ? await deactivateBusinessAssignment(assignment.id)
      : await activateBusinessAssignment(assignment.id);

    if (result.success) {
      setSuccessMessage(
        assignment.activo
          ? 'Asignación desactivada exitosamente'
          : 'Asignación activada exitosamente'
      );

      // Recargar asignaciones
      await loadAssignments(currentUser.id);

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrorMessage(
        assignment.activo
          ? 'Error al desactivar la asignación'
          : 'Error al activar la asignación'
      );
    }
  };

  /**
   * Volver al listado desde asignaciones
   */
  const handleBackToList = () => {
    setCurrentView('list');
    setCurrentUser(null);
    setAssignments([]);
    setEditingAssignment(null);
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {currentView === 'assignments' && (
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al listado
            </button>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Gestión de Usuarios
                </h1>
                <p className="text-slate-600 mt-1">
                  {currentView === 'list' && 'Administrar usuarios y sus asignaciones a negocios'}
                  {currentView === 'assignments' && 'Gestionar asignaciones a negocios'}
                </p>
              </div>
            </div>

            {currentView === 'list' && (
              <div className="flex gap-3">
                <button
                  onClick={handleOpenFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300
                    text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium shadow-sm"
                >
                  <Filter className="w-4 h-4" />
                  Filtros
                </button>
                <button
                  onClick={handleCreateUser}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg
                    hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Usuario
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mensajes globales */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="font-semibold text-green-900">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6">
            <ErrorAlert message={errorMessage} onClose={() => setErrorMessage('')} />
          </div>
        )}

        {/* Contenido según vista actual */}
        <div>
          {/* Vista de listado */}
          {currentView === 'list' && (
            <UserList
              users={users}
              isLoading={isLoadingUsers}
              onEdit={handleEditUser}
              onToggleStatus={handleToggleUserStatus}
              onManageAssignments={handleManageAssignments}
              roles={roles}
              currentPage={pagination.currentPage}
              itemsPerPage={pagination.itemsPerPage}
              totalItems={pagination.totalItems}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              filters={filters}
              onClearFilters={handleClearFilters}
              onRemoveFilter={handleRemoveFilter}
            />
          )}

          {/* Vista de asignaciones */}
          {currentView === 'assignments' && currentUser && (
            <div className="space-y-6">
              {/* Información del usuario */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="font-semibold text-blue-900 mb-3">Usuario:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700 font-medium">Username</p>
                    <p className="text-blue-900">{currentUser.username}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">Nombre</p>
                    <p className="text-blue-900">{currentUser.nombres} {currentUser.apellidos}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">Email</p>
                    <p className="text-blue-900">{currentUser.email}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">Rol Global</p>
                    <p className="text-blue-900">{currentUser.rol_global || 'Sin rol global'}</p>
                  </div>
                </div>
              </div>

              {/* Formulario de asignación */}
              <BusinessAssignmentForm
                userId={currentUser.id}
                userHasGlobalRole={!!currentUser.rol_global}
                currentAssignments={assignments}
                onSubmit={handleSaveAssignment}
                isLoading={isSavingAssignment}
                editingAssignment={editingAssignment}
                onCancelEdit={handleCancelEditAssignment}
              />

              {/* Lista de asignaciones */}
              <BusinessAssignmentList
                assignments={assignments}
                isLoading={isLoadingAssignments}
                onEdit={handleEditAssignment}
                onToggleStatus={handleToggleAssignmentStatus}
              />
            </div>
          )}
        </div>

        {/* Modal de formulario de usuario */}
        <UserFormModal
          isOpen={isUserModalOpen}
          onClose={handleCloseUserModal}
          onSubmit={handleSaveUser}
          initialData={editingUser}
          isLoading={isSavingUser}
        />

        {/* Modal de filtros */}
        <FiltersModal
          isOpen={isFiltersModalOpen}
          onClose={handleCloseFilters}
          onApplyFilters={handleApplyFilters}
          initialFilters={filters}
          roles={roles}
        />
      </div>
    </div>
  );
};

export default UserBusinessManagement;
