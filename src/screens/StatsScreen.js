// src/screens/StatsScreen.js - ИСПРАВЛЕННАЯ ВЕРСИЯ
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTrainingContext } from '../context/TrainingContext';

export default function StatsScreen() {
  const { trainings, getStats } = useTrainingContext();
  const stats = getStats();
  const weeklyStats = stats.week;
  const allStats = stats.all;

  // Форматирование времени
  const formatTime = (minutes) => {
    if (!minutes) return '0 мин';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} ч ${mins} мин`;
    }
    return `${mins} мин`;
  };

  // Форматирование веса
  const formatWeight = (kg) => {
    if (kg >= 1000) {
      return `${(kg / 1000).toFixed(1)} т`;
    }
    return `${kg} кг`;
  };

  // Самые частые упражнения
  const exerciseFrequency = {};
  trainings.forEach(training => {
    training.exercises.forEach(exercise => {
      exerciseFrequency[exercise.name] = (exerciseFrequency[exercise.name] || 0) + 1;
    });
  });

  const mostCommonExercises = Object.entries(exerciseFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <ScrollView style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Статистика</Text>
        <Text style={styles.headerSubtitle}>Ваши результаты и прогресс</Text>
      </View>

      {/* Общая статистика */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Общая статистика</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{allStats.count}</Text>
            <Text style={styles.statLabel}>Всего тренировок</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{allStats.exercises}</Text>
            <Text style={styles.statLabel}>Всего упражнений</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{formatWeight(allStats.volume)}</Text>
            <Text style={styles.statLabel}>Общий тоннаж</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{formatTime(allStats.duration)}</Text>
            <Text style={styles.statLabel}>Общее время</Text>
          </View>
        </View>
      </View>

      {/* Недельная статистика */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Статистика за неделю</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.primaryCard]}>
            <Text style={styles.statNumber}>{weeklyStats.count}</Text>
            <Text style={styles.statLabel}>Тренировок</Text>
            <Text style={styles.statSubtext}>Цель: 5 в неделю</Text>
          </View>
          <View style={[styles.statCard, styles.secondaryCard]}>
            <Text style={styles.statNumber}>{weeklyStats.exercises}</Text>
            <Text style={styles.statLabel}>Упражнений</Text>
            <Text style={styles.statSubtext}>
              {weeklyStats.count > 0 ? `${Math.round(weeklyStats.exercises / weeklyStats.count)} в среднем` : ''}
            </Text>
          </View>
          <View style={[styles.statCard, styles.tertiaryCard]}>
            <Text style={styles.statNumber}>{formatTime(weeklyStats.duration)}</Text>
            <Text style={styles.statLabel}>Время</Text>
            <Text style={styles.statSubtext}>
              {weeklyStats.count > 0 ? `${Math.round(weeklyStats.duration / weeklyStats.count)} мин/тренировка` : ''}
            </Text>
          </View>
          <View style={[styles.statCard, styles.volumeCard]}>
            <Text style={styles.statNumber}>{formatWeight(weeklyStats.volume)}</Text>
            <Text style={styles.statLabel}>Тоннаж</Text>
            <Text style={styles.statSubtext}>
              {weeklyStats.count > 0 ? `${Math.round(weeklyStats.volume / weeklyStats.count)} кг/тренировка` : ''}
            </Text>
          </View>
        </View>
      </View>

      {/* Популярные упражнения */}
      {mostCommonExercises.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Самые частые упражнения</Text>
          <View style={styles.exerciseList}>
            {mostCommonExercises.map(([name, count], index) => (
              <View key={name} style={styles.exerciseItem}>
                <View style={styles.exerciseRank}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{name}</Text>
                  <Text style={styles.exerciseCount}>{count} выполнений</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Прогресс недели */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Прогресс недели</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Цель: 5 тренировок в неделю</Text>
            <Text style={styles.progressValue}>
              {weeklyStats.count} / 5
            </Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar,
                { width: `${Math.min((weeklyStats.count / 5) * 100, 100)}%` }
              ]} 
            />
          </View>
          
          <Text style={styles.progressPercent}>
            {Math.round((weeklyStats.count / 5) * 100)}%
          </Text>

          <View style={styles.progressFooter}>
            {weeklyStats.count >= 5 ? (
              <Text style={styles.successText}>🎉 Цель достигнута! Так держать!</Text>
            ) : (
              <Text style={styles.infoText}>
                Осталось {5 - weeklyStats.count} тренировок до цели
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Если нет тренировок */}
      {trainings.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📈</Text>
          <Text style={styles.emptyTitle}>Нет данных для статистики</Text>
          <Text style={styles.emptySubtext}>
            Добавьте первую тренировку, чтобы увидеть статистику
          </Text>
        </View>
      )}
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
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
    backgroundColor: '#1c1c1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  primaryCard: {
    backgroundColor: '#0a84ff',
  },
  secondaryCard: {
    backgroundColor: '#34c759',
  },
  tertiaryCard: {
    backgroundColor: '#ff9500',
  },
  volumeCard: {
    backgroundColor: '#5856d6',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  statSubtext: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  exerciseList: {
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    overflow: 'hidden',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  exerciseRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0a84ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  exerciseCount: {
    color: '#8e8e93',
    fontSize: 14,
  },
  progressCard: {
    backgroundColor: '#1c1c1e',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  progressValue: {
    color: '#34c759',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#2c2c2e',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#34c759',
    borderRadius: 4,
  },
  progressPercent: {
    color: '#34c759',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressFooter: {
    marginTop: 8,
  },
  successText: {
    color: '#34c759',
    fontSize: 14,
    textAlign: 'center',
  },
  infoText: {
    color: '#8e8e93',
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
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8e8e93',
    textAlign: 'center',
  },
});