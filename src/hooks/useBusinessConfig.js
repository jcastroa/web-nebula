// src/hooks/useBusinessConfig.js
import { useState, useEffect, useCallback, useRef } from 'react';
import businessService from '../services/businessService';

export const useBusinessConfig = () => {
    const [negocios, setNegocios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const isMounted = useRef(false);

    // Cargar negocios
    const cargarNegocios = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await businessService.listarNegocios();

            if (result.success) {
                setNegocios(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Error al cargar los negocios');
        } finally {
            setLoading(false);
        }
    }, []);

    // Buscar negocios
    const buscarNegocios = useCallback(async (termino) => {
        if (!termino.trim()) {
            cargarNegocios();
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await businessService.buscarNegocios(termino);

            if (result.success) {
                setNegocios(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Error al buscar negocios');
        } finally {
            setLoading(false);
        }
    }, [cargarNegocios]);

    // Crear negocio
    const crearNegocio = useCallback(async (negocio) => {
        const result = await businessService.crearNegocio(negocio);

        if (result.success) {
            await cargarNegocios();
        }

        return result;
    }, [cargarNegocios]);

    // Actualizar negocio
    const actualizarNegocio = useCallback(async (id, negocio) => {
        const result = await businessService.actualizarNegocio(id, negocio);

        if (result.success) {
            await cargarNegocios();
        }

        return result;
    }, [cargarNegocios]);

    // Cambiar estado del negocio
    const cambiarEstadoNegocio = useCallback(async (id, activo) => {
        const result = await businessService.cambiarEstadoNegocio(id, activo);

        if (result.success) {
            await cargarNegocios();
        }

        return result;
    }, [cargarNegocios]);

    // Activar negocio
    const activarNegocio = useCallback(async (id) => {
        return await cambiarEstadoNegocio(id, true);
    }, [cambiarEstadoNegocio]);

    // Desactivar negocio
    const desactivarNegocio = useCallback(async (id) => {
        return await cambiarEstadoNegocio(id, false);
    }, [cambiarEstadoNegocio]);

    // Efecto inicial para cargar negocios al montar (solo una vez)
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            cargarNegocios();
        }
    }, []); // Sin dependencias - solo se ejecuta al montar

    // Efecto para búsqueda con debounce (solo se ejecuta cuando searchTerm cambia)
    useEffect(() => {
        // Evitar ejecutar en el primer render
        if (!isMounted.current) {
            return;
        }

        const timeoutId = setTimeout(() => {
            if (searchTerm) {
                buscarNegocios(searchTerm);
            } else {
                cargarNegocios();
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]); // Solo depende de searchTerm

    return {
        negocios,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        crearNegocio,
        actualizarNegocio,
        cambiarEstadoNegocio,
        activarNegocio,
        desactivarNegocio,
        cargarNegocios
    };
};
