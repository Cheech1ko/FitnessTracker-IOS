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
        setTrainings(JSON.parse(json));
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

  // Добавить тренировку
  const addTraining = (training) => {
    const trainingWithVolume = {
      ...training,
      totalVolume: calculateTotalVolume(training.exercises)
    };
    setTrainings(prev => [trainingWithVolume, ...prev]);
    return true;
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

  // Рассчитать тоннаж
  const calculateTotalVolume = (exercises) => {
    return exercises.reduce((total, exercise) => {
      const weight = exercise.weight || 0;
      return total + (exercise.sets * exercise.reps * weight);
    }, 0);
  };

  // Получить статистику
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
        duration: allTrainings.reduce((sum, t) => sum + (t.duration || 0), 0),
        volume: totalVolume
      },
      week: {
        count: weekTrainings.length,
        exercises: weekTrainings.reduce((sum, t) => sum + t.exercises.length, 0),
        duration: weekTrainings.reduce((sum, t) => sum + (t.duration || 0), 0),
        volume: weekVolume
      }
    };
  };

  // Сравнение недель
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
        exercises: weekTrainings.reduce((sum, t) => sum + t.exercises.length, 0)
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

  // Данные для недельного графика
  const getWeeklyChartData = () => {
    const last7Days = getLast7Days();
    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    
    const chartData = daysOfWeek.map(day => ({ 
      day, 
      тренировки: 0, 
      тоннаж: 0, 
      время: 0 
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
      }
    });

    return chartData;
  };

  // Данные для месячного графика
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
        время: weekTrainings.reduce((sum, t) => sum + (t.duration || 0), 0)
      });
    }
    
    return weeklyData;
  };

  return (
    <TrainingContext.Provider
      value={{
        trainings,
        addTraining,
        deleteTraining,
        clearAllTrainings,
        getStats,
        getWeeklyComparison,
        getWeeklyChartData,
        getMonthlyComparisonData
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