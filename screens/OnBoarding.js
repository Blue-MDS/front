import React, {useRef, useState, useContext} from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import CustomButton from '../components/Button';
import { Video, ResizeMode } from 'expo-av';

import { Dimensions } from 'react-native';
const screenHeight = Dimensions.get('window').height;

export const OnBoardingScreen = ({ navigation }) => {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  return (
  <View style={styles.view}>
    <Video
        source={require('../assets/onboarding.mp4')}
        useNativeControls
        resizeMode="cover"
        shouldPlay
        style={{ width: '100%', height: screenHeight / 2 }}
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
    
    <View style={styles.buttonContainer}>
      <CustomButton text="Commencer" onPress={() => navigation.navigate('OnboardingSwiper')} />
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
    margin: 30,
    backgroundColor: 'white',
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
    justifyContent: 'center',
    marginTop: 10,
  },
  inlineText: {
    marginRight: 5,
  },
  inlineButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#1F1F1F',
    textDecorationLine: 'underline',
  },
});