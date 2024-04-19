import React, {useState, useRef} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, SectionList, Image } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { AntDesign, Entypo } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import mirabeau from '../../../assets/avatar-mirabeau.png';
import fraisette from '../../../assets/avatar-fraisette.png';
import menthe from '../../../assets/avatar-menthe.png';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { saveProfilePicture } from '../../../services/userService';
import weightIcon from '../../../assets/icons/weight.png';
import heightIcon from '../../../assets/icons/height.png';
import activityIcon from '../../../assets/icons/activity.png';
import healthIcon from '../../../assets/icons/heart.png';

const apiUrl = Constants.expoConfig.extra.expoPublicApiUrl;
export const ProfileModification = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const bottomSheetRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const defaultProfileImage = 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png'

  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const userInfoString = await SecureStore.getItemAsync('userInfo');
      const userInfo = JSON.parse(userInfoString);
      const imageUrl = userInfo.profile_picture ? `${apiUrl}/uploads/${userInfo.profile_picture}` : defaultProfileImage;
      setUserInfo(userInfo);
      setSelectedImage({ uri: imageUrl });
    } catch (error) {
      console.error("Erreur lors du chargement des infos utilisateur", error);
    } finally {
      setLoading(false);
    }
  };

  const dateToDayMonth = (date) => {
    const dates = new Date(date);
    const day = String(dates.getDate()).padStart(2, '0');
    const month = String(dates.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  };
  

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Désolé, nous avons besoin de la permission pour accéder à votre galerie.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      handleImageUpload(result.assets[0].uri);
    }
  };

  const handleImageUpload = async (imageUri) => {
    let localUri = imageUri;
    let filename = localUri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
  
    const formData = new FormData();
    formData.append('avatar', { uri: localUri, name: filename, type });

    try {
      const response = await saveProfilePicture(formData);
      await SecureStore.setItemAsync('userInfo', JSON.stringify(response.data.user));
      fetchUserInfo();
      const picturePath = `${apiUrl}/uploads/${response.data.user.profile_picture}`
      setSelectedImage({ uri: picturePath });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'image de profil", error);
    }
      
  };

  const handlePresentModalPress = () => {
    bottomSheetRef.current?.present();
  };

  const handleImageSelection = async (image) => {
    console.log(image);
    const avatarName = image.split('/').pop().split('.')[0];
    const formData = new FormData();
    formData.append('avatar', avatarName);
  
    try {
      const response = await saveProfilePicture(formData);
      await SecureStore.setItemAsync('userInfo', JSON.stringify(response.data.user));
      fetchUserInfo();
      const picturePath = `${apiUrl}/uploads/${response.data.user.profile_picture}`
      console.log(picturePath);
      setSelectedImage({ uri: picturePath });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'image de profil", error);
    }
  
    bottomSheetRef.current?.dismiss();
  };
  

  useFocusEffect(
    React.useCallback(() => {
      fetchUserInfo();
    }, [])
  );

  const images = [
    { uri: mirabeau, name: 'avatar-mirabeau.png' },
    { uri: fraisette, name: 'avatar-fraisette' },
    { uri: menthe, name: 'avatar-menthe' }
  ];

  const sections = [
    {
      title: 'Modifier votre profil',
      data: [
        { name: 'Modifier ma taille', screen: 'HeightModification', icon: heightIcon },
        { name: 'Modifier mon poids', screen: 'WeightModification', icon: weightIcon },
        { name: 'Modifier mon niveau d\'activité', screen: 'ActivityModification', icon: activityIcon },
        { name: 'Modifier mes problèmes de santé', screen: 'HealthModification', icon: healthIcon },
      ]
    }
  ];

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.containerParent}>
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <TouchableOpacity style={styles.profileHeader} onPress={handlePresentModalPress}>
            <View style={styles.imageContainer}>
              <Image
                source={selectedImage ? selectedImage : { uri: defaultProfileImage }}
                style={styles.profileImage}
              />
              <View style={styles.editIcon}>
                <AntDesign name="edit" size={hp('2%')} color="black" />
              </View>
              </View>
          </TouchableOpacity>
        {userInfo && 
          <View>
            <Text style={styles.name}>{userInfo.first_name}</Text>
            <Text style={styles.subtitle}>{dateToDayMonth(userInfo.birth_date)}</Text>
          </View>
        }
        </View>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <TouchableOpacity
          style={styles.item}
            onPress={() => navigation.navigate(item.screen, { userInfo: userInfo })}
          >
            <Image source={item.icon} style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.name}</Text>
            </View>
            <Entypo name="chevron-right" size={hp('3%')} color="#717171" />
          </TouchableOpacity>
        )}
        style={styles.container}
      />
      <BottomSheetModal
          ref={bottomSheetRef}
          index={0}
          snapPoints={['25%', '50%']}
        >
          <View style={styles.contentContainer}>
            <Text>Choisir une nouvelle photo de profil</Text>
            <View style={styles.imagesGroup}>
            <TouchableOpacity onPress={pickImage} style={styles.thumbnailImage}>
              <Image
              source={selectedImage ? selectedImage : { uri: defaultProfileImage }}
              style={styles.imageThumbnail} 
            />
            </TouchableOpacity>
            {images.map((image, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => handleImageSelection(image.name)}
                style={styles.thumbnailImage}
              >
                <Image 
                  source={image.uri} 
                  style={styles.imageThumbnail} 
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
            </View>
          </View>
        </BottomSheetModal>
      </View>
    </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  containerParent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    width: hp('2.6%'), 
    height: hp('2.6%'), 
    marginRight: 15
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: hp('2.5%'),
    fontFamily: 'Poppins_700Bold',
    color: '#1F1F1F',
  },
  title: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins_400Regular',
    color: '#1F1F1F'
  },
  subtitle: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins_400Regular',
    color: '#717171'
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
profileHeader: {
  alignItems: 'center',
},
imageContainer: {
  position: 'relative',
},
profileImage: {
  width: wp('22%'),
  height: wp('22%'),
  borderRadius: 100, 
  marginBottom: 10,
},
editIcon: {
  position: 'absolute',
  bottom: 8,
  right: 3,
  backgroundColor: '#EFEFEF',
  borderRadius: 50,
  padding: 5,
},
contentContainer: {
  flex: 1,
  alignItems: 'center',
},
imagesGroup: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 20,
},
thumbnailImage: {
  borderRadius: 25,
  margin: 10,
},
imageThumbnail: {
  width: 60,
  height: 60,
  borderRadius: 30,
},
});
