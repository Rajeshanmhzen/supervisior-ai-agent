import { StyleSheet, Text, View, ScrollView, Switch } from 'react-native';

import { useThemeColors } from '@/context/ThemeContext';

export default function ReportsTabScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.h1}>Document View</Text>
      <View style={styles.docCard}>
        <Text style={styles.file}>Thesis_Draft_v1.pdf</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.summary}>
        <Text style={styles.section}>AI Summary</Text>
        <Text style={styles.p}>This draft presents a strong thesis...</Text>
      </View>

      <View style={styles.warn}>
        <Text style={styles.warnTitle}>Highlight Issues</Text>
        <Switch value />
      </View>

      <View style={styles.btn}>
        <Text style={styles.btnText}>Resolve Review</Text>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  h1: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 12 },
  docCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  file: { fontWeight: '700', marginBottom: 10, color: colors.text },
  placeholder: { height: 220, borderRadius: 12, backgroundColor: colors.overlay },
  summary: {
    marginTop: 12,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  section: { fontSize: 14, fontWeight: '700', marginBottom: 6, color: colors.text },
  p: { color: colors.textSecondary, lineHeight: 20 },
  warn: {
    marginTop: 10,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  warnTitle: { fontWeight: '700', color: colors.text },
  btn: { marginTop: 12, backgroundColor: colors.primary, padding: 14, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});
