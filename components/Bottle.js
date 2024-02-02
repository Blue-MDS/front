import React, { useState, useRef, useEffect } from 'react';
import { View, PanResponder, StyleSheet, Text, Image, Pressable } from 'react-native';
import Rive from 'rive-react-native';
import cursorImage from '../assets/cursor.png';
import { fetchTotalConsumption, fetchDailyGoal, recordConsumption } from '../services/waterService';
import { AntDesign } from '@expo/vector-icons';
import { ObjectifBar } from './ObjectifBar';
import * as SecureStore from 'expo-secure-store';
import CustomButton from './Button';
import CustomButtonPass from './ButtonPass';

export const WaterBottle = ({ signOut, toggleScroll }) => {
  const riveAnimationHeight = 350;
  const riveRef = useRef(null);
  const [littres, setLittres] = useState(0);
  const [initialLittres, setInitialLittres] = useState(0);
  const cursorYRef = useRef(350);
  const [cursorY, setCursorY] = useState(350);
  const initialYRef = useRef(riveAnimationHeight);
  const dailyGoalRef = useRef(null);
  const [isChanging, setIsChanging] = useState(false);
  const minCursorYRef = useRef(riveAnimationHeight);

  useEffect(() => {
    const initialize = async () => {
      try {
        const response = await fetchTotalConsumption();
        if (response.status === 200) {
          const totalConsumption = parseFloat(response.data.waterConsumptions);
          const toto = await SecureStore.getItemAsync('dailyGoal');
          dailyGoalRef.current = parseFloat(toto);
          const riveValue = (totalConsumption * 100 / dailyGoalRef.current)
          const cursorRangeHeight = cursorRange.max - cursorRange.min;
          const cursorPosition = cursorRangeHeight - (cursorRangeHeight * riveValue / 100);
          setLittres(totalConsumption);
          setCursorY(cursorPosition);
          cursorYRef.current = cursorPosition;
          minCursorYRef.current = cursorPosition;
          riveRef.current?.setInputState('percentage', 'percentage', riveValue);
        } else {
          console.log('error');
        }
        
      } catch (error) {
        console.error(error);
      }
    }
    initialize();
  }, []);

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

  const cancelChange = () => {
    setIsChanging(false);
    setLittres(initialLittres);
    cursorYRef.current = minCursorYRef.current;
    initialYRef.current = minCursorYRef.current;
    setCursorY(minCursorYRef.current);
    riveRef.current?.setInputState('percentage', 'percentage', (initialLittres * 100 / dailyGoalRef.current));
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


  const cursorRange = {
    min: 0,
    max: riveAnimationHeight - 22,
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (event, gestureState) => {
        toggleScroll(false);
        initialYRef.current = cursorYRef.current;
        setIsChanging(true);
      },
      onPanResponderMove: (event, gestureState) => {
        toggleScroll(true);
        const displacement = gestureState.dy;
        let newY = initialYRef.current + displacement;
        newY = Math.min(newY, minCursorYRef.current);
        newY = Math.max(cursorRange.min, Math.min(newY, cursorRange.max));
        cursorYRef.current = newY;
        setCursorY(newY); 
        if (dailyGoalRef.current) {
          const riveValue = (dailyGoalRef.current * (1 - newY / riveAnimationHeight) * 100);
          setLittres(riveValue / 100);
          riveRef.current?.setInputState('percentage', 'percentage', riveValue / dailyGoalRef.current);
        }
      },
      onPanResponderRelease: () => {
        console.log('cursorY:', cursorYRef.current, 'initialY:', initialYRef.current);
      },
    })
  ).current;

  const cursorStyle = {
    ...styles.cursor,
    top: cursorY,
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
        <Text style={styles.bigTitle}>{dailyGoalRef.current ? dailyGoalRef.current.toFixed(2) : '0.0'}L</Text>
      </View>
      <ObjectifBar dailyGoal={dailyGoalRef.current} totalConsumption={littres} />
      <View style={styles.animationContainer}>
        <Rive
          load
          ref={riveRef}
          stateMachineName='controllable'
          resourceName="blue_water7"
          style={{ width: 350, height: 350 }}
        />
       {isChanging && (
        <Image
        source={cursorImage}
        style={[styles.cursorContainer, cursorStyle]}
        {...panResponder.panHandlers}
      />)}
      </View>
      <View style={styles.pressableContainer}>
        {isChanging ? (
          <>
            <CustomButton style={styles.btn} onPress={handlePress} text="Valider" />
            <CustomButtonPass style={styles.btn} onPress={cancelChange} text="Annuler" />
          </>
        ) : (
          <Pressable onPress={handlePress}>
            <AntDesign name="pluscircle" size={32} color="black" />
          </Pressable>
        )}
      </View>
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
  animationContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  stats : {
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigTitle: {
    fontSize: 40,
    fontFamily: 'Poppins_700Bold',
    color: '#1F1F1F'
  },
  pressableContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  cursorContainer: {
    position: 'absolute',
    marginLeft: -15,
  },
  cursor: {
    width: 250,
    resizeMode: 'contain',
  },
  btn: {
    marginHorizontal: 10,
  }

});
