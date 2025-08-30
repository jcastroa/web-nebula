// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Acciones
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        error: null 
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),

      // Login
      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.post('/auth/login', {
            email,
            password
          });

          const user = response.data.user;
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });

          return { success: true, user };

        } catch (error) {
          const message = error.response?.data?.message || 'Error en login';
          set({ 
            error: message, 
            isLoading: false,
            user: null,
            isAuthenticated: false
          });
          return { success: false, error: message };
        }
      },

      // Verificar autenticación
      checkAuth: async () => {
        try {
          const response = await api.get('/auth/me');
          const user = response.data.user;
          set({ user, isAuthenticated: true });
          return true;
        } catch (error) {
          set({ user: null, isAuthenticated: false });
          return false;
        }
      },

      // Logout
      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.log('Error en logout:', error);
        } finally {
          set({ user: null, isAuthenticated: false, error: null });
        }
      },

      // Reset store
      reset: () => set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      })
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);