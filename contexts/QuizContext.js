import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { userHasTeam } from '../services/quizService';

export const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const [hasTeam, setHasTeam] = useState(false);

  useEffect(() => {
    const checkTeamAssigned = async () => {
      const team = await SecureStore.getItemAsync('userTeam');
      if (team) {
        setHasTeam(true);
      } else {
        const response = await userHasTeam();
        if (response.data.hasTeam) {
          setHasTeam(true);
          SecureStore.setItemAsync('userTeam', response.data.team);
        }
        else {
          setHasTeam(false);
        }
      }
    };

    checkTeamAssigned();
  }, []);

  return (
    <TeamContext.Provider value={{ hasTeam, setHasTeam }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => useContext(TeamContext);
