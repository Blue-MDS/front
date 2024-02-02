import axios from 'axios';
import { API_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

export const fetchTotalConsumption = async () => {
  const token = await SecureStore.getItemAsync('userToken');
  return axios.get(`${API_URL}/water/totalConsumption`, {
    headers: {
      token: token
    }
  });
};

export const fetchDailyGoal = async () => {
  const token = await SecureStore.getItemAsync('userToken');
  return axios.get(`${API_URL}/water/dailyGoal`, {
    headers: {
      token: token
    }
  });
};

export const recordConsumption = async (quantity) => {
  const token = await SecureStore.getItemAsync('userToken');
  return axios.post(`${API_URL}/water/record`, {quantity}, {
    headers: {
      token: token
    }
  });
};

export const updateDailyGoal = async (newDailyGoal) => {
  console.log(newDailyGoal);
  const token = await SecureStore.getItemAsync('userToken');
  return axios.put(`${API_URL}/water/updateDailyGoal`, {newDailyGoal}, {
    headers: {
      token: token
    }
  });
}