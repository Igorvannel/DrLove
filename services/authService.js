import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { authAPI } from './api';

// Clés utilisées pour le stockage local
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

const authService = {
  /**
   * Connexion avec email et mot de passe
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @returns {Promise} - Les données d'authentification
   */
  login: async (email, password) => {
    try {
      // Appel à l'API d'authentification
      const response = await authAPI.login(email, password);
      
      // Vérification de la réponse
      if (!response || !response.token) {
        throw new Error('Réponse d\'authentification invalide');
      }
      
      // Stockage des données d'authentification
      await authService.storeAuthData(response);
      
      return {
        success: true,
        token: response.token,
        type: response.type,
        id: response.id,
        email: response.email,
        roles: response.roles || []
      };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  },
  
  /**
   * Inscription d'un nouvel utilisateur
   * @param {string} fullName - Nom complet de l'utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @param {string} country - Pays de l'utilisateur
   * @param {string} countryCode - Code ISO du pays (optionnel)
   * @returns {Promise} - Les données d'authentification
   */
  register: async (fullName, email, password, country, countryCode = '') => {
    try {
      // Appel à l'API d'inscription
      const response = await authAPI.register(fullName, email, country, password);
      
      // Vérification de la réponse
      if (!response) {
        throw new Error('Réponse d\'inscription invalide');
      }
      
      // Si l'API retourne un token, on stocke les données d'authentification
      if (response.token) {
        await authService.storeAuthData(response);
      }
      
      return {
        success: true,
        token: response.token,
        id: response.id,
        email: response.email,
        fullName: response.fullName,
        country: response.country,
        roles: response.roles || []
      };
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  },

  /**
   * Récupère les informations de l'utilisateur connecté
   * @returns {Promise<Object>} - Données de l'utilisateur
   */
  getCurrentUser: async () => {
    try {
      // Vérifier si un token est disponible
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      
      if (!token) {
        throw new Error('Aucun utilisateur connecté');
      }
      
      // Utilisation de authAPI.getCurrentUser
      const userData = await authAPI.getCurrentUser();
      
      // Stockage des données utilisateur
      if (userData) {
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      }
      
      return userData;
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      
      // Vérifier si l'erreur est une erreur d'authentification (401)
      if (error.status === 401 || 
          (error.response && error.response.status === 401) ||
          error.message.includes('401')) {
        
        // En cas d'erreur 401, tenter de récupérer les données en cache
        const cachedUserData = await AsyncStorage.getItem(USER_DATA_KEY);
        if (cachedUserData) {
          return JSON.parse(cachedUserData);
        }
      }
      
      // Si ce n'est pas une erreur 401 ou s'il n'y a pas de données en cache, propager l'erreur
      throw error;
    }
  },
  
  /**
   * Déconnexion de l'utilisateur
   * @returns {Promise} - Résultat de la déconnexion
   */
  logout: async () => {
    try {
      // Supprimer les données d'authentification locales
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
      
      return { success: true };
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      throw error;
    }
  },
  
  /**
   * Stockage des données d'authentification
   * @param {Object} authData - Données d'authentification
   * @returns {Promise} - Résultat du stockage
   */
  storeAuthData: async (authData) => {
    try {
      const promises = [];
      
      if (authData.token) {
        promises.push(AsyncStorage.setItem(AUTH_TOKEN_KEY, authData.token));
      }
      
      // Stocker les données utilisateur
      if (authData.id) {
        const userData = {
          id: authData.id,
          email: authData.email,
          fullName: authData.fullName,
          country: authData.country,
          roles: authData.roles || []
        };
        promises.push(AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData)));
      }
      
      await Promise.all(promises);
      
      return { success: true };
    } catch (error) {
      console.error('Erreur de stockage des données d\'authentification:', error);
      throw error;
    }
  },
  
  /**
   * Récupération des données d'authentification
   * @returns {Promise} - Données d'authentification stockées
   */
  getAuthData: async () => {
    try {
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(USER_DATA_KEY)
      ]);
      
      return {
        token,
        user: userData ? JSON.parse(userData) : null,
        isAuthenticated: !!token
      };
    } catch (error) {
      console.error('Erreur de récupération des données d\'authentification:', error);
      return {
        token: null,
        user: null,
        isAuthenticated: false
      };
    }
  },
  
  /**
   * Vérification si l'utilisateur est connecté
   * @returns {Promise<boolean>} - Statut d'authentification
   */
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      return !!token;
    } catch (error) {
      console.error('Erreur de vérification d\'authentification:', error);
      return false;
    }
  }
};

export default authService;