import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, useWindowDimensions, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { getTranslation } from '../utils/languages';
import { getSensorHistory } from '../services/sensorService';
import tw from 'tailwind-react-native-classnames';

export default function HistoryScreen({ language }) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState({
    labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
  });
  const [monthlyData, setMonthlyData] = useState({
    labels: ['S1', 'S2', 'S3', 'S4'],
    datasets: [{ data: [0, 0, 0, 0] }]
  });

  useEffect(() => {
    const loadHistoryData = async () => {
      try {
        setIsLoading(true);
        const weekData = await getSensorHistory('week');
        const monthData = await getSensorHistory('month');
        
        setWeeklyData({
          labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
          datasets: [{ data: weekData }]
        });
        
        setMonthlyData({
          labels: ['S1', 'S2', 'S3', 'S4'],
          datasets: [{ data: monthData }]
        });
      } catch (error) {
        console.error('Error al cargar datos históricos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHistoryData();
  }, []);

  const chartConfig = {
    backgroundGradientFrom: '#1F2937',
    backgroundGradientTo: '#1F2937',
    color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: "#374151",
    },
  };

  const chartStyle = tw`rounded-lg overflow-hidden`;

  const renderChart = (data, title) => (
    <View style={tw`bg-gray-800 rounded-xl p-4 mb-4 ${isLandscape ? 'w-1/2' : 'w-full'}`}>
      <Text style={tw`text-white text-lg font-bold mb-4`}>
        {getTranslation(language, title)}
      </Text>
      {isLoading ? (
        <ActivityIndicator color="#22C55E" size="large" style={tw`py-20`} />
      ) : (
        <BarChart
          data={data}
          width={isLandscape ? width / 2 - 40 : width - 40}
          height={220}
          chartConfig={chartConfig}
          style={chartStyle}
          yAxisLabel=""
          yAxisSuffix=""
          showValuesOnTopOfBars
          fromZero
        />
      )}
    </View>
  );

  return (
    <ScrollView style={tw`bg-gray-900 flex-1`} contentContainerStyle={tw`p-4`}>
      <View style={tw`flex-row flex-wrap justify-between`}>
        {renderChart(weeklyData, 'weeklyAQITrend')}
        {renderChart(monthlyData, 'monthlyAQITrend')}
      </View>
    </ScrollView>
  );
}