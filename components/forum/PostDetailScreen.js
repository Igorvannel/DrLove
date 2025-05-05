import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Animated, 
  StatusBar, 
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const PostDetailScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: (comments.length + 1).toString(),
        author: 'Vous',
        text: commentText,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      setCommentText('');
      
      // Scroll to the bottom after adding comment
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const renderCommentItem = ({ item, index }) => {
    // Animation pour les commentaires - avec valeurs garanties croissantes
    const fadeInAnim = scrollY.interpolate({
      inputRange: [0, Math.max(1, index) * 150, (Math.max(1, index) + 1) * 150],
      outputRange: [0.7, 0.9, 1],
      extrapolate: 'clamp'
    });

    return (
      <Animated.View style={[styles.commentItem, { opacity: fadeInAnim }]}>
        <View style={styles.commentHeader}>
          <View style={styles.commentAuthorContainer}>
            <View style={styles.avatarSmall}>
              <Text style={styles.avatarText}>{item.author.charAt(0)}</Text>
            </View>
            <Text style={styles.commentAuthor}>{item.author}</Text>
          </View>
          {item.timestamp && (
            <Text style={styles.commentTime}>{item.timestamp}</Text>
          )}
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar backgroundColor="#c62828" barStyle="light-content" />
      
      {/* Header animé */}
      <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={18} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {post.title}
        </Text>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="share" size={18} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* En-tête du post */}
        <View style={styles.postHeader}>
          <TouchableOpacity 
            style={styles.backButtonTop}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" size={18} color="#333" />
          </TouchableOpacity>
          
          <Text style={styles.title}>{post.title}</Text>
          
          <View style={styles.authorContainer}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{post.author.charAt(0)}</Text>
            </View>
            <View style={styles.authorInfo}>
              <Text style={styles.author}>{post.author}</Text>
              {post.date && <Text style={styles.date}>{post.date}</Text>}
            </View>
          </View>
        </View>
        
        {/* Contenu du post */}
        <View style={styles.contentContainer}>
          <Text style={styles.content}>{post.content}</Text>
          
          <View style={styles.interactionBar}>
            <TouchableOpacity 
              style={[styles.interactionButton, isLiked && styles.likedButton]}
              onPress={toggleLike}
            >
              <Icon name={isLiked ? "heart" : "heart-o"} size={18} color={isLiked ? "#c62828" : "#555"} />
              <Text style={[styles.interactionText, isLiked && styles.likedText]}>
                {likeCount > 0 ? likeCount : "J'aime"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.interactionButton}>
              <Icon name="comment-o" size={18} color="#555" />
              <Text style={styles.interactionText}>
                {comments.length > 0 ? comments.length : "Commenter"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.interactionButton}>
              <Icon name="bookmark-o" size={18} color="#555" />
              <Text style={styles.interactionText}>Sauvegarder</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Section des commentaires */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsSectionTitle}>
            Commentaires ({comments.length})
          </Text>
          
          {comments.length === 0 ? (
            <View style={styles.noCommentsContainer}>
              <Icon name="comments-o" size={40} color="#ddd" />
              <Text style={styles.noCommentsText}>Aucun commentaire pour l'instant</Text>
              <Text style={styles.noCommentsSubText}>Soyez le premier à commenter</Text>
            </View>
          ) : (
            <FlatList
              data={comments}
              renderItem={renderCommentItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          )}
        </View>
      </Animated.ScrollView>

      {/* Barre de commentaires */}
      <View style={styles.commentInputSection}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Écrire un commentaire..."
            placeholderTextColor="#999"
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              !commentText.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleAddComment}
            disabled={!commentText.trim()}
          >
            <Icon 
              name="paper-plane" 
              size={18} 
              color={commentText.trim() ? "#c62828" : "#ccc"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#c62828',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 1000,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    marginHorizontal: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  postHeader: {
    padding: 16,
    backgroundColor: '#fff',
  },
  backButtonTop: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
    marginTop: -8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 16,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#c62828',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  authorInfo: {
    flex: 1,
  },
  author: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  contentContainer: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  interactionBar: {
    flexDirection: 'row',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    paddingVertical: 8,
  },
  likedButton: {
    opacity: 1,
  },
  interactionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#555',
  },
  likedText: {
    color: '#c62828',
  },
  commentsSection: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 16,
  },
  commentsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  noCommentsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  noCommentsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  noCommentsSubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  commentItem: {
    marginBottom: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentAuthorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#c62828',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  commentInputSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 40,
    maxHeight: 120,
    fontSize: 15,
  },
  sendButton: {
    position: 'absolute',
    right: 10,
    height: 34,
    width: 34,
    borderRadius: 17,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
});

export default PostDetailScreen;