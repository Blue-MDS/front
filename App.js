import React, { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text, View, Image } from 'react-native';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import { NotificationSettingsProvider } from './contexts/NotificationContext';
import { QuizNavigator } from './naviguators/QuizNavigator';
import { TeamProvider } from './contexts/QuizContext';
import { WaterProvider } from './contexts/ConsumptionContext';
import { OnBoardingScreen } from './screens/OnBoarding';
import { Login } from './screens/Login';
import { Register } from './screens/Register';
import { DailyGoalConfirmation } from './screens/DailyGoalConfirmation';
import { HomeScreen } from './screens/Home';
import { ProfileSteps } from './screens/ProfileSteps/ProfileSteps'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsScreen from './screens/Settings/Settings';
import { PeriodSettingsScreen } from './screens/Settings/Notifications/Periods';
import { FrequencySettingsScreen } from './screens/Settings/Notifications/Frequency';
import {NotificationsMainScreen} from './screens/Settings/Notifications/MainScreen';
import { ProfileModification } from './screens/Settings/Profile/MainScreen';
import { WeightModification } from './screens/Settings/Profile/WeightModification';
import { HeightModification } from './screens/Settings/Profile/HeightModification';
import { ActivityModification } from './screens/Settings/Profile/ActivityModification';
import { HealthModification } from './screens/Settings/Profile/HealthModification';
import { OnboardingSwiper } from './screens/Onboarding/OnboardingSwiper';
import { Dosing } from './screens/Dosing';
import { AntDesign, Entypo } from '@expo/vector-icons';
import settingsIcon from './assets/icons/settings-icon.png';
import aromeIcon from './assets/icons/arome-icon.png';
import teamIcon from './assets/icons/team-icon.png';
import glassIcon from './assets/icons/glass-icon.png';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_600SemiBold_Italic, Poppins_700Bold, Poppins_800ExtraBold } from '@expo-google-fonts/poppins';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const hideTabBarScreens = ['WeightModification', 'HeightModification', 'ActivityModification', 'HealthModification'];

function getTabBarStyle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? route.name;

  if (hideTabBarScreens.includes(routeName)) {
    return { display: 'none' };
  } else {
    return {};
  }
}

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function NotificationNavigator() {
  return (
    <NotificationSettingsProvider>
      <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitle: '',
      headerTransparent: true,
      headerBackTitleVisible: false,
      headerTintColor: 'black',
      headerBackImage: () => (
        <Entypo name="chevron-thin-left" size={24} color="black" />
      ),
      
    }}>
      <Stack.Screen name="NotificationsMain" component={NotificationsMainScreen} />
      <Stack.Screen name="PeriodSettings" component={PeriodSettingsScreen}  />
      <Stack.Screen name="FrequencySettings" component={FrequencySettingsScreen} />
      </Stack.Navigator>
    </NotificationSettingsProvider>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: [getTabBarStyle(route), {
          paddingVertical: 10,
          paddingHorizontal: 10,
        }],
        tabBarActiveBackgroundColor: '#C0EDFD',
        tabBarInactiveBackgroundColor: 'transparent',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = glassIcon;
          } else if (route.name === 'Dosing') {
            iconName = aromeIcon;
          } else if (route.name === 'Quiz') {
            iconName = teamIcon;
          } else if (route.name === 'SettingsTab') {
            iconName = settingsIcon;
          }
          return <Image
          source={iconName}
          style={{
            width: 20,
            height: 20,
            resizeMode: 'contain'
          }}
        />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarLabel: ({ focused, color }) => {
          let label;
          if (route.name === 'Home') {
            label = 'Suivi';
          } else if (route.name === 'Dosing') {
            label = 'Arôme';
          } else if (route.name === 'Quiz') {
            label = 'Team';
          } else if (route.name === 'SettingsTab') {
            label = 'Paramètres';
          }
          
          return <Text style={{ color: '#000' }}>{label}</Text>;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} 
        options={{
          headerShown: false,
        }} />
      <Tab.Screen name="Dosing" component={Dosing} 
        options={{
          headerShown: false,
        }} />
      <Tab.Screen name="Quiz" component={QuizNavigator}
        options={() => ({
          headerShown: false,
        })} />
      <Tab.Screen name="SettingsTab" component={SettingsTab}
        options={() => ({
          headerShown: false,
        })} />
    </Tab.Navigator>
  );
}


function SettingsTab() {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitle: '',
      headerTransparent: true,
      headerBackTitleVisible: false,
      headerTintColor: 'black',
      headerBackImage: () => (
        <Entypo name="chevron-thin-left" size={24} color="black" />
      ),
      
    }}>
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DailyGoal" component={DailyGoalConfirmation} />
      <Stack.Screen name="Notifications" component={NotificationNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileNavigator} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitle: '',
      headerTransparent: true,
      headerBackTitleVisible: false,
      headerTintColor: 'black',
      headerBackImage: () => (
        <Entypo name="chevron-thin-left" size={24} color="black" />
      ),
      
    }}>
      <Stack.Screen name="ProfileMain" component={ProfileModification} />
      <Stack.Screen name="WeightModification" component={WeightModification} />
      <Stack.Screen name="HeightModification" component={HeightModification} />
      <Stack.Screen name="ActivityModification" component={ActivityModification} />
      <Stack.Screen name="HealthModification" component={HealthModification} />
    </Stack.Navigator>
  )
}

function AuthScreens() {
  return (
    <Stack.Navigator screenOptions={{
      contentStyle:{
        backgroundColor:'#FFFFFF'
      },
      headerStyle: {
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitle: '',
      headerTransparent: true,
      headerBackTitleVisible: false,
      headerTintColor: 'black',
      headerBackImage: () => (
        <Entypo name="chevron-thin-left" size={24} color="black" />
      ),
      
    }}>
      <Stack.Screen name="Onboarding" component={OnBoardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingSwiper" component={OnboardingSwiper} options={{ headerShown: false }} />
      <Stack.Screen name="SignIn" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={Register} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function HomeNavigator() {
  return (
    <WaterProvider>
      <Stack.Navigator>
        <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen name="DailyGoalConfirmation" component={DailyGoalConfirmation} options={{ headerShown: false }} />
      </Stack.Navigator>
    </WaterProvider>
  );
}


function AppNavigator() {
  const { userToken, isLoading, isProfileComplete, isDailyGoalAccepted, completeProfile } = useContext(AuthContext);
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_800ExtraBold
  });

  if (!fontsLoaded) {
    return null;
  }

  console.log(isProfileComplete);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : userToken === null ? (
          <Stack.Screen name="AuthScreens" component={AuthScreens} options={{ headerShown: false }} />
        ) : !isProfileComplete ? (
          <Stack.Screen name="ProfileSteps" component={ProfileSteps} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="HomeNavigator" component={HomeNavigator} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <TeamProvider>
          <AppNavigator />
        </TeamProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
