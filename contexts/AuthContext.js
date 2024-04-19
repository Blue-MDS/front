import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { checkProfileCompletion } from '../services/userService';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.expoPublicApiUrl;;

export const AuthContext = createContext();

const startState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
  errorMessage: '',
  isProfileComplete: false,
  isDailyGoalAccepted: false,
};

const authReducer = (prevState, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        errorMessage: '',
        userToken: action.token,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        userToken: null,
        isProfileComplete: false,
        isDailyGoalAccepted: false,
      };
    case 'ERROR':
      return {
        ...prevState,
        isLoading: false,
        errorMessage: action.error,
      };
    case 'RESET_ERROR':
      return {
        ...prevState,
        isLoading: false,
        errorMessage: '',
      };
    case 'COMPLETE_PROFILE':
      return {
        ...prevState,
        isProfileComplete: true,
      };
    case 'ACCEPT_DAILY_GOAL':
      return {
        ...prevState,
        isDailyGoalAccepted: true,
      };
    default:
      return prevState;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, startState);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await SecureStore.getItemAsync('userToken');
        const userInfo = await SecureStore.getItemAsync('userInfo');
        const profileComplete = userInfo ? JSON.parse(userInfo).profile_complete : false;
        dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        if (profileComplete) {
          dispatch({ type: 'COMPLETE_PROFILE' });
        }
      } catch (e) {
        console.error(e);
      }
    };
    bootstrapAsync();
  }, []);
  

  const authContext = useMemo(() => ({
    signIn: async (data, navigation) => {
      try {
        const response = await axios.post(`${apiUrl}/users/login`, data);
        await SecureStore.setItemAsync('userToken', response.data.token);
        await SecureStore.setItemAsync('userInfo', JSON.stringify(response.data.user));
        dispatch({ type: 'SIGN_IN', token: response.data.token });
        if (response.data.user.profile_complete) {
          dispatch({ type: 'COMPLETE_PROFILE' });
        }
        const nextScreen = response.data.user.profile_complete ? 'HomeTabs' : 'ProfileSteps';
        navigation.navigate(nextScreen);
      } catch (error) {
        console.log(error);
        const errorMessage = error.response?.data.message || "An unknown error occurred";
        dispatch({ type: 'ERROR', error: errorMessage });
      }
    },
    
    signOut: async () => {
      await SecureStore.deleteItemAsync('dailyGoal');
      await SecureStore.deleteItemAsync('dailyGoalDate');
      await SecureStore.deleteItemAsync('userToken')
      await SecureStore.deleteItemAsync('profileIsCompleted');
      await SecureStore.deleteItemAsync('isDailyGoalAccepted');
      await SecureStore.deleteItemAsync('currentStep');
      await SecureStore.deleteItemAsync('userTeam');
      await SecureStore.deleteItemAsync('userInfo');
      dispatch({ type: 'SIGN_OUT' })
    },
    signUp: async (data) => {
      try {
        const response = await axios.post(`${apiUrl}/users/subscribe`, data);
        await SecureStore.setItemAsync('userToken', response.data.token);
        const userInfo = JSON.stringify(response.data.user);
        await SecureStore.setItemAsync('userInfo', userInfo);
        dispatch({ type: 'SIGN_IN', token: response.data.token });
      } catch (error) {
        if (error.response && error.response.data) {
          dispatch({ type: 'ERROR', error: error.response.data.message });
        } else {
          dispatch({ type: 'ERROR', error: error.message });
        }
      }
    },
    acceptDailyGoal: () => {
      SecureStore.setItemAsync('isDailyGoalAccepted', 'true');
      dispatch({ type: 'ACCEPT_DAILY_GOAL' });
    },
    completeProfile: () => {
      dispatch({ type: 'COMPLETE_PROFILE' });
    },
    resetError: () => dispatch({type: 'RESET_ERROR'}),
    userToken: state.userToken,
    isLoading: state.isLoading,
    isSignout: state.isSignout,
    errorMessage: state.errorMessage,
    isProfileComplete: state.isProfileComplete,
    isDailyGoalAccepted: state.isDailyGoalAccepted,
  }), [state]);

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};
