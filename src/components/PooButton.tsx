import React, { useEffect } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { COLORS, SHADOWS } from '../utils/theme';

interface PooButtonProps {
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PooButton({ onPress }: PooButtonProps) {
  const float = useSharedValue(0);
  const glow = useSharedValue(0);
  const ring1 = useSharedValue(0);
  const ring2 = useSharedValue(0);
  const press = useSharedValue(1);
  const bounce = useSharedValue(1);
  const hintOpacity = useSharedValue(0);

  useEffect(() => {
    // Floating animation
    float.value = withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    // Glow pulse
    glow.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    // Ring rotations
    ring1.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );
    ring2.value = withRepeat(
      withTiming(-360, { duration: 25000, easing: Easing.linear }),
      -1,
      false
    );
    // Hint fade pulse
    hintOpacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 1500 }),
        withTiming(0, { duration: 1500 })
      ),
      -1,
      false
    );
  }, []);

  const handlePress = () => {
    // Bounce animation on press
    bounce.value = withSequence(
      withTiming(1.25, { duration: 100 }),
      withSpring(1, { damping: 4, stiffness: 200 })
    );
    onPress();
  };

  const buttonStyle = useAnimatedStyle(() => {
    const translateY = interpolate(float.value, [0, 1], [0, -8]);
    return {
      transform: [
        { translateY },
        { scale: press.value * bounce.value },
      ],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(glow.value, [0, 1], [0.3, 0.7]);
    const scale = interpolate(glow.value, [0, 1], [1, 1.1]);
    return { opacity, transform: [{ scale }] };
  });

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ring1.value}deg` }],
  }));

  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ring2.value}deg` }],
  }));

  const hintStyle = useAnimatedStyle(() => ({
    opacity: hintOpacity.value,
  }));

  return (
    <View style={styles.wrapper}>
      {/* Glow */}
      <Animated.View style={[styles.glow, glowStyle]} />

      {/* Rotating rings */}
      <Animated.View style={[styles.ring1, ring1Style]} />
      <Animated.View style={[styles.ring2, ring2Style]} />

      {/* Main button */}
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={() => {
          press.value = withTiming(0.88, { duration: 100 });
        }}
        onPressOut={() => {
          press.value = withTiming(1, { duration: 150 });
        }}
        style={[styles.button, buttonStyle]}
      >
        <Text style={styles.emoji}>💩</Text>
      </AnimatedPressable>

      {/* Hint text */}
      <Animated.Text style={[styles.hint, hintStyle]}>
        ¡Tócame!
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
    marginVertical: 10,
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.accent,
    opacity: 0.3,
  },
  ring1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1.5,
    borderColor: 'rgba(245,214,123,0.15)',
  },
  ring2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(245,214,123,0.08)',
  },
  button: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.button,
  },
  emoji: {
    fontSize: 64,
  },
  hint: {
    marginTop: 8,
    fontSize: 13,
    color: COLORS.textHint,
    fontFamily: 'Fredoka_400Regular',
  },
});
