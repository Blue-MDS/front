import { View, TextInput, TouchableOpacity, StyleSheet, Text, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import CustomButton from '../components/Button';
import { useForm, Controller } from "react-hook-form"
import Ionicons from '@expo/vector-icons/Ionicons';
import { Entypo } from '@expo/vector-icons';

export const Login = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, errorMessage, resetError } = useContext(AuthContext);
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const onSubmit = async (data) => {
    await signIn(data)
  }

  return (
    <SafeAreaView style={styles.view}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={1}>
        <Entypo name="chevron-thin-left" size={24} color="black" />
      </TouchableOpacity>  
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
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
        render={({ field: { onChange, onBlur, value } }) => (
          <>
          <TextInput
            placeholder="Email"
            style={[styles.input, {borderColor: errors.email ? '#DA5552' : '#E1E1E1'}]}
            keyboardType='email-address'
            autoCapitalize='none'
            onBlur={onBlur}
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
        render={({ field: { onChange, onBlur, value } }) => (
          <>
          <View style={[styles.input, {borderColor: errors.password ? '#DA5552' : '#E1E1E1'}]}>
            <TextInput
              placeholder="Password"
              style={{ flex: 1 }}
              secureTextEntry={!showPassword}
              onBlur={onBlur}
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
        {errorMessage && <Text style={{color: 'red'}}>{errorMessage}</Text> }

        <CustomButton disabled={!isValid} text="Se connecter" onPress={handleSubmit(onSubmit)} />
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
    marginTop: 12,
    marginBottom: 32,
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center", 
    margin: 10
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
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

