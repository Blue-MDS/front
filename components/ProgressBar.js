import React from 'react';
import { View, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ProgressBar = ({ currentStep, totalSteps }) => {
  const stepWidth = Math.max(100 / totalSteps, 15);

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View key={index} 
          style={[
            styles.step,
            { width: `${stepWidth}%` },
            index === currentStep ? styles.activeStep : styles.inactiveStep
          ]}
        />
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
    height: 8,
    marginHorizontal: 2,
    borderRadius: 8,
  },
  activeStep: {
    backgroundColor: '#1F1F1F',
  },
  inactiveStep: {
    backgroundColor: '#e0e0e0',
  },
});

export default ProgressBar;
