import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import QuickActionsList from '@/components/dashboard/QuickActionsList';
import ValidationStatsGrid from '@/components/dashboard/ValidationStatsGrid';
import { useThemeColors } from '@/context/ThemeContext';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <ScrollView
      style={styles.wrap}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 6 }]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.headerCard}>
        <Text style={styles.headerText}>Hey, Alex 👋</Text>
        <View style={styles.bellWrap}>
          <MaterialIcons name="notifications" size={18} color={colors.primary} />
          <View style={styles.bellDot} />
        </View>
      </View>

      <ValidationStatsGrid />

      <Text style={styles.section}>Quick Actions</Text>
      <QuickActionsList />

      <Text style={styles.section}>Recent Activity</Text>
      <View style={styles.activityTimeline}>
        <View style={styles.timelineLine} />
        <ActivityItem
          colors={colors}
          tone="success"
          icon="check"
          title="Project Alpha validation completed successfully."
          time="10 mins ago"
        />
        <ActivityItem
          colors={colors}
          tone="neutral"
          icon="north"
          title="New document uploaded to Q3 Marketing."
          time="2 hours ago"
        />
        <ActivityItem
          colors={colors}
          tone="danger"
          icon="priority-high"
          title="Validation failed for Invoice #4029. Missing signatures."
          time="5 hours ago"
        />
      </View>
    </ScrollView>
  );
}

function ActivityItem({
  colors,
  tone,
  icon,
  title,
  time,
}: {
  colors: ReturnType<typeof useThemeColors>;
  tone: 'success' | 'neutral' | 'danger';
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  time: string;
}) {
  const styles = createStyles(colors);
  const toneStyles =
    tone === 'success'
      ? { bg: colors.backgroundAlt, border: colors.success, icon: colors.success }
      : tone === 'danger'
        ? { bg: colors.backgroundAlt, border: colors.error, icon: colors.error }
        : { bg: colors.backgroundAlt, border: colors.border, icon: colors.textSecondary };

  return (
    <View style={styles.activityRow}>
      <View style={[styles.activityBullet, { borderColor: toneStyles.icon }]}>
        <MaterialIcons name={icon} size={12} color={toneStyles.icon} />
      </View>
      <View style={[styles.activityCard, { backgroundColor: toneStyles.bg, borderColor: toneStyles.border }]}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 10, paddingBottom: 20 },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'LexendBold',
  },
  bellWrap: { position: 'relative' },
  bellDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.error,
    position: 'absolute',
    top: -1,
    right: 0,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  section: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.4,
    fontFamily: 'LexendBold',
  },
  activityTimeline: {
    position: 'relative',
    paddingLeft: 0,
  },
  timelineLine: {
    position: 'absolute',
    left: 10.5,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colors.border,
  },
  activityRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  activityBullet: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 8,
  },
  activityCard: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 11,
    borderWidth: 1,
    minHeight: 66,
  },
  activityTitle: { fontSize: 11, lineHeight: 15, color: colors.text, fontWeight: '600' },
  activityTime: { fontSize: 10, color: colors.textTertiary, marginTop: 4 },
});
