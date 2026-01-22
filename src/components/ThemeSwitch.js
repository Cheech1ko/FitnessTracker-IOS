import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWITCH_WIDTH = 60;
const SWITCH_HEIGHT = 32;
const THUMB_SIZE = 28;

const ThemeSwitch = () => {
  const { switchTheme, getSwitchValue, colors, isAnimating } = useTheme();
  const isLightTheme = getSwitchValue();
  
  // Анимация положения ползунка
  const thumbPosition = useRef(new Animated.Value(isLightTheme ? SWITCH_WIDTH - THUMB_SIZE - 2 : 2)).current;
  
  // Анимация градиента фона
  const bgAnim = useRef(new Animated.Value(isLightTheme ? 1 : 0)).current;
  
  // Создаем PanResponder для перетаскивания
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // При начале перетаскивания
      },
      onPanResponderMove: (evt, gestureState) => {
        if (isAnimating) return;
        
        // Вычисляем новую позицию с ограничениями
        const newX = Math.max(
          2, 
          Math.min(
            SWITCH_WIDTH - THUMB_SIZE - 2, 
            gestureState.dx + (isLightTheme ? SWITCH_WIDTH - THUMB_SIZE - 2 : 2)
          )
        );
        
        // Анимируем движение ползунка
        thumbPosition.setValue(newX);
        
        // Анимируем фон
        const progress = (newX - 2) / (SWITCH_WIDTH - THUMB_SIZE - 4);
        bgAnim.setValue(progress);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (isAnimating) return;
        
        const currentX = thumbPosition._value;
        const middle = SWITCH_WIDTH / 2 - THUMB_SIZE / 2;
        const shouldSwitch = currentX > middle;
        
        // Анимируем к конечной позиции
        const endPosition = shouldSwitch ? SWITCH_WIDTH - THUMB_SIZE - 2 : 2;
        
        Animated.parallel([
          Animated.spring(thumbPosition, {
            toValue: endPosition,
            tension: 100,
            friction: 10,
            useNativeDriver: false,
          }),
          Animated.timing(bgAnim, {
            toValue: shouldSwitch ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
          })
        ]).start(() => {
          // Переключаем тему если нужно
          if (shouldSwitch !== isLightTheme) {
            switchTheme(shouldSwitch);
          }
        });
      },
    })
  ).current;

  // Обновляем анимацию при изменении темы извне
  useEffect(() => {
    const endPosition = isLightTheme ? SWITCH_WIDTH - THUMB_SIZE - 2 : 2;
    Animated.parallel([
      Animated.spring(thumbPosition, {
        toValue: endPosition,
        tension: 100,
        friction: 10,
        useNativeDriver: false,
      }),
      Animated.timing(bgAnim, {
        toValue: isLightTheme ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      })
    ]).start();
  }, [isLightTheme]);

  // Градиент для фона переключателя
  const trackBackground = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#3a3a3c', '#f2f2f7']
  });

  // Цвет иконки на ползунке
  const thumbIconColor = bgAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#ffffff', '#666666', '#000000']
  });

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <View style={styles.labelContainer}>
          <Ionicons 
            name="moon" 
            size={20} 
            color={isLightTheme ? colors.textSecondary : colors.text} 
            style={styles.icon}
          />
          <Text style={[
            styles.label,
            { color: isLightTheme ? colors.textSecondary : colors.text }
          ]}>
            Тёмная
          </Text>
        </View>
        
        <View style={styles.switchWrapper}>
          <Animated.View 
            style={[
              styles.track,
              { backgroundColor: trackBackground }
            ]}
          >
            {/* Градиентный фон для плавного перехода */}
            <View style={[StyleSheet.absoluteFill, styles.trackGradient]}>
              <View style={[StyleSheet.absoluteFill, { backgroundColor: '#3a3a3c' }]} />
              <View style={[StyleSheet.absoluteFill, { backgroundColor: '#f2f2f7', opacity: bgAnim }]} />
            </View>
            
            <Animated.View 
              style={[
                styles.thumb,
                {
                  transform: [{ translateX: thumbPosition }],
                  backgroundColor: colors.surface,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 3,
                }
              ]}
              {...panResponder.panHandlers}
            >
              <Animated.View style={styles.thumbIcon}>
                <Ionicons 
                  name={isLightTheme ? "sunny" : "moon"} 
                  size={16} 
                  color={colors.text} 
                />
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </View>
        
        <View style={styles.labelContainer}>
          <Text style={[
            styles.label,
            { color: isLightTheme ? colors.text : colors.textSecondary }
          ]}>
            Светлая
          </Text>
          <Ionicons 
            name="sunny" 
            size={20} 
            color={isLightTheme ? colors.text : colors.textSecondary} 
            style={styles.icon}
          />
        </View>
      </View>
      
      {/* Индикатор текущей темы */}
      <View style={styles.themeIndicator}>
        <Text style={[styles.themeText, { color: colors.textSecondary }]}>
          {isLightTheme ? '🌞 Светлая тема' : '🌙 Тёмная тема'}
        </Text>
      </View>
      
      {/* Индикатор анимации */}
      {isAnimating && (
        <View style={[styles.animationIndicator, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.animationText, { color: colors.primary }]}>
            ⏳ Меняем тему...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 8,
  },
  icon: {
    marginHorizontal: 4,
  },
  switchWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    borderRadius: SWITCH_HEIGHT / 2,
    justifyContent: 'center',
    padding: 2,
    overflow: 'hidden',
  },
  trackGradient: {
    flexDirection: 'row',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIndicator: {
    marginTop: 8,
  },
  themeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  animationIndicator: {
    marginTop: 12,
    padding: 8,
    borderRadius: 8,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  animationText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ThemeSwitch;