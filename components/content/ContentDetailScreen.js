import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ContentDetailScreen = ({ route }) => {
  const { title, image } = route.params;

  const [adviceList, setAdviceList] = useState([
    { id: '1', text: 'La vie est courte pour s\'amuser', date: '2024-07-21', time: '10:00 AM', comments: 5, views: 120, commentList: [
        { id: '1', text: 'Très inspirant !', date: '2024-07-21', time: '10:30 AM', subComments: [] },
        { id: '2', text: 'J\'adore cette citation !', date: '2024-07-21', time: '11:00 AM', subComments: [] }
      ] 
    },
    // Ajoutez d'autres éléments comme nécessaire
  ]);

  const [selectedAdvice, setSelectedAdvice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  const handleOpenComments = (advice) => {
    setSelectedAdvice(advice);
    setModalVisible(true);
  };

  const handleAddComment = () => {
    if (selectedAdvice && newCommentText.trim()) {
      const updatedAdviceList = adviceList.map(advice => {
        if (advice.id === selectedAdvice.id) {
          return {
            ...advice,
            commentList: [
              ...advice.commentList,
              {
                id: (advice.commentList.length + 1).toString(),
                text: newCommentText,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
              }
            ],
            comments: advice.comments + 1,
          };
        }
        return advice;
      });
      setAdviceList(updatedAdviceList);
      setNewCommentText('');
      setModalVisible(false);
    }
  };

  const renderAdviceItem = ({ item }) => (
    <View style={styles.adviceItem}>
      <Text style={styles.adviceText}>{item.text}</Text>
      <Text style={styles.adviceDate}>Publié le : {item.date} à {item.time}</Text>
      <View style={styles.interactionContainer}>
        <TouchableOpacity style={styles.interactionButton} onPress={() => handleOpenComments(item)}>
          <Icon name="comment" size={18} color="#555" />
          <Text style={styles.interactionText}>{item.comments} Commentaires</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.interactionButton}>
          <Icon name="eye" size={18} color="#555" />
          <Text style={styles.interactionText}>{item.views} Vues</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <FlatList
            data={adviceList}
            renderItem={renderAdviceItem}
            keyExtractor={item => item.id}
          />
          <View style={styles.spacer} /> 
        </ScrollView>
      </View>
      
      {/* Modal pour afficher les commentaires */}
      {selectedAdvice && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Commentaires</Text>
              <ScrollView>
                {selectedAdvice.commentList.map(comment => (
                  <View key={comment.id} style={styles.commentItem}>
                    <Text style={styles.commentText}>{comment.text}</Text>
                    <Text style={styles.commentDate}>Posté le : {comment.date} à {comment.time}</Text>
                  </View>
                ))}
              </ScrollView>
              <TextInput
                style={styles.modalInput}
                placeholder="Ajouter un commentaire..."
                value={newCommentText}
                onChangeText={setNewCommentText}
              />
              <TouchableOpacity style={styles.modalButton} onPress={handleAddComment}>
                <Text style={styles.modalButtonText}>Ajouter Commentaire</Text>
              </TouchableOpacity>
              <Pressable style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseButtonText}>Fermer</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#c62828', // Rouge foncé pour l'en-tête
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Ensures the header stays above other content
  },
  title: {
    fontSize: 24,
    color: '#fff', // Texte blanc
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    marginTop: 80, // Adjust based on header height
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 70, // Space for the input area
  },
  adviceItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8bbd0', // Rose clair pour les éléments de conseil
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  adviceText: {
    fontSize: 16,
    color: '#000', // Texte noir
  },
  adviceDate: {
    fontSize: 12,
    color: '#777', // Texte gris clair pour la date
    marginTop: 5,
  },
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
  spacer: {
    height: 70, // Space for the input area
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentItem: {
    marginBottom: 10,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  commentDate: {
    fontSize: 12,
    color: '#888',
  },
  modalInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  modalButton: {
    backgroundColor: '#c62828', // Rouge foncé pour le bouton
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#c62828',
    fontWeight: 'bold',
  },
});

export default ContentDetailScreen;
