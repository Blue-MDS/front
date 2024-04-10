import React from 'react';
import { useContext } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, SectionList, StyleSheet } from 'react-native';
import CustomButon from '../../components/Button';
import { AuthContext } from '../../contexts/AuthContext';

const SettingsScreen = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);

  const DATA = [
    {
      title: "Profil",
      data: ["Profile",],
    },
    {
      title: "Objectif",
      data: ["DailyGoal", "Notifications",],
    },
    {
      title: "Security",
      data: ["Confidentialité et sécurité"],
    },
    {
      title: "Informations",
      data: ["Nous contacter", "Partager l'application", "Supprimer mon compte"],
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.setting} onPress={() => navigation.navigate(item)}>
            <Text style={{ padding: 10, fontSize: 18 }}>{item}</Text>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={{ fontWeight: "bold", fontSize: 20, padding: 10 }}>{title}</Text>
        )}
      />
      <CustomButon text="Déconnexion" onPress={() => signOut()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    marginHorizontal: 20,
  },
  setting: {
    borderBottomWidth: 1,
    borderBottomColor: "#E1E1E1",
  },
});

export default SettingsScreen;
