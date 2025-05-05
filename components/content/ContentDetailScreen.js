import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  Modal, 
  Pressable,
  Image,
  Animated,
  StatusBar,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Share
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import conseilsAPI from '../../services/conseilsAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContentDetailScreen = ({ route, navigation }) => {
  const { title, content, image, id: contentId } = route.params;
  const scrollY = useRef(new Animated.Value(0)).current;

  // État pour savoir si le header est en mode compact
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  
  // État pour la liste des conseils
  const [adviceList, setAdviceList] = useState([]);
  
  // États pour la pagination et le chargement
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // État pour les erreurs
  const [error, setError] = useState(null);

  // État pour l'authentification
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Transformer la valeur de défilement en opacité pour les éléments du header
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerCompactOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const [selectedAdvice, setSelectedAdvice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  // État pour le modal de signalement
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportContent, setReportContent] = useState(null);
  const [reportType, setReportType] = useState(null);
  const [reportReason, setReportReason] = useState('');

  // Animation pour le "like"
  const likeAnimation = useRef(new Animated.Value(1)).current;

  // Vérifier l'authentification
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        console.log('Token présent?', !!token);
        
        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          // En mode développement, on peut charger les données même sans authentification
          fetchAdvices(1, true);
        } else {
          setIsAuthenticated(true);
          fetchAdvices(1, true);
        }
      } catch (e) {
        console.error('Erreur lors de la vérification d\'authentification:', e);
        setError('Erreur de vérification d\'authentification');
        setLoading(false);
      }
    };
    
    checkAuthentication();
  }, []);

  // Enregistrer une vue lorsque le composant est monté
  useEffect(() => {
    if (isAuthenticated && contentId) {
      recordView(contentId);
    }
  }, [isAuthenticated, contentId]);

  const fetchAdvices = async (pageToLoad = 1, resetList = false) => {
    try {
      if (resetList) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      
      // Si on charge la page courante ou une page supérieure au total, on arrête
      if (!resetList && (pageToLoad < page || pageToLoad > totalPages)) {
        setLoadingMore(false);
        return;
      }
      
      // Appel à l'API pour récupérer la liste des conseils avec pagination
      const response = await conseilsAPI.getConseils({ 
        page: pageToLoad, 
        limit: 10,
        contentId: contentId 
      });
      
      console.log(`Données reçues de l'API (page ${pageToLoad}):`, response);
      
      // Mettre à jour les informations de pagination
      const paginationInfo = response.pagination || { 
        currentPage: pageToLoad, 
        totalPages: pageToLoad,
        totalItems: response.length || 0
      };
      
      setTotalPages(paginationInfo.totalPages || 1);
      setPage(pageToLoad);
      
      // Transformation des données API en format compatible avec l'UI
      const formattedData = (response.items || response).map(item => ({
        id: item.id.toString(),
        text: item.content,
        author: item.author.fullName,
        authorImage: item.authorImage || "https://randomuser.me/api/portraits/men/1.jpg", // image par défaut
        date: new Date(item.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date(item.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        comments: item.comments || 0,
        likes: item.likes || 0,
        views: item.views || 0,
        isLiked: item.isLiked || false,
        commentList: item.commentList || []
      }));
      
      // Mise à jour de l'état en fonction du mode (reset ou append)
      if (resetList) {
        setAdviceList(formattedData);
      } else {
        setAdviceList(prevList => [...prevList, ...formattedData]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des conseils:', error);
      
      // Si connecté, on affiche l'erreur
      if (isAuthenticated) {
        setError('Impossible de charger les conseils. Veuillez réessayer.');
      } else {
        setError('Vous devez être connecté pour accéder aux conseils.');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  // Gérer le chargement des pages suivantes
  const handleLoadMore = () => {
    if (!loadingMore && page < totalPages) {
      fetchAdvices(page + 1);
    }
  };

  // Gérer le pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchAdvices(1, true);
  };

  // Enregistrer une vue
  const recordView = async (id) => {
    try {
      if (isAuthenticated) {
        await conseilsAPI.recordView(id);
        console.log('Vue enregistrée avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la vue:', error);
      // On ne montre pas d'erreur à l'utilisateur car c'est secondaire
    }
  };

  const handleOpenComments = (advice) => {
    setSelectedAdvice(advice);
    setModalVisible(true);
  };

  const handleAddComment = async () => {
    if (selectedAdvice && newCommentText.trim()) {
      try {
        // Vérifier l'authentification
        if (!isAuthenticated) {
          Alert.alert(
            "Authentification requise",
            "Vous devez être connecté pour commenter.",
            [{ text: "OK" }]
          );
          return;
        }
        
        // Mise à jour optimiste de l'UI
        const newComment = {
          id: Date.now().toString(), // Temporary ID until we get the real one from server
          author: 'Vous',
          authorImage: 'https://randomuser.me/api/portraits/men/85.jpg',
          text: newCommentText,
          date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          likes: 0,
          isLiked: false,
          subComments: []
        };
  
        const updatedAdviceList = adviceList.map(advice => {
          if (advice.id === selectedAdvice.id) {
            // Si on répond à un commentaire spécifique
            if (replyTo) {
              const updatedComments = advice.commentList.map(comment => {
                if (comment.id === replyTo.id) {
                  return {
                    ...comment,
                    subComments: comment.subComments 
                      ? [...comment.subComments, newComment] 
                      : [newComment]
                  };
                }
                return comment;
              });
              
              return {
                ...advice,
                commentList: updatedComments,
                comments: advice.comments + 1,
              };
            } else {
              // Sinon, on ajoute un nouveau commentaire principal
              return {
                ...advice,
                commentList: [...advice.commentList, newComment],
                comments: advice.comments + 1,
              };
            }
          }
          return advice;
        });
        
        setAdviceList(updatedAdviceList);
        setNewCommentText('');
        setReplyTo(null);
        
        // Appel à l'API pour ajouter le commentaire sur le serveur
        const response = await conseilsAPI.addComment(
          selectedAdvice.id, 
          newCommentText, 
          replyTo?.id
        );
        
        // Update the temporary ID with the real one from server
        // This is important for subsequent operations like liking the comment
        const serverComment = response;
        
        // Update the list with the real comment data from server
        if (serverComment && serverComment.id) {
          const finalUpdatedList = adviceList.map(advice => {
            if (advice.id === selectedAdvice.id) {
              const updateCommentWithRealId = (comments) => {
                return comments.map(comment => {
                  // If this is our new comment (using the temporary ID as a marker)
                  if (comment.id === newComment.id) {
                    return {
                      ...serverComment,
                      author: 'Vous', // Keep "Vous" for better UX
                      authorImage: comment.authorImage, // Keep the UI consistent
                      date: comment.date,
                      time: comment.time,
                      subComments: []
                    };
                  }
                  
                  // If this comment has subcomments, check them too
                  if (comment.subComments && comment.subComments.length > 0) {
                    return {
                      ...comment,
                      subComments: updateCommentWithRealId(comment.subComments)
                    };
                  }
                  
                  return comment;
                });
              };
              
              return {
                ...advice,
                commentList: updateCommentWithRealId(advice.commentList)
              };
            }
            return advice;
          });
          
          setAdviceList(finalUpdatedList);
          setSelectedAdvice(finalUpdatedList.find(a => a.id === selectedAdvice.id));
        }
        
      } catch (error) {
        console.error('Erreur lors de l\'ajout du commentaire:', error);
        Alert.alert(
          "Erreur",
          error.response?.data?.message || "Impossible d'ajouter votre commentaire. Veuillez réessayer.",
          [{ text: "OK" }]
        );
        // Idéalement, on devrait revenir à l'état précédent ici
      }
    }
  };

  const handleLike = async (advice) => {
    // Vérifier l'authentification
    if (!isAuthenticated) {
      Alert.alert(
        "Authentification requise",
        "Vous devez être connecté pour aimer un conseil.",
        [{ text: "OK" }]
      );
      return;
    }
    
    // Animation de like
    Animated.sequence([
      Animated.timing(likeAnimation, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  
    // Mise à jour optimiste de l'UI
    const updatedAdviceList = adviceList.map(item => {
      if (item.id === advice.id) {
        return {
          ...item,
          isLiked: !item.isLiked,
          likes: item.isLiked ? item.likes - 1 : item.likes + 1,
        };
      }
      return item;
    });
    
    setAdviceList(updatedAdviceList);
    
    // Appel à l'API pour enregistrer le like/unlike
    try {
      await conseilsAPI.toggleLike(advice.id, !advice.isLiked);
      console.log('Like/unlike enregistré avec succès');
    } catch (error) {
      // The backend might return a 400 error if user tries to like twice
      // In this case, we should revert the UI update
      console.error('Erreur lors du like/unlike:', error);
      
      // En cas d'erreur, on revient à l'état précédent
      setAdviceList(prevList => prevList.map(item => {
        if (item.id === advice.id) {
          return {
            ...item,
            isLiked: advice.isLiked,
            likes: advice.likes,
          };
        }
        return item;
      }));
      
      // Notification à l'utilisateur
      Alert.alert(
        "Erreur",
        error.response?.data?.message || "Impossible d'enregistrer votre appréciation. Veuillez réessayer.",
        [{ text: "OK" }]
      );
    }
  };
  
  const handleCommentLike = async (commentId) => {
    if (!selectedAdvice) return;
    
    // Vérifier l'authentification
    if (!isAuthenticated) {
      Alert.alert(
        "Authentification requise",
        "Vous devez être connecté pour aimer un commentaire.",
        [{ text: "OK" }]
      );
      return;
    }
    
    // Trouve le commentaire à modifier
    let commentToUpdate = null;
    let isSubComment = false;
    let parentCommentId = null;
    
    selectedAdvice.commentList.forEach(comment => {
      if (comment.id === commentId) {
        commentToUpdate = comment;
      } else if (comment.subComments) {
        comment.subComments.forEach(subComment => {
          if (subComment.id === commentId) {
            commentToUpdate = subComment;
            isSubComment = true;
            parentCommentId = comment.id;
          }
        });
      }
    });
    
    if (!commentToUpdate) return;
    
    // Mise à jour optimiste de l'UI
    const updatedAdviceList = adviceList.map(advice => {
      if (advice.id === selectedAdvice.id) {
        const updatedComments = advice.commentList.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            };
          } else if (isSubComment && comment.id === parentCommentId) {
            const updatedSubComments = comment.subComments.map(subComment => {
              if (subComment.id === commentId) {
                return {
                  ...subComment,
                  isLiked: !subComment.isLiked,
                  likes: subComment.isLiked ? subComment.likes - 1 : subComment.likes + 1,
                };
              }
              return subComment;
            });
            
            return {
              ...comment,
              subComments: updatedSubComments
            };
          }
          return comment;
        });
        
        return {
          ...advice,
          commentList: updatedComments
        };
      }
      return advice;
    });
    
    setAdviceList(updatedAdviceList);
    setSelectedAdvice(updatedAdviceList.find(a => a.id === selectedAdvice.id));
    
    // Appel à l'API pour enregistrer le like du commentaire
    try {
      await conseilsAPI.toggleCommentLike(commentId, !commentToUpdate.isLiked);
      console.log('Like/unlike du commentaire enregistré avec succès');
    } catch (error) {
      console.error('Erreur lors du like/unlike du commentaire:', error);
      
      // En cas d'erreur, on pourrait revenir à l'état précédent ici
      // (code similaire à la mise à jour optimiste mais en sens inverse)
      
      // Notification à l'utilisateur si nécessaire
      Alert.alert(
        "Erreur", 
        error.response?.data?.message || "Impossible d'enregistrer votre like. Veuillez réessayer.", 
        [{ text: "OK" }]
      );
    }
  };

  const handleReply = (comment) => {
    setReplyTo(comment);
    setNewCommentText(`@${comment.author} `);
  };

  const handleShareAdvice = async (advice) => {
    try {
      // Vérifier l'authentification pour l'enregistrement du partage
      if (isAuthenticated) {
        // Appel à l'API pour enregistrer le partage
        await conseilsAPI.shareConseil(advice.id, 'app');
      }
      
      // Ouvrir le dialogue de partage natif (fonctionne même sans authentification)
      await Share.share({
        message: `${advice.text}\n\nPartagé depuis l'application`,
        title: 'Partager ce conseil'
      });
      
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      Alert.alert(
        "Erreur",
        "Impossible de partager ce conseil. Veuillez réessayer.",
        [{ text: "OK" }]
      );
    }
  };

  // Fonctions pour le signalement de contenu
  const showReportModal = (type, content) => {
    setReportType(type); // 'conseil' ou 'comment'
    setReportContent(content);
    setReportModalVisible(true);
  };

  const handleReportSubmit = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Authentification requise",
        "Vous devez être connecté pour signaler un contenu.",
        [{ text: "OK" }]
      );
      setReportModalVisible(false);
      return;
    }

    if (!reportReason.trim()) {
      Alert.alert(
        "Raison manquante",
        "Veuillez indiquer la raison du signalement.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      await conseilsAPI.reportContent(
        reportType,
        reportContent.id,
        reportReason
      );

      Alert.alert(
        "Signalement envoyé",
        "Merci pour votre signalement. Notre équipe va l'examiner.",
        [{ text: "OK" }]
      );
      
      // Réinitialiser les états du modal de signalement
      setReportModalVisible(false);
      setReportReason('');
      setReportType(null);
      setReportContent(null);
    } catch (error) {
      console.error('Erreur lors du signalement:', error);
      Alert.alert(
        "Erreur",
        error.message || "Impossible d'envoyer le signalement. Veuillez réessayer.",
        [{ text: "OK" }]
      );
    }
  };

  const renderAdviceItem = ({ item }) => (
    <View style={styles.adviceItem}>
      <View style={styles.adviceHeader}>
        <Image source={{ uri: item.authorImage }} style={styles.authorAvatar} />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{item.author}</Text>
          <Text style={styles.adviceDate}>{item.date} à {item.time}</Text>
        </View>
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => showReportModal('conseil', item)}
        >
          <Icon name="more-vert" size={20} color="#555" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.adviceText}>{item.text}</Text>
      
      <View style={styles.interactionContainer}>
        <TouchableOpacity 
          style={styles.interactionButton}
          onPress={() => handleLike(item)}
          activeOpacity={0.7}
        >
          <Animated.View style={{ transform: [{ scale: item.id === '1' ? likeAnimation : 1 }] }}>
            <Icon 
              name={item.isLiked ? "favorite" : "favorite-border"} 
              size={22} 
              color={item.isLiked ? "#c62828" : "#555"} 
            />
          </Animated.View>
          <Text style={styles.interactionText}>{item.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.interactionButton} 
          onPress={() => handleOpenComments(item)}
          activeOpacity={0.7}
        >
          <Icon name="chat-bubble-outline" size={20} color="#555" />
          <Text style={styles.interactionText}>{item.comments}</Text>
        </TouchableOpacity>
        
        <View style={styles.interactionButton}>
          <Icon name="visibility" size={20} color="#555" />
          <Text style={styles.interactionText}>{item.views}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.interactionButton} 
          onPress={() => handleShareAdvice(item)}
          activeOpacity={0.7}
        >
          <Icon name="share" size={20} color="#555" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Rendu du footer pour l'indicateur de chargement lors du scroll infini
  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadMoreContainer}>
        <ActivityIndicator size="small" color="#c62828" />
        <Text style={styles.loadMoreText}>Chargement des conseils...</Text>
      </View>
    );
  };

  const renderComment = (comment, isReply = false) => (
    <View key={comment.id} style={[styles.commentItem, isReply && styles.replyCommentItem]}>
      <View style={styles.commentHeader}>
        <Image source={{ uri: comment.authorImage }} style={styles.commentAvatar} />
        <View style={styles.commentAuthorContainer}>
          <Text style={styles.commentAuthor}>{comment.author}</Text>
          <Text style={styles.commentDate}>{comment.date} • {comment.time}</Text>
        </View>
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => showReportModal('comment', comment)}
        >
          <Icon name="more-vert" size={16} color="#777" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.commentText}>{comment.text}</Text>
      
      <View style={styles.commentActions}>
        <TouchableOpacity 
          style={styles.commentActionButton}
          onPress={() => handleCommentLike(comment.id)}
        >
          <Icon 
            name={comment.isLiked ? "favorite" : "favorite-border"} 
            size={16} 
            color={comment.isLiked ? "#c62828" : "#777"} 
          />
          <Text style={styles.commentActionText}>{comment.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.commentActionButton}
          onPress={() => handleReply(comment)}
        >
          <Icon name="reply" size={16} color="#777" />
          <Text style={styles.commentActionText}>Répondre</Text>
        </TouchableOpacity>
      </View>
      
      {comment.subComments && comment.subComments.length > 0 && (
        <View style={styles.subCommentsContainer}>
          {comment.subComments.map(subComment => 
            renderComment(subComment, true)
          )}
        </View>
      )}
    </View>
  );

  // Rendus du header normal et compact en fonction du scroll
  const renderHeaderBackground = () => (
    <Animated.View 
      style={[
        styles.headerBackground,
        { opacity: headerOpacity }
      ]}
    >
      {image && (
        <Image 
          source={{ uri: image }} 
          style={styles.headerImage}
        />
      )}
      <View style={styles.headerOverlay} />
    </Animated.View>
  );

  const renderHeaderContent = () => (
    <>
      <Animated.View style={[styles.headerContent, { opacity: headerOpacity }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.compactHeader, 
          { opacity: headerCompactOpacity }
        ]}
      >
        <TouchableOpacity 
          style={styles.compactBackButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.compactTitle} numberOfLines={1}>
          {title}
        </Text>
      </Animated.View>
    </>
  );

  // Rendu des états de chargement et d'erreur
  if (loading && !adviceList.length) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <ActivityIndicator size="large" color="#c62828" />
        <Text style={styles.loadingText}>Chargement des conseils...</Text>
      </SafeAreaView>
    );
  }

  if (error && !adviceList.length) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <Icon name="error-outline" size={50} color="#c62828" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => fetchAdvices(1, true)}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
        {!isAuthenticated && (
          <TouchableOpacity 
            style={[styles.retryButton, styles.loginButton]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.retryButtonText}>Se connecter</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Header avec animation au scroll */}
      {renderHeaderBackground()}
      {renderHeaderContent()}
      
      {/* Contenu principal */}
      <FlatList
        data={adviceList}
        renderItem={renderAdviceItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        
        // Pagination infinie et pull-to-refresh
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        
        // Animation du header
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { 
            useNativeDriver: false,
            listener: ({ nativeEvent }) => {
              if (nativeEvent.contentOffset.y > 50 && !isHeaderCompact) {
                setIsHeaderCompact(true);
              } else if (nativeEvent.contentOffset.y <= 50 && isHeaderCompact) {
                setIsHeaderCompact(false);
              }
            }
          }
        )}
        scrollEventThrottle={16}
        
        // En-tête de la liste
        ListHeaderComponent={() => (
          <View style={styles.contentHeader}>
            {content && <Text style={styles.contentText}>{content}</Text>}
            <Text style={styles.advicesTitle}>Conseils</Text>
            {!isAuthenticated && (
              <View style={styles.authBanner}>
                <Text style={styles.authBannerText}>Connectez-vous pour interagir avec les conseils</Text>
                <TouchableOpacity 
                  style={styles.authBannerButton}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.authBannerButtonText}>Se connecter</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        
        // Message si la liste est vide
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun conseil disponible pour le moment.</Text>
          </View>
        )}
      />
      
      {/* Modal pour les commentaires */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setReplyTo(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Commentaires</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton} 
                onPress={() => {
                  setModalVisible(false);
                  setReplyTo(null);
                }}
              >
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {selectedAdvice && (
              <>
                <ScrollView style={styles.commentsContainer}>
                  {selectedAdvice.commentList && selectedAdvice.commentList.length > 0 ? (
                    selectedAdvice.commentList.map(comment => renderComment(comment))
                  ) : (
                    <View style={styles.emptyCommentsContainer}>
                      <Text style={styles.emptyCommentsText}>Soyez le premier à commenter !</Text>
                    </View>
                  )}
                </ScrollView>
                
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 40}
                >
                  {replyTo && (
                    <View style={styles.replyContainer}>
                      <Text style={styles.replyText}>
                        Réponse à <Text style={styles.replyName}>{replyTo.author}</Text>
                      </Text>
                      <TouchableOpacity onPress={() => {
                        setReplyTo(null);
                        setNewCommentText('');
                      }}>
                        <Icon name="close" size={18} color="#777" />
                      </TouchableOpacity>
                    </View>
                  )}
                  
                  <View style={styles.commentInputContainer}>
                    {!isAuthenticated ? (
                      <TouchableOpacity 
                        style={styles.loginToCommentButton}
                        onPress={() => {
                          setModalVisible(false);
                          navigation.navigate('Login');
                        }}
                      >
                        <Text style={styles.loginToCommentText}>Se connecter pour commenter</Text>
                      </TouchableOpacity>
                    ) : (
                      <>
                        <TextInput
                          style={styles.commentInput}
                          placeholder="Ajouter un commentaire..."
                          value={newCommentText}
                          onChangeText={setNewCommentText}
                          multiline
                        />
                        <TouchableOpacity 
                          style={[
                            styles.sendButton,
                            !newCommentText.trim() && styles.sendButtonDisabled
                          ]} 
                          onPress={handleAddComment}
                          disabled={!newCommentText.trim()}
                        >
                          <Icon 
                            name="send" 
                            size={20} 
                            color={newCommentText.trim() ? "#fff" : "#aaa"} 
                          />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </KeyboardAvoidingView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal pour le signalement */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={reportModalVisible}
        onRequestClose={() => {
          setReportModalVisible(false);
          setReportReason('');
        }}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.reportModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Signaler {reportType === 'comment' ? 'un commentaire' : 'un conseil'}
              </Text>
              <TouchableOpacity 
                style={styles.modalCloseButton} 
                onPress={() => {
                  setReportModalVisible(false);
                  setReportReason('');
                }}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.reportContent}>
              <Text style={styles.reportLabel}>Pourquoi souhaitez-vous signaler ce contenu ?</Text>
              <TextInput
                style={styles.reportInput}
                placeholder="Veuillez décrire la raison du signalement..."
                value={reportReason}
                onChangeText={setReportReason}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              
              <View style={styles.reportButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.reportButton, styles.reportCancelButton]}
                  onPress={() => {
                    setReportModalVisible(false);
                    setReportReason('');
                  }}
                >
                  <Text style={styles.reportCancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.reportButton, 
                    styles.reportSubmitButton,
                    !reportReason.trim() && styles.reportButtonDisabled
                  ]}
                  onPress={handleReportSubmit}
                  disabled={!reportReason.trim()}
                >
                  <Text style={styles.reportSubmitButtonText}>Envoyer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Styles généraux
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#c62828',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 15,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  retryButton: {
    backgroundColor: '#c62828',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: '#1976d2',
    marginTop: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  authBanner: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  authBannerText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
  },
  authBannerButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 10,
  },
  authBannerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  loginToCommentButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#1976d2',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginToCommentText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
  emptyCommentsContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCommentsText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
  // Styles pour le chargement de plus de contenu
  loadMoreContainer: {
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadMoreText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
  },
  // Header Styles
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    zIndex: 1,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(198, 40, 40, 0.8)',
  },
  headerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  compactHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#c62828',
    zIndex: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  compactBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  compactTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  // Content Styles
  scrollContent: {
    paddingTop: 220,
    paddingBottom: 30,
  },
  contentHeader: {
    padding: 20,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  advicesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  // Advice Item Styles
  adviceItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorInfo: {
    marginLeft: 10,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  adviceDate: {
    fontSize: 12,
    color: '#888',
  },
  adviceText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 15,
  },
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f2f2f2',
    paddingTop: 12,
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
  },
  // Comment Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    padding: 5,
  },
  commentsContainer: {
    flex: 1,
    padding: 15,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f2f2f2',
    backgroundColor: '#fff',
  },
  commentInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#333',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#c62828',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  // Comment Item Styles
  commentItem: {
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f2f2f2',
  },
  replyCommentItem: {
    marginLeft: 30,
    marginTop: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#c62828',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentAuthorContainer: {
    marginLeft: 10,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  commentDate: {
    fontSize: 12,
    color: '#888',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  commentActionText: {
    fontSize: 12,
    color: '#777',
    marginLeft: 4,
  },
  subCommentsContainer: {
    marginTop: 10,
  },
  replyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
  },
  replyText: {
    fontSize: 13,
    color: '#777',
  },
  replyName: {
    fontWeight: 'bold',
    color: '#333',
  },
  // Styles pour le bouton Plus (menu) sur les conseils et commentaires
  moreButton: {
    padding: 5,
    marginLeft: 'auto',
  },
  // Styles pour le modal de signalement
  reportModalContent: {
    flex: 0,
    maxHeight: '50%',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  reportContent: {
    padding: 20,
  },
  reportLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  reportInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
    minHeight: 100,
    color: '#333',
  },
  reportButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  reportButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  reportCancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
  reportSubmitButton: {
    backgroundColor: '#c62828',
    marginLeft: 10,
  },
  reportButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  reportCancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  reportSubmitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ContentDetailScreen;