import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';

export const CustomCard = ({ image, onPress, animatedStyle }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View style={[styles.cardStyle, animatedStyle]}>
        <Image source={image} style={styles.imageStyle} resizeMode="contain" />
      </Animated.View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  cardStyle: {
    height: 300,
    width: 250,
    marginHorizontal: 5,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },
});
