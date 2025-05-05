import API from "./api";

// Fonction utilitaire pour mapper les noms de catégories aux icônes
function getCategoryIconFromName(categoryName) {
  // Mapper les noms de catégories aux icônes FontAwesome
  const nameToIconMap = {
    'Relations': 'heart',
    'Relation': 'heart',
    'Motivation': 'bolt',
    'Bien-être': 'leaf',
    'Bien être': 'leaf',
    'Santé': 'heartbeat',
    'Éducation': 'book',
    'Education': 'book',
    'Conseils': 'lightbulb-o',
    'Spiritualité': 'sun-o'
    // Ajouter d'autres mappages au besoin
  };

  // Recherche insensible à la casse et aux accents
  const normalizedName = categoryName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  for (const [key, value] of Object.entries(nameToIconMap)) {
    const normalizedKey = key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (normalizedName.includes(normalizedKey)) {
      return value;
    }
  }
  
  // Icône par défaut si aucune correspondance n'est trouvée
  return 'comments';
}

// API service for forum
const forumAPI = {
  /**
   * Récupère la liste des posts avec filtrage et pagination optionnels
   * @param {Object} params - Paramètres de filtrage et pagination
   * @param {string} params.category - Filtrer par catégorie
   * @param {string} params.search - Terme de recherche
   * @param {number} params.page - Numéro de page
   * @param {number} params.limit - Nombre d'éléments par page
   * @returns {Promise<Array>} - La liste des posts filtrés
   */


  getPosts: async (params = {}) => {
    try {
      console.log('API: Tentative de récupération des posts avec paramètres:', params);
      const response = await API.get('/forum/posts', { params });
      console.log('API: Réponse API posts:', response);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des posts:', error);
      throw error;
    }
  },
  /**
   * Récupère un post spécifique avec ses détails complets
   * @param {string} postId - ID du post à récupérer
   * @returns {Promise<Object>} - Le post avec ses détails
   */
  getPostById: async (postId) => {
    try {
      const response = await API.get(`/forum/posts/${postId}`);
      return response;
    } catch (error) {
      console.error(`Erreur lors de la récupération du post ${postId}:`, error);
      throw error;
    }
  },

  /**
   * Crée un nouveau post
   * @param {Object} postData - Données du post à créer
   * @param {string} postData.title - Titre du post
   * @param {string} postData.content - Contenu du post
   * @param {string|number} postData.category - Catégorie du post
   * @param {File} [postData.image] - Image optionnelle à attacher au post
   * @returns {Promise<Object>} - Le post créé
   */
  createPost: async (postData) => {
    try {
      // Créer une copie des données du post
      let postDataCopy = { ...postData };
      
      // S'assurer que categoryId est un nombre
      if (postDataCopy.category) {
        // Si category est une chaîne mais contient un nombre, le convertir
        if (typeof postDataCopy.category === 'string' && !isNaN(postDataCopy.category)) {
          postDataCopy.categoryId = parseInt(postDataCopy.category, 10);
        } 
        // Si c'est déjà un nombre, l'utiliser directement
        else if (typeof postDataCopy.category === 'number') {
          postDataCopy.categoryId = postDataCopy.category;
        }
        // Si c'est une chaîne textuelle comme "relationships", rechercher l'ID correspondant
        else {
          // Logique pour mapper les IDs textuels aux IDs numériques
          const categoryMapping = {
            'relationships': 1, // Spiritualité
            'education': 2,     // Éducation
            'wellness': 4,      // Bien-être
            'motivation': 5,    // Motivation
            // Ajouter d'autres mappings si nécessaire
          };
          
          postDataCopy.categoryId = categoryMapping[postDataCopy.category] || 1; // ID par défaut si non trouvé
        }
        
        // Supprimer la propriété category, nous utilisons maintenant categoryId
        delete postDataCopy.category;
      }
      
      let data = postDataCopy;
      let config = {};
      
      if (postDataCopy.image) {
        data = new FormData();
        Object.keys(postDataCopy).forEach(key => {
          if (key === 'image') {
            data.append('image', postDataCopy[key]);
          } else {
            data.append(key, postDataCopy[key]);
          }
        });
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }
      
      const response = await API.post('/forum/posts', data, config);
      return response;
    } catch (error) {
      console.error('Erreur lors de la création du post:', error);
      throw error;
    }
  },

  /**
   * Met à jour un post existant
   * @param {string} postId - ID du post à mettre à jour
   * @param {Object} postData - Nouvelles données du post
   * @returns {Promise<Object>} - Le post mis à jour
   */
  updatePost: async (postId, postData) => {
    try {
      // Même logique que pour createPost pour gérer les images
      let data = postData;
      let config = {};
      
      if (postData.image) {
        data = new FormData();
        Object.keys(postData).forEach(key => {
          if (key === 'image') {
            data.append('image', postData.image);
          } else {
            data.append(key, postData[key]);
          }
        });
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }
      
      const response = await API.put(`/forum/posts/${postId}`, data, config);
      return response;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du post ${postId}:`, error);
      throw error;
    }
  },

  /**
   * Supprime un post
   * @param {string} postId - ID du post à supprimer
   * @returns {Promise<Object>} - Confirmation de suppression
   */
  deletePost: async (postId) => {
    try {
      const response = await API.delete(`/forum/posts/${postId}`);
      return response;
    } catch (error) {
      console.error(`Erreur lors de la suppression du post ${postId}:`, error);
      throw error;
    }
  },

  /**
   * Aime (like) un post
   * @param {string} postId - ID du post à liker
   * @param {boolean} liked - Si le post est liké ou non
   * @returns {Promise<Object>} - Le nombre mis à jour de likes
   */
  toggleLike: async (postId, liked) => {
    try {
      const response = await API.put(`/forum/posts/${postId}/like`, { liked });
      return response;
    } catch (error) {
      console.error(`Erreur lors du like/unlike du post ${postId}:`, error);
      throw error;
    }
  },

  /**
   * Récupère les commentaires d'un post
   * @param {string} postId - ID du post
   * @returns {Promise<Array>} - Liste des commentaires
   */
  getComments: async (postId) => {
    try {
      const response = await API.get(`/forum/posts/${postId}/comments`);
      return response;
    } catch (error) {
      console.error(`Erreur lors de la récupération des commentaires du post ${postId}:`, error);
      throw error;
    }
  },

  /**
   * Ajoute un commentaire à un post
   * @param {string} postId - ID du post
   * @param {string} text - Texte du commentaire
   * @param {string|null} replyToId - ID du commentaire auquel on répond (optionnel)
   * @returns {Promise<Object>} - Le commentaire créé
   */
  addComment: async (postId, text, replyToId = null) => {
    try {
      const payload = { text };
      
      if (replyToId) {
        payload.replyTo = replyToId;
      }
      
      const response = await API.post(`/forum/posts/${postId}/comments`, payload);
      return response;
    } catch (error) {
      console.error(`Erreur lors de l'ajout d'un commentaire au post ${postId}:`, error);
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
      const response = await API.put(`/forum/comments/${commentId}/like`, { liked });
      return response;
    } catch (error) {
      console.error(`Erreur lors du like/unlike du commentaire ${commentId}:`, error);
      throw error;
    }
  },

  /**
   * Récupère les catégories disponibles
   * @returns {Promise<Array>} - Liste des catégories
   */
  getCategories: async () => {
    try {
      const response = await API.get('/forum/categories');
      
      // Vérifier que response.data existe et est un tableau non vide
      const categoriesData = response && response.data && Array.isArray(response.data) && response.data.length > 1
        ? response.data 
        : [];
      
      // Si l'API ne retourne que la catégorie "Tous" ou aucune catégorie, utilisez les catégories par défaut
      if (categoriesData.length <= 1) {
        console.log('Utilisation des catégories par défaut car l\'API n\'a pas retourné de catégories');
        
        return {
          data: [
            { id: 'all', name: 'Tous', icon: 'comments' },
            { id: 1, name: 'Spiritualité', icon: 'sun-o' },
            { id: 2, name: 'Éducation', icon: 'book' },
            { id: 3, name: 'Santé', icon: 'heartbeat' },
            { id: 4, name: 'Bien-être', icon: 'leaf' },
            { id: 5, name: 'Motivation', icon: 'bolt' },
            { id: 6, name: 'Conseils', icon: 'lightbulb-o' },
          ]
        };
      }
      
      // Si l'API a retourné des catégories, les utiliser
      const allCategories = [
        { id: 'all', name: 'Tous', icon: 'comments' },
        ...categoriesData.map(category => ({
          id: category.id.toString(),
          name: category.name,
          icon: getCategoryIconFromName(category.name),
          description: category.description,
          postCount: category.postCount
        }))
      ];
      
      return { data: allCategories };
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      
      // Retourner des catégories par défaut en cas d'erreur
      return {
        data: [
          { id: 'all', name: 'Tous', icon: 'comments' },
          { id: 1, name: 'Spiritualité', icon: 'sun-o' },
          { id: 2, name: 'Éducation', icon: 'book' },
          { id: 3, name: 'Santé', icon: 'heartbeat' },
          { id: 4, name: 'Bien-être', icon: 'leaf' },
          { id: 5, name: 'Motivation', icon: 'bolt' },
          { id: 6, name: 'Conseils', icon: 'lightbulb-o' },
        ]
      };
    }
  },

  /**
   * Partage un post
   * @param {string} postId - ID du post à partager
   * @param {string} platform - Plateforme de partage (ex: 'facebook', 'twitter', 'email')
   * @returns {Promise<Object>} - Confirmation de partage
   */
  sharePost: async (postId, platform) => {
    try {
      const response = await API.post(`/forum/posts/${postId}/share`, { platform });
      return response;
    } catch (error) {
      console.error(`Erreur lors du partage du post ${postId}:`, error);
      throw error;
    }
  },

  /**
   * Signale un post
   * @param {string} postId - ID du post à signaler
   * @param {string} reason - Raison du signalement
   * @returns {Promise<Object>} - Réponse de l'API
   */
  reportPost: async (postId, reason) => {
    try {
      const response = await API.post(`/forum/posts/${postId}/report`, { reason });
      return response;
    } catch (error) {
      console.error(`Erreur lors du signalement du post ${postId}:`, error);
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
      const response = await API.post(`/forum/comments/${commentId}/report`, { reason });
      return response;
    } catch (error) {
      console.error(`Erreur lors du signalement du commentaire ${commentId}:`, error);
      throw error;
    }
  },

  /**
   * Méthode générale pour signaler un contenu (post ou commentaire)
   * @param {string} type - Type d'élément à signaler ('post' ou 'comment')
   * @param {string} id - ID de l'élément à signaler
   * @param {string} reason - Raison du signalement
   * @returns {Promise<Object>} - Réponse de l'API
   */
  reportContent: async (type, id, reason) => {
    try {
      if (type === 'comment') {
        return await forumAPI.reportComment(id, reason);
      } else {
        return await forumAPI.reportPost(id, reason);
      }
    } catch (error) {
      console.error(`Erreur lors du signalement du ${type} ${id}:`, error);
      throw error;
    }
  },

  /**
   * Enregistre une vue sur un post
   * @param {string} postId - ID du post
   * @returns {Promise<Object>} - Réponse de l'API
   */
  recordView: async (postId) => {
    try {
      const response = await API.put(`/forum/posts/${postId}/view`);
      return response;
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de la vue pour le post ${postId}:`, error);
      throw error;
    }
  }
};

export default forumAPI;