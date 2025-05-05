import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  Animated,
  Keyboard,
  Modal,
  Pressable,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

const PrivateMessageScreen = ({ navigation, route }) => {
  // État des messages
  const [messages, setMessages] = useState([
    { id: '1', text: 'Bonjour! Comment puis-je vous aider?', sender: 'them', timestamp: new Date(Date.now() - 360000).toISOString(), read: true },
    { id: '2', text: 'J\'ai besoin de conseils sur ma relation', sender: 'me', timestamp: new Date(Date.now() - 300000).toISOString(), read: true },
    { id: '3', text: 'Bien sûr, je suis là pour ça. Pouvez-vous me donner plus de détails sur votre situation?', sender: 'them', timestamp: new Date(Date.now() - 240000).toISOString(), read: true },
    { id: '4', text: 'Nous sommes ensemble depuis 2 ans mais dernièrement la communication devient difficile', sender: 'me', timestamp: new Date(Date.now() - 180000).toISOString(), read: true },
    { id: '5', text: 'La communication est la base d\'une relation saine. Avez-vous essayé de prévoir un moment calme pour discuter de vos préoccupations?', sender: 'them', timestamp: new Date(Date.now() - 120000).toISOString(), read: true },
  ]);
  
  // Récupérer les informations du contact si disponibles via route.params
  const contactInfo = route?.params?.contact || { 
    name: 'Dr. Love', 
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    status: 'En ligne',
    isVerified: true,
    specialty: 'Relations amoureuses'
  };
  
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [sending, setSending] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Références
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scrollButtonAnim = useRef(new Animated.Value(0)).current;
  const attachButtonAnim = useRef(new Animated.Value(0)).current;
  
  // Dates pour les séparateurs
  const getMessageDay = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };
  
  const shouldShowDateSeparator = (index) => {
    if (index === 0) return true;
    
    const currentMessage = messages[index];
    const previousMessage = messages[index - 1];
    
    const currentDate = new Date(currentMessage.timestamp).toLocaleDateString();
    const previousDate = new Date(previousMessage.timestamp).toLocaleDateString();
    
    return currentDate !== previousDate;
  };
  
  // Effet pour initialiser les animations
  useEffect(() => {
    Animated.spring(attachButtonAnim, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, []);
  
  // Effet pour faire défiler vers le dernier message
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages]);
  
  // Animation lors de l'envoi
  const animateSend = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  // Gérer l'envoi de message
  const handleSendMessage = () => {
    if (messageText.trim()) {
      animateSend();
      setSending(true);
      
      // Simuler l'envoi du message
      setTimeout(() => {
        const newMessage = {
          id: (messages.length + 1).toString(),
          text: messageText.trim(),
          sender: 'me',
          timestamp: new Date().toISOString(),
          read: false
        };
        
        setMessages([...messages, newMessage]);
        setMessageText('');
        setSending(false);
        
        // Simuler une réponse après un délai aléatoire (uniquement pour la démo)
        setTimeout(() => {
          setIsTyping(true);
          
          // Effacer l'indicateur "typing" après un certain temps et envoyer la réponse
          const responseDelay = Math.random() * 2000 + 1000;
          setTimeout(() => {
            setIsTyping(false);
            
            const responseMessage = {
              id: (messages.length + 2).toString(),
              text: "Merci pour ces informations. Je comprends que c'est une situation difficile. Peut-être pourriez-vous essayer d'organiser un dîner spécial pour discuter calmement?",
              sender: 'them',
              timestamp: new Date().toISOString(),
              read: true
            };
            
            setMessages(prev => [...prev, responseMessage]);
          }, responseDelay);
        }, 1000);
      }, 500);
    }
  };

  // Gérer le défilement de la liste
  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const threshold = 300; // Distance de défilement à partir de laquelle le bouton apparaît
    
    if (scrollY < -10) {
      // L'utilisateur tire vers le bas pour actualiser
      // Vous pourriez implémenter une logique de rafraîchissement ici
      return;
    }
    
    // Si l'utilisateur descend suffisamment la liste, afficher le bouton pour revenir en bas
    if (scrollY < (event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height - threshold)) {
      if (!showScrollButton) {
        setShowScrollButton(true);
        Animated.spring(scrollButtonAnim, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }).start();
      }
    } else {
      if (showScrollButton) {
        Animated.timing(scrollButtonAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setShowScrollButton(false);
        });
      }
    }
  };

  // Fonction pour faire défiler jusqu'au dernier message
  const scrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
    Animated.timing(scrollButtonAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowScrollButton(false);
    });
  };

  // Formater les dates
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Déterminer si un message doit afficher l'avatar et le timestamp
  const shouldShowAvatarAndTime = (index) => {
    if (index === 0) return true;
    const currentMessage = messages[index];
    const previousMessage = messages[index - 1];
    
    // Si l'expéditeur change ou si plus de 5 minutes se sont écoulées
    return currentMessage.sender !== previousMessage.sender || 
           (new Date(currentMessage.timestamp) - new Date(previousMessage.timestamp)) > 5 * 60 * 1000;
  };

  // Rendu d'un message
  const renderMessageItem = ({ item, index }) => {
    const isMyMessage = item.sender === 'me';
    const showAvatarAndTime = shouldShowAvatarAndTime(index);
    const showDateSeparator = shouldShowDateSeparator(index);
    
    return (
      <>
        {showDateSeparator && (
          <View style={styles.dateSeparator}>
            <View style={styles.dateSeparatorLine} />
            <Text style={styles.dateSeparatorText}>
              {getMessageDay(item.timestamp)}
            </Text>
            <View style={styles.dateSeparatorLine} />
          </View>
        )}
        
        <View style={[
          styles.messageRow,
          isMyMessage ? styles.myMessageRow : styles.theirMessageRow
        ]}>
          {!isMyMessage && showAvatarAndTime && (
            <TouchableOpacity onPress={() => setShowProfileModal(true)}>
              <Image
                source={{ uri: contactInfo.avatar }}
                style={styles.avatar}
              />
            </TouchableOpacity>
          )}
          {!isMyMessage && !showAvatarAndTime && <View style={styles.avatarPlaceholder} />}
          
          <View style={[
            styles.messageContent,
            isMyMessage ? styles.myMessage : styles.theirMessage,
            !showAvatarAndTime && isMyMessage && styles.myFollowUpMessage,
            !showAvatarAndTime && !isMyMessage && styles.theirFollowUpMessage
          ]}>
            <Text style={[
              styles.messageText,
              isMyMessage && styles.myMessageText
            ]}>{item.text}</Text>
            
            <View style={styles.messageFooter}>
              {showAvatarAndTime && (
                <Text style={[
                  styles.timestamp,
                  isMyMessage && styles.myTimestamp
                ]}>
                  {formatMessageTime(item.timestamp)}
                </Text>
              )}
              
              {isMyMessage && (
                <View style={styles.readStatus}>
                  <Icon 
                    name={item.read ? "done-all" : "done"} 
                    size={16} 
                    color={item.read ? "#4fc3f7" : "rgba(255,255,255,0.5)"}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </>
    );
  };

  // Rendu du séparateur
  const renderSeparator = () => (
    <View style={styles.messageSeparator} />
  );

  // En-tête avec les détails du contact
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.headerProfile}
        onPress={() => setShowProfileModal(true)}
      >
        <Image
          source={{ uri: contactInfo.avatar }}
          style={styles.headerAvatar}
        />
        
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.headerName}>{contactInfo.name}</Text>
            {contactInfo.isVerified && (
              <Icon name="verified" size={16} color="#4fc3f7" style={styles.verifiedIcon} />
            )}
          </View>
          <Text style={styles.headerStatus}>{contactInfo.status}</Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.headerButtons}>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="videocam" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="call" size={22} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="more-vert" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Options d'attachement
  const renderAttachmentOptions = () => (
    <Animated.View 
      style={[
        styles.attachmentOptions,
        {
          transform: [
            {
              translateY: attachButtonAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0]
              })
            }
          ],
          opacity: attachButtonAnim
        }
      ]}
    >
      <TouchableOpacity style={styles.attachOption}>
        <View style={[styles.attachIcon, { backgroundColor: '#4caf50' }]}>
          <Icon name="image" size={22} color="#fff" />
        </View>
        <Text style={styles.attachText}>Photo</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.attachOption}>
        <View style={[styles.attachIcon, { backgroundColor: '#f44336' }]}>
          <Icon name="videocam" size={22} color="#fff" />
        </View>
        <Text style={styles.attachText}>Vidéo</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.attachOption}>
        <View style={[styles.attachIcon, { backgroundColor: '#ff9800' }]}>
          <Icon name="insert-drive-file" size={22} color="#fff" />
        </View>
        <Text style={styles.attachText}>Document</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.attachOption}>
        <View style={[styles.attachIcon, { backgroundColor: '#9c27b0' }]}>
          <Icon name="mic" size={22} color="#fff" />
        </View>
        <Text style={styles.attachText}>Audio</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar backgroundColor="#b71c1c" barStyle="light-content" />
      
      {/* En-tête */}
      {renderHeader()}
      
      {/* Liste des messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      
      {/* Bouton pour défiler jusqu'en bas */}
      {showScrollButton && (
        <Animated.View 
          style={[
            styles.scrollButton,
            {
              transform: [
                { scale: scrollButtonAnim },
                { translateY: scrollButtonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })}
              ],
              opacity: scrollButtonAnim
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.scrollButtonInner}
            onPress={scrollToEnd}
          >
            <Icon name="arrow-downward" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      )}
      
      {/* Indicateur "typing" */}
      {isTyping && (
        <View style={styles.typingIndicator}>
          <Image
            source={{ uri: contactInfo.avatar }}
            style={styles.typingAvatar}
          />
          <View style={styles.typingBubble}>
            <View style={styles.typingDots}>
              <View style={[styles.typingDot, styles.typingDot1]} />
              <View style={[styles.typingDot, styles.typingDot2]} />
              <View style={[styles.typingDot, styles.typingDot3]} />
            </View>
          </View>
        </View>
      )}
      
      {/* Section pour écrire et envoyer un message */}
      <View style={styles.messageSection}>
        <TouchableOpacity 
          style={styles.attachButton}
          onPress={() => setShowAttachments(!showAttachments)}
        >
          <Icon name={showAttachments ? "close" : "add"} size={24} color="#666" />
        </TouchableOpacity>
        
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Écrire un message..."
            value={messageText}
            onChangeText={setMessageText}
            multiline
          />
          
          <TouchableOpacity 
            style={styles.emojiButton}
            onPress={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Icon name="sentiment-satisfied-alt" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          {sending ? (
            <View style={[styles.sendButton, styles.sendButtonActive]}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : (
            <TouchableOpacity 
              style={[
                styles.sendButton,
                messageText.trim() ? styles.sendButtonActive : {}
              ]}
              onPress={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Icon 
                name="send" 
                size={20} 
                color={messageText.trim() ? "#fff" : "#aaa"} 
              />
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
      
      {/* Options d'attachement */}
      {showAttachments && renderAttachmentOptions()}
      
      {/* Modal du profil */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showProfileModal}
        onRequestClose={() => setShowProfileModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowProfileModal(false)}
        >
          <Pressable 
            style={styles.profileModal}
            onPress={e => e.stopPropagation()}
          >
            <View style={styles.profileHeader}>
              <Image
                source={{ uri: contactInfo.avatar }}
                style={styles.profileAvatar}
              />
              
              <View style={styles.profileNameContainer}>
                <View style={styles.profileNameRow}>
                  <Text style={styles.profileName}>{contactInfo.name}</Text>
                  {contactInfo.isVerified && (
                    <Icon name="verified" size={18} color="#4fc3f7" style={styles.profileVerified} />
                  )}
                </View>
                <Text style={styles.profileSpecialty}>{contactInfo.specialty}</Text>
                <Text style={styles.profileStatus}>{contactInfo.status}</Text>
              </View>
            </View>
            
            <View style={styles.profileActions}>
              <TouchableOpacity style={styles.profileAction}>
                <Icon name="chat" size={22} color="#c62828" />
                <Text style={styles.profileActionText}>Message</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.profileAction}>
                <Icon name="call" size={22} color="#c62828" />
                <Text style={styles.profileActionText}>Appel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.profileAction}>
                <Icon name="videocam" size={22} color="#c62828" />
                <Text style={styles.profileActionText}>Vidéo</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <View style={styles.profileInfoItem}>
                <Icon name="star" size={20} color="#FFD700" style={styles.profileInfoIcon} />
                <Text style={styles.profileInfoText}>4.9/5 (126 avis)</Text>
              </View>
              
              <View style={styles.profileInfoItem}>
                <Icon name="history" size={20} color="#666" style={styles.profileInfoIcon} />
                <Text style={styles.profileInfoText}>Disponible 9h-18h</Text>
              </View>
              
              <View style={styles.profileInfoItem}>
                <Icon name="people" size={20} color="#666" style={styles.profileInfoIcon} />
                <Text style={styles.profileInfoText}>1352 consultations</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.closeProfileButton}
              onPress={() => setShowProfileModal(false)}
            >
              <Text style={styles.closeProfileText}>Fermer</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
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
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    paddingBottom: 10,
    backgroundColor: '#c62828',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  backButton: {
    padding: 5,
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 5,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerInfo: {
    marginLeft: 15,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  verifiedIcon: {
    marginLeft: 5,
  },
  headerStatus: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 5,
  },
  messageList: {
    padding: 10,
    paddingBottom: 120,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 2,
    alignItems: 'flex-end',
  },
  myMessageRow: {
    justifyContent: 'flex-end',
    marginLeft: 50,
  },
  theirMessageRow: {
    justifyContent: 'flex-start',
    marginRight: 50,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    bottom: 5,
  },
  avatarPlaceholder: {
    width: 36,
    height: 0,
    marginRight: 8,
  },
  messageContent: {
    borderRadius: 18,
    padding: 12,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#c62828',
    borderBottomRightRadius: 5,
    marginBottom: 8,
  },
  theirMessage: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  myFollowUpMessage: {
    borderTopRightRadius: 5,
    marginBottom: 2,
  },
  theirFollowUpMessage: {
    borderTopLeftRadius: 5,
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  myMessageText: {
    color: '#fff',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.5)',
  },
  myTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },
  readStatus: {
    marginLeft: 5,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  dateSeparatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dateSeparatorText: {
    fontSize: 12,
    color: '#888',
    marginHorizontal: 15,
    fontWeight: '500',
  },
  messageSeparator: {
    height: 8,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  typingAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  typingBubble: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  typingDots: {
    flexDirection: 'row',
    width: 35,
    justifyContent: 'center',
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#999',
    marginHorizontal: 2,
  },
  typingDot1: {
    opacity: 0.4,
    transform: [{ scale: 0.9 }],
  },
  typingDot2: {
    opacity: 0.7,
    transform: [{ scale: 1 }],
  },
  typingDot3: {
    opacity: 0.4,
    transform: [{ scale: 0.9 }],
  },
  messageSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  emojiButton: {
    padding: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sendButtonActive: {
    backgroundColor: '#c62828',
  },
  scrollButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    backgroundColor: 'rgba(198, 40, 40, 0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  scrollButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentOptions: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 20,
  },
  attachOption: {
    alignItems: 'center',
    width: 70,
  },
  attachIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  attachText: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileModal: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#c62828',
    marginBottom: 15,
  },
  profileNameContainer: {
    alignItems: 'center',
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  profileVerified: {
    marginLeft: 5,
  },
  profileSpecialty: {
    fontSize: 16,
    color: '#666',
    marginTop: 3,
  },
  profileStatus: {
    fontSize: 14,
    color: '#4caf50',
    marginTop: 5,
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  profileAction: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  profileActionText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  profileInfo: {
    width: '100%',
    marginTop: 10,
  },
  profileInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileInfoIcon: {
    marginRight: 10,
  },
  profileInfoText: {
    fontSize: 14,
    color: '#333',
  },
  closeProfileButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  closeProfileText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default PrivateMessageScreen;