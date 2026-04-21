import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useThemeColors } from '@/context/ThemeContext';

type DebouncedSearchInputProps = {
  value?: string;
  onDebouncedChange: (value: string) => void;
  delay?: number;
  placeholder?: string;
};

export function DebouncedSearchInput({
  value = '',
  onDebouncedChange,
  delay = 350,
  placeholder = 'Search...',
}: DebouncedSearchInputProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onDebouncedChange(localValue.trim());
    }, delay);

    return () => clearTimeout(timer);
  }, [localValue, delay, onDebouncedChange]);

  return (
    <View style={styles.container}>
      <MaterialIcons name="search" size={18} color={colors.textSecondary} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        value={localValue}
        onChangeText={setLocalValue}
      />
      {localValue.length > 0 ? (
        <MaterialIcons
          name="close"
          size={18}
          color={colors.textSecondary}
          onPress={() => setLocalValue('')}
        />
      ) : null}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    container: {
      height: 44,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    input: {
      flex: 1,
      color: colors.text,
      fontSize: 14,
    },
  });
