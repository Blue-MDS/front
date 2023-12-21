import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import { OnBoardingScreen } from './screens/OnBoarding';
import { Login } from './screens/Login';
import { Register } from './screens/Register';
import { HomeScreen } from './screens/Home';
import { ProfileSteps } from './screens/ProfileSteps/ProfileSteps'
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_600SemiBold_Italic, Poppins_700Bold, Poppins_800ExtraBold } from '@expo-google-fonts/poppins' 

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { userToken, isLoading } = useContext(AuthContext);

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

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : userToken == null ? (
          <>
          <Stack.Screen
            name="Onboarding"
            component={OnBoardingScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignIn"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Signup"
            component={Register}
            options={{headerShown: false}}
          />
        </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
             name="ProfileSteps"
             component={ProfileSteps}
             options={{headerShown: false}} />
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
