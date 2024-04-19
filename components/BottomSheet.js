import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const BottomSheet = () => {
  return (
    <View style={styles.container}>
      <Text>Bottom Sheet Component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default BottomSheet;