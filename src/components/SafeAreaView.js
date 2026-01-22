import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function SafeAreaView({ children, style, includeTop = true, includeBottom = true }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  
  return (
    <View style={[
      styles.container,
      { backgroundColor: colors.background },
      includeTop && { paddingTop: insets.top },
      includeBottom && { paddingBottom: insets.bottom },
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});