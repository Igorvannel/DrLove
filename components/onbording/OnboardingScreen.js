import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

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
]
const OnboardingScreen = ({ navigation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      navigation.navigate('Home');
    }
  };

  const Slide = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Slide item={slides[currentSlideIndex]} />
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { opacity: index === currentSlideIndex ? 1 : 0.3 }
              ]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
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
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  pagination: {
    flexDirection: 'row',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333',
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#F48787',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
