import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/context/ThemeContext';

type ActionProps = {
  text: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  primary?: boolean;
};

function Action({ text, icon, primary = false }: ActionProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={[styles.action, primary && { backgroundColor: colors.primary }]}> 
      <View style={styles.actionRow}>
        {icon ? (
          <MaterialIcons
            name={icon}
            size={16}
            color={primary ? '#fff' : colors.primary}
            style={styles.actionIcon}
          />
        ) : (
          <MaterialIcons name="description" size={16} color="#fff" style={styles.actionIcon} />
        )}
        <Text style={[styles.actionText, primary && { color: '#fff' }]}>{text}</Text>
      </View>
    </View>
  );
}

export default function QuickActionsList() {
  return (
    <>
      <Action text="Upload Project" primary />
      <Action text="Run Validation" icon="sync-alt" />
      <Action text="Generate Report" icon="description" />
    </>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  action: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    marginBottom: 7,
  },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  actionIcon: { marginRight: 5 },
  actionText: { color: colors.primary, fontWeight: '700', fontSize: 12 },
});
