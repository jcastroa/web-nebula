// components/dashboard/CriticalAlert.jsx
import React, { useEffect } from 'react';
import { AlertCircle, X, Clock, Phone } from 'lucide-react';

export const CriticalAlert = ({ alert, onDismiss, onRefresh }) => {
  useEffect(() => {
    if (alert?.playSound) {
      // Reproducir sonido de alerta
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBDGH0fPTgjMGHm7A7+OZURE');
      audio.play().catch(e => console.log('No se pudo reproducir sonido'));
    }
  }, [alert]);

  if (!alert) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-bounce">
      <div className="bg-red-600 text-white rounded-lg shadow-2xl p-4 min-w-[350px]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 animate-pulse" />
            <h3 className="font-bold text-lg">¡CITAS URGENTES!</h3>
          </div>
          <button
            onClick={onDismiss}
            className="hover:bg-red-700 rounded p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {alert.appointments?.slice(0, 3).map((apt, idx) => (
            <div key={idx} className="bg-red-700 bg-opacity-50 rounded p-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{apt.patient_name || 'Paciente'}</p>
                  <p className="text-sm opacity-90">
                    <Clock className="inline w-3 h-3 mr-1" />
                    {apt.time} - En {Math.floor(apt.minutes_until || 0)} min
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={onRefresh}
          className="mt-3 w-full bg-white text-red-600 py-2 px-4 rounded font-medium hover:bg-red-50 transition-colors"
        >
          Ver todas las citas
        </button>
      </div>
    </div>
  );
};