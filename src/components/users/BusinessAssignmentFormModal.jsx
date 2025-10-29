import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import BusinessAssignmentForm from './BusinessAssignmentForm';

/**
 * Modal para crear/editar asignaciones de negocio
 */
const BusinessAssignmentFormModal = ({
  isOpen,
  onClose,
  userId,
  userHasGlobalRole,
  currentAssignments,
  onSubmit,
  isLoading,
  editingAssignment,
  onCancelEdit
}) => {
  const [generalError, setGeneralError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (assignmentData, setFieldErrors) => {
    setGeneralError(''); // Limpiar error previo
    onSubmit(assignmentData, setFieldErrors, setGeneralError);
  };

  const handleClose = () => {
    setGeneralError(''); // Limpiar error al cerrar
    if (onCancelEdit) onCancelEdit();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
            <h2 className="text-xl font-bold text-slate-800">
              {editingAssignment ? 'Editar Asignación' : 'Nueva Asignación'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Error general dentro del modal */}
            {generalError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-900">{generalError}</p>
                </div>
                <button
                  onClick={() => setGeneralError('')}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <BusinessAssignmentForm
              userId={userId}
              userHasGlobalRole={userHasGlobalRole}
              currentAssignments={currentAssignments}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              editingAssignment={editingAssignment}
              onCancelEdit={handleClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessAssignmentFormModal;
