import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Animated,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import authService from '../../services/authService';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  // États
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('consultations');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Animation pour l'en-tête
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [80, 60],
    extrapolate: 'clamp'
  });
  
  // Récupérer les données utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // Try to get user data from getCurrentUser first
        try {
          const userData = await authService.getCurrentUser();
          console.log("Fetched user data:", userData);
          setUserData(userData);
        } catch (remoteError) {
          console.error('Erreur lors de la récupération des données utilisateur:', remoteError);
          
          // If the main method fails, try alternative methods
          // 1. Check if there's user data directly available via authService
          const localData = await authService.getAuthData();
          if (localData && localData.user) {
            console.log("Using local auth data:", localData.user);
            setUserData(localData.user);
          } else {
            // 2. If we still don't have data, check if we have it in the log message
            // This is a fallback for debugging purposes
            console.log("Attempting to load user data from fallback");
            setUserData({
              email: "vannel@gmail.com", 
              id: 3, 
              roles: [{id: 1, name: "ROLE_USER"}],
              fullName: "Utilisateur",
              country: "Non spécifié"
            });
          }
        }
      } catch (error) {
        console.error('Erreur critique lors de la récupération des données:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Données simulées pour les consultations et articles
  /* COMMENTÉ: Données des consultations
  const consultations = [
    { id: '1', title: 'Consultation avec Dr. Marie', date: '15 mars 2025', status: 'completed' },
    { id: '2', title: 'Session de motivation', date: '2 février 2025', status: 'completed' },
    { id: '3', title: 'Consultation de couple', date: '18 janvier 2025', status: 'completed' },
  ];
  */
  
  /* COMMENTÉ: Données des articles
  const articles = [
    { id: '1', title: 'Comment améliorer votre communication', date: '12 mars 2025', author: 'Dr. Thomas', readTime: '8 min' },
    { id: '2', title: 'Les 5 langages de l\'amour', date: '28 février 2025', author: 'Dr. Sophie', readTime: '12 min' },
    { id: '3', title: 'Gérer les conflits dans le couple', date: '15 février 2025', author: 'Dr. Marc', readTime: '10 min' },
  ];
  */

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Déconnexion", 
          onPress: async () => {
            try {
              await authService.logout();
              navigation.reset({ 
                index: 0, 
                routes: [{ name: 'Login' }] 
              });
            } catch (error) {
              console.error('Erreur lors de la déconnexion:', error);
              Alert.alert(
                "Erreur",
                "Une erreur est survenue lors de la déconnexion."
              );
            }
          } 
        }
      ]
    );
  };

  // Fonction pour modifier le profil
  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  // Détermine si l'utilisateur est un administrateur
  const isAdmin = () => {
    if (!userData || !userData.roles) return false;
    
    // Check if roles is an array of objects with name property
    if (Array.isArray(userData.roles) && userData.roles.length > 0 && typeof userData.roles[0] === 'object') {
      return userData.roles.some(role => role.name === 'ROLE_ADMIN');
    }
    
    // Check if roles is an array of strings
    if (Array.isArray(userData.roles) && userData.roles.length > 0 && typeof userData.roles[0] === 'string') {
      return userData.roles.includes('ROLE_ADMIN');
    }
    
    return false;
  };

  // Rendu des éléments de menu paramètres
  const renderSettingItem = (icon, label, onPress, color = "#333") => (
    <TouchableOpacity 
      style={styles.settingsItem} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingIconContainer}>
        <Icon name={icon} size={22} color={color} />
      </View>
      <Text style={[styles.settingsText, { color }]}>{label}</Text>
      <Icon name="chevron-right" size={20} color="#ddd" />
    </TouchableOpacity>
  );
  
  // Rendu du contenu des onglets
  const renderTabContent = () => {
    switch(activeTab) {
      case 'consultations':
        return (
          <View style={styles.tabContent}>
            {/* COMMENTÉ: Contenu des consultations
            {consultations.length > 0 ? (
              consultations.map(item => (
                <TouchableOpacity 
                  key={item.id}
                  style={styles.consultationItem}
                  onPress={() => navigation.navigate('ConsultationDetail', { id: item.id })}
                  activeOpacity={0.8}
                >
                  <View style={styles.consultationIconContainer}>
                    <Icon name="event-note" size={22} color="#c62828" />
                  </View>
                  <View style={styles.consultationContent}>
                    <Text style={styles.consultationTitle}>{item.title}</Text>
                    <Text style={styles.consultationDate}>{item.date}</Text>
                  </View>
                  <View style={styles.consultationStatus}>
                    <View style={[
                      styles.statusDot, 
                      { backgroundColor: item.status === 'completed' ? '#4caf50' : '#ff9800' }
                    ]} />
                    <Text style={styles.statusText}>
                      {item.status === 'completed' ? 'Terminé' : 'En cours'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="event-busy" size={40} color="#ddd" />
                <Text style={styles.emptyStateText}>Aucune consultation</Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('BookConsultation')}
            >
              <Text style={styles.actionButtonText}>Réserver une consultation</Text>
            </TouchableOpacity>
            */}
            
            {/* Message temporaire */}
            <View style={styles.emptyState}>
              <Icon name="event-busy" size={40} color="#ddd" />
              <Text style={styles.emptyStateText}>Section consultations temporairement désactivée</Text>
            </View>
          </View>
        );
        
      case 'articles':
        return (
          <View style={styles.tabContent}>
            {/* COMMENTÉ: Contenu des articles
            {articles.map(item => (
              <TouchableOpacity 
                key={item.id}
                style={styles.articleItem}
                onPress={() => navigation.navigate('ArticleDetail', { id: item.id })}
                activeOpacity={0.8}
              >
                <View style={styles.articleHeader}>
                  <Text style={styles.articleTitle}>{item.title}</Text>
                  <View style={styles.articleMeta}>
                    <Text style={styles.articleAuthor}>{item.author}</Text>
                    <View style={styles.articleMetaDot} />
                    <Text style={styles.articleDate}>{item.date}</Text>
                  </View>
                </View>
                <View style={styles.articleFooter}>
                  <View style={styles.readTimeContainer}>
                    <Icon name="schedule" size={14} color="#888" />
                    <Text style={styles.readTime}>{item.readTime}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('ArticlesList')}
            >
              <Text style={styles.actionButtonText}>Voir tous les articles</Text>
            </TouchableOpacity>
            */}
            
            {/* Message temporaire */}
            <View style={styles.emptyState}>
              <Icon name="article" size={40} color="#ddd" />
              <Text style={styles.emptyStateText}>Section articles temporairement désactivée</Text>
            </View>
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f8f8f8" barStyle="dark-content" />
      
      {/* En-tête */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#555" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => setShowOptionsModal(true)}
        >
          <Icon name="more-vert" size={24} color="#555" />
        </TouchableOpacity>
      </Animated.View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Carte du profil - Version simplifiée */}
        <View style={styles.profileCard}>
          <View style={styles.profileMain}>
            <View style={styles.profileHeader}>
              <View style={styles.profilePhotoContainer}>
                <Image
                  source={{ uri: 'https://media.licdn.com/dms/image/D4E03AQG4W-qsn00PyQ/profile-displayphoto-shrink_200_200/0/1708184861362?e=1727308800&v=beta&t=yx4XtIBp6Kthjsz7999k7Zs3fDYGjQz4S1R3mMys3Ag' }}
                  style={styles.profilePhoto}
                />
                <TouchableOpacity 
                  style={styles.editPhotoButton}
                  onPress={handleEditProfile}
                >
                  <Icon name="edit" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.profileInfo}>
                <View style={styles.nameContainer}>
                  <Text style={styles.profileName}>
                    {isLoading ? 'Chargement...' : (userData?.fullName || 'Utilisateur')}
                  </Text>
                  {isAdmin() && (
                    <View style={styles.verifiedBadge}>
                      <Icon name="verified-user" size={14} color="#fff" />
                    </View>
                  )}
                </View>
                <Text style={styles.profileEmail}>
                  {isLoading ? 'Chargement...' : (userData?.email || 'email@example.com')}
                </Text>
                <Text style={styles.profileLocation}>
                  {isLoading ? 'Chargement...' : (userData?.country || 'Non spécifié')}
                </Text>
                {isAdmin() && (
                  <View style={styles.adminBadge}>
                    <Text style={styles.adminBadgeText}>Administrateur</Text>
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.statContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>Consultations</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Articles</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Onglets de navigation - Simplifiés */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'consultations' && styles.activeTab]}
            onPress={() => setActiveTab('consultations')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'consultations' && styles.activeTabText
            ]}>
              Consultations
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'articles' && styles.activeTab]}
            onPress={() => setActiveTab('articles')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'articles' && styles.activeTabText
            ]}>
              Articles
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Contenu des onglets */}
        {renderTabContent()}
        
        {/* Section des paramètres */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          
          <View style={styles.settingsSection}>
            {renderSettingItem("person", "Modifier le profil", handleEditProfile)}
            {renderSettingItem("notifications", "Notifications", () => navigation.navigate('Notifications'))}
            {renderSettingItem("security", "Confidentialité", () => navigation.navigate('Privacy'))}
            {renderSettingItem("help", "Aide et support", () => navigation.navigate('Support'))}
            {isAdmin() && renderSettingItem("admin-panel", "Panneau d'administration", () => navigation.navigate('AdminPanel'))}
            {renderSettingItem("logout", "Déconnexion", handleLogout, "#c62828")}
          </View>
        </View>
        
        <View style={{ height: 20 }} />
      </ScrollView>
      
      {/* Modal des options */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showOptionsModal}
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowOptionsModal(false)}
        >
          <View style={styles.modalMenu}>
            <TouchableOpacity style={styles.modalMenuItem} onPress={() => {
              setShowOptionsModal(false);
              navigation.navigate('Settings');
            }}>
              <Icon name="settings" size={22} color="#333" />
              <Text style={styles.modalMenuText}>Paramètres</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalMenuItem} onPress={() => {
              setShowOptionsModal(false);
              navigation.navigate('EditProfile');
            }}>
              <Icon name="edit" size={22} color="#333" />
              <Text style={styles.modalMenuText}>Modifier le profil</Text>
            </TouchableOpacity>
            
            {isAdmin() && (
              <TouchableOpacity style={styles.modalMenuItem} onPress={() => {
                setShowOptionsModal(false);
                navigation.navigate('AdminPanel');
              }}>
                <Icon name="admin-panel-settings" size={22} color="#333" />
                <Text style={styles.modalMenuText}>Administration</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={[styles.modalMenuItem, styles.modalMenuItemDanger]} onPress={() => {
              setShowOptionsModal(false);
              handleLogout();
            }}>
              <Icon name="logout" size={22} color="#c62828" />
              <Text style={[styles.modalMenuText, styles.modalMenuTextDanger]}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 0 : 15,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 5,
    width: 40,
    alignItems: 'flex-start',
  },
  headerButton: {
    padding: 5,
    width: 40,
    alignItems: 'flex-end',
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 15,
    marginTop: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profileMain: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhotoContainer: {
    position: 'relative',
    marginRight: 15,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#c62828',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  verifiedBadge: {
    backgroundColor: '#4caf50',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  adminBadge: {
    backgroundColor: '#2196F3',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  adminBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  profileLocation: {
    fontSize: 14,
    color: '#888',
  },
  statContainer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#f0f0f0',
    alignSelf: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#c62828',
  },
  tabText: {
    fontSize: 15,
    color: '#888',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#c62828',
    fontWeight: '600',
  },
  tabContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  consultationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  consultationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#c62828',
  },
  consultationContent: {
    flex: 1,
  },
  consultationTitle: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    marginBottom: 3,
  },
  consultationDate: {
    fontSize: 13,
    color: '#888',
  },
  consultationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  articleItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#673ab7',
  },
  articleHeader: {
    marginBottom: 8,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  articleAuthor: {
    fontSize: 13,
    color: '#666',
  },
  articleMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#999',
    marginHorizontal: 6,
  },
  articleDate: {
    fontSize: 12,
    color: '#888',
  },
  articleFooter: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  readTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTime: {
    fontSize: 12,
    color: '#888',
    marginLeft: 5,
  },
  actionButton: {
    backgroundColor: '#c62828',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  sectionContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  settingsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  settingIconContainer: {
    width: 35,
    alignItems: 'center',
  },
  settingsText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyStateText: {
    marginTop: 10,
    color: '#888',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalMenu: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  modalMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalMenuItemDanger: {
    borderBottomWidth: 0,
  },
  modalMenuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  modalMenuTextDanger: {
    color: '#c62828',
  }
});

export default ProfileScreen;