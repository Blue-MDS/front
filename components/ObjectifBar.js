import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ObjectifBar = ({ dailyGoal, totalConsumption }) => {
  const progress = dailyGoal && totalConsumption ? (totalConsumption / dailyGoal) * 100 : 0;
  const clampedProgress = Math.min(progress, 100);

  const bubbleWidth = 50;
  let bubbleLeft = `${clampedProgress}%`;
  if (clampedProgress < (bubbleWidth / 2)) {
    bubbleLeft = '0%';
  }

  return (
    <View style={styles.container}>
      <View style={[styles.bubble, { left: bubbleLeft, transform: [{ translateX: -(bubbleWidth / 2) }]
      }]}>
        <Text style={styles.bubbleText}>{`${clampedProgress.toFixed(0)}%`}</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${clampedProgress}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    paddingHorizontal: 20
  },
  progressBarContainer: {
    marginTop: 10,
    height: 12,
    width: '100%',
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  progressBar: {
    borderRadius: 5,
    height: '100%',
    backgroundColor: 'black',
  },
  bubble: {
    width: 50,
    backgroundColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
  },
  bubbleText: {
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
    color: 'white',
  },
});


