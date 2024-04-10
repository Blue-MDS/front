import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, TouchableOpacity } from 'react-native';
import ProgressBar from '../../components/ProgressBar';

export const QuizOptions = ({ options, selectedOption, onSelectOption, question, totalQuestions }) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          style={[styles.card, selectedOption === option.id ? styles.selectedCard : styles.unselectedCard]}
          onPress={() => onSelectOption(option)}
          key={option.id}
        >
          <Text style={[styles.title, { color: selectedOption === option.id ? 'white' : 'black' }]}>
            {option.answer_text}
          </Text>
        </TouchableOpacity>
      ))}
      <ProgressBar currentStep={question} totalSteps={totalQuestions} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    gap: 16,
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20,
  },
  card: {
    width: Dimensions.get('window').width * 0.4,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 20,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedCard: {
    backgroundColor: '#007bff',
  },
  unselectedCard: {
    backgroundColor: '#EFEFEF',
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
  },
});
