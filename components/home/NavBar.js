import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Dimensions,
  Platform 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const NavBar = ({ navigation, currentRoute = 'Home' }) => {
  // État pour suivre l'onglet actif
  const [activeTab, setActiveTab] = useState(currentRoute);
  
  // Animations pour les effets visuels
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnims = useRef({
    Home: new Animated.Value(currentRoute === 'Home' ? 1 : 0.8),
    Forum: new Animated.Value(currentRoute === 'Forum' ? 1 : 0.8),
    Messages: new Animated.Value(currentRoute === 'Messages' ? 1 : 0.8),
    Profile: new Animated.Value(currentRoute === 'Profile' ? 1 : 0.8),
  }).current;
  
  // Animation d'entrée au chargement
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Gestion de la pression sur un onglet
  const handlePress = (routeName) => {
    // Animation de mise à l'échelle
    Object.keys(scaleAnims).forEach(key => {
      Animated.timing(scaleAnims[key], {
        toValue: key === routeName ? 1 : 0.8,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
    
    // Mettre à jour l'état local et naviguer
    setActiveTab(routeName);
    navigation.navigate(routeName);
  };

  // Effet de brillance (pulsation) pour l'onglet actif
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Les éléments de navigation avec icônes personnalisées
  const navItems = [
    { name: 'Home', icon: 'home', label: 'Accueil', activeColor: '#ff9e80' },
    { name: 'Forum', icon: 'forum', label: 'Forum', activeColor: '#a7ffeb' },
    { name: 'Messages', icon: 'message', label: 'Messages', activeColor: '#b388ff' },
    { name: 'Profile', icon: 'person', label: 'Profil', activeColor: '#ffd180' },
  ];

  return (
    <Animated.View 
      style={[
        styles.navBarContainer,
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }] 
        }
      ]}
    >
      <View style={styles.navBarWrapper}>
        <View style={styles.navBar}>
          {navItems.map((item) => {
            const isActive = activeTab === item.name;
            
            return (
              <TouchableOpacity
                key={item.name}
                onPress={() => handlePress(item.name)}
                style={[
                  styles.navButtonContainer,
                  isActive && styles.activeButtonContainer,
                ]}
                activeOpacity={0.7}
              >
                <Animated.View 
                  style={[
                    styles.iconWrapper,
                    isActive && styles.activeIconWrapper,
                    { 
                      transform: [
                        { scale: scaleAnims[item.name] },
                        isActive ? { scale: Animated.multiply(scaleAnims[item.name], pulseAnim) } : { scale: scaleAnims[item.name] }
                      ] 
                    },
                    isActive && { backgroundColor: item.activeColor }
                  ]}
                >
                  <Icon
                    name={item.icon}
                    size={24}
                    color={isActive ? '#c62828' : 'rgba(255, 255, 255, 0.9)'}
                  />
                </Animated.View>
                
                <Text
                  style={[
                    styles.navButtonText,
                    isActive && styles.activeText,
                  ]}
                >
                  {item.label}
                </Text>
                
                {isActive && (
                  <View style={[styles.activeIndicator, { backgroundColor: item.activeColor }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      
      {/* Rayon lumineux sous la navbar */}
      <View style={styles.glow} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  navBarContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  navBarWrapper: {
    width: width - 32,
    borderRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#c62828',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  navButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
  },
  activeButtonContainer: {
    transform: [{ translateY: -3 }],
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  activeIconWrapper: {
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  navButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: width * 0.1,
    right: width * 0.1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 1,
  },
});

export default NavBar;