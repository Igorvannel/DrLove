import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  Dimensions 
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

// Composant qui utilise SvgXml pour rendre le SVG
const BookCover = ({ svgContent, style }) => {
  return <SvgXml xml={svgContent} width="100%" height="100%" style={style} />;
};

const HorizontalBookList = ({ 
  data, 
  onItemPress, 
  title = "Livres d'amour", 
  showSeeAll = true,
  onSeeAllPress,
  imageSize = 120
}) => {
  
  // Gestion du cas où data est vide ou null
  if (!data || data.length === 0) {
    return null;
  }

  // Rendu d'un élément du carousel avec SVG
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.carouselItem, { width: imageSize }]} 
      onPress={() => onItemPress && onItemPress(item)}
      activeOpacity={0.8}
    >
      <View style={[styles.imageContainer, { width: imageSize, height: Math.floor(imageSize * 1.3) }]}>
        {/* Utilisation du SVG */}
        <BookCover svgContent={item.svgContent} style={styles.bookCover} />
        
        {/* Badge si l'élément est premium */}
        {item.isPremium && (
          <View style={styles.premiumBadge}>
            <Icon name="star" size={10} color="#FFFFFF" />
            <Text style={styles.premiumText}>PRO</Text>
          </View>
        )}

        {/* Afficher le prix en badge */}
        {item.price && (
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>{item.price}</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.carouselTitle} numberOfLines={2}>{item.title}</Text>
      
      {/* Affichage de la catégorie si disponible */}
      {item.category && (
        <Text style={styles.categoryText}>{item.category}</Text>
      )}
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      {/* En-tête avec titre et bouton "Voir tout" */}
      {title && (
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {showSeeAll && (
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={onSeeAllPress}
            >
              <Text style={styles.seeAllText}>Voir tout</Text>
              <Icon name="chevron-right" size={16} color="#c62828" />
            </TouchableOpacity>
          )}
        </View>
      )}
      
      {/* Liste horizontale */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        snapToInterval={imageSize + 16} // Pour un défilement snap
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#c62828',
    fontWeight: '500',
  },
  listContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  carouselItem: {
    marginRight: 16,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  bookCover: {
    borderRadius: 12,
  },
  carouselTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#757575',
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFC107',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  priceBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HorizontalBookList;