import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, Dimensions } from 'react-native';

export const useSafeArea = () => {
  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');
  
  // Определяем тип устройства по размеру экрана
  const isIPhoneWithNotch = () => {
    if (Platform.OS !== 'ios') return false;
    
    // iPhone размеры с "челкой" (Notch)
    const notchIPhones = [
      { width: 375, height: 812 },  // iPhone X, XS, 11 Pro, 12 mini, 13 mini
      { width: 414, height: 896 },  // iPhone XR, XS Max, 11, 11 Pro Max
      { width: 390, height: 844 },  // iPhone 12, 12 Pro, 13, 13 Pro, 14
      { width: 428, height: 926 },  // iPhone 12 Pro Max, 13 Pro Max, 14 Plus
      { width: 393, height: 852 },  // iPhone 14 Pro
      { width: 430, height: 932 },  // iPhone 14 Pro Max
      { width: 393, height: 852 },  // iPhone 15, 15 Pro
      { width: 430, height: 932 },  // iPhone 15 Plus, 15 Pro Max
    ];
    
    return notchIPhones.some(device => 
      (width === device.width && height === device.height) ||
      (width === device.height && height === device.width) // портрет/ландшафт
    );
  };
  
  const isDynamicIsland = () => {
    if (Platform.OS !== 'ios') return false;
    
    // iPhone 14 Pro/Pro Max, 15 Pro/Pro Max (Dynamic Island)
    const dynamicIslandIPhones = [
      { width: 393, height: 852 },  // iPhone 14 Pro, 15, 15 Pro
      { width: 430, height: 932 },  // iPhone 14 Pro Max, 15 Plus, 15 Pro Max
    ];
    
    return dynamicIslandIPhones.some(device => 
      (width === device.width && height === device.height) ||
      (width === device.height && height === device.width)
    );
  };
  
  // Отступы с учетом устройства
  const safeAreaInsets = {
    top: isIPhoneWithNotch() ? Math.max(insets.top, 44) : insets.top, // Минимум 44 для iPhone с чёлкой
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
  };
  
  // Высота для Dynamic Island (если нужно специальное отображение)
  const dynamicIslandHeight = isDynamicIsland() ? 37 : 0;
  
  return {
    ...safeAreaInsets,
    isIPhoneWithNotch: isIPhoneWithNotch(),
    isDynamicIsland: isDynamicIsland(),
    dynamicIslandHeight,
    // Готовые стили для использования
    safeAreaStyle: {
      paddingTop: safeAreaInsets.top,
      paddingBottom: safeAreaInsets.bottom,
      paddingLeft: safeAreaInsets.left,
      paddingRight: safeAreaInsets.right,
    },
    // Для экранов с вкладками (табами)
    tabScreenStyle: {
      paddingTop: safeAreaInsets.top,
      paddingBottom: safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom + 60 : 60, // Таббар + безопасная зона
      paddingLeft: safeAreaInsets.left,
      paddingRight: safeAreaInsets.right,
    }
  };
};