import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Platform } from 'react-native';
import { WaterBottle } from '../components/Bottle';
import WaterConsumptionHistogram from '../components/Histogram';

export const HomeScreen = () => {
  const [scrollEnabled, setScrollEnabled] = useState(true);

  return (
    <ScrollView style={styles.container} scrollEnabled={scrollEnabled}>
      <WaterBottle toggleScroll={setScrollEnabled} />
      <WaterConsumptionHistogram />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: '#FCFCFC',
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
});
