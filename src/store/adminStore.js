import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Admin credentials (in production, this should be handled by a proper backend)
const ADMIN_CREDENTIALS = {
  email: 'admin@albaseet.com',
  password: 'Albaseet@2024'
}

export const useAdminStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      adminEmail: null,
      
      // Login
      login: (email, password) => {
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          set({ isAuthenticated: true, adminEmail: email })
          return { success: true }
        }
        return { success: false, error: 'Invalid credentials' }
      },
      
      // Logout
      logout: () => {
        set({ isAuthenticated: false, adminEmail: null })
      },
      
      // Check if authenticated
      checkAuth: () => get().isAuthenticated,
    }),
    {
      name: 'albaseet-admin',
    }
  )
)
