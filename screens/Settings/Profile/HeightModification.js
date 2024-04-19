import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { HeightSelector } from '../../ProfileSteps/HeightStep';
import { updateUser } from '../../../services/userService';
import * as SecureStore from 'expo-secure-store';
import CustomButton from '../../../components/Button';

export const HeightModification = ({ route, navigation }) => {
  const { userInfo } = route.params;
  const [height, setHeight] = useState(userInfo.height);

  const handleSave = async () => {
    try {
      const updatedUserInfo = await updateUser({ height });
      await SecureStore.setItemAsync('userInfo', JSON.stringify(updatedUserInfo.data.user));
      navigation.goBack();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du poids", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>Quelle est ta taille ?</Text>
      <HeightSelector height={height} onHeightChange={setHeight} />
      <CustomButton style={styles.btn} text="Sauvegarder" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 48,
  },
  stepTitle: {
    marginTop: 100,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1F1F1F'
  },
  btn: {
    marginHorizontal: 20,
  }
});
