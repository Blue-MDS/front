import React, {useState} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Text, TouchableOpacity, SectionList } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

export const ProfileModification = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const userInfoString = await SecureStore.getItemAsync('userInfo');
      const userInfo = JSON.parse(userInfoString);
      setUserInfo(userInfo);
    } catch (error) {
      console.error("Erreur lors du chargement des infos utilisateur", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserInfo();
    }, [])
  );

  const sections = [
    {
      title: 'Modifier votre profil',
      data: [
        { name: 'Modifier ma taille', screen: 'HeightModification' },
        { name: 'Modifier mon poids', screen: 'WeightModification' },
        { name: 'Modifier mon niveau d\'activité', screen: 'ActivityModification' },
        { name: 'Modifier mes problèmes de santé', screen: 'HealthIssuesModification' },
        { name: 'Modifier mes informations personnelles', screen: 'PersonalInfoModification' }
      ]
    }
  ];

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item }) => (
        <TouchableOpacity
        style={styles.item}
          onPress={() => navigation.navigate(item.screen, { userInfo: userInfo })}
        >
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.name}</Text>
          </View>
          <Entypo name="chevron-right" size={24} color="#717171" />
        </TouchableOpacity>
      )}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingTop: 20,
      paddingHorizontal: 20,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    icon: {
      marginRight: 15,
    },
    textContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 16,
      fontFamily: 'Poppins_400Regular',
      color: '#1F1F1F'
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Poppins_400Regular',
      color: '#717171'
    },
    header: {
      textAlign: 'center',
      fontSize: 24,
      fontFamily: 'Poppins_600SemiBold',
      marginBottom: 32,
    },
  optionButton: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  optionText: {
    fontSize: 18,
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 20,
    backgroundColor: '#fff',
    color: 'black',
    padding: 10,
    marginTop: 10,
  },
});
