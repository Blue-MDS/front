import React, { useRef} from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNotificationSettings } from '../../../contexts/NotificationContext';
import { TimerPicker } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";

export const FrequencySettingsScreen = () => {
  const { frequency, updateFrequency } = useNotificationSettings();
  const timerPickerRef = useRef(null); 

  const handleTimeSelected = (duration) => {
    const time = duration.hours * 60 + duration.minutes;
    updateFrequency(time);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fréquence</Text>
      <Text style={styles.subtitle}>Profite de ta Poz’Plaisir toutes les : </Text>
      <View style={{alignItems: "center", justifyContent: "center", marginTop: 20}}>
          <TimerPicker
              onDurationChange={handleTimeSelected}
              ref={timerPickerRef}
              padWithNItems={1}
              aggressivelyGetLatestDuration
              allowFontScaling
              hourLabel=":"
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
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

