// app/components/NavBar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NavBar = ({ navigation }) => {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navButtonContainer}>
        <Icon name="home" size={24} color="#fff" />
        <Text style={styles.navButtonText}>Accueil</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Forum')} style={styles.navButtonContainer}>
        <Icon name="forum" size={24} color="#fff" />
        <Text style={styles.navButtonText}>Forum</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Messages')} style={styles.navButtonContainer}>
        <Icon name="message" size={24} color="#fff" />
        <Text style={styles.navButtonText}>Messages</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.navButtonContainer}>
        <Icon name="person" size={24} color="#fff" />
        <Text style={styles.navButtonText}>Profil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#c62828', // Couleur de fond pour la barre de navigation
    paddingVertical: 10,
  },
  navButtonContainer: {
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
});

export default NavBar;
