import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default CustomButton = ({ onPress, text, disabled, style }) => {

  return (
    <View style={style}>
      <TouchableOpacity disabled={disabled} style={[styles.button, {backgroundColor: disabled ? '#EFEFEF' : '#020202'}]} onPress={onPress}>
        <Text style={[styles.text, {color: disabled ? 'black' : 'white'}]}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020202',
    height: 54,
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
