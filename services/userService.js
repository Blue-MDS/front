import axios from 'axios';
import { API_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

export const updateUser = async (data) => {
  const token = await SecureStore.getItemAsync('userToken');
  console.log(token);
  return axios.put(`${API_URL}/users/update`, data, {
    headers: {
      token: token
    }
  })
};

export const setProfileComplete = async () => {
  const token = await SecureStore.getItemAsync('userToken');
  return axios.get(`${API_URL}/users/completeProfile`, {
    headers: {
      token: token
    }
  })
}

export const checkProfileCompletion = async () => {
  const token = await SecureStore.getItemAsync('userToken');
  return axios.get(`${API_URL}/users/checkProfileComplete`, {
    headers: {
      token: token
    }
  })
}

export const fetchUser = async () => {
  const token = await SecureStore.getItemAsync('userToken');
  return axios.get(`${API_URL}/users`, {
    headers: {
      token: token
    }
  })
}