import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import Onboarding from 'react-native-onboarding-swiper';

const screenHeight = Dimensions.get('window').height;

export const OnboardingSwiper = ({ navigation }) => {
  const Dots = ({selected}) => {
    let backgroundColor;
    backgroundColor = selected ? '#1F1F1F' : '#E0E0E0';
    return (
      <View 
          style={{
              width: 64,
              height: 8,
              marginHorizontal: 5,
              borderRadius: 8,
              backgroundColor
          }}
      />
    );
  };

  return (
    <Onboarding
      containerStyles={{ backgroundColor: '#fff' }}
      DotComponent={Dots}
      showSkip={false}
      showNext={false}
      onSkip={() => navigation.replace('Signup')}
      onDone={() => navigation.navigate('Signup', { nextScreen: 'ProfileSteps'})}
      bottomBarColor='#fff'
      bottomBarHeight={100}
      titleStyles={{ fontFamily: 'Poppins_600SemiBold', fontSize: 24, marginBottom: 0,}}
      subTitleStyles={{ fontFamily: 'Poppins_400Regular', fontSize: 16, color: '#505050', marginTop: -6}}
      pages={[
        {
          backgroundColor: '#fff',
          image: <Video
                  source={require('../../assets/onBoarding/waves.mp4')}
                  useNativeControls
                  resizeMode="cover"
                  shouldPlay
                  isLooping
                  style={styles.video}
                />,
          title: 'Hydrate-toi efficacement',
          subtitle: 'Avec un objectif personnalisé',
        },
        {
          backgroundColor: '#fff',
          image: <Video
                  source={require('../../assets/onBoarding/gouttes.mp4')}
                  useNativeControls
                  resizeMode="cover"
                  shouldPlay
                  isLooping
                  style={styles.video}
                />,
          title: 'Aromatise ton eau',
          subtitle: 'Grâce au calculateur de dosage d’arôme',
        },
        {
          backgroundColor: '#fff',
          image: <Video
                  source={require('../../assets/onBoarding/interrogation.mp4')}
                  useNativeControls
                  resizeMode="cover"
                  shouldPlay
                  isLooping
                  style={styles.video}
                />,
          title: 'Découvre ta Blue Team',
          subtitle: 'En testant le quiz des goûts',
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({

  video: {
    width: 267,
    height: 370,
    borderRadius: 90,
  }
});

