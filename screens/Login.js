import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import CustomButton from '../components/Button';
import { useForm, Controller } from "react-hook-form"

export default function Login({navigation}) {
  const { signIn, errorMessage, resetError } = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const onSubmit = (data) => {
    signIn(data)
  }

  return (
    <View style={styles.inputContainer}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Email"
            style={styles.input}
            keyboardType='email-address'
            autoCapitalize='none'
            onBlur={onBlur}
            onChangeText={(text) => {
              onChange(text);
              resetError();
            }}
            value={value}
          />
        )}
        name="email"
      />
      {errors.email && <Text>This is required.</Text>}

      <Controller
        control={control}
        rules={{
          maxLength: 100,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="password"
      />
      {errorMessage && <Text style={{color: 'red'}}>{errorMessage}</Text> }

      <CustomButton text="Se connecter" onPress={handleSubmit(onSubmit)} />
      <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('Signup')}>
        <Text >S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    justifyContent: "center", 
    margin: 10
  },
  input: {
    height: 40,
    borderColor: '#014F97',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 4,
    marginVertical: 5,
  },
  button2: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    marginVertical: 10,
    marginHorizontal: 64,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

