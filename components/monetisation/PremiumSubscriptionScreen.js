import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';

const PremiumSubscriptionScreen = ({ navigation }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${API_URL}/payment-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id, // remplacer par l'ID de l'utilisateur
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
      await presentPaymentSheet();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Devenir Membre Premium</Text>
      <Button title="S'abonner" onPress={initializePaymentSheet} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default PremiumSubscriptionScreen;
