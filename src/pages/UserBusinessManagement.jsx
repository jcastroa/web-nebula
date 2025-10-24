import React, { useState, useCallback } from 'react';
import { Users, ArrowLeft, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserForm from '../components/users/UserForm';
import BusinessAssignmentForm from '../components/users/BusinessAssignmentForm';
import BusinessAssignmentList from '../components/users/BusinessAssignmentList';
import {
  createUser,
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
  const navigate = useNavigate();

  // Estados para el usuario
  const [currentUser, setCurrentUser] = useState(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userError, setUserError] = useState('');
  const [userSuccess, setUserSuccess] = useState('');

  // Estados para las asignaciones
  const [assignments, setAssignments] = useState([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);
  const [isSavingAssignment, setIsSavingAssignment] = useState(false);
  const [assignmentError, setAssignmentError] = useState('');
  const [assignmentSuccess, setAssignmentSuccess] = useState('');
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Paso actual del flujo
  const [currentStep, setCurrentStep] = useState('user'); // 'user' | 'assignments'

  /**
   * Crear nuevo usuario
   */
  const handleCreateUser = async (userData, setFieldErrors) => {
    setIsCreatingUser(true);
    setUserError('');
    setUserSuccess('');

    const result = await createUser(userData);

    if (result.success) {
      setUserSuccess('Usuario creado exitosamente');
      setCurrentUser(result.data);

      // Si el usuario tiene rol global, ir directo al paso de asignaciones (aunque no pueda crear ninguna)
      // Si no tiene rol global, ir al paso de asignaciones
      setCurrentStep('assignments');

      // Cargar asignaciones vacías inicialmente
      setAssignments([]);

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setUserSuccess(''), 3000);
    } else {
      // Procesar errores de validación
      const { fieldErrors, generalError } = processValidationErrors(
        result.error,
        result.status
      );

      if (Object.keys(fieldErrors).length > 0) {
        setFieldErrors(fieldErrors);
      }

      if (generalError) {
        setUserError(generalError);
      }
    }

    setIsCreatingUser(false);
  };

  /**
   * Cargar asignaciones del usuario
   */
  const loadAssignments = useCallback(async (userId) => {
    setIsLoadingAssignments(true);
    setAssignmentError('');

    const result = await getUserAssignments(userId);

    if (result.success) {
      setAssignments(result.data);
    } else {
      setAssignmentError('Error al cargar las asignaciones del usuario');
    }

    setIsLoadingAssignments(false);
  }, []);

  /**
   * Crear o actualizar asignación
   */
  const handleSaveAssignment = async (assignmentData, setFieldErrors) => {
    setIsSavingAssignment(true);
    setAssignmentError('');
    setAssignmentSuccess('');

    let result;

    if (editingAssignment) {
      // Actualizar asignación existente
      const updateData = {
        rol_id: assignmentData.rol_id,
        es_principal: assignmentData.es_principal
      };
      result = await updateBusinessAssignment(editingAssignment.id, updateData);
    } else {
      // Crear nueva asignación
      result = await createBusinessAssignment(assignmentData);
    }

    if (result.success) {
      setAssignmentSuccess(
        editingAssignment
          ? 'Asignación actualizada exitosamente'
          : 'Asignación creada exitosamente'
      );

      // Recargar asignaciones
      await loadAssignments(currentUser.id);

      // Limpiar formulario de edición
      setEditingAssignment(null);

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setAssignmentSuccess(''), 3000);
    } else {
      // Procesar errores de validación
      const { fieldErrors, generalError } = processValidationErrors(
        result.error,
        result.status
      );

      if (Object.keys(fieldErrors).length > 0) {
        setFieldErrors(fieldErrors);
      }

      if (generalError) {
        setAssignmentError(generalError);
      }
    }

    setIsSavingAssignment(false);
  };

  /**
   * Editar asignación
   */
  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setAssignmentError('');
    setAssignmentSuccess('');
  };

  /**
   * Cancelar edición
   */
  const handleCancelEdit = () => {
    setEditingAssignment(null);
    setAssignmentError('');
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

    setAssignmentError('');
    setAssignmentSuccess('');

    const result = assignment.activo
      ? await deactivateBusinessAssignment(assignment.id)
      : await activateBusinessAssignment(assignment.id);

    if (result.success) {
      setAssignmentSuccess(
        assignment.activo
          ? 'Asignación desactivada exitosamente'
          : 'Asignación activada exitosamente'
      );

      // Recargar asignaciones
      await loadAssignments(currentUser.id);

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setAssignmentSuccess(''), 3000);
    } else {
      setAssignmentError(
        assignment.activo
          ? 'Error al desactivar la asignación'
          : 'Error al activar la asignación'
      );
    }
  };

  /**
   * Volver al paso anterior
   */
  const handleBackToUser = () => {
    setCurrentStep('user');
    setCurrentUser(null);
    setAssignments([]);
    setEditingAssignment(null);
    setAssignmentError('');
    setAssignmentSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Gestión de Usuarios y Negocios
              </h1>
              <p className="text-slate-600 mt-1">
                Crear usuarios y asignarlos a negocios con roles específicos
              </p>
            </div>
          </div>
        </div>

        {/* Indicador de pasos */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${currentStep === 'user' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold
                ${currentStep === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-400 text-white'}`}
              >
                1
              </div>
              <span className="font-medium">Crear Usuario</span>
            </div>

            <div className="w-12 h-0.5 bg-slate-300" />

            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${currentStep === 'assignments' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold
                ${currentStep === 'assignments' ? 'bg-blue-600 text-white' : 'bg-slate-400 text-white'}`}
              >
                2
              </div>
              <span className="font-medium">Asignar Negocios</span>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="space-y-6">
          {/* Paso 1: Crear Usuario */}
          {currentStep === 'user' && (
            <>
              {userError && (
                <ErrorAlert message={userError} onClose={() => setUserError('')} />
              )}

              {userSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-900">{userSuccess}</h4>
                    <p className="text-green-700 text-sm mt-1">
                      Ahora puede asignar el usuario a negocios
                    </p>
                  </div>
                </div>
              )}

              <UserForm
                onSubmit={handleCreateUser}
                isLoading={isCreatingUser}
              />
            </>
          )}

          {/* Paso 2: Asignar Negocios */}
          {currentStep === 'assignments' && currentUser && (
            <>
              {/* Información del usuario creado */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="font-semibold text-blue-900 mb-2">Usuario creado:</h3>
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

              {/* Mensajes de éxito/error */}
              {assignmentError && (
                <ErrorAlert message={assignmentError} onClose={() => setAssignmentError('')} />
              )}

              {assignmentSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <p className="font-semibold text-green-900">{assignmentSuccess}</p>
                </div>
              )}

              {/* Formulario de asignación */}
              <BusinessAssignmentForm
                userId={currentUser.id}
                userHasGlobalRole={!!currentUser.rol_global}
                currentAssignments={assignments}
                onSubmit={handleSaveAssignment}
                isLoading={isSavingAssignment}
                editingAssignment={editingAssignment}
                onCancelEdit={handleCancelEdit}
              />

              {/* Lista de asignaciones */}
              <BusinessAssignmentList
                assignments={assignments}
                isLoading={isLoadingAssignments}
                onEdit={handleEditAssignment}
                onToggleStatus={handleToggleAssignmentStatus}
              />

              {/* Botón para crear otro usuario */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleBackToUser}
                  className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700
                    transition-colors flex items-center gap-2 font-medium"
                >
                  <Users className="w-5 h-5" />
                  Crear Otro Usuario
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBusinessManagement;
