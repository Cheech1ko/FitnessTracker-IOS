import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TrainingProvider } from './src/context/TrainingContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import AddTrainingScreen from './src/screens/AddTrainingScreen';
import TrainingDetailsScreen from './src/screens/TrainingDetailsScreen';

const Stack = createStackNavigator();

// Компонент для кнопки "Назад"
const BackButton = ({ onPress, colors }) => (
  <TouchableOpacity onPress={onPress} style={{ marginLeft: 16 }}>
    <Text style={{ color: colors.primary, fontSize: 16 }}>← Назад</Text>
  </TouchableOpacity>
);

// Импортируем недостающие компоненты
import { TouchableOpacity, Text } from 'react-native';

function AppNavigator() {
  const { colors, theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: colors.background },
        headerStyle: {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        // Для iPhone с чёлкой добавляем дополнительный отступ
        headerStatusBarHeight: Platform.OS === 'ios' ? 44 : 0,
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      
      <Stack.Screen 
        name="AddTraining" 
        component={AddTrainingScreen}
        options={({ navigation }) => ({
          title: 'Новая тренировка',
          headerLeft: () => (
            <BackButton 
              onPress={() => navigation.goBack()} 
              colors={colors}
            />
          ),
          gestureEnabled: true,
        })}
      />
      
      <Stack.Screen 
        name="TrainingDetails" 
        component={TrainingDetailsScreen}
        options={({ navigation }) => ({
          title: 'Детали тренировки',
          headerLeft: () => (
            <BackButton 
              onPress={() => navigation.goBack()} 
              colors={colors}
            />
          ),
          gestureEnabled: true,
        })}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TrainingProvider>
          {/* Динамический StatusBar в зависимости от темы */}
          <StatusBar 
            barStyle="light-content"
            backgroundColor="transparent"
            translucent={true}
          />
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </TrainingProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}