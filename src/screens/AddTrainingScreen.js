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
  Platform,
  Modal,
  FlatList
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTrainingContext } from '../context/TrainingContext';
import { useSafeArea } from '../hooks/useSafeArea';
import { exerciseCategories } from '../utils/exercises';

export default function AddTrainingScreen({ navigation }) {
  const { colors } = useTheme();
  const { addTraining } = useTrainingContext();
  const { safeAreaStyle } = useSafeArea();
  
  const [trainingName, setTrainingName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);

  const [exercises, setExercises] = useState([]);

  // Добавление упражнения из библиотеки
  const addExerciseFromLibrary = (exercise) => {
    const newExercise = {
      id: Date.now().toString(),
      name: exercise.name,
      exerciseId: exercise.id,
      category: exercise.category || currentCategory?.id,
      sets: [
        {
          id: 1,
          weight: '',
          reps: '',
          isCompleted: false
        }
      ]
    };
    
    setExercises([...exercises, newExercise]);
    setSelectedExercises([...selectedExercises, exercise.id]);
    setShowExerciseModal(false);
  };

  // Добавление нового подхода к упражнению
  const addSet = (exerciseId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: [...ex.sets, {
            id: ex.sets.length + 1,
            weight: '',
            reps: '',
            isCompleted: false
          }]
        };
      }
      return ex;
    }));
  };

  // Удаление подхода
  const removeSet = (exerciseId, setId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId && ex.sets.length > 1) {
        return {
          ...ex,
          sets: ex.sets.filter(s => s.id !== setId)
        };
      }
      return ex;
    }));
  };

  // Обновление данных подхода
  const updateSet = (exerciseId, setId, field, value) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(set => 
            set.id === setId ? { ...set, [field]: value } : set
          )
        };
      }
      return ex;
    }));
  };

  // Удаление упражнения
  const removeExercise = (exerciseId) => {
    const exerciseToRemove = exercises.find(ex => ex.id === exerciseId);
    if (exerciseToRemove) {
      setSelectedExercises(selectedExercises.filter(id => id !== exerciseToRemove.exerciseId));
    }
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
  };

  // Валидация и сохранение тренировки
  const handleSubmit = () => {
    // Проверка названия
    if (!trainingName.trim()) {
      Alert.alert('Ошибка', 'Введите название тренировки');
      return;
    }

    // Проверка типа тренировки
    if (!category) {
      Alert.alert('Ошибка', 'Выберите тип тренировки');
      return;
    }

    // Проверка упражнений
    if (exercises.length === 0) {
      Alert.alert('Ошибка', 'Добавьте хотя бы одно упражнение');
      return;
    }

    // Проверка заполненности подходов
    for (const exercise of exercises) {
      for (const set of exercise.sets) {
        if (!set.weight || !set.reps) {
          Alert.alert('Ошибка', `Заполните все подходы для упражнения "${exercise.name}"`);
          return;
        }
      }
    }

    // Создание новой тренировки
    const newTraining = {
      id: Date.now().toString(),
      name: trainingName.trim(),
      date: new Date().toISOString(),
      duration: parseInt(duration) || 0,
      category: {
        id: category.id,
        name: category.name
      },
      exercises: exercises.map(ex => ({
        id: ex.exerciseId,
        name: ex.name,
        category: ex.category,
        sets: ex.sets.map((set, index) => ({
          number: index + 1,
          weight: parseFloat(set.weight) || 0,
          reps: parseInt(set.reps) || 0,
          isCompleted: false
        }))
      }))
    };

    // Добавление тренировки и возврат
    const success = addTraining(newTraining);
    if (success) {
      Alert.alert(
        'Успешно', 
        'Тренировка добавлена!',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack()
          }
        ]
      );
    } else {
      Alert.alert('Ошибка', 'Не удалось сохранить тренировку');
    }
  };

  // Рендер элемента категории
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryItem, { 
        backgroundColor: colors.card,
        borderColor: colors.border
      }]}
      onPress={() => {
        setCategory(item);
        setCurrentCategory(item);
        setShowCategoryModal(false);
        if (item.subCategories) {
          setShowExerciseModal(true);
        }
      }}
    >
      <View style={styles.categoryContent}>
        <Text style={[styles.categoryText, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.categorySubtext, { color: colors.textSecondary }]}>
          {item.exercises ? `${item.exercises.length} упражнений` : 
           item.subCategories ? 'Выберите подкатегорию' : ''}
        </Text>
      </View>
      <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
    </TouchableOpacity>
  );

  // Рендер элемента упражнения
  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.exerciseItem, { 
        backgroundColor: selectedExercises.includes(item.id) 
          ? colors.primary + '20' 
          : colors.card,
        borderColor: selectedExercises.includes(item.id) 
          ? colors.primary 
          : colors.border
      }]}
      onPress={() => addExerciseFromLibrary(item)}
      disabled={selectedExercises.includes(item.id)}
    >
      <View style={styles.exerciseContent}>
        <Text style={[styles.exerciseText, { 
          color: selectedExercises.includes(item.id) 
            ? colors.primary 
            : colors.text 
        }]}>
          {item.name}
        </Text>
        {item.muscleGroup && (
          <Text style={[styles.muscleGroup, { color: colors.textSecondary }]}>
            {item.muscleGroup}
          </Text>
        )}
      </View>
      {selectedExercises.includes(item.id) && (
        <View style={[styles.selectedBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.selectedText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // Рендер элемента подкатегории
  const renderSubCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.subCategoryItem, { 
        backgroundColor: colors.card,
        borderColor: colors.border
      }]}
      onPress={() => {
        setCurrentCategory(item);
      }}
    >
      <View style={styles.categoryContent}>
        <Text style={[styles.categoryText, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.categorySubtext, { color: colors.textSecondary }]}>
          {item.exercises?.length || 0} упражнений
        </Text>
      </View>
      <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
    </TouchableOpacity>
  );

  // Кнопка назад для модального окна
  const renderModalBackButton = () => {
    if (currentCategory?.id === category?.id) return null;
    
    return (
      <TouchableOpacity
        style={styles.modalBackButton}
        onPress={() => {
          if (currentCategory?.id && currentCategory.id !== category?.id) {
            setCurrentCategory(category);
          } else {
            setShowExerciseModal(false);
          }
        }}
      >
        <Text style={[styles.modalBackText, { color: colors.primary }]}>‹ Назад</Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={[styles.scrollView, safeAreaStyle]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Новая тренировка</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Заполните данные о тренировке
          </Text>
        </View>

        {/* Основная информация */}
        <View style={[styles.section, { 
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Основная информация
          </Text>
          
          {/* Название тренировки */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Название тренировки
            </Text>
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

          {/* Тип тренировки */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Тип тренировки
            </Text>
            <TouchableOpacity
              style={[styles.pickerButton, { 
                backgroundColor: colors.surfaceLight,
                borderColor: colors.border
              }]}
              onPress={() => setShowCategoryModal(true)}
            >
              <View style={styles.pickerContent}>
                <Text style={{ 
                  color: category ? colors.text : colors.textSecondary,
                  fontSize: 16
                }}>
                  {category ? category.name : 'Выберите тип тренировки'}
                </Text>
                <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Длительность */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Длительность (минуты)
            </Text>
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
        <View style={[styles.section, { 
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3
        }]}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Упражнения
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                {exercises.length} добавлено
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                if (category) {
                  setCurrentCategory(category);
                  setShowExerciseModal(true);
                } else {
                  Alert.alert('Внимание', 'Сначала выберите тип тренировки');
                  setShowCategoryModal(true);
                }
              }}
            >
              <Text style={styles.addButtonText}>+ Добавить</Text>
            </TouchableOpacity>
          </View>

          {/* Список упражнений */}
          {exercises.map((exercise, index) => (
            <View 
              key={exercise.id} 
              style={[styles.exerciseCard, { 
                backgroundColor: colors.surfaceLight,
                borderColor: colors.border
              }]}
            >
              {/* Заголовок упражнения */}
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseTitleContainer}>
                  <View style={[styles.exerciseNumberBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                  </View>
                  <View>
                    <Text style={[styles.exerciseName, { color: colors.text }]}>
                      {exercise.name}
                    </Text>
                    {exercise.category && (
                      <Text style={[styles.exerciseCategory, { color: colors.textSecondary }]}>
                        {exercise.category}
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => removeExercise(exercise.id)}
                  style={[styles.removeButton, { backgroundColor: colors.danger + '20' }]}
                >
                  <Text style={[styles.removeButtonText, { color: colors.danger }]}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Список подходов */}
              {exercise.sets.map((set, setIndex) => (
                <View key={set.id} style={styles.setContainer}>
                  <View style={styles.setHeader}>
                    <View style={styles.setNumberContainer}>
                      <View style={[styles.setNumberBadge, { backgroundColor: colors.primary + '30' }]}>
                        <Text style={[styles.setNumberText, { color: colors.primary }]}>
                          {setIndex + 1}
                        </Text>
                      </View>
                      <Text style={[styles.setLabel, { color: colors.text }]}>
                        Подход
                      </Text>
                    </View>
                    {exercise.sets.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeSet(exercise.id, set.id)}
                        style={[styles.removeSetButton, { borderColor: colors.border }]}
                      >
                        <Text style={[styles.removeSetText, { color: colors.textSecondary }]}>
                          Удалить
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  {/* Поля ввода для подхода */}
                  <View style={styles.setInputs}>
                    <View style={styles.inputColumn}>
                      <Text style={[styles.smallLabel, { color: colors.text }]}>
                        Вес (кг)
                      </Text>
                      <TextInput
                        style={[styles.smallInput, { 
                          backgroundColor: colors.card,
                          color: colors.text,
                          borderColor: colors.border
                        }]}
                        value={set.weight}
                        onChangeText={(value) => updateSet(exercise.id, set.id, 'weight', value)}
                        placeholder="50"
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="decimal-pad"
                      />
                    </View>

                    <View style={styles.inputColumn}>
                      <Text style={[styles.smallLabel, { color: colors.text }]}>
                        Повторения
                      </Text>
                      <TextInput
                        style={[styles.smallInput, { 
                          backgroundColor: colors.card,
                          color: colors.text,
                          borderColor: colors.border
                        }]}
                        value={set.reps}
                        onChangeText={(value) => updateSet(exercise.id, set.id, 'reps', value)}
                        placeholder="10"
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>
              ))}

              {/* Кнопка добавления подхода */}
              <TouchableOpacity
                style={[styles.addSetButton, { borderColor: colors.primary }]}
                onPress={() => addSet(exercise.id)}
              >
                <Text style={[styles.addSetText, { color: colors.primary }]}>
                  + Добавить подход
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Сообщение если нет упражнений */}
          {exercises.length === 0 && (
            <View style={[styles.emptyState, { backgroundColor: colors.surfaceLight }]}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                Добавьте упражнения из библиотеки
              </Text>
              <TouchableOpacity
                style={[styles.emptyStateButton, { borderColor: colors.primary }]}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={[styles.emptyStateButtonText, { color: colors.primary }]}>
                  Выбрать упражнения
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Кнопки действий */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.cancelButton, { 
              borderColor: colors.border,
              backgroundColor: colors.card
            }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>
              Отмена
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.saveButton, { 
              backgroundColor: exercises.length > 0 ? colors.primary : colors.disabled 
            }]}
            onPress={handleSubmit}
            disabled={exercises.length === 0}
          >
            <Text style={styles.saveButtonText}>
              Сохранить тренировку
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Модальное окно выбора категории */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Выберите тип тренировки
              </Text>
              <TouchableOpacity 
                onPress={() => setShowCategoryModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={[styles.modalCloseText, { color: colors.textSecondary }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={exerciseCategories}
              renderItem={renderCategoryItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.modalList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Модальное окно выбора упражнений */}
      <Modal
        visible={showExerciseModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowExerciseModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              {renderModalBackButton()}
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {currentCategory?.name || 'Выберите упражнения'}
              </Text>
              <TouchableOpacity 
                onPress={() => setShowExerciseModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={[styles.modalCloseText, { color: colors.textSecondary }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            
            {currentCategory?.subCategories ? (
              <FlatList
                data={currentCategory.subCategories}
                renderItem={renderSubCategoryItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.modalList}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <FlatList
                data={currentCategory?.exercises || []}
                renderItem={renderExerciseItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.modalList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyModalState}>
                    <Text style={[styles.emptyModalText, { color: colors.textSecondary }]}>
                      Нет доступных упражнений
                    </Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
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
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  pickerButton: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  pickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chevron: {
    fontSize: 20,
    fontWeight: '300',
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  exerciseCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  exerciseTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  exerciseNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  exerciseCategory: {
    fontSize: 14,
    fontWeight: '500',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  removeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  setContainer: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  setHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  setNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  setNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  setNumberText: {
    fontSize: 14,
    fontWeight: '700',
  },
  setLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  removeSetButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  removeSetText: {
    fontSize: 13,
    fontWeight: '500',
  },
  setInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  inputColumn: {
    flex: 1,
  },
  smallLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  smallInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  addSetButton: {
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginTop: 8,
  },
  addSetText: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyState: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  emptyStateButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
  // Стили для модальных окон
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    minHeight: 64,
  },
  modalBackButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  modalBackText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  modalCloseButton: {
    position: 'absolute',
    right: 20,
    zIndex: 1,
  },
  modalCloseText: {
    fontSize: 24,
    fontWeight: '300',
  },
  modalList: {
    padding: 20,
  },
  categoryItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryContent: {
    flex: 1,
  },
  categoryText: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  categorySubtext: {
    fontSize: 14,
    fontWeight: '400',
  },
  subCategoryItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseText: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  muscleGroup: {
    fontSize: 14,
    fontWeight: '400',
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyModalState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyModalText: {
    fontSize: 16,
    fontWeight: '500',
  },
});