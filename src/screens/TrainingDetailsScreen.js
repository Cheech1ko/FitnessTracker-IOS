// src/screens/TrainingDetailsScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

export default function TrainingDetailsScreen({ route }) {
  const { training } = route.params || {};

  if (!training) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Тренировка не найдена</Text>
      </View>
    );
  }

  const formatDate = (dateString) => {
    return moment(dateString).format('dddd, D MMMM YYYY, HH:mm');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{training.title}</Text>
        <Text style={styles.date}>{formatDate(training.date)}</Text>
        <Text style={styles.duration}>
          Длительность: {training.duration || 0} минут
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Упражнения</Text>
        {training.exercises.length === 0 ? (
          <Text style={styles.emptyExercises}>Нет упражнений</Text>
        ) : (
          training.exercises.map((exercise, index) => (
            <View key={exercise.id || index} style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <View style={styles.exerciseDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Подходы</Text>
                  <Text style={styles.detailValue}>{exercise.sets}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Повторения</Text>
                  <Text style={styles.detailValue}>{exercise.reps}</Text>
                </View>
                {exercise.weight && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Вес</Text>
                    <Text style={styles.detailValue}>{exercise.weight} кг</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </View>

      {training.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Заметки</Text>
          <View style={styles.notesCard}>
            <Text style={styles.notesText}>{training.notes}</Text>
          </View>
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
    padding: 20,
    backgroundColor: '#1c1c1e',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#8e8e93',
    marginBottom: 4,
  },
  duration: {
    fontSize: 16,
    color: '#0a84ff',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  exerciseCard: {
    backgroundColor: '#1c1c1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#8e8e93',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyExercises: {
    color: '#8e8e93',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  notesCard: {
    backgroundColor: '#1c1c1e',
    padding: 16,
    borderRadius: 12,
  },
  notesText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});