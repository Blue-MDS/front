import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import ProgressBar from '../../components/ProgressBar';

export const QuizOptions = ({ options, selectedOption, onSelectOption, question, totalQuestions }) => {
  const isColumnLayout = options.length === 2;

  return (
    <View style={[
      styles.container,
      isColumnLayout ? styles.columnLayout : styles.rowLayout 
    ]}>
      {options.map((option) => (
        <TouchableOpacity
          style={[
            styles.card,
            isColumnLayout ? styles.fullWidthCard : styles.halfWidthCard, 
            selectedOption === option.id ? styles.selectedCard : styles.unselectedCard
          ]}
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
    flex: 1,
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 30,
    paddingTop: 40,
    gap: 16,
  },
  columnLayout: {
    flexDirection: 'column',
  },
  rowLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fullWidthCard: {
    width: '100%', 
    minHeight: 100,
  },
  halfWidthCard: {
    width: Dimensions.get('window').width * 0.4, 
    minHeight: 100,
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
  },
});
