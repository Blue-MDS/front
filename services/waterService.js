import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.expoPublicApiUrl;;

export const fetchTotalConsumption = async () => {
  const token = await SecureStore.getItemAsync('userToken');
  return axios.get(`${apiUrl}/water/totalConsumption`, {
    headers: {
      token: token
    }
  });
};

export const fetchDailyGoal = async () => {
  const token = await SecureStore.getItemAsync('userToken');
  return axios.get(`${apiUrl}/water/dailyGoal`, {
    headers: {
      token: token
    }
  });
};

export const recordConsumption = async (quantity) => {
  const token = await SecureStore.getItemAsync('userToken');
  return axios.post(`${apiUrl}/water/record`, {quantity}, {
    headers: {
      token: token
    }
  });
};

export const updateDailyGoal = async (newDailyGoal) => {
  console.log(newDailyGoal);
  const token = await SecureStore.getItemAsync('userToken');
  return axios.put(`${apiUrl}/water/updateDailyGoal`, {newDailyGoal}, {
    headers: {
      token: token
    }
  });
}