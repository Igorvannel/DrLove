import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Image, KeyboardAvoidingView, Platform } from 'react-native';

const PrivateMessageScreen = () => {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Bonjour!', author: 'Moi' },
    { id: '2', text: 'Salut! Comment ça va?', author: 'Utilisateur' },
    // Ajoutez des messages supplémentaires ici
  ]);
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: (messages.length + 1).toString(),
        text: messageText,
        author: 'Moi', // Remplacez par l'auteur actuel si disponible
      };
      setMessages([...messages, newMessage]);
      setMessageText('');
    } else {
      alert('Veuillez entrer un message.');
    }
  };

  const renderMessageItem = ({ item }) => (
    <View style={styles.messageItem}>
      <Image
        source={{ uri: 'https://via.placeholder.com/40' }} // Remplacez par l'URL de l'avatar utilisateur
        style={styles.avatar}
      />
      <View style={styles.messageContent}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages Privés</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
      />

      <View style={styles.messageSection}>
        <TextInput
          style={styles.input}
          placeholder="Écrire un message..."
          value={messageText}
          onChangeText={setMessageText}
        />
        <Button title="Envoyer" onPress={handleSendMessage} color="#c62828" />
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
    backgroundColor: '#c62828', // Couleur de fond de l'en-tête
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: '#fff', // Texte blanc
    fontWeight: 'bold',
  },
  messageList: {
    padding: 10,
    paddingBottom: 80, // Assurez-vous qu'il y a assez d'espace pour le champ de message fixe
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContent: {
    backgroundColor: '#f1f1f1', // Couleur de fond du message
    borderRadius: 10,
    padding: 10,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  messageSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 10,
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

export default PrivateMessageScreen;
