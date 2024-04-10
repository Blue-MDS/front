import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { QuizOptions } from './QuestionsStep';
import LottieView from 'lottie-react-native';
import { TeamScreen } from './Team';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.expoPublicApiUrl;;

export const QuizComponent = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [teamAssigned, setTeamAssigned] = useState(false);

  const backgroundColors = ['#B2D6FB', '#F7D6C9', '#C5F4E1', '#D6DAEA', '#FBEDC6', '#F5CCDF']
  const currentColorIndex = currentQuestionIndex % backgroundColors.length;
  const currentBackgroundColor = backgroundColors[currentColorIndex];

  const LoadingScreen = () => (
    <View style={styles.centeredView}>
      <LottieView
        source={require('../../assets/test.json')}
        autoPlay
        loop
      />
    </View>
  );

  useEffect(() => {
    console.log(apiUrl);
    const initializeQuiz = async () => {
      const storedTeam = await SecureStore.getItemAsync('userTeam');
      if (storedTeam) {
        setTeamAssigned(true);
      } else {
        verifyUserTeam();
      }
    };

    initializeQuiz();
  }, []);

  const fetchQuestions = async () => {
    console.log('fetch questions');
    const token = await SecureStore.getItemAsync('userToken');
    try {
      const response = await axios.get(`${apiUrl}/quiz/questions`, { headers: { token: token }});
      console.log(response.data);
      setQuestions(response.data);
      if (response.data.length > 0) {
        fetchAnswersForQuestion(response.data[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAnswersForQuestion = async (questionId) => {
    const token = await SecureStore.getItemAsync('userToken');
    try {
      const response = await axios.get(`${apiUrl}/quiz/answers/${questionId}`, { headers: { token: token }});
      console.log(response.data);
      setAnswers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAnswerSelect = (selectedAnswer) => {
    const newAnswers = [...userAnswers, selectedAnswer.id];
    setUserAnswers(newAnswers);
  
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      fetchAnswersForQuestion(questions[nextIndex].id);
    } else {
      console.log("Fin du quiz");
      submitAnswers(newAnswers);
    }
  };

  const submitAnswers = async (answers) => {
    setIsLoading(true);
    const token = await SecureStore.getItemAsync('userToken');
    const userId = JSON.parse(await SecureStore.getItemAsync('userInfo')).id;
    await SecureStore.deleteItemAsync('userTeam')
    try {
      const response = await axios.post(`${apiUrl}/quiz/submitAnswers`, {
        userId: userId,
        answers: answers,
      }, { headers: { token: token } });
      if (response.status === 201) {
        setTimeout(() => {
          assignTeam();
        }, 1500);
      } else {
        console.error("Erreur lors de la soumission des réponses");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission des réponses", error);
      setIsLoading(false);
    }
  };
  

  const assignTeam = async () => {
    const token = await SecureStore.getItemAsync('userToken');
    try {
      const response = await axios.get(`${apiUrl}/quiz/assignTeamUser`, {
        headers: { token: token }
      });
      if (response.status === 201) {
        console.log('Équipe assignée avec succès:', response.data);
        await SecureStore.setItemAsync('userTeam', JSON.stringify(response.data));
        setIsLoading(false);
        setTeamAssigned(true);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Team' }],
        });
      } else {
        console.error("Erreur lors de l'assignation d'équipe");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'assignation d'équipe", error);
      setIsLoading(false);
    }
  };

  const verifyUserTeam = async () => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      try {
        const response = await axios.get(`${apiUrl}/quiz/getUserTeam`, {
          headers: { token: token }
        });

        if (response.data.hasTeam) {
          console.log('L\'utilisateur a déjà une équipe:', response.data.team);
          await SecureStore.setItemAsync('userTeam', JSON.stringify(response.data.team));
          setTeamAssigned(true);
        } else {
          fetchQuestions();
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          fetchQuestions();
        } else {
          console.error("Erreur lors de la vérification de l'équipe de l'utilisateur", error);
        }
      }
    }
  };

  return (
    <View style={[styles.fullScreen, { backgroundColor: currentBackgroundColor }]}>
      {questions.length > 0 && currentQuestionIndex < questions.length ? (
        <>
          <Text style={styles.stepTitle}>{questions[currentQuestionIndex].question_text}</Text>
          <View style={styles.optionsContainer}>
            <QuizOptions
              options={answers}
              selectedOption={selectedAnswer}
              onSelectOption={handleAnswerSelect}
              question={currentQuestionIndex}
              totalQuestions={questions.length}
            />
          </View>
        </>
      ) : (
        <View style={styles.centeredView}>
          <Text>Chargement des questions ou fin du quiz</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  stepTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1F1F1F',
    paddingHorizontal: 20,
    marginBottom: 200,
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 0,
  },
});
