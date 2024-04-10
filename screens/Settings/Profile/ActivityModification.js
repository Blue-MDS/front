import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { PhysicalActivities } from '../../ProfileSteps/PhysicalActivities';
import { updateUser } from '../../../services/userService';
import * as SecureStore from 'expo-secure-store';

export const ActivityModification = ({ route, navigation }) => {
  const { userInfo } = route.params;
  const [selectedActivity, setSelectedActivity] = useState(userInfo.physical_activity);

  const handleSave = async () => {
    try {
      const updatedUserInfo = await updateUser({ physical_activity: selectedActivity });
      await SecureStore.setItemAsync('userInfo', JSON.stringify(updatedUserInfo.data.user));
      navigation.goBack();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'activité physique", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>Quel est ton niveau d'activité physique ?</Text>
      <PhysicalActivities selectedActivity={selectedActivity} onSelect={setSelectedActivity} />
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
