import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Platform, Pressable } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useForm, Controller } from "react-hook-form";
import { AuthContext } from '../contexts/AuthContext';

export default function Register() {
  const { signUp, errorMessage, resetError } = useContext(AuthContext);
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: null,
      email: "",
      password: "",
    },
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setValue('birthDate', date);
    hideDatePicker();
  };

  const onSubmit = (data) => {
    signUp(data);
  };

  return (
    <View style={styles.inputContainer}>
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="FirstName"
            style={styles.input}
            autoCapitalize='none'
            onBlur={onBlur}
            onChangeText={(text) => {
              onChange(text);
              resetError();
            }}
            value={value}
          />
        )}
        name="firstName"
      />
      {errors.firstName && <Text>This is required.</Text>}

      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="LastName"
            style={styles.input}
            autoCapitalize='none'
            onBlur={onBlur}
            onChangeText={(text) => {
              onChange(text);
              resetError();
            }}
            value={value}
          />
        )}
        name="lastName"
      />
      {errors.lastName && <Text>This is required.</Text>}

      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { value } }) => (
          <View>
            <TouchableOpacity onPress={showDatePicker}>
              <TextInput
                placeholder="Select Date"
                style={styles.input}
                editable={false}
                value={value ? value.toISOString().split('T')[0] : ''}
                onPressIn={showDatePicker}
              />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
        )}
        name="birthDate"
      />
      {errors.birthDate && <Text>Date is required.</Text>}

      <Controller
        control={control}
        rules={{ required: true }}
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
        rules={{ maxLength: 100 }}
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

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.text}>S'inscrire'</Text>
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
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#014F97',
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
