import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ContentList = ({ data, onItemPress, onViewAllPress }) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Fonction modifiée pour rendre les étoiles sans utiliser Array
  const renderStars = (rating) => {
    // S'assurer que rating est un nombre valide entre 0 et 5
    const safeRating = isNaN(rating) ? 0 : Math.min(Math.max(0, rating), 5);
    
    return (
      <View style={styles.starsContainer}>
        <Icon name={safeRating >= 1 ? "star" : "star-border"} size={16} color="#FFC107" />
        <Icon name={safeRating >= 2 ? "star" : "star-border"} size={16} color="#FFC107" />
        <Icon name={safeRating >= 3 ? "star" : "star-border"} size={16} color="#FFC107" />
        <Icon name={safeRating >= 4 ? "star" : "star-border"} size={16} color="#FFC107" />
        <Icon name={safeRating >= 5 ? "star" : "star-border"} size={16} color="#FFC107" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>Contenu populaire</Text>
        <TouchableOpacity onPress={onViewAllPress} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>Voir tout</Text>
          <Icon name="chevron-right" size={20} color="#c62828" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.itemCard}
            onPress={() => onItemPress(item)}
            activeOpacity={0.7}
          >
            {/* Icône ronde à gauche */}
            <View style={styles.iconContainer}>
              <Icon name="article" size={24} color="#FFFFFF" />
            </View>
            
            {/* Contenu principal */}
            <View style={styles.contentContainer}>
              {/* Titre */}
              <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
              
              {/* Étoiles */}
              {renderStars(item.rating)}
            </View>
            
            {/* Zone droite avec badge et flèche */}
            <View style={styles.rightContainer}>
              {/* Badge PRO si applicable */}
              {item.isPremium && (
                <View style={styles.proBadge}>
                  <Icon name="star" size={12} color="#FFFFFF" />
                  <Text style={styles.proText}>PRO</Text>
                </View>
              )}
              
              {/* Badge de catégorie */}
              <View style={[
                styles.categoryBadge, 
                { backgroundColor: getCategoryColor(item.category) }
              ]}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              
              {/* Flèche */}
              <Icon name="chevron-right" size={24} color="#DDDDDD" style={styles.arrowIcon} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Fonction pour obtenir la couleur du badge en fonction de la catégorie
const getCategoryColor = (category) => {
  if (!category) return '#c62828';
  
  const colorMap = {
    'conseil': '#c62828', // Rouge
    'histoire': '#d32f2f', // Rouge légèrement plus clair
    'motivation': '#d32f2f',
    'education': '#c62828',
    'consultation': '#c62828'
  };
  
  return colorMap[category.toLowerCase()] || '#c62828';
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#c62828',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#c62828',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFC107',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  proText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  categoryBadge: {
    backgroundColor: '#c62828',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 8,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  arrowIcon: {
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -12,
  }
});

export default ContentList;