import { useEffect, useState } from "react";
import { FiCheck, FiMonitor, FiMoon, FiSun } from "react-icons/fi";
import type { IconType } from "react-icons";
import { themeStorage, type ThemeMode } from "../../services/theme";
import { notifications } from "@mantine/notifications";

type ThemeOption = {
  mode: ThemeMode;
  title: string;
  description: string;
  icon: IconType;
};

const themeOptions: ThemeOption[] = [
  {
    mode: "dark",
    title: "Dark Mode",
    description: "Use a darker interface for lower-light work.",
    icon: FiMoon,
  },
  {
    mode: "light",
    title: "Light Mode",
    description: "Keep the dashboard bright and crisp.",
    icon: FiSun,
  },
  {
    mode: "system",
    title: "System Mode",
    description: "Follow your device appearance setting.",
    icon: FiMonitor,
  },
];

const PreferencesPage = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => themeStorage.getMode());

  useEffect(() => themeStorage.subscribe(() => setThemeMode(themeStorage.getMode())), []);

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    themeStorage.setMode(mode);
    const option = themeOptions.find((item) => item.mode === mode);
    notifications.show({
      title: "Preference updated",
      message: `${option?.title ?? "Theme"} has been applied.`,
      color: "blue",
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Preferences</h1>
          <p className="mt-2 text-sm text-slate-500">
            Choose how the dashboard should look on this device.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = themeMode === option.mode;

            return (
              <button
                type="button"
                key={option.mode}
                onClick={() => handleThemeChange(option.mode)}
                className={`min-h-33 cursor-pointer rounded-2xl border p-4 text-left transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/5 dark:bg-blue-950/30"
                    : "border-slate-200 bg-white hover:bg-slate-50 dark:bg-[#111827] dark:hover:bg-slate-800"
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <Icon className="text-xl" />
                    </div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      {option.title}
                    </h2>
                  </div>
                  <span
                    className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-slate-300 text-transparent dark:border-slate-600"
                    }`}
                    aria-hidden="true"
                  >
                    <FiCheck className="text-xs" />
                  </span>
                </div>
                <p className="mt-5 text-xs leading-5 text-slate-500">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;
