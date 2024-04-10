import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.expoPublicApiUrl;;

export const updateUser = async (data) => {
  const token = await SecureStore.getItemAsync('userToken');
  console.log(token);
  return axios.put(`${apiUrl}/users/update`, data, {
    headers: {
      token: token
    }
  })
};

export const setProfileComplete = async () => {
  const token = await SecureStore.getItemAsync('userToken');
  return axios.get(`${apiUrl}/users/completeProfile`, {
    headers: {
      token: token
    }
  })
}

export const checkProfileCompletion = async () => {
  const token = await SecureStore.getItemAsync('userToken');
  return axios.get(`${apiUrl}/users/checkProfileComplete`, {
    headers: {
      token: token
    }
  })
}

export const fetchUser = async () => {
  const token = await SecureStore.getItemAsync('userToken');
  return axios.get(`${apiUrl}/users`, {
    headers: {
      token: token
    }
  })
}