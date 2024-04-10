import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import Rive from 'rive-react-native';
import { fetchTotalConsumption, fetchDailyGoal, recordConsumption } from '../services/waterService';
import { AntDesign } from '@expo/vector-icons';
import { ObjectifBar } from './ObjectifBar';
import * as SecureStore from 'expo-secure-store';
import CustomButton from './Button';
import CustomButtonPass from './ButtonPass';

export const WaterBottle = ({ signOut, toggleScroll }) => {
  const riveRef = useRef(null);
  const [littres, setLittres] = useState(0);
  const [initialLittres, setInitialLittres] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [isChanging, setIsChanging] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(0);

  useEffect(() => {
    const initialize = async () => {
      try {
        const response = await fetchTotalConsumption();
        if (response.status === 200) {
          const totalConsumption = parseFloat(response.data.waterConsumptions);
          const fetchedDailyGoal = parseFloat(await SecureStore.getItemAsync('dailyGoal'));
          setDailyGoal(fetchedDailyGoal);
          setLittres(totalConsumption);
        } else {
          console.log('error');
        }
        
      } catch (error) {
        console.error(error);
      }
    }
    initialize();
  }, []);

  useEffect(() => {
    if (dailyGoal > 0 && littres >= 0) {
      const riveValue = (littres * 100 / dailyGoal);
      riveRef.current?.setInputState('percentage', 'percentage', riveValue);
    }
  }, [dailyGoal, littres]);

  const modifyLittres = (amount) => {
    if (littres + amount >= 0.000) {
      setLittres(littres + amount);
      console.log(dailyGoal);
      riveRef.current?.setInputState('percentage', 'percentage', ((littres + amount) * 100 / dailyGoal));
    }
  };

  const handlePressIn = (modifier) => {
    const id = setInterval(() => modifyLittres(modifier), 100);
    setIntervalId(id);
  };

  const handlePressOut = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const handlePress = () => {
    if (!isChanging) {
      setInitialLittres(littres);
      setIsChanging(true);
    } else {
      const additionalQuantity = littres - initialLittres;
      if (additionalQuantity > 0) {
        recordNewConsumption(additionalQuantity);
      }
      setIsChanging(false);
    }
  };

  const recordNewConsumption = async (quantity) => {
    try {
      const response = await recordConsumption(quantity);
      if (response.status === 201) {
        console.log('success');
      } else {
        // TODO : manage errors
      }
    } catch (error) {
      console.error(error);
    }
  }

  const cancel = () => {
    setIsChanging(false);
    setLittres(initialLittres);
    riveRef.current?.setInputState('percentage', 'percentage', (initialLittres));
    toggleScroll(true);
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const exit = async () => {
    await SecureStore.deleteItemAsync('currentStep');
    signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>Ton objectif aujourd'hui</Text>
      <Text style={styles.subtitle}>{formatDate()}</Text>
      <View style={styles.stats}>
        <Text style={styles.bigTitle}>{littres.toFixed(2)}L</Text>
        <Text style={styles.subtitle}>sur</Text>
        <Text style={styles.bigTitle}>{dailyGoal ? dailyGoal.toFixed(2) : '0.0'}L</Text>
      </View>
      <ObjectifBar dailyGoal={dailyGoal} totalConsumption={littres} />
      <View style={styles.animationAndControls}>
        <Rive
          load
          ref={riveRef}
          stateMachineName='controllable'
          resourceName="blue_water4"
          style={{ width: 350, height: 350 }}
        />
        <View style={styles.controls}>
          {isChanging ? (
            <><Pressable onPressIn={() => handlePressIn(0.01)} onPressOut={handlePressOut} style={styles.button}>
              <AntDesign name="plus" size={24} color="black" />
            </Pressable><Pressable onPressIn={() => handlePressIn(-0.01)} onPressOut={handlePressOut} style={styles.button}>
                <AntDesign name="minus" size={24} color="black" />
              </Pressable></>
          ) : (
            <Pressable onPress={handlePress} style={styles.button}>
            <AntDesign name="plus" size={24} color="black" />
          </Pressable>
          )}
        </View>
      </View>
      {isChanging && (
        <View style={styles.buttonContainer}>
        <CustomButtonPass style={styles.btn} text="Annuler" onPress={cancel} />
        <CustomButton style={styles.btn} text="Valider" onPress={handlePress} />
      </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
  },
  stepTitle: {
    marginTop: 58,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1F1F1F'
  },
  animationAndControls: {
    marginTop: 20,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    position: 'absolute',
    right: 20,
    height: 350,
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
  },
  stats : {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigTitle: {
    fontSize: 40,
    fontFamily: 'Poppins_700Bold',
    color: '#1F1F1F'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  btn: {
    marginHorizontal: 10,
  },
});
