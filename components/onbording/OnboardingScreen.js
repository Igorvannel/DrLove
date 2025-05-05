import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  ScrollView,
  StatusBar
} from 'react-native';

const { width } = Dimensions.get('window');

// Données des slides
const slides = [
  {
    key: '1',
    title: 'Bienvenue!',
    text: 'Découvrez nos conseils d\'amour pour enrichir votre vie sentimentale.',
    image: require('../../assets/slide1.png'),
  },
  {
    key: '2',
    title: 'Histoires d\'amour',
    text: 'Lisez des histoires d\'amour inspirantes et partagez les vôtres.',
    image: require('../../assets/slide1.png'),
  },
  {
    key: '3',
    title: 'Motivation quotidienne',
    text: 'Recevez des messages de motivation pour vous aider à surmonter les défis.',
    image: require('../../assets/slide1.png'),
  },
  {
    key: '4',
    title: 'Éducation pour adultes',
    text: 'Accédez à du contenu éducatif pour les adultes de 18 ans et plus.',
    image: require('../../assets/slide1.png'),
  }
];

const OnboardingScreen = ({ navigation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const scrollViewRef = useRef(null);

  // Fonction pour passer au slide suivant
  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      scrollViewRef.current.scrollTo({
        x: width * (currentSlideIndex + 1),
        animated: true
      });
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      // Navigation vers Login après avoir terminé l'onboarding
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };
  
  const handleSkip = () => {
    // Navigation vers Login si on saute l'onboarding
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  // Fonction appelée quand le défilement s'arrête
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    if (currentIndex !== currentSlideIndex) {
      setCurrentSlideIndex(currentIndex);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      {/* Header avec bouton Skip */}
      <View style={styles.header}>
        {currentSlideIndex < slides.length - 1 && (
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Passer</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Contenu des slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ width: width * slides.length }}
      >
        {slides.map((slide, index) => (
          <View key={slide.key} style={[styles.slide, { width }]}>
            <Image source={slide.image} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.text}>{slide.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      
      {/* Footer avec indicateurs et bouton */}
      <View style={styles.footer}>
        {/* Indicateurs de progression */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === currentSlideIndex ? '#c62828' : '#e0e0e0' }
              ]}
            />
          ))}
        </View>
        
        {/* Bouton Next ou Start */}
        <TouchableOpacity 
          style={[
            styles.button,
            currentSlideIndex === slides.length - 1 ? styles.buttonStart : {}
          ]} 
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {currentSlideIndex === slides.length - 1 ? 'Commencer' : 'Suivant'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'flex-end',
  },
  skipText: {
    fontSize: 16,
    color: '#c62828',
    fontWeight: '500',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#c62828',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonStart: {
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;