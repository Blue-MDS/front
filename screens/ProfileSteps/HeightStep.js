import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const rulerUnit = 1;
const minHeight = 0;
const maxHeight = 230;
const interval = screenWidth / 17;

export const HeightSelector = ({ height, onHeightChange }) => {
  const scrollViewRef = useRef(null);

  useEffect(() => {
    onHeightChange(0);
  }, []);

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const selectedHeight = Math.round(contentOffset / interval) + minHeight;
    onHeightChange(selectedHeight);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.selectedHeight}>{`${height} cm`}</Text>
      <View style={styles.rulerContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          snapToInterval={interval}
          contentContainerStyle={styles.scrollViewContainer}
        >
          {Array.from({ length: (maxHeight - minHeight) / rulerUnit + 1 }, (_, index) => (
            <View key={index} style={styles.markContainer}>
              <View style={[styles.mark, index % 5 === 0 ? styles.longMark : {}]} />
              {index % 5 === 0 && (
                <Text style={styles.markText}>{minHeight + index * rulerUnit}</Text>
              )}
            </View>
          ))}
        </ScrollView>
        <View style={styles.indicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedHeight: {
    fontSize: 100,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 27,
  },
  rulerContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    height: 100,
  },
  scrollViewContainer: {
    paddingHorizontal: screenWidth / 2 - interval / 2,
  },
  indicatorContainer: {
    position: 'absolute',
    left: screenWidth / 2 - interval / 2,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  markContainer: {
    width: interval,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    width: 1,
    height: 27,
    backgroundColor: '#999A9A',
  },
  longMark: {
    width: 1,
    height: 54,
    backgroundColor: 'black',
  },
  indicator: {
    position: 'absolute',
    top: '50%',
    marginTop: -50,
    left: (screenWidth - 2) / 2,
    width: 2,
    height: 100,
    backgroundColor: 'black',
  },
});
