// src/screens/HistoryScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { useTrainingContext } from '../context/TrainingContext';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

export default function HistoryScreen({ navigation }) {
  const { trainings, deleteTraining } = useTrainingContext();

  const formatDate = (dateString) => {
    return moment(dateString).format('D MMMM YYYY, HH:mm');
  };
  const handleDeleteTraining = (id, title) => {
  Alert.alert(
    'Удалить тренировку',
    `Удалить "${title}"?`,
    [
      { text: 'Отмена', style: 'cancel' },
      { 
        text: 'Удалить', 
        style: 'destructive',
        onPress: () => {
          const success = deleteTraining(id);
          if (success) {
            Alert.alert('✅ Удалено', 'Тренировка удалена');
          }
        }
      }
    ]
  );
};
  const renderTrainingItem = ({ item }) => (
    <TouchableOpacity
      style={styles.trainingCard}
      onPress={() => navigation.navigate('TrainingDetails', { training: item })}
    >
      <View style={styles.trainingHeader}>
        <Text style={styles.trainingTitle}>{item.title}</Text>
        <TouchableOpacity
          onPress={() => deleteTraining(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>×</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.trainingDate}>{formatDate(item.date)}</Text>
      <Text style={styles.trainingDetails}>
        {item.exercises.length} упражнений • {item.duration || 0} мин
      </Text>
      
      <View style={styles.exercisePreview}>
        {item.exercises.slice(0, 3).map((exercise, index) => (
          <View key={index} style={styles.exerciseChip}>
            <Text style={styles.exerciseChipText}>{exercise.name}</Text>
          </View>
        ))}
        {item.exercises.length > 3 && (
          <View style={styles.moreChip}>
            <Text style={styles.moreText}>+{item.exercises.length - 3}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>История тренировок</Text>
        <Text style={styles.headerSubtitle}>
          Всего тренировок: {trainings.length}
        </Text>
      </View>

      {trainings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>История пуста</Text>
          <Text style={styles.emptyText}>
            Здесь появятся все ваши тренировки
          </Text>
          <TouchableOpacity
  onPress={() => handleDeleteTraining(item.id, item.title)}
  style={styles.deleteButton}
>
  <Text style={styles.deleteText}>🗑️</Text>
</TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddTraining')}
          >
            <Text style={styles.addButtonText}>Добавить первую тренировку</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={trainings}
          renderItem={renderTrainingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
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
  },
  list: {
    padding: 16,
  },
  trainingCard: {
    backgroundColor: '#1c1c1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  trainingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trainingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  deleteText: {
    color: '#ff3b30',
    fontSize: 24,
    fontWeight: 'bold',
  },
  trainingDate: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 8,
  },
  trainingDetails: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 12,
  },
  exercisePreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exerciseChip: {
    backgroundColor: '#2c2c2e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  exerciseChipText: {
    color: '#fff',
    fontSize: 12,
  },
  moreChip: {
    backgroundColor: '#0a84ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  moreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#0a84ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});