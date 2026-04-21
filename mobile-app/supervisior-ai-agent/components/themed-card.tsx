import { View, StyleSheet, type ViewProps } from 'react-native';

import { useThemeColors } from '@/context/ThemeContext';

type ThemedCardProps = ViewProps & {
  variant?: 'filled' | 'outlined';
};

export function ThemedCard({ style, variant = 'filled', ...otherProps }: ThemedCardProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: variant === 'outlined' ? 1 : 0,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    padding: 14,
  },
});
