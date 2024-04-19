import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, Pressable, SafeAreaView, Image } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { WaterContext } from '../contexts/ConsumptionContext';
import Rive from 'rive-react-native';
import { recordConsumption } from '../services/waterService';
import { AntDesign } from '@expo/vector-icons';
import { ObjectifBar } from './ObjectifBar';
import CustomButton from './Button';
import CustomButtonPass from './ButtonPass';
import glassWater from '../assets/glass-water.png';

export const WaterBottle = ({ toggleScroll}) => {
  const { littres, setLittres, dailyGoal } = useContext(WaterContext);
  const [currentLittres, setCurrentLittres] = useState(littres);
  const riveRef = useRef(null);
  const [initialLittres, setInitialLittres] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  const drops = Math.round(littres * 6.666666666666667);

  useEffect(() => {
    console.log('litres', littres);
    if (dailyGoal > 0 && littres >= 0) {
      setCurrentLittres(littres);
      const riveValue = (littres * 100 / dailyGoal);
      riveRef.current?.setInputState('controllable', 'percentage', riveValue);
    }
  }, [dailyGoal, littres]);

  const modifyLittres = (amount) => {
    const newLittres = currentLittres + amount;
    if (newLittres > dailyGoal) {
      console.log('newLittres > dailyGola', newLittres);
      setCurrentLittres(dailyGoal);
      riveRef.current?.setInputState('controllable', 'percentage', 100);
    } else if (newLittres >= initialLittres) {
      console.log('newLittres >= initialLittres', newLittres);
      setCurrentLittres(newLittres);
      riveRef.current?.setInputState('controllable', 'percentage', (newLittres * 100 / dailyGoal));
    } else {
      console.log('newLittres', initialLittres);
      setCurrentLittres(initialLittres);
      riveRef.current?.setInputState('controllable', 'percentage', (initialLittres * 100 / dailyGoal));
    }
  };
  
  const handlePressIn = (modifier) => {
    console.log('modifier', modifier);
    modifyLittres(modifier)
  };

  const handlePress = () => {
    if (!isChanging) {
      setInitialLittres(littres);
      setIsChanging(true);
    } else {
      const additionalQuantity = currentLittres - initialLittres;
      if (additionalQuantity > 0) {
        recordNewConsumption(additionalQuantity, currentLittres);
      }
      setIsChanging(false);
    }
  };

  const recordNewConsumption = async (quantity) => {
    console.log('recordNewConsumption', quantity);
    try {
      const response = await recordConsumption(quantity);
      if (response.status === 201) {
        console.log('success');
        setLittres(currentLittres);
      } else {
        // TODO : manage errors
      }
    } catch (error) {
      console.error(error);
    }
  }

  const cancel = () => {
    setIsChanging(false);
    setCurrentLittres(initialLittres);
    riveRef.current?.setInputState('controllable', 'percentage', (initialLittres * 100 / dailyGoal));
    toggleScroll(true);
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.stepTitle}>Ton objectif aujourd'hui</Text>
      <Text style={styles.subtitle}>{formatDate()}</Text>
      <View style={styles.stats}>
        <Text style={styles.bigTitle}>{currentLittres.toFixed(2)}L</Text>
        <Text style={styles.subtitle}>sur</Text>
        <Text style={styles.bigTitle}>
          {dailyGoal ? dailyGoal.toFixed(2) : '0.00'}L
        </Text>
      </View>
      <ObjectifBar dailyGoal={dailyGoal} totalConsumption={currentLittres} />
      <View style={styles.animationAndControls}>
        <Rive
          load
          ref={riveRef}
          stateMachineName='controllable'
          resourceName="blue_water4"
          style={{ width: 350, height: 453 }}
          onStateChanged={(stateMachineName, stateName) => {
            console.log(
              'onStateChanged: ',
              'stateMachineName: ',
              stateMachineName,
              'stateName: ',
              stateName
            );
          }}
        />
        <View style={styles.controls}>
          {isChanging ? (
            <>
            <Pressable onPress={() => handlePressIn(0.10)} style={styles.button}>
              <AntDesign name="plus" size={24} color="black" />
            </Pressable>
              <View style={styles.glass}>
                <Image source={glassWater} style={styles.image} resizeMode="contain" />
                <View style={styles.animationText}>
                  <Text style={styles.smallText}>X{drops}</Text>
                </View>
              </View>
            <Pressable onPress={() => handlePressIn(-0.10)} style={styles.button}>
              <AntDesign name="minus" size={24} color="black" />
            </Pressable>
            </>
          ) : (
            <>
              <Pressable onPress={handlePress} style={styles.button}>
                <AntDesign name="plus" size={24} color="black" />
              </Pressable>
              <Text style={styles.subtitle}>Ajouter</Text>
            </>
          )}
        </View>
      </View>
      {isChanging && (
        <View style={styles.buttonContainer}>
        <CustomButtonPass style={styles.btn} text="Annuler" onPress={cancel} />
        <CustomButton style={styles.btn} text="Valider" onPress={handlePress} />
      </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    
  },
  stepTitle: {
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
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    right: wp('5%'),
    gap: 20,
  },
  button: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 20,
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
  animationText: {
    position: 'absolute',
    alignItems: 'center',
  },
  glass: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 85,
    height: 85,
  },
  smallText: {
    fontSize: 12,
    fontFamily: 'Poppins_700Bold',
  },
});
