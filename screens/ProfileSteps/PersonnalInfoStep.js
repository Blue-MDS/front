import { View, TextInput, TouchableOpacity, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useContext } from 'react';
import { useForm, Controller } from "react-hook-form"
import DateTimePickerModal from "react-native-modal-datetime-picker";

export const PersonnalInfo = ({control}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date, onChange) => {
    const formattedDate = date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    onChange(date);
    setFormattedDate(formattedDate);
    hideDatePicker();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inputContainer}>
      <Controller
        control={control}
        name='firstName'
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Prénom"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name='lastName'
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Nom"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name='birthDate'
        render={({ field: { onChange, value } }) => (
          <View>
            <TouchableOpacity onPress={showDatePicker}>
              <TextInput
                placeholder="Date de Naissance"
                style={styles.input}
                editable={false}
                value={formattedDate}
                onPressIn={showDatePicker}
              />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={(date) => handleConfirm(date, onChange)}
              onCancel={hideDatePicker}
            />
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    justifyContent: "center", 
    margin: 30
  },
  input: {
    height: 60,
    borderColor: '#E1E1E1',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 6,
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

