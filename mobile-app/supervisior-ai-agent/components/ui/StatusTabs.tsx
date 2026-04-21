import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useThemeColors } from "@/context/ThemeContext";

export type StatusFilter = "pending" | "all" | "completed" | "failed";

type StatusTabsProps = {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
};

const TABS: Array<{ label: string; value: StatusFilter }> = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
];

export function StatusTabs({ value, onChange }: StatusTabsProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.row}>
      {TABS.map((tab) => {
        const isActive = tab.value === value;

        return (
          <Pressable
            key={tab.value}
            onPress={() => onChange(tab.value)}
            style={[styles.tab, isActive && styles.activeTab]}
          >
            <ThemedText
              style={[styles.tabLabel, isActive && styles.activeLabel]}
            >
              {tab.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      alignItems: "center",
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
    },
    activeTab: {
      borderBottomColor: colors.primary,
    },
    tabLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    activeLabel: {
      color: colors.primary,
      fontWeight: "700",
    },
  });
