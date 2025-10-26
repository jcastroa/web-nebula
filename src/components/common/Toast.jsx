// src/components/common/Toast.jsx
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'error', onClose, duration = 5000 }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const styles = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: CheckCircle,
            iconColor: 'text-green-500'
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: XCircle,
            iconColor: 'text-red-500'
        },
        warning: {
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            text: 'text-amber-800',
            icon: AlertCircle,
            iconColor: 'text-amber-500'
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: AlertCircle,
            iconColor: 'text-blue-500'
        }
    };

    const style = styles[type] || styles.error;
    const Icon = style.icon;

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div className={`max-w-md rounded-lg border ${style.border} ${style.bg} p-4 shadow-lg`}>
                <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1">
                        <p className={`text-sm font-medium ${style.text}`}>
                            {message}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className={`${style.text} hover:opacity-70 transition-opacity`}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toast;
