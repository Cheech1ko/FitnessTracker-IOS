import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { TrainingProvider } from './src/context/TrainingContext';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import AddTrainingScreen from './src/screens/AddTrainingScreen';
import TrainingDetailsScreen from './src/screens/TrainingDetailsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <TrainingProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#000' }
          }}
        >
          {/* Главные экраны через TabBar */}
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          
          {/* Модальные экраны (без TabBar) */}
          <Stack.Screen name="AddTraining" component={AddTrainingScreen} />
          <Stack.Screen name="TrainingDetails" component={TrainingDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TrainingProvider>
  );
}