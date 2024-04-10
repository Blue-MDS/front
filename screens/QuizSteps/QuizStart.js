import * as React from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import CustomButton from '../../components/Button';

import { Dimensions } from 'react-native';
const screenHeight = Dimensions.get('window').height;

export const QuizStart = ({navigation}) => {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  return (
    <View style={styles.container}>
      <Video
        source={require('../../assets/question.mp4')}
        useNativeControls
        resizeMode="cover"
        isLooping
        shouldPlay
        style={{ width: '100%', height: screenHeight / 2 }}
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>De quelle Blue Team fais-tu parti ?</Text>
        <Text style={styles.subtitle}>Réponds à 6 questions pour retrouver les tiens parmi les Bluetiz et avoir les tips personnalisés</Text>
        <CustomButton style={styles.button} text="Faire le quiz" onPress={() => navigation.navigate('Questions')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1F1F1F',
    marginTop: 20,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#717171',
    marginTop: 8,
  },
  button: {
    marginTop: 20,
  },
});