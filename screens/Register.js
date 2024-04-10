import React, { useState, useContext } from 'react';
import axios from 'axios';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, KeyboardAvoidingView, SafeAreaView, } from 'react-native';
import Checkbox from 'expo-checkbox';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from '../contexts/AuthContext';
import CustomButton from '../components/Button';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Entypo } from '@expo/vector-icons';
import { Platform } from 'react-native';
import Constants from 'expo-constants';


const totalSteps = 2;
const CELL_COUNT = 4;
const apiUrl = Constants.expoConfig.extra.expoPublicApiUrl;;

export const Register = ({route, navigation}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, errorMessage } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [codeValue, setCodeValue] = useState(Array(CELL_COUNT).fill(''));
  const ref = useBlurOnFulfill({ codeValue, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: codeValue,
    setValue: setCodeValue,
  });
  const { control, handleSubmit, getValues, formState: { errors, isValid } } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: "",
      password: "",
      termsAccepted: false,
      code: Array(4).fill(''),
    },
  });

  const onSubmit = async (data) => {
    if (currentStep === 1) {
      try {
        const response = await axios.post(`${apiUrl}/verifyEmail`, {email: data.email})  
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
      data.code = data.code.join('');
      await signUp(data);
      const nextScreen = route.params?.nextScreen;
      if (nextScreen) {
        navigation.navigate(nextScreen);
      }
    }
  };

  const reSendVerificationCode = async () => {
    try {
      const response = await axios.post(`${apiUrl}/verifyEmail`, {email: getValues().email})  
        if (response.status === 200) {
          console.log('success');
        } else {
          // TODO : manage errors
        }
      } catch (error) {
        console.error(error);
      }
  }

  return (
    <SafeAreaView style={styles.view}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={1}>
        <Entypo name="chevron-thin-left" size={24} color="black" />
      </TouchableOpacity>     
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={{marginBottom: 32, marginTop: 12}}>
          <Text style={styles.title}>{currentStep < totalSteps ? 'Inscription' : 'Verification email'}</Text>
          {currentStep === totalSteps && (<Text style={styles.subtitle}>Saisis le code à 4 chiffres que nous venons de t’envoyer par email</Text>)}
        </View>
      {currentStep === 1 && (
        <>
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email requis',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Adresse email incorrecte'
              }
            }}
            render={({ field: { onChange, value } }) => (
              <>
              <TextInput
                placeholder="Email"
                style={[styles.input, {borderColor: errors.email ? '#DA5552' : '#E1E1E1'}]}
                keyboardType='email-address'
                autoCapitalize='none'
                onChangeText={onChange}
                value={value} />
                {errors.email && <Text style={styles.errorMessage}>{errors.email.message}</Text>}
                </>
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: 'Mot de passe requis' }}
            render={({ field: { onChange, value } }) => (
              <>
              <View style={[styles.input, {borderColor: errors.password ? '#DA5552' : '#E1E1E1'}]}>
                <TextInput
                  placeholder="Password"
                  style={{ flex: 1 }}
                  secureTextEntry={!showPassword}
                  onChangeText={onChange}
                  value={value} />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={1}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="black" />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorMessage}>{errors.password.message}</Text>}
              </>
            )} 
          />
          <Controller
            control={control}
            name="termsAccepted"
            rules={{ required: 'You must accept the terms and conditions' }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={value}
                  onValueChange={onChange}
                  style={styles.checkbox}
                  color={value ? 'black' : undefined}
                />
                <Text style={styles.checkboxText}>En t’inscrivant, tu acceptes nos conditions d'utilisation et notre politique de confidentialité.</Text>
              </View>
            )}
          />
        </>
      )}

      {currentStep === 2 && (
        <>
          <Controller
            control={control}
            name="code"
            rules={{ required: true, validate: value => value && value.length === CELL_COUNT }}
            render={({ field: { onChange } }) => (
              <CodeField
                style={styles.codeInputContainer}
                ref={ref}
                {...props}
                value={codeValue.join('')}
                onChangeText={(text) => {
                  setCodeValue(text.split(''));
                  onChange(text.split(''));
                }}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                renderCell={({ index, symbol, isFocused }) => (
                  <View
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}>
                    <Text style={styles.cellText}>
                      {symbol ? symbol : isFocused ? <Cursor /> : null}
                    </Text>
                  </View>
                )}
              />
            )}
          />
          <View style={{marginTop: 32, alignItems: 'center'}}>
            <Text style={{color: '#999A9A', fontFamily: 'Poppins_400Regular'}}>Tu n’as pas reçu de code ?</Text>
            <Text style={{color: 'black', fontFamily: 'Poppins_600SemiBold'}} onPress={reSendVerificationCode}>Renvoyer le code</Text>
          </View>
        </>
      )}
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      <CustomButton disabled={!isValid} text={currentStep < totalSteps ? 'Valider' : 'Sign Up'} onPress={handleSubmit(onSubmit)} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  view: {
    flex: 1,
    marginTop: 80,
    marginHorizontal: 30
  },
  container: {
    flex: 1,
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    fontSize: 24,
    color: '#1F1F1F',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginTop: 4
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginVertical: 5,
  },
  label: {
    fontFamily: 'Poppins_600SemiBold_Italic',
    fontSize: 24,
  },
  codeInputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  cell: {
    width: 60,
    height: 60,
    borderRadius: 6,
    borderWidth: 0.22,
    borderColor: '#999A9A',
    backgroundColor: 'rgba(153, 154, 154, 0.05)',
  },
  focusCell: {
    borderColor: '#000',
  },
  cellText: {
    paddingTop: 6,
    marginVertical: 'auto',
    color: '#000',
    fontSize: 38,
    textAlign: 'center'
  },
  backButton: {

  },
  errorMessage: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  checkboxContainer: {
    marginTop: 32,
    flexDirection: 'row',
    gap: 12
  },
  checkbox: {
    borderRadius: 6,
    borderWidth: 1,
  },
  checkboxText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular'
  }
});
