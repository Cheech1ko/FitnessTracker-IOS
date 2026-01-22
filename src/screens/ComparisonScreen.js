import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTrainingContext } from '../context/TrainingContext';
import { useTheme } from '../context/ThemeContext';
import { useSafeArea } from '../hooks/useSafeArea';

export default function ComparisonScreen() {
  const { getWeeklyComparison, getMonthlyComparisonData } = useTrainingContext();
  const { colors } = useTheme();
  const { safeAreaStyle } = useSafeArea();
  
  const comparison = getWeeklyComparison();
  const { currentWeek, lastWeek } = comparison;
  
  const monthlyData = getMonthlyComparisonData();
  const [selectedMetric, setSelectedMetric] = useState('тренировки');
  const [timeRange, setTimeRange] = useState('месяц');
  
  const screenWidth = Dimensions.get('window').width;

  const formatNumber = (num) => {
    if (!num || isNaN(num)) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(1);
  };

  const formatWeight = (kg) => {
    if (!kg || isNaN(kg)) return '0 кг';
    if (kg >= 1000) return `${(kg / 1000).toFixed(1)} т`;
    return `${kg} кг`;
  };

  const formatTime = (minutes) => {
    if (!minutes || isNaN(minutes)) return '0 мин';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours} ч ${mins} мин`;
    return `${mins} мин`;
  };

  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const prepareChartData = () => {
    let labels = [];
    let data = [];

    if (timeRange === 'недели') {
      labels = ['Прошлая', 'Текущая'];
      const metricKey = getMetricKey();
      data = [lastWeek[metricKey] || 0, currentWeek[metricKey] || 0];
    } else {
      labels = monthlyData.map(item => item.неделя);
      data = monthlyData.map(item => {
        const value = item[getMetricKey()] || 0;
        if (selectedMetric === 'тоннаж') return Math.round(value / 100) / 10;
        if (selectedMetric === 'время') return Math.round(value / 60);
        return value;
      });
    }

    return {
      labels,
      datasets: [{
        data,
        color: (opacity = 1) => {
          const hex = colors.primary.replace('#', '');
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        },
        strokeWidth: 3
      }]
    };
  };

  const getMetricKey = () => {
    const metricMap = {
      'тренировки': 'тренировки',
      'тоннаж': 'тоннаж',
      'время': 'время',
      'упражнения': 'упражнения'
    };
    return metricMap[selectedMetric];
  };

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: selectedMetric === 'тоннаж' ? 1 : 0,
    color: (opacity = 1) => {
      const hex = colors.primary.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
    labelColor: (opacity = 1) => `rgba(${colors.text === '#ffffff' ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    style: { borderRadius: 16 },
    propsForLabels: { fontSize: 10 },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.surface
    },
  };

  const metrics = [
    { 
      title: 'Тренировки', 
      current: currentWeek.count || 0, 
      previous: lastWeek.count || 0,
      metric: 'тренировки',
      format: (val) => `${val}`,
    },
    { 
      title: 'Тоннаж', 
      current: currentWeek.volume || 0, 
      previous: lastWeek.volume || 0,
      metric: 'тоннаж',
      format: (val) => formatWeight(val),
    },
    { 
      title: 'Время', 
      current: currentWeek.duration || 0, 
      previous: lastWeek.duration || 0,
      metric: 'время',
      format: (val) => formatTime(val),
    },
    { 
      title: 'Упражнения', 
      current: currentWeek.exercises || 0, 
      previous: lastWeek.exercises || 0,
      metric: 'упражнения',
      format: (val) => `${val}`,
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }, safeAreaStyle]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>📊 Сравнение</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Анализ прогресса и динамики</Text>
      </View>

      <View style={styles.timeRangeSelector}>
        <TouchableOpacity
          style={[styles.rangeButton, timeRange === 'недели' && [styles.rangeButtonActive, { backgroundColor: colors.primary }]]}
          onPress={() => setTimeRange('недели')}
        >
          <Text style={[styles.rangeButtonText, { color: colors.textSecondary }, timeRange === 'недели' && [styles.rangeButtonTextActive, { color: colors.text }]]}>
            Сравнение недель
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.rangeButton, timeRange === 'месяц' && [styles.rangeButtonActive, { backgroundColor: colors.primary }]]}
          onPress={() => setTimeRange('месяц')}
        >
          <Text style={[styles.rangeButtonText, { color: colors.textSecondary }, timeRange === 'месяц' && [styles.rangeButtonTextActive, { color: colors.text }]]}>
            Прогресс за месяц
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chartSection}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>
          {timeRange === 'недели' ? 'Сравнение недель' : 'Динамика за 4 недели'}
        </Text>
        
        <LineChart
          data={prepareChartData()}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          bezier
          segments={4}
          withDots={true}
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLines={timeRange === 'месяц'}
          withHorizontalLines={true}
          fromZero={true}
        />

        <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>
          {timeRange === 'недели' 
            ? `Сравнение ${selectedMetric} текущей и прошлой недели`
            : `Динамика ${selectedMetric} за последние 4 недели`
          }
        </Text>
      </View>

      <View style={styles.metricsGrid}>
        {metrics.map((item) => {
          const change = calculateChange(item.current, item.previous);
          const isPositive = item.current >= item.previous;
          const isActive = selectedMetric === item.metric;
          
          return (
            <TouchableOpacity
              key={item.metric}
              style={[styles.metricCard, { backgroundColor: colors.card }, isActive && [styles.metricCardActive, { borderColor: colors.primary }]]}
              onPress={() => setSelectedMetric(item.metric)}
            >
              <View style={styles.metricHeader}>
                <Text style={[styles.metricTitle, { color: colors.text }, isActive && styles.metricTitleActive]}>
                  {item.title}
                </Text>
                <View style={[styles.changeBadge, isPositive ? [styles.positiveBadge, { backgroundColor: colors.success }] : [styles.negativeBadge, { backgroundColor: colors.danger }]]}>
                  <Text style={styles.changeText}>
                    {isPositive && item.current > item.previous ? '+' : ''}{change}%
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {item.format(item.current)}
              </Text>
              
              <Text style={[styles.metricPrevious, { color: colors.textSecondary }]}>
                Было: {item.format(item.previous)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.summarySection}>
        <Text style={[styles.summaryTitle, { color: colors.text }]}>📅 Сводка по неделям</Text>
        
        <View style={styles.weekComparison}>
          <View style={[styles.weekCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.weekCardTitle, { color: colors.text }]}>Текущая неделя</Text>
            <View style={styles.weekStats}>
              <View style={styles.weekStat}>
                <Text style={[styles.weekStatValue, { color: colors.text }]}>{currentWeek.count || 0}</Text>
                <Text style={[styles.weekStatLabel, { color: colors.textSecondary }]}>тренировок</Text>
              </View>
              <View style={styles.weekStat}>
                <Text style={[styles.weekStatValue, { color: colors.text }]}>{formatNumber(currentWeek.volume || 0)}</Text>
                <Text style={[styles.weekStatLabel, { color: colors.textSecondary }]}>кг</Text>
              </View>
            </View>
          </View>
          
          <View style={[styles.weekCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.weekCardTitle, { color: colors.text }]}>Прошлая неделя</Text>
            <View style={styles.weekStats}>
              <View style={styles.weekStat}>
                <Text style={[styles.weekStatValue, { color: colors.text }]}>{lastWeek.count || 0}</Text>
                <Text style={[styles.weekStatLabel, { color: colors.textSecondary }]}>тренировок</Text>
              </View>
              <View style={styles.weekStat}>
                <Text style={[styles.weekStatValue, { color: colors.text }]}>{formatNumber(lastWeek.volume || 0)}</Text>
                <Text style={[styles.weekStatLabel, { color: colors.textSecondary }]}>кг</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.insightsCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.insightsTitle, { color: colors.text }]}>📈 Анализ прогресса</Text>
        
        {currentWeek.volume > lastWeek.volume ? (
          <Text style={[styles.insightPositive, { color: colors.success }]}>
            Отличная работа! Вы подняли на {formatNumber(currentWeek.volume - lastWeek.volume)} кг больше, 
            чем на прошлой неделе. Продолжайте в том же духе! 💪
          </Text>
        ) : currentWeek.volume === lastWeek.volume && currentWeek.volume > 0 ? (
          <Text style={[styles.insightNeutral, { color: colors.warning }]}>
            Вы поддерживаете стабильный уровень нагрузки. Для прогресса попробуйте 
            увеличить вес или добавить дополнительные подходы. 🔥
          </Text>
        ) : (
          <Text style={[styles.insightWarning, { color: colors.danger }]}>
            На этой неделе нагрузка снизилась. Рекомендуем вернуться к предыдущему 
            уровню и постепенно увеличивать интенсивность. 🏋️
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginHorizontal: 20,
    marginTop: 15,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  timeRangeSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 4,
  },
  rangeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
  },
  rangeButtonActive: {},
  rangeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  rangeButtonTextActive: {},
  chartSection: {
    padding: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartSubtitle: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  metricCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  metricCardActive: {
    borderWidth: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  metricTitleActive: {
    color: '#0a84ff',
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  positiveBadge: {},
  negativeBadge: {},
  changeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricPrevious: {
    fontSize: 12,
  },
  summarySection: {
    padding: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  weekComparison: {
    flexDirection: 'row',
    gap: 12,
  },
  weekCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  weekCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  weekStats: {
    width: '100%',
  },
  weekStat: {
    alignItems: 'center',
    marginBottom: 12,
  },
  weekStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  weekStatLabel: {
    fontSize: 12,
  },
  insightsCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
  },
  insightsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  insightPositive: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  insightNeutral: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  insightWarning: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
});