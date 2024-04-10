import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { WaterBottle } from '../components/Bottle';
import WaterConsumptionHistogram from '../components/Histogram';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { fetchDailyGoal } from '../services/waterService';


export const HomeScreen = () => {
  const { signOut } = useContext(AuthContext);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const toggleScroll = (isEnabled) => {
    setScrollEnabled(isEnabled);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const today = new Date().toLocaleDateString();
        const dailyGoalDate = await SecureStore.getItemAsync('dailyGoalDate');
        const storedDailyGoal = await SecureStore.getItemAsync('dailyGoal');
        console.log('dailyGoalDate:', dailyGoalDate, 'storedDailyGoal:', storedDailyGoal);
        if (storedDailyGoal === null && dailyGoalDate === null){
          const response = await fetchDailyGoal();
          if (response.data.length) {
            await SecureStore.setItemAsync('dailyGoal', response.data[0].goal_quantity.toString());
            await SecureStore.setItemAsync('dailyGoalDate', today);
          } else {
            console.log('Erreur lors de la récupération du dailyGoal');
          }
        }
        
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'objectif quotidien:', error);
      }
    };

    initialize();
  }, []);


  return (
    <ScrollView style={styles.container} scrollEnabled={scrollEnabled}>
      <WaterBottle toggleScroll={toggleScroll} />
      <WaterConsumptionHistogram />
      {/* <Button title="Sign out" onPress={signOut} /> */}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center'
  },});
