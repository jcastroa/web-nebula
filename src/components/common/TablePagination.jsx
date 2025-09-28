import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export function TablePagination({
  // Datos
  currentData = [],
  total = 0,
  currentPage = 1,
  itemsPerPage = 10,
  
  // Labels
  itemName = "elementos",
  
  // Callbacks
  onPageChange,
  onItemsPerPageChange,
  
  // Configuración
  showItemsPerPage = false,
  showPageInfo = true,
  showNavigation = true,
  itemsPerPageOptions = [5, 10, 25, 50, 100],
  
  // Estilo
  className = "",
  
  // Loading
  loading = false
}) {
  
  // Calcular información de paginación
  const totalPages = Math.ceil(total / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, total);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  
  // Handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && onPageChange) {
      onPageChange(newPage);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newItemsPerPage);
    }
  };

  // Generar números de página visibles
  const getVisiblePages = () => {
    const delta = 2; // Páginas a mostrar a cada lado de la actual
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index);
  };

  const visiblePages = totalPages > 1 ? getVisiblePages() : [];

  if (loading) {
    return (
      <div className={`flex justify-between items-center text-sm text-gray-500 ${className}`}>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="h-8 bg-gray-200 rounded animate-pulse w-64"></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-gray-600 ${className}`}>
      
      {/* Información de elementos */}
      {showPageInfo && (
        <div className="flex items-center gap-4">
          <span>
            Mostrando <span className="font-semibold text-gray-900">
              {total > 0 ? `${startItem}-${endItem}` : '0'} de {total}
            </span> {itemName}.
          </span>
          
          {/* Selector de elementos por página */}
          {showItemsPerPage && (
            <div className="flex items-center gap-2">
              <span>Mostrar:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {itemsPerPageOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Controles de navegación */}
      {showNavigation && totalPages > 1 && (
        <div className="flex items-center gap-1">
          
          {/* Primera página */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={!hasPrevPage}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Primera página"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Página anterior */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Números de página */}
          <div className="flex items-center gap-1 mx-2">
            {visiblePages.map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                disabled={page === '...'}
                className={`
                  px-3 py-1 rounded text-sm font-medium transition-colors
                  ${page === currentPage 
                    ? 'bg-blue-600 text-white' 
                    : page === '...' 
                      ? 'cursor-default text-gray-400'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Página siguiente */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Página siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Última página */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={!hasNextPage}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Última página"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}