// src/screens/HomeScreen.js - ПОЛНЫЙ КОД
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { useTrainingContext } from '../context/TrainingContext';
import moment from 'moment';
import 'moment/locale/ru';

const { width } = Dimensions.get('window');
moment.locale('ru');

// Кастомный круговой прогресс-бар (упрощенный)
const CircularProgress = ({ value, maxValue, color = '#0a84ff', label }) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const size = width * 0.25;
  
  return (
    <View style={styles.circularContainer}>
      <View style={[styles.circleOuter, { width: size, height: size }]}>
        <View style={[
          styles.circleInner, 
          { 
            width: size * 0.85, 
            height: size * 0.85,
            borderRadius: (size * 0.85) / 2
          }
        ]}>
          <Text style={styles.circleValue}>{value}</Text>
          <Text style={styles.circleLabel}>{label}</Text>
        </View>
      </View>
      
      {/* Простой прогресс индикатор */}
      <View style={styles.progressIndicator}>
        <View style={[
          styles.progressFill,
          { 
            width: `${percentage}%`,
            backgroundColor: color 
          }
        ]} />
      </View>
    </View>
  );
};

export default function HomeScreen({ navigation }) {
  const { trainings, getStats } = useTrainingContext();
  const stats = getStats();
  const weeklyStats = stats.week;

  // Форматирование
  const formatTime = (minutes) => {
    if (!minutes || isNaN(minutes)) return '0';
    const mins = parseInt(minutes);
    return mins < 60 ? `${mins}м` : `${Math.floor(mins / 60)}ч`;
  };

  const formatWeight = (kg) => {
    if (!kg || isNaN(kg)) return '0кг';
    const weight = parseInt(kg);
    return weight < 1000 ? `${weight}кг` : `${(weight / 1000).toFixed(1)}т`;
  };

  // Тренировки сегодня
  const todayTrainings = trainings.filter(t => 
    moment(t.date).isSame(moment(), 'day')
  );
  const todayVolume = todayTrainings.reduce((sum, t) => sum + (t.totalVolume || 0), 0);
  const todayDuration = todayTrainings.reduce((sum, t) => sum + (t.duration || 0), 0);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={styles.date}>{moment().format('dddd, D MMMM')}</Text>
          <Text style={styles.title}>Тренировки</Text>
        </View>

        {/* Круговые прогресс-бары */}
        <View style={styles.circlesRow}>
          <CircularProgress 
            value={weeklyStats.count}
            maxValue={5}
            color="#0a84ff"
            label="Тренировок"
          />
          <CircularProgress 
            value={formatTime(weeklyStats.duration)}
            maxValue="120м"
            color="#34c759"
            label="Время"
          />
          <CircularProgress 
            value={formatWeight(weeklyStats.volume)}
            maxValue="5000кг"
            color="#ff9500"
            label="Тоннаж"
          />
        </View>

        {/* Быстрые действия */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionAdd]}
            onPress={() => navigation.navigate('AddTraining')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>➕ Новая</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.actionStats]}
            onPress={() => navigation.navigate('Stats')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>📊 Статистика</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.actionHistory]}
            onPress={() => navigation.navigate('History')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>📋 История</Text>
          </TouchableOpacity>
        </View>

        {/* Статистика за сегодня */}
        <View style={styles.todayStats}>
          <Text style={styles.sectionTitle}>Сегодня</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{todayTrainings.length}</Text>
              <Text style={styles.statLabel}>Тренировок</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{formatWeight(todayVolume)}</Text>
              <Text style={styles.statLabel}>Тоннаж</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{formatTime(todayDuration)}</Text>
              <Text style={styles.statLabel}>Время</Text>
            </View>
          </View>
        </View>

        {/* Последние тренировки */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Последние тренировки</Text>
            {trainings.length > 0 && (
              <TouchableOpacity onPress={() => navigation.navigate('History')}>
                <Text style={styles.seeAll}>Все →</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {trainings.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>🏋️</Text>
              <Text style={styles.emptyText}>Нет тренировок</Text>
              <Text style={styles.emptySubtext}>Начните свою первую тренировку</Text>
              <TouchableOpacity
                style={styles.addFirstButton}
                onPress={() => navigation.navigate('AddTraining')}
                activeOpacity={0.7}
              >
                <Text style={styles.addFirstButtonText}>➕ Добавить первую</Text>
              </TouchableOpacity>
            </View>
          ) : (
            trainings.slice(0, 3).map((training) => (
              <TouchableOpacity
                key={training.id}
                style={styles.trainingCard}
                onPress={() => navigation.navigate('TrainingDetails', { training })}
                activeOpacity={0.7}
              >
                <View style={styles.trainingHeader}>
                  <Text style={styles.trainingTitle} numberOfLines={1}>
                    {training.title}
                  </Text>
                  <Text style={styles.trainingTime}>
                    {moment(training.date).format('HH:mm')}
                  </Text>
                </View>
                <View style={styles.trainingDetails}>
                  <Text style={styles.trainingExercises}>
                    {training.exercises.length} упр. • {formatWeight(training.totalVolume || 0)}
                  </Text>
                  <Text style={styles.trainingDuration}>
                    {training.duration || 0} мин
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Мотивация */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationIcon}>💪</Text>
          <Text style={styles.motivationText}>
            {trainings.length === 0 
              ? 'Сделайте первый шаг к своим целям!' 
              : todayTrainings.length === 0
              ? 'Сегодня ещё не было тренировок. Самое время начать!'
              : 'Отличная работа сегодня! Продолжайте в том же духе! 🎯'
            }
          </Text>
        </View>
      </ScrollView>

      {/* Плавающая кнопка + (поверх TabBar) */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddTraining')}
        activeOpacity={0.7}
      >
        <Text style={styles.floatingButtonIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Место для плавающей кнопки и TabBar
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#1c1c1e',
  },
  date: {
    fontSize: 16,
    color: '#8e8e93',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  circlesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#1c1c1e',
    borderTopWidth: 1,
    borderTopColor: '#2c2c2e',
  },
  circularContainer: {
    alignItems: 'center',
  },
  circleOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  circleInner: {
    backgroundColor: '#2c2c2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  circleLabel: {
    fontSize: 12,
    color: '#8e8e93',
    marginTop: 2,
  },
  progressIndicator: {
    width: '100%',
    height: 4,
    backgroundColor: '#2c2c2e',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c1e',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: width * 0.25,
  },
  actionAdd: {
    backgroundColor: '#0a84ff',
  },
  actionStats: {
    backgroundColor: '#34c759',
  },
  actionHistory: {
    backgroundColor: '#5856d6',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  todayStats: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    color: '#0a84ff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8e8e93',
  },
  recentSection: {
    padding: 20,
    paddingTop: 0,
  },
  emptyCard: {
    backgroundColor: '#1c1c1e',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 20,
  },
  addFirstButton: {
    backgroundColor: '#0a84ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    marginRight: 12,
  },
  trainingTime: {
    fontSize: 14,
    color: '#8e8e93',
  },
  trainingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trainingExercises: {
    fontSize: 14,
    color: '#8e8e93',
  },
  trainingDuration: {
    fontSize: 14,
    color: '#ff9500',
    fontWeight: '600',
  },
  motivationCard: {
    margin: 20,
    backgroundColor: '#1c1c1e',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  motivationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  motivationText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
    lineHeight: 22,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 80, // Над TabBar
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#0a84ff',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  floatingButtonIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
});