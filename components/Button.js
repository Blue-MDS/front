import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default CustomButton = ({ onPress, text, disabled }) => {

  return (
    <TouchableOpacity disabled={disabled} style={[styles.button, {backgroundColor: disabled ? '#EFEFEF' : '#272829'}]} onPress={onPress}>
      <Text style={[styles.text, {color: disabled ? 'black' : 'white'}]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#272829',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    marginVertical: 10,
    elevation: 3,
  },
  text: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: 'white',
  },
});
