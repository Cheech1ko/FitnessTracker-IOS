// src/screens/AddTrainingScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useTrainingContext } from '../context/TrainingContext';

export default function AddTrainingScreen({ navigation }) {
  const { addTraining } = useTrainingContext();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [exercises, setExercises] = useState([]);
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const handleAddExercise = () => {
    if (!exerciseName.trim() || !sets || !reps) {
      Alert.alert('Ошибка', 'Заполните название, подходы и повторения');
      return;
    }

    const newExercise = {
      id: Date.now().toString(),
      name: exerciseName.trim(),
      sets: parseInt(sets) || 0,
      reps: parseInt(reps) || 0,
      weight: weight ? parseFloat(weight) : undefined
    };

    setExercises([...exercises, newExercise]);
    setExerciseName('');
    setSets('');
    setReps('');
    setWeight('');
  };

  const handleRemoveExercise = (id) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const handleSaveTraining = () => {
  if (!title.trim()) {
    Alert.alert('Ошибка', 'Введите название тренировки');
    return;
  }

  const newTraining = {
    id: Date.now().toString(),
    title: title.trim(),
    date: new Date().toISOString(),
    duration: duration ? parseInt(duration) : 0,
    exercises,
    notes: ''
  };

  const success = addTraining(newTraining);
  
  if (success) {
    Alert.alert(
      '✅ Успех!',
      'Тренировка сохранена',
      [
        { 
          text: 'OK', 
          onPress: () => navigation.goBack() 
        }
      ]
    );
  }
};

  // Рассчитать тоннаж упражнения
  const calculateExerciseVolume = (exercise) => {
    return (exercise.sets || 0) * (exercise.reps || 0) * (exercise.weight || 0);
  };

  // Общий тоннаж тренировки
  const totalVolume = exercises.reduce((sum, ex) => sum + calculateExerciseVolume(ex), 0);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Новая тренировка</Text>
          <Text style={styles.headerSubtitle}>Заполните данные ниже</Text>
        </View>

        {/* Основная информация */}
        <View style={styles.card}>
          <Text style={styles.label}>🏷️ Название тренировки</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Например: Силовая тренировка"
            placeholderTextColor="#8e8e93"
            autoFocus
          />

          <Text style={styles.label}>⏱️ Длительность (минуты)</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
            placeholder="45"
            placeholderTextColor="#8e8e93"
            keyboardType="numeric"
          />
        </View>

        {/* Упражнения */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💪 Упражнения</Text>
            <Text style={styles.exerciseCount}>{exercises.length} добавлено</Text>
          </View>

          {/* Форма добавления упражнения */}
          <View style={styles.exerciseForm}>
            <View style={styles.formRow}>
              <TextInput
                style={[styles.input, styles.flexInput]}
                value={exerciseName}
                onChangeText={setExerciseName}
                placeholder="Название упражнения"
                placeholderTextColor="#8e8e93"
              />
            </View>
            
            <View style={styles.formRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Подходы</Text>
                <TextInput
                  style={[styles.input, styles.numberInput]}
                  value={sets}
                  onChangeText={setSets}
                  placeholder="3"
                  placeholderTextColor="#8e8e93"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Повторения</Text>
                <TextInput
                  style={[styles.input, styles.numberInput]}
                  value={reps}
                  onChangeText={setReps}
                  placeholder="10"
                  placeholderTextColor="#8e8e93"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Вес (кг)</Text>
                <TextInput
                  style={[styles.input, styles.numberInput]}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="20"
                  placeholderTextColor="#8e8e93"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddExercise}
            >
              <Text style={styles.addButtonText}>+ Добавить упражнение</Text>
            </TouchableOpacity>
          </View>

          {/* Список добавленных упражнений */}
          {exercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveExercise(exercise.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.exerciseDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Подходы</Text>
                  <Text style={styles.detailValue}>{exercise.sets}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Повторения</Text>
                  <Text style={styles.detailValue}>{exercise.reps}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Вес</Text>
                  <Text style={styles.detailValue}>{exercise.weight || 0} кг</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Тоннаж</Text>
                  <Text style={styles.detailValue}>
                    {calculateExerciseVolume(exercise)} кг
                  </Text>
                </View>
              </View>
            </View>
          ))}

          {/* Итого по тренировке */}
          {exercises.length > 0 && (
            <View style={styles.totalCard}>
              <Text style={styles.totalTitle}>📊 Итого по тренировке</Text>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Всего упражнений:</Text>
                <Text style={styles.totalValue}>{exercises.length}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Общий тоннаж:</Text>
                <Text style={[styles.totalValue, styles.highlight]}>
                  {totalVolume} кг
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Кнопки действий */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSaveTraining}
          >
            <Text style={styles.saveButtonText}>💾 Сохранить тренировку</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Отмена</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#1c1c1e',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8e8e93',
    color: '#8e8e93',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1c1c1e',
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#2c2c2e',
    color: '#fff',
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  flexInput: {
    flex: 1,
  },
  numberInput: {
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  exerciseCount: {
    color: '#0a84ff',
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseForm: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputLabel: {
    color: '#8e8e93',
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#0a84ff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseCard: {
    backgroundColor: '#2c2c2e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  deleteText: {
    color: '#ff3b30',
    fontSize: 20,
    fontWeight: 'bold',
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    color: '#8e8e93',
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  totalCard: {
    backgroundColor: '#2c2c2e',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  totalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    color: '#8e8e93',
    fontSize: 16,
  },
  totalValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  highlight: {
    color: '#34c759',
  },
  actions: {
    padding: 16,
    paddingBottom: 32,
  },
  button: {
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#0a84ff',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  cancelButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
  },
});