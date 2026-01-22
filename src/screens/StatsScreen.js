// src/screens/StatsScreen.js - ИСПРАВЛЕННАЯ ВЕРСИЯ
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useTrainingContext } from '../context/TrainingContext';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StatsScreen() {
  const { trainings, getStats, getWeeklyChartData } = useTrainingContext();
  const { colors, theme } = useTheme();
  const stats = getStats();
  const weeklyStats = stats.week;
  const allStats = stats.all;
  const [selectedMetric, setSelectedMetric] = useState('тренировки');
  const [chartType, setChartType] = useState('line');
  const insets = useSafeAreaInsets();

  const weeklyChartData = getWeeklyChartData();
  const screenWidth = Dimensions.get('window').width;

  // Форматирование
  const formatTime = (minutes) => {
    if (!minutes || isNaN(minutes)) return '0 мин';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours} ч ${mins} мин`;
    return `${mins} мин`;
  };

  const formatWeight = (kg) => {
    if (!kg || isNaN(kg)) return '0 кг';
    if (kg >= 1000) return `${(kg / 1000).toFixed(1)} т`;
    return `${kg} кг`;
  };

  // Подготовка данных для графика
  const prepareChartData = () => {
    const dataPoints = weeklyChartData.map(item => {
      if (selectedMetric === 'тренировки') return item.тренировки;
      if (selectedMetric === 'тоннаж') return Math.round(item.тоннаж / 100) / 10;
      if (selectedMetric === 'время') return Math.round(item.время / 60);
      return 0;
    });

    return {
      labels: weeklyChartData.map(item => item.day),
      datasets: [{
        data: dataPoints,
        color: (opacity = 1) => {
          const metricColors = {
            'тренировки': colors.primary,
            'тоннаж': colors.secondary,
            'время': colors.warning
          };
          const color = metricColors[selectedMetric] || colors.primary;
          // Извлекаем RGB из hex цвета
          const hex = color.replace('#', '');
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        },
        strokeWidth: 3
      }]
    };
  };

  // Конфиг графика с учетом темы
  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: selectedMetric === 'тоннаж' ? 1 : 0,
    color: (opacity = 1) => {
      const metricColors = {
        'тренировки': colors.primary,
        'тоннаж': colors.secondary,
        'время': colors.warning
      };
      const color = metricColors[selectedMetric] || colors.primary;
      const hex = color.replace('#', '');
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
    propsForBackgroundLines: {
      stroke: colors.border,
      strokeWidth: 1,
    }
  };

  // Расчет средних значений
  const getMetricInfo = () => {
    const total = weeklyChartData.reduce((sum, item) => {
      if (selectedMetric === 'тренировки') return sum + item.тренировки;
      if (selectedMetric === 'тоннаж') return sum + item.тоннаж;
      if (selectedMetric === 'время') return sum + item.время;
      return sum;
    }, 0);

    const avg = weeklyChartData.length > 0 ? total / weeklyChartData.length : 0;
    
    return {
      'тренировки': {
        unit: 'тренировок',
        format: (val) => Math.round(val),
        total: weeklyStats.count || 0,
        avg: Math.round(avg)
      },
      'тоннаж': {
        unit: 'кг',
        format: (val) => formatWeight(val),
        total: weeklyStats.volume || 0,
        avg: Math.round(avg)
      },
      'время': {
        unit: 'мин',
        format: (val) => formatTime(val),
        total: weeklyStats.duration || 0,
        avg: Math.round(avg)
      }
    }[selectedMetric];
  };

  const metricInfo = getMetricInfo();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background,
    paddingTop: insets.top, // Вот это для челки
    paddingBottom: insets.bottom }]}>
      {/* Заголовок */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>📊 Статистика</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Ваши результаты и прогресс
        </Text>
      </View>

      {/* Общая статистика */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>🎯 Общая статистика</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statNumber, { color: colors.text }]}>{allStats.count || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Всего тренировок</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statNumber, { color: colors.text }]}>{allStats.exercises || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Всего упражнений</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statNumber, { color: colors.text }]}>{formatWeight(allStats.volume || 0)}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Общий тоннаж</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statNumber, { color: colors.text }]}>{formatTime(allStats.duration || 0)}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Общее время</Text>
          </View>
        </View>
      </View>

      {/* Динамика за неделю */}
      <View style={styles.section}>
        <View style={styles.chartHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📈 Динамика за неделю</Text>
          <View style={[styles.chartTypeSelector, { backgroundColor: colors.surfaceLight }]}>
            <TouchableOpacity
              style={[
                styles.chartTypeButton, 
                chartType === 'line' && [styles.chartTypeActive, { backgroundColor: colors.secondary }]
              ]}
              onPress={() => setChartType('line')}
            >
              <Text style={[
                styles.chartTypeText, 
                { color: colors.textSecondary },
                chartType === 'line' && [styles.chartTypeTextActive, { color: colors.text }]
              ]}>
                Линия
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chartTypeButton, 
                chartType === 'bar' && [styles.chartTypeActive, { backgroundColor: colors.secondary }]
              ]}
              onPress={() => setChartType('bar')}
            >
              <Text style={[
                styles.chartTypeText, 
                { color: colors.textSecondary },
                chartType === 'bar' && [styles.chartTypeTextActive, { color: colors.text }]
              ]}>
                Столбцы
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Выбор метрики */}
        <View style={[styles.metricSelector, { backgroundColor: colors.surfaceLight }]}>
          {['тренировки', 'тоннаж', 'время'].map(metric => (
            <TouchableOpacity
              key={metric}
              onPress={() => setSelectedMetric(metric)}
              style={[
                styles.metricButton,
                selectedMetric === metric && [styles.metricButtonActive, { backgroundColor: colors.primary }]
              ]}
            >
              <Text style={[
                styles.metricButtonText,
                { color: colors.textSecondary },
                selectedMetric === metric && [styles.metricButtonTextActive, { color: colors.text }]
              ]}>
                {metric}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* График */}
        {weeklyChartData.some(item => item.тренировки > 0 || item.тоннаж > 0 || item.время > 0) ? (
          <View>
            {chartType === 'line' ? (
              <LineChart
                data={prepareChartData()}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                style={{ marginVertical: 8, borderRadius: 16 }}
                bezier
                segments={4}
                withDots={true}
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLines={true}
                withHorizontalLines={true}
                withShadow={false}
              />
            ) : (
              <BarChart
                data={prepareChartData()}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                style={{ marginVertical: 8, borderRadius: 16 }}
                showValuesOnTopOfBars={true}
                fromZero={true}
              />
            )}
            
            {/* Статистика под графиком */}
            <View style={[styles.chartStats, { backgroundColor: colors.card }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statItemLabel, { color: colors.textSecondary }]}>Всего за неделю:</Text>
                <Text style={[styles.statItemValue, { color: colors.text }]}>
                  {metricInfo.format(metricInfo.total)} {metricInfo.unit}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statItemLabel, { color: colors.textSecondary }]}>В среднем за день:</Text>
                <Text style={[styles.statItemValue, { color: colors.text }]}>
                  {metricInfo.format(metricInfo.avg)} {selectedMetric === 'время' ? 'мин' : metricInfo.unit}
                </Text>
              </View>
            </View>
            
            <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>
              Динамика {selectedMetric} по дням недели
            </Text>
          </View>
        ) : (
          <View style={[styles.noDataContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.noDataText, { color: colors.text }]}>📊 Нет данных за последнюю неделю</Text>
            <Text style={[styles.noDataSubtext, { color: colors.textSecondary }]}>
              Добавьте тренировки, чтобы увидеть график
            </Text>
          </View>
        )}
      </View>

      {/* Прогресс недели */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>📈 Прогресс недели</Text>
        <View style={[styles.progressCard, { backgroundColor: colors.card }]}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { color: colors.text }]}>Цель: 3 тренировок в неделю</Text>
            <Text style={[styles.progressValue, { color: colors.success }]}>
              {weeklyStats.count || 0} / 3
            </Text>
          </View>
          
          <View style={[styles.progressBarContainer, { backgroundColor: colors.surfaceLight }]}>
            <View 
              style={[
                styles.progressBar,
                { 
                  width: `${Math.min(((weeklyStats.count || 0) / 3) * 100, 100)}%`,
                  backgroundColor: colors.success
                }
              ]} 
            />
          </View>
          
          <Text style={[styles.progressPercent, { color: colors.success }]}>
            {Math.round(((weeklyStats.count || 0) / 3) * 100)}%
          </Text>

          <View style={styles.progressFooter}>
            {(weeklyStats.count || 0) >= 3 ? (
              <Text style={[styles.successText, { color: colors.success }]}>
                🎉 Цель достигнута! Так держать!
              </Text>
            ) : (
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Осталось {3 - (weeklyStats.count || 0)} тренировок до цели
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Если нет тренировок */}
      {trainings.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyIcon, { color: colors.text }]}>📈</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Нет данных для статистики</Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Добавьте первую тренировку, чтобы увидеть статистику
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

// Стили без цветов - цвета задаются динамически
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTypeSelector: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 4,
  },
  chartTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chartTypeActive: {
    // Цвет задается динамически
  },
  chartTypeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartTypeTextActive: {
    // Цвет задается динамически
  },
  metricSelector: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 4,
    marginBottom: 16,
  },
  metricButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  metricButtonActive: {
    // Цвет задается динамически
  },
  metricButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  metricButtonTextActive: {
    // Цвет задается динамически
  },
  chartStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statItemLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statItemValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  chartSubtitle: {
    textAlign: 'center',
    fontSize: 12,
  },
  noDataContainer: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 16,
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  progressCard: {
    padding: 20,
    borderRadius: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressFooter: {
    marginTop: 8,
  },
  successText: {
    fontSize: 14,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});