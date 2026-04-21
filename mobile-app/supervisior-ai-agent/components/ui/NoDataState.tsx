import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColors } from '@/context/ThemeContext';

type NoDataStateProps = {
  title?: string;
  message?: string;
};

export function NoDataState({
  title = 'No data found',
  message = 'No data available for this selection.',
}: NoDataStateProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      <ThemedText type="defaultSemiBold" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText type="default" style={styles.message}>
        {message}
      </ThemedText>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 12,
      marginTop: 10,
    },
    title: {
      color: colors.text,
      marginBottom: 4,
    },
    message: {
      color: colors.textSecondary,
    },
  });
