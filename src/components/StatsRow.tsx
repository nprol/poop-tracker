import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated';
import { usePoo } from '../context/PooContext';
import { COLORS, SHADOWS } from '../utils/theme';

export default function StatsRow() {
  const { currentStreak, weeklyAverage, totalAllTime } = usePoo();

  return (
    <View style={styles.row}>
      <StatCard
        icon="🔥"
        label="Racha"
        value={`${currentStreak}`}
        sublabel="días"
        delay={0}
      />
      <StatCard
        icon="📊"
        label="Media"
        value={weeklyAverage.toFixed(1)}
        sublabel="/día"
        delay={100}
      />
      <StatCard
        icon="🏆"
        label="Total"
        value={`${totalAllTime}`}
        sublabel="histórico"
        delay={200}
      />
    </View>
  );
}

function StatCard({
  icon,
  label,
  value,
  sublabel,
  delay,
}: {
  icon: string;
  label: string;
  value: string;
  sublabel: string;
  delay: number;
}) {
  return (
    <Animated.View
      entering={SlideInDown.delay(400 + delay).duration(500).springify()}
      style={styles.card}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.sublabel}>{sublabel}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  icon: {
    fontSize: 22,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: COLORS.textHint,
    fontFamily: 'Fredoka_400Regular',
  },
  value: {
    fontSize: 26,
    fontFamily: 'Fredoka_700Bold',
    color: COLORS.gold,
    marginVertical: 2,
  },
  sublabel: {
    fontSize: 10,
    color: COLORS.textHint,
    fontFamily: 'Fredoka_400Regular',
  },
});
