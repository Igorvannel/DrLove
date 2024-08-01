import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, FlatList } from 'react-native';

const PostDetailScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: (comments.length + 1).toString(),
        author: 'Auteur Actuel', // Remplacez par l'auteur actuel si disponible
        text: commentText,
      };
      setComments([...comments, newComment]);
      setCommentText('');
    } else {
      alert('Veuillez entrer un commentaire.');
    }
  };

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentAuthor}>{item.author}</Text>
      <Text style={styles.commentText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.author}>Auteur : {post.author}</Text>
        <Text style={styles.content}>{post.content}</Text>

        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.commentsList}
        />
      </ScrollView>

      <View style={styles.commentSection}>
        <TextInput
          style={styles.input}
          placeholder="Écrire un commentaire..."
          value={commentText}
          onChangeText={setCommentText}
        />
        <Button title="Ajouter Commentaire" onPress={handleAddComment} color="#c62828" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80, // Ajoutez une marge en bas pour éviter que le contenu soit caché sous le bouton
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  author: {
    fontSize: 16,
    color: '#777',
    marginBottom: 15,
  },
  content: {
    fontSize: 16,
    color: '#000',
    marginBottom: 15,
  },
  commentsList: {
    marginBottom: 80, // Assurez-vous qu'il y a suffisamment d'espace pour le bouton fixe
  },
  commentItem: {
    marginBottom: 10,
  },
  commentAuthor: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentText: {
    fontSize: 16,
    color: '#555',
  },
  commentSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    flex: 1,
    marginRight: 10,
  },
});

export default PostDetailScreen;
