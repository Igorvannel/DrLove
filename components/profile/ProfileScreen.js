import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';

const ProfileScreen = ({ navigation }) => {

  // Function to handle logout
  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        { 
          text: "Déconnexion", 
          onPress: () => {
            // Replace with your logout logic
            console.log("Déconnecté");
          } 
        }
      ]
    );
  };

  // Function to handle change language
  const handleChangeLanguage = () => {
    // Replace with your language change logic
    console.log("Changer la langue");
  };

  // Function to handle edit profile
  const handleEditProfile = () => {
    navigation.navigate('EditProfile'); // Ensure 'EditProfile' screen is defined in your navigator
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Information */}
      <View style={styles.profileInfo}>
        <Image
          source={{ uri: 'https://media.licdn.com/dms/image/D4E03AQG4W-qsn00PyQ/profile-displayphoto-shrink_200_200/0/1708184861362?e=1727308800&v=beta&t=yx4XtIBp6Kthjsz7999k7Zs3fDYGjQz4S1R3mMys3Ag' }} // Remplacez par l'URL de la photo de profil
          style={styles.profilePhoto}
        />
        <Text style={styles.profileName}>Igor Vannel</Text>
        <Text style={styles.profileBio}>je suis un passionné de l'informatique...</Text>
      </View>

      {/* Account Settings */}
      <View style={styles.settingsSection}>
        <TouchableOpacity style={styles.settingsItem} onPress={handleEditProfile}>
          <Text style={styles.settingsText}>Modifier le profil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem} onPress={handleChangeLanguage}>
          <Text style={styles.settingsText}>Changer la langue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem} onPress={handleLogout}>
          <Text style={styles.settingsText}>Déconnexion</Text>
        </TouchableOpacity>
        {/* Ajoutez d'autres paramètres de compte ici */}
      </View>

      {/* Consultation History */}
      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>Historique des Consultations</Text>
        {/* Liste des consultations */}
        <Text style={styles.historyItem}>Consultation 1</Text>
        <Text style={styles.historyItem}>Consultation 2</Text>
        {/* Ajoutez d'autres consultations ici */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  profileBio: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  settingsSection: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  settingsItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  settingsText: {
    fontSize: 16,
    color: '#000',
  },
  historySection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  historyItem: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
});

export default ProfileScreen;
