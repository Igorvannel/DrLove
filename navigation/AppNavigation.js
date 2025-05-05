// app/navigation/AppNavigator.js
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import HomeScreen from '../components/home/HomeScreen';
import ProfileScreen from '../components/profile/ProfileScreen';
import ContentDetailScreen from '../components/content/ContentDetailScreen';
import ForumScreen from '../components/forum/ForumScreen';
import CreatePostScreen from '../components/forum/CreatePostScreen';
import PostDetailScreen from '../components/forum/PostDetailScreen';
import PrivateMessageScreen from '../components/message/PrivateMessageScreen';
import OnboardingScreen from '../components/onbording/OnboardingScreen';
import LoginScreen from '../pages/auth/LoginScreen';
import RegisterScreen from '../pages/auth/RegisterScreen';
import ConsultationScreen from '../components/consultation/ConsultationScreen';

const Stack = createStackNavigator();
const IS_FIRST_LAUNCH = 'IS_FIRST_LAUNCH';

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Onboarding');

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem(IS_FIRST_LAUNCH);
        
        if (hasLaunched === null) {
          // C'est la première fois que l'app est lancée
          await AsyncStorage.setItem(IS_FIRST_LAUNCH, 'false');
          setInitialRoute('Onboarding');
        } else {
          // Ce n'est pas la première fois
          // Vérifiez s'il y a un utilisateur connecté
          const userToken = await AsyncStorage.getItem('USER_TOKEN');
          if (userToken) {
            setInitialRoute('Home');
          } else {
            setInitialRoute('Login');
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du premier lancement:', error);
        setInitialRoute('Login'); // Par défaut, aller à Login en cas d'erreur
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstLaunch();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c62828" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ContentDetail" 
          component={ContentDetailScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Forum" 
          component={ForumScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CreatePost" 
          component={CreatePostScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="PostDetail" 
          component={PostDetailScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Messages" 
          component={PrivateMessageScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Consultation" 
          component={ConsultationScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});