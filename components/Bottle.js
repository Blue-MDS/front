import React, { useRef, useState, useContext } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import Rive from 'rive-react-native';
import { AuthContext } from '../contexts/AuthContext';
import * as SecureStore from 'expo-secure-store';

export const WaterBottle = () => {
  const { signOut } = useContext(AuthContext);
  const riveRef = useRef(null);
  const [littres, setLittres] = useState(0);

  const playState = (stateName) => {
    if (riveRef.current) {
      console.log(`Trying to play: ${stateName}`);
      riveRef.current.play(stateName);
    } else {
      console.error('riveRef.current is null');
    }
  };

  const exit = async () => {
    await SecureStore.deleteItemAsync('currentStep');
    signOut();
  }

  const handleFireState = (value) => {
    setLittres(value);
    riveRef.current?.setInputState(
      'percentage', // Assurez-vous que le nom 'precentage' est correct, cela semble être une faute de frappe.
      'percentage', // Ce pourrait être une autre faute de frappe pour 'percent'.
      value,
    );
  };



  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>{littres / 100}</Text>
      <Rive
        ref={riveRef}
        load
        stateMachineName='controllable'
        autoplay={true}
        resourceName="blue_water4"
        style={{ width: 400, height: 400 }}
      />
      <Slider
        style={{width: 300, height: 40}}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor="#0000FF"
        maximumTrackTintColor="#000000"
        vertical
        step={1}
        value={littres}
        onValueChange={(value) => handleFireState(value)}
      />
      <Button title="Sign out" onPress={exit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  stepTitle: {
    marginTop: 58,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1F1F1F'
  },
});
