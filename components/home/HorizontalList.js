// components/HorizontalList.js

import React from 'react';
import { FlatList, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assurez-vous que le nom de l'icône est correct

const HorizontalList = ({ data, onItemPress }) => {

    
      

      const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.carouselItem} onPress={() => { /* Ne fait rien */ }}>
          <Image source={{ uri: item.image }} style={styles.carouselImage} />
          <Text style={styles.carouselTitle}>{item.title}</Text>
        </TouchableOpacity>
      );
      
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  carouselItem: {
    marginRight: 20,
  },
  carouselImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  carouselTitle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HorizontalList;
