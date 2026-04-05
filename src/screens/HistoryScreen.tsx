import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { usePoo } from '../context/PooContext';
import { COLORS, SHADOWS } from '../utils/theme';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const DAY_HEADERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

interface HistoryScreenProps {
  onBack: () => void;
}

export default function HistoryScreen({ onBack }: HistoryScreenProps) {
  const { records } = usePoo();
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());

  const getDateKey = (y: number, m: number, d: number) => {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const todayKey = getDateKey(now.getFullYear(), now.getMonth(), now.getDate());

  const firstDay = new Date(selectedYear, selectedMonth, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  const goPrev = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goNext = () => {
    const nextMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
    const nextYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear;
    const limit = new Date(now.getFullYear(), now.getMonth() + 1);
    const next = new Date(nextYear, nextMonth);
    if (next < limit) {
      setSelectedMonth(nextMonth);
      setSelectedYear(nextYear);
    }
  };

  const canGoNext = (() => {
    const nextMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
    const nextYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear;
    return new Date(nextYear, nextMonth) < new Date(now.getFullYear(), now.getMonth() + 1);
  })();

  // Month stats
  let monthTotal = 0;
  let daysWithPoo = 0;
  let monthMax = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const key = getDateKey(selectedYear, selectedMonth, d);
    const record = records[key];
    if (record && record.count > 0) {
      monthTotal += record.count;
      daysWithPoo++;
      if (record.count > monthMax) monthMax = record.count;
    }
  }

  // Build calendar grid
  const calendarCells = [];
  for (let i = 0; i < 42; i++) {
    const dayOffset = i - startWeekday;
    if (dayOffset < 0 || dayOffset >= daysInMonth) {
      calendarCells.push(null);
    } else {
      const day = dayOffset + 1;
      const key = getDateKey(selectedYear, selectedMonth, day);
      const record = records[key];
      const count = record?.count || 0;
      const isToday = key === todayKey;
      calendarCells.push({ day, count, isToday });
    }
  }

  const getColor = (count: number) => {
    if (count === 0) return 'rgba(255,255,255,0.05)';
    if (count === 1) return 'rgba(90,69,16,0.5)';
    if (count === 2) return 'rgba(139,105,20,0.6)';
    if (count === 3) return 'rgba(212,160,60,0.7)';
    return 'rgba(245,214,123,0.8)';
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Pressable onPress={onBack} hitSlop={10}>
          <Text style={styles.backBtn}>←</Text>
        </Pressable>
        <Text style={styles.title}>📅 Historial</Text>
        <View style={{ width: 36 }} />
      </Animated.View>

      {/* Month selector */}
      <Animated.View entering={FadeIn.delay(100)} style={styles.monthSelector}>
        <Pressable onPress={goPrev} hitSlop={10}>
          <Text style={styles.navArrow}>‹</Text>
        </Pressable>
        <Text style={styles.monthName}>
          {MONTH_NAMES[selectedMonth]} {selectedYear}
        </Text>
        <Pressable onPress={canGoNext ? goNext : undefined} hitSlop={10}>
          <Text style={[styles.navArrow, !canGoNext && styles.navDisabled]}>›</Text>
        </Pressable>
      </Animated.View>

      <ScrollView style={{ flex: 1 }} bounces>
        {/* Day headers */}
        <View style={styles.dayHeaders}>
          {DAY_HEADERS.map((d) => (
            <View key={d} style={styles.dayHeaderCell}>
              <Text style={styles.dayHeaderText}>{d}</Text>
            </View>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.calendarGrid}>
          {calendarCells.map((cell, i) => (
            <View key={i} style={styles.calendarCellWrapper}>
              {cell ? (
                <Animated.View
                  entering={ZoomIn.delay(i * 15).duration(250)}
                  style={[
                    styles.calendarCell,
                    { backgroundColor: getColor(cell.count) },
                    cell.isToday && styles.todayCell,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayNumber,
                      cell.count > 0 && styles.dayNumberActive,
                    ]}
                  >
                    {cell.day}
                  </Text>
                  {cell.count > 0 && (
                    <Text style={styles.cellPoo}>
                      {cell.count <= 3 ? '💩'.repeat(cell.count) : `💩×${cell.count}`}
                    </Text>
                  )}
                </Animated.View>
              ) : (
                <View style={styles.calendarCellEmpty} />
              )}
            </View>
          ))}
        </View>

        {/* Month stats */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>💩</Text>
            <Text style={styles.statValue}>{monthTotal}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>📅</Text>
            <Text style={styles.statValue}>{daysWithPoo}</Text>
            <Text style={styles.statLabel}>Días activos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🏆</Text>
            <Text style={styles.statValue}>{monthMax}</Text>
            <Text style={styles.statLabel}>Récord día</Text>
          </View>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 56,
    paddingBottom: 8,
  },
  backBtn: {
    fontSize: 28,
    color: COLORS.gold,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Fredoka_600SemiBold',
    color: COLORS.gold,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  navArrow: {
    fontSize: 32,
    color: COLORS.gold,
    paddingHorizontal: 12,
  },
  navDisabled: {
    color: COLORS.textHint,
  },
  monthName: {
    fontSize: 18,
    fontFamily: 'Fredoka_500Medium',
    color: '#fff',
  },
  dayHeaders: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 13,
    fontFamily: 'Fredoka_500Medium',
    color: COLORS.textHint,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  calendarCellWrapper: {
    width: '14.285%',
    aspectRatio: 1,
    padding: 3,
  },
  calendarCell: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarCellEmpty: {
    flex: 1,
  },
  todayCell: {
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  dayNumber: {
    fontSize: 13,
    fontFamily: 'Fredoka_500Medium',
    color: COLORS.textHint,
  },
  dayNumberActive: {
    color: '#fff',
  },
  cellPoo: {
    fontSize: 7,
    lineHeight: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'Fredoka_700Bold',
    color: COLORS.gold,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Fredoka_400Regular',
    color: COLORS.textHint,
  },
});
