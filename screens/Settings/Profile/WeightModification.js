import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { WeightSelector } from '../../ProfileSteps/WeightStep';
import { updateUser } from '../../../services/userService';
import * as SecureStore from 'expo-secure-store';

export const WeightModification = ({ route, navigation }) => {
  const { userInfo } = route.params;
  const [weight, setWeight] = useState(userInfo.weight);

  const handleSave = async () => {
    try {
      const updatedUserInfo = await updateUser({ weight });
      await SecureStore.setItemAsync('userInfo', JSON.stringify(updatedUserInfo.data.user));
      navigation.goBack();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du poids", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>Quel est ton poids ?</Text>
      <WeightSelector weight={weight} onWeightChange={setWeight} />
      <Button title="Sauvegarder" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 48,
  },
  stepTitle: {
    marginTop: 58,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1F1F1F'
  },
});
