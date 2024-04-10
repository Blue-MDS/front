import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, TouchableOpacity, Text as RText } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Svg, { G, Rect, Text, Line } from 'react-native-svg';
import { AntDesign } from '@expo/vector-icons';
import * as d3 from 'd3';
import CustomButton from './Button';
import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.expoPublicApiUrl;

const WaterConsumptionHistogram = () => {
  const [d3Data, setD3Data] = useState([]);
  const [period, setPeriod] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekRange, setWeekRange] = useState({ start: new Date(), end: new Date() });


  const width = Dimensions.get('window').width;
  const height = 200;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  
  const maxQuantity = 4;
  const y = d3.scaleLinear()
  .range([height - margin.bottom, margin.top])
  .domain([0, maxQuantity]);

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'short' });
  };
  
  let hourlyData = [];
  for (let hour = 6; hour <= 23; hour++) {
    const found = d3Data.find(d => parseInt(d.hour) === hour);
    hourlyData.push({ hour: `${hour}h`, total_quantity: found ? found.total_quantity : 0 });
  }

  const getFrenchShortDayName = (date) => {
    const test = new Date(date);
    console.log(test);
    const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  };


  const x = d3.scaleBand()
  .range([margin.left, width - margin.right])
  .padding(0.3)
  .domain(period === 'day' ? hourlyData.map(d => d.hour) : d3Data.map(d => d.day));

  const barHeight = d => height - margin.bottom - y(d.total_quantity);
  x.domain(hourlyData.map(d => d.hour));
  const yAxisTicks = y.ticks().map(value => ({
    value,
    translateY: y(value)
  }));

  let xAxisTicks;
  switch (period) {
    case 'day':
      xAxisTicks = hourlyData.map((d, i) => ({
        value: d.hour,
        translateX: x(d.hour) + x.bandwidth() / 2
      }));
      break;
    case 'week':
      xAxisTicks = d3Data.map((d, i) => ({
        value: d.day,
        translateX: x(d.day) + x.bandwidth() / 2
      }));
      break;
    default:
      xAxisTicks = [];
  }


  const getWeekRange = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + (start.getDay() === 0 ? -6 : 1));
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return { start, end };
  };

  const getPreviousWeek = (date) => {
    const previousMonday = new Date(date);
    previousMonday.setDate(previousMonday.getDate() - (previousMonday.getDay() + 6) % 7);
    if (previousMonday.getDay() !== 1) {
      previousMonday.setDate(previousMonday.getDate() - 7);
    }
    previousMonday.setDate(previousMonday.getDate() - 7);
    const previousSunday = new Date(previousMonday);
    previousSunday.setDate(previousMonday.getDate() + 6);
  
    return { start: previousMonday, end: previousSunday };
  };

  const getNextWeek = (date) => {
    const nextMonday = new Date(date);
    nextMonday.setDate(nextMonday.getDate() - (nextMonday.getDay() + 6) % 7);
    if (nextMonday.getDay() !== 1) {
      nextMonday.setDate(nextMonday.getDate() - 7);
    }
    nextMonday.setDate(nextMonday.getDate() + 7);
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);

    return { start: nextMonday, end: nextSunday };
  };


  const handlePrevDate = async () => {
    if (period === 'day') {
      const previousDay = new Date(selectedDate);
      previousDay.setDate(previousDay.getDate() - 1);
      setSelectedDate(previousDay);
      fetchDatas(previousDay);
    } else if (period === 'week') {
      const previousWeek = getPreviousWeek(selectedDate);
      setWeekRange(previousWeek);
      setSelectedDate(previousWeek.start);
      fetchDatas(previousWeek.start);
    }
  };
  
  const handleNextDate = async () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
  
    if (period === 'day') {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      if (nextDay > today) {
        console.log('Cannot go to future date.');
        return;
      }
      setSelectedDate(nextDay);
      await fetchDatas(nextDay);
    } else if (period === 'week') {
      const nextWeek = getNextWeek(selectedDate);
      if (nextWeek.start > today) {
        console.log('Cannot go to future week.');
        return;
      }
      setWeekRange(nextWeek);
      setSelectedDate(nextWeek.start);
      await fetchDatas(nextWeek.start);
    }
  };
  

  

  const fetchDatas = async (date) => {
    let params = {};
    let endpoint = '';
    if (period === 'day') {
      params = { specificDate: date.toISOString().split('T')[0] };
      endpoint = '/dailyConsumption';
    } else if (period === 'week') {
      const { start, end } = getWeekRange(date);
      params = { startDate: start.toISOString().split('T')[0], endDate: end.toISOString().split('T')[0] };
      endpoint = '/weeklyConsumption';
    }

    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get(`${apiUrl}/water${endpoint}`, {
        headers: { token: token },
        params
      });

      if (response.status === 200) {
        if (period === 'week') {
          let weekData = response.data.map(d => ({
            day: new Date(d.day),
            total_quantity: parseFloat(d.total_quantity)
          }));
          setD3Data(weekData);
          x.domain(weekData.map(d => getFrenchShortDayName(d.day)));
        } else {
          let dayData = [];
          for (let hour = 7; hour <= 23; hour++) {
            const found = response.data.find(d => parseInt(d.hour) === hour);
            dayData.push({ hour: `${hour}h`, total_quantity: found ? parseFloat(found.total_quantity) : 0 });
          }
          setD3Data(dayData);
          x.domain(dayData.map(d => d.hour));
        }
      } else {
        console.log('Erreur lors de la récupération des données');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatDateRange = () => {
    if (period === 'week') {
      const { start, end } = getWeekRange(selectedDate);
      return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
    }
    return selectedDate.toLocaleDateString();
  };

  useEffect(() => {
    fetchDatas(selectedDate);
  }, [period, selectedDate]);

  useEffect(() => {
    if (period === 'week' && d3Data.length > 0) {
      const dayNames = d3Data.map(d => getFrenchShortDayName(d.day));
      x.domain(dayNames);
      xAxisTicks = d3Data.map((d, i) => ({
        value: getFrenchShortDayName(d.day),
        translateX: x(getFrenchShortDayName(d.day)) + x.bandwidth() / 2
      }));
    } else {
      x.domain(hourlyData.map(d => d.hour));
      xAxisTicks = hourlyData.map((d, i) => ({
        value: d.hour,
        translateX: x(d.hour) + x.bandwidth() / 2
      }));
    }
  }, [period, weekRange.start]);

    return (
      <View style={styles.container}>
        <View style={styles.buttonsGroup}>
          <TouchableOpacity onPress={handlePrevDate}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <RText style={{ fontSize: 16, fontFamily: 'Poppins_600SemiBold' }}>
            {formatDateRange()}
          </RText>
          <TouchableOpacity onPress={handleNextDate}>
            <AntDesign name="arrowright" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonsGroup}>
          <CustomButton text="Jour" onPress={() => setPeriod('day')} />
          <CustomButton text="Semaine" onPress={() => setPeriod('week')} />
        </View>
        <Svg width={width} height={height} key={period === 'week' ? weekRange.start.toISOString() : selectedDate.toISOString()}>
        <G>
        {period === 'day' && hourlyData.map((d, i) => (
          <Rect
            key={`bar-day-${d.hour || i}`}
            x={x(d.hour)}
            y={y(d.total_quantity)}
            width={x.bandwidth()}
            height={barHeight(d)}
            fill="grey"
          />
        ))}

        {period === 'week' && d3Data.map((d, i) => (
          <Rect
            key={`bar-week-${d.day || i}`}
            x={x(d.day)}
            y={y(d.total_quantity)}
            width={x.bandwidth()}
            height={barHeight(d)}
            fill="steelblue"
          />
        ))}

        {yAxisTicks.map(tick => (
          <G key={`tick-${tick.value}`}>
            <Line x1={margin.left} x2={width - margin.right} y1={tick.translateY} y2={tick.translateY} stroke="#e4e4e4" />
            <Text x={margin.left - 10} y={tick.translateY + 5} fontSize={10} textAnchor="end">
              {tick.value}
            </Text>
          </G>
        ))}

        {xAxisTicks.map(tick => (
          <Text
            key={`label-${tick.value}`}
            x={tick.translateX}
            y={height - margin.bottom + 20}
            fontSize={10}
            textAnchor="middle"
          >
            {tick.value}
          </Text>
        ))}
      </G>
    </Svg>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignContent: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      paddingVertical: 20,
      marginBottom: 20,
      marginTop: 40,
    },
    buttonsGroup: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      marginHorizontal: 10
    }
  });

export default WaterConsumptionHistogram;
