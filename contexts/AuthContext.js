import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env';
import axios from 'axios';
import { checkProfileCompletion } from '../services/userService';

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
      let userToken, isProfileComplete, isDailyGoalAccepted;
      try {
        userToken = await SecureStore.getItemAsync('userToken');
        console.log(await SecureStore.getItemAsync('userInfo'));
        isProfileComplete = await SecureStore.getItemAsync('userInfo') ? JSON.parse(await SecureStore.getItemAsync('userInfo')).profile_complete : false;
        isDailyGoalAccepted = await SecureStore.getItemAsync('isDailyGoalAccepted') === 'true';
      } catch (e) {
        console.error(e);
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
      if (isProfileComplete) dispatch({ type: 'COMPLETE_PROFILE' });
      if (isDailyGoalAccepted) dispatch({ type: 'ACCEPT_DAILY_GOAL' });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(() => ({
    signIn: async (data) => {
      try {
        const response = await axios.post(`${API_URL}/users/login`, data);
        await SecureStore.setItemAsync('userToken', response.data.token);
        const userInfo = JSON.stringify(response.data.user);
        await SecureStore.setItemAsync('userInfo', userInfo);
        dispatch({ type: 'SIGN_IN', token: response.data.token });
        console.log(userInfo);
        if (userInfo.profile_complete) {
          dispatch({ type: 'COMPLETE_PROFILE' });
        }
      } catch (error) {
        console.log(error.response.data.message);
        dispatch({ type: 'ERROR', error: error.response.data.message });
      }
    },
    signOut: async () => {
      await SecureStore.deleteItemAsync('dailyGoal');
      await SecureStore.deleteItemAsync('userToken')
      await SecureStore.deleteItemAsync('profileIsCompleted');
      await SecureStore.deleteItemAsync('isDailyGoalAccepted');
      await SecureStore.deleteItemAsync('currentStep');
      dispatch({ type: 'SIGN_OUT' })
    },
    signUp: async (data) => {
      try {
        const response = await axios.post(`${API_URL}/users/subscribe`, data);
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
