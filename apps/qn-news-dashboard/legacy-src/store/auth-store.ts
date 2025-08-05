import { create } from 'zustand';
import { AuthState, User } from '@/types';
import api from '@/api';
import { jwtDecode } from 'jwt-decode';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  updateUser: (user: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/auth/login', { email, password });
      const { access_token } = response.data;
      
      localStorage.setItem('auth_token', access_token);
      
      // Decode JWT to get user info
      const decoded = jwtDecode<{ sub: string }>(access_token);
      
      // Fetch user data
      const userResponse = await api.get(`/users/${decoded.sub}`);
      
      set({ 
        token: access_token,
        user: userResponse.data,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.detail || 'Failed to login'
      });
      throw error;
    }
  },

  register: async (email: string, username: string, password: string, fullName?: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/auth/register', { 
        email, 
        username, 
        password,
        full_name: fullName
      });
      
      // After registration, log the user in
      await get().login(email, password);
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.detail || 'Failed to register'
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    set({ 
      token: null, 
      user: null, 
      isAuthenticated: false,
      error: null
    });
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        set({ isLoading: false, isAuthenticated: false });
        return false;
      }
      
      // Verify token and get user data
      const response = await api.get('/auth/me');
      
      set({
        user: response.data,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      return true;
    } catch (error) {
      // Token invalid or expired
      localStorage.removeItem('auth_token');
      set({ 
        token: null, 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null
      });
      return false;
    }
  },

  updateUser: async (userData: Partial<User>) => {
    try {
      set({ isLoading: true });
      const { user } = get();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const response = await api.patch(`/users/${user.id}`, userData);
      
      set({
        user: response.data,
        isLoading: false
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.detail || 'Failed to update user'
      });
      throw error;
    }
  }
}));