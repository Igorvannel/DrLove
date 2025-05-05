import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  Modal, 
  StatusBar,
  Animated,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker'; 
import forumAPI from '../../services/ForumAPI';

const { width } = Dimensions.get('window');

// Catégories par défaut au cas où l'API échoue
const DEFAULT_CATEGORIES = [
  { id: 'all', name: 'Tous', icon: 'comments' },
  { id: 1, name: 'Spiritualité', icon: 'sun-o' },
  { id: 2, name: 'Éducation', icon: 'book' },
  { id: 3, name: 'Santé', icon: 'heartbeat' },
  { id: 4, name: 'Bien-être', icon: 'leaf' },
  { id: 5, name: 'Motivation', icon: 'bolt' },
  { id: 6, name: 'Conseils', icon: 'lightbulb-o' }
];

const ForumScreen = ({ navigation }) => {
  // États
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all'); // Pour les filtres
  const [selectedPostCategory, setSelectedPostCategory] = useState(1); 
  const [isImagePickerVisible, setIsImagePickerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  
  // Références pour les animations
  const scrollY = useRef(new Animated.Value(0)).current;
  const searchBarAnimation = useRef(new Animated.Value(0)).current;
  const fabAnimation = useRef(new Animated.Value(1)).current;

  // Chargement initial des posts et des catégories
  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, []);

  // Rechargement des posts lors du changement de catégorie
  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  // Fonction pour récupérer les catégories depuis l'API
  const fetchCategories = async () => {
    try {
      console.log('Tentative de récupération des catégories...');
      const response = await forumAPI.getCategories();
      console.log('Réponse API catégories:', response);
      
      // Utilisez toujours les catégories par défaut pour tester
      setCategories(DEFAULT_CATEGORIES);
      setSelectedPostCategory(1); // ID pour Spiritualité
      
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      // Utilisez explicitement les catégories par défaut
      setCategories(DEFAULT_CATEGORIES);
      setSelectedPostCategory(1);
    }
  };

  // Fonction corrigée pour récupérer les posts depuis l'API
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Construction des paramètres de requête
      const params = {};
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      if (searchText.trim()) {
        params.search = searchText.trim();
      }
      
      console.log('Tentative de récupération des posts avec paramètres:', params);
      
      // Appel à l'API pour récupérer les posts
      const response = await forumAPI.getPosts(params);
      console.log('Réponse API posts:', response);
  
      // Vérification de la structure
      console.log('Structure du response:', Object.keys(response));
      
      // IMPORTANT: Les posts sont directement dans response, pas dans response.data
      const postsArray = response.posts || [];
      console.log('Nombre de posts récupérés:', postsArray.length);
  
      // Utiliser directement postsArray
      setPosts(postsArray);
      
    } catch (error) {
      console.error('Erreur lors du chargement des posts:', error);
      setError('Impossible de charger les discussions. Veuillez réessayer.');
      Alert.alert(
        "Erreur",
        "Impossible de charger les discussions. Veuillez réessayer.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  // Animation pour le bouton flottant au défilement
  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      if (value > 50) {
        Animated.spring(fabAnimation, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8
        }).start();
      } else {
        Animated.spring(fabAnimation, {
          toValue: 1,
          useNativeDriver: true,
          friction: 8
        }).start();
      }
    });

    return () => {
      scrollY.removeListener(listenerId);
    };
  }, []);

  // Gestion de la barre de recherche
  const toggleSearchBar = () => {
    if (showSearchBar) {
      Animated.timing(searchBarAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false
      }).start(() => {
        setShowSearchBar(false);
        // Si la barre de recherche est fermée avec du texte, lancer la recherche
        if (searchText.trim()) {
          fetchPosts();
        }
      });
    } else {
      setShowSearchBar(true);
      Animated.timing(searchBarAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false
      }).start();
    }
  };

  // Exécuter la recherche après un délai
  const handleSearch = () => {
    fetchPosts();
  };

  // Interpolations pour les animations
  const searchBarHeight = searchBarAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50]
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [80, 60],
    extrapolate: 'clamp'
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp'
  });

  const fabScale = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  const fabTranslateY = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0]
  });

  // Sélection d'une image depuis la galerie
  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission refusée", 
          "Nous avons besoin de votre permission pour accéder à vos photos."
        );
        return;
      }
      
      // Correction de la méthode de sélection d'image pour éviter l'erreur
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaType: ImagePicker.MediaTypeOptions.Images, // Utiliser mediaType au lieu de mediaTypes
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      // Gérer la réponse différemment selon la version d'Expo
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0]);
        setIsImagePickerVisible(false);
      } else if (!result.cancelled && result.uri) {
        // Pour la compatibilité avec les anciennes versions d'Expo
        setSelectedImage(result);
        setIsImagePickerVisible(false);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection d\'image:', error);
      // Fournir plus de détails sur l'erreur pour aider au débogage
      Alert.alert(
        "Erreur", 
        "Impossible de sélectionner l'image: " + error.message
      );
    }
  };

  // Création d'un nouveau post
  const handleCreatePost = async () => {
    // Vérifier que les champs obligatoires sont remplis et ont la longueur minimale
    if (!postTitle.trim()) {
      Alert.alert(
        "Champs obligatoires", 
        "Veuillez saisir un titre pour votre discussion."
      );
      return;
    }
    
    if (!postContent.trim()) {
      Alert.alert(
        "Champs obligatoires", 
        "Veuillez saisir un contenu pour votre discussion."
      );
      return;
    }
    
    if (postContent.trim().length < 10) {
      Alert.alert(
        "Contenu trop court", 
        "Le contenu de votre discussion doit comporter au moins 10 caractères."
      );
      return;
    }
  
    try {
      setIsLoading(true);
      
      const postData = {
        title: postTitle.trim(),
        content: postContent.trim(),
        // Utiliser l'ID numérique pour la catégorie
        category: parseInt(selectedPostCategory, 10) || selectedPostCategory
      };
      
      if (selectedImage) {
        // Format pour l'envoi d'image via FormData
        postData.image = {
          uri: selectedImage.uri,
          type: 'image/jpeg',
          name: 'post_image.jpg'
        };
      }
      
      await forumAPI.createPost(postData);
      
      // Réinitialiser les champs
      setPostTitle('');
      setPostContent('');
      setSelectedPostCategory(categories.find(cat => cat.id !== 'all')?.id || '1');
      setSelectedImage(null);
      setModalVisible(false);
      
      // Actualiser la liste des posts
      fetchPosts();
      
      Alert.alert(
        "Succès", 
        "Votre discussion a été publiée avec succès."
      );
    } catch (error) {
      console.error('Erreur lors de la création du post:', error);
      
      let errorMessage = "Impossible de publier votre discussion. Veuillez réessayer.";
      
      // Vérifier si l'erreur est liée à l'authentification
      if (error.response && error.response.status === 401) {
        errorMessage = "Vous devez être connecté pour publier une discussion.";
      }
      // Si c'est une erreur de validation
      else if (error.response && error.response.status === 400) {
        errorMessage = "Vérifiez les informations saisies et réessayez.";
      }
      
      Alert.alert(
        "Erreur", 
        errorMessage
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation vers le détail d'un post
  // Navigation vers le détail d'un post
const handlePostPress = (post) => {
  // Enregistrer la vue
  forumAPI.recordView(post.id).catch(error => {
    console.error('Erreur lors de l\'enregistrement de la vue:', error);
  });
  
  // Adapter le format du post pour le composant PostDetailScreen
  const adaptedPost = {
    ...post,
    author: post.authorName, // Ajouter une propriété "author" pour la compatibilité
    comments: post.comments || [], // S'assurer que comments est un tableau
    date: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '', // Formater la date
    category: post.categoryId // Utiliser categoryId comme category
  };
  
  // Naviguer vers la page de détail avec le post adapté
  navigation.navigate('PostDetail', { post: adaptedPost });
};
  
  // Liker un post
  const handleLikePost = async (postId, currentLiked) => {
    try {
      // Mise à jour optimiste de l'UI
      setPosts(currentPosts => 
        currentPosts.map(post => 
          post.id.toString() === postId.toString() 
            ? { 
                ...post, 
                likes: currentLiked ? post.likes - 1 : post.likes + 1,
                isLiked: !currentLiked
              } 
            : post
        )
      );
      
      // Appel API
      await forumAPI.toggleLike(postId, !currentLiked);
    } catch (error) {
      console.error(`Erreur lors du like du post ${postId}:`, error);
      
      // Annuler la mise à jour optimiste en cas d'erreur
      setPosts(currentPosts => 
        currentPosts.map(post => 
          post.id.toString() === postId.toString()
            ? { 
                ...post, 
                likes: currentLiked ? post.likes : post.likes - 1,
                isLiked: currentLiked
              } 
            : post
        )
      );
      
      Alert.alert(
        "Erreur", 
        "Impossible d'aimer cette publication. Veuillez réessayer."
      );
    }
  };

  // Rafraîchissement de la liste
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPosts();
  };

  // Partage d'un post
  const handleShare = async (postId) => {
    try {
      // Simuler une boîte de dialogue de partage native
      Alert.alert(
        "Partager via",
        "Choisissez une plateforme pour partager",
        [
          { text: "Facebook", onPress: () => shareToSocialMedia(postId, "facebook") },
          { text: "Twitter", onPress: () => shareToSocialMedia(postId, "twitter") },
          { text: "Email", onPress: () => shareToSocialMedia(postId, "email") },
          { text: "Annuler", style: "cancel" }
        ]
      );
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      Alert.alert("Erreur", "Impossible de partager ce contenu.");
    }
  };

  // Partage vers les réseaux sociaux
  const shareToSocialMedia = async (postId, platform) => {
    try {
      await forumAPI.sharePost(postId, platform);
      Alert.alert("Succès", "Contenu partagé avec succès.");
    } catch (error) {
      console.error(`Erreur lors du partage sur ${platform}:`, error);
      Alert.alert("Erreur", "Impossible de partager ce contenu.");
    }
  };

  // Fonctions utilitaires pour les catégories
  const getCategoryName = (categoryId) => {
    if (categoryId === 'all') return 'Tous';
    const category = categories.find(cat => cat.id.toString() === categoryId.toString());
    return category ? category.name : 'Autre';
  };

  const getCategoryIcon = (categoryId) => {
    if (categoryId === 'all') return 'comments';
    const category = categories.find(cat => cat.id.toString() === categoryId.toString());
    return category ? category.icon : 'comments';
  };

  const getCategoryStyle = (categoryId) => {
    switch (categoryId.toString()) {
      case 'relationships':
      case '1': // En supposant que l'ID 1 correspond aux relations
        return { backgroundColor: '#e91e63' };
      case 'motivation':
      case '2': // En supposant que l'ID 2 correspond à la motivation
        return { backgroundColor: '#ff9800' };
      case 'wellness':
      case '3': // En supposant que l'ID 3 correspond au bien-être
        return { backgroundColor: '#4caf50' };
      case 'education':
      case '4': // En supposant que l'ID 4 correspond à l'éducation
        return { backgroundColor: '#2196f3' };
      default:
        // Attribution de couleurs basées sur l'ID numérique
        const colorMap = {
          '0': '#9c27b0', // violet
          '5': '#795548', // marron
          '6': '#607d8b', // bleu-gris
          '7': '#ff5722', // orange foncé
          '8': '#009688', // vert-bleu
          '9': '#673ab7'  // violet foncé
        };
        
        // Si l'ID est un nombre, utiliser la correspondance ou générer une couleur
        const idString = categoryId.toString();
        if (colorMap[idString]) {
          return { backgroundColor: colorMap[idString] };
        }
        
        // Pour les autres IDs, générer une couleur basée sur l'ID
        const hash = Array.from(idString).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360;
        return { backgroundColor: `hsl(${hue}, 70%, 45%)` };
    }
  };

  // Rendu d'un élément de catégorie
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id.toString() && styles.selectedCategoryItem
      ]}
      onPress={() => setSelectedCategory(item.id.toString())}
      activeOpacity={0.7}
    >
      <Icon 
        name={item.icon} 
        size={16} 
        color={selectedCategory === item.id.toString() ? '#fff' : '#555'} 
        style={styles.categoryItemIcon} 
      />
      <Text 
        style={[
          styles.categoryItemText,
          selectedCategory === item.id.toString() && styles.selectedCategoryItemText
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Rendu d'un élément post
  const renderPostItem = ({ item, index }) => {
    const scaleAnim = scrollY.interpolate({
      inputRange: [-1, 0, index * 150, (index + 1) * 150],
      outputRange: [1, 1, 1, 0.97],
      extrapolate: 'clamp'
    });
  
    // Formatage de la date pour l'affichage
    const formattedDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '';
  
    return (
      <Animated.View
        style={[
          styles.postItemContainer,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <TouchableOpacity
          style={styles.postItem}
          onPress={() => handlePostPress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.postHeader}>
            <Image
              source={{ uri: item.authorAvatar || 'https://via.placeholder.com/40' }}
              style={styles.avatar}
            />
            <View style={styles.postHeaderText}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <View style={styles.postAuthorRow}>
                <Text style={styles.postAuthor}>{item.authorName}</Text>
                <Text style={styles.postDate}>{formattedDate}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.postPreview}>
            <Text numberOfLines={2} style={styles.previewText}>
              {item.content}
            </Text>
          </View>
          
          <View style={styles.postMeta}>
            <View style={[styles.categoryTag, getCategoryStyle(item.categoryId)]}>
              <Icon name={getCategoryIcon(item.categoryId)} size={12} color="#fff" style={styles.categoryIcon} />
              <Text style={styles.categoryText}>{item.categoryName || getCategoryName(item.categoryId)}</Text>
            </View>
          </View>
          
          <View style={styles.interactionContainer}>
            <TouchableOpacity 
              style={styles.interactionButton} 
              onPress={() => handleLikePost(item.id, item.isLiked)}
            >
              <Icon 
                name="heart" 
                size={16} 
                color={item.isLiked ? "#c62828" : "#555"} 
                solid={item.isLiked}
              />
              <Text style={styles.interactionText}>{item.likes}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.interactionButton}
              onPress={() => handlePostPress(item)}
            >
              <Icon name="comment" size={16} color="#555" />
              <Text style={styles.interactionText}>
                {item.commentsCount || 0}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.interactionButton}
              onPress={() => handleShare(item.id)}
            >
              <Icon name="share" size={16} color="#555" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor="#c62828" barStyle="light-content" />
      
      {/* En-tête */}
      <Animated.View 
        style={[
          styles.header, 
          { 
            height: headerHeight,
            opacity: headerOpacity,
          }
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Icon name="chevron-left" size={20} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Forum</Text>
          
          <TouchableOpacity onPress={toggleSearchBar} style={styles.headerButton}>
            <Icon name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      {/* Barre de recherche */}
      {showSearchBar && (
        <Animated.View style={[styles.searchContainer, { height: searchBarHeight }]}>
          <Icon name="search" size={16} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoFocus
          />
          <TouchableOpacity 
            onPress={() => {
              setSearchText('');
              fetchPosts();
            }} 
            style={styles.clearSearchButton}
          >
            {searchText !== '' && <Icon name="times" size={16} color="#999" />}
          </TouchableOpacity>
        </Animated.View>
      )}
      
      {/* Liste de catégories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>
      
      {/* Indicateur de chargement */}
      {isLoading && !isRefreshing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#c62828" />
        </View>
      )}
      
      {/* Liste des posts */}
      <Animated.FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.postList}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Icon name="comments-o" size={48} color="#ddd" />
              <Text style={styles.emptyText}>
                {searchText ? 'Aucun résultat trouvé' : 'Pas encore de discussions'}
              </Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.emptyButtonText}>Créer une discussion</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
      
      {/* Bouton flottant pour créer un post */}
      <Animated.View
        style={[
          styles.floatingButtonContainer,
          {
            transform: [
              { scale: fabScale },
              { translateY: fabTranslateY }
            ]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.floatingButton} 
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Modal pour créer un nouveau post */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Créer une discussion</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Icon name="times" size={20} color="#555" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Titre de la discussion"
              value={postTitle}
              onChangeText={setPostTitle}
              placeholderTextColor="#999"
            />
            
            <View style={styles.categorySelector}>
              <Text style={styles.categorySelectorLabel}>Catégorie :</Text>
              <View style={styles.categoryButtons}>
                {categories.filter(cat => cat.id.toString() !== 'all').map(category => (
                  <TouchableOpacity
                    key={category.id.toString()}
                    style={[
                      styles.categorySelectorItem,
                      selectedPostCategory === category.id.toString() && 
                      [styles.selectedCategorySelectorItem, getCategoryStyle(category.id)]
                    ]}
                    onPress={() => setSelectedPostCategory(category.id.toString())}
                  >
                    <Icon 
                      name={category.icon} 
                      size={14} 
                      color={selectedPostCategory === category.id.toString() ? '#fff' : '#555'} 
                    />
                    <Text 
                      style={[
                        styles.categorySelectorText,
                        selectedPostCategory === category.id.toString() && styles.selectedCategorySelectorText
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Partagez vos pensées..."
              value={postContent}
              onChangeText={setPostContent}
              multiline
              placeholderTextColor="#999"
            />
            
            <View style={styles.attachmentContainer}>
              {selectedImage ? (
                <View style={styles.selectedImageContainer}>
                  <Image 
                    source={{ uri: selectedImage.uri }} 
                    style={styles.selectedImage} 
                  />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => setSelectedImage(null)}
                  >
                    <Icon name="times-circle" size={22} color="#c62828" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.attachmentButton}
                  onPress={handlePickImage}
                >
                  <Icon name="image" size={20} color="#555" />
                  <Text style={styles.attachmentText}>Ajouter une image</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity 
              style={[
                styles.submitButton,
                (isLoading || !postTitle.trim() || !postContent.trim()) && styles.submitButtonDisabled
              ]} 
              onPress={handleCreatePost}
              disabled={isLoading || !postTitle.trim() || !postContent.trim()}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Publier</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#c62828',
    justifyContent: 'flex-end',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    overflow: 'hidden',
    zIndex: 9,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearSearchButton: {
    padding: 6,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 8,
  },
  categoryList: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedCategoryItem: {
    backgroundColor: '#c62828',
  },
  categoryItemIcon: {
    marginRight: 6,
  },
  categoryItemText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  selectedCategoryItemText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 20,
  },
  postList: {
    padding: 12,
    paddingBottom: 100, // Pour laisser de l'espace au bouton flottant
  },
  postItemContainer: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postItem: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
  },
  postHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  postAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAuthor: {
    fontSize: 14,
    color: '#666',
  },
  postDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 16,
  },
  postPreview: {
    padding: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  postMeta: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#9e9e9e',
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  interactionContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  interactionText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 6,
  },
  floatingButtonContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#c62828',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  categorySelector: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  categorySelectorLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categorySelectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategorySelectorItem: {
    backgroundColor: '#c62828',
  },
  categorySelectorText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 6,
  },
  selectedCategorySelectorText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    marginHorizontal: 16,
    marginTop: 16,
    height: 50,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
    paddingTop: 16,
    paddingBottom: 16,
  },
  attachmentContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  attachmentText: {
    marginLeft: 8,
    color: '#555',
    fontSize: 14,
  },
  selectedImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  selectedImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#c62828',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#c62828',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});

export default ForumScreen;