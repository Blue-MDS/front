import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env';

export const HealthIssues = ({ selectedIssues, onSelect }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHealthIssues = async () => {
      onSelect([]);
      setIsLoading(true);
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const response = await axios.get(`${API_URL}/healthIssues`, {
          headers: {
            token: token
          }
        })
        if (response.data) {
          setData(response.data.healthIssues)
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHealthIssues();
  }, []);

  const handleSelectIssue = (issue) => {
    let newSelectedIssues;
    if (selectedIssues.includes(issue)) {
      newSelectedIssues = selectedIssues.filter(selectedIssue => selectedIssue !== issue);
    } else {
      newSelectedIssues = [...selectedIssues, issue];
    }
    onSelect(newSelectedIssues);
  };

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  const getCardStyle = (issue) => {
    return selectedIssues.includes(issue) ? styles.selectedCard : styles.unselectedCard;
  };

  return (
    <View style={styles.container}>
      {data.map((card) => (
        <Pressable style={[
          styles.card, getCardStyle(card.health_issue)]}  key={card.health_issue} onPress={() =>handleSelectIssue(card.health_issue)}>
          <Text style={[styles.title, {color: selectedIssues.includes(card.health_issue) ? 'white' : 'black'}]}>{card.health_issue}</Text>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 65,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    gap: 24,
  },
  card: {
    width: 170,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: 'white',
    paddingHorizontal: 5,
    shadowColor: 'rgba(0, 0, 0, 0.13)',
    shadowOffset: { width: 0, height: 1.6 },
    shadowOpacity: 0.23,
    shadowRadius: 3.6,
    elevation: 4    
  },
  selectedCard: {
    backgroundColor: 'black',
  },
  unselectedCard: {
    backgroundColor: 'white',
  },
  title: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 20
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    color: '#474747',
    fontSize: 14,
    textAlign: 'center'
  }
});
