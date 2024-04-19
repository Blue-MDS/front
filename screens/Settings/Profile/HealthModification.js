import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { HealthIssues } from '../../ProfileSteps/HealthStep';
import { updateUser } from '../../../services/userService';
import CustomButton from '../../../components/Button';
import * as SecureStore from 'expo-secure-store';

export const HealthModification = ({ route, navigation }) => {
  const { userInfo } = route.params;
  const [selectedIssues, setSelectedIssues] = useState(userInfo.health_issues || []);

  const handleSave = async () => {
    try {
      const updatedUserInfo = await updateUser({ health_issues: selectedIssues });
      await SecureStore.setItemAsync('userInfo', JSON.stringify(updatedUserInfo.data.user));
      navigation.goBack();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des problèmes de santé", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <Text style={styles.stepTitle}>As-tu l’un de ces problèmes de santé ?</Text>
      <HealthIssues selectedIssues={selectedIssues} onSelect={setSelectedIssues} />
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
    paddingHorizontal: wp('10%'),
    textAlign: 'center',
    fontSize: hp('3%'),
    fontFamily: 'Poppins_600SemiBold',
    color: '#1F1F1F'
  },
  background: {
    backgroundColor: '#D6DAEA',
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
