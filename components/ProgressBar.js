import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const ProgressBar = ({ currentStep, totalSteps }) => {

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View key={index} 
        style={[ styles.step, index + 1 === currentStep ? styles.activeStep : styles.inactiveStep ]} />
      ))}   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  step: {
    width: 64,
    height: 8,
    marginHorizontal: 5,
  },
  activeStep: {
    backgroundColor: 'black',
  },
  inactiveStep: {
    backgroundColor: '#e0e0e0',
  },
});

export default ProgressBar;
