import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { TimerPicker } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useNotificationSettings } from '../../../contexts/NotificationContext';

export const PeriodSettingsScreen = () => {
  const { period, updatePeriod } = useNotificationSettings();
  const [pickerMode, setPickerMode] = useState('start');

  const timerPickerRef = useRef(null); 
  const startDuration = { hours: period.start.getHours(), minutes: period.start.getMinutes() };
  const endDuration = { hours: period.end.getHours(), minutes: period.end.getMinutes() };

  const handleShowPicker = (mode) => {
    setPickerMode(mode);
    const duration = mode === 'start' ? startDuration : endDuration;
    timerPickerRef.current?.setValue(duration, { animated: false });
  };

  const handleTimeSelected = (duration) => {
    let newTime = new Date();
    newTime.setHours(duration.hours, duration.minutes);

    if (pickerMode === 'start') {
      updatePeriod(newTime, period.end);
    } else {
      updatePeriod(period.start, newTime);
    }
  };

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
      <View style={{alignItems: "center", justifyContent: "center", marginTop: 20}}>
          <TimerPicker
              initialHours={period.start.getHours()}
              initialMinutes={period.start.getMinutes()}
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
  button: {
    backgroundColor: '#272829',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

