import { StyleSheet, Text, View, Switch } from 'react-native';

import { useThemeColors } from '@/context/ThemeContext';

export default function ProfileTabScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Profile</Text>
      <View style={styles.card}>
        <View style={styles.avatar} />
        <Text style={styles.name}>Alex Johnson</Text>
        <Text style={styles.email}>alex.j@email.com</Text>
      </View>

      <View style={styles.row}>
        <Text>Notifications</Text>
        <Switch value />
      </View>
      <View style={styles.row}>
        <Text>Auto Sync</Text>
        <Switch value={false} />
      </View>

      <View style={styles.plan}>
        <Text style={{ color: '#fff', fontWeight: '800' }}>Pro Plan</Text>
        <Text style={{ color: colors.primaryLight }}>5 projects remaining</Text>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background, padding: 16 },
  h1: { fontSize: 24, fontWeight: '800', marginBottom: 12, color: colors.text },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    alignItems: 'center',
  },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.disabled, marginBottom: 8 },
  name: { fontSize: 18, fontWeight: '700', color: colors.text },
  email: { color: colors.textSecondary, marginTop: 2 },
  row: {
    marginTop: 10,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plan: { marginTop: 12, backgroundColor: colors.primary, borderRadius: 12, padding: 14 },
});
