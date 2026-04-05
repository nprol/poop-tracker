import 'react-native-reanimated';
import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  useFonts,
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from '@expo-google-fonts/fredoka';
import * as SplashScreen from 'expo-splash-screen';
import { PooProvider } from './src/context/PooContext';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [screen, setScreen] = useState<'home' | 'history'>('home');

  const [fontsLoaded] = useFonts({
    Fredoka_400Regular,
    Fredoka_500Medium,
    Fredoka_600SemiBold,
    Fredoka_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <PooProvider>
      <View style={styles.root} onLayout={onLayoutRootView}>
        {screen === 'home' ? (
          <HomeScreen onNavigateHistory={() => setScreen('history')} />
        ) : (
          <HistoryScreen onBack={() => setScreen('home')} />
        )}
      </View>
    </PooProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1A1220',
  },
});
