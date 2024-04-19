import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const rulerUnit = 1;
const minWeight = 0;
const maxWeight = 150;
const interval = screenWidth / 17;

export const WeightSelector = ({ weight, onWeightChange }) => {
  const scrollViewRef = useRef(null);

  const scrollToPosition = (weight - minWeight) * interval;

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: scrollToPosition, animated: false });
    }
  }, []);

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const selectedWeight = Math.round(contentOffset / interval) + minWeight;
    onWeightChange(selectedWeight);
  };

  return (
    <View style={styles.container}>
      <Text>
        <Text style={styles.selectedWeight}>{`${weight}`}</Text>
        <Text style={styles.unity}>kg</Text>
      </Text>
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
          {Array.from({ length: (maxWeight - minWeight) / rulerUnit + 1 }, (_, index) => (
            <View key={index} style={styles.markContainer}>
              <View style={[styles.mark, index % 5 === 0 ? styles.longMark : {}]} />
              {index % 5 === 0 && (
                <Text style={styles.markText}>{minWeight + index * rulerUnit}</Text>
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
  selectedWeight: {
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
  unity: {
    fontSize: 20,
    fontFamily: 'Poppins_500Medium',
    marginLeft: 10,
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
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
  markText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#999A9A',
    paddingTop: 5,
    width: 30,
  },
});

