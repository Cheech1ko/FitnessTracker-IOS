// src/screens/ComparisonScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import { useTrainingContext } from '../context/TrainingContext';

export default function ComparisonScreen() {
  const { getWeeklyComparison } = useTrainingContext();
  const comparison = getWeeklyComparison();
  const { currentWeek, lastWeek } = comparison;

  // Форматирование чисел
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  // Рассчитать процент изменения
  const calculateChange = (current, previous) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const metrics = [
    { 
      title: 'Тренировок', 
      current: currentWeek.count, 
      previous: lastWeek.count,
      icon: '🏋️' 
    },
    { 
      title: 'Тоннаж (кг)', 
      current: currentWeek.volume, 
      previous: lastWeek.volume,
      icon: '⚖️' 
    },
    { 
      title: 'Время (мин)', 
      current: currentWeek.duration, 
      previous: lastWeek.duration,
      icon: '⏱️' 
    },
    { 
      title: 'Упражнений', 
      current: currentWeek.exercises, 
      previous: lastWeek.exercises,
      icon: '💪' 
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Сравнение недель</Text>
        <Text style={styles.headerSubtitle}>Текущая неделя vs Прошлая неделя</Text>
      </View>

      {/* Сводка */}
      <View style={styles.summaryCard}>
        <View style={styles.weekColumn}>
          <Text style={styles.weekTitle}>Текущая неделя</Text>
          <Text style={styles.weekData}>{currentWeek.count} тренировок</Text>
          <Text style={styles.weekVolume}>{formatNumber(currentWeek.volume)} кг</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.weekColumn}>
          <Text style={styles.weekTitle}>Прошлая неделя</Text>
          <Text style={styles.weekData}>{lastWeek.count} тренировок</Text>
          <Text style={styles.weekVolume}>{formatNumber(lastWeek.volume)} кг</Text>
        </View>
      </View>

      {/* Метрики */}
      <View style={styles.metricsContainer}>
        {metrics.map((metric, index) => {
          const change = calculateChange(metric.current, metric.previous);
          const isPositive = metric.current >= metric.previous;
          
          return (
            <View key={index} style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricIcon}>{metric.icon}</Text>
                <Text style={styles.metricTitle}>{metric.title}</Text>
              </View>
              
              <View style={styles.metricValues}>
                <View style={styles.valueColumn}>
                  <Text style={styles.valueLabel}>Текущая</Text>
                  <Text style={styles.value}>{formatNumber(metric.current)}</Text>
                </View>
                
                <View style={styles.valueColumn}>
                  <Text style={styles.valueLabel}>Прошлая</Text>
                  <Text style={styles.value}>{formatNumber(metric.previous)}</Text>
                </View>
                
                <View style={styles.valueColumn}>
                  <Text style={styles.valueLabel}>Изменение</Text>
                  <Text style={[
                    styles.change, 
                    isPositive ? styles.positive : styles.negative
                  ]}>
                    {isPositive ? '+' : ''}{change}%
                  </Text>
                </View>
              </View>
              
              {/* Прогресс бар */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBackground}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${Math.min((metric.current / Math.max(metric.previous, 1)) * 50, 100)}%`,
                        backgroundColor: isPositive ? '#34c759' : '#ff3b30'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {isPositive ? 'Рост' : 'Снижение'} на {Math.abs(change)}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Вывод */}
      <View style={styles.insightsCard}>
        <Text style={styles.insightsTitle}>💡 Анализ прогресса</Text>
        
        {currentWeek.volume > lastWeek.volume ? (
          <Text style={styles.insightPositive}>
            Отличная работа! Вы подняли на {formatNumber(currentWeek.volume - lastWeek.volume)} кг больше, чем на прошлой неделе. 
            Продолжайте в том же духе! 💪
          </Text>
        ) : (
          <Text style={styles.insightWarning}>
            На этой неделе нагрузка снизилась. Рекомендуем увеличить интенсивность 
            или добавить дополнительные тренировки. 🔥
          </Text>
        )}
        
        <Text style={styles.insightTip}>
          💪 Совет: Старайтесь увеличивать тоннаж на 5-10% каждую неделю для 
          стабильного прогресса.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 24,
    backgroundColor: '#1c1c1e',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    margin: 16,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weekColumn: {
    flex: 1,
    alignItems: 'center',
  },
  weekTitle: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 8,
    textAlign: 'center',
  },
  weekData: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  weekVolume: {
    fontSize: 20,
    color: '#0a84ff',
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: '#2c2c2e',
    marginHorizontal: 20,
  },
  metricsContainer: {
    padding: 16,
  },
  metricCard: {
    backgroundColor: '#1c1c1e',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  metricTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  metricValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  valueColumn: {
    alignItems: 'center',
    flex: 1,
  },
  valueLabel: {
    fontSize: 12,
    color: '#8e8e93',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  change: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  positive: {
    color: '#34c759',
  },
  negative: {
    color: '#ff3b30',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#2c2c2e',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#8e8e93',
    textAlign: 'center',
  },
  insightsCard: {
    backgroundColor: '#1c1c1e',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
  },
  insightsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  insightPositive: {
    color: '#34c759',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  insightWarning: {
    color: '#ff9500',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  insightTip: {
    color: '#0a84ff',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});