import React, { useRef, useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput } from 'react-native';
import Rive from 'rive-react-native';
import { AuthContext } from '../contexts/AuthContext';
import { fetchDailyGoal } from '../services/waterService';
import CustomButton from '../components/Button';
import CustomButtonPass from '../components/ButtonPass'
import { CustomModal } from '../components/Modal';
import * as SecureStore from 'expo-secure-store';
import { useForm, Controller, set } from "react-hook-form";
import { updateDailyGoal } from '../services/waterService';

export const DailyGoalConfirmation = ({ navigation }) => {
  const [dailyGoal, setDailyGoal] = useState(null);
  const riveRef = useRef(null);
  const { acceptDailyGoal } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      amount: 0,
    },
  });

  const handlePlay = () => {
    console.log('play');
    riveRef.current?.setInputState(
      'default',
      'percentage',
      100,
    );
  };

  const updateGoal = async (data) => {
    try {
      console.log(data.amount);
      const response = await updateDailyGoal(data.amount);
      if (response.status === 201) {
        setDailyGoal(data.amount);
        await SecureStore.setItemAsync('dailyGoal', data.amount.toString());
        setModalVisible(!modalVisible);
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  const formatInputValue = (value) => {
    let formattedValue = value.replace(/[^0-9,]/g, '');
    if (formattedValue.length > 1 && !formattedValue.includes(',')) {
      formattedValue = formattedValue.slice(0, 1) + '.' + formattedValue.slice(1);
    }
    const parts = formattedValue.split('.');
    if (parts.length > 2) {
      formattedValue = parts[0] + '.' + parts.slice(1).join('');
    }
    setValue('amount', formattedValue);
    return formattedValue;
  };


  useEffect(() => {
    const initialize = async () => {
      try {
        const today = new Date().toLocaleDateString();
        const dailyGoalDate = await SecureStore.getItemAsync('dailyGoalDate');
        const storedDailyGoal = await SecureStore.getItemAsync('dailyGoal');
        console.log(dailyGoalDate, today, storedDailyGoal);
        if (dailyGoalDate === today && storedDailyGoal !== null){
          setDailyGoal(storedDailyGoal);
          return;
        } else {
          console.log('toto');
          const response = await fetchDailyGoal();
          if (response.data.length) {
            setDailyGoal(response.data[0].goal_quantity);
            await SecureStore.setItemAsync('dailyGoal', response.data[0].goal_quantity.toString());
            await SecureStore.setItemAsync('dailyGoalDate', today);
          } else {
            console.log('Erreur lors de la récupération du dailyGoal');
          }
        }
        
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'objectif quotidien:', error);
      }
    };

    initialize();
  }, []);

  const goHome = async () => {
    try {
      acceptDailyGoal()
      navigation.navigate('HomeTabs');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Ton objectif aujourd'hui</Text>
      <Text style={styles.subtitle}>{dailyGoal}L est le meilleur choix pour toi par rapport à tes besoins</Text>
      <View style={styles.animationContainer}>
        <Rive
          ref={riveRef}
          stateMachineName='default'
          autoplay={true}
          resourceName="blue_water7"
          style={{ width: 141, maxHeight: 450 }}
        />
        <View style={styles.animationText}>
          <Text style={styles.indicator}>{dailyGoal}</Text>
        </View>
      </View>
      <View style={styles.btn}>
        <CustomButton text="Commencer" onPress={goHome} />
        <CustomButtonPass text="Modifier l'objectif" onPress={() => setModalVisible(!modalVisible)}  />
      </View>
      <CustomModal isVisible={modalVisible}>
        <Text style={styles.title}>Modifier l'objectif</Text>
        <Text style={styles.subtitle}>Choisis une quantité d'eau à boire</Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="0.00L"
              keyboardType="decimal-pad"
              onChangeText={(text) => onChange(formatInputValue(text))}
              value={value}
              maxLength={5}
            />
          )}
          name="amount"
          rules={{ required: true }}
        />
        <View style={styles.btnContainer}>
          <CustomButton style={styles.actionBtn} text="Valider" onPress={handleSubmit(updateGoal)} />
          <CustomButtonPass style={styles.actionBtn} text="Annuler" onPress={() => setModalVisible(!modalVisible)} />
        </View>
      </CustomModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
    margin: 30
  },
  animationContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationText: {
    position: 'absolute',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1F1F1F'
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 250
  },
  indicator: {
    fontSize: 30,
    fontFamily: 'Poppins_700Bold',
  },
  btn: {
    width: '100%',
  },
  input: {
    width: 100,
    height: 40,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 4,
    padding: 10,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    marginHorizontal: 10,
  }
});
