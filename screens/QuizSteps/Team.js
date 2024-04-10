import React, { Children } from 'react';
import { Modal, View, Text, StyleSheet, Image } from 'react-native';
import CustomButton from '../../components/Button'

export const TeamScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue chez les Safe</Text>
      <Text style={styles.subtitle}>Alors comme ça, tu aimes redécouvrir les classiques ! L’arôme Menthe-la-Jolie sera parfait pour toi. </Text>
      <Image source={require('../../assets/MENTHE.png')} style={styles.img} />
      <View style={styles.btnContainer}>
        <CustomButton text="Rejoindre la Team Safe" onPress={() => navigation.navigate('HomeTeam')} />
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
});