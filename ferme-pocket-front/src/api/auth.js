import api from './axios';

// Service d'authentification
export const authService = {
  // Connexion utilisateur
  login: async (email, password) => {
    try {
      const response = await api.post('/login', {
        email,
        password
      });
      
      // L'API retourne les données dans response.data.data
      if (response.data.status === 'success' && response.data.data.token) {
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        console.log('Token sauvegardé:', response.data.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  },

  // Inscription utilisateur
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      
      // L'API retourne les données dans response.data.data
      if (response.data.status === 'success' && response.data.data.token) {
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        console.log('Token sauvegardé:', response.data.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Obtenir le token
  getToken: () => {
    return localStorage.getItem('auth_token');
  }
};

export default authService;
