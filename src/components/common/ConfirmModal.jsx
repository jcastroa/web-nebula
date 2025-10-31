import React from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

/**
 * Modal de confirmación reutilizable
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning', // 'warning' | 'danger' | 'success'
  isLoading = false
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      buttonColor: 'bg-amber-600 hover:bg-amber-700'
    },
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      buttonColor: 'bg-red-600 hover:bg-red-700'
    },
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    }
  };

  const style = typeStyles[type];
  const Icon = style.icon;

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
          className="relative bg-white rounded-xl shadow-xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>

          {/* Content */}
          <div className="p-6">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-full ${style.bgColor} ${style.borderColor} border-2 flex items-center justify-center mx-auto mb-4`}>
              <Icon className={`w-6 h-6 ${style.iconColor}`} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-slate-800 text-center mb-2">
              {title}
            </h3>

            {/* Message */}
            <p className="text-slate-600 text-center mb-6">
              {message}
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg
                  hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-colors font-medium
                  disabled:opacity-50 ${style.buttonColor}`}
              >
                {isLoading ? 'Procesando...' : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
