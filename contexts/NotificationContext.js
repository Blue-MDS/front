import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { fetchPreferences } from '../services/notificationsService';

const NotificationSettingsContext = createContext();

export const useNotificationSettings = () => useContext(NotificationSettingsContext);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const NotificationSettingsProvider = ({ children }) => {
  const [period, setPeriod] = useState({ start: new Date(), end: new Date() });
  const [frequency, setFrequency] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  

  const apiUrl = Constants.expoConfig.extra.expoPublicApiUrl;

  async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
      alert('Must use physical device for Push Notifications');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    const token = await Notifications.getExpoPushTokenAsync();
    console.log(token);
    return token.data;
  }

  useEffect(() => {
    if (notificationsEnabled) {
      registerForPushNotificationsAsync();
    }
  }, [notificationsEnabled]);

  useEffect(() => {
    const initialize = async () => {
      const preferences = await fetchPreferences();
      console.log(preferences.data);
      if (preferences) {
        const { start_time, end_time, frequency } = preferences.data;
        const [startHours, startMinutes] = start_time.split(':').map(Number);
        const [endHours, endMinutes] = end_time.split(':').map(Number);
        const startDate = new Date();
        startDate.setHours(startHours, startMinutes, 0, 0);
        const endDate = new Date();
        endDate.setHours(endHours, endMinutes, 0, 0);

        setPeriod({ start: startDate, end: endDate });
        setFrequency(frequency);
      }
    }
    initialize();
  }
  , []);

  const updatePeriod = (start, end) => {
    setPeriod({ start, end });
  };

  const updateFrequency = (newFrequency) => {
    setFrequency(newFrequency);
  };

  const toggleNotificationsEnabled = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <NotificationSettingsContext.Provider value={{ period, frequency, notificationsEnabled, updatePeriod, updateFrequency, toggleNotificationsEnabled }}>
      {children}
    </NotificationSettingsContext.Provider>
  );
};
