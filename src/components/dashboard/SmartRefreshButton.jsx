// components/dashboard/SmartRefreshButton.jsx
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { ActionButton } from '../dashboard/ActionButton';

export function SmartRefreshButton({ 
  onRefresh, 
  isRefreshing, 
  pendingUpdates 
}) {
  // Determinar variante según el tipo de actualización
  const getVariant = () => {
    if (pendingUpdates?.type === 'urgent') return 'danger';
    if (pendingUpdates?.count > 0) return 'warning';
    return 'secondary';
  };
  
  // Texto del botón
  const getButtonText = () => {
    if (isRefreshing) return 'Actualizando...';
    if (pendingUpdates?.type === 'urgent') return '¡Urgente!';
    return 'Actualizar';
  };
  
  return (
    <ActionButton
      onClick={onRefresh}
      icon={RefreshCw}
      variant={getVariant()}
      disabled={isRefreshing}
      badge={pendingUpdates?.count}
      className={pendingUpdates?.type === 'urgent' ? 'animate-pulse' : ''}
    >
      {getButtonText()}
    </ActionButton>
  );
}