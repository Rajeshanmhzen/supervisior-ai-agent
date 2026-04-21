/**
 * Comprehensive theme configuration for the application
 */

import { DarkTheme, DefaultTheme } from "@react-navigation/native";

export const Colors = {
  light: {
    // Primary (Lavender Identity)
    primary: "#8B7CF6",
    primaryLight: "#C4B5FD",
    primaryDark: "#6D5AE6",

    // Background & Surfaces
    background: "#F9F9FF",
    surface: "#FFFFFF",
    backgroundAlt: "#FFFFFF",
    border: "#E5E7EB",
    overlay: "rgba(15, 23, 42, 0.05)",

    // Typography
    text: "#1F2937",
    textSecondary: "#6B7280",
    textTertiary: "#9CA3AF",
    textOnPrimary: "#FFFFFF",

    // Accent (Single Choice)
    accent: "#60A5FA",

    // Semantic Colors
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",

    // UI States
    disabled: "#D1D5DB",
    focusRing: "#8B7CF6",

    // Tab/Tint (for compatibility)
    tint: "#8B7CF6",
    tabIconDefault: "#D1D5DB",
    tabIconSelected: "#8B7CF6",
  },
  dark: {
    // Primary (Adjusted Lavender)
    primary: "#A78BFA",
    primaryLight: "#C4B5FD",
    primaryDark: "#8B7CF6",

    // Background & Surfaces
    background: "#0F172A",
    surface: "#1E293B",
    surfaceElevated: "#273449",
    backgroundAlt: "#1E293B",
    border: "#334155",
    overlay: "rgba(0, 0, 0, 0.4)",

    // Typography
    text: "#F1F5F9",
    textSecondary: "#94A3B8",
    textTertiary: "#64748B",
    textOnPrimary: "#0F172A",

    // Accent (Same Strategy)
    accent: "#60A5FA",

    // Semantic Colors (Dark Adjusted)
    success: "#4ADE80",
    warning: "#FBBF24",
    error: "#F87171",
    info: "#60A5FA",

    // UI States
    disabled: "#475569",
    focusRing: "#A78BFA",

    // Tab/Tint (for compatibility)
    tint: "#A78BFA",
    tabIconDefault: "#64748B",
    tabIconSelected: "#A78BFA",
  },
} as const;

/**
 * Generate React Navigation theme from custom theme colors
 */
export function getNavigationTheme(mode: "light" | "dark") {
  const colors = Colors[mode];
  const baseTheme = mode === "light" ? DefaultTheme : DarkTheme;

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.backgroundAlt,
      text: colors.text,
      border: colors.border,
      notification: colors.error,
    },
  };
}

export const Typography = {
  heading1: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
    fontFamily: "LexendBold",
  },
  heading2: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 36,
    fontFamily: "LexendBold",
  },
  heading3: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
    fontFamily: "LexendSemiBold",
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    fontFamily: "Lexend",
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    fontFamily: "Lexend",
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    fontFamily: "Lexend",
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    fontFamily: "LexendSemiBold",
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  xl: 16,
  full: 9999,
} as const;

export const Shadows = {
  light: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  heavy: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

export type Theme = typeof Colors.light;
export type ColorName = keyof Theme;