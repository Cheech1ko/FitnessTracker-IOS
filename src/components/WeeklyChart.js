import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const WeeklyChart = ({ data, metric }) => {
  // data — массив из getWeeklyChartData()
  // metric — какая метрика отображается ('тренировки', 'тоннаж', 'время')
  
  const chartData = {
    labels: data.map(item => item.day),
    datasets: [{
      data: data.map(item => item[metric])
    }]
  };

  const chartConfig = {
    backgroundGradientFrom: '#1c1c1e',
    backgroundGradientTo: '#1c1c1e',
    decimalPlaces: 0,
    color: (opacity = 1) => {
      const colors = {
        'тренировки': `rgba(10, 132, 255, ${opacity})`,
        'тоннаж': `rgba(88, 86, 214, ${opacity})`,
        'время': `rgba(255, 149, 0, ${opacity})`
      };
      return colors[metric] || `rgba(10, 132, 255, ${opacity})`;
    },
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: { borderRadius: 16 },
    barPercentage: 0.7,
  };

  return (
    <View>
      <BarChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={{ marginVertical: 8, borderRadius: 16 }}
        yAxisLabel=""
        showValuesOnTopOfBars={true}
      />
      <Text style={{ color: '#8e8e93', textAlign: 'center', marginTop: 8 }}>
        Динамика {metric} по дням недели
      </Text>
    </View>
  );
};

export default WeeklyChart;