import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default CustomButtonPass = ({ onPress, text }) => {

  return (
    <TouchableOpacity  style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderRadius: 4,
    marginVertical: 10,
    elevation: 3,
  },
  text: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: 'black',
  },
});
