import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Header from './Header';
import HorizontalList from './HorizontalList';
import NavBar from './NavBar';


const dummyData = {
  featuredArticles: [
    { id: '1', title: '$15', image: 'data:image/jpeg;base64' },
    { id: '2', title: '$20', image: 'data:image/jpeg;base64' },
    { id: '3', title: '$25', image: 'data:image/jpeg;base64' },
    { id: '4', title: '$30', image: 'data:image/png;base64' },
  ],
  contentLists: [
    {
      id: '1',
      title: 'Conseils d\'amour',
      body: 'Sample content for Conseils d\'amour',
      category: 'conseil',
      createdAt: '2024-07-26T18:57:58.509662',
      updatedAt: '2024-07-26T18:57:58.511658',
    },
    {
      id: '2',
      title: 'Histoires d\'amour',
      body: 'Sample content for Histoires d\'amour',
      category: 'histoire',
      createdAt: '2024-07-26T18:57:58.509662',
      updatedAt: '2024-07-26T18:57:58.511658',
    },
    {
      id: '3',
      title: 'Messages de motivation',
      body: 'Sample content for Messages de motivation',
      category: 'motivation',
      createdAt: '2024-07-26T18:57:58.509662',
      updatedAt: '2024-07-26T18:57:58.511658',
    },
    {
      id: '4',
      title: 'Éducation pour Adultes (18+)',
      body: 'Sample content for Éducation pour Adultes (18+)',
      category: 'education',
      createdAt: '2024-07-26T18:57:58.509662',
      updatedAt: '2024-07-26T18:57:58.511658',
    },
    {
      id: '5',
      title: 'Consultations',
      body: 'Sample content for consultation',
      category: 'consultation',
      createdAt: '2024-07-26T18:57:58.509662',
      updatedAt: '2024-07-26T18:57:58.511658',
    },
  ]
};

const HomeScreen = ({ navigation }) => {
  const handleItemPress = (item) => {
    navigation.navigate('ContentDetail', {
      title: item.title,
      content: item.body,
      image: item.image,
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item.image }} style={styles.carouselImage} />
      <Text style={styles.carouselTitle}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView style={styles.content}>
        <HorizontalList data={dummyData.featuredArticles} onItemPress={handleItemPress} />
        <View style={styles.contentList}>
          {dummyData.contentLists.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.listItem}
              onPress={() => handleItemPress(item)}
            >
              <Text style={styles.listItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <NavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  carouselItem: {
    marginRight: 10,
  },
  carouselImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  carouselTitle: {
    textAlign: 'center',
    marginTop: 5,
  },
  contentList: {
    marginTop: 20,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#c62828',
  },
  listItemText: {
    fontSize: 18,
    color: '#c62828',
  },
});

export default HomeScreen;
