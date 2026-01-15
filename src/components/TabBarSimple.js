import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TabBarSimple = () => {
  const navigation = useNavigation();
  
  const tabs = [
    { label: 'Главная', icon: '◉', route: 'Home' },
    { label: 'История', icon: '📋', route: 'History' },
    { label: '', icon: '+', route: 'AddTraining', special: true },
    { label: 'Статы', icon: '📊', route: 'Stats' },
    { label: 'Сравн.', icon: '⇅', route: 'Comparison' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.tab,
            tab.special && styles.specialTab,
          ]}
          onPress={() => navigation.navigate(tab.route)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.icon,
            tab.special && styles.specialIcon
          ]}>
            {tab.icon}
          </Text>
          {!tab.special && (
            <Text style={styles.label}>
              {tab.label}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#2c2c2e',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  specialTab: {
    flex: 0,
    marginTop: -25,
  },
  icon: {
    fontSize: 22,
    color: '#8e8e93',
    marginBottom: 4,
  },
  specialIcon: {
    fontSize: 36,
    color: '#fff',
    marginBottom: 0,
  },
  label: {
    fontSize: 10,
    color: '#8e8e93',
  },
});

export default TabBarSimple;