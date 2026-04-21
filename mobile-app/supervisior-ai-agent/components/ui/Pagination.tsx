import { Pressable, StyleSheet, View } from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { ThemedText } from '@/components/themed-text';
import { useThemeColors } from '@/context/ThemeContext';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Pressable
        disabled={page <= 1}
        onPress={() => onPageChange(page - 1)}
        style={[styles.button, page <= 1 && styles.disabledButton]}>
        <MaterialIcons
          name="chevron-left"
          size={18}
          color={page <= 1 ? colors.disabled : colors.primary}
        />
      </Pressable>

      <ThemedText style={styles.pageText}>
        Page {page} of {totalPages}
      </ThemedText>

      <Pressable
        disabled={page >= totalPages}
        onPress={() => onPageChange(page + 1)}
        style={[styles.button, page >= totalPages && styles.disabledButton]}>
        <MaterialIcons
          name="chevron-right"
          size={18}
          color={page >= totalPages ? colors.disabled : colors.primary}
        />
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    container: {
      marginTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    button: {
      width: 36,
      height: 36,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    disabledButton: {
      opacity: 0.7,
    },
    pageText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
  });
