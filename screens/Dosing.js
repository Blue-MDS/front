import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, Image, SafeAreaView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Rive from 'rive-react-native';
import { AntDesign } from '@expo/vector-icons';
import glassWater from '../assets/glass-water.png';

export const Dosing = () => {
  const riveRef = useRef(null);
  const [percentage, setPercentage] = useState(0);

  const adjustPercentage = (delta) => {
    let newPercentage = percentage + delta;
    newPercentage = Math.max(0, Math.min(100, newPercentage));
    setPercentage(newPercentage);
    
    riveRef.current?.setInputState('controllable', 'percentage', newPercentage);
  };

  useEffect(() => {
    riveRef.current?.setInputState('controllable', 'percentage', percentage);
  }
  , [percentage]);

  const liters = (percentage * 0.02).toFixed(2);
  const drops = Math.round(liters * 5);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.title}>
      {liters > 0 ? (
        <>
        <Text style={styles.stepTitle}>{drops} {liters === 1 ? 'goutte' : 'gouttes'} d’arôme Blue</Text>
        <Text style={styles.subtitle}>C’est la quantité idéale pour rendre ton eau plus savoureuse</Text>
        </>
      ) : (
        <>
          <Text style={styles.stepTitle}>Quelle quantité d’eau as-tu ?</Text>
          <Text style={styles.subtitle}>Nous pourrons te conseiller le dosage parfait de ton arôme Blue</Text>
        </>
      )}
      </View>
      <View style={styles.container}>
        <View style={styles.animationAndControls}>
          <Rive
            autoPlay
            load
            ref={riveRef}
            stateMachineName='controllable'
            resourceName="blue_water4"
            style={{ width: 350, height: 453 }}
            />
            <View style={styles.animationText}>
              <Text style={styles.indicator}>{liters}L</Text>
            </View>
          <View style={styles.controls}>
            <Pressable onPress={() => adjustPercentage(5)} style={styles.button}>
              <AntDesign name="plus" size={24} color="black" />
            </Pressable>
              <View style={styles.glass}>
                <Image source={glassWater} style={styles.image} resizeMode="contain" />
                <View style={styles.animationText}>
                  <Text style={styles.smallText}>X{drops}</Text>
                </View>
              </View>
            <Pressable onPress={() => adjustPercentage(-5)} style={styles.button}>
              <AntDesign name="minus" size={24} color="black" />
            </Pressable>
          </View>
        </View> 
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  stepTitle: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: hp('2.8%'),
    fontFamily: 'Poppins_600SemiBold',
    color: '#1F1F1F',
    paddingHorizontal: 10,
  },
  title: {
  },
  subtitle: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    paddingHorizontal: 25,
    color: '#505050',
  },
  animationAndControls: {
    marginTop: 20,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationText: {
    position: 'absolute',
    alignItems: 'center',
  },
  indicator: {
    fontSize: 30,
    fontFamily: 'Poppins_700Bold',
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
  percentageText: {
    marginTop: 20,
    fontSize: 20,
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
