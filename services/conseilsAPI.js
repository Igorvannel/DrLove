import API from "./api";

// API service for conseils
const conseilsAPI = {
  /**
   * Récupère la liste de tous les conseils
   * @param {Object} params - Paramètres de requête (pagination, filtres, etc.)
   * @returns {Promise<Array>} - Liste des conseils
   */
  getConseils: async (params = {}) => {
    try {
      const response = await API.get('/conseils', { params });
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des conseils:', error);
      throw error;
    }
  },
  
  /**
   * Récupère un conseil spécifique par son ID
   * @param {string} id - ID du conseil
   * @returns {Promise<Object>} - Détails du conseil
   */
  getConseilById: async (id) => {
    try {
      const response = await API.get(`/conseils/${id}`);
      return response;
    } catch (error) {
      console.error(`Erreur lors de la récupération du conseil ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Enregistre une vue sur un conseil
   * @param {string} id - ID du conseil
   * @returns {Promise<Object>} - Réponse de l'API
   */
  recordView: async (id) => {
    try {
      const response = await API.put(`/conseils/${id}/view`);
      return response;
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de la vue pour le conseil ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Like ou unlike un conseil
   * @param {string} id - ID du conseil
   * @param {boolean} liked - Si le conseil est liké ou non
   * @returns {Promise<Object>} - Réponse de l'API
   */
  toggleLike: async (id, liked) => {
    try {
      // Utiliser les query params au lieu du body selon la structure du contrôleur backend
      const response = await API.put(`/conseils/${id}/like?liked=${liked}`);
      return response;
    } catch (error) {
      console.error(`Erreur lors du like/unlike du conseil ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Ajoute un commentaire à un conseil
   * @param {string} tipId - ID du conseil
   * @param {string} text - Texte du commentaire
   * @param {string|null} replyToId - ID du commentaire auquel on répond (optionnel)
   * @returns {Promise<Object>} - Réponse de l'API
   */
  addComment: async (tipId, text, replyToId = null) => {
    try {
      const payload = { text };
      const params = {};
      
      if (replyToId) {
        params.replyToId = replyToId;
      }
      
      // Utiliser l'endpoint correct et passer replyToId en query param
      const response = await API.post(`/tips/${tipId}/comments`, payload, { params });
      return response;
    } catch (error) {
      console.error(`Erreur lors de l'ajout d'un commentaire au conseil ${tipId}:`, error);
      throw error;
    }
  },
  
  /**
   * Like ou unlike un commentaire
   * @param {string} commentId - ID du commentaire
   * @param {boolean} liked - Si le commentaire est liké ou non
   * @returns {Promise<Object>} - Réponse de l'API
   */
  toggleCommentLike: async (commentId, liked) => {
    try {
      // Utiliser les query params au lieu du body selon la structure du contrôleur backend
      const response = await API.put(`/comments/${commentId}/like?liked=${liked}`);
      return response;
    } catch (error) {
      console.error(`Erreur lors du like/unlike du commentaire ${commentId}:`, error);
      throw error;
    }
  },
  
  /**
   * Signale un conseil
   * @param {string} tipId - ID du conseil à signaler
   * @param {string} reason - Raison du signalement
   * @returns {Promise<Object>} - Réponse de l'API
   */
  reportTip: async (tipId, reason) => {
    try {
      const response = await API.post(`/conseils/${tipId}/report`, { reason });
      return response;
    } catch (error) {
      console.error(`Erreur lors du signalement du conseil ${tipId}:`, error);
      throw error;
    }
  },
  
  /**
   * Signale un commentaire
   * @param {string} commentId - ID du commentaire à signaler
   * @param {string} reason - Raison du signalement
   * @returns {Promise<Object>} - Réponse de l'API
   */
  reportComment: async (commentId, reason) => {
    try {
      const response = await API.post(`/comments/${commentId}/report`, { reason });
      return response;
    } catch (error) {
      console.error(`Erreur lors du signalement du commentaire ${commentId}:`, error);
      throw error;
    }
  },
  
  /**
   * Méthode générale pour signaler un contenu (conseil ou commentaire)
   * @param {string} type - Type d'élément à signaler ('conseil' ou 'comment')
   * @param {string} id - ID de l'élément à signaler
   * @param {string} reason - Raison du signalement
   * @returns {Promise<Object>} - Réponse de l'API
   */
  reportContent: async (type, id, reason) => {
    try {
      if (type === 'comment') {
        return await conseilsAPI.reportComment(id, reason);
      } else {
        return await conseilsAPI.reportTip(id, reason);
      }
    } catch (error) {
      console.error(`Erreur lors du signalement du ${type} ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Partage un conseil
   * @param {string} tipId - ID du conseil à partager
   * @param {string} platform - Plateforme de partage (ex: 'facebook', 'twitter', 'email')
   * @returns {Promise<Object>} - Réponse de l'API
   */
  shareConseil: async (tipId, platform) => {
    try {
      const response = await API.post(`/conseils/${tipId}/share`, { platform });
      return response;
    } catch (error) {
      console.error(`Erreur lors du partage du conseil ${tipId}:`, error);
      throw error;
    }
  },
  
  /**
   * Crée un nouveau conseil
   * @param {Object} tipData - Données du conseil à créer
   * @returns {Promise<Object>} - Réponse de l'API
   */
  createConseil: async (tipData) => {
    try {
      const response = await API.post('/conseils', tipData);
      return response;
    } catch (error) {
      console.error('Erreur lors de la création du conseil:', error);
      throw error;
    }
  },
  
  /**
   * Récupère les commentaires pour un conseil
   * @param {string} tipId - ID du conseil
   * @returns {Promise<Array>} - Liste des commentaires
   */
  getComments: async (tipId) => {
    try {
      const response = await API.get(`/tips/${tipId}/comments`);
      return response;
    } catch (error) {
      console.error(`Erreur lors de la récupération des commentaires pour le conseil ${tipId}:`, error);
      throw error;
    }
  }
};

export default conseilsAPI;