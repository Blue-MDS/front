import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, PixelRatio } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const fontScale = PixelRatio.getFontScale();
const getFontSize = size => size / fontScale;
const { width, height } = Dimensions.get('window');

const cardContent = [
  {
    title: 'Sédentaire',
    subtitle: 'moins de 30 minutes'
  },
  {
    title: 'Activité légère',
    subtitle: 'en moyenne 30 minutes'
  },
  {
    title: 'Actif',
    subtitle: 'entre 1h et 1h 30 minutes'
  },
  {
    title: 'Très actif',
    subtitle: 'plus de 1h 30 minutes'
  }
];

const scaleFontSize = (fontSize) => {
  const scale = width / 320; // prenez 320 comme base de la largeur d'écran minimum comme iPhone SE
  const newSize = Math.round(fontSize * scale);
  return newSize;
};

export const PhysicalActivities = ({ selectedActivity, onSelect }) => {
  return (
    <View style={styles.container}>
      {cardContent.map((card) => (
        <TouchableOpacity style={[styles.card, selectedActivity === card.title.toLocaleLowerCase() ? styles.selectedCard : styles.unselectedCard]} onPress={() => onSelect(card.title.toLowerCase())} key={card.title}>
          <Text style={[styles.title, {color: selectedActivity === card.title.toLocaleLowerCase() ? 'white' : 'black'}]}>{card.title}</Text>
          <Text style={[styles.subtitle, {color: selectedActivity === card.title.toLocaleLowerCase() ? 'white' : '#474747'}]}>{card.subtitle}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    height: hp('12%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginVertical: 8,
    shadowColor: 'rgba(0, 0, 0, 0.13)',
    shadowOffset: { width: 0, height: 1.6 },
    shadowOpacity: 0.23,
    shadowRadius: 3.6,
    elevation: 4    
  },
  selectedCard: {
    backgroundColor: 'black',
  },
  unselectedCard: {
    backgroundColor: '#EFEFEF',
  },
  title: {
    fontFamily: 'Poppins_500Medium',
    fontSize: hp('2.2%'),
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: hp('1.7%'),
    textAlign: 'center'
  }
});
