import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import CustomButton from '../components/Button';

export const OnBoardingScreen = ({ navigation }) => {

  return (
  <View style={styles.view}>
    <Text style={styles.title}>
      <Text style={ {color: '#7C7C7C'} }>Bienvenue chez Blue, là où tout se passe dans </Text>
      <Text style={ {color: 'black'}}>l’eau.</Text>
    </Text>
    
    <View style={styles.buttonContainer}>
      <CustomButton text="Commencer" onPress={() => navigation.navigate('Signup', { nextScreen: 'ProfileSteps'})} />
      <View style={styles.inlineContainer}>
        <Text style={styles.inlineText}>Déjà un compte ?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn', { nextScreen: 'DailyGoalConfirmation'})}>
          <Text style={styles.inlineButtonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
  )
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center", 
    margin: 30
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins_800ExtraBold',
  },
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    marginBottom: 50,
    bottom: 0
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  inlineText: {
    marginRight: 5,
  },
  inlineButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#1F1F1F',
  },
});