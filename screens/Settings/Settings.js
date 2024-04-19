import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, SectionList, StyleSheet } from 'react-native';
import * as Sharing from 'expo-sharing';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CustomButton from '../../components/Button';
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from '../../contexts/AuthContext';
import { AntDesign, Entypo } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { CustomModal } from '../../components/Modal';
import securityIcon from '../../assets/icons/security.png';
import shareIcon from '../../assets/icons/share.png';
import notificationIcon from '../../assets/icons/notification.png';
import weatherIcon from '../../assets/icons/weather.png';
import essentialIcon from '../../assets/icons/essential.png';

const apiUrl = Constants.expoConfig.extra.expoPublicApiUrl;
const defaultProfileImage = 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png'

const SettingsScreen = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [daily_goal, setDailyGoal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getUserInfo = async () => {
    try {
      const userInfoString = await SecureStore.getItemAsync('userInfo');
      const storedDailyGoal = await SecureStore.getItemAsync('dailyGoal');
      const userInfo = JSON.parse(userInfoString);
      setDailyGoal(storedDailyGoal);
      setUserInfo(userInfo);
    }
    catch (error) {
      console.error("Erreur lors du chargement des infos utilisateur", error);
    }
  };

  const shareApp = async () => {
    try {
      const result = await Sharing.shareAsync('https://blue-france.fr');
      if (result.action === Sharing.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type of', result.activityType);
        } else {
          console.log('Shared');
        }
      } else if (result.action === Sharing.dismissedAction) {
        console.log('Dismissed');
      }
    } catch (error) {
      console.error("Erreur lors du partage de l'application", error);
    }
  };

  const handlePress = (item) => {
    if (item.actionType === 'navigate') {
      if (item.screen === 'DailyGoal') {
        navigation.navigate(item.screen, { fromSettings: true });
      } else {
        navigation.navigate(item.screen);
      }
    } else if (item.actionType === 'modal') {
      setModalVisible(true);
    } else if (item.actionType === 'share') {
      shareApp();
    }
  };

  const deleteAccount = async () => {
    try {
      await deleteAccount();
      signOut();
    }
    catch (error) {
      console.error("Erreur lors de la suppression du compte", error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const DATA = [
    {
      title: "Profil",
      data: [
        { 
          name: "Objectif quotidien", 
          screen: "DailyGoal", 
          actionType: 'navigate', 
          value: daily_goal ? `${daily_goal}L` : false,
          icon: weatherIcon,
        },
        { name: "Notifications", screen: "Notifications", actionType: 'navigate', icon: notificationIcon },
        { name: "Confidentialité et sécurité", screen: "Security", actionType: 'navigate', icon: securityIcon },
        { name: "Partager l'application", screen: "Share", actionType: 'share', icon: shareIcon },
        { name: "Supprimer mon compte", screen: "DeleteAccount", actionType: 'modal', icon: essentialIcon},
      ]
    },
  ];
  return (
    <SafeAreaView style={styles.containerParent}>
      <Text style={styles.bigTitle}>Paramètres</Text>
      <View style={styles.container}>
        <CustomModal isVisible={modalVisible} setIsVisible={setModalVisible}>
          <Text>Êtes-vous sûr de vouloir supprimer votre compte ?</Text>
          <CustomButton style={styles.actionBtn} text="Oui" onPress={() => signOut()} />
          <CustomButton style={styles.actionBtn} text="Non" onPress={() => setModalVisible(false)} />
        </CustomModal>
        <TouchableOpacity style={[styles.setting, styles.profileSetting]} onPress={() => navigation.navigate('Profile')}>
          <View style={styles.profileContainer}>
            <Image source={{ uri: userInfo ? `${apiUrl}/uploads/${userInfo.profile_picture}` : defaultProfileImage }} style={styles.profileImage} />
            {userInfo && 
              <View style={styles.profileText}>
                <Text style={styles.profileName}>{userInfo.first_name}</Text>
                <Text style={styles.subtitle}>Informations personnelles</Text>
              </View>
            }
          </View>
          <Entypo name="chevron-right" size={hp('3%')} color="#717171" />
        </TouchableOpacity>
        <SectionList
          sections={DATA}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.setting} onPress={() => handlePress(item)}>
              <Image source={item.icon} style={{ width: hp('2.6%'), height: hp('2.6%'), marginRight: 15 }} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.name}</Text>
                {item.value && <Text style={styles.subtitle}>{item.value}</Text>}
              </View>
              <Entypo name="chevron-right" size={hp('3%')} color="#717171" />
            </TouchableOpacity>
          )}
        />
        <View style={styles.buttonContainer}>
          <CustomButton text="Déconnexion" onPress={() => signOut()} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerParent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  bigTitle: {
    textAlign: 'center',
    fontSize: hp('3%'),
    fontFamily: 'Poppins_600SemiBold',
    color: '#1F1F1F',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E1E1",
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins_400Regular',
    color: '#1F1F1F'
  },
  profileSetting: {
    borderBottomWidth: 0,
    marginBottom: 15,
  },
  profileContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: hp('8%'),
    height: hp('8%'),
    borderRadius: 50,
    marginRight: 15,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins_700Bold',
    color: '#1F1F1F'
  },
  subtitle: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins_400Regular',
    color: '#717171'
  },
  btnContainer: {
    flexDirection: 'column',
  },
  actionBtn: {
    marginHorizontal: 10,
    width: '100%',
  },
});

export default SettingsScreen;
