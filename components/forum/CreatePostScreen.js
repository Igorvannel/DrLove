import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

const CreatePostScreen = ({ navigation }) => {
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  const handleSubmit = () => {
    // Logique pour soumettre le post
    if (postTitle.trim() && postContent.trim()) {
      // Exemple de logique de soumission, à adapter selon votre backend ou état local
      console.log('Titre du post:', postTitle);
      console.log('Contenu du post:', postContent);

      // Réinitialisation des champs
      setPostTitle('');
      setPostContent('');

      // Retour à l'écran précédent après soumission
      navigation.goBack();
    } else {
      // Afficher un message d'erreur ou faire autre chose
      alert('Veuillez remplir tous les champs.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Créer un Post</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Titre du post"
          value={postTitle}
          onChangeText={setPostTitle}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Contenu du post"
          value={postContent}
          onChangeText={setPostContent}
          multiline
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Soumettre</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#c62828', // Rouge foncé pour l'en-tête
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: '#fff', // Texte blanc
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top', // Pour aligner le texte en haut
  },
  submitButton: {
    backgroundColor: '#c62828', // Rouge foncé pour le bouton
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CreatePostScreen;
