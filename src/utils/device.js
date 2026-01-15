// src/utils/device.js
import { Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

// Определяем тип устройства
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// iPhone с чёлкой (iPhone X, 11, 12, 13)
export const hasNotch = isIOS && 
  !Platform.isPad && 
  !Platform.isTV && 
  (height >= 812 || width >= 812);

// iPhone с Dynamic Island (14 Pro, 15 Pro)
export const hasDynamicIsland = isIOS && 
  (height >= 852 || width >= 852); // примерно

// Безопасные зоны
export const safeArea = {
  top: hasDynamicIsland ? 59 : hasNotch ? 44 : 20,
  bottom: hasNotch || hasDynamicIsland ? 34 : 0,
  left: 0,
  right: 0,
};

// Адаптивные размеры
export const responsive = {
  // Проценты от ширины
  wp: (percent) => (width * percent) / 100,
  
  // Проценты от высоты
  hp: (percent) => (height * percent) / 100,
  
  // Шрифты
  fontSize: {
    small: width < 375 ? 12 : 14,
    normal: width < 375 ? 14 : 16,
    large: width < 375 ? 18 : 20,
    xlarge: width < 375 ? 22 : 24,
  },
};

// Готовые стили для safe areas
export const safeAreaStyles = {
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: safeArea.top,
    paddingBottom: safeArea.bottom,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: safeArea.bottom + 20,
  },
};