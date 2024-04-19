import React, { Children, useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, Image, Linking, SafeAreaView } from 'react-native';
import CustomButton from '../../components/Button'
import CustomButtonPass from '../../components/ButtonPass'
import * as SecureStore from 'expo-secure-store';

// get team from secure store

export const TeamScreen = ({navigation}) => {
  const [team, setTeam] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const teamImage = {
    'Menthe': require('../../assets/menthe.png'),
    'Fraisette': require('../../assets/fraisette.png'),
    'Vanilla': require('../../assets/vanilla.png'),
    'Mirabeau': require('../../assets/mirabelle.png'),
  }

  const teamData = {
    'Safe': [
      {
        name: 'Fraisette',
        description: 'Découvrez le goût rafraîchissant de Fraisette, parfait pour les journées ensoleillées!',
        image: require('../../assets/fraisette.png'),
      },
      {
        name: 'Menthe',
        description: 'Ressentez la fraîcheur apaisante de la Menthe, idéale pour un moment de détente!',
        image: require('../../assets/menthe.png'),
      },
    ],
    'Curious': [
      {
        name: 'Mirabeau',
        description: 'Laissez-vous surprendre par l’exotisme de Mirabeau, une aventure pour vos papilles!',
        image: require('../../assets/mirabelle.png'),
      },
      {
        name: 'Vanilla',
        description: 'Goûtez à la douceur de Vanilla, un classique réinventé pour le plaisir!',
        image: require('../../assets/vanilla.png'),
      },
    ],
  };
  

  useEffect(() => {
    const getTeam = async () => {
      const teamStored = await SecureStore.getItemAsync('userTeam');
      if (teamStored) {
        const teamParsed = JSON.parse(teamStored);
        console.log(teamParsed);
        const teamInfo = teamParsed[0];
        setTeam(teamInfo);
        const options = teamData[teamInfo.name];
        if (options) {
          const randomOption = options[Math.floor(Math.random() * options.length)];
          console.log(randomOption);
          setSelectedOption(randomOption);
        } else {
          console.error("No options found for team:", teamInfo.name);
        }
      } else {
        console.error("No team data available in SecureStore");
      }
    }
    getTeam();
  }, []);

  const handleOpenLink = () => {
    Linking.openURL('https://blue-france.fr');
  };

  return (
    <SafeAreaView style={styles.container}>
      {team && selectedOption ? (
        <>
          <Text style={styles.title}>Bienvenue chez les {team.name}</Text>
          <Text style={styles.subtitle}>{selectedOption.description}</Text>
          <Image source={selectedOption.image} style={styles.img} resizeMode='contain' />
          <View style={styles.btnContainer}>
            <CustomButton text={`Rejoindre la team ${team.name}`} onPress={() => navigation.navigate('HomeTeam', { team })} />
            <CustomButtonPass text={`Découvrir ${selectedOption.name}`} onPress={handleOpenLink} />
          </View>
        </>
      ) : (
        <Text>Chargement...</Text>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
    marginTop: 40,
    width: 332,
    height: 383,
  },
  btnContainer: {
    position: 'absolute',
    bottom: 0,
  },
});