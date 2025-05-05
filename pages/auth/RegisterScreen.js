import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
  Alert,
  Dimensions,
  Modal,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import authService from '../../services/authService';

const { width } = Dimensions.get('window');

// Liste des pays avec leurs codes ISO-2 pour les drapeaux emoji
const countries = [
  { name: 'France', code: 'FR' },
  { name: 'Belgique', code: 'BE' },
  { name: 'Suisse', code: 'CH' },
  { name: 'Canada', code: 'CA' },
  { name: 'Maroc', code: 'MA' },
  { name: 'Algérie', code: 'DZ' },
  { name: 'Tunisie', code: 'TN' },
  { name: 'Sénégal', code: 'SN' },
  { name: 'Côte d\'Ivoire', code: 'CI' },
  { name: 'Cameroun', code: 'CM' },
  { name: 'République Démocratique du Congo', code: 'CD' },
  { name: 'Madagascar', code: 'MG' },
  { name: 'Luxembourg', code: 'LU' },
  { name: 'Monaco', code: 'MC' }
  // Ajoutez d'autres pays selon vos besoins
];

// Fonction pour convertir le code pays en emoji drapeau
const countryCodeToEmoji = (code) => {
  // Les lettres majuscules A-Z ont des valeurs Unicode entre 65 et 90
  // Pour obtenir les emoji de drapeau, on convertit les lettres en "regional indicator symbols"
  // en ajoutant 127397 à leur valeur Unicode
  if (!code) return null;
  const codePoints = [...code.toUpperCase()].map(char => 
    127397 + char.charCodeAt(0)
  );
  return String.fromCodePoint(...codePoints);
};

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [countrySearch, setCountrySearch] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  
  // Références pour les animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  // Fonction pour valider la première étape (nom, email et pays)
  const validateStep1 = () => {
    const newErrors = {};
    
    // Valider le nom
    if (!fullName.trim()) {
      newErrors.fullName = 'Nom complet requis';
    }
    
    // Valider l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email requis';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    // Valider le pays
    if (!country.trim()) {
      newErrors.country = 'Pays requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Fonction pour valider la deuxième étape (mot de passe)
  const validateStep2 = () => {
    const newErrors = {};
    
    // Valider le mot de passe
    if (!password) {
      newErrors.password = 'Mot de passe requis';
    } else if (password.length < 5) {
      newErrors.password = 'Le mot de passe doit contenir au moins 5 caractères';
    }
    
    // Valider la confirmation du mot de passe
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Animation pour passer à l'étape suivante
  const goToNextStep = () => {
    if (validateStep1()) {
      Keyboard.dismiss();
      
      // Changer directement l'étape sans animation latérale
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(2);
      });
    }
  };
  
  // Animation pour revenir à l'étape précédente
  const goToPreviousStep = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentStep(1);
    });
  };
  
  // Fonction pour filtrer les pays
  const filterCountries = (text) => {
    setCountrySearch(text);
    const filtered = countries.filter(
      (item) => item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCountries(filtered);
  };
  
  // Fonction pour sélectionner un pays
  const selectCountry = (selectedCountry, selectedCode) => {
    setCountry(selectedCountry);
    setCountryCode(selectedCode);
    setCountryModalVisible(false);
    if (errors.country) {
      setErrors({...errors, country: null});
    }
  };
  
  // Fonction pour ajouter un pays personnalisé
  const addCustomCountry = (name) => {
    // Pour un pays personnalisé, on n'aura pas de code, donc pas de drapeau
    setCountry(name);
    setCountryCode('');
    setCountryModalVisible(false);
    if (errors.country) {
      setErrors({...errors, country: null});
    }
  };
  
  // Fonction pour soumettre l'inscription
  const handleRegister = async () => {
    if (validateStep2()) {
      setIsLoading(true);
      
      try {
        console.log('Tentative d\'inscription pour:', email);
        
        // Appel au service d'authentification pour l'inscription
        const registerData = await authService.register(fullName, email, password, country, countryCode);
        
        console.log('Réponse du serveur:', registerData);
        
        // Si l'inscription est réussie
        if (registerData.success) {
          // Afficher un message de succès
          Alert.alert(
            'Inscription réussie !',
            'Votre compte a été créé avec succès.',
            [{ 
              text: 'Continuer', 
              onPress: () => navigation.replace('Home')
            }]
          );
        }
      } catch (error) {
        console.log('Erreur d\'inscription:', error);
        
        // Afficher le message d'erreur à l'utilisateur
        Alert.alert(
          'Échec de l\'inscription',
          error.message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.',
          [{ text: 'OK' }]
        );
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Style d'animation simplifiée, uniquement sur l'opacité
  const animatedStyle = {
    opacity: fadeAnim
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar backgroundColor="#c62828" barStyle="light-content" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              if (currentStep === 1) {
                navigation.goBack();
              } else {
                goToPreviousStep();
              }
            }}
          >
            <Icon name="chevron-left" size={18} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Créer un compte</Text>
          
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: currentStep === 1 ? '50%' : '100%' }]} />
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.stepText}>Étape {currentStep} sur 2</Text>
          
          {currentStep === 1 ? (
            <Animated.View style={[styles.stepContainer, animatedStyle]}>
              <Text style={styles.stepTitle}>Informations personnelles</Text>
              <Text style={styles.stepSubtitle}>Entrez vos informations de base</Text>
              
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Icon name="user" size={18} color="#888" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Nom complet"
                  placeholderTextColor="#999"
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (errors.fullName) {
                      setErrors({...errors, fullName: null});
                    }
                  }}
                />
              </View>
              {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
              
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Icon name="envelope" size={18} color="#888" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) {
                      setErrors({...errors, email: null});
                    }
                  }}
                />
              </View>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
              
              {/* Champ de pays */}
              <TouchableOpacity 
                style={styles.inputContainer}
                onPress={() => setCountryModalVisible(true)}
              >
                <View style={styles.inputIconContainer}>
                  {countryCode ? (
                    <Text style={styles.flagEmoji}>{countryCodeToEmoji(countryCode)}</Text>
                  ) : (
                    <Icon name="globe" size={18} color="#888" />
                  )}
                </View>
                <View style={styles.countryInputContainer}>
                  <Text 
                    style={[
                      styles.countryText, 
                      !country && { color: '#999' }
                    ]}
                  >
                    {country || "Pays"}
                  </Text>
                </View>
                <View style={styles.inputIconContainer}>
                  <Icon name="chevron-down" size={16} color="#888" />
                </View>
              </TouchableOpacity>
              {errors.country ? <Text style={styles.errorText}>{errors.country}</Text> : null}
              
              <TouchableOpacity
                style={styles.nextButton}
                onPress={goToNextStep}
              >
                <Text style={styles.nextButtonText}>Continuer</Text>
                <Icon name="arrow-right" size={16} color="#fff" style={styles.nextButtonIcon} />
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View style={[styles.stepContainer, animatedStyle]}>
              <Text style={styles.stepTitle}>Sécuriser votre compte</Text>
              <Text style={styles.stepSubtitle}>Créez un mot de passe fort</Text>
              
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Icon name="lock" size={18} color="#888" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Mot de passe"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) {
                      setErrors({...errors, password: null});
                    }
                  }}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon
                    name={showPassword ? 'eye-slash' : 'eye'}
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
              
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Icon name="lock" size={18} color="#888" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Confirmer le mot de passe"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                      setErrors({...errors, confirmPassword: null});
                    }
                  }}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Icon
                    name={showConfirmPassword ? 'eye-slash' : 'eye'}
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword ? (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              ) : null}
              
              <View style={styles.passwordStrengthContainer}>
                <View style={styles.passwordStrengthBar}>
                  <View 
                    style={[
                      styles.passwordStrengthFill,
                      {
                        width: password.length < 4 ? '25%' : 
                              password.length < 8 ? '50%' :
                              /\d/.test(password) && /[a-zA-Z]/.test(password) ? '100%' : '75%',
                        backgroundColor: password.length < 4 ? '#ff6b6b' : 
                                        password.length < 8 ? '#feca57' : 
                                        /\d/.test(password) && /[a-zA-Z]/.test(password) ? '#1dd1a1' : '#54a0ff'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.passwordStrengthText}>
                  {password.length < 4 ? 'Faible' : 
                   password.length < 8 ? 'Moyen' :
                   /\d/.test(password) && /[a-zA-Z]/.test(password) ? 'Fort' : 'Bon'}
                </Text>
              </View>
              
              <TouchableOpacity
                style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Text style={styles.registerButtonText}>Inscription en cours...</Text>
                ) : (
                  <Text style={styles.registerButtonText}>S'inscrire</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          )}
          
          <View style={styles.policyContainer}>
            <Text style={styles.policyText}>
              En vous inscrivant, vous acceptez nos{' '}
              <Text style={styles.policyLink}>Conditions d'utilisation</Text> et notre{' '}
              <Text style={styles.policyLink}>Politique de confidentialité</Text>
            </Text>
          </View>
        </View>
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Vous avez déjà un compte?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Modal pour la sélection de pays */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={countryModalVisible}
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionnez votre pays</Text>
              <TouchableOpacity onPress={() => setCountryModalVisible(false)}>
                <Icon name="times" size={20} color="#888" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <Icon name="search" size={18} color="#888" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un pays"
                placeholderTextColor="#999"
                value={countrySearch}
                onChangeText={filterCountries}
                autoCapitalize="none"
              />
              {countrySearch.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearSearch}
                  onPress={() => {
                    setCountrySearch('');
                    setFilteredCountries(countries);
                  }}
                >
                  <Icon name="times-circle" size={16} color="#888" />
                </TouchableOpacity>
              )}
            </View>
            
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => selectCountry(item.name, item.code)}
                >
                  <Text style={styles.flagEmoji}>{countryCodeToEmoji(item.code)}</Text>
                  <Text style={styles.countryItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>Aucun pays trouvé</Text>
                  <TouchableOpacity
                    style={styles.addCustomCountry}
                    onPress={() => {
                      if (countrySearch.trim() !== '') {
                        addCustomCountry(countrySearch.trim());
                      }
                    }}
                  >
                    <Text style={styles.addCustomCountryText}>
                      Ajouter "{countrySearch.trim()}"
                    </Text>
                  </TouchableOpacity>
                </View>
              }
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    scrollContainer: {
      flexGrow: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#c62828',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
    },
    progressContainer: {
      height: 4,
      backgroundColor: '#f5f5f5',
      width: '100%',
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#c62828',
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
    },
    formContainer: {
      flex: 1,
      padding: 24,
    },
    stepText: {
      fontSize: 14,
      color: '#888',
      marginBottom: 12,
    },
    stepContainer: {
      marginBottom: 24,
      width: '100%',
    },
    stepTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
      width: '100%',
    },
    stepSubtitle: {
      fontSize: 15,
      color: '#888',
      marginBottom: 24,
      width: '100%',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: 10,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#eee',
    },
    countryInputContainer: {
      flex: 1,
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
    },
    countryText: {
      fontSize: 16,
      color: '#333',
      flex: 1,
      paddingVertical: 12,
    },
    inputIconContainer: {
      padding: 14,
    },
    input: {
      flex: 1,
      height: 50,
      fontSize: 16,
      color: '#333',
    },
    eyeIcon: {
      padding: 14,
    },
    errorText: {
      color: '#c62828',
      fontSize: 12,
      marginTop: -12,
      marginBottom: 16,
      marginLeft: 10,
    },
    nextButton: {
      backgroundColor: '#c62828',
      borderRadius: 10,
      height: 55,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
      shadowColor: '#c62828',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,
    },
    nextButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    nextButtonIcon: {
      marginLeft: 8,
    },
    passwordStrengthContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    passwordStrengthBar: {
      flex: 1,
      height: 6,
      backgroundColor: '#f0f0f0',
      borderRadius: 3,
      marginRight: 10,
    },
    passwordStrengthFill: {
      height: '100%',
      borderRadius: 3,
    },
    passwordStrengthText: {
      fontSize: 14,
      color: '#888',
      width: 40,
    },
    registerButton: {
      backgroundColor: '#c62828',
      borderRadius: 10,
      height: 55,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
      shadowColor: '#c62828',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,
    },
    registerButtonDisabled: {
      backgroundColor: '#d77979',
    },
    registerButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    policyContainer: {
      marginTop: 24,
    },
    policyText: {
      fontSize: 13,
      color: '#888',
      textAlign: 'center',
      lineHeight: 20,
    },
    policyLink: {
      color: '#c62828',
      fontWeight: '500',
    },
    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 24,
      padding: 16,
    },
    loginText: {
      color: '#666',
      fontSize: 15,
    },
    loginLink: {
      color: '#c62828',
      fontWeight: 'bold',
      fontSize: 15,
      marginLeft: 5,
    },
    
    // Styles pour le modal de pays
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 16,
      paddingBottom: Platform.OS === 'ios' ? 40 : 16,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: 10,
      marginVertical: 16,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: '#eee',
    },
    searchIcon: {
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      height: 50,
      fontSize: 16,
      color: '#333',
    },
    clearSearch: {
      padding: 8,
    },
    countryItem: {
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    countryItemText: {
      fontSize: 16,
      color: '#333',
      marginLeft: 12,
    },
    flagEmoji: {
      fontSize: 22,
      lineHeight: 22,
    },
    separator: {
      height: 1,
      backgroundColor: '#f0f0f0',
    },
    noResultsContainer: {
      alignItems: 'center',
      padding: 20,
    },
    noResultsText: {
      fontSize: 16,
      color: '#888',
      marginBottom: 12,
    },
    addCustomCountry: {
      backgroundColor: '#f5f5f5',
      padding: 12,
      borderRadius: 8,
    },
    addCustomCountryText: {
      fontSize: 14,
      color: '#c62828',
      fontWeight: '500',
    },
  });

export default RegisterScreen;