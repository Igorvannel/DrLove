import React from 'react';
import { View, Text, Pressable, StyleSheet, StatusBar, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Header = ({ navigation }) => {
  // Animation pour les boutons
  const profileScale = new Animated.Value(1);
  const notificationScale = new Animated.Value(1);
  
  // Fonctions pour animer les boutons au toucher
  const animatePress = (animatedValue) => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
  };

  return (
    <>
      <StatusBar backgroundColor="#b71c1c" barStyle="light-content" />
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          {/* Logo et Titre avec effet de profondeur */}
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Dr Love</Text>
            <Text style={styles.headerSubtitle}>& Motivation</Text>
          </View>
          
          {/* Icônes avec animation et ombres */}
          <View style={styles.iconContainer}>
            {/* Bouton Profil */}
            <Pressable 
              onPress={() => {
                animatePress(profileScale);
                navigation.navigate('Profile');
              }}
              style={({pressed}) => [
                styles.iconButton,
                pressed && styles.iconButtonPressed
              ]}
            >
              <Animated.View style={[{transform: [{ scale: profileScale }]}]}>
                <View style={styles.iconWrapper}>
                  <Icon name="person" size={22} color="#fff" />
                </View>
              </Animated.View>
            </Pressable>
            
            {/* Bouton Notifications avec badge animé */}
            <Pressable 
              onPress={() => {
                animatePress(notificationScale);
                navigation.navigate('Notifications');
              }}
              style={({pressed}) => [
                styles.iconButton,
                pressed && styles.iconButtonPressed
              ]}
            >
              <Animated.View style={[{transform: [{ scale: notificationScale }]}]}>
                <View style={styles.iconWrapper}>
                  <Icon name="notifications" size={22} color="#fff" />
                  {/* Badge de notification avec animation */}
                  <Animated.View style={[
                    styles.notificationBadge,
                    {transform: [{ scale: notificationScale }]}
                  ]}>
                    <Text style={styles.notificationBadgeText}>2</Text>
                  </Animated.View>
                </View>
              </Animated.View>
            </Pressable>
          </View>
        </View>
      </View>
      
      {/* Ombre douce sous le header avec effet de courbure */}
      <View style={styles.headerShadow} />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#c62828',
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  headerShadow: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.15)',
    width: '100%',
  },
  titleContainer: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginTop: -3,
    letterSpacing: 0.2,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 15,
    padding: 4,
  },
  iconButtonPressed: {
    opacity: 0.8,
  },
  iconWrapper: {
    position: 'relative',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ff3d00',
    borderRadius: 10,
    minWidth: 19,
    height: 19,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#c62828',
    elevation: 3,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Header;