import React, { useState, useContext } from 'react';
import { API_URL } from '@env';
import axios from 'axios';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useForm, Controller } from "react-hook-form";
import ProgressBar from '../components/ProgressBar'
import { AuthContext } from '../contexts/AuthContext';
import CustomButton from '../components/Button';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold_Italic, Poppins_700Bold } from '@expo-google-fonts/poppins' 

const totalSteps = 3;

export default function Register() {
  const { signUp, errorMessage, resetError } = useContext(AuthContext);
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
      code: Array(6).fill(''),
    },
  });
  const [currentStep, setCurrentStep] = useState(1);

  const onSubmit = async (data) => {
    if (currentStep === 2) {
      try {
        const response = await axios.post(`${API_URL}/verifyEmail`, {email: data.email})  
        if (response.status === 200) {
          setCurrentStep(currentStep + 1);
        } else {
          // TODO : manage errors
        }
      } catch (error) {
        console.error(error);
      }
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log(data.code);
      data.code = data.code.join('');
      signUp(data);
    }
  };
  
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.inputContainer}>
      
      
      {currentStep === 1 && (
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <><Text style={styles.label}>
              Quel est ton email ?</Text>
              <TextInput
              placeholder="Email"
              style={styles.input}
              keyboardType='email-address'
              autoCapitalize='none'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value} /></>
          )}
          name="email"
        />
      )}

      {currentStep === 2 && (
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <><Text style={styles.label}>
              Créer ton mot de passe</Text>
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            /></>
          )}
          name="password"
        />
      )}

      {currentStep === 3 && (
        <View style={styles.codeInputContainer}>
          {Array.from({ length: 6 }, (_, index) => (
            <Controller
              key={index}
              control={control}
              name={`code.${index}`}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.codeInput}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  maxLength={1}
                  keyboardType="number-pad"
                />
              )}
            />
          ))}
        </View>
      )}

      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <ProgressBar style={{fontFamily: 'Poppins_400Regular'}} currentStep={currentStep} totalSteps={totalSteps} />
      <CustomButton text={currentStep < totalSteps ? 'Valider' : 'Sign Up'} onPress={handleSubmit(onSubmit)} />
    </View>
  );
}


const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    justifyContent: "center", 
    alignItems: 'center',
    margin: 10
  },
  input: {
    fontFamily: 'Poppins_400Regular',
    height: 40,
    fontSize: 18,
    fontStyle: 'italic',
    paddingLeft: 10,
    borderRadius: 4,
    marginVertical: 5,
  },
  label: {
    fontFamily: 'Poppins_600SemiBold_Italic',
    fontSize: 24,
  },
  codeInputContainer: {
    flexDirection: 'row',
  },
  codeInput: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginHorizontal: 4,
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: 20,
  },
});
