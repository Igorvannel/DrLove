import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useStripe } from '@stripe/stripe-react-native'; // Import Stripe

const ConsultationScreen = ({ navigation }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  // Dummy data for consultations
  const consultations = [
    { id: '1', date: '2024-07-24', time: '14:00' },
    { id: '2', date: '2024-07-25', time: '10:00' },
    // Add more consultations here
  ];

  const fetchPaymentSheetParams = async () => {
    const response = await fetch('YOUR_API_URL/payment-sheet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'USER_ID', // Remplacez par l'ID de l'utilisateur
      }),
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: paymentIntent,
      customerEphemeralKeySecret: ephemeralKey,
      customerId: customer,
    });
    if (!error) {
      const { error } = await presentPaymentSheet();
      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        Alert.alert('Success', 'Your order is confirmed!');
        // Logique supplémentaire après le paiement réussi
      }
    }
  };

  const renderConsultationItem = ({ item }) => (
    <View style={styles.consultationItem}>
      <Icon name="event" size={24} color="#c62828" style={styles.icon} />
      <View style={styles.consultationDetails}>
        <Text style={styles.consultationDate}>{item.date}</Text>
        <Text style={styles.consultationTime}>{item.time}</Text>
      </View>
      <TouchableOpacity 
        style={styles.payButton}
        onPress={initializePaymentSheet} // Initialise le processus de paiement
      >
        <Text style={styles.payButtonText}>Payer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Consultations</Text>
      </View>
      
      <FlatList
        data={consultations}
        renderItem={renderConsultationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.consultationList}
      />

      <TouchableOpacity 
        style={styles.reserveButton} 
        onPress={() => navigation.navigate('NewConsultation')} // Navigate to the NewConsultation screen
      >
        <Text style={styles.reserveButtonText}>Réserver une nouvelle consultation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#c62828', // Couleur de fond de l'en-tête
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: '#fff', // Texte blanc
    fontWeight: 'bold',
  },
  consultationList: {
    padding: 20,
  },
  consultationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  icon: {
    marginRight: 15,
  },
  consultationDetails: {
    flex: 1,
  },
  consultationDate: {
    fontSize: 16,
    color: '#000',
  },
  consultationTime: {
    fontSize: 14,
    color: '#555',
  },
  payButton: {
    backgroundColor: '#c62828',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  reserveButton: {
    backgroundColor: '#c62828',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',r
  },
});

export default ConsultationScreen;
