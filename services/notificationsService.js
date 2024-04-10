import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { format } from 'date-fns';

const apiUrl = Constants.expoConfig.extra.expoPublicApiUrl;;

export const savePreferences = async (data) => {
  const { period, frequency } = data;
  const formattedStartTime = format(period.start, 'HH:mm:ss');
  const formattedEndTime = format(period.end, 'HH:mm:ss');
  const token = await SecureStore.getItemAsync('userToken');

  try {
    const response = await axios.post(`${apiUrl}/notifications/savePreferences`, {
      token,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      frequency: parseInt(frequency, 10),
      expoToken: 'ExponentPushToken[7Y83a8BAbF8seHZbnZ1KVT]',
    }, {
      headers: {
        token: token
      }
    });

    if (response.status === 201) {
      alert('Preferences saved');
    } else {
      alert('Failed to save preferences');
    }
  }
  catch (error) {
    alert('Failed to save preferences');
    console.error(error);
  }
}

export const fetchPreferences = async () => {
  const token = await SecureStore.getItemAsync('userToken');
  return axios.get(`${apiUrl}/notifications/getPreferences`, {
    headers: {
      token: token
    }
  });
}
