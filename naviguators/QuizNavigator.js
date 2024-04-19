import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QuizStart } from '../screens/QuizSteps/QuizStart'
import { QuizComponent } from '../screens/QuizSteps/Quiz'
import { TeamScreen } from '../screens/QuizSteps/Team'
import { HomeTeamScreen } from '../screens/QuizSteps/HomeTeam'
import { TeamContext } from '../contexts/QuizContext';

const Stack = createNativeStackNavigator();

export const QuizNavigator = () => {
  const { hasTeam } = useContext(TeamContext);
  return (
    <Stack.Navigator>
    {hasTeam ? (
      <>
        <Stack.Screen name="HomeTeam" component={HomeTeamScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Team" component={TeamScreen} options={{ headerShown: false }} />
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