import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.expoPublicApiUrl;;

export const userHasTeam = async () => {
  const token = await SecureStore.getItemAsync('userToken');
  return axios.get(`${apiUrl}/quiz/getUserTeam`, {
    headers: {
      token: token
    }
  });
}