import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const cardContent = [
  {
    title: 'sédentaire',
    subtitle: 'moins de 30 minutes'
  },
  {
    title: 'activité légère',
    subtitle: 'en moyenne 30 minutes'
  },
  {
    title: 'actif',
    subtitle: 'entre 1h et 1h 30 minutes'
  },
  {
    title: 'très actif',
    subtitle: 'plus de 1h 30 minutes'
  }
];

export const PhysicalActivities = ({ selectedActivity, onSelect }) => {
  return (
    <View style={styles.container}>
      {cardContent.map((card) => (
        <TouchableOpacity style={[styles.card, selectedActivity === card.title ? styles.selectedCard : styles.unselectedCard]} onPress={() => onSelect(card.title)} key={card.title}>
          <Text style={[styles.title, {color: selectedActivity === card.title ? 'white' : 'black'}]}>{card.title}</Text>
          <Text style={[styles.subtitle, {color: selectedActivity === card.title ? 'white' : '#474747'}]}>{card.subtitle}</Text>
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
    marginTop: 65,
    gap: 24,
  },
  card: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 5,
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
    backgroundColor: 'white',
  },
  title: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 20
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    textAlign: 'center'
  }
});
