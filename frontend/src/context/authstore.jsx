import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Added persistence so refresh doesn't log you out immediately
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      updateUser: (updatedData) => set((state) => ({
        user: { ...state.user, ...updatedData }
      })),
      logout: () => {
        try {
          localStorage.removeItem('auth_token');
          // Remove default axios Authorization header if present
          // We lazily require axios to avoid circular imports at module init
          const axios = require('../api/axiosInstance').default;
          if (axios && axios.defaults && axios.defaults.headers) {
            delete axios.defaults.headers.common['Authorization'];
          }
        } catch (e) {
          // ignore
        }
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    }
  )
);

export default useAuthStore;