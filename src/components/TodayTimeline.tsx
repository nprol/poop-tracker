import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { usePoo } from '../context/PooContext';
import { COLORS } from '../utils/theme';

export default function TodayTimeline() {
  const { todayRecord } = usePoo();

  if (todayRecord.count === 0) return null;

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📋</Text>
        <Text style={styles.headerText}>Registro de hoy</Text>
      </View>
      <View style={styles.chips}>
        {todayRecord.timestamps.map((time, index) => (
          <Animated.View
            key={`${time}-${index}`}
            entering={ZoomIn.delay(index * 100).springify()}
            style={styles.chip}
          >
            <Text style={styles.chipEmoji}>💩</Text>
            <Text style={styles.chipIndex}>#{index + 1}</Text>
            <Text style={styles.chipTime}>{time}</Text>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  headerIcon: {
    fontSize: 18,
  },
  headerText: {
    fontSize: 14,
    fontFamily: 'Fredoka_500Medium',
    color: 'rgba(255,255,255,0.7)',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(139,105,20,0.2)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  chipEmoji: {
    fontSize: 14,
  },
  chipIndex: {
    fontSize: 12,
    fontFamily: 'Fredoka_600SemiBold',
    color: COLORS.gold,
  },
  chipTime: {
    fontSize: 12,
    fontFamily: 'Fredoka_400Regular',
    color: COLORS.textMuted,
  },
});
