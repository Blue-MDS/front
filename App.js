import React, { useContext } from 'react';
import { TouchableOpacity, Button, Text, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import Login from './screens/Login';
import Register from './screens/Register';
import HomeScreen from './screens/Home';

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}
const WelcomeScreen = ({ navigation }) => (
  <View style={styles.inputContainer}>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.text}>Commencer</Text>
      </TouchableOpacity>
  </View>
);

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { userToken, isLoading } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : userToken == null ? (
          <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen
            name="SignIn"
            component={Login}
            options={{ title: 'Sign in' }}
          />
          <Stack.Screen
            name="Signup"
            component={Register}
            options={{ title: 'Sign up' }}
          />
        </>
        ) : (
          <Stack.Screen name="Home" component={HomeScreen} />
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

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    justifyContent: "center", 
    margin: 10
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#014F97',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    marginVertical: 10,
    marginHorizontal: 64,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
