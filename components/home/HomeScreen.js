import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  StatusBar 
} from 'react-native';
import Header from './Header';
import HorizontalList from './HorizontalList';
import ContentList from './ContentList'; // Utiliser le nouveau composant
import NavBar from './NavBar';

// Images d'exemple pour le développement
const dummyData = {
  featuredArticles: [
    { 
      id: '1', 
      title: '$15',
      price: 15,
      image: 'https://reactnative.dev/img/tiny_logo.png'
    },
    { 
      id: '2', 
      title: '$20',
      price: 20,
      image: 'https://reactnative.dev/img/tiny_logo.png'
    },
    { 
      id: '3', 
      title: '$25',
      price: 25,
      image: 'https://reactnative.dev/img/tiny_logo.png'
    },
    { 
      id: '4', 
      title: '$30',
      price: 30,
      image: 'https://reactnative.dev/img/tiny_logo.png'
    },
  ],
  contentLists: [
    {
      id: '1',
      title: 'Conseils d\'amour',
      body: 'Sample content for Conseils d\'amour',
      category: 'conseil',
    }
    // {
    //   id: '2',
    //   title: 'Histoires d\'amour',
    //   body: 'Sample content for Histoires d\'amour',
    //   category: 'histoire',
    // },
    // {
    //   id: '3',
    //   title: 'Messages de motivation',
    //   body: 'Sample content for Messages de motivation',
    //   category: 'motivation',
    // },
    // {
    //   id: '4',
    //   title: 'Éducation pour Adultes (18+)',
    //   body: 'Sample content for Éducation pour Adultes (18+)',
    //   category: 'education',
    // },
    // {
    //   id: '5',
    //   title: 'Consultations',
    //   body: 'Sample content for consultation',
    //   category: 'consultation',
    // },
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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#c62828" barStyle="light-content" />
      <Header navigation={navigation} />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section produits avec prix */}
        <View style={styles.priceSection}>
          <HorizontalList 
            data={dummyData.featuredArticles} 
            onItemPress={handleItemPress}
            imageHeight={100}
            cardWidth={100}
          />
        </View>
        
        {/* Utilisation du composant ContentList séparé */}
        <ContentList 
          data={dummyData.contentLists}
          onItemPress={handleItemPress}
        />
        
        {/* Espace supplémentaire pour éviter le chevauchement avec la NavBar */}
        <View style={styles.navbarSpacer} />
      </ScrollView>
      
      <NavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  priceSection: {
    marginVertical: 10,
  },
  navbarSpacer: {
    height: 80, // Ajustez cette valeur en fonction de la hauteur de votre NavBar
  }
});

export default HomeScreen;