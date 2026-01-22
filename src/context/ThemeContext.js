import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Анимация fade in/out
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    loadTheme();
  }, []);
  
  useEffect(() => {
    saveTheme();
  }, [theme]);
  
  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme');
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('Ошибка загрузки темы:', error);
    }
  };
  
  const saveTheme = async () => {
    try {
      await AsyncStorage.setItem('@theme', theme);
    } catch (error) {
      console.error('Ошибка сохранения темы:', error);
    }
  };
  
  const toggleTheme = (newTheme) => {
    if (isAnimating || theme === newTheme) return;
    
    setIsAnimating(true);
    
    // Fade out текущей темы
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Меняем тему
      setTheme(newTheme);
      
      // Fade in новой темы
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setIsAnimating(false);
      });
    });
  };
  
  // Цветовые схемы
  const colors = {
    dark: {
      background: '#000000',
      surface: '#1c1c1e',
      surfaceLight: '#2c2c2e',
      text: '#ffffff',
      textSecondary: '#8e8e93',
      primary: '#0a84ff',
      secondary: '#5856d6',
      success: '#34c759',
      warning: '#ff9500',
      danger: '#ff3b30',
      card: '#1c1c1e',
      border: '#2c2c2e',
      switchTrackOn: '#34c759',
      switchTrackOff: '#3a3a3c',
      switchThumb: '#ffffff',
    },
    light: {
      background: '#f2f2f7',
      surface: '#ffffff',
      surfaceLight: '#f2f2f7',
      text: '#000000',
      textSecondary: '#8e8e8e',
      primary: '#007aff',
      secondary: '#5856d6',
      success: '#34c759',
      warning: '#ff9500',
      danger: '#ff3b30',
      card: '#ffffff',
      border: '#c7c7cc',
      switchTrackOn: '#34c759',
      switchTrackOff: '#e5e5ea',
      switchThumb: '#ffffff',
    }
  };
  
  const currentColors = colors[theme];
  
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      colors: currentColors,
      themeOptions: ['dark', 'light'],
      themeNames: {
        dark: 'Тёмная',
        light: 'Светлая'
      },
      isAnimating 
    }}>
      <Animated.View 
        style={[
          { 
            flex: 1,
            backgroundColor: currentColors.background,
            opacity: fadeAnim 
          }
        ]}
      >
        {children}
      </Animated.View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};