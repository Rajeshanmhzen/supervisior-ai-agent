import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { useThemeColors } from '@/context/ThemeContext';

type SkeletonListProps = {
  count?: number;
};

export function SkeletonList({ count = 5 }: SkeletonListProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [opacity]);

  return (
    <View style={styles.listWrap}>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View key={index} style={[styles.card, { opacity }]}>
          <View style={styles.row}>
            <View style={styles.titleLine} />
            <View style={styles.badge} />
          </View>
          <View style={styles.subLine} />
          <View style={styles.progressTrack}>
            <View style={styles.progressBar} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    listWrap: {
      marginTop: 10,
      gap: 10,
    },
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 14,
      padding: 12,
      gap: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
    },
    titleLine: {
      height: 12,
      borderRadius: 6,
      width: '62%',
      backgroundColor: colors.overlay,
    },
    badge: {
      height: 18,
      width: 80,
      borderRadius: 999,
      backgroundColor: colors.overlay,
    },
    subLine: {
      height: 10,
      borderRadius: 5,
      width: '45%',
      backgroundColor: colors.overlay,
    },
    progressTrack: {
      height: 8,
      borderRadius: 999,
      overflow: 'hidden',
      backgroundColor: colors.overlay,
    },
    progressBar: {
      height: 8,
      width: '30%',
      borderRadius: 999,
      backgroundColor: colors.disabled,
    },
  });
