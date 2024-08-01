import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, Modal, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ForumScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([
        {
          id: '1',
          title: 'Comment surmonter une rupture?',
          author: 'Marie',
          comments: [
            { id: '1', author: 'Julie', text: 'Très bon article, merci!' },
            { id: '2', author: 'Jean', text: 'Je suis d\'accord avec les conseils.' },
          ],
          content: 'Voici comment surmonter une rupture...',
        },
        // Autres posts...
      ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');

    const handleCreatePost = () => {
        if (postTitle.trim() && postContent.trim()) {
            const newPost = {
                id: (posts.length + 1).toString(),
                title: postTitle,
                author: 'Auteur Actuel', // Remplacez par l'auteur actuel si disponible
                comments: [],
                content: postContent, // Ajoutez le contenu du post
            };
            setPosts([...posts, newPost]);
            setPostTitle('');
            setPostContent('');
            setModalVisible(false);
        } else {
            alert('Veuillez remplir tous les champs.');
        }
    };

    const handlePostPress = (post) => {
        navigation.navigate('PostDetail', { post });
    };

    const renderPostItem = ({ item }) => (
        <TouchableOpacity
            style={styles.postItem}
            onPress={() => handlePostPress(item)}
        >
            <Image
                source={{ uri: 'https://via.placeholder.com/40' }} // Remplacez par l'URL de l'avatar utilisateur
                style={styles.avatar}
            />
            <View style={styles.postContent}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postAuthor}>Auteur : {item.author}</Text>
                <View style={styles.interactionContainer}>
                    <TouchableOpacity style={styles.interactionButton}>
                        <Icon name="comment" size={18} color="#555" />
                        <Text style={styles.interactionText}>{item.comments.length} Commentaires</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Forum</Text>
            </View>
            <FlatList
                data={posts}
                renderItem={renderPostItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.postList}
            />
            <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.createButtonText}>Créer un nouveau post</Text>
            </TouchableOpacity>

            {/* Modal pour créer un nouveau post */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Créer un Post</Text>
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
                        <View style={styles.modalButtons}>
                            <Button title="Annuler" onPress={() => setModalVisible(false)} color="#c62828" />
                            <Button title="Soumettre" onPress={handleCreatePost} color="#c62828" />
                        </View>
                    </View>
                </View>
            </Modal>
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
    postList: {
        padding: 10,
    },
    postItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f8bbd0', // Rose clair pour les éléments de post
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    postContent: {
        flex: 1,
    },
    postTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000', // Texte noir
    },
    postAuthor: {
        fontSize: 14,
        color: '#777', // Texte gris clair pour l'auteur
        marginVertical: 5,
    },
    interactionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
    createButton: {
        backgroundColor: '#c62828', // Rouge foncé pour le bouton
        padding: 15,
        borderRadius: 5,
        margin: 10,
        alignItems: 'center',
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Fond semi-transparent
    },
    modalContent: {
        width: '80%',
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
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default ForumScreen;
