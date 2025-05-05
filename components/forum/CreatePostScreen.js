import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  StatusBar,
  Animated,
  ScrollView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CreatePostScreen = ({ navigation }) => {
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (postTitle.trim() && postContent.trim()) {
      setIsSubmitting(true);
      
      try {
        // Simuler un délai de traitement (à remplacer par votre logique API)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Titre du post:', postTitle);
        console.log('Contenu du post:', postContent);
        
        // Réinitialisation des champs
        setPostTitle('');
        setPostContent('');
        
        // Retour à l'écran précédent après soumission
        navigation.goBack();
      } catch (error) {
        Alert.alert('Erreur', 'Un problème est survenu lors de la publication');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      Alert.alert(
        'Champs requis', 
        'Veuillez remplir le titre et le contenu du post.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar backgroundColor="#c62828" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="chevron-left" size={18} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Créer un Post</Text>
        
        <TouchableOpacity 
          style={[styles.submitHeaderButton, (!postTitle.trim() || !postContent.trim()) && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!postTitle.trim() || !postContent.trim() || isSubmitting}
          activeOpacity={0.7}
        >
          {isSubmitting ? (
            <Icon name="spinner" size={18} color="#fff" />
          ) : (
            <Icon name="check" size={18} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.formContainer}
        contentContainerStyle={styles.formContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Titre</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Donnez un titre à votre post..."
            placeholderTextColor="#999"
            value={postTitle}
            onChangeText={setPostTitle}
            maxLength={100}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Contenu</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="Partagez vos pensées, questions ou conseils..."
            placeholderTextColor="#999"
            value={postContent}
            onChangeText={setPostContent}
            multiline
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.tagsSection}>
          <Text style={styles.inputLabel}>Tags (optionnel)</Text>
          <View style={styles.tagsContainer}>
            <TouchableOpacity style={styles.tagChip}>
              <Text style={styles.tagText}>Conseil</Text>
              <Icon name="plus" size={10} color="#c62828" style={styles.tagIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tagChip}>
              <Text style={styles.tagText}>Question</Text>
              <Icon name="plus" size={10} color="#c62828" style={styles.tagIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tagChip}>
              <Text style={styles.tagText}>Discussion</Text>
              <Icon name="plus" size={10} color="#c62828" style={styles.tagIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="image" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="link" size={20} color="#666" />
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity 
          style={[styles.submitButton, (!postTitle.trim() || !postContent.trim()) && styles.disabledSubmitButton]}
          onPress={handleSubmit}
          disabled={!postTitle.trim() || !postContent.trim() || isSubmitting}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Publication...' : 'Publier'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#c62828',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  submitHeaderButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  formContainer: {
    flex: 1,
  },
  formContentContainer: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contentInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 180,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tagsSection: {
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#666',
  },
  tagIcon: {
    marginLeft: 6,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  separator: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#c62828',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  disabledSubmitButton: {
    backgroundColor: '#ddd',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default CreatePostScreen;