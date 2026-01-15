// src/components/CircularProgress.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CircularProgress = ({ value, maxValue, radius = 50, color = '#0a84ff', title }) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const strokeWidth = 8;
  const center = radius + strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <View style={[
        styles.circleContainer,
        { width: center * 2, height: center * 2 }
      ]}>
        {/* Фоновый круг */}
        <View style={[
          styles.circle,
          { 
            width: radius * 2, 
            height: radius * 2,
            borderRadius: radius,
            borderWidth: strokeWidth,
            borderColor: '#2c2c2e'
          }
        ]} />
        
        {/* Прогресс круг */}
        <View style={[
          styles.progressCircle,
          { 
            width: radius * 2, 
            height: radius * 2,
            borderRadius: radius,
            borderWidth: strokeWidth,
            borderColor: color,
            borderLeftColor: 'transparent',
            transform: [{ rotate: `${-90 + (percentage / 100) * 360}deg` }]
          }
        ]} />
        
        {/* Центральный текст */}
        <View style={styles.centerText}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.maxValue}>/{maxValue}</Text>
          {title && <Text style={styles.title}>{title}</Text>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
  },
  progressCircle: {
    position: 'absolute',
  },
  centerText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  maxValue: {
    fontSize: 14,
    color: '#8e8e93',
  },
  title: {
    fontSize: 12,
    color: '#8e8e93',
    marginTop: 4,
  },
});

export default CircularProgress;