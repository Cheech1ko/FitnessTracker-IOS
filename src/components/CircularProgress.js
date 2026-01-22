import React from 'react';
import { View, Text as RNText } from 'react-native'; // Добавляем RNText
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg'; // SvgText для SVG

const CircularProgress = ({ 
  size = 100, 
  progress = 0, 
  strokeWidth = 8, 
  color = '#0A84FF',
  label = '',
  unit = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ alignItems: 'center', width: size, height: size }}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Фоновый круг */}
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#2C2C2E"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeOpacity={0.3}
          />
          
          {/* Прогресс */}
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeOpacity={0.9}
          />
        </G>
      </Svg>
      
      {/* Центральный текст - используем React Native Text */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <RNText style={{
          color: '#FFFFFF',
          fontSize: size * 0.25,
          fontWeight: '700',
          textAlign: 'center',
        }}>
          {label}
        </RNText>
        
        {unit && (
          <RNText style={{
            color: '#8E8E93',
            fontSize: size * 0.12,
            fontWeight: '500',
            marginTop: 2,
            textAlign: 'center',
          }}>
            {unit}
          </RNText>
        )}
      </View>
    </View>
  );
};

export default CircularProgress;