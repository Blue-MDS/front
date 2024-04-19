import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { PhysicalActivities } from '../../ProfileSteps/PhysicalActivities';
import { updateUser } from '../../../services/userService';
import * as SecureStore from 'expo-secure-store';
import CustomButton from '../../../components/Button';


const fontScale = PixelRatio.getFontScale();
const getFontSize = size => size / fontScale;

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
      <View style={styles.background} />
      <Text style={styles.stepTitle}>Quel est ton niveau d'activité physique ?</Text>
      <PhysicalActivities selectedActivity={selectedActivity} onSelect={setSelectedActivity} />
      <View style={styles.buttonContainer}>
        <CustomButton text="Sauvegarder" onPress={handleSave} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  stepTitle: {
    marginTop: hp('7%'),
    marginBottom: hp('8%'),
    paddingHorizontal: wp('15%'),
    textAlign: 'center',
    fontSize: hp('3%'),
    fontFamily: 'Poppins_600SemiBold',
    color: '#1F1F1F'
  },
  background: {
    backgroundColor: '#C5F4E1',
    position: 'absolute',
    top: 0,
    width: wp('100%'),
    height: hp('20%'),
    zIndex: -1,
  },
  buttonContainer: {
    marginTop: hp('5%'),
    paddingHorizontal: 20
  }
});
