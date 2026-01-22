// src/screens/AddTrainingScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTrainingContext } from '../context/TrainingContext';
import { useSafeArea } from '../hooks/useSafeArea';

export default function AddTrainingScreen({ navigation }) {
  const { colors } = useTheme();
  const { addTraining } = useTrainingContext();
  const { safeAreaStyle } = useSafeArea();
  
  const [trainingName, setTrainingName] = useState('');
  const [duration, setDuration] = useState('');
  const [exercises, setExercises] = useState([
    { id: 1, name: '', sets: '', reps: '', weight: '' }
  ]);

  const addExercise = () => {
    setExercises([...exercises, { 
      id: exercises.length + 1, 
      name: '', 
      sets: '', 
      reps: '', 
      weight: '' 
    }]);
  };

  const removeExercise = (id) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter(ex => ex.id !== id));
    }
  };

  const updateExercise = (id, field, value) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const handleSubmit = () => {
    if (!trainingName.trim()) {
      Alert.alert('Ошибка', 'Введите название тренировки');
      return;
    }

    const validExercises = exercises.filter(ex => 
      ex.name.trim() && ex.sets && ex.reps
    );

    if (validExercises.length === 0) {
      Alert.alert('Ошибка', 'Добавьте хотя бы одно упражнение');
      return;
    }

    const newTraining = {
      id: Date.now().toString(),
      name: trainingName.trim(),
      date: new Date().toISOString(),
      duration: parseInt(duration) || 0,
      exercises: validExercises.map(ex => ({
        name: ex.name.trim(),
        sets: parseInt(ex.sets) || 0,
        reps: parseInt(ex.reps) || 0,
        weight: parseFloat(ex.weight) || 0
      }))
    };

    addTraining(newTraining);
    Alert.alert('Успешно', 'Тренировка добавлена!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={[styles.scrollView, safeAreaStyle]}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Новая тренировка</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Заполните данные о тренировке
          </Text>
        </View>

        {/* Основная информация */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Основная информация</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Название тренировки</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.surfaceLight,
                color: colors.text,
                borderColor: colors.border
              }]}
              value={trainingName}
              onChangeText={setTrainingName}
              placeholder="Например: Силовая тренировка"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Длительность (минуты)</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.surfaceLight,
                color: colors.text,
                borderColor: colors.border
              }]}
              value={duration}
              onChangeText={setDuration}
              placeholder="60"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Упражнения */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Упражнения</Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={addExercise}
            >
              <Text style={styles.addButtonText}>+ Добавить</Text>
            </TouchableOpacity>
          </View>

          {exercises.map((exercise, index) => (
            <View 
              key={exercise.id} 
              style={[styles.exerciseCard, { 
                backgroundColor: colors.surfaceLight,
                borderColor: colors.border
              }]}
            >
              <View style={styles.exerciseHeader}>
                <Text style={[styles.exerciseNumber, { color: colors.text }]}>
                  Упражнение {index + 1}
                </Text>
                {exercises.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeExercise(exercise.id)}
                    style={[styles.removeButton, { backgroundColor: colors.danger }]}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.exerciseInputs}>
                <View style={styles.inputRow}>
                  <Text style={[styles.smallLabel, { color: colors.text }]}>Название</Text>
                  <TextInput
                    style={[styles.smallInput, { 
                      backgroundColor: colors.card,
                      color: colors.text,
                      borderColor: colors.border
                    }]}
                    value={exercise.name}
                    onChangeText={(value) => updateExercise(exercise.id, 'name', value)}
                    placeholder="Жим лежа"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputColumn}>
                    <Text style={[styles.smallLabel, { color: colors.text }]}>Подходы</Text>
                    <TextInput
                      style={[styles.smallInput, { 
                        backgroundColor: colors.card,
                        color: colors.text,
                        borderColor: colors.border
                      }]}
                      value={exercise.sets}
                      onChangeText={(value) => updateExercise(exercise.id, 'sets', value)}
                      placeholder="3"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.inputColumn}>
                    <Text style={[styles.smallLabel, { color: colors.text }]}>Повторения</Text>
                    <TextInput
                      style={[styles.smallInput, { 
                        backgroundColor: colors.card,
                        color: colors.text,
                        borderColor: colors.border
                      }]}
                      value={exercise.reps}
                      onChangeText={(value) => updateExercise(exercise.id, 'reps', value)}
                      placeholder="10"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.inputColumn}>
                    <Text style={[styles.smallLabel, { color: colors.text }]}>Вес (кг)</Text>
                    <TextInput
                      style={[styles.smallInput, { 
                        backgroundColor: colors.card,
                        color: colors.text,
                        borderColor: colors.border
                      }]}
                      value={exercise.weight}
                      onChangeText={(value) => updateExercise(exercise.id, 'weight', value)}
                      placeholder="50"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Кнопки действий */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.border }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>Отмена</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
          >
            <Text style={styles.saveButtonText}>Сохранить тренировку</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    marginHorizontal: 20,
    marginTop: 15,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  exerciseCard: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseInputs: {
    gap: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputColumn: {
    flex: 1,
  },
  smallLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  smallInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});