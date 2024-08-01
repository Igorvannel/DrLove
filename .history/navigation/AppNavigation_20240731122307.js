// app/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../components/home/HomeScreen';
import ProfileScreen from '../components/profile/ProfileScreen';
import ContentDetailScreen from '../components/content/ContentDetailScreen';
import ForumScreen from '../components/forum/ForumScreen';
import CreatePostScreen from '../components/forum/CreatePostScreen';
import PostDetailScreen from '../components/forum/PostDetailScreen';
import PrivateMessageScreen from '../components/message/PrivateMessageScreen';
import OnboardingScreen from '../components/onbording/OnboardingScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }} // Masquer l'en-tête pour l'onboarding
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} // Masquer l'en-tête pour la home screen
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ContentDetail" component={ContentDetailScreen} />
        <Stack.Screen name="Forum" component={ForumScreen} />
        <Stack.Screen name="CreatePost" component={CreatePostScreen} />
        <Stack.Screen name="PostDetail" component={PostDetailScreen} />
        <Stack.Screen name="Messages" component={PrivateMessageScreen} />
       
        {/* Ajoutez d'autres écrans ici */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
