import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { fetchDailyGoal, fetchTotalConsumption } from '../services/waterService';
export const WaterContext = createContext(null);

export const WaterProvider = ({ children }) => {
  const [littres, setLittres] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(0);

  const initializeDailyGoal = async () => {
    console.log('initializeDailyGoal');
    try {
      const today = new Date().toLocaleDateString();
      const dailyGoalDate = await SecureStore.getItemAsync('dailyGoalDate');
      const storedDailyGoal = await SecureStore.getItemAsync('dailyGoal');
      console.log('dailyGoalDate', dailyGoalDate);
      console.log('storedDailyGoal', storedDailyGoal);
      if (dailyGoalDate === today && storedDailyGoal !== null) {
        setDailyGoal(parseFloat(storedDailyGoal));
        return;
      } else {
        const response = await fetchDailyGoal();
        if (response.data.length && !isNaN(response.data[0].goal_quantity)) {
          console.log('daily goal',parseFloat(response.data[0].goal_quantity));
          await SecureStore.setItemAsync('dailyGoal', response.data[0].goal_quantity.toString());
          await SecureStore.setItemAsync('dailyGoalDate', today);
          setDailyGoal(parseFloat(response.data[0].goal_quantity));
        } else {
          console.error('No daily goal found');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const initializeCurrentLitres = async () => {
    console.log('initializeCurrentLitres');
    try {
      const response = await fetchTotalConsumption();
      if (response.status === 200) {
        const totalConsumption = parseFloat(response.data.waterConsumptions);
        console.log('totalConsumption', totalConsumption);
        setLittres(totalConsumption);
      } else {
        console.log('error');
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    initializeDailyGoal();
    initializeCurrentLitres();
  }, []);

  return (
    <WaterContext.Provider value={{ littres, setLittres, dailyGoal, setDailyGoal }}>
      {children}
    </WaterContext.Provider>
  );
};

export const useWater = () => useContext(WaterContext);
