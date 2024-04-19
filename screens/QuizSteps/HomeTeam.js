import React, { useState, useRef } from 'react';
import { Modal, View, Text, StyleSheet, Animated } from 'react-native';
import CustomButton from '../../components/Button'
import { CustomCard } from '../../components/Quiz/Card';

const imageArray = [
  require('../../assets/quiz-card.png'),
  require('../../assets/arome-card.png'),
  require('../../assets/custom-card.png')
];

export const HomeTeamScreen = () => {
  const [cards, setCards] = useState(imageArray);
  const cardRefs = useRef(imageArray.map((_, index) => ({
    translateX: new Animated.Value(0),
    scale: new Animated.Value(1),
    rotate: new Animated.Value(index === 0 ? -10 : index === 2 ? 10 : 0),
  }))).current;

  const animateCards = (selectedCardIndex) => {
    const animations = cards.map((_, index) => {
      let finalPosition = 0; 
      let finalScale = 1; 
      let finalRotate = 0; 

      if (index === selectedCardIndex) { 
        finalPosition = selectedCardIndex === 0 ? 150 : -150;
        finalScale = 1.3;
        finalRotate = 0;
      } else if (index === 1) {
        finalRotate = selectedCardIndex === 0 ? -10 : 10; 
      }

      return Animated.parallel([
        Animated.timing(cardRefs[index].translateX, {
          toValue: finalPosition,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(cardRefs[index].scale, {
          toValue: finalScale,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(cardRefs[index].rotate, {
          toValue: finalRotate,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(animations).start(() => {
      cardRefs.forEach(ref => {
        ref.translateX.setValue(0);
        ref.scale.setValue(1);
        ref.rotate.setValue(0); 
      });
      
      
      const newCardsOrder = [...cards];
      if (selectedCardIndex === 0) {
        
        [newCardsOrder[0], newCardsOrder[1]] = [newCardsOrder[1], newCardsOrder[0]];
      } else {
        
        [newCardsOrder[1], newCardsOrder[2]] = [newCardsOrder[2], newCardsOrder[1]];
      }
      setCards(newCardsOrder);
    });
  };

  const onCardPress = (index) => {
    if (index === 1) return; 
    animateCards(index); 
  };

  const getCardStyle = (index) => ({
    transform: [
      { translateX: cardRefs[index].translateX },
      { scale: cardRefs[index].scale },
      { rotate: cardRefs[index].rotate.interpolate({
          inputRange: [-10, 0, 10],
          outputRange: ['-10deg', '0deg', '10deg'],
        })
      },
    ],
    zIndex: index === 0 ? 100 : 0, 
  });


  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dans quelques temps...</Text>
      <Text style={styles.subtitle}>Tu pourras personnaliser les détails de ta team !</Text>
      <View style={styles.cardsContainer}>
        {cards.map((image, index) => (
          <CustomCard 
            key={index}
            image={image}
            onPress={() => onCardPress(index)}
            animatedStyle={getCardStyle(index)}
          />
        ))}
      </View>
      <View style={styles.btnContainer}>
        <CustomButton text="Rejoindre la Team Safe" onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1F1F1F'
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginTop: 4,
    marginHorizontal: 20,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  img: {
    marginTop: 20,
    width: 332,
    height: 383,
  },
  btnContainer: {
    position: 'absolute',
    bottom: 0,
  },
  cardsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%', 
    justifyContent: 'center', 
    overflow: 'visible', 
  },
});