// BookData.js - Données et SVG pour les livres d'amour
import React from 'react';
import { View, StyleSheet } from 'react-native';
import HorizontalBookList from './BookData';

// Les SVG de livres (version simplifiée - chaque livre séparément)
export const bookSvgs = {
  book1: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130">
    <rect x="10" y="10" width="80" height="110" rx="2" fill="#e91e63" stroke="#880e4f" stroke-width="2"/>
    <rect x="10" y="10" width="80" height="110" rx="2" fill="#e91e63" fill-opacity="0.3"/>
    <text x="50" y="60" font-family="Arial" font-size="12" fill="white" text-anchor="middle">Amour</text>
    <text x="50" y="75" font-family="Arial" font-size="12" fill="white" text-anchor="middle">Éternel</text>
    <path d="M40,35 Q50,25 60,35 T80,35" fill="#ffffff" opacity="0.5"/>
    <circle cx="50" cy="95" r="15" fill="#ffffff" opacity="0.2"/>
  </svg>`,
  
  book2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130">
    <rect x="10" y="10" width="80" height="110" rx="2" fill="#9c27b0" stroke="#4a148c" stroke-width="2"/>
    <rect x="10" y="10" width="80" height="110" rx="2" fill="#9c27b0" fill-opacity="0.3"/>
    <text x="50" y="60" font-family="Arial" font-size="12" fill="white" text-anchor="middle">Poèmes</text>
    <text x="50" y="75" font-family="Arial" font-size="12" fill="white" text-anchor="middle">du Cœur</text>
    <path d="M35,30 L65,30 M35,35 L65,35 M35,40 L55,40" stroke="#ffffff" stroke-width="1" opacity="0.5"/>
    <path d="M45,90 A10,10 0 1,1 55,90 A10,5 0 1,1 45,90 Z" fill="#ffffff" opacity="0.3"/>
  </svg>`,
  
  book3: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130">
    <rect x="10" y="10" width="80" height="110" rx="2" fill="#2196f3" stroke="#0d47a1" stroke-width="2"/>
    <rect x="10" y="10" width="80" height="110" rx="2" fill="#2196f3" fill-opacity="0.3"/>
    <text x="50" y="55" font-family="Arial" font-size="11" fill="white" text-anchor="middle">Secrets</text>
    <text x="50" y="70" font-family="Arial" font-size="11" fill="white" text-anchor="middle">d'une</text>
    <text x="50" y="85" font-family="Arial" font-size="11" fill="white" text-anchor="middle">Relation</text>
    <circle cx="50" cy="30" r="10" fill="#ffffff" opacity="0.3"/>
    <path d="M30,95 H70" stroke="#ffffff" stroke-width="1" opacity="0.5"/>
  </svg>`,
  
  book4: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130">
    <rect x="10" y="10" width="80" height="110" rx="2" fill="#f44336" stroke="#b71c1c" stroke-width="2"/>
    <rect x="10" y="10" width="80" height="110" rx="2" fill="#f44336" fill-opacity="0.2"/>
    <text x="50" y="50" font-family="Arial" font-size="12" fill="white" text-anchor="middle">Passion</text>
    <text x="50" y="65" font-family="Arial" font-size="12" fill="white" text-anchor="middle">Interdite</text>
    <path d="M35,85 Q50,95 65,85" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
    <path d="M45,35 A10,10 0 0,1 55,35 L55,45 L45,45 Z" fill="#ffffff" opacity="0.2"/>
  </svg>`,
  
  book5: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130">
    <rect x="10" y="10" width="80" height="110" rx="2" fill="#4caf50" stroke="#1b5e20" stroke-width="2"/>
    <rect x="10" y="10" width="80" height="110" rx="2" fill="#4caf50" fill-opacity="0.3"/>
    <text x="50" y="55" font-family="Arial" font-size="11" fill="white" text-anchor="middle">Guide de</text>
    <text x="50" y="70" font-family="Arial" font-size="11" fill="white" text-anchor="middle">l'Amour</text>
    <text x="50" y="85" font-family="Arial" font-size="11" fill="white" text-anchor="middle">Moderne</text>
    <rect x="30" y="30" width="40" height="1" fill="#ffffff" opacity="0.5"/>
    <rect x="30" y="33" width="40" height="1" fill="#ffffff" opacity="0.5"/>
    <rect x="30" y="36" width="30" height="1" fill="#ffffff" opacity="0.5"/>
    <circle cx="50" cy="100" r="8" fill="#ffffff" opacity="0.2"/>
  </svg>`,
  
  book6: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130">
    <rect x="10" y="10" width="80" height="110" rx="2" fill="#ff9800" stroke="#e65100" stroke-width="2"/>
    <rect x="10" y="10" width="80" height="110" rx="2" fill="#ff9800" fill-opacity="0.3"/>
    <text x="50" y="55" font-family="Arial" font-size="12" fill="white" text-anchor="middle">Histoires</text>
    <text x="50" y="70" font-family="Arial" font-size="12" fill="white" text-anchor="middle">à Deux</text>
    <circle cx="40" cy="95" r="10" fill="#ffffff" opacity="0.2"/>
    <circle cx="60" cy="95" r="10" fill="#ffffff" opacity="0.2"/>
    <path d="M35,30 L65,30 M35,35 L65,35" stroke="#ffffff" stroke-width="1" opacity="0.5"/>
  </svg>`,
  
  book7: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130">
    <rect x="10" y="10" width="80" height="110" rx="2" fill="#673ab7" stroke="#311b92" stroke-width="2"/>
    <rect x="10" y="10" width="80" height="110" rx="2" fill="#673ab7" fill-opacity="0.3"/>
    <text x="50" y="60" font-family="Arial" font-size="11" fill="white" text-anchor="middle">Être Aimé</text>
    <text x="50" y="75" font-family="Arial" font-size="11" fill="white" text-anchor="middle">Chaque Jour</text>
    <path d="M35,40 L65,40 M35,45 L55,45" stroke="#ffffff" stroke-width="1" opacity="0.5"/>
    <path d="M40,90 Q50,100 60,90" stroke="#ffffff" stroke-width="2" opacity="0.3"/>
  </svg>`,
  
  book8: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130">
    <rect x="10" y="10" width="80" height="110" rx="2" fill="#009688" stroke="#004d40" stroke-width="2"/>
    <rect x="10" y="10" width="80" height="110" rx="2" fill="#009688" fill-opacity="0.3"/>
    <text x="50" y="60" font-family="Arial" font-size="12" fill="white" text-anchor="middle">Amour</text>
    <text x="50" y="75" font-family="Arial" font-size="12" fill="white" text-anchor="middle">Véritable</text>
    <circle cx="50" cy="35" r="12" fill="#ffffff" opacity="0.2"/>
    <path d="M30,95 H70" stroke="#ffffff" stroke-width="1" opacity="0.4"/>
  </svg>`,
};

// Création des données pour la liste horizontale
export const bookData = [
  {
    id: '1',
    title: 'Amour Éternel',
    category: 'Roman',
    svgContent: bookSvgs.book1,
    isPremium: true,
    price: "15€"
  },
  {
    id: '2',
    title: 'Poèmes du Cœur',
    category: 'Poésie',
    svgContent: bookSvgs.book2,
    isPremium: false,
    price: "12€"
  },
  {
    id: '3',
    title: 'Secrets d\'une Relation',
    category: 'Guide',
    svgContent: bookSvgs.book3,
    isPremium: true,
    price: "18€"
  },
  {
    id: '4',
    title: 'Passion Interdite',
    category: 'Roman',
    svgContent: bookSvgs.book4,
    isPremium: false,
    price: "14€"
  },
  {
    id: '5',
    title: 'Guide de l\'Amour Moderne',
    category: 'Guide',
    svgContent: bookSvgs.book5,
    isPremium: false,
    price: "20€"
  },
  {
    id: '6',
    title: 'Histoires à Deux',
    category: 'Recueil',
    svgContent: bookSvgs.book6,
    isPremium: true,
    price: "16€"
  },
  {
    id: '7',
    title: 'Être Aimé Chaque Jour',
    category: 'Motivation',
    svgContent: bookSvgs.book7,
    isPremium: false,
    price: "13€"
  },
  {
    id: '8',
    title: 'Amour Véritable',
    category: 'Roman',
    svgContent: bookSvgs.book8,
    isPremium: true,
    price: "17€"
  },
];

// Exemple d'utilisation dans un composant
const BooksSection = ({ navigation }) => {
  
  const handleBookPress = (book) => {
    navigation.navigate('BookDetails', { book });
  };
  
  const handleSeeAllPress = () => {
    navigation.navigate('AllBooks');
  };
  
  return (
    <View style={styles.container}>
      <HorizontalBookList
        data={bookData}
        title="Livres d'amour"
        onItemPress={handleBookPress}
        onSeeAllPress={handleSeeAllPress}
        imageSize={120}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
  },
});

export default BooksSection;