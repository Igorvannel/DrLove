import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, StatusBar, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useStripe } from '@stripe/stripe-react-native';

const ConsultationScreen = ({ navigation }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [scrollY] = useState(new Animated.Value(0));

  // Animation pour le header lors du défilement
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [80, 60],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

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
        userId: 'USER_ID',
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
      }
    }
  };

  const renderConsultationItem = ({ item }) => (
    <Animated.View 
      style={[
        styles.consultationItem, 
        { 
          transform: [{ 
            scale: scrollY.interpolate({
              inputRange: [-50, 0, 100 * (parseInt(item.id) - 1), 100 * parseInt(item.id)],
              outputRange: [1, 1, 1, 0.98],
              extrapolate: 'clamp',
            }) 
          }],
          opacity: scrollY.interpolate({
            inputRange: [-50, 0, 100 * (parseInt(item.id) - 1), 100 * parseInt(item.id)],
            outputRange: [1, 1, 1, 0.8],
            extrapolate: 'clamp',
          }) 
        }
      ]}
    >
      <View style={styles.iconContainer}>
        <Icon name="event" size={24} color="#fff" />
      </View>
      <View style={styles.consultationDetails}>
        <Text style={styles.consultationDate}>{item.date}</Text>
        <Text style={styles.consultationTime}>{item.time}</Text>
      </View>
      <TouchableOpacity 
        style={styles.payButton}
        onPress={initializePaymentSheet}
      >
        <Text style={styles.payButtonText}>Payer</Text>
        <Icon name="arrow-forward-ios" size={14} color="#fff" style={styles.buttonIcon} />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#c62828" barStyle="light-content" />
      
      {/* Header animé */}
      <Animated.View 
        style={[
          styles.header, 
          { 
            height: headerHeight,
            opacity: headerOpacity,
          }
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Consultations</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="more-vert" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      <Animated.FlatList
        data={consultations}
        renderItem={renderConsultationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.consultationList}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />

      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={() => navigation.navigate('NewConsultation')}
      >
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#c62828',
    justifyContent: 'flex-end',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  menuButton: {
    padding: 5,
  },
  consultationList: {
    padding: 16,
    paddingTop: 10,
  },
  consultationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#c62828',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  consultationDetails: {
    flex: 1,
  },
  consultationDate: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  consultationTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  payButton: {
    backgroundColor: '#c62828',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
  },
  buttonIcon: {
    marginLeft: 2,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#c62828',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default ConsultationScreen;