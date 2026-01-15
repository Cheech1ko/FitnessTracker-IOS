// src/navigation/MainTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ComparisonScreen from '../screens/ComparisonScreen';

const Tab = createBottomTabNavigator();

// Простой кастомный TabBar
const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: '#1c1c1e',
      borderTopWidth: 1,
      borderTopColor: '#2c2c2e',
      paddingBottom: 8,
      height: 65,
    }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          navigation.navigate(route.name);
        };

        // Иконки для табов
        const icons = {
          Home: '◉',
          History: '📋',
          Stats: '📊',
          Comparison: '⇅',
        };

        return (
          <View 
            key={route.key} 
            style={{ 
              flex: 1, 
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 8,
            }}
          >
            <Text
              onPress={onPress}
              style={{
                fontSize: 24,
                color: isFocused ? '#0a84ff' : '#8e8e93',
                marginBottom: 4,
              }}
            >
              {icons[route.name]}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: isFocused ? '#0a84ff' : '#8e8e93',
                fontWeight: isFocused ? '600' : '400',
              }}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Главная',
        }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
        options={{
          tabBarLabel: 'История',
        }}
      />
      <Tab.Screen 
        name="Stats" 
        component={StatsScreen}
        options={{
          tabBarLabel: 'Статистика',
        }}
      />
      <Tab.Screen 
        name="Comparison" 
        component={ComparisonScreen}
        options={{
          tabBarLabel: 'Сравнение',
        }}
      />
    </Tab.Navigator>
  );
}