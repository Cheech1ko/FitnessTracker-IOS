// src/screens/HistoryScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTrainingContext } from '../context/TrainingContext';
import { useSafeArea } from '../hooks/useSafeArea';

export default function HistoryScreen({ navigation }) {
  const { trainings, deleteTraining } = useTrainingContext();
  const { colors } = useTheme();
  const { safeAreaStyle } = useSafeArea();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (minutes) => {
    if (!minutes) return '0 мин';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours} ч ${mins} мин`;
    return `${mins} мин`;
  };

  const formatWeight = (kg) => {
    if (!kg) return '0 кг';
    if (kg >= 1000) return `${(kg / 1000).toFixed(1)} т`;
    return `${kg} кг`;
  };

  const handleDelete = (id, name) => {
    Alert.alert(
      'Удалить тренировку',
      `Удалить "${name}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => deleteTraining(id)
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }, safeAreaStyle]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>📝 История</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Все тренировки: {trainings.length}
        </Text>
      </View>

      <View style={styles.listContainer}>
        {trainings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyIcon, { color: colors.textSecondary }]}>📊</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Нет завершенных тренировок
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Добавьте первую тренировку
            </Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('AddTraining')}
            >
              <Text style={styles.addButtonText}>➕ Добавить тренировку</Text>
            </TouchableOpacity>
          </View>
        ) : (
          trainings.map((training) => (
            <TouchableOpacity
              key={training.id}
              style={[styles.trainingCard, { 
                backgroundColor: colors.card,
                borderColor: colors.border
              }]}
              onPress={() => navigation.navigate('TrainingDetails', { training })}
              onLongPress={() => handleDelete(training.id, training.name || 'Тренировка')}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <Text style={[styles.trainingName, { color: colors.text }]}>
                    {training.name || 'Тренировка'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleDelete(training.id, training.name || 'Тренировка')}
                    style={styles.deleteButton}
                  >
                    <Text style={[styles.deleteText, { color: colors.danger }]}>✕</Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.trainingDate, { color: colors.textSecondary }]}>
                  {formatDate(training.date)}
                </Text>
              </View>

              <View style={styles.cardStats}>
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Упражнения
                  </Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {training.exercises?.length || 0}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Время
                  </Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {formatTime(training.duration)}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Тоннаж
                  </Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {formatWeight(training.totalVolume)}
                  </Text>
                </View>
              </View>

              {training.exercises && training.exercises.length > 0 && (
                <View style={styles.exercisesPreview}>
                  <Text style={[styles.exercisesLabel, { color: colors.textSecondary }]}>
                    Упражнения:
                  </Text>
                  <Text style={[styles.exercisesList, { color: colors.text }]} numberOfLines={1}>
                    {training.exercises.map(e => e.name).join(', ')}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))
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
  listContainer: {
    padding: 20,
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
    marginBottom: 24,
  },
  addButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  trainingCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  trainingName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  deleteText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  trainingDate: {
    fontSize: 14,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  exercisesPreview: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 12,
  },
  exercisesLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  exercisesList: {
    fontSize: 14,
  },
});