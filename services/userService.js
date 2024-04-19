import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.expoPublicApiUrl;

export const updateUser = async (data) => {
  const token = await SecureStore.getItemAsync('userToken');
  console.log('calling update user with token:', token);
  console.log('data being sent:', JSON.stringify(data, null, 2));
  try {
    const response = await axios.put(`${apiUrl}/users/update`, data, {
      headers: {
        token: token
      }
    });
    console.log('API Response:', response);
    return response;
  } catch (error) {
    console.error('API Call Failed:', error.response ? error.response.data : error);
    throw error; // Rethrowing the error after logging it can be useful for further handling
  }
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

export const deleteAccount = async () => {
  const token = await SecureStore.getItemAsync('userToken');
  return axios.delete(`${apiUrl}/users/delete`, {
    headers: {
      token: token
    }
  })
}

export const saveProfilePicture = async (data) => {
  const token = await SecureStore.getItemAsync('userToken');
  return axios.post(`${apiUrl}/users/updateProfilePicture`, data, {
    headers: {
      token: token
    }
  })
}