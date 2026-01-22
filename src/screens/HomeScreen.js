import React, { useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrainingContext from '../context/TrainingContext';
import CircularProgress from '../components/CircularProgress';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeArea } from '../hooks/useSafeArea';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = ({ navigation }) => {
  const trainingContext = useContext(TrainingContext);
  const { safeAreaStyle } = useSafeArea();
  const { colors } = useTheme();
  
  // Функция для получения тренировок за текущую неделю
  const getWeekTrainings = () => {
    const trainings = trainingContext?.trainings || [];
    const now = new Date();
    
    // Определяем начало текущей недели (понедельник)
    const startOfWeek = new Date(now);
    const day = now.getDay(); // 0 - воскресенье, 1 - понедельник...
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Корректировка, чтобы неделя начиналась с понедельника
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0); // Начало дня
    
    // Определяем конец текущей недели (воскресенье)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999); // Конец дня
    
    // Фильтруем тренировки текущей недели
    return trainings.filter(training => {
      const trainingDate = new Date(training.date);
      return trainingDate >= startOfWeek && trainingDate <= endOfWeek;
    });
  };
  
  // Получаем статистику за текущую неделю
  const weekTrainingsData = getWeekTrainings();
  
  // Рассчитываем недельную статистику
  const weekTrainings = weekTrainingsData.length;
  const weekTime = weekTrainingsData.reduce((total, training) => 
    total + (training.duration || 0), 0
  );
  const weekTonnage = weekTrainingsData.reduce((total, training) => 
    total + (training.totalVolume || 0), 0
  );

  // Получаем сегодняшнюю статистику
  const today = new Date().toISOString().split('T')[0];
  const allTrainings = trainingContext?.trainings || [];
  
  const todayTrainings = allTrainings.filter(training => {
    const trainingDate = new Date(training.date).toISOString().split('T')[0];
    return trainingDate === today;
  });
  
  const todayTonnage = todayTrainings.reduce((total, training) => 
    total + (training.totalVolume || 0), 0
  );

  // Форматирование даты начала и конца недели для отображения
  const getWeekRangeText = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const formatDate = (date) => date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short' 
    });
    
    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, safeAreaStyle]}
      >
        {/* Верхняя часть - дата и время */}
        <View style={styles.header}>
          <Text style={[styles.timeText, { color: colors.text }]}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            {new Date().toLocaleDateString('ru-RU', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </Text>
        </View>

        {/* Круговые прогресс бары */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Текущая неделя</Text>
            <Text style={[styles.weekRange, { color: colors.textSecondary }]}>
              {getWeekRangeText()}
            </Text>
          </View>
          
          <View style={styles.progressRow}>
            <CircularProgress
              size={100}
              progress={(weekTrainings / 3) * 100}
              color="#32D74B"
              label={weekTrainings.toString()}
              unit="тренировок"
              maxValue={3}
            />
            
            <CircularProgress
              size={100}
              progress={(weekTime / 420) * 100} // 7 часов = 420 минут
              color="#0A84FF"
              label={`${Math.floor(weekTime / 60)}ч ${weekTime % 60}м`}
              unit="время"
              maxValue={420}
            />
            
            <CircularProgress
              size={100}
              progress={(weekTonnage / 15000) * 100} // 15 тонн
              color="#FF9F0A"
              label={`${(weekTonnage / 1000).toFixed(1)}т`}
              unit="тоннаж"
              maxValue={15000}
            />
          </View>
          
          {/* Индикатор сброса */}
          <View style={[styles.resetIndicator, { backgroundColor: colors.surfaceLight }]}>
            <Text style={[styles.resetText, { color: colors.textSecondary }]}>
              📅 Сброс каждое воскресенье
            </Text>
          </View>
        </View>

        {/* Карточка "Сегодня" */}
        <TouchableOpacity 
          style={[styles.todayCard, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('AddTraining')}
          activeOpacity={0.7}
        >
          <View style={styles.todayHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Сегодня</Text>
            <View style={[styles.startButton, { backgroundColor: colors.primary }]}>
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.startButtonText}>Добавить</Text>
            </View>
          </View>
          
          <View style={styles.todayStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{todayTrainings.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Тренировок</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {todayTonnage >= 1000 
                  ? `${(todayTonnage / 1000).toFixed(1)}т` 
                  : `${todayTonnage}кг`
                }
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Тоннаж</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Последние тренировки */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Последние тренировки</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>Все →</Text>
            </TouchableOpacity>
          </View>
          
          {allTrainings.length > 0 ? (
            <View style={styles.trainingsList}>
              {allTrainings.slice(0, 3).map((training) => (
                <TouchableOpacity 
                  key={training.id}
                  style={[styles.trainingItem, { backgroundColor: colors.surface }]}
                  onPress={() => navigation.navigate('TrainingDetails', { training })}
                >
                  <View style={styles.trainingHeader}>
                    <Text style={[styles.trainingName, { color: colors.text }]}>
                      {training.name || 'Тренировка'}
                    </Text>
                    <Text style={[styles.trainingTime, { color: colors.textSecondary }]}>
                      {new Date(training.date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </Text>
                  </View>
                  <Text style={[styles.trainingDetails, { color: colors.textSecondary }]}>
                    {training.exercises?.length || 0} упр. • {training.totalVolume ? `${(training.totalVolume / 1000).toFixed(1)}т` : '0кг'}
                  </Text>
                  <Text style={[styles.trainingDuration, { color: colors.textSecondary }]}>
                    {training.duration ? `${training.duration} мин` : 'Без времени'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="barbell-outline" size={50} color={colors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: colors.text }]}>
                Ещё нет тренировок
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                Добавьте первую тренировку!
              </Text>
            </View>
          )}
        </View>
        
        {/* Добавляем отступ для TabBar */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
  },
  timeText: {
    fontSize: 32,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weekRange: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resetIndicator: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetText: {
    fontSize: 12,
    fontWeight: '500',
  },
  todayCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 25,
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  startButton: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  todayStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: '500',
  },
  trainingsList: {
    marginTop: 10,
  },
  trainingItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  trainingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trainingName: {
    fontSize: 18,
    fontWeight: '600',
  },
  trainingTime: {
    fontSize: 14,
  },
  trainingDetails: {
    fontSize: 14,
    marginBottom: 4,
  },
  trainingDuration: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default HomeScreen;