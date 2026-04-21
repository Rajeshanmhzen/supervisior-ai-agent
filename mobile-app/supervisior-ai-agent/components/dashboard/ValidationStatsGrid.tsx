import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/context/ThemeContext';

type StatProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
};

function Stat({ icon, iconBg, iconColor, label, value }: StatProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.stat}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: iconBg }]}> 
          <MaterialIcons name={icon} size={14} color={iconColor} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function ValidationStatsGrid() {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Stat icon="folder" iconBg="#E9E8FF" iconColor={colors.primary} label="Projects" value="12" />
        <Stat
          icon="check-circle"
          iconBg="#DFF4E7"
          iconColor={colors.success}
          label="Validations"
          value="48"
        />
      </View>
      <View style={styles.row}>
        <Stat
          icon="error"
          iconBg="#FDE8E8"
          iconColor={colors.error}
          label="Issues\nFound"
          value="5"
        />
        <Stat icon="description" iconBg="#ECEBFF" iconColor={colors.primary} label="Reports" value="8" />
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  row: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 9,
    paddingVertical: 11,
    paddingHorizontal: 10,
    minHeight: 85,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  statIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: { fontSize: 38, lineHeight: 42, fontWeight: '700', color: colors.text, textAlign: 'center' },
  label: { fontSize: 12, lineHeight: 14, color: colors.textSecondary, fontWeight: '600', textAlign: 'center' },
});
