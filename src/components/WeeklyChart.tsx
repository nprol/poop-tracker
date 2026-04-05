import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { usePoo } from '../context/PooContext';
import { COLORS } from '../utils/theme';

const DAY_LABELS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

export default function WeeklyChart() {
  const { last7Days } = usePoo();
  const maxCount = Math.max(...last7Days.map((r) => r.count), 3);

  return (
    <Animated.View
      entering={SlideInDown.delay(600).duration(600).springify()}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📈</Text>
        <Text style={styles.headerText}>Últimos 7 días</Text>
      </View>
      <View style={styles.chartArea}>
        {last7Days.map((record, index) => {
          const isToday = index === last7Days.length - 1;
          const barHeight = Math.max((record.count / maxCount) * 90, 4);
          const date = new Date(record.date);
          const dayIndex = (date.getDay() + 6) % 7; // Mon=0
          const label = isToday ? 'Hoy' : DAY_LABELS[dayIndex];

          return (
            <View key={record.date} style={styles.barColumn}>
              <View style={styles.barWrapper}>
                {/* Background bar */}
                <View style={[styles.barBg, { height: 90 }]} />
                {/* Active bar */}
                <Animated.View
                  entering={SlideInDown.delay(700 + index * 80)
                    .duration(500)
                    .springify()}
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: isToday ? COLORS.gold : COLORS.primary,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.dayLabel,
                  isToday && styles.dayLabelToday,
                ]}
              >
                {label}
              </Text>
            </View>
          );
        })}
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
    marginBottom: 16,
  },
  headerIcon: {
    fontSize: 18,
  },
  headerText: {
    fontSize: 14,
    fontFamily: 'Fredoka_500Medium',
    color: 'rgba(255,255,255,0.7)',
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  barWrapper: {
    width: 26,
    height: 90,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  barBg: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  dayLabel: {
    fontSize: 11,
    fontFamily: 'Fredoka_400Regular',
    color: COLORS.textHint,
  },
  dayLabelToday: {
    color: COLORS.gold,
    fontFamily: 'Fredoka_600SemiBold',
  },
});
