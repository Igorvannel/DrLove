import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Image,
  Alert,
  StatusBar
} from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Remplacez par vos variables d'environnement
const API_URL = 'https://your-backend-url.com';
const user = { id: 'user-123' }; // Remplacez par la logique d'authentification réelle

const PremiumSubscriptionScreen = ({ navigation }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  // Plans d'abonnement
  const subscriptionPlans = {
    monthly: {
      id: 'price_monthly',
      name: 'Mensuel',
      price: '9,99 €',
      period: 'par mois',
      features: 'Accès premium pendant 1 mois',
      popular: false,
      discount: '0%'
    },
    quarterly: {
      id: 'price_quarterly',
      name: 'Trimestriel',
      price: '24,99 €',
      period: 'pour 3 mois',
      features: 'Accès premium pendant 3 mois',
      popular: true,
      discount: '17%'
    },
    yearly: {
      id: 'price_yearly',
      name: 'Annuel',
      price: '89,99 €',
      period: 'par an',
      features: 'Accès premium pendant 12 mois',
      popular: false,
      discount: '25%'
    }
  };

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch(`${API_URL}/payment-sheet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          planId: subscriptionPlans[selectedPlan].id
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur réseau');
      }
      
      const { paymentIntent, ephemeralKey, customer } = await response.json();
      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres de paiement:', error);
      Alert.alert('Erreur', 'Impossible de se connecter au serveur de paiement. Veuillez réessayer plus tard.');
      return null;
    }
  };

  const initializePaymentSheet = async () => {
    setLoading(true);
    try {
      const params = await fetchPaymentSheetParams();
      
      if (!params) {
        setLoading(false);
        return;
      }
      
      const { paymentIntent, ephemeralKey, customer } = params;
      
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Dr Love & Motivation',
        paymentIntentClientSecret: paymentIntent,
        customerEphemeralKeySecret: ephemeralKey,
        customerId: customer,
        applePay: {
          merchantCountryCode: 'FR', // Adaptez selon votre pays
        },
        googlePay: {
          merchantCountryCode: 'FR', // Adaptez selon votre pays
          testEnv: true, // Mettez false en production
        },
        allowsDelayedPaymentMethods: true,
        billingDetailsCollectionConfiguration: {
          name: 'required',
          email: 'required',
        },
      });

      if (initError) {
        console.error('Erreur d\'initialisation:', initError);
        Alert.alert('Erreur', 'Erreur lors de l\'initialisation du paiement. Veuillez réessayer.');
        setLoading(false);
        return;
      }

      const { error: presentError } = await presentPaymentSheet();
      
      if (presentError) {
        console.log('Erreur de présentation:', presentError);
        if (presentError.code !== 'Canceled') {
          Alert.alert('Erreur', 'Le paiement a échoué. Veuillez réessayer.');
        }
      } else {
        // Paiement réussi
        Alert.alert(
          'Félicitations!', 
          `Votre abonnement ${subscriptionPlans[selectedPlan].name} est maintenant actif.`,
          [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
        );
      }
    } catch (error) {
      console.error('Erreur générale:', error);
      Alert.alert('Erreur', 'Une erreur inattendue s\'est produite. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const renderPlanCard = (planKey) => {
    const plan = subscriptionPlans[planKey];
    const isSelected = selectedPlan === planKey;
    
    return (
      <TouchableOpacity
        style={[
          styles.planCard,
          isSelected && styles.selectedPlanCard,
          plan.popular && styles.popularPlanCard
        ]}
        onPress={() => setSelectedPlan(planKey)}
        activeOpacity={0.8}
      >
        {plan.popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularBadgeText}>POPULAIRE</Text>
          </View>
        )}
        
        <Text style={[styles.planName, isSelected && styles.selectedPlanText]}>
          {plan.name}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={[styles.planPrice, isSelected && styles.selectedPlanText]}>
            {plan.price}
          </Text>
          <Text style={[styles.planPeriod, isSelected && styles.selectedPlanText]}>
            {plan.period}
          </Text>
        </View>
        
        {plan.discount !== '0%' && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>Économisez {plan.discount}</Text>
          </View>
        )}
        
        <View style={styles.checkContainer}>
          {isSelected ? (
            <Icon name="check-circle" size={24} color="#c62828" />
          ) : (
            <Icon name="radio-button-unchecked" size={24} color="#aaa" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#f8f8f8" barStyle="dark-content" />
      
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Abonnement Premium</Text>
        <View style={styles.placeholderButton} />
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Section d'introduction */}
        <View style={styles.introSection}>
          <View style={styles.premiumBadge}>
            <Icon name="star" size={24} color="#FFD700" />
            <Text style={styles.premiumBadgeText}>PREMIUM</Text>
          </View>
          
          <Text style={styles.title}>Débloquez toutes les fonctionnalités</Text>
          <Text style={styles.subtitle}>
            Transformez votre vie amoureuse avec un accès illimité à tous nos services
          </Text>
        </View>
        
        {/* Section des avantages */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Avantages Premium</Text>
          
          {[
            { icon: 'chat', text: 'Consultations illimitées avec nos experts' },
            { icon: 'lock-open', text: 'Accès à tout le contenu exclusif' },
            { icon: 'notifications-none', text: 'Conseils personnalisés chaque jour' },
            { icon: 'bookmark', text: 'Sauvegardez vos contenus préférés' }
          ].map((item, index) => (
            <View key={index} style={styles.benefitItem}>
              <Icon name={item.icon} size={24} color="#c62828" />
              <Text style={styles.benefitText}>{item.text}</Text>
            </View>
          ))}
        </View>
        
        {/* Section des plans */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Choisissez votre plan</Text>
          
          {renderPlanCard('monthly')}
          {renderPlanCard('quarterly')}
          {renderPlanCard('yearly')}
          
          <Text style={styles.disclaimer}>
            Les abonnements sont renouvelés automatiquement. Vous pouvez annuler à tout moment.
          </Text>
        </View>
      </ScrollView>
      
      {/* Bouton d'abonnement */}
      <View style={styles.subscribeContainer}>
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={initializePaymentSheet}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.subscribeButtonText}>
              S'abonner maintenant
            </Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.securePaymentContainer}>
          <Icon name="lock" size={16} color="#666" />
          <Text style={styles.securePaymentText}>Paiement sécurisé par Stripe</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholderButton: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  introSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  premiumBadgeText: {
    color: '#b8860b',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  benefitsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  benefitText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  plansSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlanCard: {
    borderColor: '#c62828',
  },
  popularPlanCard: {
    backgroundColor: '#fff9e5',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: '#c62828',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  priceContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  planPeriod: {
    fontSize: 14,
    color: '#666',
  },
  selectedPlanText: {
    color: '#c62828',
  },
  discountBadge: {
    backgroundColor: 'rgba(198, 40, 40, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 15,
    marginLeft: 10,
  },
  discountText: {
    fontSize: 12,
    color: '#c62828',
    fontWeight: 'bold',
  },
  checkContainer: {
    marginLeft: 10,
  },
  disclaimer: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  subscribeContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  subscribeButton: {
    backgroundColor: '#c62828',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  securePaymentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  securePaymentText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
});

export default PremiumSubscriptionScreen;