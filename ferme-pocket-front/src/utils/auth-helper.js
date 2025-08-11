/**
 * Helper pour gérer l'authentification automatique
 */
import { authService } from '../api/auth';

// Identifiants de l'utilisateur admin pour tests
const ADMIN_CREDENTIALS = {
  email: 'admin@fermepocket.com',
  password: 'admin123'
};

/**
 * S'assurer que l'utilisateur est authentifié
 * Si pas authentifié, tente une connexion automatique avec l'admin
 */
export const ensureAuthenticated = async () => {
  try {
    // Vérifier si déjà authentifié
    if (authService.isAuthenticated()) {
      console.log('Utilisateur déjà authentifié');
      return true;
    }

    console.log('Utilisateur non authentifié, tentative de connexion automatique...');
    
    // Tentative de connexion automatique avec l'admin
    const response = await authService.login(
      ADMIN_CREDENTIALS.email, 
      ADMIN_CREDENTIALS.password
    );

    console.log('Réponse de connexion:', response);

    if (response.status === 'success') {
      console.log('Connexion automatique réussie');
      
      // Vérifier que le token a bien été sauvegardé
      const token = authService.getToken();
      console.log('Token après connexion:', token ? 'Présent' : 'Absent');
      
      return true;
    } else {
      console.error('Échec de la connexion automatique:', response);
      return false;
    }

  } catch (error) {
    console.error('Erreur lors de l\'authentification automatique:', error);
    console.error('Détails de l\'erreur:', error.response?.data || error.message);
    return false;
  }
};

export default { ensureAuthenticated };
