import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Helper function to get or generate a device ID
const getDeviceId = async () => {
  try {
    let deviceId = await AsyncStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = 'dev_' + Math.random().toString(36).substring(2, 15);
      await AsyncStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  } catch (error) {
    console.error('Error getting device ID:', error);
    return 'unknown_device';
  }
};

// Create axios instance with default config
const API = axios.create({
  baseURL: 'http://192.168.1.128:4044/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
  },
  timeout: 10000,
});

// Request interceptor for adding token
API.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ajout de l'ID de l'appareil dans les en-têtes
    const deviceId = await getDeviceId();
    config.headers['Device-ID'] = deviceId;
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || 'Une erreur est survenue',
      status: error.response?.status,
      data: error.response?.data
    };
    return Promise.reject(customError);
  }
);

// Auth API service
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await API.post('/auth/signin', {
        email,
        password
      });
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (fullName, email, country, password) => {
    try {
      const response = await API.post('/auth/signup', {
        fullName,
        email,
        country,
        password
      });
      
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await API.get('/users/me');
      return response;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },
  
  // On peut ajouter d'autres méthodes d'authentification ici si nécessaire
  forgotPassword: async (email) => {
    try {
      const response = await API.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },
  
  resetPassword: async (token, password) => {
    try {
      const response = await API.post('/auth/reset-password', { token, password });
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
};

export default API;