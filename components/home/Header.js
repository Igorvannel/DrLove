// app/components/Header.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Header = ({ navigation }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Dr Love & Motivation</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="person" size={40} color="#fff" style={styles.profileIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <View style={styles.notificationIconContainer}>
            <Icon name="notifications" size={40} color="#fff" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>2</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Center items vertically
    paddingHorizontal: 20,
    paddingVertical: 30, // Increased paddingVertical
    backgroundColor: '#c62828', // Couleur de fond pour l'en-tête
  },
  headerTitle: {
    fontSize: 20, // Increased font size for better visibility
    color: '#fff',
    fontFamily: 'Arial', // Remplacez par votre police artistique
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    marginRight: 20,
  },
  notificationIconContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff0000',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Header;
