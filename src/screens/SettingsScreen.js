import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Switch,
  Dimensions
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTrainingContext } from '../context/TrainingContext';
import { useSafeArea } from '../hooks/useSafeArea';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function SettingsScreen({ navigation }) {
  const { theme, toggleTheme, colors, themeOptions, themeNames, isAnimating } = useTheme();
  const { clearAllTrainings } = useTrainingContext();
  const { safeAreaStyle } = useSafeArea();
  const [notifications, setNotifications] = useState(true);
  
  // Анимация нажатия на кнопку темы
  const [themeScale] = useState(new Animated.Value(1));
  
  const animateThemePress = (themeKey) => {
    if (isAnimating || theme === themeKey) return;
    
    // Анимация нажатия
    Animated.sequence([
      Animated.timing(themeScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(themeScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Запускаем переключение темы
      toggleTheme(themeKey);
    });
  };

  const handleClearData = () => {
    Alert.alert(
      'Очистка данных',
      'Вы уверены, что хотите удалить все тренировки?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => {
            clearAllTrainings();
            Alert.alert('Готово', 'Все данные удалены');
          }
        }
      ]
    );
  };

  // Функции-заглушки для будущих фич
  const handleExportData = () => {
    Alert.alert('Скоро', 'Экспорт данных появится в следующем обновлении');
  };

  const handleAbout = () => {
    Alert.alert(
      'О приложении',
      'FitnessTracker v1.0\nТрекер тренировок с анимированным переключением тем',
      [{ text: 'Закрыть' }]
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, safeAreaStyle]}
    >
      {/* Заголовок */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>⚙️ Настройки</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Персонализируйте приложение
        </Text>
      </View>

      {/* Внешний вид */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>🎨 Внешний вид</Text>
        
        <View style={[styles.themeSelector, { backgroundColor: colors.surfaceLight }]}>
          {themeOptions.map((themeOption) => (
            <Animated.View
              key={themeOption}
              style={[
                { transform: [{ scale: themeScale }] }
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  { 
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                  theme === themeOption && [styles.themeOptionActive, { 
                    borderColor: colors.primary,
                  }]
                ]}
                onPress={() => animateThemePress(themeOption)}
                disabled={isAnimating}
                activeOpacity={0.7}
              >
                <View style={styles.themeContent}>
                  {/* Иконка темы */}
                  <View style={[
                    styles.themeIcon,
                    { 
                      backgroundColor: themeOption === 'dark' ? '#1c1c1e' : '#ffffff',
                      borderColor: colors.border,
                    }
                  ]}>
                    {themeOption === 'dark' ? (
                      <Ionicons name="moon" size={20} color="#ffffff" />
                    ) : (
                      <Ionicons name="sunny" size={20} color="#ff9500" />
                    )}
                  </View>
                  
                  <View style={styles.themeInfo}>
                    <Text style={[
                      styles.themeName,
                      { color: colors.text },
                      theme === themeOption && { color: colors.primary }
                    ]}>
                      {themeNames[themeOption]}
                    </Text>
                    <Text style={[styles.themeDescription, { color: colors.textSecondary }]}>
                      {themeOption === 'dark' && 'Тёмный интерфейс для ночного использования'}
                      {themeOption === 'light' && 'Светлый интерфейс для дневного времени'}
                    </Text>
                  </View>
                </View>
                
                {theme === themeOption && (
                  <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
          
          {/* Индикатор анимации */}
          {isAnimating && (
            <View style={[styles.animationIndicator, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.animationText, { color: colors.primary }]}>
                ⏳ Меняем тему...
              </Text>
            </View>
          )}
        </View>

        {/* Уведомления */}
        <View style={[styles.settingsCard, { backgroundColor: colors.surface }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="notifications-outline" size={20} color={colors.primary} />
              </View>
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Уведомления</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Напоминания о тренировках и целях
                </Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={notifications ? colors.primary : colors.textSecondary}
              disabled={isAnimating}
            />
          </View>
        </View>
      </View>

      {/* Данные */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>📊 Данные</Text>
        
        <TouchableOpacity
          style={[styles.settingsCard, { backgroundColor: colors.surface }]}
          onPress={handleExportData}
          disabled={isAnimating}
          activeOpacity={0.7}
        >
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: colors.success + '20' }]}>
                <Ionicons name="download-outline" size={20} color={colors.success} />
              </View>
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Экспорт данных</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Сохранить все тренировки
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingsCard, { backgroundColor: colors.surface }]}
          onPress={handleClearData}
          disabled={isAnimating}
          activeOpacity={0.7}
        >
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: colors.danger + '20' }]}>
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </View>
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: colors.danger }]}>Очистить все данные</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Удалить тренировки и статистику
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.danger} />
          </View>
        </TouchableOpacity>
      </View>

      {/* О приложении */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>ℹ️ О приложении</Text>
        
        <TouchableOpacity
          style={[styles.settingsCard, { backgroundColor: colors.surface }]}
          onPress={handleAbout}
          disabled={isAnimating}
          activeOpacity={0.7}
        >
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, { backgroundColor: colors.secondary + '20' }]}>
                <Ionicons name="information-circle-outline" size={20} color={colors.secondary} />
              </View>
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>О программе</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Версия и информация
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>

        {/* Версия */}
        <View style={[styles.versionCard, { backgroundColor: colors.surfaceLight }]}>
          <View style={styles.versionRow}>
            <Ionicons name="fitness-outline" size={24} color={colors.primary} />
            <View style={styles.versionText}>
              <Text style={[styles.appName, { color: colors.text }]}>FitnessTracker</Text>
              <Text style={[styles.version, { color: colors.textSecondary }]}>v1.0.0</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={[styles.copyright, { color: colors.textSecondary }]}>
            С анимированным переключением тем
          </Text>
          <Text style={[styles.copyright, { color: colors.textSecondary }]}>
            © 2024 Все права защищены
          </Text>
        </View>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 10,
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    paddingLeft: 4,
  },
  themeSelector: {
    borderRadius: 16,
    padding: 8,
    marginBottom: 16,
  },
  themeOption: {
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeOptionActive: {
    borderWidth: 2,
  },
  themeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 12,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  animationIndicator: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  animationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  versionCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  versionText: {
    marginLeft: 12,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  version: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginBottom: 16,
  },
  copyright: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
});