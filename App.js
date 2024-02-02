import React, { useContext, useEffect } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import { OnBoardingScreen } from './screens/OnBoarding';
import { Login } from './screens/Login';
import { Register } from './screens/Register';
import { DailyGoalConfirmation } from './screens/DailyGoalConfirmation';
import { HomeScreen } from './screens/Home';
import { ProfileSteps } from './screens/ProfileSteps/ProfileSteps'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { checkProfileCompletion } from './services/userService';
import SettingsScreen from './screens/Settings/Settings';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_600SemiBold_Italic, Poppins_700Bold, Poppins_800ExtraBold } from '@expo-google-fonts/poppins';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="SettingsTab" component={SettingsTab} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

function SettingsTab() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DailyGoal" component={DailyGoalConfirmation} />
    </Stack.Navigator>
  );
}

function AuthScreens() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Onboarding" component={OnBoardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignIn" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={Register} options={{ headerShown: false }} />
    </Stack.Navigator>
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
          <>
            <Stack.Screen name="DailyGoalConfirmation" component={DailyGoalConfirmation} options={{ headerShown: false }} />
            <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
