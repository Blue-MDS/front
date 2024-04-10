import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { View, SafeAreaView, StyleSheet, Text, Modal } from 'react-native';
import CustomButton from '../../components/Button';
import CustomButtonPass from '../../components/ButtonPass'
import ProgressBar from '../../components/ProgressBar';
import { WeightSelector } from './WeightStep'
import { HeightSelector } from './HeightStep';
import { PhysicalActivities } from './PhysicalActivities';
import { HealthIssues } from './HealthStep';
import { PersonnalInfo } from './PersonnalInfoStep';
import { useForm, Controller } from "react-hook-form";
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from '../../contexts/AuthContext';
import { updateUser, setProfileComplete, fetchUser } from '../../services/userService';
import Constants from 'expo-constants';

const totalSteps = 5;
const apiUrl = Constants.expoConfig.extra.expoPublicApiUrl;;

export const ProfileSteps = ({navigation}) => {
  const { signOut, completeProfile } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [modalVisible, setModalVisible] = useState(true);
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      birthDate: "",
      height: "",
      weight: "",
      physical_activity: "",
      health_issues: [],
    },
  });

  useEffect(() => {
    const fetchCurrentStep = async () => {
      await completeProfile();
      // await SecureStore.deleteItemAsync('currentStep');
      const userInfo = await SecureStore.getItemAsync('userInfo');
      console.log(userInfo);
      try {
        const currentStep = await SecureStore.getItemAsync('currentStep');
        if (currentStep) {
          setCurrentStep(JSON.parse(currentStep));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCurrentStep();
  }, []);

  const createDailyGoal = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get(`${apiUrl}/water/saveDailyGoal`, {
        headers: {
          token: token
        }
      })  
      if (response.status === 201) {
        navigation.navigate('DailyGoalConfirmation')
      } else {
        // TODO : manage errors
      }
    } catch (error) {
      console.error(error);
    }
  }

  const onSubmit = async (data) => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      await SecureStore.setItemAsync('currentStep', JSON.stringify(nextStep));
      setCurrentStep(nextStep);
    } else {
    try {
      const response = await updateUser(data);
      if (response.status === 200) {
        const profileIsCompleted = await setProfileComplete();
        if (profileIsCompleted.data.isCompleted) {
          const user = await fetchUser();
          await SecureStore.setItemAsync('userInfo', JSON.stringify(user.data));
          await SecureStore.deleteItemAsync('currentStep');
          await completeProfile();
          await createDailyGoal()
        }
      } else if (response.status === 400) {
        console.log('error');
        console.log('toto');
        // TODO : manage errors
      }
    } catch (error) {
      console.error(error);
    }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
          return (
            <>
            <Text style={styles.stepTitle}>Qui es tu ?</Text>
            <PersonnalInfo control={control}/>
            </>
          )
      case 2:
        return (
          <>
            <Text style={styles.stepTitle}>Quel est ton poids ?</Text>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <WeightSelector
                  weight={value}
                  onWeightChange={(newWeight) => {
                    onChange(newWeight);
                  }}
                />
              )}
              name="weight"
              rules={{ required: true }}
            />
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.stepTitle}>Quelle est ta taille ?</Text>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <HeightSelector
                  height={value}
                  onHeightChange={(newHeight) => {
                    onChange(newHeight);
                  }}
                />
              )}
              name="height"
              rules={{ required: true }}
            />
          </>
        );
      case 4:
        return (
          <>
            <Text style={styles.stepTitle}>Quel est ton niveau d'activité physique ?</Text>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <PhysicalActivities
                  selectedActivity={value}
                  onSelect={onChange}
                />
              )}
              name="physical_activity"
              rules={{ required: true }}
            />
          </>
        );
        case 5:
        return (
          <>
            <Text style={styles.stepTitle}>As-tu l’un de ces problèmes de santé ?</Text>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <HealthIssues
                  selectedIssues={value}
                  onSelect={onChange}
                />
              )}
              name="health_issues"
              rules={{ required: true }}
            />
          </>
        );        
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.centeredView}>
      {renderStep()}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            <Text style={styles.title}>Tes infos personnelles</Text>
            <Text style={styles.subtitle}>
              Elles seront utilisées seulement{"\n"} pour personnaliser ton hydratation.
            </Text>
            <CustomButton text="Compris" onPress={() => setModalVisible(!modalVisible)} />
          </View>
        </View>
      </Modal>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <View style={styles.buttonsContainer}>
        <CustomButtonPass text="Passer" onPress={() => setCurrentStep(currentStep - 1)} />
        <CustomButton text="Valider" onPress={handleSubmit(onSubmit)} />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    marginBottom: 48
  },
  stepTitle: {
    marginTop: 58,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1F1F1F'
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 4,
    marginHorizontal: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: 'rgba(80, 80, 80, 0.25)',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
    fontFamily: 'Poppins_700Bold'
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 32,
    textAlign: "center",
    color: 'gray'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});