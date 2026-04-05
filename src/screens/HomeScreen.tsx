import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  SlideInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { usePoo } from '../context/PooContext';
import PooButton from '../components/PooButton';
import Confetti from '../components/Confetti';
import StatsRow from '../components/StatsRow';
import TodayTimeline from '../components/TodayTimeline';
import WeeklyChart from '../components/WeeklyChart';
import { COLORS } from '../utils/theme';

interface HomeScreenProps {
  onNavigateHistory: () => void;
}

export default function HomeScreen({ onNavigateHistory }: HomeScreenProps) {
  const { todayCount, todayTitle, addPoo, undoLastPoo, getRandomMessage } = usePoo();
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [funMessage, setFunMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const counterScale = useSharedValue(1);
  const messageOpacity = useSharedValue(0);
  const messageTranslateY = useSharedValue(10);

  const handlePoo = useCallback(async () => {
    await addPoo();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Counter bounce
    counterScale.value = withSequence(
      withTiming(1.3, { duration: 150 }),
      withSpring(1, { damping: 4, stiffness: 200 })
    );

    // Confetti
    setConfettiTrigger((prev) => prev + 1);

    // Fun message
    const msg = getRandomMessage();
    setFunMessage(msg);
    setShowMessage(true);
    messageOpacity.value = withTiming(1, { duration: 400 });
    messageTranslateY.value = withSpring(0, { damping: 8 });

    setTimeout(() => {
      messageOpacity.value = withTiming(0, { duration: 400 });
      messageTranslateY.value = withTiming(10, { duration: 400 });
      setTimeout(() => setShowMessage(false), 500);
    }, 2500);
  }, [addPoo, getRandomMessage]);

  const handleUndo = useCallback(async () => {
    await undoLastPoo();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [undoLastPoo]);

  const counterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: counterScale.value }],
  }));

  const msgStyle = useAnimatedStyle(() => ({
    opacity: messageOpacity.value,
    transform: [{ translateY: messageTranslateY.value }],
  }));

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      {/* Confetti overlay */}
      <Confetti trigger={confettiTrigger} />

      {/* App bar */}
      <View style={styles.appBar}>
        <Animated.Text entering={FadeInLeft.duration(600)} style={styles.appTitle}>
          💩 PooTracker
        </Animated.Text>
        <View style={styles.appBarRight}>
          {todayCount > 0 && (
            <Animated.View entering={FadeIn}>
              <Pressable onPress={handleUndo} hitSlop={10}>
                <Text style={styles.undoBtn}>↩</Text>
              </Pressable>
            </Animated.View>
          )}
          <Animated.View entering={FadeInRight.duration(600)}>
            <Pressable onPress={onNavigateHistory} hitSlop={10}>
              <Text style={styles.historyBtn}>📅</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* Counter */}
        <View style={styles.counterSection}>
          <Animated.Text style={[styles.counter, counterStyle]}>
            {todayCount}
          </Animated.Text>
          <Text style={styles.counterLabel}>
            {todayCount === 1 ? 'vez hoy' : 'veces hoy'}
          </Text>

          {/* Achievement badge */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.badge}>
            <Text style={styles.badgeText}>{todayTitle}</Text>
          </Animated.View>
        </View>

        {/* Poo button */}
        <PooButton onPress={handlePoo} />

        {/* Fun message */}
        <View style={styles.messageContainer}>
          {showMessage && (
            <Animated.Text style={[styles.funMessage, msgStyle]}>
              {funMessage}
            </Animated.Text>
          )}
        </View>

        {/* Timeline */}
        <TodayTimeline />

        <View style={{ height: 20 }} />

        {/* Stats */}
        <StatsRow />

        <View style={{ height: 20 }} />

        {/* Chart */}
        <WeeklyChart />

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
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 56,
    paddingBottom: 8,
  },
  appTitle: {
    fontSize: 22,
    fontFamily: 'Fredoka_600SemiBold',
    color: COLORS.gold,
  },
  appBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  undoBtn: {
    fontSize: 22,
    color: COLORS.textMuted,
    padding: 6,
  },
  historyBtn: {
    fontSize: 22,
    padding: 6,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  counterSection: {
    alignItems: 'center',
    paddingTop: 10,
  },
  counter: {
    fontSize: 72,
    fontFamily: 'Fredoka_700Bold',
    color: COLORS.gold,
    lineHeight: 80,
  },
  counterLabel: {
    fontSize: 16,
    fontFamily: 'Fredoka_400Regular',
    color: COLORS.textMuted,
    marginTop: 2,
  },
  badge: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(139,105,20,0.3)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.borderMedium,
  },
  badgeText: {
    fontSize: 14,
    fontFamily: 'Fredoka_500Medium',
    color: COLORS.gold,
  },
  messageContainer: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  funMessage: {
    fontSize: 20,
    fontFamily: 'Fredoka_600SemiBold',
    color: COLORS.accent,
    textAlign: 'center',
  },
});
