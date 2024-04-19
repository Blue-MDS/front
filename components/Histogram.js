import React, { useState, useEffect, useContext } from 'react';
import { View, Dimensions, StyleSheet, TouchableOpacity, Text as RText } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Svg, { G, Rect, Text, Line, Defs, LinearGradient, Stop, ClipPath } from 'react-native-svg';
import { AntDesign } from '@expo/vector-icons';
import * as d3 from 'd3';
import { WaterContext } from '../contexts/ConsumptionContext';
import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.expoPublicApiUrl;

const WaterConsumptionHistogram = () => {
  const { littres } = useContext(WaterContext);
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
  for (let hour = 10; hour <= 16; hour++) {
    const found = d3Data.find(d => parseInt(d.hour) === hour);
    hourlyData.push({ hour: `${hour}h`, total_quantity: found ? found.total_quantity : 0 });
  }

  const getFrenchShortDayName = (date) => {
    if (!(date instanceof Date)) {
      console.error('Invalid date passed:', date);
      return '';
    }
    const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  };
  
  const getColorForQuantity = (quantity) => {
    if (quantity < 1) return '#ade8f4';
    else if (quantity < 2) return '#90e0ef';
    else if (quantity < 3) return '#00b4d8';
    else return '#0077b6';
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
    let tempDate = new Date(date);
    tempDate.setDate(tempDate.getDate() - 7);
    return getWeekRange(tempDate);
  };
  
  const getNextWeek = (date) => {
    let tempDate = new Date(date);
    tempDate.setDate(tempDate.getDate() + 7);
    return getWeekRange(tempDate);
  };
  
  const Gradient = () => (
    <Defs>
      <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="100%">
        <Stop offset="0%" stopColor="#C0EDFD" stopOpacity="1" />
        <Stop offset="100%" stopColor="#63BAF9" stopOpacity="1" />
      </LinearGradient>
      <ClipPath id="clip">
        <Rect width={width} height={height} rx="10" ry="10" />
      </ClipPath>
    </Defs>
  );

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

  const fetchDatas = async (date, msg) => {
    if (msg) console.log(msg);
    const endpoint = period === 'day' ? '/dailyConsumption' : '/weeklyConsumption';
    const params = period === 'day' ?
      { specificDate: date.toISOString().split('T')[0] } :
      {
        startDate: weekRange.start.toISOString().split('T')[0],
        endDate: weekRange.end.toISOString().split('T')[0]
      };
  
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get(`${apiUrl}/water${endpoint}`, {
        headers: { token },
        params
      });
  
      if (response.status === 200) {
        if (period === 'week' && response.data.some(d => !d.day || isNaN(new Date(d.day).getTime()))) {
          console.error('Invalid weekly data received:', response.data);
          return;
        } else if (period === 'day' && response.data.some(d => d.hour === undefined)) {
          console.error('Invalid daily data received:', response.data);
          return;
        }
        setD3Data(transformData(response.data, period));
      } else {
        console.log('Erreur lors de la récupération des données');
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const transformData = (data, period) => {
    if (period === 'day') {
      return data.map(d => {
        let hourAdjusted = parseInt(d.hour) + 2;
        if (hourAdjusted >= 24) hourAdjusted -= 24;
        return { hour: `${hourAdjusted}h`, total_quantity: parseFloat(d.total_quantity) };
      });
    } else if (period === 'week') {
      return data.map(d => ({
        day: getFrenchShortDayName(new Date(d.day)),
        total_quantity: parseFloat(d.total_quantity)
      }));
    }
  };
  
  

  const formatDateRange = () => {
    if (period === 'week') {
      const { start, end } = getWeekRange(selectedDate);
      return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
    }
    const today = new Date().toLocaleDateString();
    return selectedDate.toLocaleDateString() === today ? 'Aujourd\'hui' : selectedDate.toLocaleDateString();
    
  };

  useEffect(() => {
    fetchDatas(selectedDate);
  }, [selectedDate, period]);

  useEffect(() => {
    console.log('currentLitres changed. Updating histogram.');
    fetchDatas(selectedDate, 'update');
  }, [littres]);
  

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
        <Svg width={width} height={height} key={period === 'week' ? weekRange.start.toISOString() : selectedDate.toISOString()}>
          <Gradient />
          {yAxisTicks.map(tick => (
            <G key={`tick-${tick.value}`}>
              <Line x1={margin.left} x2={width - margin.right} y1={tick.translateY} y2={tick.translateY} stroke="#e4e4e4" />
              <Text x={margin.left - 10} y={tick.translateY + 5} fontSize={10} textAnchor="end">
                {tick.value}
              </Text>
            </G>
          ))}
          <G clipPath="url(#clip)">
          {period === 'day' && hourlyData.map((d, i) => (
            <Rect
            key={`bar-day-${d.hour || i}`}
            x={x(d.hour) + (x.bandwidth() * 0.1)}
            y={y(d.total_quantity)}
            width={x.bandwidth() * 1.5}
            height={barHeight(d)}
            fill="url(#grad)"
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
      marginHorizontal: 10,
      borderRadius: 10,
      flex: 1,
      alignContent: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      paddingVertical: 20,
      marginBottom: 20,
      marginTop: 40,
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowColor: '#black',
      shadowOffset: { height: 2, width: 0 },
      elevation: 5,
      marginBottom: 40,
      },
    buttonsGroup: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      marginHorizontal: 10
    }
  });

export default WaterConsumptionHistogram;
