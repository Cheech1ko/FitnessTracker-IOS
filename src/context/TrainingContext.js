// src/context/TrainingContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TrainingContext = createContext();

export const TrainingProvider = ({ children }) => {
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    loadTrainings();
  }, []);

  useEffect(() => {
    saveTrainings();
  }, [trainings]);

  const loadTrainings = async () => {
    try {
      const json = await AsyncStorage.getItem('@trainings');
      if (json) {
        const loadedTrainings = JSON.parse(json);
        // Миграция старых данных (если нужно)
        const migratedTrainings = loadedTrainings.map(training => {
          // Если у тренировки старая структура, обновляем её
          if (!training.totalVolume && training.exercises) {
            return {
              ...training,
              totalVolume: calculateTotalVolume(training.exercises)
            };
          }
          return training;
        });
        setTrainings(migratedTrainings);
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  const saveTrainings = async () => {
    try {
      await AsyncStorage.setItem('@trainings', JSON.stringify(trainings));
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  };

  // Добавить тренировку (обновленная функция)
  const addTraining = (training) => {
    try {
      const trainingWithVolume = {
        ...training,
        totalVolume: calculateTotalVolume(training.exercises),
        totalSets: calculateTotalSets(training.exercises),
        totalReps: calculateTotalReps(training.exercises),
        averageWeight: calculateAverageWeight(training.exercises)
      };
      
      setTrainings(prev => [trainingWithVolume, ...prev]);
      return true;
    } catch (error) {
      console.error('Ошибка при добавлении тренировки:', error);
      return false;
    }
  };

  // Удалить тренировку
  const deleteTraining = (id) => {
    setTrainings(prev => prev.filter(t => t.id !== id));
    return true;
  };

  // Очистить все тренировки
  const clearAllTrainings = () => {
    setTrainings([]);
    return true;
  };

  // Рассчитать общий тоннаж (обновленная функция для новой структуры)
  const calculateTotalVolume = (exercises) => {
    return exercises.reduce((total, exercise) => {
      const exerciseVolume = exercise.sets.reduce((exerciseSum, set) => {
        return exerciseSum + (set.weight * set.reps);
      }, 0);
      return total + exerciseVolume;
    }, 0);
  };

  // Рассчитать общее количество подходов
  const calculateTotalSets = (exercises) => {
    return exercises.reduce((total, exercise) => {
      return total + exercise.sets.length;
    }, 0);
  };

  // Рассчитать общее количество повторений
  const calculateTotalReps = (exercises) => {
    return exercises.reduce((total, exercise) => {
      return total + exercise.sets.reduce((sum, set) => sum + set.reps, 0);
    }, 0);
  };

  // Рассчитать средний вес
  const calculateAverageWeight = (exercises) => {
    const totalWeight = exercises.reduce((total, exercise) => {
      return total + exercise.sets.reduce((sum, set) => sum + set.weight, 0);
    }, 0);
    
    const totalSets = calculateTotalSets(exercises);
    return totalSets > 0 ? totalWeight / totalSets : 0;
  };

  // Получить упражнение по ID
  const getExerciseById = (exerciseId) => {
    // Здесь можно добавить логику поиска в библиотеке упражнений
    return null;
  };

  // Получить статистику (обновленная)
  const getStats = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const allTrainings = trainings;
    const weekTrainings = trainings.filter(t => new Date(t.date) >= oneWeekAgo);

    const totalVolume = allTrainings.reduce((sum, t) => sum + (t.totalVolume || 0), 0);
    const weekVolume = weekTrainings.reduce((sum, t) => sum + (t.totalVolume || 0), 0);

    return {
      all: {
        count: allTrainings.length,
        exercises: allTrainings.reduce((sum, t) => sum + t.exercises.length, 0),
        sets: allTrainings.reduce((sum, t) => sum + (t.totalSets || 0), 0),
        reps: allTrainings.reduce((sum, t) => sum + (t.totalReps || 0), 0),
        duration: allTrainings.reduce((sum, t) => sum + (t.duration || 0), 0),
        volume: totalVolume,
        averageWeight: allTrainings.length > 0 
          ? allTrainings.reduce((sum, t) => sum + (t.averageWeight || 0), 0) / allTrainings.length 
          : 0
      },
      week: {
        count: weekTrainings.length,
        exercises: weekTrainings.reduce((sum, t) => sum + t.exercises.length, 0),
        sets: weekTrainings.reduce((sum, t) => sum + (t.totalSets || 0), 0),
        reps: weekTrainings.reduce((sum, t) => sum + (t.totalReps || 0), 0),
        duration: weekTrainings.reduce((sum, t) => sum + (t.duration || 0), 0),
        volume: weekVolume,
        averageWeight: weekTrainings.length > 0 
          ? weekTrainings.reduce((sum, t) => sum + (t.averageWeight || 0), 0) / weekTrainings.length 
          : 0
      }
    };
  };

  // Получить статистику по категориям
  const getCategoryStats = () => {
    const categoryMap = {};
    
    trainings.forEach(training => {
      const categoryId = training.category?.id || 'other';
      const categoryName = training.category?.name || 'Другое';
      
      if (!categoryMap[categoryId]) {
        categoryMap[categoryId] = {
          id: categoryId,
          name: categoryName,
          count: 0,
          totalVolume: 0,
          totalDuration: 0
        };
      }
      
      categoryMap[categoryId].count += 1;
      categoryMap[categoryId].totalVolume += training.totalVolume || 0;
      categoryMap[categoryId].totalDuration += training.duration || 0;
    });
    
    return Object.values(categoryMap);
  };

  // Сравнение недель (обновленная)
  const getWeeklyComparison = () => {
    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());
    
    const lastWeekStart = new Date(currentWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    
    const getWeekData = (startDate) => {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);
      
      const weekTrainings = trainings.filter(t => {
        const date = new Date(t.date);
        return date >= startDate && date < endDate;
      });

      return {
        count: weekTrainings.length,
        volume: weekTrainings.reduce((sum, t) => sum + (t.totalVolume || 0), 0),
        duration: weekTrainings.reduce((sum, t) => sum + (t.duration || 0), 0),
        exercises: weekTrainings.reduce((sum, t) => sum + t.exercises.length, 0),
        sets: weekTrainings.reduce((sum, t) => sum + (t.totalSets || 0), 0),
        reps: weekTrainings.reduce((sum, t) => sum + (t.totalReps || 0), 0)
      };
    };

    return {
      currentWeek: getWeekData(currentWeekStart),
      lastWeek: getWeekData(lastWeekStart)
    };
  };

  // Вспомогательная функция для получения последних 7 дней
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  // Данные для недельного графика (обновленная)
  const getWeeklyChartData = () => {
    const last7Days = getLast7Days();
    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    
    const chartData = daysOfWeek.map(day => ({ 
      day, 
      тренировки: 0, 
      тоннаж: 0, 
      время: 0,
      подходы: 0,
      повторения: 0
    }));

    trainings.forEach(training => {
      const trainingDate = new Date(training.date);
      
      const dayIndex = last7Days.findIndex(day => 
        day.toDateString() === trainingDate.toDateString()
      );
      
      if (dayIndex !== -1) {
        const dayOfWeekIndex = trainingDate.getDay();
        const chartIndex = dayOfWeekIndex === 0 ? 6 : dayOfWeekIndex - 1;
        
        chartData[chartIndex].тренировки += 1;
        chartData[chartIndex].тоннаж += training.totalVolume || 0;
        chartData[chartIndex].время += training.duration || 0;
        chartData[chartIndex].подходы += training.totalSets || 0;
        chartData[chartIndex].повторения += training.totalReps || 0;
      }
    });

    return chartData;
  };

  // Данные для месячного графика (обновленная)
  const getMonthlyComparisonData = () => {
    const weeklyData = [];
    const now = new Date();
    
    for (let week = 3; week >= 0; week--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (week * 7) - now.getDay());
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      
      const weekTrainings = trainings.filter(t => {
        const date = new Date(t.date);
        return date >= weekStart && date < weekEnd;
      });
      
      weeklyData.push({
        неделя: `Неделя ${4 - week}`,
        тренировки: weekTrainings.length,
        тоннаж: weekTrainings.reduce((sum, t) => sum + (t.totalVolume || 0), 0),
        время: weekTrainings.reduce((sum, t) => sum + (t.duration || 0), 0),
        подходы: weekTrainings.reduce((sum, t) => sum + (t.totalSets || 0), 0),
        повторения: weekTrainings.reduce((sum, t) => sum + (t.totalReps || 0), 0)
      });
    }
    
    return weeklyData;
  };

  // Получить все тренировки определенной категории
  const getTrainingsByCategory = (categoryId) => {
    return trainings.filter(t => t.category?.id === categoryId);
  };

  // Получить прогресс по конкретному упражнению
  const getExerciseProgress = (exerciseId) => {
    const exerciseTrainings = [];
    
    trainings.forEach(training => {
      const exercise = training.exercises.find(ex => ex.id === exerciseId);
      if (exercise) {
        exerciseTrainings.push({
          date: training.date,
          name: training.name,
          sets: exercise.sets,
          totalVolume: exercise.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0),
          maxWeight: Math.max(...exercise.sets.map(set => set.weight)),
          totalReps: exercise.sets.reduce((sum, set) => sum + set.reps, 0)
        });
      }
    });
    
    return exerciseTrainings.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  return (
    <TrainingContext.Provider
      value={{
        trainings,
        addTraining,
        deleteTraining,
        clearAllTrainings,
        getStats,
        getCategoryStats,
        getWeeklyComparison,
        getWeeklyChartData,
        getMonthlyComparisonData,
        getTrainingsByCategory,
        getExerciseProgress,
        getExerciseById
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
};

export const useTrainingContext = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTrainingContext must be used within TrainingProvider');
  }
  return context;
};

export default TrainingContext;