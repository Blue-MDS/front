import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env';
import axios from 'axios';

export const AuthContext = createContext();

const startState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
  errorMessage: '',
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
      } catch (e) {
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(() => ({
    signIn: async (data) => {
      try {
        const response = await axios.post(`${API_URL}/users/login`, data);
        await SecureStore.setItemAsync('userToken', response.data.token);
        dispatch({ type: 'SIGN_IN', token: response.data.token });
      } catch (error) {
        console.log(error.response.data.message);
        dispatch({ type: 'ERROR', error: error.response.data.message });
      }
    },
    signOut: async () => {
      await SecureStore.deleteItemAsync('userToken')
      dispatch({ type: 'SIGN_OUT' })
    },
    signUp: async (data) => {
      try {
        const response = await axios.post(`${API_URL}/users/subscribe`, data);
        await SecureStore.setItemAsync('userToken', response.data.token);
        dispatch({ type: 'SIGN_IN', token: response.data.token });
      } catch (error) {
        dispatch({ type: 'ERROR', error: error.response.data.message });
      }
    },
    resetError: () => dispatch({type: 'RESET_ERROR'}),
    userToken: state.userToken,
    isLoading: state.isLoading,
    isSignout: state.isSignout,
    errorMessage: state.errorMessage,
  }), [state]);

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};
