// CustomButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold_Italic, Poppins_700Bold } from '@expo-google-fonts/poppins'

export default CustomButton = ({ onPress, text }) => {

  let [fontsLoaded] = useFonts({
      Poppins_400Regular,
      Poppins_600SemiBold_Italic,
      Poppins_700Bold
    });
  
    if (!fontsLoaded) {
      return null;
    }

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 400,
    borderRadius: 120,
    borderWidth: 1.5,
    borderColor: '#00060C',
    backgroundColor: 'white',
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#00060C',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,

  },
  text: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Poppins_700Bold',
  },
});
