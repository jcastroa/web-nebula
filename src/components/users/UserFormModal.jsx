import React from 'react';
import { X } from 'lucide-react';
import UserForm from './UserForm';

/**
 * Modal para crear/editar usuarios
 */
const UserFormModal = ({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) => {
  if (!isOpen) return null;

  const handleSubmit = (userData, setFieldErrors) => {
    onSubmit(userData, setFieldErrors);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
            <h2 className="text-xl font-bold text-slate-800">
              {initialData ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <UserForm
              onSubmit={handleSubmit}
              initialData={initialData}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;
