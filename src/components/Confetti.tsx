import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS } from '../utils/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_COLORS = [
  COLORS.primary,
  COLORS.accent,
  COLORS.gold,
  COLORS.goldDark,
  COLORS.primaryLight,
];

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  endX: number;
  rotation: number;
  type: 'confetti' | 'poo';
}

interface ConfettiProps {
  trigger: number; // increment to trigger
}

export default function Confetti({ trigger }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger <= 0) return;

    const newParticles: Particle[] = [];
    // Confetti pieces
    for (let i = 0; i < 25; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: Math.random() * SCREEN_WIDTH,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 6 + Math.random() * 8,
        delay: i * 30,
        duration: 1800 + Math.random() * 1500,
        endX: (Math.random() - 0.5) * 150,
        rotation: Math.random() * 720,
        type: 'confetti',
      });
    }
    // Floating poo emojis
    for (let i = 0; i < 6; i++) {
      newParticles.push({
        id: Date.now() + 100 + i,
        x: Math.random() * (SCREEN_WIDTH - 40) + 20,
        color: '',
        size: 18 + Math.random() * 18,
        delay: i * 80,
        duration: 2500 + Math.random() * 1500,
        endX: (Math.random() - 0.5) * 100,
        rotation: Math.random() * 360,
        type: 'poo',
      });
    }

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 5000);
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((p) =>
        p.type === 'confetti' ? (
          <ConfettiPiece key={p.id} particle={p} />
        ) : (
          <FloatingPoo key={p.id} particle={p} />
        )
      )}
    </View>
  );
}

function ConfettiPiece({ particle }: { particle: Particle }) {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      particle.delay,
      withTiming(SCREEN_HEIGHT + 50, {
        duration: particle.duration,
        easing: Easing.in(Easing.quad),
      })
    );
    translateX.value = withDelay(
      particle.delay,
      withTiming(particle.endX, {
        duration: particle.duration,
        easing: Easing.inOut(Easing.ease),
      })
    );
    rotate.value = withDelay(
      particle.delay,
      withTiming(particle.rotation, {
        duration: particle.duration,
      })
    );
    opacity.value = withDelay(
      particle.delay + particle.duration * 0.7,
      withTiming(0, { duration: particle.duration * 0.3 })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: particle.x,
          top: -20,
          width: particle.size,
          height: particle.size * 0.6,
          borderRadius: Math.random() > 0.5 ? particle.size / 2 : 2,
          backgroundColor: particle.color,
        },
        style,
      ]}
    />
  );
}

function FloatingPoo({ particle }: { particle: Particle }) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Scale in
    scale.value = withDelay(
      particle.delay,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.back(2)) })
    );
    opacity.value = withDelay(particle.delay, withTiming(1, { duration: 200 }));
    // Float up
    translateY.value = withDelay(
      particle.delay,
      withTiming(-SCREEN_HEIGHT * 0.7, {
        duration: particle.duration,
        easing: Easing.out(Easing.quad),
      })
    );
    translateX.value = withDelay(
      particle.delay,
      withTiming(particle.endX, {
        duration: particle.duration,
        easing: Easing.inOut(Easing.ease),
      })
    );
    rotate.value = withDelay(
      particle.delay,
      withTiming(particle.rotation, { duration: particle.duration })
    );
    // Fade out
    opacity.value = withDelay(
      particle.delay + particle.duration * 0.6,
      withTiming(0, { duration: particle.duration * 0.4 })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text
      style={[
        {
          position: 'absolute',
          left: particle.x,
          bottom: 100,
          fontSize: particle.size,
        },
        style,
      ]}
    >
      💩
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
});
