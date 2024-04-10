import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, Text, Switch, Button, TextInput, StyleSheet, TouchableOpacity, Pressable, } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import Constants from 'expo-constants';
import { format } from 'date-fns';
import { TimerPicker } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from '../../../components/Button'
import { useNavigation } from '@react-navigation/native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

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
  alert(token)
  return token.data;
}

export const NotificationsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [startDuration, setStartDuration] = useState({ hours: 0, minutes: 0 });
  const [endDuration, setEndDuration] = useState({ hours: 0, minutes: 0 });
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(true);
  const [pickerMode, setPickerMode] = useState('start');
  const [frequency, setFrequency] = useState('');
  const timerPickerRef = useRef(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Switch
          trackColor={{ false: "#767577", true: "#58BA47" }}
          thumbColor={notificationsEnabled ? "#FDFEFF" : "#f4f3f4"}
          onValueChange={() => setNotificationsEnabled(previousState => !previousState)}
          value={notificationsEnabled}
        />
      )
    });
  }, [navigation, notificationsEnabled]);

  const frequencies = [
    { label: '10 min', value: 10 },
    { label: '30 min', value: 30 },
    { label: '1h', value: 60 },
    { label: '2h', value: 120 },
  ];

  const renderFrequencyButton = (label, value) => {
    const isSelected = selectedFrequency === value;
    return (
      <Pressable
        onPress={() => setSelectedFrequency(value)}
        style={({ pressed }) => [
          styles.frequencyButton,
          isSelected ? styles.selectedFrequencyButton : styles.unselectedFrequencyButton,
          pressed && styles.pressedFrequencyButton,
        ]}
      >
        <Text style={isSelected ? styles.selectedFrequencyButtonText : styles.frequencyButtonText}>
          {label}
        </Text>
      </Pressable>
    );
  };


  useEffect(() => {
    if (notificationsEnabled) {
      registerForPushNotificationsAsync().then(token => {
        alert(token);
      });
    }
  }, [notificationsEnabled]);

  const savePreferences = async () => {
    const formattedStartTime = format(startTime, 'HH:mm:ss');
    const formattedEndTime = format(endTime, 'HH:mm:ss');
    const token = await SecureStore.getItemAsync('userToken');
    console.log(formattedStartTime, formattedEndTime, selectedFrequency);
    // try {
    //   const response = await axios.post(`${apiUrl}/notifications/savePreferences`, {
    //     token,
    //     startTime: formattedStartTime,
    //     endTime: formattedEndTime,
    //     frequency: parseInt(frequency, 10),
    //     expoToken: 'ExponentPushToken[7Y83a8BAbF8seHZbnZ1KVT]',
    //   }, {
    //     headers: {
    //       token: token
    //     }
    //   });

    //   if (response.status === 201) {
    //     alert('Preferences saved');
    //   } else {
    //     alert('Failed to save preferences');
    //   }
    // } catch (error) {
    //   alert('Failed to save preferences');
    //   console.error(error);
    // }
  };

  const handleShowPicker = (mode) => {
    setPickerMode(mode);
    setShowPicker(true);

    const duration = mode === 'start' ? startDuration : endDuration;
    timerPickerRef.current?.setValue({ hours: duration.hours, minutes: duration.minutes }, { animated: false });
  };


  const handleTimeSelected = (duration) => {
    if (pickerMode === 'start') {
      setStartDuration(duration);
      setStartTime(new Date(startTime.setHours(duration.hours, duration.minutes)));
      console.log(startDuration.hours, startDuration.minutes, startTime);
    } else if (pickerMode === 'end') {
      setEndDuration(duration);
      setEndTime(new Date(endTime.setHours(duration.hours, duration.minutes)));
      console.log(endDuration.hours, endDuration.minutes, endTime);

    }
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Période</Text>
      <View style={styles.btnContainer}>
        <Pressable
          style={[styles.btnContainer, pickerMode === 'start' ? styles.selectedBtn : {}]}
          onPress={() => handleShowPicker('start')}
        >
          <Text>Début</Text>
        </Pressable>
        <Pressable
          style={[styles.btnContainer, pickerMode === 'end' ? styles.selectedBtn : {}]}
          onPress={() => handleShowPicker('end')}
        >
          <Text>Fin</Text>
        </Pressable>    
      </View>
      {showPicker && (
        <View style={{backgroundColor: "#F1F1F1", alignItems: "center", justifyContent: "center", marginTop: 20}}>
          <TimerPicker
              onDurationChange={handleTimeSelected}
              ref={timerPickerRef}
              padWithNItems={1}
              aggressivelyGetLatestDuration
              allowFontScaling
              hourLabel=":"
              minuteLabel=""
              hideSeconds
              LinearGradient={LinearGradient}
              styles={{
                  theme: "light",
                  pickerItem: {
                      fontSize: 34,
                  },
                  pickerLabel: {
                      fontSize: 32,
                      marginTop: 0,
                  },
                  pickerContainer: {
                      marginRight: 6,
                  },
                  pickerItemContainer: {
                      width: 100
                  },
                  pickerLabelContainer: {
                      right: -20,
                      top: 0,
                      bottom: 6,
                      width: 40,
                      alignItems: "center",
                  },
                  disabledPickerContainer: {
                      opacity: 0.5,
                      backgroundColor: "red",
                  },
                  disabledPickerItem: {
                      color: "red",
                  },
              }}
          />
        </View>
      )}
      <Text style={styles.title}>Fréquence</Text>
      <Text style={styles.subtitle}>Profite de ta Poz’Plaisir toutes les : </Text>
      <View style={styles.frequencyContainer}>
        {frequencies.map((freq) => renderFrequencyButton(freq.label, freq.value))}
      </View>

      <CustomButton style={styles.btn} disabled={!selectedFrequency} text="Valider" onPress={savePreferences} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginTop: 20,
    padding: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: "#EAEAEA",
    padding: 5,
    marginTop: 4,
    gap: 10,
  },
  selectedBtn: {
    backgroundColor: "#F1F1F1",
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    gap: 10,
  },
  frequencyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#272829',
    paddingVertical: 12,
    paddingHorizontal: 12,
    minWidth: 60,
    borderRadius: 4,
    marginVertical: 10,
    elevation: 3,
  },
  selectedFrequencyButton: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  unselectedFrequencyButton: {
    backgroundColor: 'white',
    borderColor: 'black',
  },
  pressedFrequencyButton: {
    opacity: 0.8,
  },
  frequencyButtonText: {
    color: 'black',
  },
  selectedFrequencyButtonText: {
    color: 'white',
  },
  title: {
    marginTop: 58,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1F1F1F'
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginTop: 4,
    color: '#505050'
  },
});
