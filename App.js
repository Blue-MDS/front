import React, { useContext, useEffect } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import { NotificationSettingsProvider } from './contexts/NotificationContext';
import { TeamContext, TeamProvider } from './contexts/QuizContext';
import { OnBoardingScreen } from './screens/OnBoarding';
import { Login } from './screens/Login';
import { Register } from './screens/Register';
import { DailyGoalConfirmation } from './screens/DailyGoalConfirmation';
import { HomeScreen } from './screens/Home';
import { ProfileSteps } from './screens/ProfileSteps/ProfileSteps'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeTeamScreen } from './screens/QuizSteps/HomeTeam';
import SettingsScreen from './screens/Settings/Settings';
import { PeriodSettingsScreen } from './screens/Settings/Notifications/Periods';
import { FrequencySettingsScreen } from './screens/Settings/Notifications/Frequency';
import {NotificationsMainScreen} from './screens/Settings/Notifications/MainScreen';
import { QuizStart } from './screens/QuizSteps/QuizStart';
import { QuizComponent } from './screens/QuizSteps/Quiz';
import { ProfileModification } from './screens/Settings/Profile/MainScreen';
import { WeightModification } from './screens/Settings/Profile/WeightModification';
import { HeightModification } from './screens/Settings/Profile/HeightModification';
import { ActivityModification } from './screens/Settings/Profile/ActivityModification';
import { TeamScreen } from './screens/QuizSteps/Team';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
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

function NotificationNavigator() {
  return (
    <NotificationSettingsProvider>
      <Stack.Navigator>
      <Stack.Screen name="NotificationsMain" component={NotificationsMainScreen} />
      <Stack.Screen name="PeriodSettings" component={PeriodSettingsScreen}  />
      <Stack.Screen name="FrequencySettings" component={FrequencySettingsScreen} />
      </Stack.Navigator>
    </NotificationSettingsProvider>
  );
}

function QuizNavigator() {
  const { hasTeam } = useContext(TeamContext);
  return (
    <Stack.Navigator>
    {hasTeam ? (
      <>
        <Stack.Screen name="Team" component={TeamScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomeTeam" component={HomeTeamScreen} options={{ headerShown: false }} />
      </>
    ) : (
      <>
        <Stack.Screen name="QuizStart" component={QuizStart} options={{ headerShown: false }} />
        <Stack.Screen name="Questions" component={QuizComponent} options={{ headerShown: false }} />
      </>
    )}
  </Stack.Navigator>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} 
      options={{
        headerShown: false,
        tabBarIcon: (tabInfo) => (
          <AntDesign name="home" size={24} color="black" />
        ),
      }} />
      <Tab.Screen name="Quiz" component={QuizNavigator}
      options={({ route, }) => ({
        
        headerShown: false,
        tabBarIcon: (tabInfo) => (
          <FontAwesome5 name="lemon" size={18} color="black" />
        ),
      })} />
       <Tab.Screen name="SettingsTab" component={SettingsTab}
      options={{
        headerShown: false,
        tabBarIcon: (tabInfo) => (
          <AntDesign name="setting" size={24} color="black" />
        ),
      }} />
    </Tab.Navigator>
  );
}

function SettingsTab() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DailyGoal" component={DailyGoalConfirmation} />
      <Stack.Screen name="Notifications" component={NotificationNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileNavigator} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" component={ProfileModification} />
      <Stack.Screen name="WeightModification" component={WeightModification} />
      <Stack.Screen name="HeightModification" component={HeightModification} />
      <Stack.Screen name="ActivityModification" component={ActivityModification} />
    </Stack.Navigator>
  )
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
      <TeamProvider>
        <AppNavigator />
      </TeamProvider>
    </AuthProvider>
  );
}
