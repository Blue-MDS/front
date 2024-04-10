import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import { format } from 'date-fns';
import { useNotificationSettings } from '../../../contexts/NotificationContext';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import CustomButton from '../../../components/Button';
import { savePreferences } from '../../../services/notificationsService';

export const NotificationsMainScreen = () => {
  const { notificationsEnabled, toggleNotificationsEnabled, period, frequency } = useNotificationSettings();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Switch
          trackColor={{ false: "#767577", true: "#58BA47" }}
          thumbColor={notificationsEnabled ? "#FDFEFF" : "#f4f3f4"}
          onValueChange={toggleNotificationsEnabled}
          value={notificationsEnabled}
        />
      ),
    });
  }, [navigation, notificationsEnabled, toggleNotificationsEnabled]);

  const DATA = [
    {
      title: "Réglages",
      data: [
        { key: 'Fréquence', value: `Toutes les ${frequency}min` || 'Non définie', icon: 'hourglass' },
        { key: 'Période', value: `${format(period.start, 'HH:mm')} - ${format(period.end, 'HH:mm')}`, icon: 'clockcircle' },
      ]
    }
  ];

  const saves = async () => {
    console.log('save');
    await savePreferences({ period, frequency});
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        const screen = item.key === 'Fréquence' ? 'FrequencySettings' : 'PeriodSettings';
        navigation.navigate(screen);
      }}
    >
      <AntDesign style={styles.icon} name={item.icon} size={24} color="black" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.key}</Text>
        <Text style={styles.subtitle}>{item.value}</Text>
      </View>
      <Entypo name="chevron-right" size={24} color="black" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SectionList
      sections={DATA}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.header}>{title}</Text>
      )} />
      <CustomButton text="Sauvegarder" onPress={saves} />
    </View>
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
});
